/**
 * Currency Cache Service Types - نظام العملات المتكامل
 * أنواع البيانات الخاصة بخدمة التخزين المؤقت
 */

import { CurrencyCode } from '../../types/currency.types';

// بيانات العملة المخزنة مؤقتاً
export interface CachedCurrencyData {
  exchangeRate: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  lastRefreshed: string;
  bidPrice?: number;
  askPrice?: number;
  cacheTimestamp: number;
  usageCount: number;
  priority: 'high' | 'medium' | 'low';
  provider: string;
}

// إحصائيات التخزين المؤقت
export interface CacheMetrics {
  totalCacheHits: number;
  totalCacheMisses: number;
  apiCallsToday: number;
  lastResetDate: string;
  priorityCurrencies: CurrencyCode[];
  cacheStatus: Record<string, CachedCurrencyData>;
  totalCachedItems: number;
  cacheSize: number;
  averageResponseTime: number;
}

// إعدادات التخزين المؤقت
export interface CacheConfig {
  ttl: {
    high: number; // 4 ساعات
    medium: number; // 8 ساعات
    low: number; // 12 ساعة
    fixed: number; // 24 ساعة
  };
  maxSize: number;
  cleanupInterval: number;
  autoRefresh: {
    enabled: boolean;
    interval: number;
    maxConcurrent: number;
  };
}

// أولوية العملات
export type CurrencyPriority = 'high' | 'medium' | 'low';

// حالة التخزين المؤقت
export interface CacheStatus {
  isEnabled: boolean;
  lastCleanup: number;
  nextCleanup: number;
  totalItems: number;
  memoryUsage: number;
  hitRate: number;
}

// عنصر يحتاج تحديث
export interface CacheItemNeedingRefresh {
  from: CurrencyCode;
  to: CurrencyCode;
  priority: CurrencyPriority;
  timeUntilExpiry: number;
  usageCount: number;
}
