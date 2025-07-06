#!/usr/bin/env node

/**
 * Comprehensive Translation Checker for Coffee Selection Project
 * فاحص شامل للترجمة لمشروع كوفي سيليكشن
 *
 * يفحص جميع النصوص الإنجليزية والعربية في المشروع
 * ويقارنها مع ملفات الترجمة الموجودة
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Configuration
const CONFIG = {
	// Source directories to scan
	sourceDirs: [
		"src/**/*.{tsx,ts,js,jsx}",
		"app/**/*.{tsx,ts,js,jsx}",
		"components/**/*.{tsx,ts,js,jsx}",
		"pages/**/*.{tsx,ts,js,jsx}",
		"hooks/**/*.{tsx,ts,js,jsx}",
		"utils/**/*.{tsx,ts,js,jsx}",
		"services/**/*.{tsx,ts,js,jsx}",
		"store/**/*.{tsx,ts,js,jsx}",
		"types/**/*.{tsx,ts,js,jsx}",
	],

	// Translation files
	translationFiles: [
		"messages/ar.ts",
		"messages/en.ts",
		"messages/ar/*.json",
		"messages/en/*.json",
		"public/locales/ar/*.json",
		"public/locales/en/*.json",
	],

	// Exclude patterns
	excludePatterns: [
		"**/node_modules/**",
		"**/dist/**",
		"**/build/**",
		"**/.next/**",
		"**/coverage/**",
		"**/*.test.{tsx,ts,js,jsx}",
		"**/*.spec.{tsx,ts,js,jsx}",
		"**/__tests__/**",
		"**/test-reports/**",
		"**/temp_fix/**",
		"**/scripts/**",
		"**/docs/**",
	],

	// Text patterns to find
	textPatterns: [
		// JSX text content
		/>([^<>{}\n]+[A-Z][a-z]+[^<>{}\n]*)</g,
		// String literals with English text
		/['"`]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)['"`]/g,
		// Template literals
		/`([^`]+[A-Z][a-z]+[^`]*)`/g,
		// Object properties with English values
		/(\w+):\s*['"`]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)['"`]/g,
		// Array items with English text
		/['"`]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)['"`],?/g,
	],

	// Arabic text patterns
	arabicPatterns: [
		// Arabic text in JSX
		/>([^<>{}\n]*[\u0600-\u06FF]+[^<>{}\n]*)</g,
		// Arabic text in strings
		/['"`]([^'"`]*[\u0600-\u06FF]+[^'"`]*)['"`]/g,
		// Arabic text in comments
		/\/\*([^*]*[\u0600-\u06FF]+[^*]*)\*\//g,
		/\/\/([^\n]*[\u0600-\u06FF]+[^\n]*)/g,
	],

	// Priority levels
	priorities: {
		HIGH: [
			"button",
			"label",
			"title",
			"error",
			"success",
			"loading",
			"submit",
			"cancel",
			"save",
			"delete",
			"edit",
			"add",
			"remove",
			"view",
			"close",
			"open",
			"next",
			"previous",
			"back",
			"continue",
			"confirm",
			"dismiss",
			"retry",
			"try_again",
			"got_it",
		],
		MEDIUM: [
			"product",
			"category",
			"order",
			"cart",
			"wishlist",
			"favorite",
			"share",
			"review",
			"rating",
			"comment",
			"description",
			"details",
			"specifications",
			"features",
			"price",
			"quantity",
			"total",
			"subtotal",
			"shipping",
			"tax",
			"discount",
			"coupon",
			"payment",
			"billing",
			"invoice",
			"receipt",
			"tracking",
			"delivery",
			"address",
			"phone",
			"email",
			"name",
			"password",
			"login",
			"register",
			"logout",
			"profile",
			"settings",
			"preferences",
			"notifications",
			"privacy",
			"security",
			"account",
			"dashboard",
			"home",
			"search",
			"filter",
			"sort",
			"refresh",
			"update",
			"processing",
			"saving",
			"updating",
		],
		LOW: [
			"alpha",
			"vantage",
			"fallback",
			"rates",
			"cached",
			"data",
			"fixed",
			"build",
			"analysis",
			"tree",
			"shaking",
			"code",
			"splitting",
			"lazy",
			"loading",
			"webpack",
			"bundle",
			"chunk",
			"module",
			"import",
			"export",
			"default",
			"async",
			"await",
			"promise",
			"resolve",
			"reject",
			"catch",
			"throw",
			"error",
			"exception",
			"stack",
			"trace",
			"debug",
			"log",
			"console",
			"window",
			"document",
			"navigator",
			"location",
			"history",
			"localStorage",
			"sessionStorage",
			"cookie",
			"cookies",
			"fetch",
			"api",
			"rest",
			"graphql",
			"query",
			"mutation",
			"subscription",
			"resolver",
			"schema",
			"type",
			"interface",
			"enum",
			"union",
			"input",
			"scalar",
			"directive",
			"fragment",
			"variable",
			"argument",
			"field",
			"alias",
			"fragment",
			"inline",
			"named",
			"spread",
			"skip",
			"include",
			"deprecated",
			"experimental",
			"beta",
			"alpha",
			"preview",
			"release",
			"version",
			"changelog",
			"migration",
			"breaking",
			"change",
			"deprecation",
			"removal",
			"addition",
			"modification",
			"enhancement",
			"improvement",
			"optimization",
			"performance",
			"memory",
			"cpu",
			"gpu",
			"network",
			"bandwidth",
			"latency",
			"throughput",
			"concurrency",
			"parallel",
			"serial",
			"synchronous",
			"asynchronous",
			"blocking",
			"non-blocking",
			"event",
			"loop",
			"callback",
			"handler",
			"listener",
			"emitter",
			"observer",
			"subject",
			"publisher",
			"subscriber",
			"mediator",
			"facade",
			"proxy",
			"decorator",
			"adapter",
			"bridge",
			"composite",
			"flyweight",
			"memento",
			"state",
			"strategy",
			"template",
			"visitor",
			"command",
			"chain",
			"interpreter",
			"iterator",
			"null",
			"object",
			"undefined",
			"boolean",
			"number",
			"string",
			"symbol",
			"bigint",
			"function",
			"array",
			"object",
			"map",
			"set",
			"weakmap",
			"weakset",
			"promise",
			"generator",
			"async",
			"await",
			"yield",
			"return",
			"break",
			"continue",
			"throw",
			"try",
			"catch",
			"finally",
			"if",
			"else",
			"switch",
			"case",
			"default",
			"for",
			"while",
			"do",
			"in",
			"of",
			"with",
			"delete",
			"new",
			"typeof",
			"instanceof",
			"void",
			"this",
			"super",
			"class",
			"extends",
			"constructor",
			"static",
			"get",
			"set",
			"import",
			"export",
			"from",
			"as",
			"default",
			"namespace",
			"module",
			"require",
			"define",
			"amd",
			"umd",
			"commonjs",
			"es6",
			"es2015",
			"es2016",
			"es2017",
			"es2018",
			"es2019",
			"es2020",
			"es2021",
			"es2022",
			"esnext",
			"typescript",
			"javascript",
			"jsx",
			"tsx",
			"ts",
			"js",
			"mjs",
			"cjs",
			"json",
			"xml",
			"html",
			"css",
			"scss",
			"sass",
			"less",
			"stylus",
			"yaml",
			"toml",
			"ini",
			"env",
			"config",
			"rc",
			"lock",
			"package",
			"bower",
			"composer",
			"gradle",
			"maven",
			"ant",
			"make",
			"cmake",
			"ninja",
			"bazel",
			"buck",
			"pants",
			"scons",
			"waf",
			"autotools",
			"meson",
			"xmake",
			"vcpkg",
			"conan",
			"hunter",
			"vcpkg",
			"conan",
			"hunter",
			"vcpkg",
			"conan",
			"hunter",
		],
	},
};

// Results storage
const results = {
	englishTexts: [],
	arabicTexts: [],
	translationKeys: new Set(),
	missingTranslations: [],
	unusedTranslations: [],
	priorityIssues: {
		high: [],
		medium: [],
		low: [],
	},
	fileStats: {
		totalFiles: 0,
		filesWithEnglishText: 0,
		filesWithArabicText: 0,
		filesWithTranslationIssues: 0,
	},
};

// Helper functions
function isExcluded(filePath) {
	return CONFIG.excludePatterns.some((pattern) => {
		const regex = new RegExp(
			pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*"),
		);
		return regex.test(filePath);
	});
}

function getPriority(text) {
	const lowerText = text.toLowerCase();

	for (const priority of CONFIG.priorities.HIGH) {
		if (lowerText.includes(priority.toLowerCase())) {
			return "HIGH";
		}
	}

	for (const priority of CONFIG.priorities.MEDIUM) {
		if (lowerText.includes(priority.toLowerCase())) {
			return "MEDIUM";
		}
	}

	for (const priority of CONFIG.priorities.LOW) {
		if (lowerText.includes(priority.toLowerCase())) {
			return "LOW";
		}
	}

	return "LOW";
}

function extractTranslationKeys(content) {
	const keyPatterns = [
		/t\(['"`]([^'"`]+)['"`]/g,
		/useTranslations\(['"`]([^'"`]+)['"`]/g,
		/getTranslations\(['"`]([^'"`]+)['"`]/g,
	];

	const keys = new Set();

	keyPatterns.forEach((pattern) => {
		let match;
		while ((match = pattern.exec(content)) !== null) {
			keys.add(match[1]);
		}
	});

	return keys;
}

function loadTranslationFiles() {
	const translationData = {};

	CONFIG.translationFiles.forEach((pattern) => {
		const files = glob.sync(pattern, { ignore: CONFIG.excludePatterns });

		files.forEach((file) => {
			try {
				const content = fs.readFileSync(file, "utf8");
				const ext = path.extname(file);

				if (ext === ".json") {
					translationData[file] = JSON.parse(content);
				} else if (ext === ".ts") {
					// Extract export statements
					const exportMatches = content.match(
						/export\s+const\s+(\w+)\s*=\s*{([^}]+)}/g,
					);
					if (exportMatches) {
						translationData[file] = {};
						exportMatches.forEach((match) => {
							const nameMatch = match.match(/export\s+const\s+(\w+)/);
							if (nameMatch) {
								translationData[file][nameMatch[1]] = match;
							}
						});
					}
				}
			} catch (error) {
				console.warn(
					`Warning: Could not parse translation file ${file}:`,
					error.message,
				);
			}
		});
	});

	return translationData;
}

function scanFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf8");
		const relativePath = path.relative(process.cwd(), filePath);

		// Extract translation keys
		const fileKeys = extractTranslationKeys(content);
		fileKeys.forEach((key) => results.translationKeys.add(key));

		let hasEnglishText = false;
		let hasArabicText = false;

		// Scan for English text
		CONFIG.textPatterns.forEach((pattern) => {
			let match;
			while ((match = pattern.exec(content)) !== null) {
				const text = match[1] || match[2];
				if (
					text &&
					text.length > 2 &&
					/[A-Z]/.test(text) &&
					/[a-z]/.test(text)
				) {
					// Filter out common false positives
					if (
						!/^(import|export|const|let|var|function|class|interface|type|enum|namespace|module|require|from|as|default|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|readonly|abstract|async|await|yield|of|in|typeof|instanceof|void|delete|get|set)$/.test(
							text,
						)
					) {
						const priority = getPriority(text);
						const issue = {
							text,
							file: relativePath,
							line: content.substring(0, match.index).split("\n").length,
							priority,
							context: content.substring(
								Math.max(0, match.index - 50),
								match.index + 50,
							),
						};

						results.englishTexts.push(issue);
						results.priorityIssues[priority.toLowerCase()].push(issue);
						hasEnglishText = true;
					}
				}
			}
		});

		// Scan for Arabic text
		CONFIG.arabicPatterns.forEach((pattern) => {
			let match;
			while ((match = pattern.exec(content)) !== null) {
				const text = match[1];
				if (text && text.length > 2 && /[\u0600-\u06FF]/.test(text)) {
					// Filter out comments
					if (!text.trim().startsWith("//") && !text.trim().startsWith("/*")) {
						const issue = {
							text: text.trim(),
							file: relativePath,
							line: content.substring(0, match.index).split("\n").length,
							context: content.substring(
								Math.max(0, match.index - 50),
								match.index + 50,
							),
						};

						results.arabicTexts.push(issue);
						hasArabicText = true;
					}
				}
			}
		});

		// Update file stats
		results.fileStats.totalFiles++;
		if (hasEnglishText) results.fileStats.filesWithEnglishText++;
		if (hasArabicText) results.fileStats.filesWithArabicText++;
		if (hasEnglishText || hasArabicText)
			results.fileStats.filesWithTranslationIssues++;
	} catch (error) {
		console.warn(`Warning: Could not read file ${filePath}:`, error.message);
	}
}

function generateReport() {
	const report = {
		summary: {
			totalFiles: results.fileStats.totalFiles,
			filesWithEnglishText: results.fileStats.filesWithEnglishText,
			filesWithArabicText: results.fileStats.filesWithArabicText,
			filesWithTranslationIssues: results.fileStats.filesWithTranslationIssues,
			totalEnglishTexts: results.englishTexts.length,
			totalArabicTexts: results.arabicTexts.length,
			translationKeysFound: results.translationKeys.size,
			highPriorityIssues: results.priorityIssues.high.length,
			mediumPriorityIssues: results.priorityIssues.medium.length,
			lowPriorityIssues: results.priorityIssues.low.length,
		},
		highPriorityIssues: results.priorityIssues.high,
		mediumPriorityIssues: results.priorityIssues.medium,
		lowPriorityIssues: results.priorityIssues.low,
		arabicTexts: results.arabicTexts,
		translationKeys: Array.from(results.translationKeys),
		recommendations: [],
	};

	// Generate recommendations
	if (results.priorityIssues.high.length > 0) {
		report.recommendations.push({
			priority: "HIGH",
			message: `معالجة عاجلة مطلوبة: ${results.priorityIssues.high.length} نص عالي الأولوية`,
			action: "يجب نقل هذه النصوص إلى ملفات الترجمة فوراً",
		});
	}

	if (results.priorityIssues.medium.length > 0) {
		report.recommendations.push({
			priority: "MEDIUM",
			message: `معالجة متوسطة: ${results.priorityIssues.medium.length} نص متوسط الأولوية`,
			action: "يجب نقل هذه النصوص إلى ملفات الترجمة في المرحلة التالية",
		});
	}

	if (results.arabicTexts.length > 0) {
		report.recommendations.push({
			priority: "MEDIUM",
			message: `نصوص عربية في الكود: ${results.arabicTexts.length} نص`,
			action: "يجب نقل النصوص العربية من التعليقات إلى ملفات الترجمة",
		});
	}

	return report;
}

function printReport(report) {
	console.log("\n" + "=".repeat(80));
	console.log("🔍 تقرير فحص الترجمة الشامل - مشروع كوفي سيليكشن");
	console.log("=".repeat(80));

	console.log("\n📊 ملخص النتائج:");
	console.log(`   إجمالي الملفات المفحوصة: ${report.summary.totalFiles}`);
	console.log(
		`   الملفات التي تحتوي على نصوص إنجليزية: ${report.summary.filesWithEnglishText}`,
	);
	console.log(
		`   الملفات التي تحتوي على نصوص عربية: ${report.summary.filesWithArabicText}`,
	);
	console.log(
		`   إجمالي النصوص الإنجليزية: ${report.summary.totalEnglishTexts}`,
	);
	console.log(`   إجمالي النصوص العربية: ${report.summary.totalArabicTexts}`);
	console.log(
		`   مفاتيح الترجمة الموجودة: ${report.summary.translationKeysFound}`,
	);

	console.log("\n🚨 قضايا الأولوية:");
	console.log(`   عالية الأولوية: ${report.summary.highPriorityIssues}`);
	console.log(`   متوسطة الأولوية: ${report.summary.mediumPriorityIssues}`);
	console.log(`   منخفضة الأولوية: ${report.summary.lowPriorityIssues}`);

	if (report.highPriorityIssues.length > 0) {
		console.log("\n🚨 النصوص عالية الأولوية (يجب معالجتها فوراً):");
		report.highPriorityIssues.slice(0, 10).forEach((issue, index) => {
			console.log(
				`   ${index + 1}. "${issue.text}" - في ${issue.file}:${issue.line}`,
			);
		});
		if (report.highPriorityIssues.length > 10) {
			console.log(`   ... و ${report.highPriorityIssues.length - 10} نص آخر`);
		}
	}

	if (report.mediumPriorityIssues.length > 0) {
		console.log("\n⚠️ النصوص متوسطة الأولوية:");
		report.mediumPriorityIssues.slice(0, 5).forEach((issue, index) => {
			console.log(
				`   ${index + 1}. "${issue.text}" - في ${issue.file}:${issue.line}`,
			);
		});
		if (report.mediumPriorityIssues.length > 5) {
			console.log(`   ... و ${report.mediumPriorityIssues.length - 5} نص آخر`);
		}
	}

	if (report.arabicTexts.length > 0) {
		console.log("\n📝 النصوص العربية المكتشفة:");
		report.arabicTexts.slice(0, 5).forEach((issue, index) => {
			console.log(
				`   ${index + 1}. "${issue.text}" - في ${issue.file}:${issue.line}`,
			);
		});
		if (report.arabicTexts.length > 5) {
			console.log(`   ... و ${report.arabicTexts.length - 5} نص آخر`);
		}
	}

	console.log("\n💡 التوصيات:");
	report.recommendations.forEach((rec, index) => {
		console.log(`   ${index + 1}. ${rec.message}`);
		console.log(`      الإجراء: ${rec.action}`);
	});

	console.log("\n" + "=".repeat(80));
}

// Main execution
function main() {
	console.log("🔍 بدء فحص الترجمة الشامل...");

	// Load translation files
	console.log("📂 تحميل ملفات الترجمة...");
	const translationData = loadTranslationFiles();

	// Scan source files
	console.log("🔍 فحص ملفات المصدر...");
	CONFIG.sourceDirs.forEach((pattern) => {
		const files = glob.sync(pattern, { ignore: CONFIG.excludePatterns });
		files.forEach((file) => {
			if (!isExcluded(file)) {
				scanFile(file);
			}
		});
	});

	// Generate and print report
	console.log("📊 إنشاء التقرير...");
	const report = generateReport();
	printReport(report);

	// Save detailed report to file
	const reportFile = "translation-check-report.json";
	fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), "utf8");
	console.log(`\n💾 تم حفظ التقرير التفصيلي في: ${reportFile}`);

	// Exit with error code if there are high priority issues
	if (report.summary.highPriorityIssues > 0) {
		console.log("\n❌ تم العثور على قضايا عالية الأولوية - يرجى معالجتها");
		process.exit(1);
	} else {
		console.log("\n✅ لا توجد قضايا عالية الأولوية");
		process.exit(0);
	}
}

// Run the script
if (require.main === module) {
	main();
}

module.exports = {
	scanFile,
	generateReport,
	printReport,
	CONFIG,
};
