/**
 * Favorites Operations - عمليات المفضلة المتكاملة
 * Complete favorites operations with cart integration and social sharing
 */

import { FavoritesService } from './favorites.service';
import { FavoriteItem, FavoriteOperation, SocialShareData, FavoritesStats } from './types';
import { store } from '../index';
// import { addToCart } from '../cart/cartSlice';
import { addItemLocally, removeItemLocally, updateStats } from './favoritesSlice';

/**
 * Favorites Operations Class
 */
export class FavoritesOperations {
  private favoritesService: FavoritesService;

  constructor(favoritesService: FavoritesService) {
    this.favoritesService = favoritesService;
  }

  /**
   * Add product to favorites with cart option
   */
  async addToFavoritesWithCart(
    product: FavoriteItem['product'],
    addToCartAfter: boolean = false
  ): Promise<FavoriteOperation> {
    try {
      if (!product) {
        return { success: false, message: 'بيانات المنتج مطلوبة' };
      }

      // Create favorite item
      const favoriteItem: FavoriteItem = {
        id: `temp_${Date.now()}`,
        productId: product.id,
        addedAt: new Date().toISOString(),
        product: product,
        isLocal: true
      };

      // Add to favorites
      const result = this.favoritesService.addToFavoritesLocal(favoriteItem);

      if (result.success) {
        // Update Redux store immediately
        store.dispatch(addItemLocally(result.favorite!));
        store.dispatch(updateStats());

        // Add to cart if requested
        if (addToCartAfter) {
          await this.addFavoriteToCart(result.favorite!);
        }

        return {
          success: true,
          message: `تم إضافة ${product.name} للمفضلة${addToCartAfter ? ' والعربة' : ''} بنجاح`,
          favorite: result.favorite
        };
      } else {
        return result;
      }
    } catch (error) {
      return {
        success: false,
        message: `خطأ في إضافة المنتج للمفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Remove product from favorites
   */
  async removeFromFavorites(productId: string): Promise<FavoriteOperation> {
    try {
      const result = this.favoritesService.removeFromFavoritesLocal(productId);

      if (result.success) {
        // Update Redux store immediately
        store.dispatch(removeItemLocally(productId));
        store.dispatch(updateStats());
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: `خطأ في حذف المنتج من المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Add favorite product to cart
   */
  async addFavoriteToCart(favorite: FavoriteItem): Promise<FavoriteOperation> {
    try {
      const result = await this.favoritesService.addFavoriteToCart(favorite);

      if (result.success) {
        return {
          success: true,
          message: `تم إضافة ${favorite.product?.name} للعربة بنجاح`
        };
      } else {
        return result;
      }
    } catch (error) {
      return {
        success: false,
        message: `خطأ في إضافة المنتج للعربة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Share product on social media
   */
  shareProduct(favorite: FavoriteItem, platform: string): SocialShareData {
    try {
      const result = this.favoritesService.shareProduct(favorite, platform);

      if (result.success && result.url) {
        // Open share URL
        if (typeof window !== 'undefined') {
          window.open(result.url, '_blank', 'width=600,height=400');
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        platform: platform,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Share product card
   */
  shareProductCard(favorite: FavoriteItem): string {
    try {
      return this.favoritesService.generateProductCard(favorite);
    } catch (error) {
      return `<div class="error">خطأ في إنشاء بطاقة المنتج: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    }
  }

  /**
   * Get favorites statistics
   */
  getFavoritesStats(): FavoritesStats {
    return this.favoritesService.getFavoritesStats();
  }

  /**
   * Export favorites data
   */
  exportFavorites(): string {
    try {
      return this.favoritesService.exportFavorites();
    } catch (error) {
      throw new Error(`خطأ في تصدير المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import favorites data
   */
  importFavorites(data: string): FavoriteOperation {
    try {
      const result = this.favoritesService.importFavorites(data);

      if (result.success) {
        // Reload favorites in Redux store
        const localFavorites = this.favoritesService.getFavoritesLocal();
        store.dispatch({ type: 'favorites/setItems', payload: localFavorites.favorites || [] });
        store.dispatch(updateStats());
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: `خطأ في استيراد المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Bulk operations
   */
  async bulkAddToCart(favorites: FavoriteItem[]): Promise<FavoriteOperation> {
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const favorite of favorites) {
        try {
          const result = await this.addFavoriteToCart(favorite);
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
            errors.push(`${favorite.product?.name}: ${result.message}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`${favorite.product?.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return {
        success: successCount > 0,
        message: `تم إضافة ${successCount} منتج للعربة${errorCount > 0 ? `، فشل ${errorCount} منتج` : ''}`,
        error: errors.length > 0 ? errors.join('; ') : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في العمليات المجمعة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async bulkRemoveFromFavorites(productIds: string[]): Promise<FavoriteOperation> {
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const productId of productIds) {
        try {
          const result = await this.removeFromFavorites(productId);
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
            errors.push(result.message);
          }
        } catch (error) {
          errorCount++;
          errors.push(error instanceof Error ? error.message : 'Unknown error');
        }
      }

      return {
        success: successCount > 0,
        message: `تم حذف ${successCount} منتج من المفضلة${errorCount > 0 ? `، فشل ${errorCount} منتج` : ''}`,
        error: errors.length > 0 ? errors.join('; ') : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في العمليات المجمعة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Share multiple products
   */
  shareMultipleProducts(favorites: FavoriteItem[], platform: string): SocialShareData[] {
    try {
      const results: SocialShareData[] = [];

      for (const favorite of favorites) {
        const result = this.shareProduct(favorite, platform);
        results.push(result);
      }

      return results;
    } catch (error) {
      return [{
        success: false,
        platform: platform,
        error: error instanceof Error ? error.message : 'Unknown error'
      }];
    }
  }

  /**
   * Generate favorites report
   */
  generateFavoritesReport(): {
    stats: FavoritesStats;
    popularProducts: Array<{ name: string; price: number; category: string }>;
    categories: Record<string, number>;
    totalValue: number;
    exportDate: string;
  } {
    try {
      const stats = this.getFavoritesStats();
      const favorites = this.favoritesService.getFavoritesLocal().favorites || [];

      const popularProducts = favorites
        .filter(fav => fav.product)
        .map(fav => ({
          name: fav.product!.name,
          price: fav.product!.price,
          category: fav.product!.categories?.[0]?.name || 'غير محدد'
        }))
        .sort((a, b) => b.price - a.price)
        .slice(0, 10);

      return {
        stats,
        popularProducts,
        categories: stats.categories,
        totalValue: stats.totalValue,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`خطأ في إنشاء تقرير المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search favorites
   */
  searchFavorites(query: string): FavoriteItem[] {
    try {
      const favorites = this.favoritesService.getFavoritesLocal().favorites || [];

      if (!query.trim()) {
        return favorites;
      }

      const searchTerm = query.toLowerCase();

      return favorites.filter(fav =>
        fav.product?.name.toLowerCase().includes(searchTerm) ||
        fav.product?.description?.toLowerCase().includes(searchTerm) ||
        fav.product?.categories?.some(cat => cat.name.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error('Error searching favorites:', error);
      return [];
    }
  }

  /**
   * Filter favorites by category
   */
  filterFavoritesByCategory(categoryName: string): FavoriteItem[] {
    try {
      const favorites = this.favoritesService.getFavoritesLocal().favorites || [];

      if (!categoryName) {
        return favorites;
      }

      return favorites.filter(fav =>
        fav.product?.categories?.some(cat => cat.name === categoryName)
      );
    } catch (error) {
      console.error('Error filtering favorites:', error);
      return [];
    }
  }

  /**
   * Sort favorites
   */
  sortFavorites(favorites: FavoriteItem[], sortBy: 'name' | 'price' | 'date' | 'category'): FavoriteItem[] {
    try {
      const sorted = [...favorites];

      switch (sortBy) {
        case 'name':
          return sorted.sort((a, b) => (a.product?.name || '').localeCompare(b.product?.name || ''));

        case 'price':
          return sorted.sort((a, b) => (b.product?.price || 0) - (a.product?.price || 0));

        case 'date':
          return sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

        case 'category':
          return sorted.sort((a, b) => {
            const catA = a.product?.categories?.[0]?.name || '';
            const catB = b.product?.categories?.[0]?.name || '';
            return catA.localeCompare(catB);
          });

        default:
          return sorted;
      }
    } catch (error) {
      console.error('Error sorting favorites:', error);
      return favorites;
    }
  }
}