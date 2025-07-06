/**
 * Home Page Service - خدمة الصفحة الرئيسية
 * خدمة شاملة لإدارة بيانات الصفحة الرئيسية
 */
"use client";

import { ProductService } from "../../../odoo-schema-full/services/product-service";
import { CategoryProductService } from "../../../odoo-schema-full/services/category-product-service";
import {
	HomePageData,
	FeaturedProduct,
	CategoryCard,
	Testimonial,
	HomePageStats,
	HomePageApiResponse,
	FeaturedProductsApiResponse,
	CategoriesApiResponse,
	HomePageSearchInput,
	HomePageRecommendations,
	HomePageAnalytics,
	HeroSection,
} from "../types/HomePage.types";

// ============================================================================
// HOME SERVICE CLASS - فئة خدمة الصفحة الرئيسية
// ============================================================================

export class HomeService {
	private productService: ProductService;
	private categoryService: CategoryProductService;

	constructor() {
		this.productService = new ProductService();
		this.categoryService = new CategoryProductService();
	}

	// ============================================================================
	// FEATURED PRODUCTS METHODS - طرق المنتجات المميزة
	// ============================================================================

	/**
	 * Get featured products for home page
	 * الحصول على المنتجات المميزة للصفحة الرئيسية
	 */
	async getFeaturedProducts(
		limit: number = 8,
	): Promise<FeaturedProductsApiResponse> {
		try {
			const result = await this.productService.getFeaturedProducts(limit);

			if (result.success && result.data) {
				// تحويل المنتجات إلى FeaturedProduct
				const featuredProducts: FeaturedProduct[] = result.data.map(
					(product) => ({
						...product,
						rating: product.average_rating || 0,
						reviewCount: product.review_count || 0,
						isNew: product.created_at
							? new Date().getTime() - new Date(product.created_at).getTime() <
								30 * 24 * 60 * 60 * 1000
							: false,
						isSale: product.price?.specialPrice ? true : false,
						discount:
							product.price?.regularPrice && product.price?.specialPrice
								? Math.round(
										((product.price.regularPrice.value -
											product.price.specialPrice.value) /
											product.price.regularPrice.value) *
											100,
									)
								: 0,
						originalPrice: product.price?.regularPrice?.value || 0,
					}),
				);

				return {
					success: true,
					data: featuredProducts,
					pagination: result.pagination,
				};
			}

			return {
				success: false,
				error: result.error || "فشل في جلب المنتجات المميزة",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير متوقع",
			};
		}
	}

	/**
	 * Get new arrivals
	 * الحصول على المنتجات الجديدة
	 */
	async getNewArrivals(
		limit: number = 4,
	): Promise<FeaturedProductsApiResponse> {
		try {
			const result = await this.productService.getNewProducts(limit);

			if (result.success && result.data) {
				const newProducts: FeaturedProduct[] = result.data.map((product) => ({
					...product,
					rating: product.average_rating || 0,
					reviewCount: product.review_count || 0,
					isNew: true,
					isSale: product.price?.specialPrice ? true : false,
					discount:
						product.price?.regularPrice && product.price?.specialPrice
							? Math.round(
									((product.price.regularPrice.value -
										product.price.specialPrice.value) /
										product.price.regularPrice.value) *
										100,
								)
							: 0,
					originalPrice: product.price?.regularPrice?.value || 0,
				}));

				return {
					success: true,
					data: newProducts,
					pagination: result.pagination,
				};
			}

			return {
				success: false,
				error: result.error || "فشل في جلب المنتجات الجديدة",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير متوقع",
			};
		}
	}

	/**
	 * Get best sellers
	 * الحصول على الأكثر مبيعاً
	 */
	async getBestSellers(
		limit: number = 4,
	): Promise<FeaturedProductsApiResponse> {
		try {
			const result = await this.productService.getBestSellers(limit);

			if (result.success && result.data) {
				const bestSellers: FeaturedProduct[] = result.data.map((product) => ({
					...product,
					rating: product.average_rating || 0,
					reviewCount: product.review_count || 0,
					isNew: product.created_at
						? new Date().getTime() - new Date(product.created_at).getTime() <
							30 * 24 * 60 * 60 * 1000
						: false,
					isSale: product.price?.specialPrice ? true : false,
					discount:
						product.price?.regularPrice && product.price?.specialPrice
							? Math.round(
									((product.price.regularPrice.value -
										product.price.specialPrice.value) /
										product.price.regularPrice.value) *
										100,
								)
							: 0,
					originalPrice: product.price?.regularPrice?.value || 0,
				}));

				return {
					success: true,
					data: bestSellers,
					pagination: result.pagination,
				};
			}

			return {
				success: false,
				error: result.error || "فشل في جلب الأكثر مبيعاً",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير متوقع",
			};
		}
	}

