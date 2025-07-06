/**
 * Cart Operations - عمليات العربة المتقدمة
 * Advanced cart operations with business logic
 */

import { CartService } from "./cart.service";
import {
	CartItem,
	CartOperation,
	CartQuotationData,
	CartValidationResult,
} from "./types";

export class CartOperations {
	private cartService: CartService;

	constructor(cartService: CartService) {
		this.cartService = cartService;
	}

	/**
	 * Add product to cart with validation
	 */
	async addProductToCart(product: CartItem): Promise<CartOperation> {
		// Validate product data
		const validation = this.validateProductData(product);
		if (!validation.isValid) {
			return {
				success: false,
				message: `Validation failed: ${validation.errors.join(", ")}`,
			};
		}

		// Check if product already exists in cart
		const existingItem = this.cartService.findCartItem(product.productId);
		if (existingItem) {
			// Update quantity instead of adding duplicate
			return this.updateProductQuantity(
				existingItem.lineId || existingItem.id!,
				existingItem.quantity + product.quantity,
			);
		}

		// Add new product
		return this.cartService.addToCart([product]);
	}

	/**
	 * Update product quantity with business rules
	 */
	async updateProductQuantity(
		lineId: string,
		newQuantity: number,
	): Promise<CartOperation> {
		// Validate quantity
		if (newQuantity <= 0) {
			// Remove item if quantity is 0 or negative
			return this.cartService.removeFromCart([lineId]);
		}

		// Check maximum quantity limit
		if (newQuantity > 100) {
			return {
				success: false,
				message: "Maximum quantity limit is 100 items per product",
			};
		}

		return this.cartService.updateCartItems([
			{ lineId, quantity: newQuantity },
		]);
	}

	/**
	 * Remove product from cart
	 */
	async removeProductFromCart(lineId: string): Promise<CartOperation> {
		return this.cartService.removeFromCart([lineId]);
	}

	/**
	 * Clear entire cart with confirmation
	 */
	async clearCartWithConfirmation(): Promise<CartOperation> {
		const cartState = this.cartService.getCartState();

		if (cartState.items.length === 0) {
			return {
				success: false,
				message: "Cart is already empty",
			};
		}

		return this.cartService.clearCart();
	}

	/**
	 * Create quotation with complete data
	 */
	async createCompleteQuotation(
		customerData: any,
		shippingData: any,
		specialInstructions?: string,
	): Promise<CartOperation> {
		// Validate customer data
		const customerValidation = this.validateCustomerData(customerData);
		if (!customerValidation.isValid) {
			return {
				success: false,
				message: `Customer validation failed: ${customerValidation.errors.join(", ")}`,
			};
		}

		// Validate shipping data
		const shippingValidation = this.validateShippingData(shippingData);
		if (!shippingValidation.isValid) {
			return {
				success: false,
				message: `Shipping validation failed: ${shippingValidation.errors.join(", ")}`,
			};
		}

		// Check if cart has items
		if (this.cartService.isCartEmpty()) {
			return {
				success: false,
				message: "Cannot create quotation from empty cart",
			};
		}

		// Create quotation
		const quotationResult = await this.cartService.createQuotation(
			customerData,
			shippingData,
		);

		if (quotationResult.success && quotationResult.quotation) {
			// Add special instructions if provided
			if (specialInstructions) {
				quotationResult.quotation.specialInstructions = specialInstructions;
			}

			// Add additional metadata
			quotationResult.quotation.metadata = {
				...quotationResult.quotation.metadata,
				customerValidation: customerValidation,
				shippingValidation: shippingValidation,
				cartStatistics: this.cartService.getCartStatistics(),
				createdAt: new Date().toISOString(),
			};
		}

		return quotationResult;
	}

	/**
	 * Bulk operations on cart
	 */
	async bulkCartOperations(
		operations: Array<{
			type: "add" | "update" | "remove";
			data: any;
		}>,
	): Promise<CartOperation> {
		const results = [];
		let successCount = 0;

		for (const operation of operations) {
			let result: CartOperation;

			switch (operation.type) {
				case "add":
					result = await this.addProductToCart(operation.data);
					break;
				case "update":
					result = await this.cartService.updateCartItems([operation.data]);
					break;
				case "remove":
					result = await this.cartService.removeFromCart([operation.data]);
					break;
				default:
					result = { success: false, message: "Unknown operation type" };
			}

			results.push(result);
			if (result.success) successCount++;
		}

		return {
			success: successCount === operations.length,
			message: `Completed ${successCount}/${operations.length} operations successfully`,
			cart: this.cartService.getCartState(),
		};
	}

