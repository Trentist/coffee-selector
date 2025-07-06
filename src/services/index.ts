/**
 * Services Index
 * ملف التصدير الرئيسي لجميع الخدمات
 */

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================

export * from "./auth/auth.service";
export * from "./auth/session.service";
export * from "./auth/token.service";

// ============================================================================
// PRODUCT SERVICES
// ============================================================================

export * from "./products/product.service";
export * from "./products/category.service";
export * from "./products/inventory.service";
export * from "./products/review.service";

// ============================================================================
// CART SERVICES
// ============================================================================

export * from "./cart/cart.service";
export * from "./cart/wishlist.service";
export * from "./cart/compare.service";

// ============================================================================
// ORDER SERVICES
// ============================================================================

export * from "./orders/order.service";
export * from "./orders/quotation.service";
export * from "./orders/payment.service";
export * from "./orders/shipping.service";

// ============================================================================
// CUSTOMER SERVICES
// ============================================================================

export * from "./customers/customer.service";
export * from "./customers/address.service";
export * from "./customers/preferences.service";

// ============================================================================
// SHIPPING SERVICES
// ============================================================================

export * from "./shipping/aramex.service";
export * from "./shipping/shipping.service";
export * from "./shipping/tracking.service";

// ============================================================================
// PAYMENT SERVICES
// ============================================================================

export * from "./payments/payment.service";
export * from "./payments/gateway.service";
export * from "./payments/refund.service";

// ============================================================================
// UTILITY SERVICES
// ============================================================================

export * from "./utils/cache.service";
export * from "./utils/notification.service";
export * from "./utils/analytics.service";
export * from "./utils/validation.service";

// ============================================================================
// SERVICE FACTORY
// ============================================================================

/**
 * Service Factory - Creates and manages service instances
 * مصنع الخدمات - إنشاء وإدارة مثيلات الخدمات
 */

import { AuthService } from "./auth/auth.service";
import { ProductService } from "./products/product.service";
import { CartService } from "./cart/cart.service";
import { OrderService } from "./orders/order.service";
import { CustomerService } from "./customers/customer.service";
import { ShippingService } from "./shipping/shipping.service";
import { PaymentService } from "./payments/payment.service";
import { CacheService } from "./utils/cache.service";
import { NotificationService } from "./utils/notification.service";
import { AnalyticsService } from "./utils/analytics.service";

export class ServiceFactory {
	private static instance: ServiceFactory;
	private services: Map<string, any> = new Map();

	private constructor() {}

	static getInstance(): ServiceFactory {
		if (!ServiceFactory.instance) {
			ServiceFactory.instance = new ServiceFactory();
		}
		return ServiceFactory.instance;
	}

	/**
	 * Get or create service instance
	 * الحصول على أو إنشاء مثيل الخدمة
	 */
	getService<T>(serviceName: string, serviceClass: new () => T): T {
		if (!this.services.has(serviceName)) {
			this.services.set(serviceName, new serviceClass());
		}
		return this.services.get(serviceName);
	}

	/**
	 * Get Auth Service
	 * الحصول على خدمة المصادقة
	 */
	getAuthService(): AuthService {
		return this.getService("auth", AuthService);
	}

	/**
	 * Get Product Service
	 * الحصول على خدمة المنتجات
	 */
	getProductService(): ProductService {
		return this.getService("product", ProductService);
	}

	/**
	 * Get Cart Service
	 * الحصول على خدمة السلة
	 */
	getCartService(): CartService {
		return this.getService("cart", CartService);
	}

	/**
	 * Get Order Service
	 * الحصول على خدمة الطلبات
	 */
	getOrderService(): OrderService {
		return this.getService("order", OrderService);
	}

	/**
	 * Get Customer Service
	 * الحصول على خدمة العملاء
	 */
	getCustomerService(): CustomerService {
		return this.getService("customer", CustomerService);
	}

	/**
	 * Get Shipping Service
	 * الحصول على خدمة الشحن
	 */
	getShippingService(): ShippingService {
		return this.getService("shipping", ShippingService);
	}

