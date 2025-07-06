"use client";

import { useState, useEffect } from "react";
import { ContactPageData } from "../../odoo-schema-full/services/pages.service";
import { getContactPageData } from "../../services/pages/contact.service";

export const useContactPage = (lang: string = "ar") => {
	const [data, setData] = useState<ContactPageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const result = await getContactPageData(lang);
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
