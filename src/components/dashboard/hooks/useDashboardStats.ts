/**
 * Dashboard Stats Hook
 * هوك إحصائيات لوحة التحكم
 */

import { useState, useEffect } from "react";
import { DashboardStats } from "../types/dashboard.types";

export const useDashboardStats = () => {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// TODO: Replace with actual API call to Odoo
			// const response = await fetch('/api/dashboard/stats');
			// const data = await response.json();
			// setStats(data);

			// For now, return empty stats
			setStats(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load stats");
		} finally {
			setIsLoading(false);
		}
	};

	const refreshStats = () => {
		loadStats();
	};

	return {
		stats,
		isLoading,
		error,
		refreshStats,
	};
};
