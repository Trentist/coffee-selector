#!/usr/bin/env node

/**
 * i18n System Validation Script
 * Tests the translation system for completeness and correctness
 */

const fs = require("fs");
const path = require("path");

// Configuration
const LOCALES_DIR = path.join(__dirname, "../public/locales");
const SUPPORTED_LOCALES = ["ar", "en"];
const NAMESPACE = "common";

console.log("🔍 Starting i18n System Validation...\n");

// Function to load translation file
function loadTranslations(locale) {
	const filePath = path.join(LOCALES_DIR, locale, `${NAMESPACE}.json`);
	try {
		const content = fs.readFileSync(filePath, "utf8");
		return JSON.parse(content);
	} catch (error) {
		console.error(`❌ Error loading ${locale} translations:`, error.message);
		return null;
	}
}

// Function to get all keys from translation object
function getAllKeys(obj, prefix = "") {
	let keys = [];
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			keys = keys.concat(getAllKeys(value, fullKey));
		} else {
			keys.push(fullKey);
		}
	}
	return keys;
}

// Load all translations
const translations = {};
let hasErrors = false;

console.log("📁 Loading translation files...");
for (const locale of SUPPORTED_LOCALES) {
	const trans = loadTranslations(locale);
	if (trans) {
		translations[locale] = trans;
		console.log(`✅ ${locale}: Loaded successfully`);
	} else {
		hasErrors = true;
	}
}

if (hasErrors) {
	console.log(
		"\n❌ Failed to load some translation files. Aborting validation.",
	);
	process.exit(1);
}

console.log("\n🔑 Analyzing translation keys...");

// Get all keys from each locale
const localeKeys = {};
for (const locale of SUPPORTED_LOCALES) {
	localeKeys[locale] = getAllKeys(translations[locale]);
	console.log(`📊 ${locale}: ${localeKeys[locale].length} keys found`);
}

// Find missing keys
console.log("\n🔍 Checking for missing keys...");
const [primaryLocale, secondaryLocale] = SUPPORTED_LOCALES;
const primaryKeys = localeKeys[primaryLocale];
const secondaryKeys = localeKeys[secondaryLocale];

const missingInSecondary = primaryKeys.filter(
	(key) => !secondaryKeys.includes(key),
);
const missingInPrimary = secondaryKeys.filter(
	(key) => !primaryKeys.includes(key),
);

if (missingInSecondary.length > 0) {
	console.log(
		`\n⚠️  Keys missing in ${secondaryLocale} (${missingInSecondary.length}):`,
	);
	missingInSecondary.slice(0, 10).forEach((key) => console.log(`   - ${key}`));
	if (missingInSecondary.length > 10) {
		console.log(`   ... and ${missingInSecondary.length - 10} more`);
	}
	hasErrors = true;
}

if (missingInPrimary.length > 0) {
	console.log(
		`\n⚠️  Keys missing in ${primaryLocale} (${missingInPrimary.length}):`,
	);
	missingInPrimary.slice(0, 10).forEach((key) => console.log(`   - ${key}`));
	if (missingInPrimary.length > 10) {
		console.log(`   ... and ${missingInPrimary.length - 10} more`);
	}
	hasErrors = true;
}

// Check for empty values
console.log("\n🔍 Checking for empty values...");
function findEmptyValues(obj, prefix = "", locale = "") {
	const empty = [];
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			empty.push(...findEmptyValues(value, fullKey, locale));
		} else if (typeof value === "string" && value.trim() === "") {
			empty.push(`${locale}:${fullKey}`);
		}
	}
	return empty;
}

for (const locale of SUPPORTED_LOCALES) {
	const emptyValues = findEmptyValues(translations[locale], "", locale);
	if (emptyValues.length > 0) {
		console.log(`\n⚠️  Empty values in ${locale} (${emptyValues.length}):`);
		emptyValues.slice(0, 5).forEach((key) => console.log(`   - ${key}`));
		if (emptyValues.length > 5) {
			console.log(`   ... and ${emptyValues.length - 5} more`);
		}
		hasErrors = true;
	}
}

// Test common translation keys
console.log("\n🧪 Testing common translation keys...");
const commonKeys = [
	"navigation.home",
	"footer.terms",
	"auth.login",
	"auth.email",
	"auth.password",
	"validation.email_required",
	"ui.loading",
	"ui.save",
	"errors.general",
];

function getNestedValue(obj, path) {
	return path.split(".").reduce((current, key) => current && current[key], obj);
}

for (const key of commonKeys) {
	let keyExists = true;
	for (const locale of SUPPORTED_LOCALES) {
		const value = getNestedValue(translations[locale], key);
		if (!value) {
			console.log(`❌ Missing key: ${locale}:${key}`);
			keyExists = false;
			hasErrors = true;
		}
	}
	if (keyExists) {
		console.log(`✅ ${key}: Present in all locales`);
	}
}

// Summary
console.log("\n📊 Validation Summary:");
console.log(`   Locales checked: ${SUPPORTED_LOCALES.join(", ")}`);
console.log(`   Total keys in ${primaryLocale}: ${primaryKeys.length}`);
console.log(`   Total keys in ${secondaryLocale}: ${secondaryKeys.length}`);
console.log(
	`   Missing keys: ${missingInSecondary.length + missingInPrimary.length}`,
);

if (hasErrors) {
	console.log("\n❌ i18n system has issues that need to be addressed.");
	process.exit(1);
} else {
	console.log(
		"\n✅ i18n system validation passed! All translations are properly configured.",
	);
	process.exit(0);
}
