/**
 * Activity Item Component
 * مكون عنصر النشاط المخصص
 */

import React from "react";
import { Flex, HStack, Text, Box, Badge } from "@chakra-ui/react";
import { useThemeColors } from "@/theme/hooks/useThemeColors";

interface ActivityItemProps {
	id: string;
	type: "order" | "login" | "profile_update" | "password_change";
	description: string;
	timestamp: string;
	status: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
	id,
	type,
	description,
	timestamp,
	status,
}) => {
	const { textPrimary, textSecondary, cardBorder } = useThemeColors();

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
			case "delivered":
				return "green";
			case "pending":
			case "processing":
				return "yellow";
			case "cancelled":
			case "error":
				return "red";
			default:
				return "gray";
		}
	};

	return (
		<Box p={3} border="1px" borderColor={cardBorder} borderRadius="md">
			<Flex justify="space-between" align="center">
				<HStack>
					<Box
						w={3}
						h={3}
						borderRadius="full"
						bg={status === "completed" ? "green.500" : "yellow.500"}
					/>
					<Text fontSize="sm" color={textPrimary}>
						{description}
					</Text>
				</HStack>
				<Badge colorScheme={getStatusColor(status)} variant="subtle">
					{status}
				</Badge>
			</Flex>
			<Text fontSize="xs" color={textSecondary} mt={1}>
				{new Date(timestamp).toLocaleString()}
			</Text>
		</Box>
	);
};

export default ActivityItem;
