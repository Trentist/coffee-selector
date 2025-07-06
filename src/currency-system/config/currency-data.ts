/**
 * Currency Data Configuration - نظام العملات المتكامل
 * تكوين بيانات العملات والبلدان المدعومة
 */

import { CountryConfig, CurrencyCode } from "../types/currency.types";

// العملات الثابتة مقابل الدولار الأمريكي (أسعار تقريبية مستقرة)
export const FIXED_EXCHANGE_RATES: Record<CurrencyCode, number> = {
	// دول الخليج - عملات مربوطة بالدولار
	AED: 3.67, // درهم إماراتي
	SAR: 3.75, // ريال سعودي
	OMR: 0.385, // ريال عماني
	BHD: 0.377, // دينار بحريني
	QAR: 3.64, // ريال قطري

	// عملات مستقرة نسبياً
	KWD: 0.3, // دينار كويتي
	JOD: 0.71, // دينار أردني

	// عملات أساسية
	USD: 1.0, // دولار أمريكي (المرجع)
	EUR: 0.85, // يورو
	GBP: 0.73, // جنيه إسترليني
	CHF: 0.88, // فرنك سويسري
	CAD: 1.36, // دولار كندي
	AUD: 1.52, // دولار أسترالي

	// عملات الشرق الأوسط وأفريقيا
	EGP: 31.0, // جنيه مصري
	MAD: 10.0, // درهم مغربي
	DZD: 135.0, // دينار جزائري
	TND: 3.1, // دينار تونسي
	LYD: 4.8, // دينار ليبي
	LBP: 1500, // ليرة لبنانية
	ILS: 3.7, // شيكل إسرائيلي
	IQD: 1300, // دينار عراقي
	YER: 250, // ريال يمني
	SDG: 600, // جنيه سوداني
	SOS: 570, // شلن صومالي

	// عملات آسيا
	TRY: 28.5, // ليرة تركية
	INR: 83.0, // روبية هندية
	PKR: 280.0, // روبية باكستانية
	BDT: 110.0, // تاكا بنغلاديشي
	LKR: 320.0, // روبية سريلانكية
	PHP: 55.0, // بيسو فلبيني
	IDR: 15500, // روبية إندونيسية
	MYR: 4.7, // رينغيت ماليزي
	THB: 35.0, // بات تايلندي
};

// العملات المتقلبة - يُفضل استخدام API لها
export const DYNAMIC_CURRENCIES: CurrencyCode[] = [
	"EGP",
	"MAD",
	"DZD",
	"TND",
	"LYD",
	"LBP",
	"ILS",
	"IQD",
	"YER",
	"SDG",
	"SOS",
	"TRY",
	"INR",
	"PKR",
	"BDT",
	"LKR",
	"PHP",
	"IDR",
	"MYR",
	"THB",
];

