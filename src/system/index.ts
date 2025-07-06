/**
 * Main Types Export
 * التصدير الرئيسي لجميع الأنواع
 */

// ============================================================================
// ODOO SCHEMA FULL
// ============================================================================

export * from "./odoo-schema-full";

// ============================================================================
// LEGACY TYPES (for backward compatibility)
// ============================================================================

// Re-export commonly used types for easy access
export type {
	Product,
	Order,
	Customer,
	Cart,
	Payment,
	Shipment,
	Coupon,
	AuthUser,
	LoginResponse,
	RegisterResponse,
} from "./odoo-schema-full/types";

// Re-export commonly used mutations
export {
	LOGIN_MUTATION,
	REGISTER_MUTATION,
	ADD_TO_CART_MUTATION,
	CREATE_ORDER_MUTATION,
	GET_PRODUCTS,
	GET_ORDERS,
	GET_CART,
} from "./odoo-schema-full/mutations";

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Type guard utilities
 * أدوات التحقق من الأنواع
 */

export const isProduct = (obj: any): obj is Product => {
	return obj && typeof obj.id === "number" && typeof obj.name === "string";
};

export const isOrder = (obj: any): obj is Order => {
	return obj && typeof obj.id === "number" && typeof obj.name === "string";
};

export const isCustomer = (obj: any): obj is Customer => {
	return obj && typeof obj.id === "number" && typeof obj.name === "string";
};

export const isCart = (obj: any): obj is Cart => {
	return obj && typeof obj.id === "string" && Array.isArray(obj.items);
};

/**
 * Type transformation utilities
 * أدوات تحويل الأنواع
 */

export const transformProduct = (data: any): Product => {
	return {
		id: data.id,
		name: data.name,
		sku: data.sku,
		url_key: data.url_key,
		price: data.price,
		image: data.image,
		description: data.description,
		short_description: data.short_description,
		categories: data.categories || [],
		stock_status: data.stock_status,
		is_in_stock: data.is_in_stock,
		created_at: data.created_at,
		updated_at: data.updated_at,
	};
};

export const transformOrder = (data: any): Order => {
	return {
		id: data.id,
		name: data.name,
		partner_id: data.partner_id,
		date_order: data.date_order,
		amount_total: data.amount_total,
		state: data.state,
		payment_state: data.payment_state,
		delivery_state: data.delivery_state,
		items: data.items || [],
		shipping_address: data.shipping_address,
		billing_address: data.billing_address,
		created_at: data.created_at,
		updated_at: data.updated_at,
	};
};

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response types
 * أنواع الاستجابة القياسية للـ API
 */

export interface ApiSuccessResponse<T> {
	success: true;
	data: T;
	message?: string;
	pagination?: {
		current_page: number;
		page_size: number;
		total_pages: number;
		total_count: number;
	};
}

export interface ApiErrorResponse {
	success: false;
	error: string;
	message?: string;
	code?: string;
	details?: any;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// COMMON UTILITY TYPES
// ============================================================================

/**
 * Common utility types used across the application
 * أنواع الأدوات المشتركة المستخدمة في التطبيق
 */

export type LoadingState = "idle" | "loading" | "success" | "error";

export type SortDirection = "ASC" | "DESC";

export type FilterOperator =
	| "eq"
	| "ne"
	| "gt"
	| "gte"
	| "lt"
	| "lte"
	| "in"
	| "nin"
	| "like"
	| "ilike";

export interface PaginationParams {
	page?: number;
	pageSize?: number;
	sortBy?: string;
	sortDirection?: SortDirection;
}

export interface FilterParams {
	[key: string]: {
		operator: FilterOperator;
		value: any;
	};
}

export interface SearchParams {
	query: string;
	filters?: FilterParams;
	pagination?: PaginationParams;
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Form-related types
 * أنواع النماذج
 */

export interface FormField {
	name: string;
	label: string;
	type:
		| "text"
		| "email"
		| "password"
		| "number"
		| "select"
		| "textarea"
		| "checkbox"
		| "radio";
	required?: boolean;
	placeholder?: string;
	options?: { value: string; label: string }[];
	validation?: {
		min?: number;
		max?: number;
		pattern?: string;
		message?: string;
	};
}

export interface FormData {
	[key: string]: any;
}

export interface FormErrors {
	[key: string]: string;
}

export interface FormState {
	data: FormData;
	errors: FormErrors;
	isSubmitting: boolean;
	isValid: boolean;
	isDirty: boolean;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Event-related types
 * أنواع الأحداث
 */

export interface BaseEvent {
	id: string;
	type: string;
	timestamp: string;
	source: string;
}

export interface UserEvent extends BaseEvent {
	type: "login" | "logout" | "register" | "profile_update";
	userId: number;
	metadata?: any;
}

export interface ProductEvent extends BaseEvent {
	type: "view" | "add_to_cart" | "remove_from_cart" | "purchase";
	productId: number;
	userId?: number;
	metadata?: any;
}

export interface OrderEvent extends BaseEvent {
	type: "created" | "updated" | "cancelled" | "completed";
	orderId: number;
	userId: number;
	metadata?: any;
}

export type AppEvent = UserEvent | ProductEvent | OrderEvent;

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

/**
 * Notification-related types
 * أنواع الإشعارات
 */

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
	dismissible?: boolean;
}

export interface NotificationState {
	notifications: Notification[];
	maxNotifications: number;
}

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Theme-related types
 * أنواع الثيم
 */

export interface ThemeColors {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	surface: string;
	text: {
		primary: string;
		secondary: string;
		disabled: string;
	};
	error: string;
	warning: string;
	success: string;
	info: string;
}

export interface ThemeSpacing {
	xs: string;
	sm: string;
	md: string;
	lg: string;
	xl: string;
	xxl: string;
}

export interface ThemeBreakpoints {
	sm: string;
	md: string;
	lg: string;
	xl: string;
	xxl: string;
}

export interface Theme {
	colors: ThemeColors;
	spacing: ThemeSpacing;
	breakpoints: ThemeBreakpoints;
	borderRadius: string;
	boxShadow: string;
	typography: {
		fontFamily: string;
		fontSize: {
			xs: string;
			sm: string;
			md: string;
			lg: string;
			xl: string;
			xxl: string;
		};
		fontWeight: {
			normal: number;
			medium: number;
			bold: number;
		};
	};
}

// ============================================================================
// LOCALIZATION TYPES
// ============================================================================

/**
 * Localization-related types
 * أنواع الترجمة
 */

export type SupportedLocale = "ar" | "en";

export interface TranslationKey {
	key: string;
	namespace: string;
	defaultValue?: string;
	parameters?: Record<string, any>;
}

export interface TranslationNamespace {
	[key: string]: string | TranslationNamespace;
}

export interface TranslationData {
	[locale: string]: {
		[namespace: string]: TranslationNamespace;
	};
}

export interface LocaleConfig {
	code: SupportedLocale;
	name: string;
	nativeName: string;
	direction: "ltr" | "rtl";
	dateFormat: string;
	timeFormat: string;
	currency: {
		code: string;
		symbol: string;
		position: "before" | "after";
	};
}
