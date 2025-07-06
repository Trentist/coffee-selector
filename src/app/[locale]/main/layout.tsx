import React from "react";
import { Box } from "@chakra-ui/react";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Box>
			{/* يمكن إضافة عناصر مشتركة للصفحات الرئيسية هنا */}
			{children}
		</Box>
	);
}
