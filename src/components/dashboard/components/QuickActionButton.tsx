/**
 * Quick Action Button Component
 * مكون زر الإجراء السريع المخصص
 */

import React from "react";
import { Box, HStack, Text, Icon } from "@chakra-ui/react";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

interface QuickActionButtonProps {
	icon: any;
	label: string;
	onClick: () => void;
	color?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
	icon,
	label,
	onClick,
	color = "blue",
}) => {
	const { cardBorder, textPrimary } = useThemeColors();

	return (
		<Box
			w="100%"
			p={4}
			border="1px"
			borderColor={cardBorder}
			borderRadius="md"
			cursor="pointer"
			_hover={{ bg: "gray.100" }}
			transition="all 0.2s"
			onClick={onClick}>
			<HStack>
				<Icon as={icon} color={`${color}.500`} />
				<Text color={textPrimary}>{label}</Text>
			</HStack>
		</Box>
	);
};

export default QuickActionButton;
