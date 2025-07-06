/**
 * Currency API - نظام العملات المتكامل
 * نقاط اتصال API لأسعار الصرف
 */

import { NextApiRequest, NextApiResponse } from "next";
import { CurrencyCode } from "../types/currency.types";
import currencyService from "../services/currency.service";
import { validateApiKey, isApiConfigured } from "../config/api-endpoints";

// أنواع الاستجابة
interface ApiResponse {
	success: boolean;
	data?: any;
	error?: {
		code: string;
		message: string;
		type: string;
	};
	timestamp: number;
	provider?: string;
}

/**
 * API للحصول على سعر الصرف
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>,
) {
	// التحقق من طريقة الطلب
	if (req.method !== "GET") {
		return res.status(405).json({
			success: false,
			error: {
				code: "METHOD_NOT_ALLOWED",
				message: "Method not allowed",
				type: "validation_error",
			},
			timestamp: Date.now(),
		});
	}

	try {
		const { from, to, amount } = req.query;

		// التحقق من المعاملات المطلوبة
		if (!from || !to) {
			return res.status(400).json({
				success: false,
				error: {
					code: "MISSING_PARAMETERS",
					message: "Missing required parameters: from, to",
					type: "validation_error",
				},
				timestamp: Date.now(),
			});
		}

		// التحقق من صحة العملات
		const fromCurrency = from as CurrencyCode;
		const toCurrency = to as CurrencyCode;

		if (!isValidCurrency(fromCurrency) || !isValidCurrency(toCurrency)) {
			return res.status(400).json({
				success: false,
				error: {
					code: "INVALID_CURRENCY",
					message: "Invalid currency code",
					type: "validation_error",
				},
				timestamp: Date.now(),
			});
		}

		// التحقق من تكوين API
		if (!isApiConfigured()) {
			return res.status(503).json({
				success: false,
				error: {
					code: "API_NOT_CONFIGURED",
					message: "Currency API not configured",
					type: "service_error",
				},
				timestamp: Date.now(),
			});
		}

		// الحصول على سعر الصرف
		const response = await currencyService.getExchangeRate(
			fromCurrency,
			toCurrency,
		);

		if (!response.success) {
			return res.status(500).json({
				success: false,
				error: {
					code: "EXCHANGE_RATE_ERROR",
					message: response.error?.message || "Failed to get exchange rate",
					type: "api_error",
				},
				timestamp: Date.now(),
				provider: response.provider,
			});
		}

		// إذا كان هناك مبلغ، قم بالتحويل
		if (amount) {
			const amountNum = parseFloat(amount as string);
			if (isNaN(amountNum) || amountNum < 0) {
				return res.status(400).json({
					success: false,
					error: {
						code: "INVALID_AMOUNT",
						message: "Invalid amount",
						type: "validation_error",
					},
					timestamp: Date.now(),
				});
			}

			const conversion = await currencyService.convertCurrency(
				amountNum,
				fromCurrency,
				toCurrency,
			);

			return res.status(200).json({
				success: true,
				data: {
					from: fromCurrency,
					to: toCurrency,
					amount: amountNum,
					convertedAmount: conversion.convertedAmount,
					exchangeRate: conversion.exchangeRate,
					lastRefreshed: conversion.lastRefreshed,
				},
				timestamp: Date.now(),
				provider: response.provider,
			});
		}

		// إرجاع سعر الصرف فقط
		return res.status(200).json({
			success: true,
			data: {
				from: fromCurrency,
				to: toCurrency,
				exchangeRate: response.rates![toCurrency],
				lastRefreshed: new Date(response.timestamp!).toISOString(),
			},
			timestamp: Date.now(),
			provider: response.provider,
		});
	} catch (error: any) {
		console.error("Currency API error:", error);

		return res.status(500).json({
			success: false,
			error: {
				code: "INTERNAL_ERROR",
				message: "Internal server error",
				type: "server_error",
			},
			timestamp: Date.now(),
		});
	}
}

/**
 * التحقق من صحة رمز العملة
 */
function isValidCurrency(currency: string): currency is CurrencyCode {
	const validCurrencies: CurrencyCode[] = [
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
		"CHF",
		"CAD",
		"AUD",
		"JOD",
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

	return validCurrencies.includes(currency as CurrencyCode);
}
