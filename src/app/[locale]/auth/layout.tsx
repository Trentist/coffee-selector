import React from "react";
import { Box } from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export default async function AuthLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations("Auth");

	return (
		<Box>
			{/* يمكن إضافة عناصر مشتركة للمصادقة هنا مثل شعار أو تذييل صفحة خاص */}
			{children}
		</Box>
	);
}
