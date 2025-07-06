/**
 * Coffee Selection Central System - النظام المركزي لاختيار القهوة
 * Central configuration and system management for Coffee Selection application
 */

import {
	ODOO_CONFIG,
	REDIS_CONFIG,
	ARAMEX_CONFIG,
	PAYMENT_CONFIG,
	EMAIL_CONFIG,
	AUTH_CONFIG,
	APP_CONFIG,
} from "../constants/environment-keys";

// ============================================================================
// SYSTEM CONFIGURATION - إعدادات النظام
// ============================================================================

export const COFFEE_SELECTION_CONFIG = {
	// Odoo Configuration
	ODOO: {
		BASE_URL: ODOO_CONFIG.graphqlUrl,
		API_KEY: ODOO_CONFIG.apiKey,
		DATABASE: ODOO_CONFIG.database,
		TIMEOUT: 30000,
		RETRY_ATTEMPTS: 3,
	},

	// Redis Configuration for Real-time
	REDIS: {
		URL: REDIS_CONFIG.url,
		PREFIX: REDIS_CONFIG.prefix,
		TTL: {
			CACHE: 300, // 5 minutes
			SESSION: 3600, // 1 hour
			CART: 86400, // 24 hours
		},
	},

	// Aramex Shipping Configuration
	ARAMEX: {
		ENABLED: true,
		USERNAME: ARAMEX_CONFIG.username,
		PASSWORD: ARAMEX_CONFIG.password,
		ACCOUNT_NUMBER: ARAMEX_CONFIG.accountNumber,
		ACCOUNT_PIN: ARAMEX_CONFIG.accountPin,
		TRACKING_URL: ARAMEX_CONFIG.trackingUrl,
		WEBHOOK_URL: "/api/shipping/aramex/webhook",
	},

	// Payment Configuration
	PAYMENT: {
		STRIPE: {
			PUBLISHABLE_KEY: PAYMENT_CONFIG.stripe.publishableKey,
			SECRET_KEY: PAYMENT_CONFIG.stripe.secretKey,
		},
	},

	// Email Configuration
	EMAIL: {
		SMTP: EMAIL_CONFIG.smtp,
	},

	// Authentication Configuration
	AUTH: {
		JWT_SECRET: AUTH_CONFIG.jwtSecret,
		NEXTAUTH_SECRET: AUTH_CONFIG.nextAuthSecret,
		GOOGLE: AUTH_CONFIG.google,
	},

	// Application Configuration
	APP: {
		URL: APP_CONFIG.url,
		ENVIRONMENT: APP_CONFIG.environment,
		IS_DEVELOPMENT: APP_CONFIG.isDevelopment,
		IS_PRODUCTION: APP_CONFIG.isProduction,
	},

	// Real-time Configuration
	REALTIME: {
		ENABLED: true,
		CHANNELS: {
			ORDERS: "orders",
			INVENTORY: "inventory",
			NOTIFICATIONS: "notifications",
			CHAT: "chat",
		},
	},
};

// ============================================================================
// REDIS SYNC CONFIGURATION - إعدادات مزامنة Redis
// ============================================================================

export const REDIS_SYNC_CONFIG = {
	// Sync intervals
	SYNC_INTERVAL: 5000, // 5 seconds
	HEALTH_CHECK_INTERVAL: 30000, // 30 seconds

	// Batch processing
	BATCH_SIZE: 10,
	MAX_RETRIES: 3,

	// Logging
	LOG_RETENTION: 1000,

	// Cache settings
	CACHE_TTL: 3600, // 1 hour
	SESSION_TTL: 86400, // 24 hours

	// Real-time settings
	REALTIME_ENABLED: true,
	REALTIME_CHANNELS: {
		ORDERS: "orders",
		INVENTORY: "inventory",
		NOTIFICATIONS: "notifications",
		CHAT: "chat",
	},
};

// ============================================================================
// APOLLO CLIENT CONFIGURATION - إعدادات Apollo Client
// ============================================================================

export const APOLLO_CONFIG = {
	// HTTP Link
	HTTP_LINK: {
		URI: COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
		CREDENTIALS: "include",
		TIMEOUT: COFFEE_SELECTION_CONFIG.ODOO.TIMEOUT,
	},

	// Auth Link
	AUTH_LINK: {
		TOKEN_KEY: "coffee_selection_token",
		CLIENT_NAME: "CoffeeSelection-Web",
		VERSION: "1.0.0",
	},

	// Error Link
	ERROR_LINK: {
		MAX_RETRIES: 3,
		RETRY_DELAY: 1000,
	},

	// Cache
	CACHE: {
		TYPE_POLICIES: {
			Product: {
				keyFields: ["id"],
			},
			Category: {
				keyFields: ["id"],
			},
			Order: {
				keyFields: ["id"],
			},
		},
	},
};

// ============================================================================
// GRAPHQL CONFIGURATION - إعدادات GraphQL
// ============================================================================

export const GRAPHQL_CONFIG = {
	// Queries
	QUERIES: {
		PRODUCTS: "GetProducts",
		CATEGORIES: "GetCategories",
		ORDERS: "GetOrders",
		CART: "GetCart",
		USER: "GetUser",
	},

	// Mutations
	MUTATIONS: {
		LOGIN: "LoginUser",
		REGISTER: "RegisterUser",
		LOGOUT: "LogoutUser",
		CREATE_ORDER: "CreateOrder",
		UPDATE_ORDER: "UpdateOrder",
		DELETE_ORDER: "DeleteOrder",
	},

	// Subscriptions
	SUBSCRIPTIONS: {
		ORDER_UPDATES: "OrderUpdates",
		INVENTORY_UPDATES: "InventoryUpdates",
		NOTIFICATIONS: "Notifications",
	},
};

