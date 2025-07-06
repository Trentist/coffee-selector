/**
 * Order TypeScript Types
 * أنواع TypeScript للطلبات - جميع الأنواع المتعلقة بالطلبات والكوتيشن
 */

import { Money, PageInfo, ApiResponse } from "./product-types";

// ============================================================================
// CORE ORDER TYPES
// ============================================================================

export interface Order {
	id: number;
	name: string;
	partner_id: number;
	date_order: string;
	amount_total: number;
	amount_tax: number;
	amount_untaxed: number;
	state: OrderState;
	payment_state: PaymentState;
	delivery_state: DeliveryState;
	items: OrderItem[];
	shipping_address: Address;
	billing_address: Address;
	payment_method: string;
	shipping_method: string;
	tracking_number?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
	confirmation_date?: string;
	delivery_date?: string;
	quotation_id?: number;
	customer?: Customer;
	payments?: Payment[];
	shipments?: Shipment[];
	applied_coupons?: AppliedCoupon[];
	invoice_ids?: number[];
	refund_ids?: number[];
	tags?: OrderTag[];
	priority?: OrderPriority;
	source?: OrderSource;
	channel?: OrderChannel;
}

export type OrderState =
	| "DRAFT"
	| "SENT"
	| "SALE"
	| "DONE"
	| "CANCELED"
	| "LOCKED"
	| "EXPIRED";

export type PaymentState =
	| "NOT_PAID"
	| "PARTIALLY_PAID"
	| "PAID"
	| "REFUNDED"
	| "PARTIALLY_REFUNDED"
	| "FAILED"
	| "PENDING";

export type DeliveryState =
	| "NOT_DELIVERED"
	| "PARTIALLY_DELIVERED"
	| "DELIVERED"
	| "RETURNED"
	| "PARTIALLY_RETURNED"
	| "IN_TRANSIT"
	| "READY_FOR_PICKUP";

export type OrderPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type OrderSource =
	| "WEBSITE"
	| "PHONE"
	| "EMAIL"
	| "WALK_IN"
	| "API"
	| "MOBILE_APP";

export type OrderChannel =
	| "ONLINE"
	| "OFFLINE"
	| "MARKETPLACE"
	| "WHOLESALE"
	| "RETAIL";

export interface OrderItem {
	id: number;
	product_id: number;
	name: string;
	sku: string;
	quantity: number;
	price_unit: number;
	price_subtotal: number;
	price_tax: number;
	price_total: number;
	discount_amount?: number;
	discount_percentage?: number;
	image?: ProductImage;
	attributes?: ProductAttribute[];
	weight?: number;
	dimensions?: ProductDimensions;
	is_delivered: boolean;
	delivered_quantity?: number;
	return_quantity?: number;
	notes?: string;
}

export interface Address {
	id: number;
	name: string;
	street: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	phone: string;
	email?: string;
	company?: string;
	vat?: string;
	is_default_shipping?: boolean;
	is_default_billing?: boolean;
}

export interface Customer {
	id: number;
	name: string;
	email: string;
	phone: string;
	is_company: boolean;
	vat?: string;
	credit_limit?: number;
	payment_terms?: PaymentTerms;
	tags?: CustomerTag[];
	preferences?: CustomerPreferences;
}

export interface PaymentTerms {
	id: number;
	name: string;
	days: number;
	discount_percentage?: number;
	discount_days?: number;
}

export interface CustomerTag {
	id: number;
	name: string;
	color?: string;
	description?: string;
}

export interface CustomerPreferences {
	language: string;
	currency: string;
	timezone: string;
	newsletter_subscription: boolean;
	marketing_emails: boolean;
	sms_notifications: boolean;
}

// ============================================================================
// QUOTATION TYPES
// ============================================================================

export interface Quotation {
	id: number;
	name: string;
	partner_id: number;
	date_order: string;
	amount_total: number;
	amount_tax: number;
	amount_untaxed: number;
	state: QuotationState;
	items: QuotationItem[];
	notes?: string;
	valid_until?: string;
	created_at: string;
	updated_at: string;
	sent_date?: string;
	customer?: Customer;
	shipping_address?: Address;
	billing_address?: Address;
	terms_conditions?: string;
	delivery_terms?: string;
	payment_terms?: PaymentTerms;
	tags?: QuotationTag[];
}

export type QuotationState =
	| "DRAFT"
	| "SENT"
	| "ACCEPTED"
	| "REJECTED"
	| "EXPIRED"
	| "CANCELED"
	| "CONVERTED";

export interface QuotationItem {
	id: number;
	product_id: number;
	name: string;
	sku: string;
	quantity: number;
	price_unit: number;
	price_subtotal: number;
	price_tax: number;
	price_total: number;
	discount_amount?: number;
	discount_percentage?: number;
	image?: ProductImage;
	attributes?: ProductAttribute[];
	notes?: string;
}

