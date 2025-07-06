/**
 * Favorites Service - خدمة المفضلة المتكاملة
 * Complete favorites system with cart integration and social sharing
 */

import { ApolloClient, gql } from '@apollo/client';
import { store } from '../index';
import { addToCart } from '../cart/cartSlice';
import { FavoriteItem, FavoritesState, FavoriteOperation, SocialShareData } from './types';

// GraphQL Mutations for Favorites
const FAVORITES_MUTATIONS = {
  ADD_TO_FAVORITES: gql`
    mutation AddToFavorites($productId: ID!) {
      addToFavorites(productId: $productId) {
        success
        message
        favorite {
          id
          productId
          addedAt
        }
      }
    }
  `,

  REMOVE_FROM_FAVORITES: gql`
    mutation RemoveFromFavorites($productId: ID!) {
      removeFromFavorites(productId: $productId) {
        success
        message
      }
    }
  `,

  GET_FAVORITES: gql`
    query GetFavorites {
      favorites {
        id
        productId
        addedAt
        product {
          id
          name
          price
          image
          slug
          description
          categories {
            id
            name
          }
        }
      }
    }
  `,

  MIGRATE_GUEST_FAVORITES: gql`
    mutation MigrateGuestFavorites($favorites: [FavoriteInput!]!) {
      migrateGuestFavorites(favorites: $favorites) {
        success
        message
        migratedCount
      }
    }
  `
};

// Social Media Sharing Templates
const SOCIAL_SHARE_TEMPLATES = {
  facebook: {
    template: 'https://www.facebook.com/sharer/sharer.php?u={url}&quote={title}',
    title: 'شاهد هذا المنتج الرائع: {productName}',
    description: 'اكتشف {productName} بسعر {price} درهم - {description}'
  },
  twitter: {
    template: 'https://twitter.com/intent/tweet?url={url}&text={title}',
    title: 'منتج رائع: {productName} بسعر {price} درهم! {hashtags}',
    hashtags: '#قهوة #منتجات_قهوة #تسوق_إلكتروني'
  },
  whatsapp: {
    template: 'https://wa.me/?text={title}%20{url}',
    title: 'شاهد هذا المنتج: {productName} بسعر {price} درهم'
  },
  telegram: {
    template: 'https://t.me/share/url?url={url}&text={title}',
    title: 'منتج مميز: {productName} - {price} درهم'
  },
  email: {
    template: 'mailto:?subject={subject}&body={body}',
    subject: 'منتج رائع: {productName}',
    body: 'اكتشف هذا المنتج المميز:\n\n{productName}\nالسعر: {price} درهم\nالوصف: {description}\n\nرابط المنتج: {url}'
  }
};

export class FavoritesService {
  private apolloClient: ApolloClient<any>;
  private isInitialized: boolean = false;
  private localStorageKey: string = 'coffee_favorites';
  private sessionStorageKey: string = 'guest_favorites';

  constructor(apolloClient: ApolloClient<any>) {
    this.apolloClient = apolloClient;
  }

  /**
   * Initialize favorites service
   */
  async initialize(): Promise<boolean> {
    try {
      // Test connection
      const testResult = await this.testConnection();
      if (!testResult.success) {
        throw new Error(`Connection test failed: ${testResult.error}`);
      }

      this.isInitialized = true;
      console.log('✅ Favorites service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize favorites service:', error);
      return false;
    }
  }

