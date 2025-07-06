/**
 * Favorites Redux Slice - شريحة Redux للمفضلة
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FavoritesService } from "./favorites.service";
import {
	FavoriteItem,
	FavoritesState,
	FavoriteOperation,
	FavoritesStats,
} from "./types";

// Async thunks
export const fetchFavorites = createAsyncThunk(
	"favorites/fetchFavorites",
	async (favoritesService: FavoritesService) => {
		const result = await favoritesService.getFavorites();
		return result;
	},
);

export const addToFavorites = createAsyncThunk(
	"favorites/addToFavorites",
	async ({
		favoritesService,
		productId,
	}: {
		favoritesService: FavoritesService;
		productId: string;
	}) => {
		const result = await favoritesService.addToFavorites(productId);
		return result;
	},
);

export const removeFromFavorites = createAsyncThunk(
	"favorites/removeFromFavorites",
	async ({
		favoritesService,
		productId,
	}: {
		favoritesService: FavoritesService;
		productId: string;
	}) => {
		const result = await favoritesService.removeFromFavorites(productId);
		return result;
	},
);

export const migrateGuestFavorites = createAsyncThunk(
	"favorites/migrateGuestFavorites",
	async (favoritesService: FavoritesService) => {
		const result = await favoritesService.migrateGuestFavorites();
		return result;
	},
);

// Local storage operations
export const addToFavoritesLocal = createAsyncThunk(
	"favorites/addToFavoritesLocal",
	async ({
		favoritesService,
		product,
	}: {
		favoritesService: FavoritesService;
		product: FavoriteItem;
	}) => {
		const result = favoritesService.addToFavoritesLocal(product);
		return result;
	},
);

export const removeFromFavoritesLocal = createAsyncThunk(
	"favorites/removeFromFavoritesLocal",
	async ({
		favoritesService,
		productId,
	}: {
		favoritesService: FavoritesService;
		productId: string;
	}) => {
		const result = favoritesService.removeFromFavoritesLocal(productId);
		return result;
	},
);

export const loadLocalFavorites = createAsyncThunk(
	"favorites/loadLocalFavorites",
	async (favoritesService: FavoritesService) => {
		const result = favoritesService.getFavoritesLocal();
		return result;
	},
);

// Initial state
const initialState: FavoritesState = {
	items: [],
	loading: false,
	error: null,
	stats: {
		totalFavorites: 0,
		localFavorites: 0,
		serverFavorites: 0,
		categories: {},
		totalValue: 0,
	},
};

// Favorites slice
const favoritesSlice = createSlice({
	name: "favorites",
	initialState,
	reducers: {
		// Clear favorites
		clearFavorites: (state) => {
			state.items = [];
			state.stats = {
				totalFavorites: 0,
				localFavorites: 0,
				serverFavorites: 0,
				categories: {},
				totalValue: 0,
			};
		},

		// Update stats
		updateStats: (state) => {
			const stats = {
				totalFavorites: state.items.length,
				localFavorites: state.items.filter((item) => item.isLocal).length,
				serverFavorites: state.items.filter((item) => !item.isLocal).length,
				categories: state.items.reduce(
					(acc, item) => {
						if (item.product?.categories) {
							item.product.categories.forEach((cat) => {
								acc[cat.name] = (acc[cat.name] || 0) + 1;
							});
						}
						return acc;
					},
					{} as Record<string, number>,
				),
				totalValue: state.items.reduce(
					(sum, item) => sum + (item.product?.price || 0),
					0,
				),
			};
			state.stats = stats;
		},

		// Set loading state
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		// Set error
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},

		// Add item locally (for immediate UI update)
		addItemLocally: (state, action: PayloadAction<FavoriteItem>) => {
			const exists = state.items.find(
				(item) => item.productId === action.payload.productId,
			);
			if (!exists) {
				state.items.push(action.payload);
			}
		},

		// Remove item locally (for immediate UI update)
		removeItemLocally: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(
				(item) => item.productId !== action.payload,
			);
		},

		// Update item
		updateItem: (
			state,
			action: PayloadAction<{
				productId: string;
				updates: Partial<FavoriteItem>;
			}>,
		) => {
			const index = state.items.findIndex(
				(item) => item.productId === action.payload.productId,
			);
			if (index !== -1) {
				state.items[index] = {
					...state.items[index],
					...action.payload.updates,
				};
			}
		},

		// Set items
		setItems: (state, action: PayloadAction<FavoriteItem[]>) => {
			state.items = action.payload;
		},

		// Merge items (for migration)
		mergeItems: (state, action: PayloadAction<FavoriteItem[]>) => {
			const newItems = action.payload.filter(
				(newItem) =>
					!state.items.find(
						(existingItem) => existingItem.productId === newItem.productId,
					),
			);
			state.items = [...state.items, ...newItems];
		},
	},
	extraReducers: (builder) => {
		// Fetch favorites
		builder
			.addCase(fetchFavorites.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchFavorites.fulfilled,
				(state, action: PayloadAction<FavoriteOperation>) => {
					state.loading = false;
					if (action.payload.success && action.payload.favorites) {
						state.items = action.payload.favorites;
					} else {
						state.error = action.payload.message;
					}
				},
			)
			.addCase(fetchFavorites.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to fetch favorites";
			});

		// Add to favorites
		builder
			.addCase(addToFavorites.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				addToFavorites.fulfilled,
				(state, action: PayloadAction<FavoriteOperation>) => {
					state.loading = false;
					if (action.payload.success && action.payload.favorite) {
						state.items.push(action.payload.favorite);
					} else {
						state.error = action.payload.message;
					}
				},
			)
			.addCase(addToFavorites.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to add to favorites";
			});

		// Remove from favorites
		builder
			.addCase(removeFromFavorites.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				removeFromFavorites.fulfilled,
				(state, action: PayloadAction<FavoriteOperation>) => {
					state.loading = false;
					if (action.payload.success) {
						// Item will be removed by the refetch query
					} else {
						state.error = action.payload.message;
					}
				},
			)
			.addCase(removeFromFavorites.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to remove from favorites";
			});

		// Migrate guest favorites
		builder
			.addCase(migrateGuestFavorites.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				migrateGuestFavorites.fulfilled,
				(state, action: PayloadAction<FavoriteOperation>) => {
					state.loading = false;
					if (action.payload.success) {
						// Local items will be cleared and server items will be fetched
						state.items = state.items.filter((item) => !item.isLocal);
					} else {
						state.error = action.payload.message;
					}
				},
			)
			.addCase(migrateGuestFavorites.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to migrate favorites";
			});

		// Add to favorites local
		builder.addCase(
			addToFavoritesLocal.fulfilled,
			(state, action: PayloadAction<FavoriteOperation>) => {
				if (action.payload.success && action.payload.favorite) {
					state.items.push(action.payload.favorite);
				} else {
					state.error = action.payload.message;
				}
			},
		);

		// Remove from favorites local
		builder.addCase(
			removeFromFavoritesLocal.fulfilled,
			(state, action: PayloadAction<FavoriteOperation>) => {
				if (action.payload.success) {
					// Item will be removed by the local operation
				} else {
					state.error = action.payload.message;
				}
			},
		);

		// Load local favorites
		builder.addCase(
			loadLocalFavorites.fulfilled,
			(state, action: PayloadAction<FavoriteOperation>) => {
				if (action.payload.success && action.payload.favorites) {
					state.items = action.payload.favorites;
				} else {
					state.error = action.payload.message;
				}
			},
		);
	},
});

// Export actions
export const {
	clearFavorites,
	updateStats,
	setLoading,
	setError,
	addItemLocally,
	removeItemLocally,
	updateItem,
	setItems,
	mergeItems,
} = favoritesSlice.actions;

// Export selectors
export const selectFavorites = (state: { favorites: FavoritesState }) =>
	state.favorites.items;
export const selectFavoritesLoading = (state: { favorites: FavoritesState }) =>
	state.favorites.loading;
export const selectFavoritesError = (state: { favorites: FavoritesState }) =>
	state.favorites.error;
export const selectFavoritesStats = (state: { favorites: FavoritesState }) =>
	state.favorites.stats;
export const selectFavoritesCount = (state: { favorites: FavoritesState }) =>
	state.favorites.items.length;
export const selectIsInFavorites =
	(productId: string) => (state: { favorites: FavoritesState }) =>
		state.favorites.items.some((item) => item.productId === productId);

// Export reducer
export default favoritesSlice.reducer;
