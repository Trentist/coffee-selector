/**
 * Configuration Validator - فاحص صحة التكوين
 * Comprehensive configuration validation for the application
 */

import { CheckResult, CheckReport } from "./index";
import * as fs from "fs";
import * as path from "path";

// ============================================================================
// CONFIGURATION TYPES - أنواع التكوين
// ============================================================================

export interface ConfigurationConfig {
	requiredEnvVars: string[];
	requiredFiles: string[];
	validateOdoo: boolean;
	validateGraphQL: boolean;
	validateDatabase: boolean;
	validateRedis: boolean;
	validateEmail: boolean;
	validateSecurity: boolean;
}

export interface EnvVarInfo {
	name: string;
	value?: string;
	required: boolean;
	valid: boolean;
	description?: string;
}

export interface FileInfo {
	path: string;
	exists: boolean;
	readable: boolean;
	valid: boolean;
	error?: string;
}

export interface OdooConfig {
	graphqlUrl?: string;
	apiKey?: string;
	database?: string;
	timeout?: number;
}

export interface SecurityConfig {
	allowedOrigins: string[];
	csrfProtection: boolean;
	rateLimiting: boolean;
	sslRequired: boolean;
}

// ============================================================================
// CONFIGURATION VALIDATOR CLASS - فئة فحص التكوين
// ============================================================================

export class ConfigurationValidator {
	private config: ConfigurationConfig;
	private results: CheckResult[] = [];

	constructor(config: ConfigurationConfig) {
		this.config = config;
	}

	/**
	 * تشغيل فحص التكوين الشامل
	 */
	async runConfigurationCheck(): Promise<CheckReport> {
		const startTime = Date.now();
		console.log("⚙️ بدء فحص التكوين...");

		try {
			// فحص متغيرات البيئة
			await this.checkEnvironmentVariables();

			// فحص الملفات المطلوبة
			await this.checkRequiredFiles();

			// فحص تكوين Odoo
			if (this.config.validateOdoo) {
				await this.checkOdooConfiguration();
			}

			// فحص تكوين GraphQL
			if (this.config.validateGraphQL) {
				await this.checkGraphQLConfiguration();
			}

			// فحص تكوين قاعدة البيانات
			if (this.config.validateDatabase) {
				await this.checkDatabaseConfiguration();
			}

			// فحص تكوين Redis
			if (this.config.validateRedis) {
				await this.checkRedisConfiguration();
			}

			// فحص تكوين البريد الإلكتروني
			if (this.config.validateEmail) {
				await this.checkEmailConfiguration();
			}

			// فحص إعدادات الأمان
			if (this.config.validateSecurity) {
				await this.checkSecurityConfiguration();
			}

			// فحص تكوين Next.js
			await this.checkNextJSConfiguration();

			// فحص تكوين TypeScript
			await this.checkTypeScriptConfiguration();

			// فحص تكوين ESLint
			await this.checkESLintConfiguration();

			// فحص تكوين Prettier
			await this.checkPrettierConfiguration();

			const duration = Date.now() - startTime;

			return {
				checkName: "Configuration Validation",
				results: this.results,
				summary: this.generateSummary(),
				timestamp: new Date(),
				duration,
			};
		} catch (error) {
			console.error("❌ خطأ في فحص التكوين:", error);
			throw error;
		}
	}

