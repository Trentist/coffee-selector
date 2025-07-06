/**
 * Environment Keys - مفاتيح البيئة الموحدة
 * جميع مفاتيح البيئة المستخدمة في التطبيق
 */

// ============================================================================
// ODOO CONFIGURATION - إعدادات Odoo
// ============================================================================

export const ODOO_KEYS = {
	// GraphQL Endpoint
	GRAPHQL_URL: "NEXT_PUBLIC_ODOO_GRAPHQL_URL",

	// API Authentication
	API_KEY: "NEXT_PUBLIC_ODOO_API_KEY",
	API_TOKEN: "NEXT_PUBLIC_ODOO_API_TOKEN",

	// Database Configuration
	DATABASE: "NEXT_PUBLIC_ODOO_DATABASE",
	DB_NAME: "NEXT_PUBLIC_ODOO_DB_NAME",

	// Base URLs
	BASE_URL: "NEXT_PUBLIC_ODOO_URL",
	API_URL: "NEXT_PUBLIC_ODOO_API_URL",
	API_ENDPOINT: "NEXT_PUBLIC_ODOO_API",

	// Admin Credentials
	ADMIN_EMAIL: "NEXT_PUBLIC_ODOO_ADMIN_EMAIL",
	ADMIN_PASSWORD: "NEXT_PUBLIC_ODOO_ADMIN_PASSWORD",

	// Legacy Keys (for backward compatibility)
	LEGACY_URL: "ODOO_API_URL",
	LEGACY_TOKEN: "ODOO_TOKEN",
	LEGACY_DB: "ODOO_DB_NAME",
} as const;

// ============================================================================
// AUTHENTICATION & SECURITY - المصادقة والأمان
// ============================================================================

export const AUTH_KEYS = {
	// JWT & Token Secrets
	JWT_SECRET: "JWT_SECRET",
	TOKEN_SECRET: "TOKEN_SECRET",
	NEXTAUTH_SECRET: "NEXTAUTH_SECRET",

	// NextAuth Configuration
	NEXTAUTH_URL: "NEXTAUTH_URL",

	// Google OAuth
	GOOGLE_CLIENT_ID: "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
	GOOGLE_CLIENT_SECRET: "GOOGLE_CLIENT_SECRET",
} as const;

// ============================================================================
// EMAIL & SMTP - البريد الإلكتروني
// ============================================================================

export const EMAIL_KEYS = {
	// SMTP Configuration
	SMTP_HOST: "SMTP_HOST",
	SMTP_PORT: "SMTP_PORT",
	SMTP_USER: "SMTP_USER",
	SMTP_PASS: "SMTP_PASS",

	// Email Addresses
	FROM_EMAIL: "FROM_EMAIL",
} as const;

// ============================================================================
// ARAMEX SHIPPING - شحن Aramex
// ============================================================================

export const ARAMEX_KEYS = {
	USERNAME: "ARAMEX_USERNAME",
	PASSWORD: "ARAMEX_PASSWORD",
	ACCOUNT_NUMBER: "ARAMEX_ACCOUNT_NUMBER",
	ACCOUNT_PIN: "ARAMEX_ACCOUNT_PIN",
} as const;

// ============================================================================
// PAYMENT PROCESSING - معالجة المدفوعات
// ============================================================================

export const PAYMENT_KEYS = {
	// Stripe Configuration
	STRIPE_PUBLISHABLE_KEY: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
	STRIPE_SECRET_KEY: "STRIPE_SECRET_KEY",
} as const;

// ============================================================================
// CURRENCY & EXCHANGE - العملة والصرف
// ============================================================================

export const CURRENCY_KEYS = {
	// Alpha Vantage API
	ALPHA_VANTAGE_API_KEY: "ALPHA_VANTAGE_API_KEY",
	EXCHANGE_RATE_API_KEY: "NEXT_PUBLIC_EXCHANGE_RATE_API_KEY",
} as const;

// ============================================================================
// REDIS & CACHING - Redis والتخزين المؤقت
// ============================================================================

