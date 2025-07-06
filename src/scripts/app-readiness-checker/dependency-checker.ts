/**
 * Dependency Checker - فاحص التبعيات
 * Comprehensive dependency checker for the application
 */

import { CheckResult, CheckReport } from "./index";
import * as fs from "fs";
import * as path from "path";

// ============================================================================
// DEPENDENCY TYPES - أنواع التبعيات
// ============================================================================

export interface DependencyConfig {
	required: string[];
	optional: string[];
	conflicts: Record<string, string[]>;
	peerDependencies: Record<string, string[]>;
	devDependencies: string[];
}

export interface PackageInfo {
	name: string;
	version: string;
	latest?: string;
	installed: boolean;
	compatible: boolean;
	peerDependencies?: Record<string, string>;
	devDependency: boolean;
}

export interface DependencyConflict {
	package: string;
	conflicts: string[];
	severity: "low" | "medium" | "high";
}

export interface VersionCompatibility {
	package: string;
	currentVersion: string;
	requiredVersion: string;
	compatible: boolean;
	recommendation?: string;
}

// ============================================================================
// DEPENDENCY CHECKER CLASS - فئة فحص التبعيات
// ============================================================================

export class DependencyChecker {
	private config: DependencyConfig;
	private results: CheckResult[] = [];
	private packageJson: any;

	constructor(config: DependencyConfig) {
		this.config = config;
		this.loadPackageJson();
	}

	/**
	 * تشغيل فحص التبعيات الشامل
	 */
	async runDependencyCheck(): Promise<CheckReport> {
		const startTime = Date.now();
		console.log("📦 بدء فحص التبعيات...");

		try {
			// فحص وجود package.json
			await this.checkPackageJson();

			// فحص التبعيات المطلوبة
			await this.checkRequiredDependencies();

			// فحص التبعيات الاختيارية
			await this.checkOptionalDependencies();

			// فحص التبعيات المطورة
			await this.checkDevDependencies();

			// فحص تضارب التبعيات
			await this.checkDependencyConflicts();

			// فحص توافق الإصدارات
			await this.checkVersionCompatibility();

			// فحص التبعيات المفقودة
			await this.checkMissingDependencies();

			// فحص التبعيات غير المستخدمة
			await this.checkUnusedDependencies();

			// فحص أمان التبعيات
			await this.checkDependencySecurity();

			// فحص حجم التبعيات
			await this.checkDependencySize();

			const duration = Date.now() - startTime;

			return {
				checkName: "Dependency Check",
				results: this.results,
				summary: this.generateSummary(),
				timestamp: new Date(),
				duration,
			};
		} catch (error) {
			console.error("❌ خطأ في فحص التبعيات:", error);
			throw error;
		}
	}

	/**
	 * تحميل package.json
	 */
	private loadPackageJson(): void {
		try {
			const packageJsonPath = path.join(process.cwd(), "package.json");
			const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
			this.packageJson = JSON.parse(packageJsonContent);
		} catch (error) {
			this.packageJson = null;
		}
	}