export interface QuotationTag {
	id: number;
	name: string;
	color?: string;
	description?: string;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
	id: number;
	order_id: number;
	amount: number;
	payment_method: string;
	transaction_id?: string;
	state: PaymentState;
	created_at: string;
	processed_at?: string;
	refunded_amount?: number;
	refunds?: Refund[];
	payment_details?: PaymentDetails;
	gateway_response?: GatewayResponse;
}

export interface PaymentDetails {
	card_last4?: string;
	card_brand?: string;
	card_expiry_month?: number;
	card_expiry_year?: number;
	cardholder_name?: string;
	billing_address?: Address;
	currency: string;
	exchange_rate?: number;
	fees?: PaymentFee[];
}

export interface PaymentFee {
	type: string;
	amount: number;
	currency: string;
	description?: string;
}

export interface GatewayResponse {
	success: boolean;
	response_code: string;
	response_message: string;
	transaction_id?: string;
	authorization_code?: string;
	avs_result?: string;
	cvv_result?: string;
	fraud_score?: number;
	risk_level?: RiskLevel;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export interface Refund {
	id: number;
	payment_id: number;
	amount: number;
	reason?: string;
	state: RefundState;
	created_at: string;
	processed_at?: string;
	refund_method: string;
	notes?: string;
}

export type RefundState =
	| "PENDING"
	| "PROCESSING"
	| "COMPLETED"
	| "FAILED"
	| "CANCELED";

export interface PaymentMethod {
	id: string;
	name: string;
	description: string;
	is_available: boolean;
	fees: PaymentMethodFee[];
	supported_currencies: string[];
	processing_time: string;
	requires_authentication: boolean;
	supports_recurring: boolean;
	supports_installments: boolean;
	max_installments?: number;
}

export interface PaymentMethodFee {
	type: string;
	amount: number;
	currency: string;
	percentage?: number;
	minimum_amount?: number;
	maximum_amount?: number;
}

export interface SavedPaymentMethod {
	id: number;
	customer_id: number;
	name: string;
	type: string;
	last4: string;
	expiry_month: number;
	expiry_year: number;
	is_default: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	payment_method_details?: SavedPaymentMethodDetails;
}

export interface SavedPaymentMethodDetails {
	card_brand?: string;
	cardholder_name?: string;
	billing_address?: Address;
	token?: string;
}

// ============================================================================
// SHIPPING TYPES
// ============================================================================

export interface Shipment {
	id: number;
	order_id: number;
	tracking_number: string;
	carrier: string;
	state: ShipmentState;
	created_at: string;
	delivery_date?: string;
	shipping_method: string;
	shipping_address: Address;
	items: ShipmentItem[];
	package_details?: PackageDetails;
	tracking_events?: TrackingEvent[];
	delivery_notes?: string;
}

export type ShipmentState =
	| "PENDING"
	| "PROCESSING"
	| "IN_TRANSIT"
	| "OUT_FOR_DELIVERY"
	| "DELIVERED"
	| "FAILED_DELIVERY"
	| "RETURNED"
	| "LOST"
	| "DAMAGED";

export interface ShipmentItem {
	id: number;
	order_item_id: number;
	product_id: number;
	name: string;
	sku: string;
	quantity: number;
	weight?: number;
	dimensions?: ProductDimensions;
}

export interface PackageDetails {
	weight: number;
	dimensions: ProductDimensions;
	package_count: number;
	package_type: string;
	declared_value?: Money;
	insurance_amount?: Money;
	special_handling?: string[];
}

export interface TrackingEvent {
	id: number;
	date: string;
	status: string;
	location: string;
	description: string;
	event_code?: string;
	latitude?: number;
	longitude?: number;
}

export interface ShippingMethod {
	id: string;
	name: string;
	description: string;
	price: Money;
	estimated_days: number;
	is_available: boolean;
	restrictions: ShippingRestrictions;
	features: ShippingFeature[];
	carrier: ShippingCarrier;
}

export interface ShippingRestrictions {
	max_weight?: number;
	max_dimensions?: ProductDimensions;
	excluded_countries?: string[];
	excluded_products?: number[];
	excluded_categories?: number[];
	minimum_order_amount?: Money;
	maximum_order_amount?: Money;
}

export interface ShippingFeature {
	name: string;
	description: string;
	is_included: boolean;
	additional_cost?: Money;
}

export interface ShippingCarrier {
	id: string;
	name: string;
	code: string;
	website?: string;
	phone?: string;
	email?: string;
	logo?: string;
	tracking_url_template?: string;
	is_active: boolean;
}

export interface ShippingRate {
	method_id: string;
	name: string;
	price: Money;
	estimated_days: number;
	description: string;
	carrier: string;
	service_level: string;
	features: string[];
}

// ============================================================================
// COUPON TYPES
// ============================================================================

export interface Coupon {
	id: number;
	code: string;
	name: string;
	description: string;
	discount_type: DiscountType;
	discount_value: number;
	minimum_amount: number;
	maximum_discount: number;
	usage_limit: number;
	used_count: number;
	valid_from: string;
	valid_until: string;
	applicable_products: number[];
	applicable_categories: number[];
	excluded_products: number[];
	excluded_categories: number[];
	customer_groups: number[];
	is_active: boolean;
	is_first_time_only: boolean;
	is_single_use: boolean;
	created_at: string;
	updated_at: string;
}

export type DiscountType =
	| "PERCENTAGE"
	| "FIXED_AMOUNT"
	| "FREE_SHIPPING"
	| "BUY_X_GET_Y";

export interface AppliedCoupon {
	code: string;
	discount_amount: number;
	discount_type: DiscountType;
	description?: string;
	coupon_id: number;
	validation_message?: string;
}

export interface CouponValidation {
	is_valid: boolean;
	coupon: Coupon;
	discount_amount: number;
	message: string;
	validation_errors: CouponValidationError[];
}

export interface CouponValidationError {
	code: string;
	message: string;
	field?: string;
}

// ============================================================================
// ORDER STATUS TYPES
// ============================================================================

export interface OrderStatus {
	order_id: number;
	state: OrderState;
	payment_state: PaymentState;
	delivery_state: DeliveryState;
	status_history: StatusHistory[];
	next_actions: NextAction[];
	estimated_completion_date?: string;
	risk_assessment?: RiskAssessment;
}

export interface StatusHistory {
	state: string;
	date: string;
	note?: string;
	user: StatusUser;
	system_generated: boolean;
	metadata?: Record<string, any>;
}

export interface StatusUser {
	id: number;
	name: string;
	email?: string;
	role?: string;
	avatar?: string;
}

export interface NextAction {
	action: string;
	label: string;
	description: string;
	is_available: boolean;
	requires_confirmation: boolean;
	confirmation_message?: string;
	estimated_time?: string;
	dependencies?: string[];
}

export interface RiskAssessment {
	risk_level: RiskLevel;
	risk_score: number;
	risk_factors: RiskFactor[];
	recommendations: RiskRecommendation[];
}

export interface RiskFactor {
	factor: string;
	weight: number;
	value: any;
	description: string;
}

export interface RiskRecommendation {
	action: string;
	description: string;
	priority: "LOW" | "MEDIUM" | "HIGH";
	impact: string;
}

// ============================================================================
// ORDER ANALYTICS TYPES
// ============================================================================

export interface OrderAnalytics {
	total_orders: number;
	total_revenue: Money;
	average_order_value: Money;
	conversion_rate: number;
	top_products: TopProduct[];
	order_status_distribution: StatusDistribution[];
	revenue_by_period: RevenuePeriod[];
	customer_segments: CustomerSegment[];
	payment_methods: PaymentMethodAnalytics[];
	shipping_methods: ShippingMethodAnalytics[];
}

export interface TopProduct {
	product_id: number;
	name: string;
	sku: string;
	quantity_sold: number;
	revenue: Money;
	profit_margin: number;
	return_rate: number;
}

export interface StatusDistribution {
	status: string;
	count: number;
	percentage: number;
	revenue: Money;
	average_processing_time: number;
}

export interface RevenuePeriod {
	period: string;
	revenue: Money;
	order_count: number;
	average_order_value: Money;
	growth_percentage: number;
}

export interface CustomerSegment {
	segment: string;
	customer_count: number;
	total_revenue: Money;
	average_order_value: Money;
	repeat_purchase_rate: number;
	lifetime_value: Money;
}

export interface PaymentMethodAnalytics {
	payment_method: string;
	usage_count: number;
	total_amount: Money;
	success_rate: number;
	average_processing_time: number;
	chargeback_rate: number;
}

export interface ShippingMethodAnalytics {
	shipping_method: string;
	usage_count: number;
	total_cost: Money;
	average_delivery_time: number;
	customer_satisfaction: number;
	return_rate: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ProductImage {
	url: string;
	alt: string;
	title?: string;
	width?: number;
	height?: number;
}

export interface ProductAttribute {
	attribute_code: string;
	attribute_value: string;
	attribute_label?: string;
}

export interface ProductDimensions {
	length: number;
	width: number;
	height: number;
	unit: "cm" | "inch";
}

export interface OrderTag {
	id: number;
	name: string;
	color?: string;
	description?: string;
}

export interface OrderApiResponse extends ApiResponse<Order> {}
export interface OrdersApiResponse extends ApiResponse<Order[]> {}
export interface QuotationApiResponse extends ApiResponse<Quotation> {}
export interface QuotationsApiResponse extends ApiResponse<Quotation[]> {}
export interface PaymentApiResponse extends ApiResponse<Payment> {}
export interface ShipmentApiResponse extends ApiResponse<Shipment> {}
export interface OrderStatusApiResponse extends ApiResponse<OrderStatus> {}
export interface OrderAnalyticsApiResponse
	extends ApiResponse<OrderAnalytics> {}
