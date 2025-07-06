/**
 * Setting Section Component
 * مكون قسم الإعدادات الموحد
 */

import React, { useState } from "react";
import {
	Box,
	Flex,
	VStack,
	Icon,
	Collapse,
	useColorModeValue,
	IconButton,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// import { motion } from 'framer-motion';
import { TextH6, TextParagraph } from "@/components/ui/custom-text";

const MotionBox = Box;

interface SettingSectionProps {
	title: string;
	description: string;
	icon: IconType;
	children: React.ReactNode;
	isExpanded?: boolean;
	onToggle?: () => void;
	isCollapsible?: boolean;
}

/**
 * Unified setting section component with theme support
 */
export const SettingSection: React.FC<SettingSectionProps> = ({
	title,
	description,
	icon,
	children,
	isExpanded: controlledExpanded,
	onToggle,
	isCollapsible = true,
}) => {
	const [internalExpanded, setInternalExpanded] = useState(true);
	const isExpanded =
		controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

	// Theme colors
	const bg = useColorModeValue("#fff", "#0D1616");
	const color = useColorModeValue("#0D1616", "#fff");
	const borderColor = useColorModeValue("#E2E8F0", "#2D3748");
	const hoverBg = useColorModeValue("#F7FAFC", "#1A202C");

	const handleToggle = () => {
		if (onToggle) {
			onToggle();
		} else {
			setInternalExpanded(!internalExpanded);
		}
	};

	return (
		<MotionBox
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			w="100%"
			bg={bg}
			borderWidth="1px"
			borderColor={borderColor}
			borderRadius="0"
			overflow="hidden">
			{/* Section Header */}
			<Flex
				p={4}
				align="center"
				justify="space-between"
				cursor={isCollapsible ? "pointer" : "default"}
				onClick={isCollapsible ? handleToggle : undefined}
				_hover={isCollapsible ? { bg: hoverBg } : {}}
				transition="all 0.2s">
				<Flex align="center" gap={3}>
					<Icon as={icon} boxSize={5} color={color} />
					<VStack align="start" spacing={0}>
						<TextH6 title={title} />
						<TextParagraph title={description} fontSize="sm" color="gray.500" />
					</VStack>
				</Flex>

				{isCollapsible && (
					<IconButton
						aria-label={isExpanded ? "Collapse section" : "Expand section"}
						icon={<Icon as={isExpanded ? FiChevronUp : FiChevronDown} />}
						variant="ghost"
						size="sm"
						color={color}
					/>
				)}
			</Flex>

			{/* Section Content */}
			<Collapse in={isExpanded} animateOpacity>
				<Box p={4} pt={0}>
					{children}
				</Box>
			</Collapse>
		</MotionBox>
	);
};
