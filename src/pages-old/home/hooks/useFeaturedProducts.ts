/**
 * Featured Products Hook - Hook المنتجات المميزة
 * Hook منفصل لإدارة المنتجات المميزة
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { homeService } from "../services/home-service";
import { FeaturedProduct } from "../types/HomePage.types";

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
