/**
 * Currency Cache Service Helpers - نظام العملات المتكامل
 * دوال مساعدة لخدمة التخزين المؤقت
 */

import { CurrencyCode } from "../../types/currency.types";
import {
	CachedCurrencyData,
	CurrencyPriority,
	CacheItemNeedingRefresh,
} from "../types/cache.types";
import { isHighPriorityCurrency } from "../../config/currency-data";

/**
 * إنشاء مفتاح التخزين المؤقت
 */
export function generateCacheKey(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): string {
	return `${fromCurrency}-${toCurrency}`;
}

/**
 * تحديد أولوية العملة
 */
export function getCurrencyPriority(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): CurrencyPriority {
	// العملات عالية الأولوية
	if (
		isHighPriorityCurrency(fromCurrency) ||
		isHighPriorityCurrency(toCurrency)
	) {
		return "high";
	}

	// العملات الثابتة منخفضة الأولوية
	if (
		fromCurrency === "AED" ||
		toCurrency === "AED" ||
		fromCurrency === "SAR" ||
		toCurrency === "SAR" ||
		fromCurrency === "KWD" ||
		toCurrency === "KWD" ||
		fromCurrency === "QAR" ||
		toCurrency === "QAR" ||
		fromCurrency === "OMR" ||
		toCurrency === "OMR" ||
		fromCurrency === "BHD" ||
		toCurrency === "BHD"
	) {
		return "low";
	}

	return "medium";
}

/**
 * الحصول على TTL بناءً على الأولوية
 */
export function getTTLForPriority(priority: CurrencyPriority): number {
	const ttlConfig = {
		high: 4 * 60 * 60 * 1000, // 4 ساعات
		medium: 8 * 60 * 60 * 1000, // 8 ساعات
		low: 12 * 60 * 60 * 1000, // 12 ساعة
	};

	return ttlConfig[priority];
}

/**
 * التحقق من صلاحية التخزين المؤقت
 */
export function isCacheValid(cached: CachedCurrencyData, ttl: number): boolean {
	const now = Date.now();
	return now - cached.cacheTimestamp < ttl;
}

/**
 * حساب الوقت المتبقي حتى انتهاء الصلاحية
 */
export function getTimeUntilExpiry(
	cached: CachedCurrencyData,
	ttl: number,
): number {
	const now = Date.now();
	const expiryTime = cached.cacheTimestamp + ttl;
	return Math.max(0, expiryTime - now);
}

/**
 * تحديث إحصائيات الاستخدام
 */
export function updateUsageStats(
	metrics: any,
	isHit: boolean,
	responseTime?: number,
): void {
	if (isHit) {
		metrics.totalCacheHits++;
	} else {
		metrics.totalCacheMisses++;
	}

	if (responseTime !== undefined) {
		const totalRequests = metrics.totalCacheHits + metrics.totalCacheMisses;
		metrics.averageResponseTime =
			(metrics.averageResponseTime * (totalRequests - 1) + responseTime) /
			totalRequests;
	}
}

/**
 * إعادة تعيين العداد اليومي إذا لزم الأمر
 */
export function resetDailyCounterIfNeeded(metrics: any): void {
	const now = new Date();
	const lastReset = new Date(metrics.lastResetDate);

	if (
		now.getDate() !== lastReset.getDate() ||
		now.getMonth() !== lastReset.getMonth() ||
		now.getFullYear() !== lastReset.getFullYear()
	) {
		metrics.apiCallsToday = 0;
		metrics.lastResetDate = now.toDateString();
		metrics.totalCacheHits = 0;
		metrics.totalCacheMisses = 0;
	}
}

/**
 * الحصول على العناصر التي تحتاج تحديث
 */
