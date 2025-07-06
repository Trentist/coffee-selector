"use client";
import { useState, useEffect } from "react";
import { WholesalePageData } from "../../odoo-schema-full/services/pages.service";
import { getWholesalePageData } from "../../services/pages/wholesale.service";

export const useWholesalePage = (lang: string = "ar") => {
	const [data, setData] = useState<WholesalePageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const result = await getWholesalePageData(lang);
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
	}, [lang]);

	return { data, loading, error };
};
