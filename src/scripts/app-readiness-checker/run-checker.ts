#!/usr/bin/env node

/**
 * App Readiness Checker Runner - مشغل فاحص جاهزية التطبيق
 * Main script to run all readiness checks
 */

const { HealthChecker } = require("./health-check");
const { DependencyChecker } = require("./dependency-checker");
const { ConfigurationValidator } = require("./configuration-validator");
const { BuildAnalyzer } = require("./build-analyzer");
const { SecurityScanner } = require("./security-scanner");
const { PerformanceTester } = require("./performance-tester");
const { CompatibilityChecker } = require("./compatibility-checker");
const { DeploymentValidator } = require("./deployment-validator");

// ============================================================================
// CONFIGURATION - التكوين
// ============================================================================

const healthConfig = {
	timeout: 30000,
	retries: 3,
	endpoints: ["http://localhost:3000", "http://localhost:3000/api/health"],
	services: {
		odoo: true,
		graphql: true,
		database: true,
		redis: true,
		email: true,
	},
};

const dependencyConfig = {
	required: [
		"next",
		"react",
		"@chakra-ui/react",
		"@apollo/client",
		"graphql",
		"@reduxjs/toolkit",
		"redux-persist",
	],
	optional: ["@types/node", "@types/react", "eslint", "prettier"],
	conflicts: {
		"@chakra-ui/react": ["@mui/material"],
		"@apollo/client": ["urql"],
	},
	peerDependencies: {
		"@chakra-ui/react": { react: "^18.0.0" },
		"@apollo/client": { react: "^18.0.0" },
	},
	devDependencies: [
		"typescript",
		"@types/node",
		"@types/react",
		"eslint",
		"prettier",
	],
};

const configurationConfig = {
	requiredEnvVars: [
		"NODE_ENV",
		"NEXT_PUBLIC_ODOO_GRAPHQL_URL",
		"NEXT_PUBLIC_ODOO_API_KEY",
		"NEXT_PUBLIC_ODOO_DATABASE",
	],
	requiredFiles: [
		"package.json",
		"next.config.js",
		"tsconfig.json",
		".env.local",
	],
	validateOdoo: true,
	validateGraphQL: true,
	validateDatabase: true,
	validateRedis: true,
	validateEmail: true,
	validateSecurity: true,
};

const buildConfig = {
	maxBundleSize: 2048, // 2MB
	maxChunkSize: 512, // 512KB
	performanceThresholds: {
		loadTime: 3000, // 3 seconds
		memoryUsage: 100, // 100MB
	},
};

const securityConfig = {
	scanDependencies: true,
	scanCode: true,
	scanConfiguration: true,
	scanEnvironment: true,
	checkSecrets: true,
	checkPermissions: true,
};

const performanceConfig = {
	maxLoadTime: 3000,
	maxFirstContentfulPaint: 1800,
	maxLargestContentfulPaint: 2500,
	maxFirstInputDelay: 100,
	minPerformanceScore: 90,
};

const compatibilityConfig = {
	browsers: {
		chrome: "90+",
		firefox: "88+",
		safari: "14+",
		edge: "90+",
		ie: "11",
	},
	devices: {
		mobile: true,
		tablet: true,
		desktop: true,
	},
	features: {
		es6: true,
		es2017: true,
		es2020: true,
		cssGrid: true,
		flexbox: true,
		webp: true,
		webgl: true,
		serviceWorker: true,
	},
};

const deploymentConfig = {
	environment: "production",
	platform: "vercel",
	validateBuild: true,
	validateEnvironment: true,
	validateSecurity: true,
	validatePerformance: true,
	validateMonitoring: true,
};

// ============================================================================
// MAIN RUNNER - المشغل الرئيسي
// ============================================================================

class AppReadinessCheckerRunner {
	private results: any[] = [];
	private startTime: number = 0;

