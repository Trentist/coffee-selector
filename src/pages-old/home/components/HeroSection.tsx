/**
 * Hero Section Component
 * مكون القسم الرئيسي
 */

"use client";

import React from "react";
import {
	Box,
	Container,
	Grid,
	GridItem,
	VStack,
	HStack,
	Text,
	Button,
	Image,
	useColorModeValue,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { HERO_CONSTANTS } from "../../../constants/home-constants";

const MotionBox = Box;

interface HeroSectionProps {
	data: {
		title: string;
		subtitle: string;
		description: string;
		image: string;
		ctaText: string;
		ctaLink: string;
	};
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
	const t = useTranslations("home");
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const textColor = useColorModeValue("gray.800", "white");
	const accentColor = useColorModeValue("brand.500", "brand.300");

	return (
		<Box bg={bgColor} py={20} overflow="hidden">
			<Container maxW="container.xl">
				<Grid
					templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
					gap={12}
					alignItems="center">
					{/* Content */}
					<GridItem>
						<VStack align="start" spacing={6}>
							<MotionBox
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}>
								<Text
									fontSize={{ base: "sm", md: "lg" }}
									color={accentColor}
									fontWeight="semibold"
									textTransform="uppercase"
									letterSpacing="wider">
									{data.subtitle}
								</Text>
							</MotionBox>

							<MotionBox
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}>
								<Text
									fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
									fontWeight="bold"
									color={textColor}
									lineHeight="shorter">
									{data.title}
								</Text>
							</MotionBox>

							<MotionBox
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}>
								<Text
									fontSize={{ base: "lg", md: "xl" }}
									color={useColorModeValue("gray.600", "gray.300")}
									lineHeight="tall"
									maxW="lg">
									{data.description}
								</Text>
							</MotionBox>

							<MotionBox
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.6 }}>
								<HStack spacing={4}>
									<Button
										size="lg"
										colorScheme="brand"
										rightIcon={<FiArrowRight />}
										_hover={{ transform: "translateY(-2px)" }}
										transition="all 0.3s">
										{data.ctaText}
									</Button>
									<Button
										size="lg"
										variant="outline"
										leftIcon={<FiArrowLeft />}
										_hover={{ transform: "translateY(-2px)" }}
										transition="all 0.3s">
										{t(HERO_CONSTANTS.BROWSE_PRODUCTS)}
									</Button>
								</HStack>
							</MotionBox>
						</VStack>
					</GridItem>

					{/* Image */}
					<GridItem>
						<MotionBox
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.3 }}>
							<Image
								src={data.image}
								alt="Hero Image"
								borderRadius="xl"
								shadow="2xl"
								_hover={{ transform: "scale(1.05)" }}
								transition="transform 0.3s"
							/>
						</MotionBox>
					</GridItem>
				</Grid>
			</Container>
		</Box>
	);
};

export default HeroSection;
