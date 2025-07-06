/**
 * Home Page Component
 * مكون الصفحة الرئيسية
 */

import React from "react";
import { Box, Container, VStack, Text, Spinner } from "@chakra-ui/react";
import HeroSection from "./components/HeroSection";
import FeaturedProducts from "./components/FeaturedProducts";
import StatsSection from "./components/StatsSection";
import { HomePageProps } from "./types/HomePage.types";

const HomePage: React.FC<HomePageProps> = ({
	data,
	loading = false,
	error,
}) => {
	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="50vh">
				<VStack spacing={4}>
					<Spinner size="xl" color="brand.500" />
					<Text>جاري تحميل الصفحة الرئيسية...</Text>
				</VStack>
			</Box>
		);
	}

	if (error) {
		return (
			<Container maxW="container.xl" py={20}>
				<VStack spacing={4} textAlign="center">
					<Text fontSize="xl" color="red.500">
						حدث خطأ في تحميل الصفحة
					</Text>
					<Text color="gray.600">{error}</Text>
				</VStack>
			</Container>
		);
	}

	if (!data) {
		return (
			<Container maxW="container.xl" py={20}>
				<VStack spacing={4} textAlign="center">
					<Text fontSize="xl" color="gray.500">
						لا توجد بيانات متاحة
					</Text>
				</VStack>
			</Container>
		);
	}

	return (
		<Box>
			{/* Hero Section */}
			<HeroSection data={data.hero} />

			{/* Featured Products */}
			<FeaturedProducts products={data.featuredProducts} />

			{/* Stats Section */}
			<StatsSection stats={data.stats} />
		</Box>
	);
};

export default HomePage;
