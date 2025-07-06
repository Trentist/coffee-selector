/**
 * Home Page Types - أنواع الصفحة الرئيسية
 * تم تحديثها لاستخدام النظام الموحد الجديد
 */

// استيراد الأنواع الجديدة من النظام الموحد
import {
	Product,
	ProductCategory,
	ProductPrice,
	ProductImage,
	ProductDescription,
	StockStatus,
	ProductAttribute,
	ProductReview,
	ReviewUser,
	ReviewSummary,
	RatingDistribution,
	ProductVariant,
	ProductFilterInput,
	ProductSearchInput,
	ProductSearchResult,
	ProductRecommendation,
	RecommendationReason,
	PageInfo,
	ApiResponse,
	ProductApiResponse,
	ProductsApiResponse,
} from "../../../odoo-schema-full/types";

// ============================================================================
// HERO SECTION TYPES - أنواع قسم البطل
// ============================================================================

export interface HeroSection {
	title: string;
	subtitle: string;
	description: string;
	image: string;
	ctaText: string;
	ctaLink: string;
}

// ============================================================================
// FEATURED PRODUCT TYPES - أنواع المنتجات المميزة
// ============================================================================

export interface FeaturedProduct extends Product {
	// إضافة خصائص خاصة بالمنتجات المميزة
	isNew?: boolean;
	isSale?: boolean;
	discount?: number;
	originalPrice?: number;
	rating: number;
	reviewCount: number;
}

// ============================================================================
// CATEGORY CARD TYPES - أنواع بطاقة الفئة
// ============================================================================

export interface CategoryCard extends ProductCategory {
	// إضافة خصائص خاصة ببطاقة الفئة
	link: string;
	image: string;
	productCount: number;
}

// ============================================================================
// TESTIMONIAL TYPES - أنواع التوصيات
// ============================================================================

export interface Testimonial {
	id: string;
	name: string;
	role: string;
	content: string;
	rating: number;
	avatar: string;
}

// ============================================================================
// STATS TYPES - أنواع الإحصائيات
// ============================================================================

export interface HomePageStats {
	customers: number;
	products: number;
	countries: number;
	years: number;
}

// ============================================================================
// HOME PAGE DATA TYPES - أنواع بيانات الصفحة الرئيسية
// ============================================================================

export interface HomePageData {
	hero: HeroSection;
	featuredProducts: FeaturedProduct[];
	categories: CategoryCard[];
	testimonials: Testimonial[];
	stats: HomePageStats;
}

// ============================================================================
// HOME PAGE PROPS TYPES - أنواع خصائص الصفحة الرئيسية
// ============================================================================

export interface HomePageProps {
	data?: HomePageData;
	loading?: boolean;
	error?: string;
}

// ============================================================================
// PRODUCT SERVICE TYPES - أنواع خدمة المنتجات
// ============================================================================

export interface ProductServiceConfig {
	pageSize?: number;
	currentPage?: number;
	filters?: ProductFilterInput;
	sortBy?: string;
	sortDirection?: "ASC" | "DESC";
}

export interface FeaturedProductsConfig {
	limit?: number;
	categoryId?: number;
	includeOutOfStock?: boolean;
	sortBy?: "created_at" | "price" | "rating" | "popularity";
}

// ============================================================================
// API RESPONSE TYPES - أنواع استجابة API
// ============================================================================

export type HomePageApiResponse = ApiResponse<HomePageData>;

export interface FeaturedProductsApiResponse extends ProductsApiResponse {
	data?: FeaturedProduct[];
}

export type CategoriesApiResponse = ApiResponse<CategoryCard[]>;

// ============================================================================
// COMPONENT PROPS TYPES - أنواع خصائص المكونات
// ============================================================================

export interface FeaturedProductsProps {
	products: FeaturedProduct[];
	loading?: boolean;
	error?: string;
	config?: FeaturedProductsConfig;
}

export interface CategoryCardProps {
	category: CategoryCard;
	onClick?: (category: CategoryCard) => void;
}

export interface ProductCardProps {
	product: FeaturedProduct;
	onClick?: (product: FeaturedProduct) => void;
	showRating?: boolean;
	showDiscount?: boolean;
}

// ============================================================================
// FILTER AND SEARCH TYPES - أنواع التصفية والبحث
// ============================================================================

export interface HomePageFilters {
	search?: string;
	categoryId?: number;
	priceRange?: {
		min: number;
		max: number;
	};
	inStock?: boolean;
	onSale?: boolean;
	rating?: number;
}

export interface HomePageSearchInput {
	query: string;
	filters?: HomePageFilters;
	pageSize?: number;
	currentPage?: number;
}

// ============================================================================
// RECOMMENDATION TYPES - أنواع التوصيات
// ============================================================================

export interface HomePageRecommendations {
	featured: ProductRecommendation[];
	newArrivals: ProductRecommendation[];
	bestSellers: ProductRecommendation[];
	trending: ProductRecommendation[];
	personalized: ProductRecommendation[];
}

// ============================================================================
// ANALYTICS TYPES - أنواع التحليلات
// ============================================================================

export interface HomePageAnalytics {
	pageViews: number;
	uniqueVisitors: number;
	conversionRate: number;
	averageTimeOnPage: number;
	bounceRate: number;
	topProducts: FeaturedProduct[];
	topCategories: CategoryCard[];
}

// ============================================================================
// EXPORT ALL TYPES - تصدير جميع الأنواع
// ============================================================================

export type {
	Product,
	ProductCategory,
	ProductPrice,
	ProductImage,
	ProductDescription,
	StockStatus,
	ProductAttribute,
	ProductReview,
	ReviewUser,
	ReviewSummary,
	RatingDistribution,
	ProductVariant,
	ProductFilterInput,
	ProductSearchInput,
	ProductSearchResult,
	ProductRecommendation,
	RecommendationReason,
	PageInfo,
	ApiResponse,
	ProductApiResponse,
	ProductsApiResponse,
};
