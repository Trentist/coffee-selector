/**
 * SubTotal Component Types
 * أنواع البيانات لمكون المجموع الفرعي
 */

export interface SubTotalProps {
	subTotal: number;
}

export interface SubTotalState {
	isLoading: boolean;
}

export interface SubTotalActions {
	onUpdate: (amount: number) => void;
}