export const REDIS_KEYS = {
	// Redis Configuration
	REDIS_URL: "REDIS_URL",
	REDIS_HOST: "REDIS_HOST",
	REDIS_PORT: "REDIS_PORT",
	REDIS_PASSWORD: "REDIS_PASSWORD",
	REDIS_DB: "REDIS_DB",

	// Cache Configuration
	CACHE_TTL: "CACHE_TTL",
	CACHE_PREFIX: "CACHE_PREFIX",
} as const;

// ============================================================================
// APPLICATION CONFIGURATION - إعدادات التطبيق
// ============================================================================

export const APP_KEYS = {
	// Application URLs
	APP_URL: "NEXT_PUBLIC_APP_URL",

	// Environment
	NODE_ENV: "NODE_ENV",

	// GraphQL Endpoint
	GRAPHQL_ENDPOINT: "NEXT_PUBLIC_GRAPHQL_ENDPOINT",

	// Default Passwords
	DEFAULT_PASSWORD: "ODOO_DEFAULT_PASSWORD",
	DEFAULT_GROUP_ID: "ODOO_DEFAULT_GROUP_ID",
} as const;

// ============================================================================
// HELPER FUNCTIONS - دوال مساعدة
// ============================================================================

/**
 * Get environment variable value
 * الحصول على قيمة متغير البيئة
 */
export function getEnv(key: string): string | undefined {
	return process.env[key];
}

/**
 * Get required environment variable value
 * الحصول على قيمة متغير البيئة المطلوب
 */
