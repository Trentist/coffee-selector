/**
 * Dashboard Layout Component
 * مكون تخطيط لوحة التحكم
 */

import React from "react";
import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
	children,
}) => {
	const { bgColor } = useThemeColors();
	const isMobile = useBreakpointValue({ base: true, md: false });

	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			minH="100vh"
			bg={bgColor}
			position="relative">
			{children}
		</Flex>
	);
};
