/**
 * Authentication Layout Component
 * مكون التخطيط الرئيسي للمصادقة
 */

import React from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
// // import { motion } from "framer-motion";
import { AuthHeader } from "./ui/AuthHeader";
import { AuthImage } from "./ui/AuthImage";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import type { AuthLayoutProps } from "./types";

const MotionBox = Box;

export const AuthLayout: React.FC<AuthLayoutProps> = ({
	children,
	title = "Coffee Selection",
	subtitle = "اكتشف عالم القهوة المميز",
	image = "/assets/images/auth-bg.jpg",
}) => {
	const { bgColor } = useThemeColors();

	return (
		<Box minH="100vh" bg={bgColor}>
			<Grid
				templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
				minH="100vh"
			>
				{/* Image Section */}
				<GridItem
					display={{ base: "none", lg: "block" }}
					position="relative"
					overflow="hidden"
				>
					<MotionBox
						initial={{ opacity: 0, scale: 1.1 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, ease: "easeOut" }}
						h="100%"
					>
						<AuthImage
							src={image}
							alt="Coffee Selection"
							title={title}
							subtitle={subtitle}
						/>
					</MotionBox>
				</GridItem>

				{/* Form Section */}
				<GridItem
					display="flex"
					alignItems="center"
					justifyContent="center"
					p={{ base: 4, md: 8, lg: 12 }}
				>
					<MotionBox
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						w="100%"
						maxW="500px"
					>
						{/* Header for mobile */}
						<Box display={{ base: "block", lg: "none" }} mb={8}>
							<AuthHeader
								title={title}
								subtitle={subtitle}
							/>
						</Box>

						{/* Form Content */}
						{children}
					</MotionBox>
				</GridItem>
			</Grid>
		</Box>
	);
};