/**
 * Authentication Image Component
 * مكون الصورة للمصادقة
 */

import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

const MotionBox = Box;

interface AuthImageProps {
	src: string;
	alt: string;
	title?: string;
	subtitle?: string;
	overlay?: boolean;
}

export const AuthImage: React.FC<AuthImageProps> = ({
	src,
	alt,
	title,
	subtitle,
	overlay = true,
}) => {
	const { white, primary } = useThemeColors();

	return (
		<MotionBox
			position="relative"
			w="100%"
			h="100%"
			overflow="hidden"
			initial={{ opacity: 0, scale: 1.1 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.8, ease: "easeOut" }}>
			<Image
				src={src}
				alt={alt}
				w="100%"
				h="100%"
				objectFit="cover"
				objectPosition="center"
			/>

			{overlay && (
				<MotionBox
					position="absolute"
					top="0"
					left="0"
					right="0"
					bottom="0"
					bg={`linear-gradient(135deg, ${primary.overlay} 0%, ${primary.transparent} 100%)`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				/>
			)}

			{(title || subtitle) && (
				<MotionBox
					position="absolute"
					bottom="10%"
					left="10%"
					right="10%"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.5 }}>
					{title && (
						<Text
							fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
							fontWeight="bold"
							color={white.main}
							mb={2}
							textTransform="uppercase"
							letterSpacing="0.02em"
							textShadow="2px 2px 4px rgba(0,0,0,0.5)">
							{title}
						</Text>
					)}

					{subtitle && (
						<Text
							fontSize={{ base: "md", md: "lg" }}
							color={white.light}
							lineHeight="1.6"
							textShadow="1px 1px 2px rgba(0,0,0,0.5)">
							{subtitle}
						</Text>
					)}
				</MotionBox>
			)}
		</MotionBox>
	);
};
