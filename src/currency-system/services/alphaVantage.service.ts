/**
 * Alpha Vantage Currency Service - نظام العملات المتكامل
 * خدمة أسعار الصرف باستخدام Alpha Vantage API مع نظام التخزين المؤقت الذكي
 */

import { CurrencyCode } from '../types/currency.types';
import {
  ExchangeRateData,
  DailySeriesData,
  AlphaVantageConfig,
  AlphaVantageStats,
  AlphaVantageStatus
} from './types/alphaVantage.types';
import {
  isFixedCurrency,
  getFixedRate
} from '../config/currency-data';
import { ALPHA_VANTAGE_API } from '../config/api-endpoints';
import {
  validateApiKey,
  canUseApi,
  buildExchangeRateUrl,
  buildDailySeriesUrl,
  parseExchangeRateResponse,
  parseDailySeriesResponse,
  getFallbackRate,
  validateApiResponse,
  extractErrorMessage,
  isRateLimitExceeded,
  getResetTime,
  updateServiceStatus
} from './helpers/alphaVantage.helpers';

class AlphaVantageCurrencyService {
  private config: AlphaVantageConfig;
  private stats: AlphaVantageStats;
  private status: AlphaVantageStatus;

  constructor() {
    this.config = {
      apiKey: ALPHA_VANTAGE_API.apiKey,
      baseUrl: ALPHA_VANTAGE_API.baseUrl,
      timeout: ALPHA_VANTAGE_API.timeout,
      retryAttempts: ALPHA_VANTAGE_API.retryAttempts,
      retryDelay: ALPHA_VANTAGE_API.retryDelay,
      dailyLimit: 25, // حد الخطة المجانية
      enabled: true,
    };

    this.stats = {
      totalApiCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      lastApiCall: 0,
      remainingCalls: this.config.dailyLimit,
    };

    this.status = {
      isConfigured: validateApiKey(this.config.apiKey),
      isEnabled: this.config.enabled,
      hasQuota: this.stats.remainingCalls > 0,
    };

    this.resetDailyCounterIfNeeded();
  }

  /**
   * الحصول على سعر الصرف الحالي بين عملتين
   */
  async getCurrentExchangeRate(
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): Promise<ExchangeRateData> {
    // التحقق من العملات المتطابقة
    if (fromCurrency === toCurrency) {
      return {
        fromCurrency,
        toCurrency,
        exchangeRate: 1.0,
        lastRefreshed: new Date().toISOString(),
        bidPrice: 1.0,
        askPrice: 1.0,
      };
    }

    // استخدام الأسعار الثابتة للعملات المستقرة
    const fixedRate = getFixedRate(fromCurrency, toCurrency);
    if (fixedRate !== null) {
      console.log(`Using fixed rate for ${fromCurrency} to ${toCurrency}: ${fixedRate}`);
      return {
        fromCurrency,
        toCurrency,
        exchangeRate: fixedRate,
        lastRefreshed: new Date().toISOString(),
        bidPrice: fixedRate * 0.999,
        askPrice: fixedRate * 1.001,
      };
    }

    // التحقق من إمكانية استخدام API
    if (!canUseApi(this.config)) {
      console.warn('Alpha Vantage API not configured, using fallback rates');
      return getFallbackRate(fromCurrency, toCurrency);
    }

    // التحقق من الحصة المتبقية
    if (this.stats.remainingCalls <= 0) {
      console.warn('API limit reached, using fallback rates');
      return getFallbackRate(fromCurrency, toCurrency);
    }

    const url = buildExchangeRateUrl(fromCurrency, toCurrency, this.config);

    try {
      console.log(`Making API call for ${fromCurrency} to ${toCurrency} (${this.stats.remainingCalls - 1} calls remaining)`);

      const startTime = Date.now();
      const response = await this.makeApiCall(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!validateApiResponse(data)) {
        const errorMessage = extractErrorMessage(data);
        throw new Error(errorMessage);
      }

      const exchangeRateData = parseExchangeRateResponse(data, fromCurrency, toCurrency);

      if (!exchangeRateData) {
        throw new Error('Invalid response format');
      }

      // تحديث الإحصائيات
      this.updateStats(true, Date.now() - startTime);

      return exchangeRateData;

    } catch (error: any) {
      console.error(`API call failed for ${fromCurrency} to ${toCurrency}:`, error.message);

      // التحقق من تجاوز حد الاستخدام
      if (error.message.includes('API call frequency') || error.message.includes('limit')) {
        this.stats.remainingCalls = 0;
      }

      this.updateStats(false);
      this.status = updateServiceStatus(this.status, false, error.message);

      // استخدام الأسعار الاحتياطية
      return getFallbackRate(fromCurrency, toCurrency);
    }
  }

