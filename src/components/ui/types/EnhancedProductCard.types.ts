// EnhancedProductCard Types

export interface EnhancedProductCardProps {
	product: any;
	viewMode?: "list" | "two" | "four" | "popup";
	onAddToCart?: (product: any) => void;
	onAddToWishlist?: (product: any) => void;
	onQuickView?: (product: any) => void;
	onShare?: (product: any) => void;
}

export interface ProductImageConfig {
	imagePath: string;
	odooUrl: string;
}

export interface ProductCardState {
	isHovered: boolean;
	imageLoaded: boolean;
	isLoading: boolean;
}
