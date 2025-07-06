import React from "react";
import { Box } from "@chakra-ui/react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Box>
			{/* يمكن إضافة قائمة جانبية أو رأس صفحة خاص بلوحة التحكم هنا */}
			{children}
		</Box>
	);
}