  /**
   * Test GraphQL connection
   */
  private async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.apolloClient.query({
        query: gql`query TestConnection { __typename }`
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Add product to favorites (User)
   */
  async addToFavorites(productId: string): Promise<FavoriteOperation> {
    if (!this.isInitialized) {
      return { success: false, message: 'Service not initialized' };
    }

    try {
      const result = await this.apolloClient.mutate({
        mutation: FAVORITES_MUTATIONS.ADD_TO_FAVORITES,
        variables: { productId },
        refetchQueries: [{ query: FAVORITES_MUTATIONS.GET_FAVORITES }]
      });

      if (result.data?.addToFavorites?.success) {
        return {
          success: true,
          message: 'تم إضافة المنتج للمفضلة بنجاح',
          favorite: result.data.addToFavorites.favorite
        };
      } else {
        return {
          success: false,
          message: result.data?.addToFavorites?.message || 'فشل في إضافة المنتج للمفضلة'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `خطأ في إضافة المنتج للمفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Add product to favorites (Guest - Local Storage)
   */
  addToFavoritesLocal(product: FavoriteItem): FavoriteOperation {
    try {
      const favorites = this.getLocalFavorites();

      // Check if already exists
      const exists = favorites.find(fav => fav.productId === product.productId);
      if (exists) {
        return { success: false, message: 'المنتج موجود بالفعل في المفضلة' };
      }

      // Add to local storage
      const newFavorite: FavoriteItem = {
        ...product,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
        isLocal: true
      };

      favorites.push(newFavorite);
      this.saveLocalFavorites(favorites);

      return {
        success: true,
        message: 'تم إضافة المنتج للمفضلة المحلية بنجاح',
        favorite: newFavorite
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في إضافة المنتج للمفضلة المحلية: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Remove product from favorites (User)
   */
  async removeFromFavorites(productId: string): Promise<FavoriteOperation> {
    if (!this.isInitialized) {
      return { success: false, message: 'Service not initialized' };
    }

    try {
      const result = await this.apolloClient.mutate({
        mutation: FAVORITES_MUTATIONS.REMOVE_FROM_FAVORITES,
        variables: { productId },
        refetchQueries: [{ query: FAVORITES_MUTATIONS.GET_FAVORITES }]
      });

      if (result.data?.removeFromFavorites?.success) {
        return {
          success: true,
          message: 'تم حذف المنتج من المفضلة بنجاح'
        };
      } else {
        return {
          success: false,
          message: result.data?.removeFromFavorites?.message || 'فشل في حذف المنتج من المفضلة'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `خطأ في حذف المنتج من المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Remove product from favorites (Guest - Local Storage)
   */
  removeFromFavoritesLocal(productId: string): FavoriteOperation {
    try {
      const favorites = this.getLocalFavorites();
      const initialCount = favorites.length;

      const filteredFavorites = favorites.filter(fav => fav.productId !== productId);

      if (filteredFavorites.length === initialCount) {
        return { success: false, message: 'المنتج غير موجود في المفضلة' };
      }

      this.saveLocalFavorites(filteredFavorites);

      return {
        success: true,
        message: 'تم حذف المنتج من المفضلة المحلية بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في حذف المنتج من المفضلة المحلية: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get user favorites from server
   */
  async getFavorites(): Promise<FavoriteOperation> {
    if (!this.isInitialized) {
      return { success: false, message: 'Service not initialized' };
    }

    try {
      const result = await this.apolloClient.query({
        query: FAVORITES_MUTATIONS.GET_FAVORITES,
        fetchPolicy: 'cache-and-network'
      });

      if (result.data?.favorites) {
        const favorites = result.data.favorites.map((fav: any) => ({
          id: fav.id,
          productId: fav.productId,
          addedAt: fav.addedAt,
          product: fav.product,
          isLocal: false
        }));

        return {
          success: true,
          message: `تم جلب ${favorites.length} منتج من المفضلة`,
          favorites: favorites
        };
      } else {
        return {
          success: true,
          message: 'قائمة المفضلة فارغة',
          favorites: []
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `خطأ في جلب المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get guest favorites from local storage
   */
  getFavoritesLocal(): FavoriteOperation {
    try {
      const favorites = this.getLocalFavorites();

      return {
        success: true,
        message: `تم جلب ${favorites.length} منتج من المفضلة المحلية`,
        favorites: favorites
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في جلب المفضلة المحلية: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Migrate guest favorites to user account
   */
  async migrateGuestFavorites(): Promise<FavoriteOperation> {
    if (!this.isInitialized) {
      return { success: false, message: 'Service not initialized' };
    }

    try {
      const localFavorites = this.getLocalFavorites();

      if (localFavorites.length === 0) {
        return { success: true, message: 'لا توجد مفضلة محلية للنقل' };
      }

      const favoritesInput = localFavorites.map(fav => ({
        productId: fav.productId,
        addedAt: fav.addedAt
      }));

      const result = await this.apolloClient.mutate({
        mutation: FAVORITES_MUTATIONS.MIGRATE_GUEST_FAVORITES,
        variables: { favorites: favoritesInput }
      });

      if (result.data?.migrateGuestFavorites?.success) {
        // Clear local favorites after successful migration
        this.clearLocalFavorites();

        return {
          success: true,
          message: `تم نقل ${result.data.migrateGuestFavorites.migratedCount} منتج بنجاح`,
          migratedCount: result.data.migrateGuestFavorites.migratedCount
        };
      } else {
        return {
          success: false,
          message: result.data?.migrateGuestFavorites?.message || 'فشل في نقل المفضلة'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `خطأ في نقل المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Add favorite product to cart
   */
  async addFavoriteToCart(favorite: FavoriteItem): Promise<FavoriteOperation> {
    try {
      if (!favorite.product) {
        return { success: false, message: 'بيانات المنتج غير متوفرة' };
      }

      // Dispatch to Redux store
      store.dispatch(addToCart({
        productId: favorite.product.id,
        name: favorite.product.name,
        price: favorite.product.price,
        quantity: 1,
        image: favorite.product.image,
        slug: favorite.product.slug
      }));

      return {
        success: true,
        message: 'تم إضافة المنتج للعربة بنجاح'
      };
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
      if (!favorite.product) {
        throw new Error('بيانات المنتج غير متوفرة');
      }

      const product = favorite.product;
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://coffee-selection.com';
      const productUrl = `${baseUrl}/product/${product.slug}`;

      const template = SOCIAL_SHARE_TEMPLATES[platform as keyof typeof SOCIAL_SHARE_TEMPLATES];
      if (!template) {
        throw new Error(`منصة غير مدعومة: ${platform}`);
      }

      // Replace placeholders
      const title = template.title
        .replace('{productName}', product.name)
        .replace('{price}', product.price.toString())
        .replace('{description}', product.description || '')
        .replace('{hashtags}', template.hashtags || '');

      const url = template.template
        .replace('{url}', encodeURIComponent(productUrl))
        .replace('{title}', encodeURIComponent(title))
        .replace('{subject}', encodeURIComponent(title))
        .replace('{body}', encodeURIComponent(
          template.body
            .replace('{productName}', product.name)
            .replace('{price}', product.price.toString())
            .replace('{description}', product.description || '')
            .replace('{url}', productUrl)
        ));

      return {
        success: true,
        platform: platform,
        url: url,
        title: title,
        productUrl: productUrl
      };
    } catch (error) {
      return {
        success: false,
        platform: platform,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate product card for sharing
   */
  generateProductCard(favorite: FavoriteItem): string {
    try {
      if (!favorite.product) {
        throw new Error('بيانات المنتج غير متوفرة');
      }

      const product = favorite.product;
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://coffee-selection.com';

      return `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="price">${product.price} درهم</p>
          <p class="description">${product.description || ''}</p>
          <a href="${baseUrl}/product/${product.slug}" class="view-product">
            عرض المنتج
          </a>
        </div>
      `;
    } catch (error) {
      return `<div class="error">خطأ في إنشاء بطاقة المنتج: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    }
  }

  /**
   * Get local favorites from storage
   */
  private getLocalFavorites(): FavoriteItem[] {
    try {
      if (typeof window === 'undefined') return [];

      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local favorites:', error);
      return [];
    }
  }

  /**
   * Save local favorites to storage
   */
  private saveLocalFavorites(favorites: FavoriteItem[]): void {
    try {
      if (typeof window === 'undefined') return;

      localStorage.setItem(this.localStorageKey, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving local favorites:', error);
    }
  }

  /**
   * Clear local favorites
   */
  private clearLocalFavorites(): void {
    try {
      if (typeof window === 'undefined') return;

      localStorage.removeItem(this.localStorageKey);
    } catch (error) {
      console.error('Error clearing local favorites:', error);
    }
  }

  /**
   * Get favorites statistics
   */
  getFavoritesStats(): {
    totalFavorites: number;
    localFavorites: number;
    serverFavorites: number;
    categories: Record<string, number>;
    totalValue: number;
  } {
    const localFavorites = this.getLocalFavorites();

    return {
      totalFavorites: localFavorites.length,
      localFavorites: localFavorites.length,
      serverFavorites: 0, // Will be updated when user is logged in
      categories: localFavorites.reduce((acc, fav) => {
        if (fav.product?.categories) {
          fav.product.categories.forEach(cat => {
            acc[cat.name] = (acc[cat.name] || 0) + 1;
          });
        }
        return acc;
      }, {} as Record<string, number>),
      totalValue: localFavorites.reduce((sum, fav) => sum + (fav.product?.price || 0), 0)
    };
  }

  /**
   * Export favorites data
   */
  exportFavorites(): string {
    try {
      const favorites = this.getLocalFavorites();
      const exportData = {
        exportDate: new Date().toISOString(),
        favorites: favorites,
        stats: this.getFavoritesStats()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error(`خطأ في تصدير المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import favorites data
   */
  importFavorites(data: string): FavoriteOperation {
    try {
      const importData = JSON.parse(data);

      if (!importData.favorites || !Array.isArray(importData.favorites)) {
        return { success: false, message: 'بيانات غير صحيحة' };
      }

      const currentFavorites = this.getLocalFavorites();
      const newFavorites = importData.favorites.filter((fav: FavoriteItem) =>
        !currentFavorites.find(current => current.productId === fav.productId)
      );

      const allFavorites = [...currentFavorites, ...newFavorites];
      this.saveLocalFavorites(allFavorites);

      return {
        success: true,
        message: `تم استيراد ${newFavorites.length} منتج جديد للمفضلة`
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في استيراد المفضلة: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}