/**
 * Alpha Vantage Service Helpers - نظام العملات المتكامل
 * دوال مساعدة لخدمة Alpha Vantage
 */

import { CurrencyCode } from "../../types/currency.types";
import {
	ExchangeRateData,
	DailyRateData,
	DailySeriesData,
	AlphaVantageConfig,
	AlphaVantageStatus,
} from "../types/alphaVantage.types";
import {
	FIXED_EXCHANGE_RATES,
	getFixedRate,
	isFixedCurrency,
} from "../../config/currency-data";

/**
 * التحقق من صحة API Key
 */
export function validateApiKey(apiKey: string): boolean {
	return apiKey && apiKey.length > 0 && apiKey !== "demo-key";
}

/**
 * التحقق من إمكانية استخدام API
 */
export function canUseApi(config: AlphaVantageConfig): boolean {
	return config.enabled && validateApiKey(config.apiKey);
}

/**
 * بناء URL لطلب أسعار الصرف
 */
export function buildExchangeRateUrl(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
	config: AlphaVantageConfig,
): string {
	const url = new URL(config.baseUrl);
	url.searchParams.append("function", "CURRENCY_EXCHANGE_RATE");
	url.searchParams.append("from_currency", fromCurrency.toUpperCase());
	url.searchParams.append("to_currency", toCurrency.toUpperCase());
	url.searchParams.append("apikey", config.apiKey);
	return url.toString();
}

/**
 * بناء URL للسلسلة اليومية
 */
export function buildDailySeriesUrl(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
	config: AlphaVantageConfig,
): string {
	const url = new URL(config.baseUrl);
	url.searchParams.append("function", "FX_DAILY");
	url.searchParams.append("from_symbol", fromCurrency.toUpperCase());
	url.searchParams.append("to_symbol", toCurrency.toUpperCase());
	url.searchParams.append("apikey", config.apiKey);
	return url.toString();
}

/**
 * تحويل استجابة API إلى بيانات منظمة
 */
export function parseExchangeRateResponse(
	response: any,
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): ExchangeRateData | null {
	try {
		const data = response["Realtime Currency Exchange Rate"];
		if (!data) return null;

		return {
			fromCurrency,
			toCurrency,
			exchangeRate: parseFloat(data["5. Exchange Rate"]),
			lastRefreshed: data["6. Last Refreshed"],
			bidPrice: parseFloat(data["8. Bid Price"]),
			askPrice: parseFloat(data["9. Ask Price"]),
		};
	} catch (error) {
		console.error("Error parsing exchange rate response:", error);
		return null;
	}
}

/**
 * تحويل استجابة السلسلة اليومية إلى بيانات منظمة
 */
export function parseDailySeriesResponse(
	response: any,
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): DailySeriesData | null {
	try {
		const metaData = response["Meta Data"];
		const timeSeries = response["Time Series FX (Daily)"];

		if (!metaData || !timeSeries) return null;

		const dailyRates: DailyRateData[] = Object.entries(timeSeries)
			.map(([date, data]: [string, any]) => ({
				date,
				open: parseFloat(data["1. open"]),
				high: parseFloat(data["2. high"]),
				low: parseFloat(data["3. low"]),
				close: parseFloat(data["4. close"]),
			}))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		return {
			metaData: {
				fromSymbol: fromCurrency,
				toSymbol: toCurrency,
				lastRefreshed: metaData["4. Last Refreshed"],
				timeZone: metaData["5. Time Zone"],
			},
			dailyRates,
		};
	} catch (error) {
		console.error("Error parsing daily series response:", error);
		return null;
	}
}

/**
 * الحصول على سعر احتياطي عند فشل API
 */
export function getFallbackRate(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): ExchangeRateData {
	// محاولة التحويل عبر USD كوسيط
	const fromToUsd =
		fromCurrency === "USD"
			? 1.0
			: FIXED_EXCHANGE_RATES[fromCurrency]
				? 1 / FIXED_EXCHANGE_RATES[fromCurrency]
				: null;

	const usdToTarget =
		toCurrency === "USD" ? 1.0 : FIXED_EXCHANGE_RATES[toCurrency];

	let approximateRate = 1.0;

	if (fromToUsd !== null && usdToTarget !== null) {
		approximateRate = fromToUsd * usdToTarget;
	} else {
		// أسعار تقريبية للعملات الشائعة
		const approximateRates: Record<string, Record<string, number>> = {
			USD: {
				EGP: 31.0,
				TRY: 28.5,
				INR: 83.0,
				PKR: 280.0,
				NGN: 790.0,
				KES: 150.0,
			},
			AED: {
				EGP: 8.5,
				TRY: 7.8,
				INR: 22.6,
				PKR: 76.3,
				NGN: 215.0,
				KES: 41.0,
			},
			SAR: {
				EGP: 8.3,
				TRY: 7.6,
				INR: 22.1,
				PKR: 74.7,
				NGN: 210.0,
				KES: 40.0,
			},
		};

		if (approximateRates[fromCurrency]?.[toCurrency]) {
			approximateRate = approximateRates[fromCurrency][toCurrency];
		} else if (approximateRates[toCurrency]?.[fromCurrency]) {
			approximateRate = 1 / approximateRates[toCurrency][fromCurrency];
		}
	}

	console.warn(
		`Using fallback rate for ${fromCurrency} to ${toCurrency}: ${approximateRate}`,
	);

	return {
		fromCurrency,
		toCurrency,
		exchangeRate: approximateRate,
		lastRefreshed: new Date().toISOString(),
		bidPrice: approximateRate * 0.995,
		askPrice: approximateRate * 1.005,
	};
}

/**
 * التحقق من صحة الاستجابة
 */
export function validateApiResponse(response: any): boolean {
	return (
		response &&
		typeof response === "object" &&
		!response["Error Message"] &&
		!response["Note"]
	);
}

/**
 * استخراج رسالة الخطأ من الاستجابة
 */
export function extractErrorMessage(response: any): string {
	if (response["Error Message"]) {
		return response["Error Message"];
	}

	if (response["Note"]) {
		return response["Note"];
	}

	if (response["Information"]) {
		return response["Information"];
	}

	return "Unknown API error";
}

/**
 * التحقق من تجاوز حد الاستخدام
 */
export function isRateLimitExceeded(response: any): boolean {
	return response["Note"] && response["Note"].includes("API call frequency");
}

/**
 * حساب الوقت المتبقي حتى إعادة تعيين الحد
 */
export function getResetTime(): Date {
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);
	return tomorrow;
}

/**
 * تحديث حالة الخدمة
 */
export function updateServiceStatus(
	currentStatus: AlphaVantageStatus,
	success: boolean,
	error?: string,
): AlphaVantageStatus {
	return {
		...currentStatus,
		lastError: success ? undefined : error,
		lastSuccess: success ? Date.now() : currentStatus.lastSuccess,
	};
}