	/**
	 * تشغيل جميع الفحوصات
	 */
	async runAllChecks(): Promise<void> {
		this.startTime = Date.now();
		console.log("🚀 بدء فحص جاهزية التطبيق...\n");

		try {
			// 1. فحص الصحة
			console.log("📊 فحص صحة التطبيق...");
			const healthChecker = new HealthChecker(healthConfig);
			const healthReport = await healthChecker.runHealthCheck();
			this.results.push(healthReport);

			// 2. فحص التبعيات
			console.log("📦 فحص التبعيات...");
			const dependencyChecker = new DependencyChecker(dependencyConfig);
			const dependencyReport = await dependencyChecker.runDependencyCheck();
			this.results.push(dependencyReport);

			// 3. فحص التكوين
			console.log("⚙️ فحص التكوين...");
			const configurationValidator = new ConfigurationValidator(
				configurationConfig,
			);
			const configurationReport =
				await configurationValidator.runConfigurationCheck();
			this.results.push(configurationReport);

			// 4. تحليل البناء
			console.log("🔨 تحليل البناء...");
			const buildAnalyzer = new BuildAnalyzer(buildConfig);
			const buildReport = await buildAnalyzer.runBuildAnalysis();
			this.results.push(buildReport);

			// 5. فحص الأمان
			console.log("🔒 فحص الأمان...");
			const securityScanner = new SecurityScanner(securityConfig);
			const securityReport = await securityScanner.runSecurityScan();
			this.results.push(securityReport);

			// 6. اختبار الأداء
			console.log("⚡ اختبار الأداء...");
			const performanceTester = new PerformanceTester(performanceConfig);
			const performanceReport = await performanceTester.runPerformanceTests();
			this.results.push(performanceReport);

			// 7. فحص التوافق
			console.log("🌐 فحص التوافق...");
			const compatibilityChecker = new CompatibilityChecker(
				compatibilityConfig,
			);
			const compatibilityReport =
				await compatibilityChecker.runCompatibilityCheck();
			this.results.push(compatibilityReport);

			// 8. فحص النشر
			console.log("🚀 فحص النشر...");
			const deploymentValidator = new DeploymentValidator(deploymentConfig);
			const deploymentReport =
				await deploymentValidator.runDeploymentValidation();
			this.results.push(deploymentReport);

			// عرض النتائج
			this.displayResults();
		} catch (error) {
			console.error("❌ خطأ في تشغيل الفحوصات:", error);
			process.exit(1);
		}
	}

	/**
	 * عرض النتائج
	 */
	private displayResults(): void {
		const duration = Date.now() - this.startTime;

		console.log("\n" + "=".repeat(80));
		console.log("📋 تقرير فحص جاهزية التطبيق");
		console.log("=".repeat(80));

		// ملخص عام
		const totalChecks = this.results.length;
		const totalResults = this.results.reduce(
			(sum, report) => sum + report.results.length,
			0,
		);
		const passedResults = this.results.reduce(
			(sum, report) =>
				sum + report.results.filter((r: any) => r.success).length,
			0,
		);
		const failedResults = this.results.reduce(
			(sum, report) =>
				sum +
				report.results.filter((r: any) => !r.success && r.severity === "error")
					.length,
			0,
		);
		const warningResults = this.results.reduce(
			(sum, report) =>
				sum +
				report.results.filter((r: any) => r.severity === "warning").length,
			0,
		);

		console.log(`\n📊 الملخص العام:`);
		console.log(`   • إجمالي الفحوصات: ${totalChecks}`);
		console.log(`   • إجمالي النتائج: ${totalResults}`);
		console.log(`   • النتائج الناجحة: ${passedResults} ✅`);
		console.log(`   • النتائج الفاشلة: ${failedResults} ❌`);
		console.log(`   • التحذيرات: ${warningResults} ⚠️`);
		console.log(`   • وقت التشغيل: ${duration}ms`);

		// تقرير كل فحص
		console.log(`\n📋 تقرير مفصل:`);
		this.results.forEach((report, index) => {
			const successCount = report.results.filter((r: any) => r.success).length;
			const errorCount = report.results.filter(
				(r: any) => !r.success && r.severity === "error",
			).length;
			const warningCount = report.results.filter(
				(r: any) => r.severity === "warning",
			).length;

			const status = errorCount === 0 ? "✅" : errorCount > 0 ? "❌" : "⚠️";

			console.log(`\n${index + 1}. ${status} ${report.checkName}`);
			console.log(
				`   • النتائج: ${successCount}/${report.results.length} ناجحة`,
			);
			console.log(`   • الأخطاء: ${errorCount}`);
			console.log(`   • التحذيرات: ${warningCount}`);
			console.log(`   • الوقت: ${report.duration}ms`);

			// عرض الأخطاء الحرجة
			const criticalErrors = report.results.filter(
				(r: any) => !r.success && r.severity === "error",
			);
			if (criticalErrors.length > 0) {
				console.log(`   • الأخطاء الحرجة:`);
				criticalErrors.forEach((error: any) => {
					console.log(`     - ${error.message}`);
				});
			}
		});

		// التوصيات
		this.displayRecommendations();

		// النتيجة النهائية
		const overallSuccess = failedResults === 0;
		console.log(`\n${"=".repeat(80)}`);
		console.log(
			`🎯 النتيجة النهائية: ${overallSuccess ? "✅ جاهز للنشر" : "❌ يحتاج إصلاح"}`,
		);
		console.log("=".repeat(80));

		// إنهاء العملية
		if (!overallSuccess) {
			console.log(
				"\n❌ التطبيق غير جاهز للنشر. يرجى إصلاح المشاكل المذكورة أعلاه.",
			);
			process.exit(1);
		} else {
			console.log("\n✅ التطبيق جاهز للنشر! 🚀");
			process.exit(0);
		}
	}

