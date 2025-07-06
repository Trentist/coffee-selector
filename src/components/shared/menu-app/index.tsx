/**
 * Enhanced Menu Component
 * مكون القوائم المحسن
 */

"use client";

import {
	Box,
	VStack,
	HStack,
	Text,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";
import { useMenu } from "@/components/providers";
import { useNavbar } from "@/components/providers";
import { NavbarIcons } from "../navbar-app/navbar-icons";

interface MenuAppProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export const MenuApp = ({ isOpen, onClose }: MenuAppProps) => {
	const { isMainMenuOpen, setIsMainMenuOpen } = useMenu();
	const { activeSection, setActiveSection } = useNavbar();
	const { isOpen: isMenuOpen, onToggle } = useDisclosure();

	const menuItems = [
		{ id: "home", label: "الرئيسية", href: "/" },
		{ id: "products", label: "المنتجات", href: "/products" },
		{ id: "cart", label: "السلة", href: "/cart" },
		{ id: "favorites", label: "المفضلة", href: "/favorites" },
		{ id: "account", label: "حسابي", href: "/account" },
	];

	const handleMenuItemClick = (itemId: string) => {
		setActiveSection(itemId);
		setIsMainMenuOpen(false);
		if (onClose) onClose();
	};

	if (!isOpen && !isMenuOpen) return null;

	return (
		<Box
			position="fixed"
			top={0}
			left={0}
			right={0}
			bottom={0}
			bg="rgba(0, 0, 0, 0.5)"
			zIndex={2000}
			onClick={onClose}>
			<Box
				position="absolute"
				top={0}
				right={0}
				w="300px"
				h="100vh"
				bg="white"
				boxShadow="lg"
				p={6}
				onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<HStack justify="space-between" mb={6}>
					<Text fontSize="lg" fontWeight="bold" color="brand.600">
						القائمة
					</Text>
					<IconButton
						aria-label="Close menu"
						icon={<NavbarIcons.Close />}
						variant="ghost"
						size="sm"
						onClick={onClose}
					/>
				</HStack>

				{/* Menu Items */}
				<VStack align="stretch" spacing={2}>
					{menuItems.map((item) => (
						<Box
							key={item.id}
							as="button"
							w="100%"
							textAlign="right"
							p={3}
							borderRadius="md"
							bg={activeSection === item.id ? "brand.50" : "transparent"}
							color={activeSection === item.id ? "brand.600" : "gray.700"}
							_hover={{
								bg: "brand.50",
								color: "brand.600",
							}}
							onClick={() => handleMenuItemClick(item.id)}>
							<Text fontWeight="medium">{item.label}</Text>
						</Box>
					))}
				</VStack>
			</Box>
		</Box>
	);
};

export default MenuApp;
