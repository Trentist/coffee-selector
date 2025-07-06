"use client";
import { useState, useEffect } from "react";
import { AboutPageData } from "../../odoo-schema-full/services/pages.service";
import { getAboutPageData } from "../../services/pages/about.service";

export const useAboutPage = (lang: string = "ar") => {
	const [data, setData] = useState<AboutPageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const result = await getAboutPageData(lang);
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
