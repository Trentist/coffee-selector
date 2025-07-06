/**
 * خدمة إدارة المفضلة
 * Favorites Management Service
 */

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface FavoritesState {
  items: FavoriteItem[];
  loading: boolean;
  error: string | null;
}

class FavoritesService {
  private favorites: FavoriteItem[] = [];

  // إضافة عنصر إلى المفضلة
  addToFavorites(item: FavoriteItem): void {
    if (!this.favorites.find(fav => fav.id === item.id)) {
      this.favorites.push(item);
    }
  }

  // إزالة عنصر من المفضلة
  removeFromFavorites(id: string): void {
    this.favorites = this.favorites.filter(fav => fav.id !== id);
  }

  // الحصول على جميع العناصر المفضلة
  getFavorites(): FavoriteItem[] {
    return this.favorites;
  }

  // التحقق من وجود عنصر في المفضلة
  isFavorite(id: string): boolean {
    return this.favorites.some(fav => fav.id === id);
  }

  // مسح جميع المفضلة
  clearFavorites(): void {
    this.favorites = [];
  }
}

export default new FavoritesService();