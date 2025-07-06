/**
 * API Endpoints Configuration - نظام العملات المتكامل
 * تكوين نقاط اتصال APIs وإعدادات الخدمات الخارجية
 */

import { ApiConfig, ApiProvider } from "../types/api.types";

// إعدادات ExchangeRate-API الرئيسي
export const EXCHANGE_RATE_API: ApiConfig = {
	baseUrl: `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}/latest/USD`,
	apiKey:
		process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || "068a557f1b5cf13b2b8c9e17",
	timeout: 10000, // 10 ثواني
	retryAttempts: 3,
	retryDelay: 1000, // ثانية واحدة
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		"User-Agent": "CoffeeSelection-CurrencySystem/1.0",
	},
	rateLimit: {
		requestsPerMinute: 10,
		requestsPerHour: 100,
		requestsPerDay: 1500, // حد الخطة المجانية
	},
};

// إعدادات Alpha Vantage API
export const ALPHA_VANTAGE_API: ApiConfig = {
	baseUrl: "https://www.alphavantage.co/query",
	apiKey: process.env.ALPHA_VANTAGE_API_KEY || "",
	timeout: 15000, // 15 ثانية
	retryAttempts: 2,
	retryDelay: 2000, // ثانيتان
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		"User-Agent": "CoffeeSelection-CurrencySystem/1.0",
	},
	rateLimit: {
		requestsPerMinute: 5,
		requestsPerHour: 25,
		requestsPerDay: 25, // حد الخطة المجانية
	},
};

// ترتيب أولوية مزودي الخدمة
export const PROVIDER_PRIORITY = [
	"exchangeRateApi",
	"alphaVantage",
	"fixer",
	"currencyApi",
] as const;

// تكوين إعادة المحاولة الذكية
export const SMART_RETRY_CONFIG = {
	maxAttempts: 3,
	baseDelay: 1000,
	maxDelay: 10000,
	backoffMultiplier: 2,
	jitter: true,
	retryableErrors: ["network_error", "timeout", "rate_limit", "server_error"],
};

// تكوين التبديل التلقائي
export const FAILOVER_CONFIG = {
	enabled: true,
	healthCheckInterval: 300000, // 5 دقائق
	failureThreshold: 3,
	recoveryTime: 600000, // 10 دقائق
	priorityOrder: PROVIDER_PRIORITY,
};

// نقاط الاتصال المحددة
export const API_ENDPOINTS = {
	// تحديد الموقع
	location: {
		detect: "/json/",
		detectWithFallback:
			"/json/?fields=ip,city,region,country_code,country_name,continent_code,timezone,currency",
	},

	// أسعار الصرف
	exchange: {
		latest: "/latest", // GET /latest/{base_currency}
		convert: "/pair", // GET /pair/{from}/{to}/{amount}
		historical: "/history", // GET /history/{base_currency}/{year}/{month}/{day}
		supported: "/codes", // GET /codes
	},

	// معلومات حالة الخدمة
	status: {
		health: "/health",
		quota: "/quota-status",
	},
} as const;

