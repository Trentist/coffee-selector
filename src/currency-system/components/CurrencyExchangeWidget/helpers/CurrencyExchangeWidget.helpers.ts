/**
 * Currency Exchange Widget Helpers - نظام العملات المتكامل
 * دوال مساعدة لمكون تحويل العملة
 */

import { CurrencyCode } from "../../../types/currency.types";
import { CurrencyOption } from "../types/CurrencyExchangeWidget.types";
import { SUPPORTED_COUNTRIES } from "../../../config/currency-data";

/**
 * الحصول على خيارات العملات المدعومة
 */
export function getCurrencyOptions(): CurrencyOption[] {
	return SUPPORTED_COUNTRIES.map((country) => ({
		code: country.currency,
		name: country.name,
		nameAr: country.nameAr,
		symbol: country.currencySymbol || country.currency,
		flag: country.flag,
	}));
}

/**
 * تنسيق المبلغ
 */
export function formatAmount(amount: number, currency: CurrencyCode): string {
	const options: Intl.NumberFormatOptions = {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	};

	try {
		return new Intl.NumberFormat("en-US", options).format(amount);
	} catch (error) {
		// في حالة فشل التنسيق، نستخدم التنسيق البسيط
		return `${amount.toFixed(2)} ${currency}`;
	}
}

/**
 * تنسيق المبلغ بدون رمز العملة
 */
export function formatAmountWithoutSymbol(amount: number): string {
	return amount.toFixed(2);
}

/**
 * التحقق من صحة المبلغ
 */
export function validateAmount(amount: string): boolean {
	const num = parseFloat(amount);
	return !isNaN(num) && num >= 0 && num <= 999999999;
}

/**
 * تحويل المبلغ إلى رقم
 */
export function parseAmount(amount: string): number {
	const num = parseFloat(amount);
	return isNaN(num) ? 0 : num;
}

/**
 * الحصول على رمز العملة
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
	const country = SUPPORTED_COUNTRIES.find((c) => c.currency === currency);
	return country?.currencySymbol || currency;
}

/**
 * الحصول على اسم العملة
 */
export function getCurrencyName(currency: CurrencyCode): string {
	const country = SUPPORTED_COUNTRIES.find((c) => c.currency === currency);
	return country?.name || currency;
}

/**
 * الحصول على اسم العملة بالعربية
 */
export function getCurrencyNameAr(currency: CurrencyCode): string {
	const country = SUPPORTED_COUNTRIES.find((c) => c.currency === currency);
	return country?.nameAr || currency;
}

/**
 * الحصول على علم البلد
 */
export function getCurrencyFlag(currency: CurrencyCode): string | undefined {
	const country = SUPPORTED_COUNTRIES.find((c) => c.currency === currency);
	return country?.flag;
}

/**
 * تنسيق وقت آخر تحديث
 */
export function formatLastUpdated(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diffInMinutes = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60),
	);

	if (diffInMinutes < 1) {
		return "Just now";
	} else if (diffInMinutes < 60) {
		return `${diffInMinutes} minutes ago`;
	} else if (diffInMinutes < 1440) {
		const hours = Math.floor(diffInMinutes / 60);
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else {
		const days = Math.floor(diffInMinutes / 1440);
		return `${days} day${days > 1 ? "s" : ""} ago`;
	}
}

/**
 * تنسيق معدل النجاح
 */
export function formatSuccessRate(rate: number): string {
	return `${rate.toFixed(1)}%`;
}

/**
 * تنسيق معدل التخزين المؤقت
 */
export function formatCacheHitRate(rate: number): string {
	return `${rate.toFixed(1)}%`;
}

/**
 * الحصول على لون الحالة بناءً على معدل النجاح
 */
export function getStatusColor(rate: number): string {
	if (rate >= 95) return "green.500";
	if (rate >= 80) return "yellow.500";
	return "red.500";
}

/**
 * الحصول على رسالة الحالة
 */
export function getStatusMessage(rate: number): string {
	if (rate >= 95) return "Excellent";
	if (rate >= 80) return "Good";
	if (rate >= 60) return "Fair";
	return "Poor";
}

/**
 * التحقق من إمكانية التبديل بين العملات
 */
export function canSwapCurrencies(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): boolean {
	return fromCurrency !== toCurrency;
}

/**
 * الحصول على رسالة الخطأ المخصصة
 */
export function getErrorMessage(error: string): string {
	const errorMessages: Record<string, string> = {
		"API limit reached": "تم تجاوز حد الاستخدام اليومي",
		"Network error": "خطأ في الاتصال بالشبكة",
		"Invalid currency": "عملة غير صحيحة",
		"Service unavailable": "الخدمة غير متاحة حالياً",
		"Rate limit exceeded": "تم تجاوز حد الطلبات",
	};

	return errorMessages[error] || error;
}

/**
 * الحصول على أيقونة مزود الخدمة
 */
export function getProviderIcon(provider: string): string {
	const providerIcons: Record<string, string> = {
		alphaVantage: "📊",
		exchangeRateApi: "💱",
		fallback: "🔄",
		cache: "💾",
		fixed: "🔒",
		internal: "⚙️",
	};

	return providerIcons[provider] || "🌐";
}

/**
 * الحصول على اسم مزود الخدمة
 */
export function getProviderName(provider: string): string {
	const providerNames: Record<string, string> = {
		alphaVantage: "Alpha Vantage",
		exchangeRateApi: "Exchange Rate API",
		fallback: "Fallback Rates",
		cache: "Cached Data",
		fixed: "Fixed Rates",
		internal: "Internal",
	};

	return providerNames[provider] || provider;
}

/**
 * التحقق من كون العملة ثابتة
 */
export function isFixedCurrency(currency: CurrencyCode): boolean {
	const fixedCurrencies: CurrencyCode[] = [
		"AED",
		"SAR",
		"KWD",
		"QAR",
		"OMR",
		"BHD",
	];
	return fixedCurrencies.includes(currency);
}

/**
 * الحصول على فئة العملة
 */
export function getCurrencyCategory(
	currency: CurrencyCode,
): "fixed" | "stable" | "volatile" {
	if (isFixedCurrency(currency)) return "fixed";

	const stableCurrencies: CurrencyCode[] = [
		"USD",
		"EUR",
		"GBP",
		"CHF",
		"CAD",
		"AUD",
		"JOD",
	];
	if (stableCurrencies.includes(currency)) return "stable";

	return "volatile";
}
