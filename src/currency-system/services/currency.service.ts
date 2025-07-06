/**
 * Currency Service - نظام العملات المتكامل
 * الخدمة الرئيسية لإدارة أسعار الصرف مع التبديل التلقائي والتخزين المؤقت
 */

import { CurrencyCode } from "../types/currency.types";
import {
	ExchangeRateData,
	PriceConversion,
	CurrencyApiResponse,
} from "../types/currency.types";
import {
	getFixedRate,
	isFixedCurrency,
	getFallbackRate,
} from "../config/currency-data";
import alphaVantageService from "./alphaVantage.service";
import currencyCacheService from "./currencyCache.service";
import currencySettingsService from "./currencySettings.service";

class CurrencyService {
	private currentProvider: string = "exchangeRateApi";
	private providers: string[] = ["exchangeRateApi", "alphaVantage", "fallback"];
	private providerIndex: number = 0;

	constructor() {
		this.currentProvider = currencySettingsService.getCurrentProvider();
	}

	/**
	 * الحصول على سعر الصرف الحالي
	 */
	async getExchangeRate(
		fromCurrency: CurrencyCode,
		toCurrency: CurrencyCode,
	): Promise<CurrencyApiResponse> {
		const startTime = Date.now();

		try {
			// التحقق من العملات المتطابقة
			if (fromCurrency === toCurrency) {
				return {
					success: true,
					rates: { [toCurrency]: 1.0 },
					base: fromCurrency,
					timestamp: Date.now(),
					provider: "internal",
					cached: false,
				};
			}

			// استخدام الأسعار الثابتة للعملات المستقرة
			const fixedRate = getFixedRate(fromCurrency, toCurrency);
			if (fixedRate !== null) {
				return {
					success: true,
					rates: { [toCurrency]: fixedRate },
					base: fromCurrency,
					timestamp: Date.now(),
					provider: "fixed",
					cached: false,
				};
			}

			// التحقق من التخزين المؤقت أولاً
			const cached = currencyCacheService.getCachedRate(
				fromCurrency,
				toCurrency,
			);
			if (cached) {
				currencySettingsService.recordUsage(
					fromCurrency,
					toCurrency,
					Date.now() - startTime,
					true,
					true,
					"cache",
				);

				return {
					success: true,
					rates: { [toCurrency]: cached.exchangeRate },
					base: fromCurrency,
					timestamp: Date.now(),
					provider: cached.provider,
					cached: true,
				};
			}

			// محاولة الحصول من API
			const apiResponse = await this.fetchFromAPI(fromCurrency, toCurrency);

			if (apiResponse.success) {
				// تخزين في التخزين المؤقت
				const rate = apiResponse.rates![toCurrency];
				currencyCacheService.setCachedRate(
					fromCurrency,
					toCurrency,
					rate,
					undefined,
					undefined,
					apiResponse.provider!,
				);

				currencySettingsService.recordUsage(
					fromCurrency,
					toCurrency,
					Date.now() - startTime,
					true,
					false,
					apiResponse.provider!,
				);

				return apiResponse;
			}

			// استخدام الأسعار الاحتياطية
			const fallbackRate = getFallbackRate(fromCurrency, toCurrency);

			currencySettingsService.recordUsage(
				fromCurrency,
				toCurrency,
				Date.now() - startTime,
				true,
				false,
				"fallback",
			);

			return {
				success: true,
				rates: { [toCurrency]: fallbackRate.exchangeRate },
				base: fromCurrency,
				timestamp: Date.now(),
				provider: "fallback",
				cached: false,
			};
		} catch (error: any) {
			currencySettingsService.recordUsage(
				fromCurrency,
				toCurrency,
				Date.now() - startTime,
				false,
				false,
				this.currentProvider,
				error.message,
			);

			currencySettingsService.recordError(
				"api_error",
				error.message,
				this.currentProvider,
			);

			// استخدام الأسعار الاحتياطية في حالة الخطأ
			const fallbackRate = getFallbackRate(fromCurrency, toCurrency);

			return {
				success: true,
				rates: { [toCurrency]: fallbackRate.exchangeRate },
				base: fromCurrency,
				timestamp: Date.now(),
				provider: "fallback",
				cached: false,
				error: {
					code: "FALLBACK_USED",
					message: "Using fallback rates due to API error",
					type: "api_error",
				},
			};
		}
	}

