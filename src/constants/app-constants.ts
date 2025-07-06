/**
 * Application Constants
 * General constants used throughout the application
 */

export const DEFAULT_CURRENCY = "AED";
export const DEFAULT_LANGUAGE = "ar";

// Translation constants
export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export const DEFAULT_NAMESPACE = "common";

// Route mappings for localized URLs
export const LOCALIZED_ROUTES = {
	ar: {
		home: "/",
		about: "/main/about",
		contact: "/main/contact",
		shop: "/store/shop",
		cart: "/store/cart-items",
		checkout: "/store/checkout",
		jobs: "/main/jobs",
		wholesale: "/main/wholesale",
		login: "/auth/login",
		register: "/auth/register",
		"forgot-password": "/auth/forgot-password",
		"reset-password": "/auth/reset-password",
		terms: "/logistic/terms",
		privacy: "/logistic/privacy",
		refund: "/logistic/refund",
	},
	en: {
		home: "/",
		about: "/main/about",
		contact: "/main/contact",
		shop: "/store/shop",
		cart: "/store/cart-items",
		checkout: "/store/checkout",
		jobs: "/main/jobs",
		wholesale: "/main/wholesale",
		login: "/auth/login",
		register: "/auth/register",
		"forgot-password": "/auth/forgot-password",
		"reset-password": "/auth/reset-password",
		terms: "/logistic/terms",
		privacy: "/logistic/privacy",
		refund: "/logistic/refund",
	},
};

// Currency settings
export const CURRENCY_SETTINGS = {
	AED: {
		symbol: "د.إ",
		name: "درهم إماراتي",
		code: "AED",
		locale: "ar-AE",
	},
	USD: {
		symbol: "$",
		name: "US Dollar",
		code: "USD",
		locale: "en-US",
	},
	KWD: {
		symbol: "د.ك",
		name: "دينار كويتي",
		code: "KWD",
		locale: "ar-KW",
	},
};

// Language settings
export const LANGUAGE_SETTINGS = {
	ar: {
		name: "العربية",
		direction: "rtl",
		flag: "🇸🇦",
		locale: "ar",
	},
	en: {
		name: "English",
		direction: "ltr",
		flag: "🇺🇸",
		locale: "en",
	},
};

// Application metadata
export const APP_METADATA = {
	name: "Coffee Selection",
	description: "Premium coffee and tea marketplace",
	version: "3.0.0",
	author: "Coffee Selection Team",
	keywords: ["coffee", "tea", "marketplace", "premium"],
};

// API configuration
export const API_CONFIG = {
	timeout: 30000,
	retries: 3,
	baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
	version: "v1",
};

// Theme constants
export const THEME_CONSTANTS = {
	breakpoints: {
		sm: "30em",
		md: "48em",
		lg: "62em",
		xl: "80em",
		"2xl": "96em",
	},
	animations: {
		duration: {
			fast: 150,
			normal: 300,
			slow: 500,
		},
		easing: {
			ease: "cubic-bezier(0.4, 0, 0.2, 1)",
			easeIn: "cubic-bezier(0.4, 0, 1, 1)",
			easeOut: "cubic-bezier(0, 0, 0.2, 1)",
			easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
		},
	},
};

// Cache constants
export const CACHE_CONSTANTS = {
	ttl: {
		short: 5 * 60, // 5 minutes
		medium: 30 * 60, // 30 minutes
		long: 60 * 60, // 1 hour
		veryLong: 24 * 60 * 60, // 24 hours
	},
	keys: {
		products: "products",
		categories: "categories",
		user: "user",
		cart: "cart",
		filters: "filters",
		currency: "currency_rates",
	},
};