	/**
	 * Get Payment Service
	 * الحصول على خدمة الدفع
	 */
	getPaymentService(): PaymentService {
		return this.getService("payment", PaymentService);
	}

	/**
	 * Get Cache Service
	 * الحصول على خدمة التخزين المؤقت
	 */
	getCacheService(): CacheService {
		return this.getService("cache", CacheService);
	}

	/**
	 * Get Notification Service
	 * الحصول على خدمة الإشعارات
	 */
	getNotificationService(): NotificationService {
		return this.getService("notification", NotificationService);
	}

	/**
	 * Get Analytics Service
	 * الحصول على خدمة التحليلات
	 */
	getAnalyticsService(): AnalyticsService {
		return this.getService("analytics", AnalyticsService);
	}

	/**
	 * Clear all services
	 * مسح جميع الخدمات
	 */
	clearServices(): void {
		this.services.clear();
	}

	/**
	 * Get all active services
	 * الحصول على جميع الخدمات النشطة
	 */
	getActiveServices(): string[] {
		return Array.from(this.services.keys());
	}
}

// ============================================================================
// SERVICE CONFIGURATION
// ============================================================================

/**
 * Service configuration interface
 * واجهة إعدادات الخدمات
 */

export interface ServiceConfig {
	api: {
		baseUrl: string;
		timeout: number;
		retryAttempts: number;
		retryDelay: number;
	};
	cache: {
		enabled: boolean;
		ttl: number;
		maxSize: number;
	};
	notifications: {
		enabled: boolean;
		position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
		duration: number;
		maxNotifications: number;
	};
	analytics: {
		enabled: boolean;
		trackingId?: string;
		debug: boolean;
	};
}

/**
 * Default service configuration
 * إعدادات الخدمات الافتراضية
 */
export const defaultServiceConfig: ServiceConfig = {
	api: {
		baseUrl:
			process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL ||
			"https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf",
		timeout: 30000,
		retryAttempts: 3,
		retryDelay: 1000,
	},
	cache: {
		enabled: true,
		ttl: 300000, // 5 minutes
		maxSize: 100,
	},
	notifications: {
		enabled: true,
		position: "top-right",
		duration: 5000,
		maxNotifications: 5,
	},
	analytics: {
		enabled: process.env.NODE_ENV === "production",
		trackingId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
		debug: process.env.NODE_ENV === "development",
	},
};

// ============================================================================
// SERVICE INITIALIZATION
// ============================================================================

/**
 * Initialize all services
 * تهيئة جميع الخدمات
 */
export const initializeServices = (
	config: ServiceConfig = defaultServiceConfig,
) => {
	const factory = ServiceFactory.getInstance();

	// Initialize services with configuration
	const authService = factory.getAuthService();
	const productService = factory.getProductService();
	const cartService = factory.getCartService();
	const orderService = factory.getOrderService();
	const customerService = factory.getCustomerService();
	const shippingService = factory.getShippingService();
	const paymentService = factory.getPaymentService();
	const cacheService = factory.getCacheService();
	const notificationService = factory.getNotificationService();
	const analyticsService = factory.getAnalyticsService();

	// Configure services
	// Note: Each service should have a configure method
	// authService.configure(config);
	// productService.configure(config);
	// etc.

	console.log("Services initialized successfully");
	return factory;
};

// ============================================================================
// SERVICE EXPORTS
// ============================================================================

// Export service factory instance
export const serviceFactory = ServiceFactory.getInstance();

// Export commonly used services
export const authService = serviceFactory.getAuthService();
export const productService = serviceFactory.getProductService();
export const cartService = serviceFactory.getCartService();
export const orderService = serviceFactory.getOrderService();
export const customerService = serviceFactory.getCustomerService();
export const shippingService = serviceFactory.getShippingService();
export const paymentService = serviceFactory.getPaymentService();
export const cacheService = serviceFactory.getCacheService();
export const notificationService = serviceFactory.getNotificationService();
export const analyticsService = serviceFactory.getAnalyticsService();
