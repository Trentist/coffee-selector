/**
 * Main Test Runner - مشغل الاختبار الرئيسي
 * Central test runner for all system tests
 */

import { COFFEE_SELECTION_CONFIG } from "../../src/odoo-schema-full";
import { OdooConnectionTestRunner } from "./odoo-connection-test";
import { RedisSyncTester } from "./redis-sync-test";
import { ContinuousIntegrationTester } from "./continuous-integration-test";

// ============================================================================
// MAIN TEST RUNNER CONFIGURATION - إعدادات مشغل الاختبار الرئيسي
// ============================================================================

const MAIN_TEST_CONFIG = {
	PARALLEL_TESTS: false, // Run tests sequentially for better logging
	STOP_ON_FAILURE: false, // Continue running tests even if one fails
	GENERATE_REPORT: true, // Generate comprehensive test report
	SAVE_RESULTS: true, // Save test results to file
	NOTIFY_ON_COMPLETION: true, // Show completion notification
};

// ============================================================================
// TEST RESULT INTERFACES - واجهات نتائج الاختبار
// ============================================================================

interface TestSuiteResult {
	name: string;
	success: boolean;
	duration: number;
	startTime: Date;
	endTime: Date;
	summary: string;
	details?: any;
	error?: string;
}

interface MainTestResult {
	overall: {
		success: boolean;
		duration: number;
		startTime: Date;
		endTime: Date;
		totalTests: number;
		passedTests: number;
		failedTests: number;
		successRate: number;
	};
	suites: TestSuiteResult[];
	recommendations: string[];
	alerts: string[];
}

// ============================================================================
// MAIN TEST RUNNER - مشغل الاختبار الرئيسي
// ============================================================================

class MainTestRunner {
	private results: TestSuiteResult[] = [];
	private startTime: Date = new Date();

