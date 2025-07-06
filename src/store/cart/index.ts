/**
 * Cart Store Index - فهرس متجر العربة
 * Main export file for cart services and operations
 */

// Core services
export { default as CartService } from "./cart.service";
export { CartOperations } from "./operations";

// React hooks
export {
	useCart,
	useCartItem,
	useCartQuotation,
	useCartPersistence,
	useCartAnalytics,
} from "./react-hooks";

// Types
export type {
	CartItem,
	CartState,
	CartOperation,
	CartProductInput,
	CartLineInput,
	CartQuotationData,
	CartStatistics,
	CartValidationResult,
	CartSyncResult,
} from "./types";

// Redux slice
export {
	cartSlice,
	addToCart,
	removeFromCart,
	updateCartItem,
	clearCart,
	setCartLoading,
	setCartError,
	setCartData,
} from "./cartSlice";

// Constants
export const CART_CONSTANTS = {
	MAX_QUANTITY: 100,
	MIN_QUANTITY: 1,
	FREE_SHIPPING_THRESHOLD: 500,
	DEFAULT_SHIPPING_COST: 28.574,
	TAX_RATE: 0.05, // 5% VAT
	CURRENCY: "AED",
	CART_STORAGE_KEY: "cart_backup",
	QUOTATION_VALIDITY_DAYS: 30,
} as const;

// Utilities
export const cartUtils = {
	/**
	 * Format price with currency
	 */
	formatPrice: (price: number, currency: string = "AED"): string => {
		return new Intl.NumberFormat("ar-AE", {
			style: "currency",
			currency: currency,
		}).format(price);
	},

	/**
	 * Calculate total with tax and shipping
	 */
	calculateTotal: (
		subtotal: number,
		tax: number = 0,
		shipping: number = 0,
		discount: number = 0,
	): number => {
		return subtotal + tax + shipping - discount;
	},

	/**
	 * Validate cart item
	 */
	validateCartItem: (item: any): boolean => {
		return (
			item &&
			item.productId &&
			item.name &&
			item.price > 0 &&
			item.quantity > 0 &&
			item.quantity <= CART_CONSTANTS.MAX_QUANTITY
		);
	},

	/**
	 * Generate unique cart item ID
	 */
	generateItemId: (): string => {
		return `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	},

	/**
	 * Check if cart is eligible for free shipping
	 */
	isEligibleForFreeShipping: (subtotal: number): boolean => {
		return subtotal >= CART_CONSTANTS.FREE_SHIPPING_THRESHOLD;
	},

	/**
	 * Calculate shipping cost based on subtotal
	 */
	calculateShippingCost: (
		subtotal: number,
		method: string = "standard",
	): number => {
		if (cartUtils.isEligibleForFreeShipping(subtotal)) {
			return 0;
		}

		switch (method.toLowerCase()) {
			case "express":
				return 45.0;
			case "overnight":
				return 75.0;
			default:
				return CART_CONSTANTS.DEFAULT_SHIPPING_COST;
		}
	},

	/**
	 * Calculate tax amount
	 */
	calculateTax: (subtotal: number): number => {
		return subtotal * CART_CONSTANTS.TAX_RATE;
	},

	/**
	 * Format cart summary for display
	 */
	formatCartSummary: (summary: any): string => {
		const { itemCount, total, currency } = summary;
		return `${itemCount} items - ${cartUtils.formatPrice(total, currency)}`;
	},

	/**
	 * Get cart item by product ID
	 */
	findCartItem: (items: any[], productId: string): any => {
		return items.find((item) => item.productId === productId);
	},

	/**
	 * Get cart total quantity
	 */
	getTotalQuantity: (items: any[]): number => {
		return items.reduce((total, item) => total + (item.quantity || 0), 0);
	},

	/**
	 * Get cart subtotal
	 */
	getSubtotal: (items: any[]): number => {
		return items.reduce(
			(total, item) => total + (item.price || 0) * (item.quantity || 0),
			0,
		);
	},

	/**
	 * Check if cart is empty
	 */
	isCartEmpty: (items: any[]): boolean => {
		return !items || items.length === 0;
	},

	/**
	 * Sort cart items by name
	 */
	sortCartItems: (items: any[]): any[] => {
		return [...items].sort((a, b) =>
			(a.name || "").localeCompare(b.name || ""),
		);
	},

	/**
	 * Filter cart items by category
	 */
	filterCartItemsByCategory: (items: any[], category: string): any[] => {
		return items.filter((item) => item.category === category);
	},

	/**
	 * Get unique categories in cart
	 */
	getCartCategories: (items: any[]): string[] => {
		const categories = items.map((item) => item.category).filter(Boolean);
		return [...new Set(categories)];
	},

	/**
	 * Calculate cart weight
	 */
	calculateCartWeight: (items: any[]): number => {
		return items.reduce(
			(total, item) => total + (item.weight || 0) * (item.quantity || 0),
			0,
		);
	},

	/**
	 * Check if cart has heavy items
	 */
	hasHeavyItems: (items: any[], threshold: number = 10): boolean => {
		return cartUtils.calculateCartWeight(items) > threshold;
	},

	/**
	 * Get cart recommendations based on current items
	 */
	getCartRecommendations: (items: any[], allProducts: any[]): any[] => {
		if (cartUtils.isCartEmpty(items)) {
			return allProducts.slice(0, 4); // Return first 4 products if cart is empty
		}

		// Get categories from current cart
		const cartCategories = cartUtils.getCartCategories(items);

		// Find products in same categories
		const recommendations = allProducts.filter(
			(product) =>
				cartCategories.includes(product.category) &&
				!cartUtils.findCartItem(items, product.id),
		);

		return recommendations.slice(0, 4);
	},

	/**
	 * Validate customer data
	 */
	validateCustomerData: (
		customer: any,
	): { isValid: boolean; errors: string[] } => {
		const errors: string[] = [];

		if (!customer.name || customer.name.trim().length === 0) {
			errors.push("Customer name is required");
		}

		if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
			errors.push("Valid email address is required");
		}

		if (!customer.phone || customer.phone.trim().length === 0) {
			errors.push("Phone number is required");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	},

	/**
	 * Validate shipping address
	 */
	validateShippingAddress: (
		address: any,
	): { isValid: boolean; errors: string[] } => {
		const errors: string[] = [];

		if (!address.name || address.name.trim().length === 0) {
			errors.push("Shipping name is required");
		}

		if (!address.street || address.street.trim().length === 0) {
			errors.push("Street address is required");
		}

		if (!address.city || address.city.trim().length === 0) {
			errors.push("City is required");
		}

		if (!address.country || address.country.trim().length === 0) {
			errors.push("Country is required");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	},
};

// Default export
export default {
	CartService,
	CartOperations,
	useCart,
	useCartItem,
	useCartQuotation,
	useCartPersistence,
	useCartAnalytics,
	CART_CONSTANTS,
	cartUtils,
};
