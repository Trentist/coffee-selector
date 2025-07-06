"use client";

import React from "react";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";

export const PrivacyDataSection: React.FC = () => {
	return (
		<Box>
			<Heading as="h3" size="md" mb={4}>
				الخصوصية والبيانات
			</Heading>
			<Text>قسم الخصوصية والبيانات</Text>
		</Box>
	);
};

export default PrivacyDataSection;