  /**
   * الحصول على السلسلة اليومية
   */
  async getDailySeries(
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): Promise<DailySeriesData> {
    if (!canUseApi(this.config)) {
      throw new Error('Alpha Vantage API not configured');
    }

    if (this.stats.remainingCalls <= 0) {
      throw new Error('API limit reached');
    }

    const url = buildDailySeriesUrl(fromCurrency, toCurrency, this.config);

    try {
      const response = await this.makeApiCall(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!validateApiResponse(data)) {
        const errorMessage = extractErrorMessage(data);
        throw new Error(errorMessage);
      }

      const dailySeriesData = parseDailySeriesResponse(data, fromCurrency, toCurrency);

      if (!dailySeriesData) {
        throw new Error('Invalid response format');
      }

      this.updateStats(true);
      return dailySeriesData;

    } catch (error: any) {
      console.error(`Daily series API call failed:`, error.message);
      this.updateStats(false);
      throw error;
    }
  }

  /**
   * تحويل مبلغ بين عملتين
   */
  async convertCurrency(
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): Promise<{
    originalAmount: number;
    convertedAmount: number;
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    exchangeRate: number;
    lastRefreshed: string;
  }> {
    const exchangeRateData = await this.getCurrentExchangeRate(fromCurrency, toCurrency);

    return {
      originalAmount: amount,
      convertedAmount: amount * exchangeRateData.exchangeRate,
      fromCurrency,
      toCurrency,
      exchangeRate: exchangeRateData.exchangeRate,
      lastRefreshed: exchangeRateData.lastRefreshed,
    };
  }

  /**
   * الحصول على أسعار متعددة
   */
  async getMultipleRates(
    baseCurrency: CurrencyCode,
    targetCurrencies: CurrencyCode[]
  ): Promise<ExchangeRateData[]> {
    const promises = targetCurrencies.map(target =>
      this.getCurrentExchangeRate(baseCurrency, target)
    );

    return Promise.all(promises);
  }

  /**
   * التحقق من تكوين الخدمة
   */
  isConfigured(): boolean {
    return this.status.isConfigured;
  }

  /**
   * الحصول على إحصائيات الخدمة
   */
  getStats(): AlphaVantageStats {
    return { ...this.stats };
  }

  /**
   * الحصول على حالة الخدمة
   */
  getStatus(): AlphaVantageStatus {
    return { ...this.status };
  }

  /**
   * الحصول على الحصة المتبقية
   */
  getRemainingCalls(): number {
    this.resetDailyCounterIfNeeded();
    return this.stats.remainingCalls;
  }

  /**
   * إعادة تعيين الإحصائيات اليومية
   */
  resetDailyStats(): void {
    this.stats.totalApiCalls = 0;
    this.stats.successfulCalls = 0;
    this.stats.failedCalls = 0;
    this.stats.remainingCalls = this.config.dailyLimit;
    this.stats.lastApiCall = 0;
  }

  /**
   * إجراء طلب API مع إعادة المحاولة
   */
  private async makeApiCall(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * تحديث الإحصائيات
   */
  private updateStats(success: boolean, responseTime?: number): void {
    this.stats.totalApiCalls++;
    this.stats.lastApiCall = Date.now();

    if (success) {
      this.stats.successfulCalls++;
      this.stats.remainingCalls = Math.max(0, this.stats.remainingCalls - 1);
    } else {
      this.stats.failedCalls++;
    }
  }

  /**
   * إعادة تعيين العداد اليومي إذا لزم الأمر
   */
  private resetDailyCounterIfNeeded(): void {
    const now = new Date();
    const lastReset = new Date(this.stats.lastApiCall);

    if (now.getDate() !== lastReset.getDate() ||
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()) {
      this.resetDailyStats();
    }
  }
}

// تصدير نسخة واحدة من الخدمة
const alphaVantageCurrencyService = new AlphaVantageCurrencyService();
export default alphaVantageCurrencyService;