	/**
	 * فحص متغيرات البيئة
	 */
	private async checkEnvironmentVariables(): Promise<void> {
		const startTime = Date.now();
		const envVars: EnvVarInfo[] = [];
		const missingVars: string[] = [];
		const invalidVars: string[] = [];

		for (const envVar of this.config.requiredEnvVars) {
			const value = process.env[envVar];
			const exists = !!value;
			const valid = this.validateEnvVar(envVar, value);

			envVars.push({
				name: envVar,
				value: exists ? this.maskSensitiveValue(value!) : undefined,
				required: true,
				valid,
			});

			if (!exists) {
				missingVars.push(envVar);
			} else if (!valid) {
				invalidVars.push(envVar);
			}
		}

		const success = missingVars.length === 0 && invalidVars.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ جميع متغيرات البيئة المطلوبة موجودة وصحيحة"
				: `❌ مشاكل في متغيرات البيئة: ${missingVars.length} مفقودة، ${invalidVars.length} غير صحيحة`,
			details: {
				envVars,
				missing: missingVars,
				invalid: invalidVars,
				totalRequired: this.config.requiredEnvVars.length,
				found: this.config.requiredEnvVars.length - missingVars.length,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص الملفات المطلوبة
	 */
	private async checkRequiredFiles(): Promise<void> {
		const startTime = Date.now();
		const files: FileInfo[] = [];
		const missingFiles: string[] = [];
		const invalidFiles: string[] = [];

		for (const filePath of this.config.requiredFiles) {
			const fullPath = path.join(process.cwd(), filePath);
			const exists = fs.existsSync(fullPath);
			const readable = exists ? this.isFileReadable(fullPath) : false;
			const valid = exists && readable && this.validateFile(filePath);

			files.push({
				path: filePath,
				exists,
				readable,
				valid,
			});

			if (!exists) {
				missingFiles.push(filePath);
			} else if (!valid) {
				invalidFiles.push(filePath);
			}
		}

		const success = missingFiles.length === 0 && invalidFiles.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ جميع الملفات المطلوبة موجودة وصحيحة"
				: `❌ مشاكل في الملفات: ${missingFiles.length} مفقودة، ${invalidFiles.length} غير صحيحة`,
			details: {
				files,
				missing: missingFiles,
				invalid: invalidFiles,
				totalRequired: this.config.requiredFiles.length,
				found: this.config.requiredFiles.length - missingFiles.length,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص تكوين Odoo
	 */
	private async checkOdooConfiguration(): Promise<void> {
		const startTime = Date.now();
		const odooConfig = this.getOdooConfig();
		const issues: string[] = [];

		// فحص عنوان GraphQL
		if (!odooConfig.graphqlUrl) {
			issues.push("NEXT_PUBLIC_ODOO_GRAPHQL_URL غير محدد");
		} else if (!this.isValidUrl(odooConfig.graphqlUrl)) {
			issues.push("NEXT_PUBLIC_ODOO_GRAPHQL_URL غير صحيح");
		}

		// فحص مفتاح API
		if (!odooConfig.apiKey) {
			issues.push("NEXT_PUBLIC_ODOO_API_KEY غير محدد");
		} else if (odooConfig.apiKey.length < 10) {
			issues.push("NEXT_PUBLIC_ODOO_API_KEY قصير جداً");
		}

		// فحص قاعدة البيانات
		if (!odooConfig.database) {
			issues.push("NEXT_PUBLIC_ODOO_DATABASE غير محدد");
		}

		// فحص timeout
		if (odooConfig.timeout && odooConfig.timeout < 5000) {
			issues.push("timeout قصير جداً (يجب أن يكون 5000ms على الأقل)");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين Odoo صحيح"
				: `❌ مشاكل في تكوين Odoo: ${issues.join(", ")}`,
			details: {
				config: {
					graphqlUrl: odooConfig.graphqlUrl ? "محدد" : "غير محدد",
					apiKey: odooConfig.apiKey ? "محدد" : "غير محدد",
					database: odooConfig.database || "غير محدد",
					timeout: odooConfig.timeout || "افتراضي",
				},
				issues,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص تكوين GraphQL
	 */
	private async checkGraphQLConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		// فحص وجود Apollo Client
		try {
			const apolloConfigPath = path.join(process.cwd(), "src/lib/apollo-client.ts");
			if (!fs.existsSync(apolloConfigPath)) {
				issues.push("ملف apollo-client.ts غير موجود");
			}
		} catch (error) {
			issues.push("خطأ في فحص تكوين Apollo Client");
		}

		// فحص وجود GraphQL schema
		try {
			const schemaPath = path.join(process.cwd(), "src/types/odoo-schema-full");
			if (!fs.existsSync(schemaPath)) {
				issues.push("GraphQL schema غير موجود");
			}
		} catch (error) {
			issues.push("خطأ في فحص GraphQL schema");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين GraphQL صحيح"
				: `❌ مشاكل في تكوين GraphQL: ${issues.join(", ")}`,
			details: {
				issues,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص تكوين قاعدة البيانات
	 */
	private async checkDatabaseConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		// فحص متغيرات قاعدة البيانات
		const dbUrl = process.env.DATABASE_URL;
		if (!dbUrl) {
			issues.push("DATABASE_URL غير محدد");
		} else if (!this.isValidDatabaseUrl(dbUrl)) {
			issues.push("DATABASE_URL غير صحيح");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين قاعدة البيانات صحيح"
				: `❌ مشاكل في تكوين قاعدة البيانات: ${issues.join(", ")}`,
			details: {
				issues,
				hasDatabaseUrl: !!dbUrl,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص تكوين Redis
	 */
	private async checkRedisConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		// فحص متغيرات Redis
		const redisUrl = process.env.REDIS_URL;
		if (!redisUrl) {
			issues.push("REDIS_URL غير محدد");
		} else if (!this.isValidRedisUrl(redisUrl)) {
			issues.push("REDIS_URL غير صحيح");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين Redis صحيح"
				: `❌ مشاكل في تكوين Redis: ${issues.join(", ")}`,
			details: {
				issues,
				hasRedisUrl: !!redisUrl,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning", // Redis اختياري
		});
	}

	/**
	 * فحص تكوين البريد الإلكتروني
	 */
	private async checkEmailConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		// فحص متغيرات البريد الإلكتروني
		const emailConfig = {
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		};

		if (!emailConfig.host) issues.push("EMAIL_HOST غير محدد");
		if (!emailConfig.port) issues.push("EMAIL_PORT غير محدد");
		if (!emailConfig.user) issues.push("EMAIL_USER غير محدد");
		if (!emailConfig.pass) issues.push("EMAIL_PASS غير محدد");

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين البريد الإلكتروني صحيح"
				: `❌ مشاكل في تكوين البريد الإلكتروني: ${issues.join(", ")}`,
			details: {
				issues,
				hasEmailConfig: Object.values(emailConfig).some(v => !!v),
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning", // البريد الإلكتروني اختياري
		});
	}

	/**
	 * فحص إعدادات الأمان
	 */
	private async checkSecurityConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		// فحص متغيرات الأمان
		const securityConfig = {
			secret: process.env.NEXTAUTH_SECRET,
			url: process.env.NEXTAUTH_URL,
			csrfToken: process.env.CSRF_TOKEN,
		};

		if (!securityConfig.secret) {
			issues.push("NEXTAUTH_SECRET غير محدد");
		} else if (securityConfig.secret.length < 32) {
			issues.push("NEXTAUTH_SECRET قصير جداً (يجب 32 حرف على الأقل)");
		}

		if (!securityConfig.url) {
			issues.push("NEXTAUTH_URL غير محدد");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ إعدادات الأمان صحيحة"
				: `❌ مشاكل في إعدادات الأمان: ${issues.join(", ")}`,
			details: {
				issues,
				hasSecurityConfig: Object.values(securityConfig).some(v => !!v),
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص تكوين Next.js
	 */
	private async checkNextJSConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		try {
			const nextConfigPath = path.join(process.cwd(), "next.config.js");
			if (!fs.existsSync(nextConfigPath)) {
				issues.push("next.config.js غير موجود");
			} else {
				// فحص محتوى الملف
				const configContent = fs.readFileSync(nextConfigPath, "utf8");
				if (!configContent.includes("experimental")) {
					issues.push("next.config.js لا يحتوي على إعدادات experimental");
				}
			}
		} catch (error) {
			issues.push("خطأ في فحص next.config.js");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين Next.js صحيح"
				: `⚠️ مشاكل في تكوين Next.js: ${issues.join(", ")}`,
			details: {
				issues,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * فحص تكوين TypeScript
	 */
	private async checkTypeScriptConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		try {
			const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
			if (!fs.existsSync(tsConfigPath)) {
				issues.push("tsconfig.json غير موجود");
			} else {
				// فحص محتوى الملف
				const configContent = fs.readFileSync(tsConfigPath, "utf8");
				const config = JSON.parse(configContent);

				if (!config.compilerOptions) {
					issues.push("tsconfig.json لا يحتوي على compilerOptions");
				} else {
					if (!config.compilerOptions.strict) {
						issues.push("TypeScript strict mode غير مفعل");
					}
					if (!config.compilerOptions.esModuleInterop) {
						issues.push("esModuleInterop غير مفعل");
					}
				}
			}
		} catch (error) {
			issues.push("خطأ في فحص tsconfig.json");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين TypeScript صحيح"
				: `⚠️ مشاكل في تكوين TypeScript: ${issues.join(", ")}`,
			details: {
				issues,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * فحص تكوين ESLint
	 */
	private async checkESLintConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		try {
			const eslintConfigPath = path.join(process.cwd(), ".eslintrc.json");
			if (!fs.existsSync(eslintConfigPath)) {
				issues.push(".eslintrc.json غير موجود");
			} else {
				// فحص محتوى الملف
				const configContent = fs.readFileSync(eslintConfigPath, "utf8");
				const config = JSON.parse(configContent);

				if (!config.extends) {
					issues.push("ESLint لا يحتوي على extends");
				}
				if (!config.rules) {
					issues.push("ESLint لا يحتوي على rules");
				}
			}
		} catch (error) {
			issues.push("خطأ في فحص .eslintrc.json");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين ESLint صحيح"
				: `⚠️ مشاكل في تكوين ESLint: ${issues.join(", ")}`,
			details: {
				issues,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * فحص تكوين Prettier
	 */
	private async checkPrettierConfiguration(): Promise<void> {
		const startTime = Date.now();
		const issues: string[] = [];

		try {
			const prettierConfigPath = path.join(process.cwd(), ".prettierrc");
			if (!fs.existsSync(prettierConfigPath)) {
				issues.push(".prettierrc غير موجود");
			} else {
				// فحص محتوى الملف
				const configContent = fs.readFileSync(prettierConfigPath, "utf8");
				const config = JSON.parse(configContent);

				if (!config.semi) {
					issues.push("Prettier semi غير محدد");
				}
				if (!config.singleQuote) {
					issues.push("Prettier singleQuote غير محدد");
				}
			}
		} catch (error) {
			issues.push("خطأ في فحص .prettierrc");
		}

		const success = issues.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ تكوين Prettier صحيح"
				: `⚠️ مشاكل في تكوين Prettier: ${issues.join(", ")}`,
			details: {
				issues,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * الحصول على تكوين Odoo
	 */
	private getOdooConfig(): OdooConfig {
		return {
			graphqlUrl: process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL,
			apiKey: process.env.NEXT_PUBLIC_ODOO_API_KEY,
			database: process.env.NEXT_PUBLIC_ODOO_DATABASE,
			timeout: process.env.ODOO_TIMEOUT ? parseInt(process.env.ODOO_TIMEOUT) : undefined,
		};
	}

	/**
	 * إخفاء القيم الحساسة
	 */
	private maskSensitiveValue(value: string): string {
		if (value.length <= 8) {
			return "*".repeat(value.length);
		}
		return value.substring(0, 4) + "*".repeat(value.length - 8) + value.substring(value.length - 4);
	}

	/**
	 * التحقق من صحة متغير البيئة
	 */
	private validateEnvVar(name: string, value?: string): boolean {
		if (!value) return false;

		switch (name) {
			case "NEXT_PUBLIC_ODOO_GRAPHQL_URL":
				return this.isValidUrl(value);
			case "NEXT_PUBLIC_ODOO_API_KEY":
				return value.length >= 10;
			case "NEXTAUTH_SECRET":
				return value.length >= 32;
			default:
				return value.length > 0;
		}
	}

	/**
	 * التحقق من إمكانية قراءة الملف
	 */
	private isFileReadable(filePath: string): boolean {
		try {
			fs.accessSync(filePath, fs.constants.R_OK);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * التحقق من صحة الملف
	 */
	private validateFile(filePath: string): boolean {
		try {
			const content = fs.readFileSync(filePath, "utf8");
			return content.length > 0;
		} catch {
			return false;
		}
	}

	/**
	 * التحقق من صحة URL
	 */
	private isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * التحقق من صحة رابط قاعدة البيانات
	 */
	private isValidDatabaseUrl(url: string): boolean {
		return url.startsWith("postgresql://") || url.startsWith("mysql://") || url.startsWith("mongodb://");
	}

	/**
	 * التحقق من صحة رابط Redis
	 */
	private isValidRedisUrl(url: string): boolean {
		return url.startsWith("redis://") || url.startsWith("rediss://");
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

export default ConfigurationValidator;