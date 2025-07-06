import React from "react";
import { locales } from "./config";

// Simple navigation helpers
export const Link = ({ href, children, ...props }: any) => {
	return React.createElement("a", { href, ...props }, children);
};

export const redirect = (url: string) => {
	// This will be handled by the middleware
	return url;
};

// Placeholder functions for server-side compatibility
export const usePathname = () => "/";
export const useRouter = () => ({
	push: (url: string) => console.log("Navigate to:", url),
	replace: (url: string) => console.log("Replace with:", url),
	back: () => console.log("Go back"),
	forward: () => console.log("Go forward"),
});

/**
 * Navigation configuration for different locales
 */
export const navigationConfig = {
	ar: {
		home: "/",
		shop: "/shop",
		about: "/about",
		contact: "/contact",
		login: "/auth/login",
		register: "/auth/register",
		dashboard: "/dashboard",
		cart: "/cart",
		checkout: "/checkout",
		orders: "/dashboard/orders",
		profile: "/dashboard/profile",
		wishlist: "/dashboard/wishlist",
		settings: "/dashboard/settings",
		invoices: "/dashboard/invoices",
		orderTracking: "/dashboard/order-tracking",
	},
	en: {
		home: "/",
		shop: "/shop",
		about: "/about",
		contact: "/contact",
		login: "/auth/login",
		register: "/auth/register",
		dashboard: "/dashboard",
		cart: "/cart",
		checkout: "/checkout",
		orders: "/dashboard/orders",
		profile: "/dashboard/profile",
		wishlist: "/dashboard/wishlist",
		settings: "/dashboard/settings",
		invoices: "/dashboard/invoices",
		orderTracking: "/dashboard/order-tracking",
	},
};

/**
 * Get navigation path for specific locale
 */
export function getNavigationPath(
	path: keyof typeof navigationConfig.ar,
	locale: string,
): string {
	const config =
		navigationConfig[locale as keyof typeof navigationConfig] ||
		navigationConfig.ar;
	return `/${locale}${config[path]}`;
}

/**
 * Get all navigation paths for a locale
 */
export function getNavigationPaths(locale: string) {
	return (
		navigationConfig[locale as keyof typeof navigationConfig] ||
		navigationConfig.ar
	);
}

/**
 * Get breadcrumb navigation
 */
export function getBreadcrumbNavigation(pathname: string, locale: string) {
	const segments = pathname.split("/").filter(Boolean);
	const breadcrumbs = [];

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const path = "/" + segments.slice(0, i + 1).join("/");
		breadcrumbs.push({
			label: segment,
			path: path,
			isActive: i === segments.length - 1,
		});
	}

	return breadcrumbs;
}
