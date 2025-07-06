/**
 * Order GraphQL Mutations
 * طلبات GraphQL للطلبات - جميع الطفرات المتعلقة بالطلبات والكوتيشن
 */

import { gql } from "graphql-request";

// ============================================================================
// QUOTATION MANAGEMENT MUTATIONS
// ============================================================================

export const CREATE_QUOTATION_MUTATION = gql`
	mutation CreateQuotation($input: QuotationInput!) {
		createQuotation(input: $input) {
			quotation {
				id
				name
				partner_id
				date_order
				amount_total
				state
				items {
					id
					product_id
					name
					quantity
					price_unit
					price_subtotal
				}
			}
			success
			message
		}
	}
`;

export const UPDATE_QUOTATION_MUTATION = gql`
	mutation UpdateQuotation($quotationId: Int!, $input: QuotationInput!) {
		updateQuotation(quotationId: $quotationId, input: $input) {
			quotation {
				id
				name
				partner_id
				date_order
				amount_total
				state
				items {
					id
					product_id
					name
					quantity
					price_unit
					price_subtotal
				}
			}
			success
			message
		}
	}
`;

export const SEND_QUOTATION_MUTATION = gql`
	mutation SendQuotation($quotationId: Int!, $email: String, $message: String) {
		sendQuotation(quotationId: $quotationId, email: $email, message: $message) {
			success
			message
		}
	}
`;

export const CONVERT_QUOTATION_TO_ORDER_MUTATION = gql`
	mutation ConvertQuotationToOrder($quotationId: Int!) {
		convertQuotationToOrder(quotationId: $quotationId) {
			order {
				id
				name
				partner_id
				date_order
				amount_total
				state
				quotation_id
			}
			success
			message
		}
	}
`;

export const CANCEL_QUOTATION_MUTATION = gql`
	mutation CancelQuotation($quotationId: Int!, $reason: String) {
		cancelQuotation(quotationId: $quotationId, reason: $reason) {
			success
			message
		}
	}
`;

// ============================================================================
// ORDER MANAGEMENT MUTATIONS
// ============================================================================

export const CREATE_ORDER_MUTATION = gql`
	mutation CreateOrder($input: OrderInput!) {
		createOrder(input: $input) {
			order {
				id
				name
				partner_id
				date_order
				amount_total
				state
				payment_state
				delivery_state
				items {
					id
					product_id
					name
					quantity
					price_unit
					price_subtotal
				}
			}
			success
			message
		}
	}
`;

export const UPDATE_ORDER_MUTATION = gql`
	mutation UpdateOrder($orderId: Int!, $input: OrderInput!) {
		updateOrder(orderId: $orderId, input: $input) {
			order {
				id
				name
				partner_id
				date_order
				amount_total
				state
				payment_state
				delivery_state
				items {
					id
					product_id
					name
					quantity
					price_unit
					price_subtotal
				}
			}
			success
			message
		}
	}
`;

export const CONFIRM_ORDER_MUTATION = gql`
	mutation ConfirmOrder($orderId: Int!) {
		confirmOrder(orderId: $orderId) {
			order {
				id
				name
				state
				confirmation_date
			}
			success
			message
		}
	}
`;

export const CANCEL_ORDER_MUTATION = gql`
	mutation CancelOrder($orderId: Int!, $reason: String) {
		cancelOrder(orderId: $orderId, reason: $reason) {
			success
			message
		}
	}
`;

export const VALIDATE_ORDER_MUTATION = gql`
	mutation ValidateOrder($orderId: Int!) {
		validateOrder(orderId: $orderId) {
			order {
				id
				name
				state
				validation_date
			}
			success
			message
		}
	}
`;

// ============================================================================
// ORDER ITEM MANAGEMENT MUTATIONS
// ============================================================================

export const ADD_ORDER_ITEM_MUTATION = gql`
	mutation AddOrderItem($orderId: Int!, $input: OrderItemInput!) {
		addOrderItem(orderId: $orderId, input: $input) {
			order {
				id
				items {
					id
					product_id
					name
					quantity
					price_unit
					price_subtotal
				}
				amount_total
			}
			success
			message
		}
	}
`;

export const UPDATE_ORDER_ITEM_MUTATION = gql`
	mutation UpdateOrderItem($itemId: Int!, $input: OrderItemInput!) {
		updateOrderItem(itemId: $itemId, input: $input) {
			order {
				id
				items {
					id
					product_id
					name
					quantity
					price_unit
					price_subtotal
				}
				amount_total
			}
			success
			message
		}
	}
`;

export const REMOVE_ORDER_ITEM_MUTATION = gql`
	mutation RemoveOrderItem($itemId: Int!) {
		removeOrderItem(itemId: $itemId) {
			order {
				id
				items {
					id
					product_id
					name
					quantity
					price_unit
					price_subtotal
				}
				amount_total
			}
			success
			message
		}
	}
`;

// ============================================================================
// PAYMENT MANAGEMENT MUTATIONS
// ============================================================================

export const PROCESS_PAYMENT_MUTATION = gql`
	mutation ProcessPayment($orderId: Int!, $input: PaymentInput!) {
		processPayment(orderId: $orderId, input: $input) {
			payment {
				id
				order_id
				amount
				payment_method
				transaction_id
				state
				created_at
			}
			success
			message
		}
	}
`;