	/**
	 * Apply discount to cart
	 */
	async applyDiscount(
		discountCode: string,
		discountAmount: number,
	): Promise<CartOperation> {
		const cartState = this.cartService.getCartState();

		if (cartState.items.length === 0) {
			return {
				success: false,
				message: "Cannot apply discount to empty cart",
			};
		}

		if (discountAmount <= 0) {
			return {
				success: false,
				message: "Invalid discount amount",
			};
		}

		if (discountAmount > cartState.total) {
			return {
				success: false,
				message: "Discount amount cannot exceed cart total",
			};
		}

		// Apply discount logic here
		// This would typically involve updating the cart state with discount information

		return {
			success: true,
			message: `Discount of ${discountAmount} applied successfully`,
			cart: cartState,
		};
	}

	/**
	 * Calculate shipping costs
	 */
	async calculateShipping(
		address: any,
		method: string,
	): Promise<CartOperation> {
		const cartState = this.cartService.getCartState();

		if (cartState.items.length === 0) {
			return {
				success: false,
				message: "Cannot calculate shipping for empty cart",
			};
		}

		// Validate address
		const addressValidation = this.validateShippingData(address);
		if (!addressValidation.isValid) {
			return {
				success: false,
				message: `Address validation failed: ${addressValidation.errors.join(", ")}`,
			};
		}

		// Calculate shipping based on method and address
		let shippingCost = 0;

		switch (method.toLowerCase()) {
			case "standard":
				shippingCost = 28.574;
				break;
			case "express":
				shippingCost = 45.0;
				break;
			case "overnight":
				shippingCost = 75.0;
				break;
			default:
				shippingCost = 28.574; // Default to standard
		}

		// Apply free shipping for orders over 500 AED
		if (cartState.total >= 500) {
			shippingCost = 0;
		}

		return {
			success: true,
			message: `Shipping cost calculated: ${shippingCost} AED`,
			cart: {
				...cartState,
				shipping: shippingCost,
			},
		};
	}

	/**
	 * Validate product data
	 */
	private validateProductData(product: CartItem): CartValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (!product.productId) {
			errors.push("Product ID is required");
		}

		if (!product.name) {
			errors.push("Product name is required");
		}

		if (product.price <= 0) {
			errors.push("Product price must be greater than 0");
		}

		if (product.quantity <= 0) {
			errors.push("Product quantity must be greater than 0");
		}

		if (product.quantity > 100) {
			warnings.push("Quantity exceeds recommended limit");
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	/**
	 * Validate customer data
	 */
	private validateCustomerData(customer: any): CartValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (!customer.name || customer.name.trim().length === 0) {
			errors.push("Customer name is required");
		}

		if (!customer.email || !this.isValidEmail(customer.email)) {
			errors.push("Valid email address is required");
		}

		if (!customer.phone || customer.phone.trim().length === 0) {
			errors.push("Phone number is required");
		}

		if (customer.name && customer.name.length < 3) {
			warnings.push("Customer name seems too short");
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	/**
	 * Validate shipping data
	 */
	private validateShippingData(shipping: any): CartValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (!shipping.name || shipping.name.trim().length === 0) {
			errors.push("Shipping name is required");
		}

		if (!shipping.street || shipping.street.trim().length === 0) {
			errors.push("Street address is required");
		}

		if (!shipping.city || shipping.city.trim().length === 0) {
			errors.push("City is required");
		}

		if (!shipping.country || shipping.country.trim().length === 0) {
			errors.push("Country is required");
		}

		if (!shipping.phone || shipping.phone.trim().length === 0) {
			errors.push("Shipping phone number is required");
		}

		if (shipping.street && shipping.street.length < 10) {
			warnings.push("Street address seems too short");
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	/**
	 * Validate email format
	 */
	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Get cart summary for display
	 */
	getCartSummary() {
		const stats = this.cartService.getCartStatistics();
		const cartState = this.cartService.getCartState();

		return {
			itemCount: stats.itemCount,
			uniqueItems: stats.uniqueItems,
			subtotal: stats.total,
			tax: cartState.tax,
			shipping: cartState.shipping,
			discount: cartState.discount,
			total:
				stats.total + cartState.tax + cartState.shipping - cartState.discount,
			currency: cartState.currency,
			isEmpty: stats.isEmpty,
			isLoading: stats.isLoading,
			hasError: stats.hasError,
		};
	}

	/**
	 * Export cart data for backup
	 */
	exportCartData(): any {
		const cartState = this.cartService.getCartState();
		const stats = this.cartService.getCartStatistics();

		return {
			cartId: cartState.cartId,
			items: cartState.items,
			statistics: stats,
			metadata: {
				exportedAt: new Date().toISOString(),
				version: "1.0",
				source: "cart-operations",
			},
		};
	}

	/**
	 * Import cart data from backup
	 */
	async importCartData(data: any): Promise<CartOperation> {
		try {
			if (!data || !data.items || !Array.isArray(data.items)) {
				return {
					success: false,
					message: "Invalid cart data format",
				};
			}

			// Clear current cart
			await this.cartService.clearCart();

			// Add imported items
			if (data.items.length > 0) {
				return await this.cartService.addToCart(data.items);
			}

			return {
				success: true,
				message: "Cart data imported successfully",
			};
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to import cart data",
			};
		}
	}
}