	// ============================================================================
	// CATEGORIES METHODS - طرق الفئات
	// ============================================================================

	/**
	 * Get featured categories for home page
	 * الحصول على الفئات المميزة للصفحة الرئيسية
	 */
	async getFeaturedCategories(
		limit: number = 6,
	): Promise<CategoriesApiResponse> {
		try {
			const result = await this.categoryService.getAllCategories();

			if (result.success && result.data) {
				// تحويل الفئات إلى CategoryCard
				const categoryCards: CategoryCard[] = result.data
					.filter(
						(category: { is_active: boolean; product_count: number }) =>
							category.is_active && category.product_count > 0,
					)
					.slice(0, limit)
					.map((category) => ({
						...category,
						link: `/category/${category.url_path || category.id}`,
						image: category.image || "/placeholder-category.jpg",
						productCount: category.product_count,
					}));

				return {
					success: true,
					data: categoryCards,
				};
			}

			return {
				success: false,
				error: result.error || "فشل في جلب الفئات المميزة",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير متوقع",
			};
		}
	}

	// ============================================================================
	// STATISTICS METHODS - طرق الإحصائيات
	// ============================================================================

	/**
	 * Get home page statistics
	 * الحصول على إحصائيات الصفحة الرئيسية
	 */
	async getHomePageStats(): Promise<{
		success: boolean;
		data?: HomePageStats;
		error?: string;
	}> {
		try {
			// جلب إحصائيات المنتجات
			const productsResult = await this.productService.getProducts(1, 1);

			const stats: HomePageStats = {
				customers: 1500, // يمكن جلبها من خدمة العملاء
				products: productsResult.success
					? productsResult.pagination?.total_count || 0
					: 0,
				countries: 25, // يمكن جلبها من خدمة الشحن
				years: 5, // سنوات الخبرة
			};

			return {
				success: true,
				data: stats,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ في جلب الإحصائيات",
			};
		}
	}

	// ============================================================================
	// TESTIMONIALS METHODS - طرق التوصيات
	// ============================================================================

	/**
	 * Get testimonials for home page
	 * الحصول على التوصيات للصفحة الرئيسية
	 */
	async getTestimonials(
		limit: number = 3,
	): Promise<{ success: boolean; data?: Testimonial[]; error?: string }> {
		try {
			// بيانات التوصيات الافتراضية (يمكن جلبها من API)
			const testimonials: Testimonial[] = [
				{
					id: "1",
					name: "أحمد محمد",
					role: "مدير شركة",
					content: "منتجات ممتازة وجودة عالية، أنصح الجميع بالتسوق من هنا",
					rating: 5,
					avatar: "/avatars/ahmed.jpg",
				},
				{
					id: "2",
					name: "فاطمة علي",
					role: "ربة منزل",
					content: "خدمة عملاء رائعة وتوصيل سريع، شكراً لكم",
					rating: 5,
					avatar: "/avatars/fatima.jpg",
				},
				{
					id: "3",
					name: "محمد حسن",
					role: "مطور برمجيات",
					content: "أفضل مكان لشراء القهوة، جودة لا مثيل لها",
					rating: 5,
					avatar: "/avatars/mohamed.jpg",
				},
			];

			return {
				success: true,
				data: testimonials.slice(0, limit),
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ في جلب التوصيات",
			};
		}
	}

	// ============================================================================
	// COMPLETE HOME PAGE DATA - بيانات الصفحة الرئيسية الكاملة
	// ============================================================================

