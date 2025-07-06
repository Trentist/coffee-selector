/**
 * Authentication Divider Component
 * مكون الفاصل للمصادقة
 */

import React from "react";
import { HStack, Divider, Text } from "@chakra-ui/react";
// // import { motion } from "framer-motion";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

const MotionHStack = HStack;

interface AuthDividerProps {
	text?: string;
	textColor?: string;
	borderColor?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({
	text = "أو",
	textColor,
	borderColor,
}) => {
	const { borderColor: defaultBorderColor, mutedColor } = useThemeColors();

	return (
		<MotionHStack
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3, ease: "easeOut" }}>
			<Divider
				borderColor={borderColor || defaultBorderColor}
				borderWidth="0.5px"
			/>
			<Text
				fontSize="sm"
				color={textColor || mutedColor}
				fontWeight="medium"
				px={4}>
				{text}
			</Text>
			<Divider
				borderColor={borderColor || defaultBorderColor}
				borderWidth="0.5px"
			/>
		</MotionHStack>
	);
};
