/**
 * Cart State Management
 * إدارة حالة السلة
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface CartItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
	image?: string;
	sku?: string;
	weight?: number;
	currency?: string;
}

export interface CartState {
	items: CartItem[];
	total: number;
	itemCount: number;
	isLoading: boolean;
	error: string | null;
}

// Initial state
const initialState: CartState = {
	items: [],
	total: 0,
	itemCount: 0,
	isLoading: false,
	error: null,
};

// Cart slice
const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		// Add item to cart
		addToCart: (state, action: PayloadAction<CartItem>) => {
			const existingItem = state.items.find(
				(item) => item.id === action.payload.id,
			);
			if (existingItem) {
				existingItem.quantity += action.payload.quantity;
			} else {
				state.items.push(action.payload);
			}
			// Update totals
			state.itemCount = state.items.reduce(
				(total, item) => total + item.quantity,
				0,
			);
			state.total = state.items.reduce(
				(total, item) => total + item.price * item.quantity,
				0,
			);
		},

		// Remove item from cart
		removeFromCart: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter((item) => item.id !== action.payload);
			// Update totals
			state.itemCount = state.items.reduce(
				(total, item) => total + item.quantity,
				0,
			);
			state.total = state.items.reduce(
				(total, item) => total + item.price * item.quantity,
				0,
			);
		},

		// Update item quantity
		updateQuantity: (
			state,
			action: PayloadAction<{ id: number; quantity: number }>,
		) => {
			const item = state.items.find((item) => item.id === action.payload.id);
			if (item) {
				if (action.payload.quantity <= 0) {
					state.items = state.items.filter(
						(item) => item.id !== action.payload.id,
					);
				} else {
					item.quantity = action.payload.quantity;
				}
				// Update totals
				state.itemCount = state.items.reduce(
					(total, item) => total + item.quantity,
					0,
				);
				state.total = state.items.reduce(
					(total, item) => total + item.price * item.quantity,
					0,
				);
			}
		},

		// Clear cart
		clearCart: (state) => {
			state.items = [];
			state.total = 0;
			state.itemCount = 0;
		},

		// Set loading state
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},

		// Set error
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},

		// Load cart from storage
		loadCart: (state, action: PayloadAction<CartItem[]>) => {
			state.items = action.payload;
			state.itemCount = state.items.reduce(
				(total, item) => total + item.quantity,
				0,
			);
			state.total = state.items.reduce(
				(total, item) => total + item.price * item.quantity,
				0,
			);
		},
	},
});

// Actions
export const {
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	setLoading,
	setError,
	loadCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: any) => state.cart.items;
export const selectCartTotal = (state: any) => state.cart.total;
export const selectCartItemCount = (state: any) => state.cart.itemCount;
export const selectCartLoading = (state: any) => state.cart.isLoading;
export const selectCartError = (state: any) => state.cart.error;

export default cartSlice.reducer;