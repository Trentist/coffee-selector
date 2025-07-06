/**
 * Favorites Module - وحدة المفضلة
 * Complete favorites system with cart integration and social sharing
 */

// Core Services
export { FavoritesService } from "./favorites.service";
export { FavoritesOperations } from "./operations";

// Redux
export { default as favoritesReducer } from "./favoritesSlice";
export * from "./favoritesSlice";

// Types
export * from "./types";

// React Hooks
export * from "./hooks/useFavorites";

// Components
export { FavoritesButton } from "./components/FavoritesButton";
export { FavoritesList } from "./components/FavoritesList";
export { ShareButton } from "./components/ShareButton";

// Default configuration
export const FAVORITES_CONFIG = {
	maxLocalFavorites: 50,
	maxServerFavorites: 200,
	autoSync: true,
	syncInterval: 30000, // 30 seconds
	enableSharing: true,
	enableExport: true,
	enableImport: true,
	socialPlatforms: ["facebook", "twitter", "whatsapp", "telegram", "email"],
	localStorageKey: "coffee_favorites",
	sessionStorageKey: "guest_favorites",
};

// Utility functions
export const createFavoritesService = (apolloClient: any) => {
	return new FavoritesService(apolloClient);
};

export const createFavoritesOperations = (
	favoritesService: FavoritesService,
) => {
	return new FavoritesOperations(favoritesService);
};
