/**
 * Custom Translation Hook
 * Hook مخصص للترجمة
 */

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { TRANSLATION_KEYS } from "../constants/translation-keys";

/**
 * Custom translation hook with enhanced functionality
 */
export function useTranslation() {
	const t = useTranslations();
	const locale = useLocale();

	/**
	 * Get translation with fallback
	 */
	const getTranslation = (key: string, fallback?: string): string => {
		try {
			return t(key);
		} catch (error) {
			console.warn(`Translation key not found: ${key}`);
			return fallback || key;
		}
	};

	/**
	 * Get translation with parameters
	 */
	const getTranslationWithParams = (
		key: string,
		params: Record<string, any>,
		fallback?: string,
	): string => {
		try {
			return t(key, params);
		} catch (error) {
			console.warn(`Translation key not found: ${key}`);
			return fallback || key;
		}
	};

	/**
	 * Get translation from nested keys
	 */
	const getNestedTranslation = (
		namespace: string,
		key: string,
		fallback?: string,
	): string => {
		const fullKey = `${namespace}.${key}`;
		return getTranslation(fullKey, fallback);
	};

	/**
	 * Get common translation
	 */
	const common = (key: keyof typeof TRANSLATION_KEYS.COMMON): string => {
		return getTranslation(TRANSLATION_KEYS.COMMON[key]);
	};

	/**
	 * Get auth translation
	 */
	const auth = (key: keyof typeof TRANSLATION_KEYS.AUTH): string => {
		return getTranslation(TRANSLATION_KEYS.AUTH[key]);
	};

	/**
	 * Get shop translation
	 */
	const shop = (key: keyof typeof TRANSLATION_KEYS.SHOP): string => {
		return getTranslation(TRANSLATION_KEYS.SHOP[key]);
	};

	/**
	 * Get dashboard translation
	 */
	const dashboard = (key: keyof typeof TRANSLATION_KEYS.DASHBOARD): string => {
		return getTranslation(TRANSLATION_KEYS.DASHBOARD[key]);
	};

	/**
	 * Get alerts translation
	 */
	const alerts = (key: keyof typeof TRANSLATION_KEYS.ALERTS): string => {
		return getTranslation(TRANSLATION_KEYS.ALERTS[key]);
	};

	/**
	 * Get checkout translation
	 */
	const checkout = (key: keyof typeof TRANSLATION_KEYS.CHECKOUT): string => {
		return getTranslation(TRANSLATION_KEYS.CHECKOUT[key]);
	};

	/**
	 * Check if translation key exists
	 */
	const hasTranslation = (key: string): boolean => {
		try {
			t(key);
			return true;
		} catch {
			return false;
		}
	};

	/**
	 * Get all translations for a namespace
	 */
	const getNamespaceTranslations = (
		namespace: string,
	): Record<string, string> => {
		const translations: Record<string, string> = {};

		// This is a simplified version - in a real implementation,
		// you would need to know the available keys for each namespace
		try {
			// Try to get some common keys for the namespace
			["title", "description", "label", "placeholder"].forEach((key) => {
				const fullKey = `${namespace}.${key}`;
				if (hasTranslation(fullKey)) {
					translations[key] = getTranslation(fullKey);
				}
			});
		} catch (error) {
			console.warn(`Failed to get namespace translations: ${namespace}`);
		}

		return translations;
	};

	return {
		t,
		locale,
		getTranslation,
		getTranslationWithParams,
		getNestedTranslation,
		common,
		auth,
		shop,
		dashboard,
		alerts,
		checkout,
		hasTranslation,
		getNamespaceTranslations,
	};
}

/**
 * Hook for component-specific translations
 */
export function useComponentTranslation(component: string) {
	const { getNestedTranslation, hasTranslation } = useTranslation();

	/**
	 * Get translation for specific component
	 */
	const t = (key: string, fallback?: string): string => {
		return getNestedTranslation(component, key, fallback);
	};

	/**
	 * Check if component translation exists
	 */
	const hasComponentTranslation = (key: string): boolean => {
		return hasTranslation(`${component}.${key}`);
	};

	return {
		t,
		hasComponentTranslation,
	};
}

/**
 * Hook for form translations
 */
export function useFormTranslation(formName: string) {
	const { getNestedTranslation } = useTranslation();

	/**
	 * Get form field translation
	 */
	const getFieldTranslation = (
		fieldName: string,
		type: "label" | "placeholder" | "error" | "help" = "label",
	): string => {
		return getNestedTranslation(formName, `${fieldName}.${type}`);
	};

	/**
	 * Get form validation message
	 */
	const getValidationMessage = (fieldName: string, rule: string): string => {
		return getNestedTranslation(formName, `validation.${fieldName}.${rule}`);
	};

	/**
	 * Get form success/error messages
	 */
	const getFormMessage = (
		type: "success" | "error",
		action: string,
	): string => {
		return getNestedTranslation(formName, `messages.${type}.${action}`);
	};

	return {
		getFieldTranslation,
		getValidationMessage,
		getFormMessage,
	};
}