	/**
	 * تحويل مبلغ بين عملتين
	 */
	async convertCurrency(
		amount: number,
		fromCurrency: CurrencyCode,
		toCurrency: CurrencyCode,
	): Promise<PriceConversion> {
		const response = await this.getExchangeRate(fromCurrency, toCurrency);

		if (!response.success) {
			throw new Error("Failed to get exchange rate");
		}

		const rate = response.rates![toCurrency];

		return {
			originalAmount: amount,
			convertedAmount: amount * rate,
			fromCurrency,
			toCurrency,
			exchangeRate: rate,
			lastRefreshed: new Date(response.timestamp!).toISOString(),
			provider: response.provider!,
		};
	}

	/**
	 * الحصول على أسعار متعددة
	 */
	async getMultipleRates(
		baseCurrency: CurrencyCode,
		targetCurrencies: CurrencyCode[],
	): Promise<CurrencyApiResponse> {
		const rates: Record<CurrencyCode, number> = {};
		const errors: string[] = [];

		for (const targetCurrency of targetCurrencies) {
			try {
				const response = await this.getExchangeRate(
					baseCurrency,
					targetCurrency,
				);
				if (response.success) {
					rates[targetCurrency] = response.rates![targetCurrency];
				}
			} catch (error: any) {
				errors.push(`${targetCurrency}: ${error.message}`);
			}
		}

		return {
			success: errors.length === 0,
			rates,
			base: baseCurrency,
			timestamp: Date.now(),
			provider: this.currentProvider,
			cached: false,
			error:
				errors.length > 0
					? {
							code: "PARTIAL_FAILURE",
							message: `Some rates failed: ${errors.join(", ")}`,
							type: "api_error",
						}
					: undefined,
		};
	}

	/**
	 * تحديث الأسعار في الخلفية
	 */
	async refreshRates(
		currencies: Array<{ from: CurrencyCode; to: CurrencyCode }>,
	): Promise<void> {
		const promises = currencies.map(({ from, to }) =>
			this.getExchangeRate(from, to).catch((error) => {
				console.warn(`Failed to refresh rate for ${from} to ${to}:`, error);
			}),
		);

		await Promise.allSettled(promises);
	}

	/**
	 * الحصول على إحصائيات النظام
	 */
	getSystemStats() {
		return {
			cache: currencyCacheService.getMetrics(),
			settings: currencySettingsService.getUsageStats(),
			service: currencySettingsService.getServiceStatus(),
			currentProvider: this.currentProvider,
			remainingAPICalls: currencyCacheService.getRemainingAPICalls(),
		};
	}

	/**
	 * تبديل مزود الخدمة
	 */
	switchProvider(provider: string): boolean {
		if (this.providers.includes(provider)) {
			this.currentProvider = provider;
			currencySettingsService.setProvider(provider);
			return true;
		}
		return false;
	}

	/**
	 * الحصول على مزود الخدمة التالي
	 */
	getNextProvider(): string {
		this.providerIndex = (this.providerIndex + 1) % this.providers.length;
		const nextProvider = this.providers[this.providerIndex];
		this.switchProvider(nextProvider);
		return nextProvider;
	}

	/**
	 * جلب البيانات من API
	 */
	private async fetchFromAPI(
		fromCurrency: CurrencyCode,
		toCurrency: CurrencyCode,
	): Promise<CurrencyApiResponse> {
		// التحقق من إمكانية إجراء طلب API
		if (!currencyCacheService.canMakeAPICall()) {
			throw new Error("API limit reached");
		}

		currencyCacheService.recordAPICall();

		// محاولة استخدام Alpha Vantage
		if (alphaVantageService.isConfigured()) {
			try {
				const rateData = await alphaVantageService.getCurrentExchangeRate(
					fromCurrency,
					toCurrency,
				);

				return {
					success: true,
					rates: { [toCurrency]: rateData.exchangeRate },
					base: fromCurrency,
					timestamp: Date.now(),
					provider: "alphaVantage",
					cached: false,
				};
			} catch (error: any) {
				console.warn("Alpha Vantage failed, trying fallback:", error.message);
				// الاستمرار إلى الأسعار الاحتياطية
			}
		}

		// إذا فشل كل شيء، رمي خطأ لاستخدام الأسعار الاحتياطية
		throw new Error("All API providers failed");
	}

	/**
	 * تنظيف النظام
	 */
	cleanup(): void {
		currencyCacheService.clearExpiredCache();
	}
}

// تصدير نسخة واحدة من الخدمة
const currencyService = new CurrencyService();
export default currencyService;