	/**
	 * عرض التوصيات
	 */
	private displayRecommendations(): void {
		console.log(`\n💡 التوصيات:`);

		// جمع جميع التوصيات
		const recommendations: string[] = [];

		this.results.forEach((report) => {
			report.results.forEach((result: any) => {
				if (result.details?.recommendations) {
					recommendations.push(...result.details.recommendations);
				}
			});
		});

		if (recommendations.length === 0) {
			console.log("   • لا توجد توصيات إضافية");
			return;
		}

		// عرض التوصيات الفريدة
		const uniqueRecommendations = [...new Set(recommendations)];
		uniqueRecommendations.forEach((recommendation, index) => {
			console.log(`   ${index + 1}. ${recommendation}`);
		});
	}

	/**
	 * تشغيل فحص واحد
	 */
	async runSingleCheck(checkName: string): Promise<void> {
		console.log(`🔍 تشغيل فحص: ${checkName}`);

		switch (checkName.toLowerCase()) {
			case "health":
				const healthChecker = new HealthChecker(healthConfig);
				const healthReport = await healthChecker.runHealthCheck();
				this.displaySingleResult(healthReport);
				break;

			case "dependencies":
				const dependencyChecker = new DependencyChecker(dependencyConfig);
				const dependencyReport = await dependencyChecker.runDependencyCheck();
				this.displaySingleResult(dependencyReport);
				break;

			case "configuration":
				const configurationValidator = new ConfigurationValidator(
					configurationConfig,
				);
				const configurationReport =
					await configurationValidator.runConfigurationCheck();
				this.displaySingleResult(configurationReport);
				break;

			case "build":
				const buildAnalyzer = new BuildAnalyzer(buildConfig);
				const buildReport = await buildAnalyzer.runBuildAnalysis();
				this.displaySingleResult(buildReport);
				break;

			case "security":
				const securityScanner = new SecurityScanner(securityConfig);
				const securityReport = await securityScanner.runSecurityScan();
				this.displaySingleResult(securityReport);
				break;

			case "performance":
				const performanceTester = new PerformanceTester(performanceConfig);
				const performanceReport = await performanceTester.runPerformanceTests();
				this.displaySingleResult(performanceReport);
				break;

			case "compatibility":
				const compatibilityChecker = new CompatibilityChecker(
					compatibilityConfig,
				);
				const compatibilityReport =
					await compatibilityChecker.runCompatibilityCheck();
				this.displaySingleResult(compatibilityReport);
				break;

			case "deployment":
				const deploymentValidator = new DeploymentValidator(deploymentConfig);
				const deploymentReport =
					await deploymentValidator.runDeploymentValidation();
				this.displaySingleResult(deploymentReport);
				break;

			default:
				console.error(`❌ فحص غير معروف: ${checkName}`);
				console.log(
					"الفحوصات المتاحة: health, dependencies, configuration, build, security, performance, compatibility, deployment",
				);
				process.exit(1);
		}
	}

