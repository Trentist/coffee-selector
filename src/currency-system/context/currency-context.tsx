/**
 * Currency Context - نظام العملات المتكامل
 * Context لإدارة حالة العملة في التطبيق
 */

import React, {
	createContext,
	useContext,
	useReducer,
	useEffect,
	ReactNode,
} from "react";
import { CurrencyCode } from "../types/currency.types";
import { PriceConversion } from "../types/currency.types";
import currencyService from "../services/currency.service";
import currencySettingsService from "../services/currencySettings.service";

// أنواع الحالة
interface CurrencyState {
	// العملات الحالية
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;

	// سعر الصرف الحالي
	exchangeRate: number | null;
	lastUpdated: string | null;
	provider: string | null;

	// حالة التحميل
	loading: boolean;
	error: string | null;

	// الإحصائيات
	stats: {
		cacheHitRate: number;
		successRate: number;
		remainingAPICalls: number;
	};

	// العملات المدعومة
	supportedCurrencies: CurrencyCode[];
	defaultCurrency: CurrencyCode;
}

// أنواع الإجراءات
type CurrencyAction =
	| { type: "SET_FROM_CURRENCY"; payload: CurrencyCode }
	| { type: "SET_TO_CURRENCY"; payload: CurrencyCode }
	| { type: "SET_EXCHANGE_RATE"; payload: { rate: number; provider: string } }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "UPDATE_STATS"; payload: any }
	| { type: "SWAP_CURRENCIES" }
	| { type: "REFRESH_RATE" };

// الحالة الأولية
const initialState: CurrencyState = {
	fromCurrency: currencySettingsService.getDefaultCurrency(),
	toCurrency: "USD",
	exchangeRate: null,
	lastUpdated: null,
	provider: null,
	loading: false,
	error: null,
	stats: {
		cacheHitRate: 0,
		successRate: 0,
		remainingAPICalls: 0,
	},
	supportedCurrencies:
		currencySettingsService.getSettings().supportedCurrencies,
	defaultCurrency: currencySettingsService.getDefaultCurrency(),
};

// Reducer
function currencyReducer(
	state: CurrencyState,
	action: CurrencyAction,
): CurrencyState {
	switch (action.type) {
		case "SET_FROM_CURRENCY":
			return {
				...state,
				fromCurrency: action.payload,
			};

		case "SET_TO_CURRENCY":
			return {
				...state,
				toCurrency: action.payload,
			};

		case "SET_EXCHANGE_RATE":
			return {
				...state,
				exchangeRate: action.payload.rate,
				provider: action.payload.provider,
				lastUpdated: new Date().toISOString(),
				error: null,
			};

		case "SET_LOADING":
			return {
				...state,
				loading: action.payload,
			};

		case "SET_ERROR":
			return {
				...state,
				error: action.payload,
				loading: false,
			};

		case "UPDATE_STATS":
			return {
				...state,
				stats: action.payload,
			};

		case "SWAP_CURRENCIES":
			return {
				...state,
				fromCurrency: state.toCurrency,
				toCurrency: state.fromCurrency,
			};

		case "REFRESH_RATE":
			return {
				...state,
				loading: true,
				error: null,
			};

		default:
			return state;
	}
}

// Context
interface CurrencyContextType {
	state: CurrencyState;
	actions: {
		setFromCurrency: (currency: CurrencyCode) => void;
		setToCurrency: (currency: CurrencyCode) => void;
		swapCurrencies: () => void;
		convertCurrency: (amount: number) => Promise<PriceConversion>;
		refreshRate: () => Promise<void>;
		updateStats: () => void;
	};
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
	undefined,
);

// Provider
interface CurrencyProviderProps {
	children: ReactNode;
	autoRefresh?: boolean;
	refreshInterval?: number;
}

export function CurrencyProvider({
	children,
	autoRefresh = false,
	refreshInterval = 30 * 60 * 1000,
}: CurrencyProviderProps) {
	const [state, dispatch] = useReducer(currencyReducer, initialState);

	/**
	 * تحديث سعر الصرف
	 */
	const updateExchangeRate = async () => {
		if (state.fromCurrency === state.toCurrency) {
			dispatch({
				type: "SET_EXCHANGE_RATE",
				payload: { rate: 1.0, provider: "internal" },
			});
			return;
		}

		dispatch({ type: "SET_LOADING", payload: true });

		try {
			const response = await currencyService.getExchangeRate(
				state.fromCurrency,
				state.toCurrency,
			);

			if (response.success) {
				dispatch({
					type: "SET_EXCHANGE_RATE",
					payload: {
						rate: response.rates![state.toCurrency],
						provider: response.provider!,
					},
				});
			} else {
				throw new Error(
					response.error?.message || "Failed to get exchange rate",
				);
			}
		} catch (error: any) {
			dispatch({ type: "SET_ERROR", payload: error.message });
		}
	};

	/**
	 * تحديث الإحصائيات
	 */
	const updateStats = () => {
		const systemStats = currencyService.getSystemStats();
		dispatch({
			type: "UPDATE_STATS",
			payload: {
				cacheHitRate:
					systemStats.cache.totalCacheHits +
						systemStats.cache.totalCacheMisses >
					0
						? (systemStats.cache.totalCacheHits /
								(systemStats.cache.totalCacheHits +
									systemStats.cache.totalCacheMisses)) *
							100
						: 0,
				successRate:
					systemStats.settings.totalRequests > 0
						? ((systemStats.settings.totalRequests -
								systemStats.settings.errors) /
								systemStats.settings.totalRequests) *
							100
						: 100,
				remainingAPICalls: systemStats.remainingAPICalls,
			},
		});
	};

	// الإجراءات
	const actions = {
		setFromCurrency: (currency: CurrencyCode) => {
			dispatch({ type: "SET_FROM_CURRENCY", payload: currency });
		},

		setToCurrency: (currency: CurrencyCode) => {
			dispatch({ type: "SET_TO_CURRENCY", payload: currency });
		},

		swapCurrencies: () => {
			dispatch({ type: "SWAP_CURRENCIES" });
		},

		convertCurrency: async (amount: number): Promise<PriceConversion> => {
			return await currencyService.convertCurrency(
				amount,
				state.fromCurrency,
				state.toCurrency,
			);
		},

		refreshRate: async () => {
			dispatch({ type: "REFRESH_RATE" });
			await updateExchangeRate();
			updateStats();
		},

		updateStats,
	};

	// التحديث عند تغيير العملات
	useEffect(() => {
		updateExchangeRate();
	}, [state.fromCurrency, state.toCurrency]);

	// التحديث التلقائي الدوري
	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			updateExchangeRate();
			updateStats();
		}, refreshInterval);

		return () => clearInterval(interval);
	}, [autoRefresh, refreshInterval]);

	// تحديث الإحصائيات عند التحميل
	useEffect(() => {
		updateStats();
	}, []);

	// تنظيف النظام عند إلغاء التحميل
	useEffect(() => {
		return () => {
			currencyService.cleanup();
		};
	}, []);

	return (
		<CurrencyContext.Provider value={{ state, actions }}>
			{children}
		</CurrencyContext.Provider>
	);
}

// Hook لاستخدام Context
export function useCurrencyContext(): CurrencyContextType {
	const context = useContext(CurrencyContext);
	if (context === undefined) {
		throw new Error(
			"useCurrencyContext must be used within a CurrencyProvider",
		);
	}
	return context;
}