	/**
	 * Get complete home page data
	 * الحصول على بيانات الصفحة الرئيسية الكاملة
	 */
	async getHomePageData(): Promise<HomePageApiResponse> {
		try {
			// جلب جميع البيانات بالتوازي
			const [
				featuredProductsResult,
				categoriesResult,
				statsResult,
				testimonialsResult,
			] = await Promise.all([
				this.getFeaturedProducts(8),
				this.getFeaturedCategories(6),
				this.getHomePageStats(),
				this.getTestimonials(3),
			]);

			// بيانات قسم البطل الافتراضية
			const hero: HeroSection = {
				title: "اكتشف عالم القهوة المميز",
				subtitle: "أفضل أنواع القهوة من حول العالم",
				description:
					"نقدم لك مجموعة متنوعة من أجود أنواع القهوة، محمصة بعناية فائقة لتضمن لك تجربة قهوة لا تُنسى",
				image: "/images/hero-coffee.jpg",
				ctaText: "تسوق الآن",
				ctaLink: "/products",
			};

			const homePageData: HomePageData = {
				hero,
				featuredProducts: featuredProductsResult.success
					? featuredProductsResult.data || []
					: [],
				categories: categoriesResult.success ? categoriesResult.data || [] : [],
				testimonials: testimonialsResult.success
					? testimonialsResult.data || []
					: [],
				stats: statsResult.success
					? statsResult.data || {
							customers: 0,
							products: 0,
							countries: 0,
							years: 0,
						}
					: {
							customers: 0,
							products: 0,
							countries: 0,
							years: 0,
						},
			};

			return {
				success: true,
				data: homePageData,
			};
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "خطأ في جلب بيانات الصفحة الرئيسية",
			};
		}
	}

	// ============================================================================
	// SEARCH AND FILTER METHODS - طرق البحث والتصفية
	// ============================================================================

	/**
	 * Search products for home page
	 * البحث في المنتجات للصفحة الرئيسية
	 */
	async searchProducts(
		searchInput: HomePageSearchInput,
	): Promise<FeaturedProductsApiResponse> {
		try {
			const result = await this.productService.searchProducts({
				query: searchInput.query,
				filters: searchInput.filters,
				page_size: searchInput.pageSize || 20,
				current_page: searchInput.currentPage || 1,
			});

			if (result.success && result.data) {
				const searchProducts: FeaturedProduct[] = result.data.products.map(
					(product) => ({
						...product,
						rating: product.average_rating || 0,
						reviewCount: product.review_count || 0,
						isNew: product.created_at
							? new Date().getTime() - new Date(product.created_at).getTime() <
								30 * 24 * 60 * 60 * 1000
							: false,
						isSale: product.price?.specialPrice ? true : false,
						discount:
							product.price?.regularPrice && product.price?.specialPrice
								? Math.round(
										((product.price.regularPrice.value -
											product.price.specialPrice.value) /
											product.price.regularPrice.value) *
											100,
									)
								: 0,
						originalPrice: product.price?.regularPrice?.value || 0,
					}),
				);

				return {
					success: true,
					data: searchProducts,
					pagination: result.data.page_info,
				};
			}

			return {
				success: false,
				error: result.error || "فشل في البحث",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ في البحث",
			};
		}
	}

	// ============================================================================
	// RECOMMENDATIONS METHODS - طرق التوصيات
	// ============================================================================

	/**
	 * Get personalized recommendations
	 * الحصول على التوصيات الشخصية
	 */
	async getRecommendations(): Promise<{
		success: boolean;
		data?: HomePageRecommendations;
		error?: string;
	}> {
		try {
			// يمكن جلب التوصيات من خدمة التوصيات
			const recommendations: HomePageRecommendations = {
				featured: [],
				newArrivals: [],
				bestSellers: [],
				trending: [],
				personalized: [],
			};

			return {
				success: true,
				data: recommendations,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ في جلب التوصيات",
			};
		}
	}

	// ============================================================================
	// ANALYTICS METHODS - طرق التحليلات
	// ============================================================================

	/**
	 * Get home page analytics
	 * الحصول على تحليلات الصفحة الرئيسية
	 */
	async getAnalytics(): Promise<{
		success: boolean;
		data?: HomePageAnalytics;
		error?: string;
	}> {
		try {
			// يمكن جلب التحليلات من خدمة التحليلات
			const analytics: HomePageAnalytics = {
				pageViews: 0,
				uniqueVisitors: 0,
				conversionRate: 0,
				averageTimeOnPage: 0,
				bounceRate: 0,
				topProducts: [],
				topCategories: [],
			};

			return {
				success: true,
				data: analytics,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ في جلب التحليلات",
			};
		}
	}
}

// ============================================================================
// SINGLETON INSTANCE - نسخة وحيدة
// ============================================================================

export const homeService = new HomeService();

// ============================================================================
// HOOK FOR REACT COMPONENTS - Hook للمكونات
// ============================================================================

export const useHomeService = () => homeService;
