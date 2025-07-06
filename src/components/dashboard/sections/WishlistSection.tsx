"use client";

/**
 * Wishlist Section Component
 * مكون قسم المفضلة
 */

import React, { useState, useEffect } from "react";
import {
	Box,
	VStack,
	Heading,
	Text,
	Flex,
	Spinner,
	Grid,
} from "@chakra-ui/react";
import { useLocale } from "@/components/ui/useLocale";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import DashboardCard from "../components/DashboardCard";
import { WishlistItem } from "../types/dashboard.types";

const WishlistSection: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary } = useThemeColors();
	const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadWishlist();
	}, []);

	const loadWishlist = async () => {
		try {
			setIsLoading(true);

			// TODO: Replace with actual API call
			const mockWishlist: WishlistItem[] = [
				{
					id: "1",
					productId: "prod-1",
					productName: "Premium Coffee Beans",
					price: 75.0,
					currency: "AED",
					image: "/images/coffee-beans.jpg",
					addedAt: new Date().toISOString(),
				},
				{
					id: "2",
					productId: "prod-2",
					productName: "Coffee Maker Pro",
					price: 200.0,
					currency: "AED",
					image: "/images/coffee-maker.jpg",
					addedAt: new Date(Date.now() - 86400000).toISOString(),
				},
			];

			setWishlistItems(mockWishlist);
		} catch (error) {
			console.error("Failed to load wishlist:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveItem = (itemId: string) => {
		setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
	};

	if (isLoading) {
		return (
			<Flex justify="center" align="center" minH="400px">
				<VStack spacing={4}>
					<Spinner size="xl" color="blue.500" />
					<Text color={textSecondary}>{t("dashboard.loading_wishlist")}</Text>
				</VStack>
			</Flex>
		);
	}

	return (
		<Box w="100%" p={6}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box>
					<Heading size="lg" color={textPrimary} mb={2}>
						{t("dashboard.wishlist")}
					</Heading>
					<Text color={textSecondary}>
						{t("dashboard.wishlist_description")}
					</Text>
				</Box>

				{/* Wishlist Items */}
				<DashboardCard title={t("dashboard.saved_items")}>
					{wishlistItems.length === 0 ? (
						<VStack spacing={4} py={8}>
							<Text fontSize="sm" color={textSecondary}>
								{t("dashboard.no_wishlist_items")}
							</Text>
						</VStack>
					) : (
						<Grid
							templateColumns={{
								base: "1fr",
								md: "repeat(2, 1fr)",
								lg: "repeat(3, 1fr)",
							}}
							gap={4}>
							{wishlistItems.map((item) => (
								<Box
									key={item.id}
									p={4}
									border="1px"
									borderColor="gray.200"
									borderRadius="md">
									<Text fontWeight="bold" color={textPrimary} mb={2}>
										{item.productName}
									</Text>
									<Text fontSize="sm" color={textSecondary} mb={2}>
										{item.price} {item.currency}
									</Text>
									<Text fontSize="xs" color={textSecondary}>
										Added: {new Date(item.addedAt).toLocaleDateString()}
									</Text>
								</Box>
							))}
						</Grid>
					)}
				</DashboardCard>
			</VStack>
		</Box>
	);
};

export default WishlistSection;
