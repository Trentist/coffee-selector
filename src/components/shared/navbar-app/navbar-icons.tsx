"use client";

import {
	Badge,
	IconButton,
	Flex,
	useColorModeValue,
	Tooltip,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiHeart, FiUser, FiUserCheck } from "react-icons/fi";
import { useLocale } from "@/components/ui/useLocale";
import { CartState } from "@/types/product";
// // import { motion } from "framer-motion";

const MotionIconButton = IconButton;

interface NavbarIconsProps {
	onCartOpen: () => void;
	onWishlistOpen?: () => void;
}

export const NavbarIcons = ({
	onCartOpen,
	onWishlistOpen,
}: NavbarIconsProps) => {
	const { t } = useLocale();
	const router = useRouter();
	const { data: session, status } = useSession();

	// Redux state
	const cartProducts = useSelector(
		(state: { cart: CartState }) => state.cart.products,
	);
	const favorites = useSelector((state: any) => state.favorites?.items || []);

	// Theme colors
	const iconColor = useColorModeValue("#0D1616", "#fff");
	const badgeColorScheme = useColorModeValue("red", "red");
	const hoverBg = useColorModeValue("gray.100", "gray.700");

	// Animation variants
	const iconVariants = {
		hover: {
			scale: 1.1,
			transition: { type: "spring" as const, stiffness: 400, damping: 17 },
		},
		tap: {
			scale: 0.95,
			transition: { type: "spring" as const, stiffness: 400, damping: 17 },
		},
	};

	const badgeVariants = {
		initial: { scale: 0 },
		animate: {
			scale: 1,
			transition: { type: "spring" as const, stiffness: 500, damping: 25 },
		},
		exit: {
			scale: 0,
			transition: { duration: 0.2 },
		},
	};

	const handleAuthClick = () => {
		if (status === "authenticated") {
			router.push("/dashboard");
		} else {
			router.push("/auth");
		}
	};

	const handleWishlistClick = () => {
		if (onWishlistOpen) {
			onWishlistOpen();
		} else {
			// Navigate to favorites page if no modal handler provided
			router.push("/store/favorites");
		}
	};

	return (
		<Flex alignItems="center" gap={2}>
			{/* Cart Icon with Count */}
			<Tooltip label={t("cart.shopping_cart")} placement="bottom" hasArrow>
				<MotionIconButton
					variant="ghost"
					aria-label={t("aria_labels.shopping_cart")}
					icon={
						<Flex position="relative">
							<FiShoppingCart size="20px" />
							{cartProducts.length > 0 && (
								<motion.div
									variants={badgeVariants}
									initial="initial"
									animate="animate"
									exit="exit">
									<Badge
										colorScheme={badgeColorScheme}
										borderRadius="0"
										fontSize="xs"
										position="absolute"
										top="-8px"
										right="-8px"
										minW="18px"
										h="18px"
										display="flex"
										alignItems="center"
										justifyContent="center">
										{cartProducts.length > 99 ? "99+" : cartProducts.length}
									</Badge>
								</motion.div>
							)}
						</Flex>
					}
					color={iconColor}
					fontSize="20px"
					_hover={{ bg: hoverBg }}
					onClick={onCartOpen}
					variants={iconVariants}
					whileHover="hover"
					whileTap="tap"
				/>
			</Tooltip>

			{/* Wishlist Icon with Count */}
			<Tooltip label={t("common.favorites")} placement="bottom" hasArrow>
				<MotionIconButton
					variant="ghost"
					aria-label={t("aria_labels.favorites")}
					icon={
						<Flex position="relative">
							<FiHeart size="20px" />
							{favorites.length > 0 && (
								<motion.div
									variants={badgeVariants}
									initial="initial"
									animate="animate"
									exit="exit">
									<Badge
										colorScheme={badgeColorScheme}
										borderRadius="0"
										fontSize="xs"
										position="absolute"
										top="-8px"
										right="-8px"
										minW="18px"
										h="18px"
										display="flex"
										alignItems="center"
										justifyContent="center">
										{favorites.length > 99 ? "99+" : favorites.length}
									</Badge>
								</motion.div>
							)}
						</Flex>
					}
					color={iconColor}
					fontSize="20px"
					_hover={{ bg: hoverBg }}
					onClick={handleWishlistClick}
					variants={iconVariants}
					whileHover="hover"
					whileTap="tap"
				/>
			</Tooltip>

			{/* User/Auth Icon */}
			<Tooltip
				label={
					status === "authenticated"
						? session?.user?.name || t("common.profile")
						: t("auth.login")
				}
				placement="bottom"
				hasArrow>
				<MotionIconButton
					variant="ghost"
					aria-label={t("aria_labels.user_account")}
					icon={
						status === "authenticated" ? (
							<FiUserCheck size="20px" />
						) : (
							<FiUser size="20px" />
						)
					}
					color={iconColor}
					fontSize="20px"
					_hover={{ bg: hoverBg }}
					onClick={handleAuthClick}
					variants={iconVariants}
					whileHover="hover"
					whileTap="tap"
				/>
			</Tooltip>
		</Flex>
	);
};
