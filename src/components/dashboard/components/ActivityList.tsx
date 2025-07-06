/**
 * Activity List Component
 * مكون قائمة النشاط
 */

import React from "react";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import ActivityItem from "./ActivityItem";
import { RecentActivity } from "../types/dashboard.types";

interface ActivityListProps {
	activities: RecentActivity[];
	isLoading: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
	activities,
	isLoading,
}) => {
	const { textSecondary } = useThemeColors();

	if (isLoading) {
		return (
			<VStack spacing={4} py={8}>
				<Spinner size="md" color="blue.500" />
				<Text fontSize="sm" color={textSecondary}>
					Loading activities...
				</Text>
			</VStack>
		);
	}

	if (activities.length === 0) {
		return (
			<VStack spacing={4} py={8}>
				<Text fontSize="sm" color={textSecondary}>
					No recent activities
				</Text>
			</VStack>
		);
	}

	return (
		<VStack spacing={3} align="stretch">
			{activities.map((activity) => (
				<ActivityItem key={activity.id} {...activity} />
			))}
		</VStack>
	);
};

export default ActivityList;