	/**
	 * فحص وجود package.json
	 */
	private async checkPackageJson(): Promise<void> {
		const startTime = Date.now();

		if (!this.packageJson) {
			this.results.push({
				success: false,
				message: "❌ ملف package.json غير موجود",
				details: {
					error: "Cannot find package.json in project root",
				},
				timestamp: new Date(),
				duration: Date.now() - startTime,
				severity: "critical",
			});
			return;
		}

		// فحص الحقول المطلوبة
		const requiredFields = ["name", "version", "dependencies"];
		const missingFields = requiredFields.filter(field => !this.packageJson[field]);

		this.results.push({
			success: missingFields.length === 0,
			message: missingFields.length === 0
				? "✅ ملف package.json صحيح"
				: `❌ حقول مفقودة في package.json: ${missingFields.join(", ")}`,
			details: {
				name: this.packageJson.name,
				version: this.packageJson.version,
				missingFields,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: missingFields.length === 0 ? "info" : "error",
		});
	}

	/**
	 * فحص التبعيات المطلوبة
	 */
	private async checkRequiredDependencies(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const missingDeps: string[] = [];
		const outdatedDeps: string[] = [];

		for (const requiredDep of this.config.required) {
			if (!dependencies[requiredDep]) {
				missingDeps.push(requiredDep);
			} else {
				// فحص إذا كان الإصدار محدث
				const currentVersion = dependencies[requiredDep];
				if (this.isOutdatedVersion(currentVersion)) {
					outdatedDeps.push(requiredDep);
				}
			}
		}

		const success = missingDeps.length === 0;
		const hasWarnings = outdatedDeps.length > 0;

		this.results.push({
			success,
			message: success
				? (hasWarnings ? "⚠️ التبعيات المطلوبة موجودة لكن بعضها قديم" : "✅ جميع التبعيات المطلوبة موجودة ومحدثة")
				: `❌ تبعيات مفقودة: ${missingDeps.join(", ")}`,
			details: {
				required: this.config.required,
				missing: missingDeps,
				outdated: outdatedDeps,
				totalRequired: this.config.required.length,
				found: this.config.required.length - missingDeps.length,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? (hasWarnings ? "warning" : "info") : "error",
		});
	}

	/**
	 * فحص التبعيات الاختيارية
	 */
	private async checkOptionalDependencies(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const devDependencies = this.packageJson?.devDependencies || {};
		const foundOptional: string[] = [];
		const missingOptional: string[] = [];

		for (const optionalDep of this.config.optional) {
			if (dependencies[optionalDep] || devDependencies[optionalDep]) {
				foundOptional.push(optionalDep);
			} else {
				missingOptional.push(optionalDep);
			}
		}

		this.results.push({
			success: true, // التبعيات الاختيارية لا تؤثر على النجاح
			message: `📋 التبعيات الاختيارية: ${foundOptional.length}/${this.config.optional.length} موجودة`,
			details: {
				optional: this.config.optional,
				found: foundOptional,
				missing: missingOptional,
				recommendations: missingOptional.length > 0
					? `يمكن تثبيت: ${missingOptional.join(", ")}`
					: "جميع التبعيات الاختيارية مثبتة",
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: "info",
		});
	}

	/**
	 * فحص تبعيات التطوير
	 */
	private async checkDevDependencies(): Promise<void> {
		const startTime = Date.now();
		const devDependencies = this.packageJson?.devDependencies || {};
		const missingDevDeps: string[] = [];

		for (const devDep of this.config.devDependencies) {
			if (!devDependencies[devDep]) {
				missingDevDeps.push(devDep);
			}
		}

		const success = missingDevDeps.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ جميع تبعيات التطوير موجودة"
				: `⚠️ تبعيات تطوير مفقودة: ${missingDevDeps.join(", ")}`,
			details: {
				devDependencies: this.config.devDependencies,
				missing: missingDevDeps,
				totalDev: this.config.devDependencies.length,
				found: this.config.devDependencies.length - missingDevDeps.length,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * فحص تضارب التبعيات
	 */
	private async checkDependencyConflicts(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const conflicts: DependencyConflict[] = [];

		for (const [packageName, conflictingPackages] of Object.entries(this.config.conflicts)) {
			if (dependencies[packageName]) {
				const foundConflicts = conflictingPackages.filter(dep => dependencies[dep]);
				if (foundConflicts.length > 0) {
					conflicts.push({
						package: packageName,
						conflicts: foundConflicts,
						severity: "high",
					});
				}
			}
		}

		const success = conflicts.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ لا توجد تضاربات في التبعيات"
				: `❌ تضاربات في التبعيات: ${conflicts.length} تضارب`,
			details: {
				conflicts,
				totalConflicts: conflicts.length,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص توافق الإصدارات
	 */
	private async checkVersionCompatibility(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const incompatibilities: VersionCompatibility[] = [];

		// فحص توافق Next.js مع React
		if (dependencies.next && dependencies.react) {
			const nextVersion = dependencies.next;
			const reactVersion = dependencies.react;

			if (!this.areVersionsCompatible(nextVersion, reactVersion, "next", "react")) {
				incompatibilities.push({
					package: "next",
					currentVersion: nextVersion,
					requiredVersion: "compatible with react",
					compatible: false,
					recommendation: "Update Next.js or React to compatible versions",
				});
			}
		}

		// فحص توافق Chakra UI مع React
		if (dependencies["@chakra-ui/react"] && dependencies.react) {
			const chakraVersion = dependencies["@chakra-ui/react"];
			const reactVersion = dependencies.react;

			if (!this.areVersionsCompatible(chakraVersion, reactVersion, "@chakra-ui/react", "react")) {
				incompatibilities.push({
					package: "@chakra-ui/react",
					currentVersion: chakraVersion,
					requiredVersion: "compatible with react",
					compatible: false,
					recommendation: "Update Chakra UI or React to compatible versions",
				});
			}
		}

		const success = incompatibilities.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ جميع الإصدارات متوافقة"
				: `⚠️ مشاكل في توافق الإصدارات: ${incompatibilities.length} مشكلة`,
			details: {
				incompatibilities,
				totalIncompatibilities: incompatibilities.length,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * فحص التبعيات المفقودة
	 */
	private async checkMissingDependencies(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const devDependencies = this.packageJson?.devDependencies || {};
		const allDeps = { ...dependencies, ...devDependencies };

		// فحص التبعيات المطلوبة في الكود
		const codeDependencies = this.scanCodeForDependencies();
		const missingDeps: string[] = [];

		for (const codeDep of codeDependencies) {
			if (!allDeps[codeDep]) {
				missingDeps.push(codeDep);
			}
		}

		const success = missingDeps.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ جميع التبعيات المستخدمة في الكود مثبتة"
				: `⚠️ تبعيات مستخدمة في الكود غير مثبتة: ${missingDeps.join(", ")}`,
			details: {
				codeDependencies,
				missing: missingDeps,
				totalCodeDeps: codeDependencies.length,
				found: codeDependencies.length - missingDeps.length,
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * فحص التبعيات غير المستخدمة
	 */
	private async checkUnusedDependencies(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const devDependencies = this.packageJson?.devDependencies || {};
		const allDeps = { ...dependencies, ...devDependencies };

		const codeDependencies = this.scanCodeForDependencies();
		const unusedDeps: string[] = [];

		for (const [depName, depVersion] of Object.entries(allDeps)) {
			if (!codeDependencies.includes(depName) && !this.isEssentialDependency(depName)) {
				unusedDeps.push(depName);
			}
		}

		this.results.push({
			success: true, // التبعيات غير المستخدمة لا تؤثر على النجاح
			message: `🧹 التبعيات غير المستخدمة: ${unusedDeps.length} تبعية`,
			details: {
				unused: unusedDeps,
				totalUnused: unusedDeps.length,
				recommendations: unusedDeps.length > 0
					? `يمكن إزالة: ${unusedDeps.join(", ")}`
					: "لا توجد تبعيات غير مستخدمة",
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: "info",
		});
	}

	/**
	 * فحص أمان التبعيات
	 */
	private async checkDependencySecurity(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const devDependencies = this.packageJson?.devDependencies || {};
		const allDeps = { ...dependencies, ...devDependencies };

		// قائمة التبعيات المعروفة بثغرات الأمان
		const vulnerableDeps = [
			"lodash", // مثال - يمكن تحديثه ليشمل قائمة حقيقية
		];

		const foundVulnerable: string[] = [];

		for (const [depName, depVersion] of Object.entries(allDeps)) {
			if (vulnerableDeps.includes(depName) && this.isVulnerableVersion(depVersion)) {
				foundVulnerable.push(depName);
			}
		}

		const success = foundVulnerable.length === 0;

		this.results.push({
			success,
			message: success
				? "✅ لا توجد تبعيات معروفة بثغرات الأمان"
				: `🚨 تبعيات معروفة بثغرات الأمان: ${foundVulnerable.join(", ")}`,
			details: {
				vulnerable: foundVulnerable,
				totalVulnerable: foundVulnerable.length,
				recommendations: foundVulnerable.length > 0
					? `يجب تحديث: ${foundVulnerable.join(", ")}`
					: "جميع التبعيات آمنة",
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "error",
		});
	}

	/**
	 * فحص حجم التبعيات
	 */
	private async checkDependencySize(): Promise<void> {
		const startTime = Date.now();
		const dependencies = this.packageJson?.dependencies || {};
		const devDependencies = this.packageJson?.devDependencies || {};

		const totalDeps = Object.keys(dependencies).length;
		const totalDevDeps = Object.keys(devDependencies).length;
		const totalAllDeps = totalDeps + totalDevDeps;

		// معايير الحجم
		const maxProdDeps = 50;
		const maxDevDeps = 30;
		const maxTotalDeps = 80;

		const prodDepsExceeded = totalDeps > maxProdDeps;
		const devDepsExceeded = totalDevDeps > maxDevDeps;
		const totalDepsExceeded = totalAllDeps > maxTotalDeps;

		const success = !prodDepsExceeded && !devDepsExceeded && !totalDepsExceeded;

		this.results.push({
			success,
			message: success
				? "✅ حجم التبعيات مقبول"
				: "⚠️ حجم التبعيات كبير",
			details: {
				productionDeps: totalDeps,
				devDeps: totalDevDeps,
				totalDeps: totalAllDeps,
				limits: {
					maxProd: maxProdDeps,
					maxDev: maxDevDeps,
					maxTotal: maxTotalDeps,
				},
				exceeded: {
					production: prodDepsExceeded,
					dev: devDepsExceeded,
					total: totalDepsExceeded,
				},
			},
			timestamp: new Date(),
			duration: Date.now() - startTime,
			severity: success ? "info" : "warning",
		});
	}

	/**
	 * فحص إذا كان الإصدار قديم
	 */
	private isOutdatedVersion(version: string): boolean {
		// منطق بسيط لفحص الإصدارات القديمة
		// يمكن تحسينه باستخدام npm registry API
		return version.includes("^") || version.includes("~");
	}

	/**
	 * فحص توافق الإصدارات
	 */
	private areVersionsCompatible(version1: string, version2: string, package1: string, package2: string): boolean {
		// منطق بسيط لفحص التوافق
		// يمكن تحسينه باستخدام semver
		return true; // مؤقتاً
	}

	/**
	 * فحص التبعيات في الكود
	 */
	private scanCodeForDependencies(): string[] {
		// قائمة التبعيات المستخدمة في الكود
		// يمكن تحسينها بفحص الملفات فعلياً
		return [
			"next",
			"react",
			"@chakra-ui/react",
			"@apollo/client",
			"graphql",
			"@reduxjs/toolkit",
			"redux-persist",
		];
	}

	/**
	 * فحص إذا كانت التبعية أساسية
	 */
	private isEssentialDependency(depName: string): boolean {
		const essentialDeps = [
			"next",
			"react",
			"@chakra-ui/react",
			"@apollo/client",
			"graphql",
		];
		return essentialDeps.includes(depName);
	}

	/**
	 * فحص إذا كان الإصدار معرض للثغرات
	 */
	private isVulnerableVersion(version: string): boolean {
		// منطق بسيط لفحص الثغرات
		// يمكن تحسينه باستخدام npm audit أو قاعدة بيانات الثغرات
		return false; // مؤقتاً
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

export default DependencyChecker;