	/**
	 * Run all test suites
	 */
	async runAllTests(): Promise<MainTestResult> {
		console.log("🚀 Starting Main Test Runner...");
		console.log("=".repeat(80));
		console.log("📋 Test Configuration:");
		console.log(
			`   Parallel Tests: ${MAIN_TEST_CONFIG.PARALLEL_TESTS ? "✅" : "❌"}`,
		);
		console.log(
			`   Stop on Failure: ${MAIN_TEST_CONFIG.STOP_ON_FAILURE ? "✅" : "❌"}`,
		);
		console.log(
			`   Generate Report: ${MAIN_TEST_CONFIG.GENERATE_REPORT ? "✅" : "❌"}`,
		);
		console.log(
			`   Save Results: ${MAIN_TEST_CONFIG.SAVE_RESULTS ? "✅" : "❌"}`,
		);
		console.log("=".repeat(80));

		try {
			// Test Suite 1: Odoo Connection Tests
			console.log("\n1️⃣ Running Odoo Connection Tests...");
			const odooResult = await this.runOdooConnectionTests();
			this.results.push(odooResult);

			if (MAIN_TEST_CONFIG.STOP_ON_FAILURE && !odooResult.success) {
				console.log("❌ Stopping tests due to Odoo connection failure");
				return this.generateFinalResult();
			}

			// Test Suite 2: Redis Sync Tests
			console.log("\n2️⃣ Running Redis Sync Tests...");
			const redisResult = await this.runRedisSyncTests();
			this.results.push(redisResult);

			if (MAIN_TEST_CONFIG.STOP_ON_FAILURE && !redisResult.success) {
				console.log("❌ Stopping tests due to Redis sync failure");
				return this.generateFinalResult();
			}

			// Test Suite 3: Continuous Integration Tests
			console.log("\n3️⃣ Running Continuous Integration Tests...");
			const ciResult = await this.runContinuousIntegrationTests();
			this.results.push(ciResult);

			// Generate final results
			const finalResult = this.generateFinalResult();

			// Generate report if enabled
			if (MAIN_TEST_CONFIG.GENERATE_REPORT) {
				this.generateReport(finalResult);
			}

			// Save results if enabled
			if (MAIN_TEST_CONFIG.SAVE_RESULTS) {
				this.saveResults(finalResult);
			}

			// Show completion notification
			if (MAIN_TEST_CONFIG.NOTIFY_ON_COMPLETION) {
				this.showCompletionNotification(finalResult);
			}

			return finalResult;
		} catch (error) {
			console.error("❌ Main test runner failed:", error);
			return this.generateFinalResult(
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	/**
	 * Run Odoo connection tests
	 */
	private async runOdooConnectionTests(): Promise<TestSuiteResult> {
		const startTime = Date.now();
		const suiteStartTime = new Date();

		try {
			const runner = new OdooConnectionTestRunner();
			const result = await runner.runAllTests();

			const duration = Date.now() - startTime;
			const endTime = new Date();

			return {
				name: "Odoo Connection Tests",
				success: result.overall.success,
				duration,
				startTime: suiteStartTime,
				endTime,
				summary: result.overall.message,
				details: {
					odoo: result.odoo,
					redis: result.redis,
					graphql: result.graphql,
					sync: result.sync,
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			const endTime = new Date();

			return {
				name: "Odoo Connection Tests",
				success: false,
				duration,
				startTime: suiteStartTime,
				endTime,
				summary: "❌ Odoo connection tests failed",
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Run Redis sync tests
	 */
	private async runRedisSyncTests(): Promise<TestSuiteResult> {
		const startTime = Date.now();
		const suiteStartTime = new Date();

		try {
			const tester = new RedisSyncTester();
			const result = await tester.runAllTests();

			const duration = Date.now() - startTime;
			const endTime = new Date();

			// Cleanup
			tester.cleanup();

			return {
				name: "Redis Sync Tests",
				success: result.success,
				duration,
				startTime: suiteStartTime,
				endTime,
				summary: result.summary,
				details: {
					results: result.results,
					finalStatus: result.finalStatus,
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			const endTime = new Date();

			return {
				name: "Redis Sync Tests",
				success: false,
				duration,
				startTime: suiteStartTime,
				endTime,
				summary: "❌ Redis sync tests failed",
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Run continuous integration tests
	 */
	private async runContinuousIntegrationTests(): Promise<TestSuiteResult> {
		const startTime = Date.now();
		const suiteStartTime = new Date();

		try {
			const tester = new ContinuousIntegrationTester();
			const result = await tester.runAllTests();

			const duration = Date.now() - startTime;
			const endTime = new Date();

			// Cleanup
			tester.cleanup();

			return {
				name: "Continuous Integration Tests",
				success: result.success,
				duration,
				startTime: suiteStartTime,
				endTime,
				summary: result.summary,
				details: {
					results: result.results,
					healthReport: result.healthReport,
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			const endTime = new Date();

			return {
				name: "Continuous Integration Tests",
				success: false,
				duration,
				startTime: suiteStartTime,
				endTime,
				summary: "❌ Continuous integration tests failed",
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Generate final test result
	 */
	private generateFinalResult(error?: string): MainTestResult {
		const endTime = new Date();
		const totalDuration = endTime.getTime() - this.startTime.getTime();

		const passedTests = this.results.filter((r) => r.success).length;
		const failedTests = this.results.filter((r) => !r.success).length;
		const totalTests = this.results.length;
		const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 100;

		const overallSuccess = failedTests === 0;

		// Generate recommendations and alerts
		const recommendations: string[] = [];
		const alerts: string[] = [];

		this.results.forEach((result) => {
			if (!result.success) {
				alerts.push(`${result.name}: ${result.error || "Test failed"}`);

				switch (result.name) {
					case "Odoo Connection Tests":
						recommendations.push(
							"Check Odoo server status and network connectivity",
						);
						recommendations.push("Verify API key configuration");
						break;
					case "Redis Sync Tests":
						recommendations.push("Check Redis server status and connection");
						recommendations.push("Verify Redis configuration");
						break;
					case "Continuous Integration Tests":
						recommendations.push(
							"Review CI configuration and monitoring setup",
						);
						recommendations.push("Check system health and performance");
						break;
				}
			}
		});

		if (overallSuccess) {
			recommendations.push("All systems are working correctly");
			recommendations.push("Consider implementing production monitoring");
		}

		return {
			overall: {
				success: overallSuccess,
				duration: totalDuration,
				startTime: this.startTime,
				endTime,
				totalTests,
				passedTests,
				failedTests,
				successRate,
			},
			suites: [...this.results],
			recommendations,
			alerts,
		};
	}

	/**
	 * Generate comprehensive test report
	 */
	private generateReport(result: MainTestResult): void {
		const timestamp = new Date().toISOString();
		const report = `
# Main Test Runner Report

**Generated:** ${timestamp}
**Overall Status:** ${result.overall.success ? "✅ PASSED" : "❌ FAILED"}
**Duration:** ${(result.overall.duration / 1000).toFixed(2)}s
**Success Rate:** ${result.overall.successRate.toFixed(1)}%
**Tests:** ${result.overall.passedTests}/${result.overall.totalTests} passed

## Test Suites

${result.suites
	.map(
		(suite, index) => `
### ${index + 1}. ${suite.name}
- **Status:** ${suite.success ? "✅ PASSED" : "❌ FAILED"}
- **Duration:** ${(suite.duration / 1000).toFixed(2)}s
- **Summary:** ${suite.summary}
${suite.error ? `- **Error:** ${suite.error}` : ""}
`,
	)
	.join("")}

## Recommendations

${result.recommendations.map((rec) => `- ${rec}`).join("\n")}

${
	result.alerts.length > 0
		? `
## Alerts

${result.alerts.map((alert) => `- ⚠️ ${alert}`).join("\n")}
`
		: ""
}

## Configuration

- **Parallel Tests:** ${MAIN_TEST_CONFIG.PARALLEL_TESTS ? "Enabled" : "Disabled"}
- **Stop on Failure:** ${MAIN_TEST_CONFIG.STOP_ON_FAILURE ? "Enabled" : "Disabled"}
- **Generate Report:** ${MAIN_TEST_CONFIG.GENERATE_REPORT ? "Enabled" : "Disabled"}
- **Save Results:** ${MAIN_TEST_CONFIG.SAVE_RESULTS ? "Enabled" : "Disabled"}

---
*Report generated by Main Test Runner*
		`;

		console.log("\n" + "=".repeat(80));
		console.log("📄 TEST REPORT");
		console.log("=".repeat(80));
		console.log(report);
	}

	/**
	 * Save test results to file
	 */
	private saveResults(result: MainTestResult): void {
		try {
			const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
			const filename = `test-results-${timestamp}.json`;
			const data = JSON.stringify(result, null, 2);

			if (typeof window !== "undefined") {
				// Browser environment - save to localStorage
				localStorage.setItem(`test-results-${timestamp}`, data);
				console.log(
					`💾 Test results saved to localStorage: test-results-${timestamp}`,
				);
			} else {
				// Node.js environment - would save to file
				console.log(`💾 Test results would be saved to: ${filename}`);
			}
		} catch (error) {
			console.error("❌ Failed to save test results:", error);
		}
	}

	/**
	 * Show completion notification
	 */
	private showCompletionNotification(result: MainTestResult): void {
		console.log("\n" + "=".repeat(80));
		console.log("🎉 TEST RUNNER COMPLETED");
		console.log("=".repeat(80));

		if (result.overall.success) {
			console.log("✅ All test suites passed successfully!");
			console.log(`📊 Success Rate: ${result.overall.successRate.toFixed(1)}%`);
			console.log(
				`⏱️  Total Duration: ${(result.overall.duration / 1000).toFixed(2)}s`,
			);
		} else {
			console.log("❌ Some test suites failed");
			console.log(`📊 Success Rate: ${result.overall.successRate.toFixed(1)}%`);
			console.log(
				`🔍 Failed Tests: ${result.overall.failedTests}/${result.overall.totalTests}`,
			);
		}

		console.log("\n📋 Test Suite Results:");
		result.suites.forEach((suite, index) => {
			const status = suite.success ? "✅" : "❌";
			const duration = (suite.duration / 1000).toFixed(2);
			console.log(`   ${index + 1}. ${status} ${suite.name} (${duration}s)`);
		});

		if (result.recommendations.length > 0) {
			console.log("\n💡 Recommendations:");
			result.recommendations.forEach((rec) => {
				console.log(`   - ${rec}`);
			});
		}

		if (result.alerts.length > 0) {
			console.log("\n⚠️  Alerts:");
			result.alerts.forEach((alert) => {
				console.log(`   - ${alert}`);
			});
		}

		console.log("\n" + "=".repeat(80));
	}
}

// ============================================================================
// EXPORT AND USAGE - التصدير والاستخدام
// ============================================================================

export { MainTestRunner, MAIN_TEST_CONFIG };

// Auto-run tests if this file is executed directly
if (typeof window !== "undefined") {
	// Browser environment
	const runner = new MainTestRunner();
	runner.runAllTests().then((result) => {
		console.log(
			"Main test runner completed. Check console for detailed results.",
		);
	});
} else {
	// Node.js environment
	const runner = new MainTestRunner();
	runner
		.runAllTests()
		.then((result) => {
			console.log("Main test runner completed.");
			process.exit(result.overall.success ? 0 : 1);
		})
		.catch((error) => {
			console.error("Main test runner failed:", error);
			process.exit(1);
		});
}
