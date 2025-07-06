"use client";

import { useState, useEffect } from "react";
import {
	JobsPageData,
	JobData,
} from "../../odoo-schema-full/services/pages.service";
import { getJobsPageData } from "../../services/pages/jobs.service";

export const useJobsPage = (
	lang: string = "ar",
	limit: number = 10,
	offset: number = 0,
) => {
	const [data, setData] = useState<{
		page: JobsPageData;
		jobs: JobData[];
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const result = await getJobsPageData(lang, limit, offset);
				setData(result);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "حدث خطأ أثناء تحميل البيانات",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [lang, limit, offset]);

	return { data, loading, error };
};
