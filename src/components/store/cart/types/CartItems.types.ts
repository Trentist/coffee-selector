/**
 * CartItems Component Types
 * أنواع البيانات لمكون عناصر السلة
 */

export interface CartItemsProps {
	id: string;
	img?: string;
	category?: string;
	title: string;
	slug?: string;
	selectedName?: string;
	size?: string;
	onCLick: () => void;
	price: number;
	quantity: number;
	link?: string;
	category_link?: string;
	onClickRepeat?: () => void;
	onClickFavorite?: () => void;
	onClickFavoriteColor?: string;
	onClickShare?: () => void;
	limited?: string;
}

export interface CartItemState {
	isLoading: boolean;
	isHovered: boolean;
}

export interface CartItemActions {
	onIncrement: (id: string) => void;
	onDecrement: (id: string) => void;
	onRemove: (id: string) => void;
	onFavorite: (id: string) => void;
	onShare: (id: string) => void;
	onRepeat: (id: string) => void;
}