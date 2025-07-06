"use client";

import React from "react";
import { VStack, Text, Icon } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

export const PageCartEmpty: React.FC = () => {
	return (
		<VStack spacing={4} py={8}>
			<Icon as={FaShoppingCart} boxSize={12} color="gray.400" />
			<Text color="gray.500" textAlign="center">
				السلة فارغة
			</Text>
			<Text fontSize="sm" color="gray.400" textAlign="center">
				أضف منتجات إلى سلة التسوق
			</Text>
		</VStack>
	);
};

export default PageCartEmpty;
