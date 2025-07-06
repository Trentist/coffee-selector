/**
 * Translation Provider Component
 * مكون مزود الترجمة
 */

"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useMemo } from "react";
// import { useRouter } from "next/navigation";

interface TranslationProviderWrapperProps {
	children: ReactNode;
	locale?: string;
	messages?: string;
}

export const TranslationProviderWrapper = ({
	children,
	locale = "ar",
	messages = "ar",
}: TranslationProviderWrapperProps) => {
	// const router = useRouter();

	// Memoize messages to prevent unnecessary re-renders
	const memoizedMessages = useMemo(() => messages, [messages]);

	return (
		<NextIntlClientProvider
			locale={locale}
			messages={memoizedMessages}
			timeZone="Asia/Dubai">
			{children}
		</NextIntlClientProvider>
	);
};

export default TranslationProviderWrapper;
