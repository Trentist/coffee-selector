/**
 * Overview Section Component
 * مكون قسم النظرة العامة
 */

import React from "react";
import { Box, VStack, Grid, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { useLocale } from '@/components/ui/useLocale';
import { useThemeColors } from '@/theme/hooks/useThemeColors';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useRecentActivity } from '../hooks/useRecentActivity';
import DashboardCard from '../components/DashboardCard';
import StatsCard from '../components/StatsCard';
import ActivityList from '../components/ActivityList';
import QuickActions from '../components/QuickActions';
import { getStatsData } from '../helpers/statsHelpers';

const OverviewSection: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary } = useThemeColors();
	const { stats, isLoading: statsLoading, error } = useDashboardStats();
	const { activities, isLoading: activitiesLoading } = useRecentActivity();

	if (statsLoading) {
		return (
			<Flex justify="center" align="center" minH="400px">
				<VStack spacing={4}>
					<Spinner size="xl" color="blue.500" />
					<Text color={textSecondary}>{t("dashboard.loading_data")}</Text>
				</VStack>
			</Flex>
		);
	}

	if (error) {
		return (
			<Box p={6}>
				<Text color="red.500">{error}</Text>
			</Box>
		);
	}

	const statsData = getStatsData(stats);

	return (
		<Box w="100%" p={6}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box>
					<Heading size="lg" color={textPrimary} mb={2}>
						{t("dashboard.overview")}
					</Heading>
					<Text color={textSecondary}>
						{t("dashboard.overview_description")}
					</Text>
				</Box>

				{/* Stats Cards */}
				<Grid
					templateColumns={{
						base: "1fr",
						md: "repeat(2, 1fr)",
						lg: "repeat(3, 1fr)",
					}}
					gap={6}
				>
					{statsData.map((stat, index) => (
						<StatsCard key={stat.label} {...stat} />
					))}
				</Grid>

				{/* Content Grid */}
				<Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
					{/* Recent Activity */}
					<DashboardCard title={t("dashboard.recent_activity")}>
						<ActivityList activities={activities} isLoading={activitiesLoading} />
					</DashboardCard>

					{/* Quick Actions */}
					<DashboardCard title={t("dashboard.quick_actions")}>
						<QuickActions />
					</DashboardCard>
				</Grid>
			</VStack>
		</Box>
	);
};

export default OverviewSection;