	/**
	 * عرض نتيجة فحص واحد
	 */
	private displaySingleResult(report: any): void {
		console.log(`\n📋 نتيجة فحص: ${report.checkName}`);
		console.log("=".repeat(60));

		const successCount = report.results.filter((r: any) => r.success).length;
		const errorCount = report.results.filter(
			(r: any) => !r.success && r.severity === "error",
		).length;
		const warningCount = report.results.filter(
			(r: any) => r.severity === "warning",
		).length;

		console.log(`• النتائج: ${successCount}/${report.results.length} ناجحة`);
		console.log(`• الأخطاء: ${errorCount}`);
		console.log(`• التحذيرات: ${warningCount}`);
		console.log(`• الوقت: ${report.duration}ms`);

		// عرض التفاصيل
		report.results.forEach((result: any, index: number) => {
			const status = result.success
				? "✅"
				: result.severity === "error"
					? "❌"
					: "⚠️";
			console.log(`\n${index + 1}. ${status} ${result.message}`);

			if (result.details) {
				Object.entries(result.details).forEach(([key, value]) => {
					if (Array.isArray(value) && value.length > 0) {
						console.log(`   • ${key}: ${value.join(", ")}`);
					} else if (typeof value === "object" && value !== null) {
						console.log(`   • ${key}: ${JSON.stringify(value, null, 2)}`);
					} else if (value !== undefined && value !== null) {
						console.log(`   • ${key}: ${value}`);
					}
				});
			}
		});

		const overallSuccess = errorCount === 0;
		console.log(`\n🎯 النتيجة: ${overallSuccess ? "✅ ناجح" : "❌ فاشل"}`);
	}
}

// ============================================================================
// CLI INTERFACE - واجهة سطر الأوامر
// ============================================================================

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const runner = new AppReadinessCheckerRunner();

	if (args.length === 0) {
		// تشغيل جميع الفحوصات
		await runner.runAllChecks();
	} else if (args.length === 1) {
		// تشغيل فحص واحد
		await runner.runSingleCheck(args[0]);
	} else {
		console.log("📖 استخدام فاحص جاهزية التطبيق:");
		console.log("");
		console.log("  تشغيل جميع الفحوصات:");
		console.log("    npm run check");
		console.log("    node src/scripts/app-readiness-checker/run-checker.ts");
		console.log("");
		console.log("  تشغيل فحص واحد:");
		console.log("    npm run check:health");
		console.log("    npm run check:dependencies");
		console.log("    npm run check:configuration");
		console.log("    npm run check:build");
		console.log("    npm run check:security");
		console.log("    npm run check:performance");
		console.log("    npm run check:compatibility");
		console.log("    npm run check:deployment");
		console.log("");
		console.log("  أو:");
		console.log(
			"    node src/scripts/app-readiness-checker/run-checker.ts [check-name]",
		);
		console.log("");
		console.log("الفحوصات المتاحة:");
		console.log("  • health - فحص صحة التطبيق");
		console.log("  • dependencies - فحص التبعيات");
		console.log("  • configuration - فحص التكوين");
		console.log("  • build - تحليل البناء");
		console.log("  • security - فحص الأمان");
		console.log("  • performance - اختبار الأداء");
		console.log("  • compatibility - فحص التوافق");
		console.log("  • deployment - فحص النشر");
	}
}

// تشغيل البرنامج
if (require.main === module) {
	main().catch((error) => {
		console.error("❌ خطأ في تشغيل الفاحص:", error);
		process.exit(1);
	});
}

// ============================================================================
// EXPORT - التصدير
// ============================================================================

module.exports = AppReadinessCheckerRunner;
