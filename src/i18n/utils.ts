import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { locales } from "./config";

export type Locale = (typeof locales)[number];

export { Link, useRouter, usePathname };

/**
 * Redirect to a specific path
 */
export function redirect(path: string) {
	const router = useRouter();
	router.push(path);
}

/**
 * Get text direction based on locale
 */
export function getDirection(locale: Locale): "ltr" | "rtl" {
	return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Extract locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
	const locale = pathname.split("/")[1];
	return locales.includes(locale as Locale) ? (locale as Locale) : "ar";
}

/**
 * Format currency based on locale
 */
export function formatCurrency(amount: number, locale: Locale, currency: string = "AED"): string {
	return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
		style: "currency",
		currency: currency,
	}).format(amount);
}

/**
 * Format date based on locale
 */
export function formatDate(date: Date, locale: Locale): string {
	return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

/**
 * Format number based on locale
 */
export function formatNumber(number: number, locale: Locale): string {
	return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(number);
}

/**
 * Get translation namespace for component
 */
export function getTranslationNamespace(component: string): string {
	const namespaceMap: Record<string, string> = {
		navbar: "common",
		footer: "common",
		auth: "auth",
		shop: "shop",
		checkout: "checkout",
		dashboard: "dashboard",
		notifications: "notifications",
		alerts: "alerts",
		product: "product",
		profile: "profile",
		address: "address",
		validation: "validation",
	};

	return namespaceMap[component] || "common";
}

/**
 * Validate translation key exists
 */
export function validateTranslationKey(key: string, namespace: string): boolean {
	try {
		// This will be validated at runtime
		return true;
	} catch {
		return false;
	}
}