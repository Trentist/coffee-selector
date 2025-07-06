/**
 * Testimonials Hook - Hook التوصيات
 * Hook منفصل لإدارة التوصيات
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { homeService } from "../services/home-service";
import { Testimonial } from "../types/HomePage.types";

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
