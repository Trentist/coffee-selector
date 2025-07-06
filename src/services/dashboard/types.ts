/**
 * Dashboard Services Types
 * أنواع خدمات لوحة التحكم
 */

// ============================================================================
// USER PROFILE TYPES - أنواع الملف الشخصي
// ============================================================================

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone?: string;
	avatar?: string;
	dateOfBirth?: string;
	gender?: "male" | "female" | "other" | "prefer_not_to_say";
	language: string;
	currency: string;
	timezone: string;
	createdAt: string;
	updatedAt: string;
	lastLoginAt: string;
	isEmailVerified: boolean;
	isPhoneVerified: boolean;
	twoFactorEnabled: boolean;
	status: "active" | "inactive" | "suspended";
}

export interface UpdateProfileInput {
	name?: string;
	phone?: string;
	dateOfBirth?: string;
	gender?: "male" | "female" | "other" | "prefer_not_to_say";
	language?: string;
	currency?: string;
	timezone?: string;
}

// ============================================================================
// ADDRESS TYPES - أنواع العناوين
// ============================================================================

export interface Address {
	id: string;
	name: string;
	street: string;
	street2?: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
	phone: string;
	email?: string;
	type: "shipping" | "billing" | "both";
	isDefault: boolean;
	isShipping: boolean;
	isBilling: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAddressInput {
	name: string;
	street: string;
	street2?: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
	phone: string;
	email?: string;
	type: "shipping" | "billing" | "both";
	isDefault?: boolean;
}

export interface UpdateAddressInput {
	name?: string;
	street?: string;
	street2?: string;
	city?: string;
	state?: string;
	country?: string;
	zipCode?: string;
	phone?: string;
	email?: string;
	type?: "shipping" | "billing" | "both";
	isDefault?: boolean;
}

// ============================================================================
// ORDER TYPES - أنواع الطلبات
// ============================================================================

export interface Order {
	id: string;
	name: string;
	number: string;
	dateOrder: string;
	dateDelivery?: string;
	partner: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
	partnerShipping: {
		id: string;
		name: string;
		street: string;
		city: string;
		country: string;
		phone: string;
	};
	orderLines: OrderLine[];
	amountUntaxed: number;
	amountTax: number;
	amountDelivery: number;
	amountTotal: number;
	currency: {
		id: string;
		name: string;
		symbol: string;
	};
	state: OrderState;
	invoiceStatus: InvoiceStatus;
	deliveryStatus: DeliveryStatus;
	paymentStatus: PaymentStatus;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface OrderLine {
	id: string;
	name: string;
	quantity: number;
	priceUnit: number;
	priceSubtotal: number;
	priceTotal: number;
	product: {
		id: string;
		name: string;
		price: number;
		slug: string;
		image?: string;
	};
}

export type OrderState = "draft" | "sent" | "sale" | "done" | "cancel";
export type InvoiceStatus = "no" | "to_invoice" | "invoiced";
export type DeliveryStatus = "no" | "to_deliver" | "delivered";
export type PaymentStatus = "not_paid" | "paid" | "partial";

export interface OrderFilters {
	state?: OrderState[];
	dateFrom?: string;
	dateTo?: string;
	minAmount?: number;
	maxAmount?: number;
	search?: string;
}

// ============================================================================
// INVOICE TYPES - أنواع الفواتير
// ============================================================================

export interface Invoice {
	id: string;
	name: string;
	number: string;
	dateInvoice: string;
	dateDue: string;
	partner: {
		id: string;
		name: string;
		email: string;
	};
	invoiceLines: InvoiceLine[];
	amountUntaxed: number;
	amountTax: number;
	amountTotal: number;
	currency: {
		id: string;
		name: string;
		symbol: string;
	};
	state: InvoiceState;
	paymentState: PaymentState;
	orderId?: string;
	pdfUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface InvoiceLine {
	id: string;
	name: string;
	quantity: number;
	priceUnit: number;
	priceSubtotal: number;
	priceTotal: number;
	product: {
		id: string;
		name: string;
		slug: string;
	};
}

export type InvoiceState = "draft" | "open" | "paid" | "cancelled";
export type PaymentState =
	| "not_paid"
	| "in_payment"
	| "paid"
	| "partial"
	| "reversed"
	| "invoicing_legacy";

// ============================================================================
// PAYMENT METHOD TYPES - أنواع طرق الدفع
// ============================================================================

export interface PaymentMethod {
	id: string;
	name: string;
	code: string;
	description?: string;
	isActive: boolean;
	isDefault?: boolean;
	icon?: string;
	fees?: number;
	feesType?: "percentage" | "fixed";
	minAmount?: number;
	maxAmount?: number;
	supportedCurrencies: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreatePaymentMethodInput {
	name: string;
	code: string;
	description?: string;
	isDefault?: boolean;
	icon?: string;
	fees?: number;
	feesType?: "percentage" | "fixed";
	minAmount?: number;
	maxAmount?: number;
	supportedCurrencies?: string[];
}

export interface UpdatePaymentMethodInput {
	name?: string;
	description?: string;
	isDefault?: boolean;
	icon?: string;
	fees?: number;
	feesType?: "percentage" | "fixed";
	minAmount?: number;
	maxAmount?: number;
	supportedCurrencies?: string[];
}

// ============================================================================
// WISHLIST TYPES - أنواع المفضلة
// ============================================================================

export interface WishlistItem {
	id: string;
	product: {
		id: string;
		name: string;
		price: number;
		slug: string;
		image?: string;
		description?: string;
		isInStock: boolean;
	};
	addedAt: string;
	notes?: string;
}

export interface AddToWishlistInput {
	productId: string;
	notes?: string;
}

// ============================================================================
// SECURITY TYPES - أنواع الأمان
// ============================================================================

export interface UserSession {
	id: string;
	device: string;
	browser: string;
	ipAddress: string;
	location?: string;
	lastActivity: string;
	isCurrent: boolean;
	createdAt: string;
}

export interface TwoFactorAuth {
	enabled: boolean;
	secret?: string;
	backupCodes?: string[];
	lastUsed?: string;
}

export interface SecuritySettings {
	twoFactorEnabled: boolean;
	sessionTimeout: number;
	loginNotifications: boolean;
	deviceManagement: boolean;
	passwordLastChanged?: string;
	failedLoginAttempts: number;
	accountLocked: boolean;
	lockExpiresAt?: string;
}

// ============================================================================
// NOTIFICATION TYPES - أنواع الإشعارات
// ============================================================================

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	category: "order" | "payment" | "delivery" | "security" | "marketing";
	isRead: boolean;
	data?: Record<string, any>;
	createdAt: string;
}

export interface NotificationPreferences {
	email: {
		orders: boolean;
		payments: boolean;
		deliveries: boolean;
		security: boolean;
		marketing: boolean;
	};
	sms: {
		orders: boolean;
		payments: boolean;
		deliveries: boolean;
		security: boolean;
	};
	push: {
		orders: boolean;
		payments: boolean;
		deliveries: boolean;
		security: boolean;
		marketing: boolean;
	};
	frequency: "immediate" | "daily" | "weekly";
}

// ============================================================================
// DASHBOARD STATS TYPES - أنواع إحصائيات لوحة التحكم
// ============================================================================

export interface DashboardStats {
	totalOrders: number;
	pendingOrders: number;
	completedOrders: number;
	cancelledOrders: number;
	totalSpent: number;
	averageOrderValue: number;
	wishlistItems: number;
	totalInvoices: number;
	paidInvoices: number;
	pendingInvoices: number;
	recentActivity: ActivityItem[];
}

export interface ActivityItem {
	id: string;
	type:
		| "order_created"
		| "order_updated"
		| "payment_received"
		| "delivery_scheduled"
		| "login"
		| "profile_updated";
	title: string;
	description: string;
	data?: Record<string, any>;
	createdAt: string;
}

// ============================================================================
// API RESPONSE TYPES - أنواع استجابات API
// ============================================================================

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	errors?: string[];
	timestamp: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

export interface DashboardServiceConfig {
	baseUrl: string;
	apiKey: string;
	timeout: number;
	retries: number;
}

// ============================================================================
// EXPORT TYPES - أنواع التصدير
// ============================================================================

export interface ExportOptions {
	format: "pdf" | "csv" | "json" | "xml";
	dateFrom?: string;
	dateTo?: string;
	includeDetails?: boolean;
	includeAddresses?: boolean;
	includeOrders?: boolean;
	includeInvoices?: boolean;
	includeWishlist?: boolean;
}

export interface ExportResult {
	id: string;
	status: "pending" | "processing" | "completed" | "failed";
	downloadUrl?: string;
	expiresAt?: string;
	createdAt: string;
	completedAt?: string;
	error?: string;
}
