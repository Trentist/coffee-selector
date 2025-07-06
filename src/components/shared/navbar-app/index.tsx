"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
	Box,
	Container,
	Flex,
	Button,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	DrawerCloseButton,
	Stack,
	useDisclosure,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";

// =============== COMPONENTS ===============
import { LogoNav } from "@/components/shared/logo";
import { CustomLink } from "@/components/shared/custom-link";
import { NavbarIcons } from "@/components/shared/navbar-icons";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Lang } from "@/components/shared/lang";
import { CartItemsNavbar } from "@/components/shared/cart-items-navbar";
import { PageCartEmpty } from "@/components/shared/page-cart-empty";
import { WishlistDrawer } from "@/components/shared/wishlist-drawer";
import { TextParagraph } from "@/components/ui/custom-text";

// =============== HOOKS ===============
import { useLocale } from "@/components/ui/useLocale";
import { useNavbar } from "@/hooks/useNavbar";
import { useCurrency } from "@/hooks/useCurrency";
import { useLocation } from "@/hooks/useLocation";

// =============== DATA ===============
import { navData } from "@/constants/navigation";

// =============== TYPES ===============
interface NavbarAppProps {
	isMenuOpen?: boolean;
	onMenuToggle?: () => void;
}

/**
 * =================== MAIN COMPONENT ===================
 * Modern Navbar with enhanced UI/UX
 * شريط تنقل عصري مع تجربة مستخدم محسنة
 */
export const NavbarApp = ({ isMenuOpen, onMenuToggle }: NavbarAppProps) => {
	const { t } = useLocale();
	const router = useRouter();
	const dispatch = useDispatch();
	const { isScrolled, setIsScrolled } = useNavbar();
	const { currency, setCurrency } = useCurrency();
	const { location } = useLocation();
	const { isOpen, onToggle } = useDisclosure();

	// =============== STATE ===============
	const products = useSelector((state: any) => state.cart?.products) || [];

	// =============== DRAWER STATES ===============
	const {
		isOpen: isCartOpen,
		onOpen: onCartOpen,
		onClose: onCartClose,
	} = useDisclosure();
	const {
		isOpen: isWishlistOpen,
		onOpen: onWishlistOpen,
		onClose: onWishlistClose,
	} = useDisclosure();

	const btnRef = useRef(null);

	// =============== THEME COLORS ===============
	const bgColor = useColorModeValue("#fff", "#0D1616");
	const textColor = useColorModeValue("#0D1616", "#fff");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	// =============== COMPUTED VALUES ===============
	const cartTotal = useMemo(() => {
		return products.reduce((total: number, item: any) => {
			return total + item.quantity * item.price;
		}, 0);
	}, [products]);

	// =============== EFFECTS ===============
	const handleScroll = () => {
		const scrolled = window.scrollY > 50;
		setIsScrolled(scrolled);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// =============== RENDER ===============
	return (
		<>
			{/* =================== MAIN NAVBAR =================== */}
			<Box
				position="fixed"
				top="0"
				left="0"
				right="0"
				height="110px"
				zIndex="999999"
				backdropFilter="blur(20px)"
				bg={isScrolled ? `${bgColor}CC` : bgColor}
				color={isScrolled ? `${textColor}` : textColor}
				borderBottom="1px solid"
				borderColor={isScrolled ? borderColor : "transparent"}
				transition="all 0.3s ease"
				boxShadow={isScrolled ? "sm" : "none"}>
				<Container
					maxWidth="1400px"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					px={{ base: 4, md: 6 }}>
					{/* ============= LEFT SECTION: Navigation Links ============= */}
					<Flex
						display={{ base: "none", lg: "flex" }}
						alignItems="center"
						gap={1}>
						{navData.map((item: any) => (
							<Box key={item.id} px={2} py={2}>
								<CustomLink title={t(item.title)} href={item.link} />
							</Box>
						))}
					</Flex>

					{/* ============= CENTER SECTION: Logo ============= */}
					<Link href="/" aria-label={t("navigation.home")}>
						<LogoNav />
					</Link>

					{/* ============= RIGHT SECTION: Actions ============= */}
					<Flex alignItems="center" gap={3}>
						{/* Mobile Menu Button */}
						<Button
							display={{ base: "flex", lg: "none" }}
							variant="ghost"
							size="sm"
							onClick={onMenuToggle}
							aria-label={t("navigation.menu")}>
							{t("navigation.menu")}
						</Button>

						{/* Icon-based Navigation */}
						<NavbarIcons
							onCartOpen={onCartOpen}
							onWishlistOpen={onWishlistOpen}
						/>

						{/* Theme & Language Controls */}
						<Flex alignItems="center" gap={2}>
							<ThemeSwitcher color={textColor} />
							<Lang />
						</Flex>
					</Flex>
				</Container>
			</Box>

			{/* =================== CART DRAWER =================== */}
			<Drawer
				isOpen={isCartOpen}
				placement="right"
				onClose={onCartClose}
				size="lg"
				finalFocusRef={btnRef}>
				<DrawerOverlay backdropFilter="blur(4px)" />
				<DrawerContent bg={bgColor} color={textColor}>
					<DrawerCloseButton />

					{/* Cart Header */}
					<DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
						<Flex alignItems="center" justifyContent="space-between">
							<TextParagraph title={t("cart.shopping_cart")} />
							<TextParagraph title={`(${products.length})`} />
						</Flex>
					</DrawerHeader>

					{/* Cart Body */}
					<DrawerBody>
						{products.length > 0 ? (
							<CartItemsNavbar />
						) : (
							<PageCartEmpty />
						)}
					</DrawerBody>

					{/* Cart Footer */}
					{products.length > 0 && (
						<DrawerFooter borderTopWidth="1px" borderColor={borderColor}>
							<Stack w="100%" spacing={3}>
								<Flex justify="space-between" align="center">
									<TextParagraph title={t("cart.total")} />
									<TextParagraph title={`${cartTotal.toFixed(2)} ر.س`} />
								</Flex>
								<Button
									colorScheme="green"
									onClick={() => {
										router.push("/checkout");
										onCartClose();
									}}>
									{t("cart.checkout")}
								</Button>
							</Stack>
						</DrawerFooter>
					)}
				</DrawerContent>
			</Drawer>

			{/* =================== WISHLIST DRAWER =================== */}
			<WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
		</>
	);
};

export default NavbarApp;