/**
 * ProductCard Types
 * Type definitions for the product card system
 */

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	originalPrice?: number;
	currency: string;
	image: string;
	images?: string[];
	category: string;
	brand?: string;
	rating?: number;
	reviewCount?: number;
	stock: number;
	isAvailable: boolean;
	isOnSale?: boolean;
	discountPercentage?: number;
	tags?: string[];
	sku?: string;
	weight?: number;
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
}

export interface ProductCardProps {
	product: Product;
	variant?: "default" | "compact" | "detailed" | "grid" | "list";
	size?: "sm" | "md" | "lg" | "xl";
	showRating?: boolean;
	showStock?: boolean;
	showDiscount?: boolean;
	showQuickView?: boolean;
	showWishlist?: boolean;
	showCompare?: boolean;
	onAddToCart?: (product: Product) => void;
	onQuickView?: (product: Product) => void;
	onWishlistToggle?: (product: Product) => void;
	onCompareToggle?: (product: Product) => void;
	onProductClick?: (product: Product) => void;
	className?: string;
}

export interface ProductImageProps {
	product: Product;
	size?: "sm" | "md" | "lg" | "xl";
	showGallery?: boolean;
	onImageClick?: (image: string) => void;
}

export interface ProductPriceProps {
	product: Product;
	size?: "sm" | "md" | "lg";
	showOriginal?: boolean;
	showCurrency?: boolean;
}

export interface ProductActionsProps {
	product: Product;
	onAddToCart: (product: Product) => void;
	onWishlistToggle?: (product: Product) => void;
	onQuickView?: (product: Product) => void;
	showWishlist?: boolean;
	showQuickView?: boolean;
}

export interface ProductGridProps {
	products: Product[];
	columns?: number;
	gap?: number;
	variant?: "default" | "compact" | "detailed";
	showFilters?: boolean;
	onProductClick?: (product: Product) => void;
	onAddToCart?: (product: Product) => void;
}

export interface ProductState {
	isLoading: boolean;
	error: string | null;
	selectedProduct: Product | null;
	isWishlisted: boolean;
	isInCart: boolean;
	quantity: number;
}
