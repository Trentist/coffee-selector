"use client";

import React from "react";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

interface LoadingProps {
	text?: string;
	size?: string;
}

export const Loading: React.FC<LoadingProps> = ({
	text = "جاري التحميل...",
	size = "xl"
}) => {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minH="200px"
		>
			<VStack spacing={4}>
				<Spinner size={size} color="brand.500" />
				<Text color="gray.600">{text}</Text>
			</VStack>
		</Box>
	);
};

export default Loading;