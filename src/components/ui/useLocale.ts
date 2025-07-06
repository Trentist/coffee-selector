import { useRouter, usePathname } from "next/navigation";
import { useParams } from "next/navigation";

export const useLocale = () => {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	
	// Get locale from params or default to 'ar'
	const locale = (params?.locale as string) || "ar";
	const isRTL = locale === "ar";
	const isArabic = locale === "ar";

	// Simple translation function
	const t = (key: string, defaultValue?: string) => {
		// For now, return the default value or the key
		// This will be enhanced when i18n is properly set up
		return defaultValue || key;
	};

	return { t, locale, isRTL, isArabic, pathname, query: params, asPath: pathname, router };
};
