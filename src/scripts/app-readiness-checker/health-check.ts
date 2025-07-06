/**
 * Health Check - فحص صحة التطبيق
 * Comprehensive health check for the application
 */

import { CheckResult, CheckReport } from "./index";

// ============================================================================
// HEALTH CHECK TYPES - أنواع فحص الصحة
// ============================================================================

export interface HealthCheckConfig {
	timeout: number;
	retries: number;
	endpoints: string[];
	services: {
		odoo: boolean;
		graphql: boolean;
		database: boolean;
		redis: boolean;
		email: boolean;
	};
}

export interface HealthStatus {
	status: "healthy" | "degraded" | "unhealthy";
	message: string;
	details: Record<string, any>;
	timestamp: Date;
	responseTime: number;
}

export interface ServiceHealth {
	service: string;
	status: "up" | "down" | "degraded";
	responseTime: number;
	lastCheck: Date;
	error?: string;
}

// ============================================================================
// HEALTH CHECKER CLASS - فئة فحص الصحة
// ============================================================================

export class HealthChecker {
	private config: HealthCheckConfig;
	private results: CheckResult[] = [];

	constructor(config: HealthCheckConfig) {
		this.config = config;
	}

	/**
	 * تشغيل فحص الصحة الشامل
	 */
	async runHealthCheck(): Promise<CheckReport> {
		const startTime = Date.now();
		console.log("🏥 بدء فحص صحة التطبيق...");

		try {
			// فحص الاتصال بالإنترنت
			await this.checkInternetConnection();

			// فحص الخدمات الأساسية
			await this.checkBasicServices();

			// فحص API endpoints
			await this.checkAPIEndpoints();

			// فحص Odoo connection
			if (this.config.services.odoo) {
				await this.checkOdooConnection();
			}

			// فحص GraphQL
			if (this.config.services.graphql) {
				await this.checkGraphQLHealth();
			}

			// فحص قاعدة البيانات
			if (this.config.services.database) {
				await this.checkDatabaseHealth();
			}

			// فحص Redis
			if (this.config.services.redis) {
				await this.checkRedisHealth();
			}

			// فحص خدمة البريد الإلكتروني
			if (this.config.services.email) {
				await this.checkEmailService();
			}

			// فحص الذاكرة والموارد
			await this.checkSystemResources();

			// فحص الملفات الأساسية
			await this.checkEssentialFiles();

			const duration = Date.now() - startTime;

			return {
				checkName: "Health Check",
				results: this.results,
				summary: this.generateSummary(),
				timestamp: new Date(),
				duration,
			};
		} catch (error) {
			console.error("❌ خطأ في فحص الصحة:", error);
			throw error;
		}
	}