// البلدان المدعومة مع العملات
export const SUPPORTED_COUNTRIES: CountryConfig[] = [
	// دول الخليج العربي - GCC Countries
	{
		code: "AE",
		name: "United Arab Emirates",
		nameAr: "الإمارات العربية المتحدة",
		currency: "AED",
		currencySymbol: "د.إ",
		flag: "🇦🇪",
		aramexSupported: true,
		phoneCode: "+971",
		timeZone: "Asia/Dubai",
		locale: "ar-AE",
		taxRate: 0,
		isGCC: true,
	},
	{
		code: "SA",
		name: "Saudi Arabia",
		nameAr: "المملكة العربية السعودية",
		currency: "SAR",
		currencySymbol: "ر.س",
		flag: "🇸🇦",
		aramexSupported: true,
		phoneCode: "+966",
		timeZone: "Asia/Riyadh",
		locale: "ar-SA",
		taxRate: 0,
		isGCC: true,
	},
	{
		code: "KW",
		name: "Kuwait",
		nameAr: "الكويت",
		currency: "KWD",
		currencySymbol: "د.ك",
		flag: "🇰🇼",
		aramexSupported: true,
		phoneCode: "+965",
		timeZone: "Asia/Kuwait",
		locale: "ar-KW",
		taxRate: 0,
		isGCC: true,
	},
	{
		code: "QA",
		name: "Qatar",
		nameAr: "قطر",
		currency: "QAR",
		currencySymbol: "ر.ق",
		flag: "🇶🇦",
		aramexSupported: true,
		phoneCode: "+974",
		timeZone: "Asia/Qatar",
		locale: "ar-QA",
		taxRate: 0,
		isGCC: true,
	},
	{
		code: "OM",
		name: "Oman",
		nameAr: "عمان",
		currency: "OMR",
		currencySymbol: "ر.ع",
		flag: "🇴🇲",
		aramexSupported: true,
		phoneCode: "+968",
		timeZone: "Asia/Muscat",
		locale: "ar-OM",
		taxRate: 0,
		isGCC: true,
	},
	{
		code: "BH",
		name: "Bahrain",
		nameAr: "البحرين",
		currency: "BHD",
		currencySymbol: "د.ب",
		flag: "🇧🇭",
		aramexSupported: true,
		phoneCode: "+973",
		timeZone: "Asia/Bahrain",
		locale: "ar-BH",
		taxRate: 0,
		isGCC: true,
	},

	// الشرق الأوسط وأفريقيا
	{
		code: "EG",
		name: "Egypt",
		nameAr: "مصر",
		currency: "EGP",
		currencySymbol: "ج.م",
		flag: "🇪🇬",
		aramexSupported: true,
		phoneCode: "+20",
		timeZone: "Africa/Cairo",
		locale: "ar-EG",
		taxRate: 0,
	},
	{
		code: "MA",
		name: "Morocco",
		nameAr: "المغرب",
		currency: "MAD",
		currencySymbol: "د.م",
		flag: "🇲🇦",
		aramexSupported: true,
		phoneCode: "+212",
		timeZone: "Africa/Casablanca",
		locale: "ar-MA",
		taxRate: 0,
	},
	{
		code: "DZ",
		name: "Algeria",
		nameAr: "الجزائر",
		currency: "DZD",
		currencySymbol: "د.ج",
		flag: "🇩🇿",
		aramexSupported: true,
		phoneCode: "+213",
		timeZone: "Africa/Algiers",
		locale: "ar-DZ",
		taxRate: 0,
	},
	{
		code: "TN",
		name: "Tunisia",
		nameAr: "تونس",
		currency: "TND",
		currencySymbol: "د.ت",
		flag: "🇹🇳",
		aramexSupported: true,
		phoneCode: "+216",
		timeZone: "Africa/Tunis",
		locale: "ar-TN",
		taxRate: 0,
	},
	{
		code: "LY",
		name: "Libya",
		nameAr: "ليبيا",
		currency: "LYD",
		currencySymbol: "د.ل",
		flag: "🇱🇾",
		aramexSupported: true,
		phoneCode: "+218",
		timeZone: "Africa/Tripoli",
		locale: "ar-LY",
		taxRate: 0,
	},
	{
		code: "LB",
		name: "Lebanon",
		nameAr: "لبنان",
		currency: "LBP",
		currencySymbol: "ل.ل",
		flag: "🇱🇧",
		aramexSupported: true,
		phoneCode: "+961",
		timeZone: "Asia/Beirut",
		locale: "ar-LB",
		taxRate: 0,
	},
	{
		code: "JO",
		name: "Jordan",
		nameAr: "الأردن",
		currency: "JOD",
		currencySymbol: "د.أ",
		flag: "🇯🇴",
		aramexSupported: true,
		phoneCode: "+962",
		timeZone: "Asia/Amman",
		locale: "ar-JO",
		taxRate: 0,
	},

	// العملات الدولية
	{
		code: "US",
		name: "United States",
		nameAr: "الولايات المتحدة",
		currency: "USD",
		currencySymbol: "$",
		flag: "🇺🇸",
		aramexSupported: true,
		phoneCode: "+1",
		timeZone: "America/New_York",
		locale: "en-US",
		taxRate: 0,
	},
	{
		code: "GB",
		name: "United Kingdom",
		nameAr: "المملكة المتحدة",
		currency: "GBP",
		currencySymbol: "£",
		flag: "🇬🇧",
		aramexSupported: true,
		phoneCode: "+44",
		timeZone: "Europe/London",
		locale: "en-GB",
		taxRate: 0,
	},
	{
		code: "DE",
		name: "Germany",
		nameAr: "ألمانيا",
		currency: "EUR",
		currencySymbol: "€",
		flag: "🇩🇪",
		aramexSupported: true,
		phoneCode: "+49",
		timeZone: "Europe/Berlin",
		locale: "de-DE",
		taxRate: 0,
	},
];

