/**
 * Currency Settings Service - نظام العملات المتكامل
 * خدمة إدارة إعدادات العملة والإحصائيات
 */

import { CurrencyCode } from "../types/currency.types";
import {
	CurrencySettings,
	UsageStats,
	UsageRecord,
	ServiceStatus,
} from "./types/settings.types";
import {
	getDefaultSettings,
	validateSettings,
	updateSettings as updateSettingsHelper,
	createNewUsageStats,
	updateUsageStats,
	resetDailyStats,
	calculateSuccessRate,
	calculateCacheHitRate,
	createUsageRecord,
	saveSettingsToStorage,
	loadSettingsFromStorage,
	saveStatsToStorage,
	loadStatsFromStorage,
	createNewServiceStatus,
	updateProviderHealth,
	addError,
} from "./helpers/settings.helpers";

class CurrencySettingsService {
	private settings: CurrencySettings;
	private usageStats: UsageStats;
	private serviceStatus: ServiceStatus;
	private usageRecords: UsageRecord[] = [];

	constructor() {
		// تحميل الإعدادات من التخزين المحلي أو استخدام الافتراضية
		const storedSettings = loadSettingsFromStorage();
		this.settings = storedSettings || getDefaultSettings();

		// تحميل الإحصائيات من التخزين المحلي أو إنشاء جديدة
		const storedStats = loadStatsFromStorage();
		this.usageStats = storedStats || createNewUsageStats();

		// إنشاء حالة خدمة جديدة
		this.serviceStatus = createNewServiceStatus();

		// حفظ الإعدادات الافتراضية إذا لم تكن موجودة
		if (!storedSettings) {
			this.saveSettings();
		}
	}

	/**
	 * الحصول على الإعدادات الحالية
	 */
	getSettings(): CurrencySettings {
		return { ...this.settings };
	}

	/**
	 * تحديث الإعدادات
	 */
	updateSettings(newSettings: Partial<CurrencySettings>): boolean {
		const updated = updateSettingsHelper(this.settings, newSettings);

		if (validateSettings(updated)) {
			this.settings = updated;
			this.saveSettings();
			return true;
		}

		return false;
	}

	/**
	 * إعادة تعيين الإعدادات إلى الافتراضية
	 */
	resetSettings(): void {
		this.settings = getDefaultSettings();
		this.saveSettings();
	}

	/**
	 * الحصول على العملة الافتراضية
	 */
	getDefaultCurrency(): CurrencyCode {
		return this.settings.defaultCurrency;
	}

	/**
	 * تعيين العملة الافتراضية
	 */
	setDefaultCurrency(currency: CurrencyCode): boolean {
		if (this.settings.supportedCurrencies.includes(currency)) {
			this.settings.defaultCurrency = currency;
			this.saveSettings();
			return true;
		}
		return false;
	}

	/**
	 * الحصول على العملات المدعومة
	 */
	getSupportedCurrencies(): CurrencyCode[] {
		return [...this.settings.supportedCurrencies];
	}

	/**
	 * إضافة عملة مدعومة
	 */
	addSupportedCurrency(currency: CurrencyCode): boolean {
		if (!this.settings.supportedCurrencies.includes(currency)) {
			this.settings.supportedCurrencies.push(currency);
			this.saveSettings();
			return true;
		}
		return false;
	}

	/**
	 * إزالة عملة مدعومة
	 */
	removeSupportedCurrency(currency: CurrencyCode): boolean {
		if (currency === this.settings.defaultCurrency) {
			return false; // لا يمكن إزالة العملة الافتراضية
		}

		const index = this.settings.supportedCurrencies.indexOf(currency);
		if (index > -1) {
			this.settings.supportedCurrencies.splice(index, 1);
			this.saveSettings();
			return true;
		}
		return false;
	}

	/**
	 * التحقق من تفعيل التخزين المؤقت
	 */
	isCacheEnabled(): boolean {
		return this.settings.cacheEnabled;
	}

	/**
	 * تفعيل/إلغاء تفعيل التخزين المؤقت
	 */
	setCacheEnabled(enabled: boolean): void {
		this.settings.cacheEnabled = enabled;
		this.saveSettings();
	}

	/**
	 * الحصول على TTL التخزين المؤقت
	 */
	getCacheTTL(): number {
		return this.settings.cacheTTL;
	}

