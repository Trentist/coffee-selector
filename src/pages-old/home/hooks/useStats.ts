/**
 * Stats Hook - Hook الإحصائيات
 * Hook منفصل لإدارة إحصائيات الصفحة الرئيسية
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { homeService } from "../services/home-service";
import { HomePageStats } from "../types/HomePage.types";

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