export function getItemsNeedingRefresh(
	cache: Map<string, CachedCurrencyData>,
	ttlConfig: any,
): CacheItemNeedingRefresh[] {
	const now = Date.now();
	const needRefresh: CacheItemNeedingRefresh[] = [];

	for (const [cacheKey, cached] of cache.entries()) {
		const ttl = getTTLForPriority(cached.priority);
		const timeLeft = ttl - (now - cached.cacheTimestamp);

		// إذا انتهت الصلاحية خلال الساعة القادمة وكانت عالية الاستخدام
		if (timeLeft < 60 * 60 * 1000 && cached.usageCount > 5) {
			needRefresh.push({
				from: cached.fromCurrency,
				to: cached.toCurrency,
				priority: cached.priority,
				timeUntilExpiry: timeLeft,
				usageCount: cached.usageCount,
			});
		}
	}

	// ترتيب حسب الأولوية والاستخدام
	return needRefresh.sort((a, b) => {
		const priorityOrder = { high: 3, medium: 2, low: 1 };
		const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

		if (priorityDiff !== 0) return priorityDiff;

		return b.usageCount - a.usageCount;
	});
}

/**
 * تنظيف التخزين المؤقت منتهي الصلاحية
 */
export function clearExpiredCache(
	cache: Map<string, CachedCurrencyData>,
	ttlConfig: any,
): number {
	const now = Date.now();
	let clearedCount = 0;

	for (const [cacheKey, cached] of cache.entries()) {
		const ttl = getTTLForPriority(cached.priority);

		if (now - cached.cacheTimestamp > ttl) {
			cache.delete(cacheKey);
			clearedCount++;
		}
	}

	return clearedCount;
}

/**
 * حساب حجم التخزين المؤقت
 */
export function calculateCacheSize(
	cache: Map<string, CachedCurrencyData>,
): number {
	let size = 0;

	for (const [key, value] of cache.entries()) {
		size += key.length;
		size += JSON.stringify(value).length;
	}

	return size;
}

/**
 * حساب معدل النجاح
 */
export function calculateHitRate(metrics: any): number {
	const totalRequests = metrics.totalCacheHits + metrics.totalCacheMisses;
	return totalRequests > 0 ? (metrics.totalCacheHits / totalRequests) * 100 : 0;
}

/**
 * حفظ الإحصائيات في التخزين المحلي
 */
export function saveMetricsToStorage(metrics: any): void {
	if (typeof window !== "undefined") {
		try {
			localStorage.setItem("currency-cache-metrics", JSON.stringify(metrics));
		} catch (error) {
			console.warn("Failed to save cache metrics to localStorage:", error);
		}
	}
}

/**
 * تحميل الإحصائيات من التخزين المحلي
 */
export function loadMetricsFromStorage(): any {
	if (typeof window !== "undefined") {
		try {
			const stored = localStorage.getItem("currency-cache-metrics");
			return stored ? JSON.parse(stored) : null;
		} catch (error) {
			console.warn("Failed to load cache metrics from localStorage:", error);
			return null;
		}
	}
	return null;
}

export function getCachedData<T>(key: string): T | null {
	// Implementation of getCachedData
	return null;
}

export function setCachedData<T>(key: string, data: T, ttl?: number): void {
	// Implementation of setCachedData
}

export function clearCache(): void {
	// Implementation of clearCache
}

export function getCacheStats(): CacheStats {
	// Implementation of getCacheStats
	return {} as CacheStats;
}

export function validateCacheKey(key: string): boolean {
	// Implementation of validateCacheKey
	return false;
}

export function getCacheKeys(): string[] {
	// Implementation of getCacheKeys
	return [];
}

export function removeCacheKey(key: string): boolean {
	// Implementation of removeCacheKey
	return false;
}

export function getCacheSize(): number {
	// Implementation of getCacheSize
	return 0;
}

export function refreshCache<T>(key: string, data: T, ttl?: number): void {
	// Implementation of refreshCache
}

export function getCacheInfo(key: string): CacheInfo | null {
	// Implementation of getCacheInfo
	return null;
}

export function setCacheWithMetadata<T>(
	key: string,
	data: T,
	metadata: CacheMetadata,
	ttl?: number,
): void {
	// Implementation of setCacheWithMetadata
}

export function getCacheWithMetadata<T>(key: string): {
	data: T | null;
	metadata: CacheMetadata | null;
} {
	// Implementation of getCacheWithMetadata
	return { data: null, metadata: null };
}
