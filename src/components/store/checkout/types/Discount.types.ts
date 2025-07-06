/**
 * Discount Component Types
 * أنواع البيانات لمكون الخصم
 */

export interface DiscountProps {
	discountAmount: number;
	discountPercentage?: number;
	couponCode?: string;
}

export interface DiscountState {
	isLoading: boolean;
}

export interface DiscountActions {
	onApplyCoupon: (code: string) => void;
	onRemoveCoupon: () => void;
}
