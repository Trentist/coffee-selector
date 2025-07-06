/**
 * App Readiness Checker - فاحص جاهزية التطبيق
 * Main export file for all readiness checkers
 */

// ============================================================================
// CORE CHECKERS - الفاحصات الأساسية
// ============================================================================

export * from "./health-check";
export * from "./dependency-checker";
export * from "./configuration-validator";
export * from "./build-analyzer";

// ============================================================================
// ADVANCED CHECKERS - الفاحصات المتقدمة
// ============================================================================

export * from "./security-scanner";
export * from "./performance-tester";
export * from "./compatibility-checker";
export * from "./deployment-validator";

// ============================================================================
// TYPES - الأنواع
// ============================================================================

export interface CheckResult {
	success: boolean;
	message: string;
	details?: Record<string, any>;
	timestamp: Date;
	duration: number;
	severity: "info" | "warning" | "error" | "critical";
}

export interface CheckReport {
	checkName: string;
	results: CheckResult[];
	summary: {
		total: number;
		passed: number;
		failed: number;
		warnings: number;
		critical: number;
	};
	timestamp: Date;
	duration: number;
}

export interface AppReadinessReport {
	appName: string;
	version: string;
	environment: string;
	checks: CheckReport[];
	overall: {
		status: "ready" | "not_ready" | "partial";
		score: number;
		criticalIssues: number;
		warnings: number;
		recommendations: string[];
	};
	generatedAt: Date;
	generatedBy: string;
}

// ============================================================================
// CONFIGURATION - التكوين
// ============================================================================

export interface CheckerConfig {
	healthCheck: {
		timeout: number;
		retries: number;
		endpoints: string[];
	};
	dependencies: {
		required: string[];
		optional: string[];
		conflicts: Record<string, string[]>;
	};
	configuration: {
		requiredEnvVars: string[];
		requiredFiles: string[];
		validateOdoo: boolean;
	};
	build: {
		maxBundleSize: number;
		maxChunkSize: number;
		performanceThresholds: {
			loadTime: number;
			memoryUsage: number;
		};
	};
	security: {
		scanLevel: "low" | "medium" | "high";
		excludePaths: string[];
		requiredHeaders: string[];
	};
	performance: {
		thresholds: {
			loadTime: number;
			memoryUsage: number;
			cpuUsage: number;
		};
		iterations: number;
	};
	compatibility: {
		browsers: string[];
		devices: string[];
		accessibility: boolean;
	};
	deployment: {
		requiredFiles: string[];
		validateBuild: boolean;
		checkEnvironment: boolean;
	};
}

// ============================================================================
// UTILITIES - الأدوات المساعدة
// ============================================================================

export const SEVERITY_LEVELS = {
	INFO: "info",
	WARNING: "warning",
	ERROR: "error",
	CRITICAL: "critical",
} as const;

export const STATUS_COLORS = {
	ready: "🟢",
	not_ready: "🔴",
	partial: "🟡",
} as const;

export const SEVERITY_ICONS = {
	info: "ℹ️",
	warning: "⚠️",
	error: "❌",
	critical: "🚨",
} as const;

// ============================================================================
// MAIN CHECKER CLASS - الفئة الرئيسية للفحص
// ============================================================================

export class AppReadinessChecker {
	private config: CheckerConfig;
	private results: CheckReport[] = [];

	constructor(config?: Partial<CheckerConfig>) {
		this.config = this.getDefaultConfig();
		if (config) {
			this.config = { ...this.config, ...config };
		}
	}

	/**
	 * تشغيل جميع الفحوصات
	 */
	async runAllChecks(): Promise<AppReadinessReport> {
		const startTime = Date.now();
		console.log("🚀 بدء فحص جاهزية التطبيق...");

		try {
			// تشغيل الفحوصات الأساسية
			await this.runHealthCheck();
			await this.runDependencyCheck();
			await this.runConfigurationCheck();
			await this.runBuildAnalysis();

			// تشغيل الفحوصات المتقدمة
			await this.runSecurityScan();
			await this.runPerformanceTest();
			await this.runCompatibilityCheck();
			await this.runDeploymentValidation();

			const duration = Date.now() - startTime;
			const report = this.generateReport(duration);

			console.log("✅ تم إكمال جميع الفحوصات");
			return report;
		} catch (error) {
			console.error("❌ خطأ في تشغيل الفحوصات:", error);
			throw error;
		}
	}

	/**
	 * تشغيل فحص صحة التطبيق
	 */
	async runHealthCheck(): Promise<void> {
		// سيتم تنفيذها في health-check.ts
	}

	/**
	 * تشغيل فحص التبعيات
	 */
	async runDependencyCheck(): Promise<void> {
		// سيتم تنفيذها في dependency-checker.ts
	}

	/**
	 * تشغيل فحص التكوين
	 */
	async runConfigurationCheck(): Promise<void> {
		// سيتم تنفيذها في configuration-validator.ts
	}

	/**
	 * تشغيل تحليل البناء
	 */
	async runBuildAnalysis(): Promise<void> {
		// سيتم تنفيذها في build-analyzer.ts
	}

