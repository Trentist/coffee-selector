"use client";

import React from "react";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";

export const GeneralPreferencesSection: React.FC = () => {
	return (
		<Box>
			<Heading as="h3" size="md" mb={4}>
				التفضيلات العامة
			</Heading>
			<Text>قسم التفضيلات العامة</Text>
		</Box>
	);
};

export default GeneralPreferencesSection;
