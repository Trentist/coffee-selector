/**
 * Offers Slice
 * Redux slice for offers management
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Offer } from "../../components/offers/types/EnhancedOffers.types";

// Async thunks
export const fetchOffers = createAsyncThunk(
	"offers/fetchOffers",
	async (params?: { featured?: boolean; limit?: number }) => {
		// TODO: Replace with actual API call
		const response = await fetch("/api/offers?" + new URLSearchParams(params));
		return response.json();
	},
);

export const fetchOfferById = createAsyncThunk(
	"offers/fetchOfferById",
	async (id: string) => {
		// TODO: Replace with actual API call
		const response = await fetch(`/api/offers/${id}`);
		return response.json();
	},
);

// State interface
interface OffersState {
	offers: Offer[];
	featuredOffers: Offer[];
	selectedOffer: Offer | null;
	isLoading: boolean;
	error: string | null;
	filters: {
		categories: string[];
		brands: string[];
		priceRange: [number, number];
		activeOnly: boolean;
	};
}

// Initial state
const initialState: OffersState = {
	offers: [],
	featuredOffers: [],
	selectedOffer: null,
	isLoading: false,
	error: null,
	filters: {
		categories: [],
		brands: [],
		priceRange: [0, 10000],
		activeOnly: true,
	},
};

// Slice
const offersSlice = createSlice({
	name: "offers",
	initialState,
	reducers: {
		// Set selected offer
		setSelectedOffer: (state, action: PayloadAction<Offer | null>) => {
			state.selectedOffer = action.payload;
		},

		// Update filters
		setCategoryFilters: (state, action: PayloadAction<string[]>) => {
			state.filters.categories = action.payload;
		},

		setBrandFilters: (state, action: PayloadAction<string[]>) => {
			state.filters.brands = action.payload;
		},

		setPriceRangeFilter: (state, action: PayloadAction<[number, number]>) => {
			state.filters.priceRange = action.payload;
		},

		setActiveOnlyFilter: (state, action: PayloadAction<boolean>) => {
			state.filters.activeOnly = action.payload;
		},

		// Clear all filters
		clearFilters: (state) => {
			state.filters = {
				categories: [],
				brands: [],
				priceRange: [0, 10000],
				activeOnly: true,
			};
		},

		// Clear error
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch offers
			.addCase(fetchOffers.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchOffers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.offers = action.payload.offers || [];
				state.featuredOffers = action.payload.featured || [];
			})
			.addCase(fetchOffers.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || "فشل في تحميل العروض";
			})

			// Fetch single offer
			.addCase(fetchOfferById.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchOfferById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.selectedOffer = action.payload;
			})
			.addCase(fetchOfferById.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || "فشل في تحميل العرض";
			});
	},
});

// Export actions
export const {
	setSelectedOffer,
	setCategoryFilters,
	setBrandFilters,
	setPriceRangeFilter,
	setActiveOnlyFilter,
	clearFilters,
	clearError,
} = offersSlice.actions;

// Export selectors
export const selectOffers = (state: { offers: OffersState }) =>
	state.offers.offers;
export const selectFeaturedOffers = (state: { offers: OffersState }) =>
	state.offers.featuredOffers;
export const selectSelectedOffer = (state: { offers: OffersState }) =>
	state.offers.selectedOffer;
export const selectOffersLoading = (state: { offers: OffersState }) =>
	state.offers.isLoading;
export const selectOffersError = (state: { offers: OffersState }) =>
	state.offers.error;
export const selectOffersFilters = (state: { offers: OffersState }) =>
	state.offers.filters;

// Export reducer
export default offersSlice.reducer;
