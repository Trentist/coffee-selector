/**
 * Authentication Header Component
 * مكون رأس صفحة المصادقة
 */

import React from "react";
import { VStack, Text, Image } from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

const MotionVStack = VStack;

interface AuthHeaderProps {
	title: string;
	subtitle?: string;
	logo?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
	title,
	subtitle,
	logo,
}) => {
	const { textColor, mutedColor } = useThemeColors();

	return (
		<MotionVStack
			spacing={3}
			align="center"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}>
			{logo && (
				<MotionVStack
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					<Image src={logo} alt="Logo" h="60px" w="auto" objectFit="contain" />
				</MotionVStack>
			)}

			<MotionVStack
				spacing={2}
				textAlign="center"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}>
				<Text
					fontSize={{ base: "2xl", md: "3xl" }}
					fontWeight="bold"
					color={textColor}
					textTransform="uppercase"
					letterSpacing="0.02em">
					{title}
				</Text>

				{subtitle && (
					<Text
						fontSize={{ base: "sm", md: "md" }}
						color={mutedColor}
						maxW="400px"
						lineHeight="1.6">
						{subtitle}
					</Text>
				)}
			</MotionVStack>
		</MotionVStack>
	);
};
