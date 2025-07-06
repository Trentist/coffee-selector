/**
 * ProductCard Helpers
 * Utility functions for the product card system
 */

import { Product, ProductCardProps } from "../types/ProductCard.types";

/**
 * Format price with currency
 */
export const formatPrice = (
	price: number,
	currency: string = "SAR",
): string => {
	return new Intl.NumberFormat("ar-SA", {
		style: "currency",
		currency: currency,
	}).format(price);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (
	originalPrice: number,
	currentPrice: number,
): number => {
	if (!originalPrice || originalPrice <= currentPrice) return 0;
	return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Get product image with fallback
 */
export const getProductImage = (
	product: Product,
	index: number = 0,
): string => {
	if (product.images && product.images[index]) {
		return product.images[index];
	}
	return product.image || "/images/placeholder-product.jpg";
};

/**
 * Get product status
 */
export const getProductStatus = (product: Product): string => {
	if (!product.isAvailable) return "غير متوفر";
	if (product.stock === 0) return "نفذ المخزون";
	if (product.stock < 5) return "كمية محدودة";
	return "متوفر";
};

/**
 * Get product status color
 */
export const getProductStatusColor = (product: Product): string => {
	if (!product.isAvailable || product.stock === 0) return "red.500";
	if (product.stock < 5) return "orange.500";
	return "green.500";
};

/**
 * Get card size dimensions
 */
export const getCardSize = (size: string = "md") => {
	const sizes = {
		sm: { width: "200px", height: "280px" },
		md: { width: "250px", height: "350px" },
		lg: { width: "300px", height: "420px" },
		xl: { width: "350px", height: "490px" },
	};
	return sizes[size as keyof typeof sizes] || sizes.md;
};

/**
 * Get image size dimensions
 */
export const getImageSize = (size: string = "md") => {
	const sizes = {
		sm: { width: "180px", height: "180px" },
		md: { width: "230px", height: "230px" },
		lg: { width: "280px", height: "280px" },
		xl: { width: "330px", height: "330px" },
	};
	return sizes[size as keyof typeof sizes] || sizes.md;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

/**
 * Generate product slug
 */
export const generateProductSlug = (product: Product): string => {
	return `${product.name.toLowerCase().replace(/\s+/g, "-")}-${product.id}`;
};

/**
 * Check if product is on sale
 */
export const isProductOnSale = (product: Product): boolean => {
	return (
		product.isOnSale ||
		(product.originalPrice && product.originalPrice > product.price)
	);
};

/**
 * Get product rating display
 */
export const getProductRating = (
	rating: number = 0,
): { stars: number; text: string } => {
	const stars = Math.round(rating);
	const text = rating > 0 ? `${rating.toFixed(1)}/5` : "لا توجد تقييمات";
	return { stars, text };
};

/**
 * Validate product data
 */
export const validateProduct = (product: Product): boolean => {
	return !!(
		product.id &&
		product.name &&
		product.price &&
		product.image &&
		product.category
	);
};

/**
 * Get product variants configuration
 */
export const getProductVariants = () => ({
	default: {
		showRating: true,
		showStock: true,
		showDiscount: true,
		showQuickView: true,
		showWishlist: true,
	},
	compact: {
		showRating: false,
		showStock: false,
		showDiscount: true,
		showQuickView: false,
		showWishlist: true,
	},
	detailed: {
		showRating: true,
		showStock: true,
		showDiscount: true,
		showQuickView: true,
		showWishlist: true,
	},
	grid: {
		showRating: true,
		showStock: false,
		showDiscount: true,
		showQuickView: false,
		showWishlist: true,
	},
	list: {
		showRating: true,
		showStock: true,
		showDiscount: true,
		showQuickView: true,
		showWishlist: true,
	},
});
