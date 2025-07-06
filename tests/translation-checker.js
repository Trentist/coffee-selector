#!/usr/bin/env node

/**
 * Translation Checker Script
 * سكريبت فحص النصوص غير المترجمة
 *
 * يبحث عن النصوص المباشرة في المكونات ويقارنها مع ملفات الترجمة
 */

const fs = require("fs");
const path = require("path");

// Configuration
const CONFIG = {
	// Directories to scan
	sourceDirs: [
		"src/components/**/*.{tsx,ts}",
		"src/pages/**/*.{tsx,ts}",
		"src/app/**/*.{tsx,ts}",
		"src/hooks/**/*.{tsx,ts}",
		"src/utils/**/*.{tsx,ts}",
		"src/services/**/*.{tsx,ts}",
	],

	// Translation files
	translationFiles: [
		"messages/ar.ts",
		"messages/en.ts",
		"messages/ar/*.json",
		"messages/en/*.json",
	],

	// Patterns to look for hardcoded text
	textPatterns: [
		// JSX text content
		/<[^>]*>([^<>{}\n]+[A-Z][a-z]+[^<>{}\n]*)<\/[^>]*>/g,
		// String literals that look like UI text
		/['"`]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)['"`]/g,
		// Template literals with text
		/`([^`]+[A-Z][a-z]+[^`]+)`/g,
		// JSX attributes with text
		/(?:title|label|placeholder|alt|aria-label)=['"`]([^'"`]+)['"`]/g,
		// Common UI text patterns
		/(?:children|text|content)\s*[:=]\s*['"`]([^'"`]+)['"`]/g,
	],

	// Exclude patterns (common false positives)
	excludePatterns: [
		/^(?:className|id|key|ref|style|onClick|onChange|onSubmit|type|name|value|href|src)$/,
		/^(?:true|false|null|undefined)$/,
		/^[0-9]+$/,
		/^[a-z_]+$/,
		/^[A-Z_]+$/,
		/^[a-z]+\.[a-z_]+$/,
		/^[A-Z][a-z]+\.[A-Z][a-z_]+$/,
		/^(?:t|useTranslation|getTranslations)$/,
		/^(?:import|export|const|let|var|function|return|if|else|for|while|switch|case|default)$/,
		/^(?:React|useState|useEffect|useCallback|useMemo|useRef|useContext)$/,
		/^(?:Box|Text|Button|Input|Form|Container|VStack|HStack|Flex|Grid|Image|Icon)$/,
		/^(?:chakra|@chakra-ui|next|react|typescript|javascript)$/,
	],
};

// Load all translation keys
function loadTranslationKeys() {
	const keys = new Set();

	// Load from TypeScript files
	["messages/ar.ts", "messages/en.ts"].forEach((file) => {
		if (fs.existsSync(file)) {
			try {
				const content = fs.readFileSync(file, "utf8");
				const keyMatches = content.match(/['"`]([a-z_][a-z0-9_.]*)['"`]/g);
				if (keyMatches) {
					keyMatches.forEach((match) => {
						const key = match.slice(1, -1);
						if (key.includes(".") || key.includes("_")) {
							keys.add(key);
						}
					});
				}
			} catch (error) {
				console.warn(`Error reading translation file ${file}:`, error.message);
			}
		}
	});

	// Load from JSON files
	["messages/ar", "messages/en"].forEach((dir) => {
		if (fs.existsSync(dir)) {
			const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
			files.forEach((file) => {
				try {
					const content = JSON.parse(
						fs.readFileSync(path.join(dir, file), "utf8"),
					);
					extractKeysFromObject(content, "", keys);
				} catch (error) {
					console.warn(`Error reading JSON file ${file}:`, error.message);
				}
			});
		}
	});

	return keys;
}

// Extract keys from nested objects
function extractKeysFromObject(obj, prefix, keys) {
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;

		if (typeof value === "object" && value !== null) {
			extractKeysFromObject(value, fullKey, keys);
		} else if (typeof value === "string") {
			keys.add(fullKey);
		}
	}
}

// Check if text looks like a translation key
function isTranslationKey(text) {
	// Check if it matches translation key patterns
	if (/^[a-z_][a-z0-9_.]*$/.test(text)) {
		return true;
	}

	// Check if it contains dots (namespace.key format)
	if (text.includes(".")) {
		return true;
	}

	return false;
}

// Check if text should be excluded
function shouldExclude(text) {
	return CONFIG.excludePatterns.some((pattern) => pattern.test(text));
}

// Find all TypeScript/TSX files recursively
function findFiles(dir, extensions = [".tsx", ".ts"]) {
	const files = [];

	function scan(currentDir) {
		if (!fs.existsSync(currentDir)) return;

		const items = fs.readdirSync(currentDir);

		items.forEach((item) => {
			const fullPath = path.join(currentDir, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				scan(fullPath);
			} else if (extensions.some((ext) => item.endsWith(ext))) {
				files.push(fullPath);
			}
		});
	}

	scan(dir);
	return files;
}

// Extract potential hardcoded text from file
function extractHardcodedText(filePath) {
	const content = fs.readFileSync(filePath, "utf8");
	const hardcodedTexts = new Set();

	// Pattern 1: JSX text content
	const jsxPattern = /<[^>]*>([^<>{}\n]+[A-Z][a-z]+[^<>{}\n]*)<\/[^>]*>/g;
	let match;
	while ((match = jsxPattern.exec(content)) !== null) {
		const text = match[1]?.trim();
		if (text && text.length > 2 && !shouldExclude(text)) {
			if (/[A-Z][a-z]/.test(text) && text.includes(" ")) {
				hardcodedTexts.add(text);
			}
		}
	}

	// Pattern 2: String literals that look like UI text
	const stringPattern = /['"`]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)['"`]/g;
	while ((match = stringPattern.exec(content)) !== null) {
		const text = match[1]?.trim();
		if (text && text.length > 2 && !shouldExclude(text)) {
			if (/[A-Z][a-z]/.test(text) && text.includes(" ")) {
				hardcodedTexts.add(text);
			}
		}
	}

	// Pattern 3: JSX attributes with text
	const attrPattern =
		/(?:title|label|placeholder|alt|aria-label)=['"`]([^'"`]+)['"`]/g;
	while ((match = attrPattern.exec(content)) !== null) {
		const text = match[1]?.trim();
		if (text && text.length > 2 && !shouldExclude(text)) {
			if (/[A-Z][a-z]/.test(text)) {
				hardcodedTexts.add(text);
			}
		}
	}

	return Array.from(hardcodedTexts);
}

// Main function
function main() {
	console.log("🔍 Starting translation checker...\n");

	// Load translation keys
	console.log("📚 Loading translation keys...");
	const translationKeys = loadTranslationKeys();
	console.log(`✅ Loaded ${translationKeys.size} translation keys\n`);

	// Scan source files
	console.log("🔍 Scanning source files...");
	const issues = [];

	// Find all TypeScript/TSX files
	const sourceFiles = findFiles("src");
	console.log(`📁 Found ${sourceFiles.length} source files to scan\n`);

	sourceFiles.forEach((file) => {
		try {
			const hardcodedTexts = extractHardcodedText(file);

			hardcodedTexts.forEach((text) => {
				// Check if this text might need translation
				if (!isTranslationKey(text) && !translationKeys.has(text)) {
					issues.push({
						file: path.relative(".", file),
						text,
						line: findLineNumber(file, text),
					});
				}
			});
		} catch (error) {
			console.warn(`Error processing file ${file}:`, error.message);
		}
	});

	// Report results
	console.log("📊 Analysis Results:\n");

	if (issues.length === 0) {
		console.log("✅ No hardcoded text issues found!");
	} else {
		console.log(
			`⚠️  Found ${issues.length} potential hardcoded text issues:\n`,
		);

		// Group by file
		const groupedIssues = issues.reduce((acc, issue) => {
			if (!acc[issue.file]) {
				acc[issue.file] = [];
			}
			acc[issue.file].push(issue);
			return acc;
		}, {});

		Object.entries(groupedIssues).forEach(([file, fileIssues]) => {
			console.log(`📁 ${file}:`);
			fileIssues.forEach((issue) => {
				console.log(`   Line ${issue.line}: "${issue.text}"`);
			});
			console.log("");
		});

		// Generate summary
		console.log("📋 Summary:");
		console.log(
			`- Total files with issues: ${Object.keys(groupedIssues).length}`,
		);
		console.log(`- Total hardcoded texts: ${issues.length}`);
		console.log("\n💡 Recommendations:");
		console.log("- Replace hardcoded text with translation keys");
		console.log("- Use the translation hook: const t = useTranslations()");
		console.log("- Add missing translations to message files");
	}
}

// Helper function to find line number
function findLineNumber(filePath, text) {
	try {
		const content = fs.readFileSync(filePath, "utf8");
		const lines = content.split("\n");

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes(text)) {
				return i + 1;
			}
		}
	} catch (error) {
		// Ignore errors
	}

	return "unknown";
}

// Run the script
if (require.main === module) {
	main();
}

module.exports = {
	loadTranslationKeys,
	extractHardcodedText,
	isTranslationKey,
	shouldExclude,
};
