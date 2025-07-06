import { notFound } from "next/navigation";
import { inter } from "../fonts";
import { ReactNode } from "react";

import { locales } from "@/i18n/config";
import { getMessages } from "next-intl/server";
import { AppProviderWrapper } from "@/components";

type Props = {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	// التحقق من صحة اللغة
	if (!locales.includes(locale as "ar" | "en")) {
		notFound();
	}

	// تحميل الرسائل
	const messages = await getMessages({ locale });

	return (
		<html
			className={inter.className}
			lang={locale}
			dir={locale === "ar" ? "rtl" : "ltr"}
			suppressHydrationWarning>
			<body>
				<AppProviderWrapper locale={locale} messages={messages}>
					{children}
				</AppProviderWrapper>
			</body>
		</html>
	);
}
