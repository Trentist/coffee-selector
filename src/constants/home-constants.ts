/**
 * Home Page Constants - ثوابت الصفحة الرئيسية
 * ثوابت النصوص والرسائل المستخدمة في الصفحة الرئيسية
 */

// ============================================================================
// HERO SECTION CONSTANTS - ثوابت قسم البطل
// ============================================================================

export const HERO_CONSTANTS = {
  BROWSE_PRODUCTS: "hero.browseProducts",
} as const;

// ============================================================================
// FEATURED PRODUCTS CONSTANTS - ثوابت المنتجات المميزة
// ============================================================================

export const FEATURED_PRODUCTS_CONSTANTS = {
  TITLE: "featuredProducts.title",
  SUBTITLE: "featuredProducts.subtitle",
  LOADING: "featuredProducts.loading",
  ERROR: "featuredProducts.error",
  RETRY: "featuredProducts.retry",
  NO_PRODUCTS: "featuredProducts.noProducts",
  REFRESH: "featuredProducts.refresh",
  VIEW_ALL: "featuredProducts.viewAll",
} as const;

// ============================================================================
// PRODUCT CARD CONSTANTS - ثوابت بطاقة المنتج
// ============================================================================

export const PRODUCT_CARD_CONSTANTS = {
  NEW: "productCard.new",
  DISCOUNT: "productCard.discount",
  OUT_OF_STOCK: "productCard.outOfStock",
  ADD_TO_CART: "productCard.addToCart",
  ADD_TO_FAVORITES: "productCard.addToFavorites",
  SKU_UNDEFINED: "productCard.skuUndefined",
  AVAILABLE: "productCard.available",
  UNAVAILABLE: "productCard.unavailable",
} as const;

// ============================================================================
// STATS CONSTANTS - ثوابت الإحصائيات
// ============================================================================

export const STATS_CONSTANTS = {
  SATISFIED_CUSTOMERS: "stats.satisfiedCustomers",
  DIVERSE_PRODUCTS: "stats.diverseProducts",
  SERVED_COUNTRIES: "stats.servedCountries",
  YEARS_EXPERIENCE: "stats.yearsExperience",
} as const;

// ============================================================================
// ERROR CONSTANTS - ثوابت الأخطاء
// ============================================================================

export const ERROR_CONSTANTS = {
  LOADING_PAGE: "errors.loadingPage",
  PAGE_LOAD_ERROR: "errors.pageLoadError",
  NO_DATA: "errors.noData",
  FETCH_ERROR: "errors.fetchError",
  UNEXPECTED_ERROR: "errors.unexpectedError",
} as const;

// ============================================================================
// DEFAULT VALUES - القيم الافتراضية
// ============================================================================

export const DEFAULT_VALUES = {
  FEATURED_PRODUCTS_LIMIT: 8,
  NEW_ARRIVALS_LIMIT: 4,
  BEST_SELLERS_LIMIT: 4,
  CATEGORIES_LIMIT: 6,
  TESTIMONIALS_LIMIT: 3,
  NEW_PRODUCT_DAYS: 30,
} as const;

// ============================================================================
// PLACEHOLDER IMAGES - صور بديلة
// ============================================================================

export const PLACEHOLDER_IMAGES = {
  PRODUCT: "/placeholder-product.jpg",
  CATEGORY: "/placeholder-category.jpg",
  HERO: "/images/hero-coffee.jpg",
} as const;

// ============================================================================
// EXPORT ALL CONSTANTS - تصدير جميع الثوابت
// ============================================================================

export const HOME_CONSTANTS = {
  HERO: HERO_CONSTANTS,
  FEATURED_PRODUCTS: FEATURED_PRODUCTS_CONSTANTS,
  PRODUCT_CARD: PRODUCT_CARD_CONSTANTS,
  STATS: STATS_CONSTANTS,
  ERROR: ERROR_CONSTANTS,
  DEFAULT_VALUES,
  PLACEHOLDER_IMAGES,
} as const;