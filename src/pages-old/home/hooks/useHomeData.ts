/**
 * Home Data Hook - Hook بيانات الصفحة الرئيسية
 * Hook للاستخدام في React لجلب وإدارة بيانات الصفحة الرئيسية
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { homeService } from "../services/home-service";
import {
	HomePageData,
	FeaturedProduct,
	CategoryCard,
	Testimonial,
	HomePageStats,
	HomePageSearchInput,
	HomePageRecommendations,
	HomePageAnalytics,
} from "../types/HomePage.types";
import { ERROR_CONSTANTS } from "../../../constants/home-constants";

// ============================================================================
// HOME DATA HOOK - Hook بيانات الصفحة الرئيسية
// ============================================================================

export const useHomeData = () => {
	const [data, setData] = useState<HomePageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// جلب جميع بيانات الصفحة الرئيسية
	const fetchHomeData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.getHomePageData();

			if (result.success && result.data) {
				setData(result.data);
			} else {
				setError(result.error || "فشل في جلب بيانات الصفحة الرئيسية");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	}, []);

	// جلب المنتجات المميزة فقط
	const fetchFeaturedProducts = useCallback(async (limit: number = 8) => {
		try {
			const result = await homeService.getFeaturedProducts(limit);

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.error || "فشل في جلب المنتجات المميزة");
			}
		} catch (err) {
			throw err instanceof Error ? err : new Error("خطأ غير متوقع");
		}
	}, []);

	// جلب الفئات المميزة فقط
	const fetchFeaturedCategories = useCallback(async (limit: number = 6) => {
		try {
			const result = await homeService.getFeaturedCategories(limit);

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.error || "فشل في جلب الفئات المميزة");
			}
		} catch (err) {
			throw err instanceof Error ? err : new Error("خطأ غير متوقع");
		}
	}, []);

	// جلب الإحصائيات فقط
	const fetchStats = useCallback(async () => {
		try {
			const result = await homeService.getHomePageStats();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.error || "فشل في جلب الإحصائيات");
			}
		} catch (err) {
			throw err instanceof Error ? err : new Error("خطأ غير متوقع");
		}
	}, []);

	// جلب التوصيات فقط
	const fetchTestimonials = useCallback(async (limit: number = 3) => {
		try {
			const result = await homeService.getTestimonials(limit);

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.error || "فشل في جلب التوصيات");
			}
		} catch (err) {
			throw err instanceof Error ? err : new Error("خطأ غير متوقع");
		}
	}, []);

	// البحث في المنتجات
	const searchProducts = useCallback(
		async (searchInput: HomePageSearchInput) => {
			try {
				const result = await homeService.searchProducts(searchInput);

				if (result.success && result.data) {
					return result.data;
				} else {
					throw new Error(result.error || "فشل في البحث");
				}
			} catch (err) {
				throw err instanceof Error ? err : new Error("خطأ في البحث");
			}
		},
		[],
	);

	// جلب التوصيات الشخصية
	const fetchRecommendations = useCallback(async () => {
		try {
			const result = await homeService.getRecommendations();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.error || "فشل في جلب التوصيات");
			}
		} catch (err) {
			throw err instanceof Error ? err : new Error("خطأ في جلب التوصيات");
		}
	}, []);

	// جلب التحليلات
	const fetchAnalytics = useCallback(async () => {
		try {
			const result = await homeService.getAnalytics();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.error || "فشل في جلب التحليلات");
			}
		} catch (err) {
			throw err instanceof Error ? err : new Error("خطأ في جلب التحليلات");
		}
	}, []);

	// إعادة تحميل البيانات
	const refetch = useCallback(() => {
		fetchHomeData();
	}, [fetchHomeData]);

	// تحميل البيانات عند بدء المكون
	useEffect(() => {
		fetchHomeData();
	}, [fetchHomeData]);

	return {
		// البيانات
		data,
		loading,
		error,

		// الطرق
		fetchHomeData,
		fetchFeaturedProducts,
		fetchFeaturedCategories,
		fetchStats,
		fetchTestimonials,
		searchProducts,
		fetchRecommendations,
		fetchAnalytics,
		refetch,

		// البيانات المفصلة
		hero: data?.hero,
		featuredProducts: data?.featuredProducts || [],
		categories: data?.categories || [],
		testimonials: data?.testimonials || [],
		stats: data?.stats,
	};
};

// ============================================================================
// FEATURED PRODUCTS HOOK - Hook المنتجات المميزة
// ============================================================================

export const useFeaturedProducts = (limit: number = 8) => {
	const [products, setProducts] = useState<FeaturedProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.getFeaturedProducts(limit);

			if (result.success && result.data) {
				setProducts(result.data);
			} else {
				setError(result.error || "فشل في جلب المنتجات المميزة");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	}, [limit]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return {
		products,
		loading,
		error,
		refetch: fetchProducts,
	};
};

// ============================================================================
// CATEGORIES HOOK - Hook الفئات
// ============================================================================

export const useFeaturedCategories = (limit: number = 6) => {
	const [categories, setCategories] = useState<CategoryCard[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCategories = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.getFeaturedCategories(limit);

			if (result.success && result.data) {
				setCategories(result.data);
			} else {
				setError(result.error || "فشل في جلب الفئات المميزة");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	}, [limit]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	return {
		categories,
		loading,
		error,
		refetch: fetchCategories,
	};
};

// ============================================================================
// STATS HOOK - Hook الإحصائيات
// ============================================================================

export const useHomeStats = () => {
	const [stats, setStats] = useState<HomePageStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.getHomePageStats();

			if (result.success && result.data) {
				setStats(result.data);
			} else {
				setError(result.error || "فشل في جلب الإحصائيات");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return {
		stats,
		loading,
		error,
		refetch: fetchStats,
	};
};

// ============================================================================
// TESTIMONIALS HOOK - Hook التوصيات
// ============================================================================

export const useTestimonials = (limit: number = 3) => {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTestimonials = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.getTestimonials(limit);

			if (result.success && result.data) {
				setTestimonials(result.data);
			} else {
				setError(result.error || "فشل في جلب التوصيات");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	}, [limit]);

	useEffect(() => {
		fetchTestimonials();
	}, [fetchTestimonials]);

	return {
		testimonials,
		loading,
		error,
		refetch: fetchTestimonials,
	};
};

// ============================================================================
// SEARCH HOOK - Hook البحث
// ============================================================================

export const useProductSearch = () => {
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const search = useCallback(async (searchInput: HomePageSearchInput) => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.searchProducts(searchInput);

			if (result.success && result.data) {
				setSearchResults(result.data);
			} else {
				setError(result.error || "فشل في البحث");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ في البحث");
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		searchResults,
		loading,
		error,
		search,
		clearResults: () => setSearchResults([]),
	};
};

// ============================================================================
// RECOMMENDATIONS HOOK - Hook التوصيات الشخصية
// ============================================================================

export const useRecommendations = () => {
	const [recommendations, setRecommendations] =
		useState<HomePageRecommendations | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRecommendations = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.getRecommendations();

			if (result.success && result.data) {
				setRecommendations(result.data);
			} else {
				setError(result.error || "فشل في جلب التوصيات");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRecommendations();
	}, [fetchRecommendations]);

	return {
		recommendations,
		loading,
		error,
		refetch: fetchRecommendations,
	};
};

// ============================================================================
// ANALYTICS HOOK - Hook التحليلات
// ============================================================================

export const useHomeAnalytics = () => {
	const [analytics, setAnalytics] = useState<HomePageAnalytics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAnalytics = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await homeService.getAnalytics();

			if (result.success && result.data) {
				setAnalytics(result.data);
			} else {
				setError(result.error || "فشل في جلب التحليلات");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	return {
		analytics,
		loading,
		error,
		refetch: fetchAnalytics,
	};
};
