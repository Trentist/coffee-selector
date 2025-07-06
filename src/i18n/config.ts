import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Supported languages
export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

// Default configuration
export default getRequestConfig(async ({ locale }) => {
	// Validate locale
	if (!locale || !locales.includes(locale as any)) notFound();

	// Load translation JSON files
	const messages = {
		common: (await import(`../../messages/${locale}/common.json`)).default,
		auth: (await import(`../../messages/${locale}/auth.json`)).default,
		shop: (await import(`../../messages/${locale}/shop.json`)).default,
		checkout: (await import(`../../messages/${locale}/checkout.json`)).default,
		home: (await import(`../../messages/${locale}/home.json`)).default,
		dashboard: (await import(`../../messages/${locale}/dashboard.json`))
			.default,
		notifications: (await import(`../../messages/${locale}/notifications.json`))
			.default,
		alerts: (await import(`../../messages/${locale}/alerts.json`)).default,
		currencies: (await import(`../../messages/${locale}/currencies.json`))
			.default,
		address: (await import(`../../messages/${locale}/address.json`)).default,
		validation: (await import(`../../messages/${locale}/validation.json`))
			.default,
		product_share: (await import(`../../messages/${locale}/product_share.json`))
			.default,
		odoo: (await import(`../../messages/${locale}/odoo.json`)).default,
		product: (await import(`../../messages/${locale}/product.json`)).default,
		filter_translations: (
			await import(`../../messages/${locale}/filter-translations.json`)
		).default,
		jobs: (await import(`../../messages/${locale}/jobs.json`)).default,
		password: (await import(`../../messages/${locale}/password.json`)).default,
		profile: (await import(`../../messages/${locale}/profile.json`)).default,
	};

	return {
		locale,
		messages,
		timeZone: "Asia/Dubai",
		now: new Date(),
	};
});
