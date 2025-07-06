/**
 * Odoo Testing Helpers
 * مساعدات اختبار Odoo
 */

import {
	COFFEE_SELECTION_CONFIG,
	unifiedOdooService,
} from "@/odoo-schema-full";

export interface TestOdooConnection {
	isConnected: boolean;
	database: string;
	version?: string;
	error?: string;
}

export interface TestDataValidation {
	isValid: boolean;
	schema: string;
	errors: string[];
	warnings: string[];
}

/**
 * Test Odoo connection and validate configuration
 */
export async function testOdooConnection(): Promise<TestOdooConnection> {
	try {
		console.log("🔍 Testing Odoo connection...");

		const status = await unifiedOdooService.checkConnection();

		if (status.isConnected) {
			console.log("✅ Odoo connection successful");
			return {
				isConnected: true,
				database: status.database || COFFEE_SELECTION_CONFIG.ODOO.DATABASE,
				version: status.version,
			};
		} else {
			console.log("❌ Odoo connection failed:", status.error);
			return {
				isConnected: false,
				database: COFFEE_SELECTION_CONFIG.ODOO.DATABASE,
				error: status.error,
			};
		}
	} catch (error) {
		console.error("💥 Odoo connection test error:", error);
		return {
			isConnected: false,
			database: COFFEE_SELECTION_CONFIG.ODOO.DATABASE,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Fetch real products data from Odoo for testing
 */
export async function fetchRealProductsData() {
	try {
		console.log("📦 Fetching real products data from Odoo...");

		const result = await unifiedOdooService.getProducts();

		if (result.success && result.data) {
			console.log(`✅ Fetched ${result.data.length} products from Odoo`);
			return {
				success: true,
				data: result.data,
				count: result.data.length,
			};
		} else {
			console.log("❌ Failed to fetch products:", result.error);
			return {
				success: false,
				error: result.error,
				data: [],
			};
		}
	} catch (error) {
		console.error("💥 Products fetch error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			data: [],
		};
	}
}

/**
 * Fetch real categories data from Odoo for testing
 */
export async function fetchRealCategoriesData() {
	try {
		console.log("📂 Fetching real categories data from Odoo...");

		const result = await unifiedOdooService.getCategories();

		if (result.success && result.data) {
			console.log(`✅ Fetched ${result.data.length} categories from Odoo`);
			return {
				success: true,
				data: result.data,
				count: result.data.length,
			};
		} else {
			console.log("❌ Failed to fetch categories:", result.error);
			return {
				success: false,
				error: result.error,
				data: [],
			};
		}
	} catch (error) {
		console.error("💥 Categories fetch error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			data: [],
		};
	}
}

/**
 * Test user authentication with real Odoo data
 */
export async function testRealUserAuth(email: string, password: string) {
	try {
		console.log("🔐 Testing real user authentication...");

		const result = await unifiedOdooService.loginUser(email, password);

		if (result.success && result.user) {
			console.log("✅ User authentication successful");
			return {
				success: true,
				user: result.user,
				message: "Authentication successful",
			};
		} else {
			console.log("❌ User authentication failed:", result.error);
			return {
				success: false,
				error: result.error,
				message: "Authentication failed",
			};
		}
	} catch (error) {
		console.error("💥 Authentication test error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			message: "Authentication test failed",
		};
	}
}

/**
 * Validate data structure against expected schema
 */
export function validateDataStructure(
	data: any,
	expectedFields: string[],
): TestDataValidation {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (!data) {
		errors.push("Data is null or undefined");
		return {
			isValid: false,
			schema: "unknown",
			errors,
			warnings,
		};
	}

	// Check if data is array
	const dataArray = Array.isArray(data) ? data : [data];

	if (dataArray.length === 0) {
		warnings.push("Data array is empty");
	}

	// Validate each item in the array
	dataArray.forEach((item, index) => {
		expectedFields.forEach((field) => {
			if (!(field in item)) {
				errors.push(`Missing field '${field}' in item ${index}`);
			} else if (item[field] === null || item[field] === undefined) {
				warnings.push(`Field '${field}' is null/undefined in item ${index}`);
			}
		});
	});

	return {
		isValid: errors.length === 0,
		schema: `Array of ${dataArray.length} items`,
		errors,
		warnings,
	};
}

/**
 * Generate test report for Odoo data
 */
export function generateOdooTestReport(testResults: any[]) {
	const report = {
		timestamp: new Date().toISOString(),
		totalTests: testResults.length,
		passed: testResults.filter((r) => r.success).length,
		failed: testResults.filter((r) => !r.success).length,
		details: testResults,
		summary: {
			successRate: 0,
			avgResponseTime: 0,
			dataQuality: "unknown",
		},
	};

	report.summary.successRate = (report.passed / report.totalTests) * 100;

	// Calculate average response time if available
	const responseTimes = testResults
		.filter((r) => r.responseTime)
		.map((r) => r.responseTime);

	if (responseTimes.length > 0) {
		report.summary.avgResponseTime =
			responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
	}

	// Determine data quality
	if (report.summary.successRate >= 95) {
		report.summary.dataQuality = "excellent";
	} else if (report.summary.successRate >= 80) {
		report.summary.dataQuality = "good";
	} else if (report.summary.successRate >= 60) {
		report.summary.dataQuality = "fair";
	} else {
		report.summary.dataQuality = "poor";
	}

	return report;
}

/**
 * Wait for a specified amount of time (for testing delays)
 */
export function waitFor(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	baseDelay: number = 1000,
): Promise<T> {
	let lastError: Error;

	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error("Unknown error");

			if (i < maxRetries - 1) {
				const delay = baseDelay * Math.pow(2, i);
				console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
				await waitFor(delay);
			}
		}
	}

	throw lastError!;
}
