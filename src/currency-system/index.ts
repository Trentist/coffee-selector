/**
 * Currency System - نظام العملات المتكامل
 * التصدير الرئيسي لجميع مكونات نظام العملة
 */

// الأنواع
export * from "./types/currency.types";
export * from "./types/api.types";

// التكوين
export * from "./config/currency-data";
export * from "./config/api-endpoints";
export * from "./config/fallback-rates";

// الخدمات
export * from "./services/currency.service";
export * from "./services/alphaVantage.service";
export * from "./services/currencyCache.service";
export * from "./services/currencySettings.service";

// Hooks
export { useCurrency } from "../hooks/useCurrency";
export * from "./hooks/useCurrencySettings";

// Context
export * from "./context/currency-context";

// API
export { default as currencyApi } from "./api/currency";

// إعادة تصدير الخدمات الرئيسية
export { default as currencyService } from "./services/currency.service";
export { default as alphaVantageService } from "./services/alphaVantage.service";
export { default as currencyCacheService } from "./services/currencyCache.service";
export { default as currencySettingsService } from "./services/currencySettings.service";

// إعادة تصدير Hooks الرئيسية
export { useCurrencySettings } from "./hooks/useCurrencySettings";

// إعادة تصدير Context
export {
	CurrencyProvider,
	useCurrencyContext,
} from "./context/currency-context";

// إعادة تصدير التكوينات الشائعة الاستخدام
export {
	FIXED_EXCHANGE_RATES,
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
} from "./config/currency-data";

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
} from "./config/api-endpoints";

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
} from "./config/fallback-rates";
