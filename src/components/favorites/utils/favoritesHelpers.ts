/**
 * أدوات مساعدة لنظام المفضلة
 * Favorites System Helpers
 */

import { FavoriteItem } from '../types';

/**
 * تنسيق سعر المنتج
 * Format product price
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price);
};

/**
 * التحقق من صحة عنصر المفضلة
 * Validate favorite item
 */
export const validateFavoriteItem = (item: any): item is FavoriteItem => {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number'
  );
};

/**
 * ترتيب المفضلة حسب السعر
 * Sort favorites by price
 */
export const sortFavoritesByPrice = (items: FavoriteItem[], ascending: boolean = true): FavoriteItem[] => {
  return [...items].sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price;
  });
};

/**
 * ترتيب المفضلة حسب الاسم
 * Sort favorites by name
 */
export const sortFavoritesByName = (items: FavoriteItem[]): FavoriteItem[] => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
};