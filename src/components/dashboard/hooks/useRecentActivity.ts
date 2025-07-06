/**
 * Recent Activity Hook
 * هوك النشاط الأخير
 */

import { useState, useEffect } from "react";
import { RecentActivity } from "../types/dashboard.types";

export const useRecentActivity = () => {
	const [activities, setActivities] = useState<RecentActivity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadActivities();
	}, []);

	const loadActivities = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// TODO: Replace with actual API call to Odoo
			// const response = await fetch('/api/dashboard/activities');
			// const data = await response.json();
			// setActivities(data);

			// For now, return empty activities
			setActivities([]);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to load activities",
			);
			console.error("Failed to load activities:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		activities,
		isLoading,
		error,
		loadActivities,
	};
};
