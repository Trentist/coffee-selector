/**
 * Currency Cache Service - نظام العملات المتكامل
 * خدمة التخزين المؤقت الذكي لأسعار الصرف مع إدارة الأولويات
 */

import { CurrencyCode } from "../types/currency.types";
import {
	CachedCurrencyData,
	CacheMetrics,
	CacheConfig,
	CacheStatus,
} from "./types/cache.types";
import {
	generateCacheKey,
	getCurrencyPriority,
	getTTLForPriority,
	isCacheValid,
	updateUsageStats,
	resetDailyCounterIfNeeded,
	getItemsNeedingRefresh,
	clearExpiredCache,
	calculateCacheSize,
	calculateHitRate,
	saveMetricsToStorage,
	loadMetricsFromStorage,
} from "./helpers/cache.helpers";

class CurrencyCacheService {
	private cache: Map<string, CachedCurrencyData> = new Map();
	private metrics: CacheMetrics;
	private config: CacheConfig;
	private status: CacheStatus;

	constructor() {
		this.config = {
			ttl: {
				high: 4 * 60 * 60 * 1000, // 4 ساعات
				medium: 8 * 60 * 60 * 1000, // 8 ساعات
				low: 12 * 60 * 60 * 1000, // 12 ساعة
				fixed: 24 * 60 * 60 * 1000, // 24 ساعة
			},
			maxSize: 1000, // أقصى عدد من العناصر
			cleanupInterval: 60 * 60 * 1000, // ساعة واحدة
			autoRefresh: {
				enabled: true,
				interval: 30 * 60 * 1000, // 30 دقيقة
				maxConcurrent: 3,
			},
		};

		this.metrics = {
			totalCacheHits: 0,
			totalCacheMisses: 0,
			apiCallsToday: 0,
			lastResetDate: new Date().toDateString(),
			priorityCurrencies: ["EGP", "TRY", "INR", "PKR", "NGN", "MAD", "DZD"],
			cacheStatus: {},
			totalCachedItems: 0,
			cacheSize: 0,
			averageResponseTime: 0,
		};

		this.status = {
			isEnabled: true,
			lastCleanup: Date.now(),
			nextCleanup: Date.now() + this.config.cleanupInterval,
			totalItems: 0,
			memoryUsage: 0,
			hitRate: 0,
		};

		this.loadMetricsFromStorage();
		this.resetDailyCounterIfNeeded();
		this.startCleanupInterval();
	}

	/**
	 * الحصول على سعر مخزن مؤقتاً أو تحديد الحاجة لطلب API
	 */
	getCachedRate(
		fromCurrency: CurrencyCode,
		toCurrency: CurrencyCode,
	): CachedCurrencyData | null {
		const cacheKey = generateCacheKey(fromCurrency, toCurrency);
		const cached = this.cache.get(cacheKey);

		if (!cached) {
			this.metrics.totalCacheMisses++;
			this.updateMetrics();
			return null;
		}

		const priority = getCurrencyPriority(fromCurrency, toCurrency);
		const ttl = getTTLForPriority(priority);

		// التحقق من صلاحية التخزين المؤقت
		if (isCacheValid(cached, ttl)) {
			this.metrics.totalCacheHits++;
			cached.usageCount++;
			this.updateMetrics();
			return cached;
		}

		// انتهت صلاحية التخزين المؤقت
		this.cache.delete(cacheKey);
		this.metrics.totalCacheMisses++;
		this.updateMetrics();
		return null;
	}

	/**
	 * تخزين سعر الصرف في التخزين المؤقت
	 */
	setCachedRate(
		fromCurrency: CurrencyCode,
		toCurrency: CurrencyCode,
		exchangeRate: number,
		bidPrice?: number,
		askPrice?: number,
		provider: string = "unknown",
	): void {
		const cacheKey = generateCacheKey(fromCurrency, toCurrency);
		const priority = getCurrencyPriority(fromCurrency, toCurrency);

		const cachedData: CachedCurrencyData = {
			exchangeRate,
			fromCurrency,
			toCurrency,
			lastRefreshed: new Date().toISOString(),
			bidPrice,
			askPrice,
			cacheTimestamp: Date.now(),
			usageCount: 1,
			priority,
			provider,
		};

		this.cache.set(cacheKey, cachedData);
		this.metrics.cacheStatus[cacheKey] = cachedData;
		this.updateMetrics();
	}

