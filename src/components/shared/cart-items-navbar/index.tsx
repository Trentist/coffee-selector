"use client";

import React from "react";
import { VStack, HStack, Text, Image, IconButton } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

export const CartItemsNavbar: React.FC = () => {
	return (
		<VStack spacing={4} align="stretch">
			<HStack spacing={3}>
				<Image
					src="/assets/images/products/coffee-1.jpg"
					alt="منتج"
					w="50px"
					h="50px"
					borderRadius="md"
					objectFit="cover"
				/>
				<VStack align="start" flex={1} spacing={1}>
					<Text fontSize="sm" fontWeight="medium">
						قهوة عربية مميزة
					</Text>
					<Text fontSize="xs" color="gray.500">
						45 ر.س × 2
					</Text>
				</VStack>
				<IconButton
					aria-label="حذف"
					icon={<FaTrash />}
					size="sm"
					variant="ghost"
					colorScheme="red"
				/>
			</HStack>
		</VStack>
	);
};

export default CartItemsNavbar;
