/**
 * Authentication Footer Component
 * مكون تذييل صفحة المصادقة
 */

import React from "react";
import { VStack, Text, Link, HStack } from "@chakra-ui/react";
// // import { motion } from "framer-motion";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

const MotionVStack = VStack;

interface AuthFooterProps {
	text: string;
	linkText: string;
	onLinkClick: () => void;
	showDivider?: boolean;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
	text,
	linkText,
	onLinkClick,
	showDivider = true,
}) => {
	const { mutedColor, accentColor } = useThemeColors();

	return (
		<MotionVStack
			spacing={3}
			align="center"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.4 }}>
			{showDivider && (
				<motion.div
					style={{
						width: "100%",
						height: "1px",
						background: `linear-gradient(90deg, transparent 0%, ${mutedColor} 50%, transparent 100%)`,
					}}
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				/>
			)}

			<HStack spacing={1} justify="center">
				<Text fontSize="sm" color={mutedColor}>
					{text}
				</Text>
				<Link
					color={accentColor}
					fontSize="sm"
					fontWeight="medium"
					onClick={onLinkClick}
					cursor="pointer"
					_hover={{
						textDecoration: "underline",
						color: accentColor,
					}}
					_focus={{
						outline: "none",
						textDecoration: "underline",
					}}>
					{linkText}
				</Link>
			</HStack>
		</MotionVStack>
	);
};