// ============================================================================
// CACHE CONFIGURATION - إعدادات التخزين المؤقت
// ============================================================================

export const CACHE_CONFIG = {
	// Product cache
	PRODUCTS: {
		TTL: 300, // 5 minutes
		PREFIX: "products",
		MAX_ITEMS: 1000,
	},

	// Category cache
	CATEGORIES: {
		TTL: 600, // 10 minutes
		PREFIX: "categories",
		MAX_ITEMS: 100,
	},

	// Order cache
	ORDERS: {
		TTL: 60, // 1 minute
		PREFIX: "orders",
		MAX_ITEMS: 100,
	},

	// User cache
	USERS: {
		TTL: 1800, // 30 minutes
		PREFIX: "users",
		MAX_ITEMS: 50,
	},

	// Cart cache
	CART: {
		TTL: 86400, // 24 hours
		PREFIX: "cart",
		MAX_ITEMS: 10,
	},
};

// ============================================================================
// VALIDATION CONFIGURATION - إعدادات التحقق
// ============================================================================

export const VALIDATION_CONFIG = {
	// Product validation
	PRODUCT: {
		REQUIRED_FIELDS: ["id", "name", "price"],
		OPTIONAL_FIELDS: ["description", "image", "categories"],
		PRICE_MIN: 0,
		PRICE_MAX: 10000,
	},

	// Order validation
	ORDER: {
		REQUIRED_FIELDS: ["id", "customer", "items", "total"],
		OPTIONAL_FIELDS: ["shipping_address", "billing_address", "notes"],
		MIN_ITEMS: 1,
		MAX_ITEMS: 50,
	},

	// User validation
	USER: {
		REQUIRED_FIELDS: ["id", "email", "name"],
		OPTIONAL_FIELDS: ["phone", "address", "preferences"],
		EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	},
};

// ============================================================================
// ERROR CONFIGURATION - إعدادات الأخطاء
// ============================================================================

export const ERROR_CONFIG = {
	// Error codes
	CODES: {
		NETWORK_ERROR: "NETWORK_ERROR",
		AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
		AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
		VALIDATION_ERROR: "VALIDATION_ERROR",
		NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
		INTERNAL_ERROR: "INTERNAL_ERROR",
		TIMEOUT_ERROR: "TIMEOUT_ERROR",
	},

	// Error messages
	MESSAGES: {
		NETWORK_ERROR: "Network connection error",
		AUTHENTICATION_ERROR: "Authentication failed",
		AUTHORIZATION_ERROR: "Access denied",
		VALIDATION_ERROR: "Invalid data provided",
		NOT_FOUND_ERROR: "Resource not found",
		INTERNAL_ERROR: "Internal server error",
		TIMEOUT_ERROR: "Request timeout",
	},

	// Retry configuration
	RETRY: {
		MAX_ATTEMPTS: 3,
		BASE_DELAY: 1000,
		MAX_DELAY: 10000,
	},
};

// ============================================================================
// LOGGING CONFIGURATION - إعدادات التسجيل
// ============================================================================

export const LOGGING_CONFIG = {
	// Log levels
	LEVELS: {
		ERROR: "error",
		WARN: "warn",
		INFO: "info",
		DEBUG: "debug",
	},

	// Log categories
	CATEGORIES: {
		APOLLO: "apollo",
		REDIS: "redis",
		SYNC: "sync",
		AUTH: "auth",
		API: "api",
		SYSTEM: "system",
	},

	// Log retention
	RETENTION: {
		ERRORS: 30, // 30 days
		WARNINGS: 7, // 7 days
		INFO: 3, // 3 days
		DEBUG: 1, // 1 day
	},
};

// ============================================================================
// PERFORMANCE CONFIGURATION - إعدادات الأداء
// ============================================================================

export const PERFORMANCE_CONFIG = {
	// Timeouts
	TIMEOUTS: {
		REQUEST: 30000, // 30 seconds
		CONNECTION: 10000, // 10 seconds
		QUERY: 15000, // 15 seconds
		MUTATION: 20000, // 20 seconds
	},

	// Rate limiting
	RATE_LIMITING: {
		REQUESTS_PER_MINUTE: 100,
		BURST_SIZE: 10,
	},

	// Caching
	CACHING: {
		ENABLED: true,
		DEFAULT_TTL: 300, // 5 minutes
		MAX_SIZE: 1000,
	},

	// Compression
	COMPRESSION: {
		ENABLED: true,
		THRESHOLD: 1024, // 1KB
	},
};

// ============================================================================
// SECURITY CONFIGURATION - إعدادات الأمان
// ============================================================================

export const SECURITY_CONFIG = {
	// CORS
	CORS: {
		ENABLED: true,
		ORIGINS: ["http://localhost:3000", "https://coffeeselection.com"],
		METHODS: ["GET", "POST", "PUT", "DELETE"],
		HEADERS: ["Content-Type", "Authorization"],
	},

	// Rate limiting
	RATE_LIMITING: {
		ENABLED: true,
		WINDOW_MS: 60000, // 1 minute
		MAX_REQUESTS: 100,
	},

	// Input validation
	INPUT_VALIDATION: {
		ENABLED: true,
		STRIP_HTML: true,
		MAX_LENGTH: 1000,
	},

	// Token security
	TOKEN_SECURITY: {
		EXPIRY: 3600, // 1 hour
		REFRESH_EXPIRY: 604800, // 7 days
		SECURE_COOKIES: true,
	},
};

// ============================================================================
// DEFAULT EXPORT - التصدير الافتراضي
// ============================================================================

export default COFFEE_SELECTION_CONFIG;
