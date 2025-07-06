/**
 * Total Component Types
 * أنواع البيانات لمكون المجموع الكلي
 */

export interface TotalProps {
	total: number;
	subTotal: number;
	shippingCost: number;
	taxAmount?: number;
	discountAmount?: number;
}

export interface TotalState {
	isLoading: boolean;
}

export interface TotalActions {
	onUpdate: (amount: number) => void;
}
