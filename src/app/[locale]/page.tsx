"use client";

import React from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

// الصفحة الرئيسية
export default function HomePage() {
	return (
		<Box as="main" minH="100vh" bg="gray.50" py={8}>
			<Container maxW="6xl" mx="auto">
				<VStack spacing={8} textAlign="center">
					<Heading as="h1" size="2xl" color="gray.800">
						مرحباً بك في متجر القهوة
					</Heading>
					<Text fontSize="lg" color="gray.600" maxW="2xl">
						اكتشف مجموعة متنوعة من أجود أنواع القهوة من جميع أنحاء العالم
					</Text>
				</VStack>
			</Container>
		</Box>
	);
}
