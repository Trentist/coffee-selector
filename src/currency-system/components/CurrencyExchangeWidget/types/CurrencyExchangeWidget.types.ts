/**
 * Currency Exchange Widget Types - نظام العملات المتكامل
 * أنواع البيانات لمكون تحويل العملة
 */

import { CurrencyCode } from "../../../types/currency.types";

// خصائص المكون
export interface CurrencyExchangeWidgetProps {
	// العملات الافتراضية
	defaultFromCurrency?: CurrencyCode;
	defaultToCurrency?: CurrencyCode;

	// المظهر
	variant?: "default" | "compact" | "detailed";
	size?: "sm" | "md" | "lg";

	// الوظائف
	showSwapButton?: boolean;
	showRefreshButton?: boolean;
	showStats?: boolean;
	autoRefresh?: boolean;
	refreshInterval?: number;

	// الأحداث
	onCurrencyChange?: (from: CurrencyCode, to: CurrencyCode) => void;
	onAmountChange?: (amount: number, converted: number) => void;
	onError?: (error: string) => void;

	// التخصيص
	className?: string;
	style?: React.CSSProperties;
}

// حالة المكون
export interface CurrencyExchangeWidgetState {
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;
	amount: string;
	convertedAmount: string;
	exchangeRate: number | null;
	loading: boolean;
	error: string | null;
	lastUpdated: string | null;
	provider: string | null;
}

// خيارات العملة
export interface CurrencyOption {
	code: CurrencyCode;
	name: string;
	nameAr?: string;
	symbol: string;
	flag?: string;
}

// إحصائيات المكون
export interface WidgetStats {
	cacheHitRate: number;
	successRate: number;
	remainingAPICalls: number;
	lastRefresh: string;
}

// أنواع الأحداث
export interface CurrencyChangeEvent {
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;
	exchangeRate: number | null;
	provider: string | null;
}

export interface AmountChangeEvent {
	originalAmount: number;
	convertedAmount: number;
	fromCurrency: CurrencyCode;
	toCurrency: CurrencyCode;
	exchangeRate: number;
}

export interface ErrorEvent {
	message: string;
	code?: string;
	type: "api_error" | "validation_error" | "network_error";
}