	/**
	 * تعيين TTL التخزين المؤقت
	 */
	setCacheTTL(ttl: number): void {
		if (ttl > 0) {
			this.settings.cacheTTL = ttl;
			this.saveSettings();
		}
	}

	/**
	 * الحصول على مزود API الحالي
	 */
	getCurrentProvider(): string {
		return this.settings.apiProvider;
	}

	/**
	 * تعيين مزود API
	 */
	setProvider(provider: string): void {
		this.settings.apiProvider = provider;
		this.saveSettings();
	}

	/**
	 * تسجيل استخدام API
	 */
	recordUsage(
		fromCurrency: CurrencyCode,
		toCurrency: CurrencyCode,
		responseTime: number,
		success: boolean,
		cached: boolean,
		provider: string,
		error?: string,
	): void {
		const record = createUsageRecord(
			fromCurrency,
			toCurrency,
			responseTime,
			success,
			cached,
			provider,
			error,
		);

		this.usageRecords.push(record);
		this.usageStats = updateUsageStats(this.usageStats, record);

		// الاحتفاظ بآخر 1000 سجل فقط
		if (this.usageRecords.length > 1000) {
			this.usageRecords = this.usageRecords.slice(-1000);
		}

		this.saveStats();
	}

	/**
	 * الحصول على إحصائيات الاستخدام
	 */
	getUsageStats(): UsageStats {
		return { ...this.usageStats };
	}

	/**
	 * الحصول على معدل النجاح
	 */
	getSuccessRate(): number {
		return calculateSuccessRate(this.usageStats);
	}

	/**
	 * الحصول على معدل التخزين المؤقت
	 */
	getCacheHitRate(): number {
		return calculateCacheHitRate(this.usageStats);
	}

	/**
	 * إعادة تعيين الإحصائيات
	 */
	resetStats(): void {
		this.usageStats = createNewUsageStats();
		this.usageRecords = [];
		this.saveStats();
	}

	/**
	 * الحصول على حالة الخدمة
	 */
	getServiceStatus(): ServiceStatus {
		return { ...this.serviceStatus };
	}

	/**
	 * تحديث حالة مزود الخدمة
	 */
	updateProviderHealth(
		provider: string,
		isHealthy: boolean,
		responseTime: number,
		success: boolean,
	): void {
		this.serviceStatus = updateProviderHealth(
			this.serviceStatus,
			provider,
			isHealthy,
			responseTime,
			success,
		);
	}

	/**
	 * تسجيل خطأ
	 */
	recordError(type: string, message: string, provider: string): void {
		this.serviceStatus = addError(this.serviceStatus, type, message, provider);
	}

	/**
	 * الحصول على سجلات الاستخدام
	 */
	getUsageRecords(limit: number = 100): UsageRecord[] {
		return this.usageRecords.slice(-limit);
	}

	/**
	 * الحصول على سجلات الاستخدام لليوم الحالي
	 */
	getTodayUsageRecords(): UsageRecord[] {
		const today = new Date().toDateString();
		return this.usageRecords.filter(
			(record) => new Date(record.timestamp).toDateString() === today,
		);
	}

	/**
	 * الحصول على إحصائيات اليوم الحالي
	 */
	getTodayStats(): {
		requests: number;
		hits: number;
		misses: number;
		errors: number;
		successRate: number;
		cacheHitRate: number;
	} {
		const todayRecords = this.getTodayUsageRecords();
		const requests = todayRecords.length;
		const hits = todayRecords.filter((r) => r.cached).length;
		const misses = requests - hits;
		const errors = todayRecords.filter((r) => !r.success).length;

		return {
			requests,
			hits,
			misses,
			errors,
			successRate: requests > 0 ? ((requests - errors) / requests) * 100 : 100,
			cacheHitRate: requests > 0 ? (hits / requests) * 100 : 0,
		};
	}

	/**
	 * حفظ الإعدادات
	 */
	private saveSettings(): void {
		saveSettingsToStorage(this.settings);
	}

	/**
	 * حفظ الإحصائيات
	 */
	private saveStats(): void {
		saveStatsToStorage(this.usageStats);
	}
}

// تصدير نسخة واحدة من الخدمة
const currencySettingsService = new CurrencySettingsService();
export default currencySettingsService;
