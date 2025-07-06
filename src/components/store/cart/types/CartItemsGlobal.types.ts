/**
 * CartItemsGlobal Component Types
 * أنواع البيانات لمكون السلة العامة
 */

export interface CartItemsGlobalProps {
	products: CartProduct[];
}

export interface CartProduct {
	id: string;
	image_profile?: string;
	category?: string;
	title: string;
	text?: string;
	size?: string;
	price: number;
	quantity: number;
	limited?: string;
}

export interface CartItemsGlobalState {
	isLoading: boolean;
}

export interface CartItemsGlobalActions {
	onRemoveItem: (id: string) => void;
	onToggleFavorite: (item: CartProduct) => void;
	onRepeatOrder: (item: CartProduct) => void;
	onShareProduct: (item: CartProduct) => void;
}
