/**
 * Authentication Button Component
 * مكون الزر للمصادقة
 */

import React from "react";
import { Button, Spinner } from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import type { AuthButtonProps } from "../types";

const MotionButton = Button;

export const AuthButton: React.FC<AuthButtonProps> = ({
	title,
	onClick,
	isLoading = false,
	variant = "primary",
	size = "md",
	icon,
	disabled = false,
}) => {
	const { button } = useThemeColors();

	const getButtonStyles = () => {
		switch (variant) {
			case "primary":
				return {
					bg: button.primary.bg,
					color: button.primary.color,
					borderColor: button.primary.border,
					_hover: {
						bg: button.primary.hover.bg,
						color: button.primary.hover.color,
						borderColor: button.primary.hover.border,
					},
				};

			case "secondary":
				return {
					bg: button.secondary.bg,
					color: button.secondary.color,
					borderColor: button.secondary.border,
					_hover: {
						bg: button.secondary.hover.bg,
						color: button.secondary.hover.color,
						borderColor: button.secondary.hover.border,
					},
				};

			case "ghost":
				return {
					bg: button.ghost.bg,
					color: button.ghost.color,
					borderColor: button.ghost.border,
					_hover: {
						bg: button.ghost.hover.bg,
						color: button.ghost.hover.color,
						borderColor: button.ghost.hover.border,
					},
				};

			default:
				return {
					bg: button.primary.bg,
					color: button.primary.color,
					borderColor: button.primary.border,
					_hover: {
						bg: button.primary.hover.bg,
						color: button.primary.hover.color,
						borderColor: button.primary.hover.border,
					},
				};
		}
	};

	const getSizeStyles = () => {
		switch (size) {
			case "sm":
				return {
					h: "8",
					px: "4",
					fontSize: "sm",
				};

			case "md":
				return {
					h: "10",
					px: "6",
					fontSize: "md",
				};

			case "lg":
				return {
					h: "12",
					px: "8",
					fontSize: "lg",
				};

			default:
				return {
					h: "10",
					px: "6",
					fontSize: "md",
				};
		}
	};

	return (
		<MotionButton
			onClick={onClick}
			isLoading={isLoading}
			disabled={disabled || isLoading}
			leftIcon={isLoading ? <Spinner size="sm" /> : icon}
			border="0.5px solid"
			borderRadius="0"
			fontWeight="500"
			textTransform="uppercase"
			transition="all 0.2s ease-in-out"
			_focus={{
				boxShadow: "none",
			}}
			{...getButtonStyles()}
			{...getSizeStyles()}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}>
			{title}
		</MotionButton>
	);
};
