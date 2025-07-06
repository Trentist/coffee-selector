/**
 * Internationalization Export
 * تصدير الترجمة
 */

// Configuration
export { default as config } from "./config";
export { locales } from "./config";
export type { Locale } from "./config";

// Navigation
export {
	Link,
	redirect,
	usePathname,
	useRouter,
	navigationConfig,
	getNavigationPath,
	getNavigationPaths,
	getBreadcrumbNavigation,
} from "./navigation";

// Routing
export {
	getLocalizedPath,
	removeLocaleFromPath,
	getLocaleFromPath,
	localizedPaths,
} from "./routing";


// Components
export { default as LanguageSwitcher } from "../components/common/LanguageSwitcher";

// Hooks
export {
	useTranslation,
	useComponentTranslation,
	useFormTranslation,
} from "../hooks/useTranslation";

// Constants
export { TRANSLATION_KEYS } from "../constants/translation-keys";
export {
	AUTH_KEYS,
	SHOP_KEYS,
	DASHBOARD_KEYS,
	ALERTS_KEYS,
	CHECKOUT_KEYS,
} from "../constants/translation-keys";