export function getRequiredEnv(key: string): string {
	const value = getEnv(key);
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

/**
 * Get environment variable with fallback
 * الحصول على قيمة متغير البيئة مع قيمة بديلة
 */
export function getEnvWithFallback(key: string, fallback: string): string {
	return getEnv(key) || fallback;
}

// ============================================================================
// ODOO CONFIGURATION HELPERS - مساعدات إعدادات Odoo
// ============================================================================

/**
 * Get Odoo GraphQL URL
 * الحصول على رابط GraphQL لـ Odoo
 */
export function getOdooGraphQLUrl(): string {
	return getEnvWithFallback(
		ODOO_KEYS.GRAPHQL_URL,
		"https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf",
	);
}

/**
 * Get Odoo API Key
 * الحصول على مفتاح API لـ Odoo
 */
export function getOdooApiKey(): string {
	return getEnvWithFallback(
		ODOO_KEYS.API_KEY,
		"d22fb86e790ba068c5b3bcfb801109892f3a0b38",
	);
}

/**
 * Get Odoo Database Name
 * الحصول على اسم قاعدة بيانات Odoo
 */
export function getOdooDatabase(): string {
	return getEnvWithFallback(
		ODOO_KEYS.DATABASE,
		"coffee-selection-staging-20784644",
	);
}

/**
 * Get Odoo Base URL
 * الحصول على الرابط الأساسي لـ Odoo
 */
export function getOdooBaseUrl(): string {
	return getEnvWithFallback(
		ODOO_KEYS.BASE_URL,
		"https://coffee-selection-staging-20784644.dev.odoo.com",
	);
}

// ============================================================================
// REDIS CONFIGURATION HELPERS - مساعدات إعدادات Redis
// ============================================================================

/**
 * Get Redis URL
 * الحصول على رابط Redis
 */
export function getRedisUrl(): string {
	return getEnvWithFallback(REDIS_KEYS.REDIS_URL, "redis://localhost:6379");
}

/**
 * Get Redis Host
 * الحصول على مضيف Redis
 */
export function getRedisHost(): string {
	return getEnvWithFallback(REDIS_KEYS.REDIS_HOST, "localhost");
}

/**
 * Get Redis Port
 * الحصول على منفذ Redis
 */
export function getRedisPort(): number {
	return parseInt(getEnvWithFallback(REDIS_KEYS.REDIS_PORT, "6379"));
}

// ============================================================================
// ARAMEX CONFIGURATION HELPERS - مساعدات إعدادات Aramex
// ============================================================================

/**
 * Get Aramex Username
 * الحصول على اسم المستخدم لـ Aramex
 */
export function getAramexUsername(): string {
	return getEnvWithFallback(
		ARAMEX_KEYS.USERNAME,
		"mohamed@coffeeselection.com",
	);
}

/**
 * Get Aramex Password
 * الحصول على كلمة المرور لـ Aramex
 */
export function getAramexPassword(): string {
	return getEnvWithFallback(ARAMEX_KEYS.PASSWORD, "Montada@1");
}

/**
 * Get Aramex Account Number
 * الحصول على رقم الحساب لـ Aramex
 */
export function getAramexAccountNumber(): string {
	return getEnvWithFallback(ARAMEX_KEYS.ACCOUNT_NUMBER, "71817909");
}

/**
 * Get Aramex Account PIN
 * الحصول على رمز PIN للحساب لـ Aramex
 */
export function getAramexAccountPin(): string {
	return getEnvWithFallback(ARAMEX_KEYS.ACCOUNT_PIN, "508230");
}

// ============================================================================
// PAYMENT CONFIGURATION HELPERS - مساعدات إعدادات الدفع
// ============================================================================

/**
 * Get Stripe Publishable Key
 * الحصول على مفتاح Stripe العام
 */
export function getStripePublishableKey(): string {
	return getEnvWithFallback(
		PAYMENT_KEYS.STRIPE_PUBLISHABLE_KEY,
		"pk_test_51ABC123DEF456GHI789JKL",
	);
}

/**
 * Get Stripe Secret Key
 * الحصول على مفتاح Stripe السري
 */
export function getStripeSecretKey(): string {
	return getEnvWithFallback(
		PAYMENT_KEYS.STRIPE_SECRET_KEY,
		"sk_test_51ABC123DEF456GHI789JKL",
	);
}

// ============================================================================
// CURRENCY CONFIGURATION HELPERS - مساعدات إعدادات العملة
// ============================================================================

/**
 * Get Alpha Vantage API Key
 * الحصول على مفتاح API لـ Alpha Vantage
 */
export function getAlphaVantageApiKey(): string {
	return getRequiredEnv(CURRENCY_KEYS.ALPHA_VANTAGE_API_KEY);
}

/**
 * Get Exchange Rate API Key
 * الحصول على مفتاح API لأسعار الصرف
 */
export function getExchangeRateApiKey(): string {
	return getRequiredEnv(CURRENCY_KEYS.EXCHANGE_RATE_API_KEY);
}

// ============================================================================
// EMAIL CONFIGURATION HELPERS - مساعدات إعدادات البريد الإلكتروني
// ============================================================================

/**
 * Get SMTP Configuration
 * الحصول على إعدادات SMTP
 */
export function getSmtpConfig() {
	return {
		host: getEnvWithFallback(EMAIL_KEYS.SMTP_HOST, "smtp.mailtrap.io"),
		port: parseInt(getEnvWithFallback(EMAIL_KEYS.SMTP_PORT, "2525")),
		user: getEnvWithFallback(EMAIL_KEYS.SMTP_USER, "test_user"),
		pass: getEnvWithFallback(EMAIL_KEYS.SMTP_PASS, "test_pass"),
		from: getEnvWithFallback(
			EMAIL_KEYS.FROM_EMAIL,
			"noreply@coffeeselection.com",
		),
	};
}

// ============================================================================
// AUTHENTICATION CONFIGURATION HELPERS - مساعدات إعدادات المصادقة
// ============================================================================

/**
 * Get JWT Secret
 * الحصول على السر لـ JWT
 */
export function getJwtSecret(): string {
	return getEnvWithFallback(AUTH_KEYS.JWT_SECRET, "test_jwt_secret");
}

/**
 * Get NextAuth Secret
 * الحصول على السر لـ NextAuth
 */
export function getNextAuthSecret(): string {
	return getEnvWithFallback(AUTH_KEYS.NEXTAUTH_SECRET, "test_nextauth_secret");
}

/**
 * Get Google Client ID
 * الحصول على معرف العميل لـ Google
 */
export function getGoogleClientId(): string {
	return getEnvWithFallback(
		AUTH_KEYS.GOOGLE_CLIENT_ID,
		"test_google_client_id",
	);
}

/**
 * Get Google Client Secret
 * الحصول على سر العميل لـ Google
 */
export function getGoogleClientSecret(): string {
	return getEnvWithFallback(
		AUTH_KEYS.GOOGLE_CLIENT_SECRET,
		"test_google_client_secret",
	);
}

// ============================================================================
// APPLICATION CONFIGURATION HELPERS - مساعدات إعدادات التطبيق
// ============================================================================

/**
 * Get Application URL
 * الحصول على رابط التطبيق
 */
export function getAppUrl(): string {
	return getEnvWithFallback(APP_KEYS.APP_URL, "http://localhost:3000");
}

/**
 * Get Node Environment
 * الحصول على بيئة Node
 */
export function getNodeEnv(): string {
	return getEnvWithFallback(APP_KEYS.NODE_ENV, "development");
}

/**
 * Check if in development mode
 * التحقق من وضع التطوير
 */
export function isDevelopment(): boolean {
	return getNodeEnv() === "development";
}

/**
 * Check if in production mode
 * التحقق من وضع الإنتاج
 */
export function isProduction(): boolean {
	return getNodeEnv() === "production";
}

// ============================================================================
// CONFIGURATION OBJECTS - كائنات الإعدادات
// ============================================================================

/**
 * Complete Odoo Configuration
 * إعدادات Odoo الكاملة
 */
export const ODOO_CONFIG = {
	graphqlUrl: getOdooGraphQLUrl(),
	apiKey: getOdooApiKey(),
	database: getOdooDatabase(),
	baseUrl: getOdooBaseUrl(),
	adminEmail: getEnv(ODOO_KEYS.ADMIN_EMAIL) || "mohamed@coffeeselection.com",
	adminPassword: getEnv(ODOO_KEYS.ADMIN_PASSWORD) || "Montada@1",
} as const;

/**
 * Complete Redis Configuration
 * إعدادات Redis الكاملة
 */
export const REDIS_CONFIG = {
	url: getRedisUrl(),
	host: getRedisHost(),
	port: getRedisPort(),
	password: getEnv(REDIS_KEYS.REDIS_PASSWORD),
	db: parseInt(getEnvWithFallback(REDIS_KEYS.REDIS_DB, "0")),
	ttl: parseInt(getEnvWithFallback(REDIS_KEYS.CACHE_TTL, "3600")),
	prefix: getEnvWithFallback(REDIS_KEYS.CACHE_PREFIX, "coffee_selection:"),
} as const;

/**
 * Complete Aramex Configuration
 * إعدادات Aramex الكاملة
 */
export const ARAMEX_CONFIG = {
	username: getAramexUsername() || "test_username",
	password: getAramexPassword() || "test_password",
	accountNumber: getAramexAccountNumber() || "test_account",
	accountPin: getAramexAccountPin() || "test_pin",
	trackingUrl: "https://www.aramex.com/track/results?ShipmentNumber=",
} as const;

/**
 * Complete Payment Configuration
 * إعدادات الدفع الكاملة
 */
export const PAYMENT_CONFIG = {
	stripe: {
		publishableKey: getStripePublishableKey(),
		secretKey: getStripeSecretKey(),
	},
} as const;

/**
 * Complete Email Configuration
 * إعدادات البريد الإلكتروني الكاملة
 */
export const EMAIL_CONFIG = {
	smtp: getSmtpConfig(),
} as const;

/**
 * Complete Authentication Configuration
 * إعدادات المصادقة الكاملة
 */
export const AUTH_CONFIG = {
	jwtSecret: getJwtSecret(),
	nextAuthSecret: getNextAuthSecret(),
	google: {
		clientId: getGoogleClientId(),
		clientSecret: getGoogleClientSecret(),
	},
} as const;

/**
 * Complete Application Configuration
 * إعدادات التطبيق الكاملة
 */
export const APP_CONFIG = {
	url: getAppUrl(),
	environment: getNodeEnv(),
	isDevelopment: isDevelopment(),
	isProduction: isProduction(),
} as const;

// ============================================================================
// EXPORTS - التصدير
// ============================================================================

export default {
	ODOO_CONFIG,
	REDIS_CONFIG,
	ARAMEX_CONFIG,
	PAYMENT_CONFIG,
	EMAIL_CONFIG,
	AUTH_CONFIG,
	APP_CONFIG,
};
