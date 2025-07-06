/**
 * Currency System Types - نظام العملات المتكامل
 * أنواع البيانات الأساسية لنظام العملات
 */

// أنواع العملات المدعومة
export type CurrencyCode =
	| "AED"
	| "SAR"
	| "KWD"
	| "QAR"
	| "OMR"
	| "BHD"
	| "EGP"
	| "USD"
	| "EUR"
	| "GBP"
	| "CHF"
	| "CAD"
	| "AUD"
	| "JOD"
	| "MAD"
	| "DZD"
	| "TND"
	| "LYD"
	| "LBP"
	| "ILS"
	| "IQD"
	| "YER"
	| "SDG"
	| "SOS"
	| "TRY"
	| "INR"
	| "PKR"
	| "BDT"
	| "LKR"
	| "PHP"
	| "IDR"
	| "MYR"
	| "THB";

// تكوين البلد
export interface CountryConfig {
	code: string;
	name: string;
	nameAr?: string;
	currency: CurrencyCode;
	currencySymbol?: string;
	flag?: string;
	aramexSupported: boolean;
	phoneCode?: string;
	timeZone?: string;
	locale?: string;
	taxRate: number;
	isGCC?: boolean;
}

// بيانات أسعار الصرف
export interface ExchangeRateData {
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;
	exchangeRate: number;
	lastRefreshed: string;
	bidPrice?: number;
	askPrice?: number;
	change?: number;
	changePercent?: number;
}

// بيانات السلسلة اليومية
export interface DailyRateData {
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
}

// بيانات السلسلة اليومية الكاملة
export interface DailySeriesData {
	metaData: {
		fromSymbol: CurrencyCode;
		toSymbol: CurrencyCode;
		lastRefreshed: string;
		timeZone: string;
	};
	dailyRates: DailyRateData[];
}

// استجابة API العملة
export interface CurrencyApiResponse {
	success: boolean;
	rates?: Record<CurrencyCode, number>;
	base?: CurrencyCode;
	timestamp?: number;
	provider?: string;
	cached?: boolean;
	error?: {
		code: string;
		message: string;
		type: "api_error" | "network_error" | "rate_limit" | "invalid_currency";
	};
	baseCurrency?: CurrencyCode;
}

// تحويل السعر
export interface PriceConversion {
	originalAmount: number;
	convertedAmount: number;
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;
	exchangeRate: number;
	lastRefreshed: string;
	provider: string;
}

// إعدادات العملة
export interface CurrencySettings {
	defaultCurrency: CurrencyCode;
	supportedCurrencies: CurrencyCode[];
	autoDetectLocation: boolean;
	cacheEnabled: boolean;
	cacheTTL: number;
	apiProvider: string;
	fallbackEnabled: boolean;
}

// إحصائيات الاستخدام
export interface UsageStats {
	totalRequests: number;
	cacheHits: number;
	cacheMisses: number;
	apiCalls: number;
	errors: number;
	lastReset: string;
}

// حالة مزود الخدمة
export interface ProviderStatus {
	name: string;
	isActive: boolean;
	lastUsed: number;
	successRate: number;
	responseTime: number;
	errorCount: number;
	quotaRemaining: number;
}