// العملات المدعومة في النظام
export const SUPPORTED_CURRENCIES: CurrencyCode[] = [
	"AED",
	"SAR",
	"KWD",
	"QAR",
	"OMR",
	"BHD",
	"EGP",
	"USD",
	"EUR",
	"GBP",
];

// العملات ذات الأولوية العالية للتحديث
export const HIGH_PRIORITY_CURRENCIES: CurrencyCode[] = [
	"EGP",
	"TRY",
	"INR",
	"PKR",
	"NGN",
	"MAD",
	"DZD",
];

// العملات الثابتة (لا تحتاج تحديث من API)
export const FIXED_CURRENCIES: CurrencyCode[] = [
	"AED",
	"SAR",
	"KWD",
	"QAR",
	"OMR",
	"BHD",
	"USD",
	"EUR",
	"GBP",
];

// دوال مساعدة
export function isFixedCurrency(currency: CurrencyCode): boolean {
	return FIXED_CURRENCIES.includes(currency);
}

export function isDynamicCurrency(currency: CurrencyCode): boolean {
	return DYNAMIC_CURRENCIES.includes(currency);
}

export function isHighPriorityCurrency(currency: CurrencyCode): boolean {
	return HIGH_PRIORITY_CURRENCIES.includes(currency);
}

export function getFixedRate(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): number | null {
	if (fromCurrency === toCurrency) return 1.0;

	const fromRate = FIXED_EXCHANGE_RATES[fromCurrency];
	const toRate = FIXED_EXCHANGE_RATES[toCurrency];

	if (fromRate && toRate) {
		return toRate / fromRate;
	}

	// إذا كانت إحدى العملات USD
	if (fromCurrency === "USD" && toRate) {
		return toRate;
	}
	if (toCurrency === "USD" && fromRate) {
		return 1 / fromRate;
	}

	return null;
}

export function getCountryByCurrency(
	currency: CurrencyCode,
): CountryConfig | undefined {
	return SUPPORTED_COUNTRIES.find((country) => country.currency === currency);
}

export function getCurrencyByCountry(
	countryCode: string,
): CurrencyCode | undefined {
	const country = SUPPORTED_COUNTRIES.find(
		(country) => country.code === countryCode,
	);
	return country?.currency;
}

// دالة للحصول على سعر احتياطي للعملة
export function getFallbackRate(
	fromCurrency: CurrencyCode,
	toCurrency: CurrencyCode,
): number {
	// إذا كانت العملة المصدر هي الدولار الأمريكي
	if (fromCurrency === "USD") {
		return FIXED_EXCHANGE_RATES[toCurrency] || 1.0;
	}

	// إذا كانت العملة الهدف هي الدولار الأمريكي
	if (toCurrency === "USD") {
		return 1.0 / (FIXED_EXCHANGE_RATES[fromCurrency] || 1.0);
	}

	// تحويل من عملة إلى أخرى عبر الدولار الأمريكي
	const fromRate = FIXED_EXCHANGE_RATES[fromCurrency] || 1.0;
	const toRate = FIXED_EXCHANGE_RATES[toCurrency] || 1.0;

	return toRate / fromRate;
}
