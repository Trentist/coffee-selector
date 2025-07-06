/**
 * Alpha Vantage Service Types - نظام العملات المتكامل
 * أنواع البيانات الخاصة بخدمة Alpha Vantage
 */

import { CurrencyCode } from "../../types/currency.types";

// استجابة API Alpha Vantage للعملات
export interface CurrencyExchangeResponse {
	"Realtime Currency Exchange Rate": {
		"1. From_Currency Code": string;
		"2. From_Currency Name": string;
		"3. To_Currency Code": string;
		"4. To_Currency Name": string;
		"5. Exchange Rate": string;
		"6. Last Refreshed": string;
		"7. Time Zone": string;
		"8. Bid Price": string;
		"9. Ask Price": string;
	};
}

// استجابة API للسلسلة اليومية
export interface FXDailyResponse {
	"Meta Data": {
		"1. Information": string;
		"2. From Symbol": string;
		"3. To Symbol": string;
		"4. Last Refreshed": string;
		"5. Time Zone": string;
	};
	"Time Series FX (Daily)": {
		[date: string]: {
			"1. open": string;
			"2. high": string;
			"3. low": string;
			"4. close": string;
		};
	};
}

// بيانات أسعار الصرف
export interface ExchangeRateData {
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;
	exchangeRate: number;
	lastRefreshed: string;
	bidPrice?: number;
	askPrice?: number;
}

// بيانات السعر اليومي
export interface DailyRateData {
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
}

// بيانات السلسلة اليومية
export interface DailySeriesData {
	metaData: {
		fromSymbol: CurrencyCode;
		toSymbol: CurrencyCode;
		lastRefreshed: string;
		timeZone: string;
	};
	dailyRates: DailyRateData[];
}

// إحصائيات الخدمة
export interface AlphaVantageStats {
	totalApiCalls: number;
	successfulCalls: number;
	failedCalls: number;
	cacheHits: number;
	cacheMisses: number;
	lastApiCall: number;
	remainingCalls: number;
}

// إعدادات الخدمة
export interface AlphaVantageConfig {
	apiKey: string;
	baseUrl: string;
	timeout: number;
	retryAttempts: number;
	retryDelay: number;
	dailyLimit: number;
	enabled: boolean;
}

// حالة الخدمة
export interface AlphaVantageStatus {
	isConfigured: boolean;
	isEnabled: boolean;
	hasQuota: boolean;
	lastError?: string;
	lastSuccess?: number;
}
