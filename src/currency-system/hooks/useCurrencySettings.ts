/**
 * useCurrencySettings Hook - نظام العملات المتكامل
 * Hook لإدارة إعدادات العملة
 */

import { useState, useEffect, useCallback } from "react";
import { CurrencyCode } from "../types/currency.types";
import { CurrencySettings, UsageStats } from "../services/types/settings.types";
import currencySettingsService from "../services/currencySettings.service";

interface UseCurrencySettingsReturn {
	// الإعدادات
	settings: CurrencySettings;
	updateSettings: (newSettings: Partial<CurrencySettings>) => boolean;
	resetSettings: () => void;

	// العملة الافتراضية
	defaultCurrency: CurrencyCode;
	setDefaultCurrency: (currency: CurrencyCode) => boolean;

	// العملات المدعومة
	supportedCurrencies: CurrencyCode[];
	addSupportedCurrency: (currency: CurrencyCode) => boolean;
	removeSupportedCurrency: (currency: CurrencyCode) => boolean;

	// التخزين المؤقت
	isCacheEnabled: boolean;
	setCacheEnabled: (enabled: boolean) => void;
	cacheTTL: number;
	setCacheTTL: (ttl: number) => void;

	// مزود API
	currentProvider: string;
	setProvider: (provider: string) => void;

	// الإحصائيات
	usageStats: UsageStats;
	todayStats: {
		requests: number;
		hits: number;
		misses: number;
		errors: number;
		successRate: number;
		cacheHitRate: number;
	};

	// الإجراءات
	resetStats: () => void;
	refreshStats: () => void;
}

export function useCurrencySettings(): UseCurrencySettingsReturn {
	// الحالة
	const [settings, setSettingsState] = useState<CurrencySettings>(
		currencySettingsService.getSettings(),
	);
	const [usageStats, setUsageStats] = useState<UsageStats>(
		currencySettingsService.getUsageStats(),
	);

	/**
	 * تحديث الإعدادات
	 */
	const updateSettings = useCallback(
		(newSettings: Partial<CurrencySettings>): boolean => {
			const success = currencySettingsService.updateSettings(newSettings);
			if (success) {
				setSettingsState(currencySettingsService.getSettings());
			}
			return success;
		},
		[],
	);

	/**
	 * إعادة تعيين الإعدادات
	 */
	const resetSettings = useCallback(() => {
		currencySettingsService.resetSettings();
		setSettingsState(currencySettingsService.getSettings());
	}, []);

	/**
	 * تعيين العملة الافتراضية
	 */
	const setDefaultCurrency = useCallback((currency: CurrencyCode): boolean => {
		const success = currencySettingsService.setDefaultCurrency(currency);
		if (success) {
			setSettingsState(currencySettingsService.getSettings());
		}
		return success;
	}, []);

	/**
	 * إضافة عملة مدعومة
	 */
	const addSupportedCurrency = useCallback(
		(currency: CurrencyCode): boolean => {
			const success = currencySettingsService.addSupportedCurrency(currency);
			if (success) {
				setSettingsState(currencySettingsService.getSettings());
			}
			return success;
		},
		[],
	);

	/**
	 * إزالة عملة مدعومة
	 */
	const removeSupportedCurrency = useCallback(
		(currency: CurrencyCode): boolean => {
			const success = currencySettingsService.removeSupportedCurrency(currency);
			if (success) {
				setSettingsState(currencySettingsService.getSettings());
			}
			return success;
		},
		[],
	);

	/**
	 * تفعيل/إلغاء تفعيل التخزين المؤقت
	 */
	const setCacheEnabled = useCallback((enabled: boolean) => {
		currencySettingsService.setCacheEnabled(enabled);
		setSettingsState(currencySettingsService.getSettings());
	}, []);

	/**
	 * تعيين TTL التخزين المؤقت
	 */
	const setCacheTTL = useCallback((ttl: number) => {
		currencySettingsService.setCacheTTL(ttl);
		setSettingsState(currencySettingsService.getSettings());
	}, []);

	/**
	 * تعيين مزود API
	 */
	const setProvider = useCallback((provider: string) => {
		currencySettingsService.setProvider(provider);
		setSettingsState(currencySettingsService.getSettings());
	}, []);

	/**
	 * إعادة تعيين الإحصائيات
	 */
	const resetStats = useCallback(() => {
		currencySettingsService.resetStats();
		setUsageStats(currencySettingsService.getUsageStats());
	}, []);

	/**
	 * تحديث الإحصائيات
	 */
	const refreshStats = useCallback(() => {
		setUsageStats(currencySettingsService.getUsageStats());
	}, []);

	// تحديث الإحصائيات عند التحميل
	useEffect(() => {
		refreshStats();
	}, [refreshStats]);

	// حساب إحصائيات اليوم
	const todayStats = {
		requests: usageStats.dailyStats[new Date().toDateString()]?.requests || 0,
		hits: usageStats.dailyStats[new Date().toDateString()]?.hits || 0,
		misses: usageStats.dailyStats[new Date().toDateString()]?.misses || 0,
		errors: usageStats.dailyStats[new Date().toDateString()]?.errors || 0,
		successRate: usageStats.dailyStats[new Date().toDateString()]
			? ((usageStats.dailyStats[new Date().toDateString()].requests -
					usageStats.dailyStats[new Date().toDateString()].errors) /
					usageStats.dailyStats[new Date().toDateString()].requests) *
				100
			: 100,
		cacheHitRate: usageStats.dailyStats[new Date().toDateString()]
			? (usageStats.dailyStats[new Date().toDateString()].hits /
					usageStats.dailyStats[new Date().toDateString()].requests) *
				100
			: 0,
	};

	return {
		// الإعدادات
		settings,
		updateSettings,
		resetSettings,

		// العملة الافتراضية
		defaultCurrency: settings.defaultCurrency,
		setDefaultCurrency,

		// العملات المدعومة
		supportedCurrencies: settings.supportedCurrencies,
		addSupportedCurrency,
		removeSupportedCurrency,

		// التخزين المؤقت
		isCacheEnabled: settings.cacheEnabled,
		setCacheEnabled,
		cacheTTL: settings.cacheTTL,
		setCacheTTL,

		// مزود API
		currentProvider: settings.apiProvider,
		setProvider,

		// الإحصائيات
		usageStats,
		todayStats,

		// الإجراءات
		resetStats,
		refreshStats,
	};
}
