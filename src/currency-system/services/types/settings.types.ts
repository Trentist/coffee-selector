/**
 * Currency Settings Service Types - نظام العملات المتكامل
 * أنواع البيانات الخاصة بخدمة الإعدادات
 */

import { CurrencyCode } from "../../types/currency.types";

// إعدادات العملة
export interface CurrencySettings {
	defaultCurrency: CurrencyCode;
	supportedCurrencies: CurrencyCode[];
	autoDetectLocation: boolean;
	cacheEnabled: boolean;
	cacheTTL: number;
	apiProvider: string;
	fallbackEnabled: boolean;
	updateInterval: number;
	notifications: {
		enabled: boolean;
		rateChanges: boolean;
		apiErrors: boolean;
	};
}

// إحصائيات الاستخدام
export interface UsageStats {
	totalRequests: number;
	cacheHits: number;
	cacheMisses: number;
	apiCalls: number;
	errors: number;
	lastReset: string;
	dailyStats: Record<
		string,
		{
			requests: number;
			hits: number;
			misses: number;
			errors: number;
		}
	>;
}

// سجل الاستخدام
export interface UsageRecord {
	timestamp: number;
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;
	responseTime: number;
	success: boolean;
	cached: boolean;
	provider: string;
	error?: string;
}

// إعدادات التحديث التلقائي
export interface AutoUpdateSettings {
	enabled: boolean;
	interval: number;
	priorityCurrencies: CurrencyCode[];
	maxConcurrent: number;
	retryAttempts: number;
	retryDelay: number;
}

// إعدادات الإشعارات
export interface NotificationSettings {
	enabled: boolean;
	rateChanges: {
		enabled: boolean;
		threshold: number; // نسبة التغير المطلوبة للإشعار
	};
	apiErrors: {
		enabled: boolean;
		maxErrors: number;
	};
	quotaWarnings: {
		enabled: boolean;
		threshold: number; // عدد الطلبات المتبقية للتحذير
	};
}

// حالة الخدمة
export interface ServiceStatus {
	isActive: boolean;
	lastUpdate: number;
	nextUpdate: number;
	currentProvider: string;
	providerHealth: Record<
		string,
		{
			isHealthy: boolean;
			lastCheck: number;
			successRate: number;
			responseTime: number;
		}
	>;
	errors: Array<{
		timestamp: number;
		type: string;
		message: string;
		provider: string;
	}>;
}
