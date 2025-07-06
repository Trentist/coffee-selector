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
 * Generate localized path
 */
export function getLocalizedPath(path: string, locale: string): string {
	return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPath(pathname: string): string {
	const segments = pathname.split("/");
	if (segments.length > 1 && locales.includes(segments[1] as any)) {
		return "/" + segments.slice(2).join("/");
	}
	return pathname;
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPath(pathname: string): string {
	const segments = pathname.split("/");
	if (segments.length > 1 && locales.includes(segments[1] as any)) {
		return segments[1];
	}
	return "ar"; // Default locale
}

/**
 * Get localized navigation paths
 */
export const localizedPaths = {
	ar: {
		home: "/ar",
		shop: "/ar/shop",
		about: "/ar/about",
		contact: "/ar/contact",
		login: "/ar/auth/login",
		register: "/ar/auth/register",
		dashboard: "/ar/dashboard",
		cart: "/ar/cart",
		checkout: "/ar/checkout",
		orders: "/ar/dashboard/orders",
		profile: "/ar/dashboard/profile",
		wishlist: "/ar/dashboard/wishlist",
		settings: "/ar/dashboard/settings",
	},
	en: {
		home: "/en",
		shop: "/en/shop",
		about: "/en/about",
		contact: "/en/contact",
		login: "/en/auth/login",
		register: "/en/auth/register",
		dashboard: "/en/dashboard",
		cart: "/en/cart",
		checkout: "/en/checkout",
		orders: "/en/dashboard/orders",
		profile: "/en/dashboard/profile",
		wishlist: "/en/dashboard/wishlist",
		settings: "/en/dashboard/settings",
	},
};
