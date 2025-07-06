/**
 * API Types - نظام العملات المتكامل
 * أنواع البيانات الخاصة بـ APIs الخارجية
 */

import { CurrencyCode } from "./currency.types";

// تكوين API
export interface ApiConfig {
	baseUrl: string;
	apiKey: string;
	timeout: number;
	retryAttempts: number;
	retryDelay: number;
	headers: Record<string, string>;
	rateLimit: {
		requestsPerMinute: number;
		requestsPerHour: number;
		requestsPerDay: number;
	};
}

// مزود الخدمة
export interface ApiProvider {
	name: string;
	baseUrl: string;
	plan: "free" | "premium" | "enterprise";
	limits: {
		requestsPerMonth: number;
		requestsPerDay: number;
		supportedCurrencies: number;
	};
	features: {
		historicalData: boolean;
		realTimeRates: boolean;
		webhooks: boolean;
		customization: boolean;
	};
	reliability: number;
	responseTime: number;
}

// استجابة API أسعار الصرف
export interface ExchangeRateApiResponse {
	success: boolean;
	timestamp: number;
	base: CurrencyCode;
	date: string;
	rates: Record<CurrencyCode, number>;
	provider: string;
	cached: boolean;
	error?: {
		code: number;
		message: string;
		type: "invalid_currency" | "rate_limit" | "network_error" | "api_error";
	};
}

// طلب التحويل
export interface ConversionRequest {
	from: CurrencyCode;
	to: CurrencyCode;
	amount: number;
	provider?: string;
}

// استجابة التحويل
export interface ConversionResponse {
	success: boolean;
	data?: {
		from: CurrencyCode;
		to: CurrencyCode;
		amount: number;
		convertedAmount: number;
		rate: number;
		timestamp: number;
		provider: string;
	};
	error?: {
		code: string;
		message: string;
		type: string;
	};
}

// حالة خدمة API
export interface ApiServiceStatus {
	isHealthy: boolean;
	lastCheck: number;
	responseTime: number;
	errorCount: number;
	successCount: number;
	quotaRemaining: number;
	lastError?: {
		code: string;
		message: string;
		timestamp: number;
	};
}

// حالة متعددة APIs
export interface MultiApiStatus {
	currentProvider: string;
	providers: Record<string, ApiServiceStatus>;
	lastFailover: number;
	totalFailovers: number;
}

// تكوين إعادة المحاولة الذكية
export interface SmartRetryConfig {
	maxAttempts: number;
	baseDelay: number;
	maxDelay: number;
	backoffMultiplier: number;
	jitter: boolean;
	retryableErrors: string[];
}

// تكوين التبديل التلقائي
export interface FailoverConfig {
	enabled: boolean;
	healthCheckInterval: number;
	failureThreshold: number;
	recoveryTime: number;
	priorityOrder: string[];
}