// مزودي الخدمة المتاحين (للتبديل التلقائي)
export const API_PROVIDERS: Record<string, ApiProvider> = {
	exchangeRateApi: {
		name: "ExchangeRate-API",
		baseUrl: "https://v6.exchangerate-api.com/v6",
		plan: "free",
		limits: {
			requestsPerMonth: 1500,
			requestsPerDay: 50,
			supportedCurrencies: 168,
		},
		features: {
			historicalData: true,
			realTimeRates: true,
			webhooks: false,
			customization: false,
		},
		reliability: 0.98,
		responseTime: 250,
	},

	alphaVantage: {
		name: "Alpha Vantage",
		baseUrl: "https://www.alphavantage.co/query",
		plan: "free",
		limits: {
			requestsPerMonth: 500,
			requestsPerDay: 25,
			supportedCurrencies: 170,
		},
		features: {
			historicalData: true,
			realTimeRates: true,
			webhooks: false,
			customization: false,
		},
		reliability: 0.95,
		responseTime: 300,
	},

	// خدمة احتياطية مجانية
	fixer: {
		name: "Fixer.io",
		baseUrl: "https://api.fixer.io/v1",
		plan: "free",
		limits: {
			requestsPerMonth: 1000,
			requestsPerDay: 100,
			supportedCurrencies: 170,
		},
		features: {
			historicalData: false,
			realTimeRates: true,
			webhooks: false,
			customization: false,
		},
		reliability: 0.95,
		responseTime: 300,
	},

	// خدمة احتياطية أخرى
	currencyApi: {
		name: "CurrencyAPI",
		baseUrl: "https://api.currencyapi.com/v3",
		plan: "free",
		limits: {
			requestsPerMonth: 300,
			requestsPerDay: 10,
			supportedCurrencies: 164,
		},
		features: {
			historicalData: false,
			realTimeRates: true,
			webhooks: false,
			customization: false,
		},
		reliability: 0.92,
		responseTime: 400,
	},
};

// إعدادات التخزين المؤقت
export const CACHE_CONFIG = {
	// TTL للعملات المختلفة (بالميلي ثانية)
	ttl: {
		fixed: 24 * 60 * 60 * 1000, // 24 ساعة للعملات الثابتة
		high: 4 * 60 * 60 * 1000, // 4 ساعات للعملات عالية الأولوية
		medium: 8 * 60 * 60 * 1000, // 8 ساعات للعملات متوسطة الأولوية
		low: 12 * 60 * 60 * 1000, // 12 ساعة للعملات منخفضة الأولوية
	},

	// إعدادات التحديث التلقائي
	autoRefresh: {
		enabled: true,
		interval: 30 * 60 * 1000, // 30 دقيقة
		maxConcurrent: 3,
	},

	// إعدادات التنظيف
	cleanup: {
		enabled: true,
		interval: 60 * 60 * 1000, // ساعة واحدة
		maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع واحد
	},
};

// دوال مساعدة لبناء URLs
export function buildExchangeRateUrl(
	baseCurrency: string,
	apiKey?: string,
): string {
	const key = apiKey || EXCHANGE_RATE_API.apiKey;
	return `${EXCHANGE_RATE_API.baseUrl}/${key}/latest/${baseCurrency}`;
}

export function buildConversionUrl(
	from: string,
	to: string,
	amount: number,
	apiKey?: string,
): string {
	const key = apiKey || EXCHANGE_RATE_API.apiKey;
	return `${EXCHANGE_RATE_API.baseUrl}/${key}/pair/${from}/${to}/${amount}`;
}

export function buildAlphaVantageUrl(
	functionName: string,
	params: Record<string, string>,
	apiKey?: string,
): string {
	const key = apiKey || ALPHA_VANTAGE_API.apiKey;
	const url = new URL(ALPHA_VANTAGE_API.baseUrl);

	url.searchParams.append("function", functionName);
	url.searchParams.append("apikey", key);

	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.append(key, value);
	});

	return url.toString();
}

// دوال التحقق من صحة API
export function validateApiKey(apiKey: string): boolean {
	return apiKey && apiKey.length > 0 && apiKey !== "demo-key";
}

export function isApiConfigured(): boolean {
	return (
		validateApiKey(EXCHANGE_RATE_API.apiKey) ||
		validateApiKey(ALPHA_VANTAGE_API.apiKey)
	);
}

// دوال إدارة الحصص
export function getRemainingQuota(provider: string): number {
	const providerConfig = API_PROVIDERS[provider];
	if (!providerConfig) return 0;

	// هنا يمكن إضافة منطق لحساب الحصة المتبقية
	// حالياً نعيد القيمة الافتراضية
	return providerConfig.limits.requestsPerDay;
}
