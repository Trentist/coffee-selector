"use client";

import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

interface FavoritesManagerProps {
	children?: React.ReactNode;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({ children }) => {
	return (
		<Box>
			<VStack spacing={4}>
				<Text fontSize="lg" fontWeight="bold">
					إدارة المفضلة
				</Text>
				{children}
			</VStack>
		</Box>
	);
};

export default FavoritesManager;