	/**
	 * فحص الاتصال بالإنترنت
	 */
	private async checkInternetConnection(): Promise<void> {
		const startTime = Date.now();

		try {
			const response = await fetch("https://www.google.com", {
				method: "HEAD",
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			this.results.push({
				success,
				message: success
					? "✅ الاتصال بالإنترنت يعمل بشكل طبيعي"
					: "❌ مشكلة في الاتصال بالإنترنت",
				details: {
					responseTime: duration,
					statusCode: response.status,
				},
				timestamp: new Date(),
				duration,
				severity: success ? "info" : "error",
			});
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: "❌ فشل الاتصال بالإنترنت",
				details: {
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * فحص الخدمات الأساسية
	 */
	private async checkBasicServices(): Promise<void> {
		const services = [
			{ name: "DNS", url: "https://8.8.8.8" },
			{ name: "CDN", url: "https://cdn.jsdelivr.net" },
		];

		for (const service of services) {
			await this.checkService(service.name, service.url);
		}
	}

	/**
	 * فحص API endpoints
	 */
	private async checkAPIEndpoints(): Promise<void> {
		for (const endpoint of this.config.endpoints) {
			await this.checkEndpoint(endpoint);
		}
	}

	/**
	 * فحص اتصال Odoo
	 */
	private async checkOdooConnection(): Promise<void> {
		const startTime = Date.now();
		const odooUrl = process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL;

		if (!odooUrl) {
			this.results.push({
				success: false,
				message: "❌ عنوان Odoo غير محدد",
				details: { missingEnvVar: "NEXT_PUBLIC_ODOO_GRAPHQL_URL" },
				timestamp: new Date(),
				duration: 0,
				severity: "error",
			});
			return;
		}

		try {
			const response = await fetch(`${odooUrl}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `query { __schema { types { name } } }`,
				}),
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			this.results.push({
				success,
				message: success
					? "✅ اتصال Odoo يعمل بشكل طبيعي"
					: "❌ مشكلة في اتصال Odoo",
				details: {
					url: odooUrl,
					responseTime: duration,
					statusCode: response.status,
				},
				timestamp: new Date(),
				duration,
				severity: success ? "info" : "error",
			});
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: "❌ فشل في الاتصال بـ Odoo",
				details: {
					url: odooUrl,
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * فحص صحة GraphQL
	 */
	private async checkGraphQLHealth(): Promise<void> {
		const startTime = Date.now();
		const graphqlUrl = process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL;

		if (!graphqlUrl) {
			this.results.push({
				success: false,
				message: "❌ عنوان GraphQL غير محدد",
				details: { missingEnvVar: "NEXT_PUBLIC_ODOO_GRAPHQL_URL" },
				timestamp: new Date(),
				duration: 0,
				severity: "error",
			});
			return;
		}

		try {
			const response = await fetch(graphqlUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `
						query IntrospectionQuery {
							__schema {
								queryType { name }
								mutationType { name }
								subscriptionType { name }
								types {
									name
									kind
								}
							}
						}
					`,
				}),
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			if (success) {
				const data = await response.json();
				const hasSchema = data.data && data.data.__schema;

				this.results.push({
					success: hasSchema,
					message: hasSchema
						? "✅ GraphQL Schema يعمل بشكل طبيعي"
						: "⚠️ GraphQL يعمل لكن Schema غير متاح",
					details: {
						url: graphqlUrl,
						responseTime: duration,
						hasSchema,
						typesCount: hasSchema ? data.data.__schema.types.length : 0,
					},
					timestamp: new Date(),
					duration,
					severity: hasSchema ? "info" : "warning",
				});
			} else {
				this.results.push({
					success: false,
					message: "❌ مشكلة في GraphQL",
					details: {
						url: graphqlUrl,
						responseTime: duration,
						statusCode: response.status,
					},
					timestamp: new Date(),
					duration,
					severity: "error",
				});
			}
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: "❌ فشل في الاتصال بـ GraphQL",
				details: {
					url: graphqlUrl,
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * فحص صحة قاعدة البيانات
	 */
	private async checkDatabaseHealth(): Promise<void> {
		const startTime = Date.now();

		try {
			// محاولة الاتصال بقاعدة البيانات
			// هذا مثال بسيط - يمكن تخصيصه حسب نوع قاعدة البيانات
			const response = await fetch("/api/health/database", {
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			this.results.push({
				success,
				message: success
					? "✅ قاعدة البيانات تعمل بشكل طبيعي"
					: "❌ مشكلة في قاعدة البيانات",
				details: {
					responseTime: duration,
					statusCode: response.status,
				},
				timestamp: new Date(),
				duration,
				severity: success ? "info" : "error",
			});
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: "❌ فشل في الاتصال بقاعدة البيانات",
				details: {
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * فحص صحة Redis
	 */
	private async checkRedisHealth(): Promise<void> {
		const startTime = Date.now();

		try {
			const response = await fetch("/api/health/redis", {
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			this.results.push({
				success,
				message: success
					? "✅ Redis يعمل بشكل طبيعي"
					: "❌ مشكلة في Redis",
				details: {
					responseTime: duration,
					statusCode: response.status,
				},
				timestamp: new Date(),
				duration,
				severity: success ? "info" : "error",
			});
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: "❌ فشل في الاتصال بـ Redis",
				details: {
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * فحص خدمة البريد الإلكتروني
	 */
	private async checkEmailService(): Promise<void> {
		const startTime = Date.now();

		try {
			const response = await fetch("/api/health/email", {
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			this.results.push({
				success,
				message: success
					? "✅ خدمة البريد الإلكتروني تعمل بشكل طبيعي"
					: "❌ مشكلة في خدمة البريد الإلكتروني",
				details: {
					responseTime: duration,
					statusCode: response.status,
				},
				timestamp: new Date(),
				duration,
				severity: success ? "info" : "error",
			});
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: "❌ فشل في الاتصال بخدمة البريد الإلكتروني",
				details: {
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * فحص موارد النظام
	 */
	private async checkSystemResources(): Promise<void> {
		const startTime = Date.now();

		try {
			// فحص استخدام الذاكرة
			const memoryUsage = process.memoryUsage();
			const memoryUsageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
			const memoryLimitMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

			// فحص استخدام CPU
			const cpuUsage = process.cpuUsage();
			const cpuUsagePercent = (cpuUsage.user + cpuUsage.system) / 1000000;

			const memoryHealthy = memoryUsageMB < 500; // أقل من 500MB
			const cpuHealthy = cpuUsagePercent < 1000; // أقل من 1000ms

			this.results.push({
				success: memoryHealthy && cpuHealthy,
				message: memoryHealthy && cpuHealthy
					? "✅ موارد النظام طبيعية"
					: "⚠️ استخدام عالي للموارد",
				details: {
					memoryUsage: `${memoryUsageMB}MB / ${memoryLimitMB}MB`,
					cpuUsage: `${cpuUsagePercent.toFixed(2)}ms`,
					uptime: process.uptime(),
				},
				timestamp: new Date(),
				duration: Date.now() - startTime,
				severity: memoryHealthy && cpuHealthy ? "info" : "warning",
			});
		} catch (error) {
			this.results.push({
				success: false,
				message: "❌ فشل في فحص موارد النظام",
				details: {
					error: error instanceof Error ? error.message : "Unknown error",
				},
				timestamp: new Date(),
				duration: Date.now() - startTime,
				severity: "error",
			});
		}
	}

	/**
	 * فحص الملفات الأساسية
	 */
	private async checkEssentialFiles(): Promise<void> {
		const startTime = Date.now();
		const essentialFiles = [
			"package.json",
			"next.config.js",
			"tsconfig.json",
			".env.local",
		];

		const missingFiles: string[] = [];

		for (const file of essentialFiles) {
			try {
				// محاولة قراءة الملف
				await import(`../../${file}`);
			} catch (error) {
				missingFiles.push(file);
			}
		}

		const duration = Date.now() - startTime;
		const success = missingFiles.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ جميع الملفات الأساسية موجودة"
				: `❌ ملفات مفقودة: ${missingFiles.join(", ")}`,
			details: {
				checkedFiles: essentialFiles,
				missingFiles,
			},
			timestamp: new Date(),
			duration,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص خدمة معينة
	 */
	private async checkService(name: string, url: string): Promise<void> {
		const startTime = Date.now();

		try {
			const response = await fetch(url, {
				method: "HEAD",
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			this.results.push({
				success,
				message: success
					? `✅ ${name} يعمل بشكل طبيعي`
					: `❌ مشكلة في ${name}`,
				details: {
					url,
					responseTime: duration,
					statusCode: response.status,
				},
				timestamp: new Date(),
				duration,
				severity: success ? "info" : "error",
			});
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: `❌ فشل في الاتصال بـ ${name}`,
				details: {
					url,
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * فحص endpoint معين
	 */
	private async checkEndpoint(endpoint: string): Promise<void> {
		const startTime = Date.now();

		try {
			const response = await fetch(endpoint, {
				signal: AbortSignal.timeout(this.config.timeout),
			});

			const duration = Date.now() - startTime;
			const success = response.ok;

			this.results.push({
				success,
				message: success
					? `✅ ${endpoint} يعمل بشكل طبيعي`
					: `❌ مشكلة في ${endpoint}`,
				details: {
					endpoint,
					responseTime: duration,
					statusCode: response.status,
				},
				timestamp: new Date(),
				duration,
				severity: success ? "info" : "error",
			});
		} catch (error) {
			const duration = Date.now() - startTime;
			this.results.push({
				success: false,
				message: `❌ فشل في الاتصال بـ ${endpoint}`,
				details: {
					endpoint,
					error: error instanceof Error ? error.message : "Unknown error",
					responseTime: duration,
				},
				timestamp: new Date(),
				duration,
				severity: "error",
			});
		}
	}

	/**
	 * إنشاء ملخص النتائج
	 */
	private generateSummary() {
		const total = this.results.length;
		const passed = this.results.filter(r => r.success).length;
		const failed = this.results.filter(r => !r.success && r.severity === "error").length;
		const warnings = this.results.filter(r => r.severity === "warning").length;
		const critical = this.results.filter(r => r.severity === "critical").length;

		return {
			total,
			passed,
			failed,
			warnings,
			critical,
		};
	}
}

// ============================================================================
// EXPORT - التصدير
// ============================================================================

export default HealthChecker;