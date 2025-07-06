/**
 * Product Slice
 * Redux slice for product management
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../components/product/types/ProductCard.types';

// Async thunks
export const fetchProducts = createAsyncThunk(
	'products/fetchProducts',
	async (params?: { category?: string; limit?: number }) => {
		// TODO: Replace with actual API call
		const response = await fetch('/api/products?' + new URLSearchParams(params));
		return response.json();
	}
);

export const fetchProductById = createAsyncThunk(
	'products/fetchProductById',
	async (id: string) => {
		// TODO: Replace with actual API call
		const response = await fetch(`/api/products/${id}`);
		return response.json();
	}
);

// State interface
interface ProductState {
	products: Product[];
	selectedProduct: Product | null;
	isLoading: boolean;
	error: string | null;
	filters: {
		category: string;
		brand: string;
		priceRange: [number, number];
		sortBy: string;
	};
	pagination: {
		page: number;
		limit: number;
		total: number;
	};
}

// Initial state
const initialState: ProductState = {
	products: [],
	selectedProduct: null,
	isLoading: false,
	error: null,
	filters: {
		category: '',
		brand: '',
		priceRange: [0, 10000],
		sortBy: 'name',
	},
	pagination: {
		page: 1,
		limit: 12,
		total: 0,
	},
};

// Slice
const productSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		// Set selected product
		setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
			state.selectedProduct = action.payload;
		},

		// Update filters
		setCategoryFilter: (state, action: PayloadAction<string>) => {
			state.filters.category = action.payload;
			state.pagination.page = 1; // Reset to first page
		},

		setBrandFilter: (state, action: PayloadAction<string>) => {
			state.filters.brand = action.payload;
			state.pagination.page = 1;
		},

		setPriceRangeFilter: (state, action: PayloadAction<[number, number]>) => {
			state.filters.priceRange = action.payload;
			state.pagination.page = 1;
		},

		setSortBy: (state, action: PayloadAction<string>) => {
			state.filters.sortBy = action.payload;
		},

		// Clear all filters
		clearFilters: (state) => {
			state.filters = {
				category: '',
				brand: '',
				priceRange: [0, 10000],
				sortBy: 'name',
			};
			state.pagination.page = 1;
		},

		// Pagination
		setPage: (state, action: PayloadAction<number>) => {
			state.pagination.page = action.payload;
		},

		setLimit: (state, action: PayloadAction<number>) => {
			state.pagination.limit = action.payload;
			state.pagination.page = 1;
		},

		// Clear error
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch products
			.addCase(fetchProducts.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = action.payload.products || [];
				state.pagination.total = action.payload.total || 0;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'فشل في تحميل المنتجات';
			})

			// Fetch single product
			.addCase(fetchProductById.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchProductById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.selectedProduct = action.payload;
			})
			.addCase(fetchProductById.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'فشل في تحميل المنتج';
			});
	},
});

// Export actions
export const {
	setSelectedProduct,
	setCategoryFilter,
	setBrandFilter,
	setPriceRangeFilter,
	setSortBy,
	clearFilters,
	setPage,
	setLimit,
	clearError,
} = productSlice.actions;

// Export selectors
export const selectProducts = (state: { products: ProductState }) => state.products.products;
export const selectSelectedProduct = (state: { products: ProductState }) => state.products.selectedProduct;
export const selectProductsLoading = (state: { products: ProductState }) => state.products.isLoading;
export const selectProductsError = (state: { products: ProductState }) => state.products.error;
export const selectProductFilters = (state: { products: ProductState }) => state.products.filters;
export const selectProductPagination = (state: { products: ProductState }) => state.products.pagination;

// Export reducer
export default productSlice.reducer;