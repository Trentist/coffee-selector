"use client";

import React from "react";
import { Box, Container, VStack, Heading, Text } from "@chakra-ui/react";

interface SettingsPageProps {
	data?: any;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ data }) => {
	if (!data) {
		return null;
	}

	return (
		<Container maxW="6xl" py={8}>
			<VStack spacing={6} align="stretch">
				<Heading as="h1" size="xl">
					الإعدادات
				</Heading>
				<Text>صفحة الإعدادات</Text>
			</VStack>
		</Container>
	);
};

export default SettingsPage;
