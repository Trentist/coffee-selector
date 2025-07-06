/**
 * Currency Settings Service Helpers - نظام العملات المتكامل
 * دوال مساعدة لخدمة الإعدادات
 */

import { CurrencyCode } from "../../types/currency.types";
import {
	CurrencySettings,
	UsageStats,
	UsageRecord,
	ServiceStatus,
} from "../types/settings.types";

/**
 * الإعدادات الافتراضية
 */
export function getDefaultSettings(): CurrencySettings {
	return {
		defaultCurrency: "AED",
		supportedCurrencies: [
			"AED",
			"SAR",
			"KWD",
			"QAR",
			"OMR",
			"BHD",
			"EGP",
			"USD",
			"EUR",
			"GBP",
		],
		autoDetectLocation: true,
		cacheEnabled: true,
		cacheTTL: 4 * 60 * 60 * 1000, // 4 ساعات
		apiProvider: "exchangeRateApi",
		fallbackEnabled: true,
		updateInterval: 30 * 60 * 1000, // 30 دقيقة
		notifications: {
			enabled: true,
			rateChanges: true,
			apiErrors: true,
		},
	};
}

/**
 * التحقق من صحة الإعدادات
 */
export function validateSettings(settings: CurrencySettings): boolean {
	return !!(
		settings.defaultCurrency &&
		settings.supportedCurrencies.length > 0 &&
		settings.supportedCurrencies.includes(settings.defaultCurrency) &&
		settings.cacheTTL > 0 &&
		settings.updateInterval > 0
	);
}

/**
 * تحديث الإعدادات مع الحفاظ على القيم الصحيحة
 */
export function updateSettings(
	currentSettings: CurrencySettings,
	newSettings: Partial<CurrencySettings>,
): CurrencySettings {
	const updated = { ...currentSettings, ...newSettings };

	// التحقق من صحة الإعدادات المحدثة
	if (!validateSettings(updated)) {
		console.warn("Invalid settings detected, reverting to defaults");
		return getDefaultSettings();
	}

	return updated;
}

/**
 * إنشاء إحصائيات استخدام جديدة
 */
export function createNewUsageStats(): UsageStats {
	return {
		totalRequests: 0,
		cacheHits: 0,
		cacheMisses: 0,
		apiCalls: 0,
		errors: 0,
		lastReset: new Date().toDateString(),
		dailyStats: {},
	};
}

/**
 * تحديث إحصائيات الاستخدام
 */
export function updateUsageStats(
	stats: UsageStats,
	record: UsageRecord,
): UsageStats {
	const updated = { ...stats };

	updated.totalRequests++;

	if (record.cached) {
		updated.cacheHits++;
	} else {
		updated.cacheMisses++;
	}

	if (!record.cached) {
		updated.apiCalls++;
	}

	if (!record.success) {
		updated.errors++;
	}

	// تحديث الإحصائيات اليومية
	const today = new Date().toDateString();
	if (!updated.dailyStats[today]) {
		updated.dailyStats[today] = {
			requests: 0,
			hits: 0,
			misses: 0,
			errors: 0,
		};
	}

	updated.dailyStats[today].requests++;
	if (record.cached) {
		updated.dailyStats[today].hits++;
	} else {
		updated.dailyStats[today].misses++;
	}
	if (!record.success) {
		updated.dailyStats[today].errors++;
	}

	return updated;
}

/**
 * إعادة تعيين الإحصائيات اليومية
 */
export function resetDailyStats(stats: UsageStats): UsageStats {
	return {
		...stats,
		totalRequests: 0,
		cacheHits: 0,
		cacheMisses: 0,
		apiCalls: 0,
		errors: 0,
		lastReset: new Date().toDateString(),
	};
}

/**
 * حساب معدل النجاح
 */
export function calculateSuccessRate(stats: UsageStats): number {
	if (stats.totalRequests === 0) return 100;

	const successfulRequests = stats.totalRequests - stats.errors;
	return (successfulRequests / stats.totalRequests) * 100;
}

