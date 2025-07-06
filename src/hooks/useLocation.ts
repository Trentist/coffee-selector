/**
 * Location Detection Hook
 * Integrates with currency system for automatic location-based currency detection
 */

import { useState, useEffect, useCallback } from "react";
import {
	EnhancedIPService,
	EnhancedIPData,
	IPServiceResponse,
} from "../services/location";
import { useCurrency } from "./useCurrency";

export interface LocationState {
	loading: boolean;
	error: string | null;
	data: EnhancedIPData | null;
	shippingInfo: {
		country: string;
		countryName: string;
		region: string;
		city: string;
		currency: string;
		isEU: boolean;
		recommendedShipping: {
			isAramexSupported: boolean;
			estimatedDays: number;
			isDomestic: boolean;
			isInternational: boolean;
		};
	} | null;
}

export const useLocation = () => {
	const [state, setState] = useState<LocationState>({
		loading: true,
		error: null,
		data: null,
		shippingInfo: null,
	});

	const { setCurrency } = useCurrency();
	const ipService = EnhancedIPService.getInstance();

	/**
	 * Detect current location and update currency
	 */
	const detectLocation = useCallback(async () => {
		try {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			// Get current IP information
			const ipResult: IPServiceResponse = await ipService.getCurrentIPInfo();

			if (!ipResult.success || !ipResult.data) {
				throw new Error(ipResult.error || "Failed to detect location");
			}

			// Get shipping information
			const shippingResult = await ipService.getShippingInfo();

			if (!shippingResult.success || !shippingResult.data) {
				throw new Error("Failed to get shipping information");
			}

			// Update state
			setState({
				loading: false,
				error: null,
				data: ipResult.data,
				shippingInfo: shippingResult.data,
			});

			// Auto-update currency based on location
			if (ipResult.data.currency) {
				setCurrency(ipResult.data.currency);
			}

			return {
				success: true,
				ipData: ipResult.data,
				shippingData: shippingResult.data,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			setState((prev) => ({
				...prev,
				loading: false,
				error: errorMessage,
			}));

			return {
				success: false,
				error: errorMessage,
			};
		}
	}, [ipService, setCurrency]);

	/**
	 * Get information for specific IP
	 */
	const getIPInfo = useCallback(
		async (ip: string) => {
			try {
				const result = await ipService.getIPInfo(ip);
				return result;
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				};
			}
		},
		[ipService],
	);

	/**
	 * Get shipping information for current location
	 */
	const getShippingInfo = useCallback(async () => {
		try {
			const result = await ipService.getShippingInfo();
			return result;
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}, [ipService]);

	/**
	 * Clear location cache
	 */
	const clearCache = useCallback(() => {
		ipService.clearOldCache();
	}, [ipService]);

	/**
	 * Get cache statistics
	 */
	const getCacheStats = useCallback(() => {
		return ipService.getCacheStats();
	}, [ipService]);

	// Auto-detect location on mount
	useEffect(() => {
		detectLocation();
	}, [detectLocation]);

	return {
		...state,
		detectLocation,
		getIPInfo,
		getShippingInfo,
		clearCache,
		getCacheStats,
	};
};