	/**
	 * تشغيل فحص الأمان
	 */
	async runSecurityScan(): Promise<void> {
		// سيتم تنفيذها في security-scanner.ts
	}

	/**
	 * تشغيل اختبار الأداء
	 */
	async runPerformanceTest(): Promise<void> {
		// سيتم تنفيذها في performance-tester.ts
	}

	/**
	 * تشغيل فحص التوافق
	 */
	async runCompatibilityCheck(): Promise<void> {
		// سيتم تنفيذها في compatibility-checker.ts
	}

	/**
	 * تشغيل التحقق من النشر
	 */
	async runDeploymentValidation(): Promise<void> {
		// سيتم تنفيذها في deployment-validator.ts
	}

	/**
	 * إنشاء التقرير النهائي
	 */
	private generateReport(duration: number): AppReadinessReport {
		const totalChecks = this.results.reduce(
			(sum, report) => sum + report.results.length,
			0,
		);
		const passedChecks = this.results.reduce(
			(sum, report) => sum + report.results.filter((r) => r.success).length,
			0,
		);
		const failedChecks = this.results.reduce(
			(sum, report) =>
				sum +
				report.results.filter((r) => !r.success && r.severity === "error")
					.length,
			0,
		);
		const warningChecks = this.results.reduce(
			(sum, report) =>
				sum + report.results.filter((r) => r.severity === "warning").length,
			0,
		);
		const criticalChecks = this.results.reduce(
			(sum, report) =>
				sum + report.results.filter((r) => r.severity === "critical").length,
			0,
		);

		const score = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;
		const status =
			criticalChecks > 0 ? "not_ready" : failedChecks > 0 ? "partial" : "ready";

		const recommendations = this.generateRecommendations();

		return {
			appName: "Coffee Selection App",
			version: process.env.npm_package_version || "1.0.0",
			environment: process.env.NODE_ENV || "development",
			checks: this.results,
			overall: {
				status,
				score: Math.round(score),
				criticalIssues: criticalChecks,
				warnings: warningChecks,
				recommendations,
			},
			generatedAt: new Date(),
			generatedBy: "App Readiness Checker",
		};
	}

	/**
	 * إنشاء التوصيات
	 */
	private generateRecommendations(): string[] {
		const recommendations: string[] = [];

		// تحليل النتائج وإنشاء توصيات
		this.results.forEach((report) => {
			report.results.forEach((result) => {
				if (!result.success) {
					switch (result.severity) {
						case "critical":
							recommendations.push(`🔴 إصلاح عاجل: ${result.message}`);
							break;
						case "error":
							recommendations.push(`❌ إصلاح مطلوب: ${result.message}`);
							break;
						case "warning":
							recommendations.push(`⚠️ تحسين مقترح: ${result.message}`);
							break;
					}
				}
			});
		});

		return recommendations;
	}

	/**
	 * الحصول على التكوين الافتراضي
	 */
	private getDefaultConfig(): CheckerConfig {
		return {
			healthCheck: {
				timeout: 30000,
				retries: 3,
				endpoints: ["/api/health", "/api/odoo/health", "/api/graphql"],
			},
			dependencies: {
				required: [
					"next",
					"react",
					"@chakra-ui/react",
					"@apollo/client",
					"graphql",
				],
				optional: ["@types/node", "eslint", "prettier"],
				conflicts: {},
			},
			configuration: {
				requiredEnvVars: [
					"NEXT_PUBLIC_ODOO_GRAPHQL_URL",
					"NEXT_PUBLIC_ODOO_API_KEY",
					"NODE_ENV",
				],
				requiredFiles: ["package.json", "next.config.js", "tsconfig.json"],
				validateOdoo: true,
			},
			build: {
				maxBundleSize: 500, // KB
				maxChunkSize: 250, // KB
				performanceThresholds: {
					loadTime: 3000, // ms
					memoryUsage: 100, // MB
				},
			},
			security: {
				scanLevel: "medium",
				excludePaths: ["node_modules", ".git", "dist", "build"],
				requiredHeaders: [
					"X-Frame-Options",
					"X-Content-Type-Options",
					"X-XSS-Protection",
				],
			},
			performance: {
				thresholds: {
					loadTime: 3000,
					memoryUsage: 100,
					cpuUsage: 80,
				},
				iterations: 5,
			},
			compatibility: {
				browsers: ["chrome", "firefox", "safari", "edge"],
				devices: ["desktop", "tablet", "mobile"],
				accessibility: true,
			},
			deployment: {
				requiredFiles: [".next", "public", "package.json"],
				validateBuild: true,
				checkEnvironment: true,
			},
		};
	}
}

// ============================================================================
// EXPORT MAIN FUNCTION - تصدير الدالة الرئيسية
// ============================================================================

export async function checkAppReadiness(
	config?: Partial<CheckerConfig>,
): Promise<AppReadinessReport> {
	const checker = new AppReadinessChecker(config);
	return await checker.runAllChecks();
}

export default AppReadinessChecker;