/**
 * حساب معدل التخزين المؤقت
 */
export function calculateCacheHitRate(stats: UsageStats): number {
	if (stats.totalRequests === 0) return 0;

	return (stats.cacheHits / stats.totalRequests) * 100;
}

/**
 * إنشاء سجل استخدام جديد
 */
export function createUsageRecord(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
	responseTime: number,
	success: boolean,
	cached: boolean,
	provider: string,
	error?: string,
): UsageRecord {
	return {
		timestamp: Date.now(),
		fromCurrency,
		toCurrency,
		responseTime,
		success,
		cached,
		provider,
		error,
	};
}

/**
 * حفظ الإعدادات في التخزين المحلي
 */
export function saveSettingsToStorage(settings: CurrencySettings): void {
	if (typeof window !== "undefined") {
		try {
			localStorage.setItem("currency-settings", JSON.stringify(settings));
		} catch (error) {
			console.warn("Failed to save settings to localStorage:", error);
		}
	}
}

/**
 * تحميل الإعدادات من التخزين المحلي
 */
export function loadSettingsFromStorage(): CurrencySettings | null {
	if (typeof window !== "undefined") {
		try {
			const stored = localStorage.getItem("currency-settings");
			if (stored) {
				const settings = JSON.parse(stored);
				return validateSettings(settings) ? settings : null;
			}
		} catch (error) {
			console.warn("Failed to load settings from localStorage:", error);
		}
	}
	return null;
}

/**
 * حفظ الإحصائيات في التخزين المحلي
 */
export function saveStatsToStorage(stats: UsageStats): void {
	if (typeof window !== "undefined") {
		try {
			localStorage.setItem("currency-usage-stats", JSON.stringify(stats));
		} catch (error) {
			console.warn("Failed to save stats to localStorage:", error);
		}
	}
}

/**
 * تحميل الإحصائيات من التخزين المحلي
 */
export function loadStatsFromStorage(): UsageStats | null {
	if (typeof window !== "undefined") {
		try {
			const stored = localStorage.getItem("currency-usage-stats");
			return stored ? JSON.parse(stored) : null;
		} catch (error) {
			console.warn("Failed to load stats from localStorage:", error);
		}
	}
	return null;
}

/**
 * إنشاء حالة خدمة جديدة
 */
export function createNewServiceStatus(): ServiceStatus {
	return {
		isActive: true,
		lastUpdate: Date.now(),
		nextUpdate: Date.now() + 30 * 60 * 1000, // 30 دقيقة
		currentProvider: "exchangeRateApi",
		providerHealth: {},
		errors: [],
	};
}

/**
 * تحديث حالة مزود الخدمة
 */
export function updateProviderHealth(
	status: ServiceStatus,
	provider: string,
	isHealthy: boolean,
	responseTime: number,
	success: boolean,
): ServiceStatus {
	const updated = { ...status };

	if (!updated.providerHealth[provider]) {
		updated.providerHealth[provider] = {
			isHealthy: true,
			lastCheck: Date.now(),
			successRate: 100,
			responseTime: 0,
		};
	}

	const health = updated.providerHealth[provider];
	health.isHealthy = isHealthy;
	health.lastCheck = Date.now();
	health.responseTime = responseTime;

	// تحديث معدل النجاح (تبسيط)
	if (success) {
		health.successRate = Math.min(100, health.successRate + 1);
	} else {
		health.successRate = Math.max(0, health.successRate - 5);
	}

	return updated;
}

/**
 * إضافة خطأ إلى سجل الأخطاء
 */
export function addError(
	status: ServiceStatus,
	type: string,
	message: string,
	provider: string,
): ServiceStatus {
	const updated = { ...status };

	updated.errors.push({
		timestamp: Date.now(),
		type,
		message,
		provider,
	});

	// الاحتفاظ بآخر 100 خطأ فقط
	if (updated.errors.length > 100) {
		updated.errors = updated.errors.slice(-100);
	}

	return updated;
}
