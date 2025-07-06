/**
 * Stats Section Component
 * مكون قسم الإحصائيات
 */
"use client";
import React from "react";
import {
	Box,
	Container,
	SimpleGrid,
	VStack,
	Text,
	Icon,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiUsers, FiPackage, FiGlobe, FiAward } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { STATS_CONSTANTS } from "../../../constants/home-constants";

interface StatItem {
	icon: React.ElementType;
	value: number;
	label: string;
	suffix?: string;
}

interface StatsSectionProps {
	stats: {
		customers: number;
		products: number;
		countries: number;
		years: number;
	};
}

const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => {
	const bgColor = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.800", "white");
	const accentColor = useColorModeValue("brand.500", "brand.300");

	return (
		<Box
			bg={bgColor}
			p={8}
			borderRadius="lg"
			textAlign="center"
			border="1px"
			borderColor={useColorModeValue("gray.200", "gray.600")}
			_hover={{ transform: "translateY(-4px)", shadow: "lg" }}
			transition="all 0.3s">
			<VStack spacing={4}>
				<Icon as={stat.icon} boxSize={12} color={accentColor} />
				<Text
					fontSize={{ base: "3xl", md: "4xl" }}
					fontWeight="bold"
					color={textColor}>
					{stat.value.toLocaleString()}
					{stat.suffix && <span>{stat.suffix}</span>}
				</Text>
				<Text
					fontSize="lg"
					color={useColorModeValue("gray.600", "gray.300")}
					fontWeight="medium">
					{stat.label}
				</Text>
			</VStack>
		</Box>
	);
};

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
	const t = useTranslations("home");
	const bgColor = useColorModeValue("gray.50", "gray.900");

	const statItems: StatItem[] = [
		{
			icon: FiUsers,
			value: stats.customers,
			label: t(STATS_CONSTANTS.SATISFIED_CUSTOMERS),
			suffix: "+",
		},
		{
			icon: FiPackage,
			value: stats.products,
			label: t(STATS_CONSTANTS.DIVERSE_PRODUCTS),
			suffix: "+",
		},
		{
			icon: FiGlobe,
			value: stats.countries,
			label: t(STATS_CONSTANTS.SERVED_COUNTRIES),
		},
		{
			icon: FiAward,
			value: stats.years,
			label: t(STATS_CONSTANTS.YEARS_EXPERIENCE),
			suffix: "+",
		},
	];

	return (
		<Box bg={bgColor} py={16}>
			<Container maxW="container.xl">
				<SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
					{statItems.map((stat, index) => (
						<StatCard key={index} stat={stat} />
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default StatsSection;
