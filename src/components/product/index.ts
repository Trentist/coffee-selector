/**
 * ProductCard System Exports
 * Central export file for all product card components and utilities
 */

// Main ProductCard component
export { default as ProductCard } from "./ProductCard";

// ProductGrid component
export { default as ProductGrid } from "./ProductGrid";

// Types
export type {
	Product,
	ProductCardProps,
	ProductImageProps,
	ProductPriceProps,
	ProductActionsProps,
	ProductGridProps,
	ProductState,
} from "./types/ProductCard.types";

// Helpers
export {
	formatPrice,
	calculateDiscount,
	getProductImage,
	getProductStatus,
	getProductStatusColor,
	getCardSize,
	getImageSize,
	truncateText,
	isProductOnSale,
	getProductRating,
	validateProduct,
	getProductVariants,
} from "./helpers/ProductCard.helpers";
