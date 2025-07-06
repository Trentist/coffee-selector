/**
 * Currency Provider Component
 * مكون مزود نظام العملة
 */

"use client";

import { ReactNode, createContext, useContext, useMemo, useState } from "react";

interface CurrencyContextType {
	currency: string;
	setCurrency: (currency: string) => void;
	exchangeRate: number;
	setExchangeRate: (rate: number) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
	undefined,
);

interface CurrencyProviderWrapperProps {
	children: ReactNode;
}

export const CurrencyProviderWrapper = ({
	children,
}: CurrencyProviderWrapperProps) => {
	const [currency, setCurrency] = useState("SAR");
	const [exchangeRate, setExchangeRate] = useState(1);

	const value = useMemo(
		() => ({
			currency,
			setCurrency,
			exchangeRate,
			setExchangeRate,
		}),
		[currency, exchangeRate],
	);

	return (
		<CurrencyContext.Provider value={value}>
			{children}
		</CurrencyContext.Provider>
	);
};

// Custom hook to use currency context
export const useCurrency = () => {
	const context = useContext(CurrencyContext);
	if (context === undefined) {
		throw new Error("useCurrency must be used within CurrencyProvider");
	}
	return context;
};

export default CurrencyProviderWrapper;