	/**
	 * التحقق من إمكانية إجراء طلب API (ضمن الحد اليومي)
	 */
	canMakeAPICall(): boolean {
		this.resetDailyCounterIfNeeded();
		return this.metrics.apiCallsToday < 25; // حد الخطة المجانية
	}

	/**
	 * تسجيل استخدام API
	 */
	recordAPICall(): void {
		this.resetDailyCounterIfNeeded();
		this.metrics.apiCallsToday++;
		this.updateMetrics();
	}

	/**
	 * الحصول على الطلبات المتبقية لليوم
	 */
	getRemainingAPICalls(): number {
		this.resetDailyCounterIfNeeded();
		return Math.max(0, 25 - this.metrics.apiCallsToday);
	}

	/**
	 * الحصول على إحصائيات التخزين المؤقت
	 */
	getMetrics(): CacheMetrics {
		return { ...this.metrics };
	}

	/**
	 * الحصول على حالة التخزين المؤقت
	 */
	getStatus(): CacheStatus {
		return {
			...this.status,
			totalItems: this.cache.size,
			memoryUsage: calculateCacheSize(this.cache),
			hitRate: calculateHitRate(this.metrics),
		};
	}

	/**
	 * الحصول على العملات التي تحتاج تحديث
	 */
	getCurrenciesNeedingRefresh(): Array<{
		from: CurrencyCode;
		to: CurrencyCode;
		priority: string;
	}> {
		const items = getItemsNeedingRefresh(this.cache, this.config.ttl);

		return items.map((item) => ({
			from: item.from,
			to: item.to,
			priority: item.priority,
		}));
	}

	/**
	 * تنظيف التخزين المؤقت منتهي الصلاحية
	 */
	clearExpiredCache(): number {
		const clearedCount = clearExpiredCache(this.cache, this.config.ttl);
		this.updateMetrics();
		return clearedCount;
	}

	/**
	 * مسح التخزين المؤقت بالكامل
	 */
	clearCache(): void {
		this.cache.clear();
		this.metrics.cacheStatus = {};
		this.updateMetrics();
	}

	/**
	 * الحصول على حجم التخزين المؤقت
	 */
	getCacheSize(): number {
		return this.cache.size;
	}

	/**
	 * الحصول على معدل النجاح
	 */
	getHitRate(): number {
		return calculateHitRate(this.metrics);
	}

	/**
	 * تحديث الإحصائيات
	 */
	private updateMetrics(): void {
		this.metrics.totalCachedItems = this.cache.size;
		this.metrics.cacheSize = calculateCacheSize(this.cache);
		this.metrics.averageResponseTime = this.calculateAverageResponseTime();

		this.saveMetricsToStorage();
	}

	/**
	 * حساب متوسط وقت الاستجابة
	 */
	private calculateAverageResponseTime(): number {
		// حساب متوسط وقت الاستجابة من البيانات المخزنة
		let totalTime = 0;
		let count = 0;

		for (const cached of this.cache.values()) {
			if (cached.usageCount > 0) {
				totalTime += 50; // وقت تقريبي للاستجابة من التخزين المؤقت
				count++;
			}
		}

		return count > 0 ? totalTime / count : 0;
	}

	/**
	 * تحميل الإحصائيات من التخزين المحلي
	 */
	private loadMetricsFromStorage(): void {
		const stored = loadMetricsFromStorage();
		if (stored) {
			this.metrics = { ...this.metrics, ...stored };
		}
	}

	/**
	 * حفظ الإحصائيات في التخزين المحلي
	 */
	private saveMetricsToStorage(): void {
		saveMetricsToStorage(this.metrics);
	}

	/**
	 * إعادة تعيين العداد اليومي إذا لزم الأمر
	 */
	private resetDailyCounterIfNeeded(): void {
		resetDailyCounterIfNeeded(this.metrics);
	}

	/**
	 * بدء فاصل التنظيف التلقائي
	 */
	private startCleanupInterval(): void {
		if (typeof window !== "undefined") {
			setInterval(() => {
				this.clearExpiredCache();
				this.status.lastCleanup = Date.now();
				this.status.nextCleanup = Date.now() + this.config.cleanupInterval;
			}, this.config.cleanupInterval);
		}
	}
}

// تصدير نسخة واحدة من الخدمة
const currencyCacheService = new CurrencyCacheService();
export default currencyCacheService;
