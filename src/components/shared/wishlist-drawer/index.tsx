"use client";

import React from "react";
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerCloseButton,
	VStack,
	Text,
	Icon,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

interface WishlistDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
	isOpen,
	onClose,
}) => {
	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>المفضلة</DrawerHeader>
				<DrawerBody>
					<VStack spacing={4} py={8}>
						<Icon as={FaHeart} boxSize={12} color="gray.400" />
						<Text color="gray.500" textAlign="center">
							قائمة المفضلة فارغة
						</Text>
						<Text fontSize="sm" color="gray.400" textAlign="center">
							أضف منتجات إلى المفضلة
						</Text>
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default WishlistDrawer;