export const REFUND_PAYMENT_MUTATION = gql`
	mutation RefundPayment($paymentId: Int!, $amount: Float!, $reason: String) {
		refundPayment(paymentId: $paymentId, amount: $amount, reason: $reason) {
			refund {
				id
				payment_id
				amount
				reason
				state
				created_at
			}
			success
			message
		}
	}
`;

export const SAVE_PAYMENT_METHOD_MUTATION = gql`
	mutation SavePaymentMethod($input: PaymentMethodInput!) {
		savePaymentMethod(input: $input) {
			paymentMethod {
				id
				name
				type
				last4
				expiry_month
				expiry_year
				is_default
			}
			success
			message
		}
	}
`;

export const DELETE_PAYMENT_METHOD_MUTATION = gql`
	mutation DeletePaymentMethod($paymentMethodId: Int!) {
		deletePaymentMethod(paymentMethodId: $paymentMethodId) {
			success
			message
		}
	}
`;

// ============================================================================
// SHIPPING MANAGEMENT MUTATIONS
// ============================================================================

export const CREATE_SHIPPING_LABEL_MUTATION = gql`
	mutation CreateShippingLabel($orderId: Int!, $input: ShippingInput!) {
		createShippingLabel(orderId: $orderId, input: $input) {
			shipping {
				id
				order_id
				tracking_number
				carrier
				label_url
				state
				created_at
			}
			success
			message
		}
	}
`;

export const UPDATE_SHIPPING_STATUS_MUTATION = gql`
	mutation UpdateShippingStatus($shippingId: Int!, $status: String!) {
		updateShippingStatus(shippingId: $shippingId, status: $status) {
			shipping {
				id
				tracking_number
				status
				updated_at
			}
			success
			message
		}
	}
`;

// ============================================================================
// COUPON MANAGEMENT MUTATIONS
// ============================================================================

export const APPLY_COUPON_MUTATION = gql`
	mutation ApplyCoupon($orderId: Int!, $couponCode: String!) {
		applyCoupon(orderId: $orderId, couponCode: $couponCode) {
			order {
				id
				amount_total
				discount_total
				coupon_applied
			}
			success
			message
		}
	}
`;

export const REMOVE_COUPON_MUTATION = gql`
	mutation RemoveCoupon($orderId: Int!) {
		removeCoupon(orderId: $orderId) {
			order {
				id
				amount_total
				discount_total
				coupon_applied
			}
			success
			message
		}
	}
`;

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface QuotationInput {
	partner_id: number;
	items: QuotationItemInput[];
	notes?: string;
	valid_until?: string;
}

export interface OrderInput {
	partner_id: number;
	items: OrderItemInput[];
	shipping_address: AddressInput;
	billing_address: AddressInput;
	payment_method: string;
	notes?: string;
}

export interface QuotationItemInput {
	product_id: number;
	quantity: number;
	price_unit?: number;
}

export interface OrderItemInput {
	product_id: number;
	quantity: number;
	price_unit?: number;
}

export interface PaymentInput {
	amount: number;
	payment_method: string;
	card_token?: string;
	save_card?: boolean;
}

export interface PaymentMethodInput {
	name: string;
	type: string;
	card_token: string;
	is_default?: boolean;
}

export interface ShippingInput {
	carrier: string;
	service: string;
	weight: number;
	dimensions: {
		length: number;
		width: number;
		height: number;
	};
}

export interface AddressInput {
	name: string;
	street: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	phone: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface Quotation {
	id: number;
	name: string;
	partner_id: number;
	date_order: string;
	amount_total: number;
	state: string;
	items: QuotationItem[];
	notes?: string;
	valid_until?: string;
}

export interface Order {
	id: number;
	name: string;
	partner_id: number;
	date_order: string;
	amount_total: number;
	state: string;
	payment_state: string;
	delivery_state: string;
	items: OrderItem[];
	shipping_address: Address;
	billing_address: Address;
	quotation_id?: number;
	confirmation_date?: string;
	validation_date?: string;
}

export interface QuotationItem {
	id: number;
	product_id: number;
	name: string;
	quantity: number;
	price_unit: number;
	price_subtotal: number;
}

export interface OrderItem {
	id: number;
	product_id: number;
	name: string;
	quantity: number;
	price_unit: number;
	price_subtotal: number;
}

export interface Payment {
	id: number;
	order_id: number;
	amount: number;
	payment_method: string;
	transaction_id?: string;
	state: string;
	created_at: string;
}

export interface Refund {
	id: number;
	payment_id: number;
	amount: number;
	reason?: string;
	state: string;
	created_at: string;
}

export interface PaymentMethod {
	id: number;
	name: string;
	type: string;
	last4?: string;
	expiry_month?: number;
	expiry_year?: number;
	is_default: boolean;
}

export interface Shipping {
	id: number;
	order_id: number;
	tracking_number: string;
	carrier: string;
	label_url?: string;
	state: string;
	status?: string;
	created_at: string;
	updated_at?: string;
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
}

export interface OrderMutationResult {
	success: boolean;
	message?: string;
	error?: string;
	quotation?: Quotation;
	order?: Order;
	payment?: Payment;
	refund?: Refund;
	paymentMethod?: PaymentMethod;
	shipping?: Shipping;
}
