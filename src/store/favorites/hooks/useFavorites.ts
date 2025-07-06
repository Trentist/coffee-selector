/**
 * Favorites React Hooks - React hooks للمفضلة
 */

import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FavoritesService } from "../favorites.service";
import { FavoritesOperations } from "../operations";
import {
	selectFavorites,
	selectFavoritesLoading,
	selectFavoritesError,
	selectFavoritesStats,
	selectIsInFavorites,
} from "../favoritesSlice";
import {
	FavoriteItem,
	FavoriteOperation,
	SocialShareData,
	FavoritesStats,
} from "../types";

/**
 * Main Favorites Hook
 */
export const useFavorites = (favoritesService: FavoritesService) => {
	const dispatch = useDispatch();
	const favorites = useSelector(selectFavorites);
	const loading = useSelector(selectFavoritesLoading);
	const error = useSelector(selectFavoritesError);
	const stats = useSelector(selectFavoritesStats);

	const [operations] = useState(
		() => new FavoritesOperations(favoritesService),
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"name" | "price" | "date" | "category">(
		"date",
	);
	const [filterCategory, setFilterCategory] = useState("");

	// Load favorites on mount
	useEffect(() => {
		const loadFavorites = async () => {
			try {
				await favoritesService.initialize();
				const result = favoritesService.getFavoritesLocal();
				if (result.success && result.favorites) {
					dispatch({ type: "favorites/setItems", payload: result.favorites });
					dispatch({ type: "favorites/updateStats" });
				}
			} catch (error) {
				console.error("Error loading favorites:", error);
			}
		};

		loadFavorites();
	}, [favoritesService, dispatch]);

	// Add to favorites
	const addToFavorites = useCallback(
		async (
			product: FavoriteItem["product"],
			addToCartAfter: boolean = false,
		): Promise<FavoriteOperation> => {
			return await operations.addToFavoritesWithCart(product, addToCartAfter);
		},
		[operations],
	);

	// Remove from favorites
	const removeFromFavorites = useCallback(
		async (productId: string): Promise<FavoriteOperation> => {
			return await operations.removeFromFavorites(productId);
		},
		[operations],
	);

	// Add to cart
	const addToCart = useCallback(
		async (favorite: FavoriteItem): Promise<FavoriteOperation> => {
			return await operations.addFavoriteToCart(favorite);
		},
		[operations],
	);

	// Share product
	const shareProduct = useCallback(
		(favorite: FavoriteItem, platform: string): SocialShareData => {
			return operations.shareProduct(favorite, platform);
		},
		[operations],
	);

	// Generate product card
	const generateProductCard = useCallback(
		(favorite: FavoriteItem): string => {
			return operations.shareProductCard(favorite);
		},
		[operations],
	);

	// Search favorites
	const searchFavorites = useCallback(
		(query: string): FavoriteItem[] => {
			return operations.searchFavorites(query);
		},
		[operations],
	);

	// Filter favorites
	const filterFavorites = useCallback(
		(category: string): FavoriteItem[] => {
			return operations.filterFavoritesByCategory(category);
		},
		[operations],
	);

	// Sort favorites
	const sortFavorites = useCallback(
		(items: FavoriteItem[], sort: typeof sortBy): FavoriteItem[] => {
			return operations.sortFavorites(items, sort);
		},
		[operations],
	);

	// Get filtered and sorted favorites
	const getFilteredFavorites = useCallback((): FavoriteItem[] => {
		let filtered = favorites;

		// Apply search filter
		if (searchQuery) {
			filtered = searchFavorites(searchQuery);
		}

		// Apply category filter
		if (filterCategory) {
			filtered = filterFavorites(filterCategory);
		}

		// Apply sorting
		return sortFavorites(filtered, sortBy);
	}, [
		favorites,
		searchQuery,
		filterCategory,
		sortBy,
		searchFavorites,
		filterFavorites,
		sortFavorites,
	]);

	// Bulk operations
	const bulkAddToCart = useCallback(
		async (selectedFavorites: FavoriteItem[]): Promise<FavoriteOperation> => {
			return await operations.bulkAddToCart(selectedFavorites);
		},
		[operations],
	);

	const bulkRemoveFromFavorites = useCallback(
		async (productIds: string[]): Promise<FavoriteOperation> => {
			return await operations.bulkRemoveFromFavorites(productIds);
		},
		[operations],
	);

	// Export/Import
	const exportFavorites = useCallback((): string => {
		return operations.exportFavorites();
	}, [operations]);

	const importFavorites = useCallback(
		(data: string): FavoriteOperation => {
			return operations.importFavorites(data);
		},
		[operations],
	);

	// Generate report
	const generateReport = useCallback(() => {
		return operations.generateFavoritesReport();
	}, [operations]);

	return {
		// State
		favorites: getFilteredFavorites(),
		allFavorites: favorites,
		loading,
		error,
		stats,
		searchQuery,
		sortBy,
		filterCategory,

		// Actions
		addToFavorites,
		removeFromFavorites,
		addToCart,
		shareProduct,
		generateProductCard,
		bulkAddToCart,
		bulkRemoveFromFavorites,
		exportFavorites,
		importFavorites,
		generateReport,

		// Filters and Search
		setSearchQuery,
		setSortBy,
		setFilterCategory,
		searchFavorites,
		filterFavorites,
		sortFavorites,
		getFilteredFavorites,
	};
};

/**
 * Individual Product Favorites Hook
 */
export const useProductFavorites = (
	favoritesService: FavoritesService,
	productId: string,
) => {
	const dispatch = useDispatch();
	const isInFavorites = useSelector(selectIsInFavorites(productId));
	const [operations] = useState(
		() => new FavoritesOperations(favoritesService),
	);

	const addToFavorites = useCallback(
		async (
			product: FavoriteItem["product"],
			addToCartAfter: boolean = false,
		): Promise<FavoriteOperation> => {
			return await operations.addToFavoritesWithCart(product, addToCartAfter);
		},
		[operations],
	);

	const removeFromFavorites =
		useCallback(async (): Promise<FavoriteOperation> => {
			return await operations.removeFromFavorites(productId);
		}, [operations, productId]);

	const shareProduct = useCallback(
		(favorite: FavoriteItem, platform: string): SocialShareData => {
			return operations.shareProduct(favorite, platform);
		},
		[operations],
	);

	return {
		isInFavorites,
		addToFavorites,
		removeFromFavorites,
		shareProduct,
	};
};

/**
 * Favorites Statistics Hook
 */
export const useFavoritesStats = (favoritesService: FavoritesService) => {
	const stats = useSelector(selectFavoritesStats);
	const [operations] = useState(
		() => new FavoritesOperations(favoritesService),
	);

	const getDetailedStats = useCallback((): FavoritesStats => {
		return operations.getFavoritesStats();
	}, [operations]);

	const generateReport = useCallback(() => {
		return operations.generateFavoritesReport();
	}, [operations]);

	return {
		stats,
		getDetailedStats,
		generateReport,
	};
};

/**
 * Favorites Search Hook
 */
export const useFavoritesSearch = (favoritesService: FavoritesService) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<FavoriteItem[]>([]);
	const [searching, setSearching] = useState(false);
	const [operations] = useState(
		() => new FavoritesOperations(favoritesService),
	);

	const search = useCallback(
		async (query: string) => {
			setSearching(true);
			try {
				const results = operations.searchFavorites(query);
				setSearchResults(results);
			} catch (error) {
				console.error("Search error:", error);
				setSearchResults([]);
			} finally {
				setSearching(false);
			}
		},
		[operations],
	);

	const clearSearch = useCallback(() => {
		setSearchQuery("");
		setSearchResults([]);
	}, []);

	useEffect(() => {
		if (searchQuery) {
			search(searchQuery);
		} else {
			setSearchResults([]);
		}
	}, [searchQuery, search]);

	return {
		searchQuery,
		setSearchQuery,
		searchResults,
		searching,
		search,
		clearSearch,
	};
};

