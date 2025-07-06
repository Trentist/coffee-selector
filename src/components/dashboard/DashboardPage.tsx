"use client";

import React from "react";
import { Box, Container, VStack, Heading, Text } from "@chakra-ui/react";

interface DashboardPageProps {
	data?: any;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ data }) => {
	if (!data) {
		return null;
	}

	return (
		<Container maxW="6xl" py={8}>
			<VStack spacing={6} align="stretch">
				<Heading as="h1" size="xl">
					لوحة التحكم
				</Heading>
				<Text>مرحباً بك في لوحة التحكم</Text>
			</VStack>
		</Container>
	);
};

export default DashboardPage;
