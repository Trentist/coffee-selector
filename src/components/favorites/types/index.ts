/**
 * أنواع نظام المفضلة
 * Favorites System Types
 */

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  category?: string;
}

export interface FavoritesState {
  items: FavoriteItem[];
  loading: boolean;
  error: string | null;
}

export interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}