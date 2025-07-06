/**
 * Dashboard Container Component
 * مكون حاوية لوحة التحكم الرئيسي
 */

"use client";

import React, { useState } from "react";
import {
	Box,
	Flex,
	VStack,
	HStack,
	Text,
	// Icon,/
	useBreakpointValue,
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	IconButton,
	Avatar,
	// Divider,
	Badge,
	useToast,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import {
	FiMenu,
	FiHome,
	FiShoppingCart,
	FiFileText,
	FiTruck,
	FiUser,
	FiSettings,
	FiHeart,
	FiMapPin,
	// FiLogOut,
	FiBell,
	FiSearch,
} from "react-icons/fi";
import { useLocale } from "@/components/ui/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
// import { useCurrency } from "@/hooks/useCurrency";
import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent";
import { User } from "./types/dashboard.types";

const MotionBox = Box;

interface DashboardContainerProps {
	user: User | null;
	initialSection?: string;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
	user,
	initialSection = "overview",
}) => {
	const { t } = useLocale();
	const { logout } = useAuth();
	const { bgColor, textColor, borderColor } = useThemeColors();
	// const { convertAmount } = useCurrency();
	const toast = useToast();
	const isMobile = useBreakpointValue({ base: true, md: false });
	const { isOpen, onOpen, onClose } = useDisclosure();

	// State
	const [activeSection, setActiveSection] = useState(initialSection);
	const [notifications, setNotifications] = useState(3); // Mock notifications count

	// Navigation tabs
	const navigationTabs = [
		{
			id: "overview",
			label: t("dashboard.overview"),
			icon: FiHome,
			badge: null,
		},
		{
			id: "orders",
			label: t("dashboard.orders"),
			icon: FiShoppingCart,
			badge: "12",
		},
		{
			id: "invoices",
			label: t("dashboard.invoices"),
			icon: FiFileText,
			badge: "5",
		},
		{
			id: "tracking",
			label: t("dashboard.order_tracking"),
			icon: FiTruck,
			badge: "3",
		},
		{
			id: "wishlist",
			label: t("dashboard.wishlist"),
			icon: FiHeart,
			badge: "8",
		},
		{
			id: "addresses",
			label: t("dashboard.addresses"),
			icon: FiMapPin,
			badge: null,
		},
		{
			id: "profile",
			label: t("dashboard.profile"),
			icon: FiUser,
			badge: null,
		},
		{
			id: "settings",
			label: t("dashboard.settings"),
			icon: FiSettings,
			badge: null,
		},
	];

	const handleSectionChange = (sectionId: string) => {
		setActiveSection(sectionId);
		if (isMobile) {
			onClose();
		}
	};

	// const handleLogout = async () => {
	// 	try {
	// 		await logout();
	// 		toast({
	// 			title: t("dashboard.logout_success"),
	// 			status: "success",
	// 			duration: 3000,
	// 			isClosable: true,
	// 		});
	// 	} catch {
	// 		toast({
	// 			title: t("dashboard.logout_error"),
	// 			status: "error",
	// 			duration: 5000,
	// 			isClosable: true,
	// 		});
	// 	}
	// };

	const handleNotificationClick = () => {
		// TODO: Implement notifications
		toast({
			title: t("dashboard.notifications"),
			description: t("dashboard.notifications_coming_soon"),
			status: "info",
			duration: 3000,
			isClosable: true,
		});
	};

	const handleSearchClick = () => {
		// TODO: Implement search
		toast({
			title: t("dashboard.search"),
			description: t("dashboard.search_coming_soon"),
			status: "info",
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<Box minH="100vh" bg={bgColor}>
			{/* Mobile Header */}
			{isMobile && (
				<MotionBox
					initial={{ y: -100 }}
					animate={{ y: 0 }}
					transition={{ duration: 0.3 }}
					as="header"
					bg={bgColor}
					borderBottom="1px"
					borderColor={borderColor}
					p={4}
					position="sticky"
					top={0}
					zIndex={10}>
					<Flex justify="space-between" align="center">
						<HStack spacing={3}>
							<IconButton
								aria-label={t("dashboard.menu")}
								icon={<FiMenu />}
								variant="ghost"
								onClick={onOpen}
								color={textColor}
							/>
							<Text fontSize="lg" fontWeight="bold" color={textColor}>
								{t("dashboard.title")}
							</Text>
						</HStack>
						<HStack spacing={2}>
							<IconButton
								aria-label={t("dashboard.search")}
								icon={<FiSearch />}
								variant="ghost"
								onClick={handleSearchClick}
								color={textColor}
							/>
							<Box position="relative">
								<IconButton
									aria-label={t("dashboard.notifications")}
									icon={<FiBell />}
									variant="ghost"
									onClick={handleNotificationClick}
									color={textColor}
								/>
								{notifications > 0 && (
									<Badge
										position="absolute"
										top="-1"
										right="-1"
										colorScheme="red"
										borderRadius="full"
										minW="5"
										h="5"
										display="flex"
										alignItems="center"
										justifyContent="center"
										fontSize="xs">
										{notifications}
									</Badge>
								)}
							</Box>
						</HStack>
					</Flex>
				</MotionBox>
			)}

			{/* Desktop Layout */}
			{!isMobile && (
				<Flex minH="100vh">
					{/* Sidebar */}
					<DashboardSidebar
						user={user}
						tabs={navigationTabs}
						activeTab={navigationTabs.findIndex(
							(tab) => tab.id === activeSection,
						)}
						onTabChange={(index) =>
							handleSectionChange(navigationTabs[index].id)
						}
						isMobile={false}
					/>

					{/* Main Content */}
					<Box flex="1" ml="280px">
						{/* Desktop Header */}
						<MotionBox
							initial={{ y: -100 }}
							animate={{ y: 0 }}
							transition={{ duration: 0.3 }}
							as="header"
							bg={bgColor}
							borderBottom="1px"
							borderColor={borderColor}
							p={6}
							position="sticky"
							top={0}
							zIndex={10}>
							<Flex justify="space-between" align="center">
								<HStack spacing={4}>
									<Text fontSize="2xl" fontWeight="bold" color={textColor}>
										{t(`dashboard.${activeSection}`)}
									</Text>
									<Badge colorScheme="blue" variant="subtle">
										{t(`dashboard.${activeSection}_description`)}
									</Badge>
								</HStack>
								<HStack spacing={4}>
									<IconButton
										aria-label={t("dashboard.search")}
										icon={<FiSearch />}
										variant="ghost"
										onClick={handleSearchClick}
										color={textColor}
									/>
									<Box position="relative">
										<IconButton
											aria-label={t("dashboard.notifications")}
											icon={<FiBell />}
											variant="ghost"
											onClick={handleNotificationClick}
											color={textColor}
										/>
										{notifications > 0 && (
											<Badge
												position="absolute"
												top="-1"
												right="-1"
												colorScheme="red"
												borderRadius="full"
												minW="5"
												h="5"
												display="flex"
												alignItems="center"
												justifyContent="center"
												fontSize="xs">
												{notifications}
											</Badge>
										)}
									</Box>
									<HStack spacing={3}>
										<Avatar
											size="sm"
											name={user?.name || "User"}
											src={user?.avatar}
											bg={textColor}
											color={bgColor}
										/>
										<VStack align="start" spacing={0}>
											<Text
												fontSize="sm"
												fontWeight="semibold"
												color={textColor}>
												{user?.name || t("dashboard.user_name")}
											</Text>
											<Text fontSize="xs" color={textColor} opacity={0.7}>
												{user?.email || "user@example.com"}
											</Text>
										</VStack>
									</HStack>
								</HStack>
							</Flex>
						</MotionBox>

						{/* Content Area */}
						<Box p={6}>
							<DashboardContent activeSection={activeSection} user={user} />
						</Box>
					</Box>
				</Flex>
			)}

			{/* Mobile Drawer */}
			<Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
				<DrawerOverlay />
				<DrawerContent bg={bgColor}>
					<DrawerCloseButton color={textColor} />
					<DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
						<HStack spacing={3}>
							<Avatar
								size="md"
								name={user?.name || "User"}
								src={user?.avatar}
								bg={textColor}
								color={bgColor}
							/>
							<VStack align="start" spacing={0}>
								<Text fontSize="lg" fontWeight="semibold" color={textColor}>
									{user?.name || t("dashboard.user_name")}
								</Text>
								<Text fontSize="sm" color={textColor} opacity={0.7}>
									{user?.email || "user@example.com"}
								</Text>
							</VStack>
						</HStack>
					</DrawerHeader>
					<DrawerBody p={0}>
						<DashboardSidebar
							user={user}
							tabs={navigationTabs}
							activeTab={navigationTabs.findIndex(
								(tab) => tab.id === activeSection,
							)}
							onTabChange={(index) =>
								handleSectionChange(navigationTabs[index].id)
							}
							isMobile={true}
						/>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Box>
	);
};

export default DashboardContainer;
