/**
 * نظام المفضلة - ملف التصدير الرئيسي
 * Favorites System - Main Export File
 */

// المكونات الرئيسية
export { default as FavoritesManager } from "./FavoritesManager";
export { default as FavoritesList } from "./FavoritesList";
export { default as FavoritesGrid } from "./FavoritesGrid";
export { default as FavoritesDrawer } from "./FavoritesDrawer";

// الأنواع
export type { FavoriteItem, FavoritesState } from "./types";

// الخدمات
export { default as FavoritesService } from "./services/FavoritesService";
