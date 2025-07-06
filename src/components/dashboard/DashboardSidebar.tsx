/**
 * Dashboard Sidebar Component
 * مكون الشريط الجانبي للوحة التحكم المحسن
 */

"use client";

import React from "react";
import {
	Box,
	VStack,
	HStack,
	Avatar,
	Text,
	Divider,
	Icon,
	Tooltip,
	IconButton,
	Badge,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiLogOut, FiChevronRight } from "react-icons/fi";
import { useLocale } from "@/components/ui/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import { User } from "./types/dashboard.types";

const MotionBox = Box;

interface DashboardSidebarProps {
	user: User | null;
	tabs: Array<{
		id: string;
		label: string;
		icon: React.ComponentType<{ size?: number; color?: string }>;
		badge?: string | null;
	}>;
	activeTab: number;
	onTabChange: (index: number) => void;
	isMobile?: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
	user,
	tabs,
	activeTab,
	onTabChange,
	isMobile = false,
}) => {
	const { t } = useLocale();
	const { logout } = useAuth();
	const { bgColor, textColor, borderColor, hoverBg, accentColor } =
		useThemeColors();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<Box
			w={isMobile ? "100%" : "280px"}
			borderRightWidth={isMobile ? "0" : "1px"}
			borderRightColor={borderColor}
			bg={bgColor}
			position={isMobile ? "static" : "fixed"}
			h={isMobile ? "auto" : "100vh"}
			zIndex="1"
			overflowY="auto">
			<VStack align="stretch" p={isMobile ? 4 : 6} spacing={4}>
				{/* User Profile Section */}
				{!isMobile && (
					<MotionBox
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}>
						<HStack spacing={4} p={4} borderRadius="lg" bg={hoverBg}>
							<Avatar
								size="lg"
								name={user?.name || "User"}
								src={user?.avatar}
								bg={textColor}
								color={bgColor}
								border="3px solid"
								borderColor={accentColor}
							/>
							<VStack align="start" spacing={1} flex="1">
								<Text
									fontSize="lg"
									fontWeight="bold"
									color={textColor}
									noOfLines={1}>
									{user?.name || t("dashboard.user_name")}
								</Text>
								<Text
									fontSize="sm"
									color={textColor}
									opacity={0.7}
									noOfLines={1}>
									{user?.email || "user@example.com"}
								</Text>
								<Badge colorScheme="green" variant="subtle" fontSize="xs">
									{t("dashboard.premium_member")}
								</Badge>
							</VStack>
						</HStack>
					</MotionBox>
				)}

				<Divider borderColor={borderColor} />

				{/* Navigation Tabs */}
				<VStack as="nav" spacing={2} align="stretch">
					{tabs.map((tab, index) => (
						<MotionBox
							key={tab.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}>
							<Box
								as="button"
								display="flex"
								alignItems="center"
								justifyContent="space-between"
								p={4}
								borderRadius="lg"
								bg={activeTab === index ? textColor : "transparent"}
								color={activeTab === index ? bgColor : textColor}
								onClick={() => onTabChange(index)}
								_hover={{
									bg: activeTab === index ? textColor : hoverBg,
									transform: "translateX(4px)",
								}}
								transition="all 0.2s ease"
								position="relative">
								{/* Active indicator */}
								{activeTab === index && (
									<Box
										position="absolute"
										left={0}
										top={0}
										bottom={0}
										w="4px"
										bg={accentColor}
										borderRadius="0 2px 2px 0"
									/>
								)}

								<HStack spacing={3} flex="1">
									<Icon as={tab.icon} boxSize={5} />
									<Text fontSize="md" fontWeight="medium">
										{tab.label}
									</Text>
								</HStack>

								<HStack spacing={2}>
									{tab.badge && (
										<Badge
											colorScheme={activeTab === index ? "blue" : "gray"}
											variant="solid"
											borderRadius="full"
											minW="6"
											h="6"
											display="flex"
											alignItems="center"
											justifyContent="center"
											fontSize="xs">
											{tab.badge}
										</Badge>
									)}
									{activeTab === index && (
										<Icon as={FiChevronRight} boxSize={4} />
									)}
								</HStack>
							</Box>
						</MotionBox>
					))}
				</VStack>

				<Divider borderColor={borderColor} />

				{/* Logout Button */}
				<MotionBox
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.6 }}>
					<Tooltip label={t("dashboard.logout")} placement="right">
						<IconButton
							aria-label={t("dashboard.logout")}
							icon={<FiLogOut />}
							variant="ghost"
							size="lg"
							color={textColor}
							onClick={handleLogout}
							_hover={{
								bg: "red.500",
								color: "white",
								transform: "translateX(4px)",
							}}
							w="100%"
							justifyContent="flex-start"
							pl={4}
							borderRadius="lg"
							transition="all 0.2s ease"
						/>
					</Tooltip>
				</MotionBox>
			</VStack>
		</Box>
	);
};

export default DashboardSidebar;