/**
 * Favorites Sharing Hook
 */
export const useFavoritesSharing = (favoritesService: FavoritesService) => {
	const [operations] = useState(
		() => new FavoritesOperations(favoritesService),
	);
	const [sharingHistory, setSharingHistory] = useState<
		Array<{
			productId: string;
			platform: string;
			timestamp: string;
			success: boolean;
		}>
	>([]);

	const shareProduct = useCallback(
		(favorite: FavoriteItem, platform: string): SocialShareData => {
			const result = operations.shareProduct(favorite, platform);

			// Record sharing history
			setSharingHistory((prev) => [
				...prev,
				{
					productId: favorite.productId,
					platform,
					timestamp: new Date().toISOString(),
					success: result.success,
				},
			]);

			return result;
		},
		[operations],
	);

	const shareMultipleProducts = useCallback(
		(favorites: FavoriteItem[], platform: string): SocialShareData[] => {
			return operations.shareMultipleProducts(favorites, platform);
		},
		[operations],
	);

	const generateProductCard = useCallback(
		(favorite: FavoriteItem): string => {
			return operations.shareProductCard(favorite);
		},
		[operations],
	);

	const getSharingStats = useCallback(() => {
		const stats: Record<string, number> = {};
		sharingHistory.forEach((record) => {
			stats[record.platform] = (stats[record.platform] || 0) + 1;
		});
		return stats;
	}, [sharingHistory]);

	return {
		shareProduct,
		shareMultipleProducts,
		generateProductCard,
		sharingHistory,
		getSharingStats,
	};
};
