/**
 * Order Tracking Types
 * أنواع متابعة الطلبات
 */

export interface Order {
	id: string;
	name: string;
	state: "draft" | "confirmed" | "sale" | "cancelled";
	dateOrder: string;
	amountTotal: number;
	partner: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
	orderLines: OrderLine[];
	shippingAddress: {
		id: string;
		name: string;
		street: string;
		city: string;
		country: {
			name: string;
		};
	};
	paymentMethod: {
		id: string;
		name: string;
		type: string;
	};
	shippingMethod: {
		id: string;
		name: string;
		price: number;
	};
	trackingNumber: string;
	deliveryDate: string;
	invoiceStatus: string;
	deliveryStatus:
		| "pending"
		| "in_transit"
		| "out_for_delivery"
		| "delivered"
		| "failed";
	trackingSteps: TrackingStep[];
}

export interface OrderLine {
	id: string;
	productName: string;
	quantity: number;
	priceSubtotal: number;
}

export interface TrackingStep {
	id: string;
	status: string;
	title: string;
	description: string;
	date: string | null;
	completed: boolean;
}

export interface OrderFilters {
	state?: string;
	dateFrom?: string;
	dateTo?: string;
	partnerId?: string;
	deliveryStatus?: string;
}

export interface OrdersResult {
	success: boolean;
	orders?: Order[];
	total?: number;
	hasMore?: boolean;
	error?: string;
	message?: string;
}
