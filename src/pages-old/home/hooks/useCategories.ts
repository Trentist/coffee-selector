/**
 * Categories Hook - Hook الفئات
 * Hook منفصل لإدارة الفئات المميزة
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { homeService } from "../services/home-service";
import { CategoryCard } from "../types/HomePage.types";

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
