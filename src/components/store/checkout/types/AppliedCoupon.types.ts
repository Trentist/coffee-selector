/**
 * AppliedCoupon Component Types
 * أنواع البيانات لمكون الكوبون المطبق
 */

export interface AppliedCouponProps {
	couponCode: string;
	discountAmount: number;
	discountPercentage?: number;
	onRemove: () => void;
}

export interface AppliedCouponState {
	isLoading: boolean;
}

export interface AppliedCouponActions {
	onRemoveCoupon: () => void;
}
