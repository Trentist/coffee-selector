/**
 * Currency System Config Export - نظام العملات المتكامل
 * تصدير جميع ملفات التكوين
 */

// التكوين الأساسي
export * from "./currency-data";
export * from "./api-endpoints";
export * from "./fallback-rates";

// إعادة تصدير التكوينات الشائعة الاستخدام
export {
	FIXED_EXCHANGE_RATES,
	DYNAMIC_CURRENCIES,
	SUPPORTED_COUNTRIES,
	SUPPORTED_CURRENCIES,
	HIGH_PRIORITY_CURRENCIES,
	FIXED_CURRENCIES,
	isFixedCurrency,
	isDynamicCurrency,
	isHighPriorityCurrency,
	getFixedRate,
	getCountryByCurrency,
	getCurrencyByCountry,
} from "./currency-data";

export {
	EXCHANGE_RATE_API,
	ALPHA_VANTAGE_API,
	PROVIDER_PRIORITY,
	SMART_RETRY_CONFIG,
	FAILOVER_CONFIG,
	API_ENDPOINTS,
	API_PROVIDERS,
	CACHE_CONFIG,
	buildExchangeRateUrl,
	buildConversionUrl,
	buildAlphaVantageUrl,
	validateApiKey,
	isApiConfigured,
	getRemainingQuota,
} from "./api-endpoints";

export {
	FALLBACK_EXCHANGE_RATES,
	DIRECT_CONVERSION_RATES,
	RATE_FLUCTUATION_LIMITS,
	FALLBACK_CONFIG,
	getFallbackRate,
	validateExchangeRate,
	getFallbackWarningMessage,
	isFallbackRateValid,
	getFallbackRateAge,
} from "./fallback-rates";
