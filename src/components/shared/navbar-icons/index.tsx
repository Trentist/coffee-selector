"use client";

import React from "react";
import { HStack, IconButton, Badge, Box } from "@chakra-ui/react";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";

interface NavbarIconsProps {
	onCartOpen: () => void;
	onWishlistOpen: () => void;
}

export const NavbarIcons: React.FC<NavbarIconsProps> = ({
	onCartOpen,
	onWishlistOpen,
}) => {
	return (
		<HStack spacing={2}>
			<Box position="relative">
				<IconButton
					aria-label="السلة"
					icon={<FaShoppingCart />}
					variant="ghost"
					size="sm"
					onClick={onCartOpen}
				/>
				<Badge
					colorScheme="red"
					variant="solid"
					size="sm"
					position="absolute"
					top="-1"
					right="-1"
					borderRadius="full">
					3
				</Badge>
			</Box>
			<Box position="relative">
				<IconButton
					aria-label="المفضلة"
					icon={<FaHeart />}
					variant="ghost"
					size="sm"
					onClick={onWishlistOpen}
				/>
				<Badge
					colorScheme="pink"
					variant="solid"
					size="sm"
					position="absolute"
					top="-1"
					right="-1"
					borderRadius="full">
					5
				</Badge>
			</Box>
			<IconButton
				aria-label="الحساب"
				icon={<FaUser />}
				variant="ghost"
				size="sm"
			/>
		</HStack>
	);
};

export default NavbarIcons;
