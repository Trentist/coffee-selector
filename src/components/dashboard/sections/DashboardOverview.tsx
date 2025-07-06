"use client";

/**
 * Dashboard Overview Section
 * قسم نظرة عامة على لوحة التحكم
 */

import React, { useState, useEffect } from "react";
import {
	Box,
	Flex,
	Grid,
	Card,
	CardHeader,
	CardBody,
	Heading,
	Text,
	Spinner,
	Alert,
	AlertIcon,
	useColorModeValue,
	VStack,
	HStack,
	Badge,
	Progress,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Button,
	Icon,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { useLocale } from "@/components/ui/useLocale";
import {
	FaShoppingCart,
	FaMoneyBillWave,
	FaTruck,
	FaFileInvoice,
	FaUsers,
	FaCog,
	FaChartBar,
	FaClock,
	FaBoxOpen,
} from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";

const MotionBox = Box;

interface DashboardStats {
	totalOrders: number;
	totalRevenue: number;
	completedOrders: number;
	pendingOrders: number;
	totalProducts: number;
	totalInvoices: number;
}

interface RecentActivity {
	id: string;
	type: "order" | "login" | "profile_update" | "password_change";
	description: string;
	timestamp: string;
	status: string;
}

const DashboardOverview: React.FC = () => {
	const { t } = useLocale();
	const { stats, isLoading, error } = useDashboard();
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	// Colors
	const bgColor = useColorModeValue("white", "#0D1616");
	const textColor = useColorModeValue("#0D1616", "white");
	const borderColor = useColorModeValue("#E2E8F0", "#2D3748");
	const cardBg = useColorModeValue("gray.50", "gray.800");

	useEffect(() => {
		loadRecentActivity();
	}, []);

	const loadRecentActivity = async () => {
		// TODO: Load recent activity from API
		const activities: RecentActivity[] = [
			{
				id: "1",
				type: "order",
				description: "New order #12345",
				timestamp: new Date().toISOString(),
				status: "pending",
			},
			{
				id: "2",
				type: "order",
				description: "Order #12344 completed",
				timestamp: new Date(Date.now() - 3600000).toISOString(),
				status: "completed",
			},
		];
		setRecentActivity(activities);
	};

	const refreshData = async () => {
		setRefreshing(true);
		await loadRecentActivity();
		setRefreshing(false);
	};

	if (isLoading) {
		return (
			<Flex justify="center" align="center" minH="400px">
				<VStack spacing={4}>
					<Spinner size="xl" color="blue.500" />
					<Text color={textColor}>{t("dashboard.loading_data")}</Text>
				</VStack>
			</Flex>
		);
	}

	if (error) {
		return (
			<Alert status="error" borderRadius="0">
				<AlertIcon />
				{error}
			</Alert>
		);
	}

	const statsData = [
		{
			label: t("dashboard.total_orders"),
			value: stats?.totalOrders || 0,
			icon: FaShoppingCart,
			color: "blue",
			change: "+12%",
			isIncrease: true,
		},
		{
			label: t("dashboard.total_revenue"),
			value: `${(stats?.totalSpent || 0).toFixed(2)} AED`,
			icon: FaMoneyBillWave,
			color: "green",
			change: "+8.5%",
			isIncrease: true,
		},
		{
			label: t("dashboard.completed_orders"),
			value: stats?.totalOrders || 0,
			icon: FaTruck,
			color: "purple",
			change: "+15%",
			isIncrease: true,
		},
		{
			label: t("dashboard.pending_orders"),
			value: 0,
			icon: FaClock,
			color: "orange",
			change: "-5%",
			isIncrease: false,
		},
		{
			label: t("dashboard.total_products"),
			value: 0,
			icon: FaBoxOpen,
			color: "teal",
			change: "+3%",
			isIncrease: true,
		},
		{
			label: t("dashboard.total_invoices"),
			value: 0,
			icon: FaFileInvoice,
			color: "pink",
			change: "+10%",
			isIncrease: true,
		},
	];

	return (
		<Box w="100%" p={6} bg={bgColor} minH="100vh">
			{/* Header with refresh indicator */}
			<Flex justify="space-between" align="center" mb={6}>
				<Heading size="lg" color={textColor}>
					{t("dashboard.enhanced_dashboard")}
				</Heading>
				{refreshing && (
					<HStack>
						<Spinner size="sm" color="blue.500" />
						<Text fontSize="sm" color="gray.500">
							{t("dashboard.updating")}
						</Text>
					</HStack>
				)}
			</Flex>

			{/* Stats Cards */}
			<Grid
				templateColumns={{
					base: "1fr",
					md: "repeat(2, 1fr)",
					lg: "repeat(3, 1fr)",
					xl: "repeat(6, 1fr)",
				}}
				gap={6}
				mb={8}>
				{statsData.map((stat, index) => (
					<MotionBox
						key={stat.label}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}>
						<Card bg={cardBg} border="1px" borderColor={borderColor}>
							<CardBody>
								<Flex justify="space-between" align="center">
									<VStack align="start" spacing={1}>
										<Text fontSize="sm" color="gray.500">
											{stat.label}
										</Text>
										<Text fontSize="2xl" fontWeight="bold" color={textColor}>
											{stat.value}
										</Text>
										<HStack spacing={1}>
											<Text
												fontSize="xs"
												color={stat.isIncrease ? "green.500" : "red.500"}>
												{stat.change}
											</Text>
										</HStack>
									</VStack>
									<Box
										p={3}
										borderRadius="full"
										bg={`${stat.color}.100`}
										color={`${stat.color}.600`}>
										<Icon as={stat.icon} boxSize={6} />
									</Box>
								</Flex>
							</CardBody>
						</Card>
					</MotionBox>
				))}
			</Grid>

			{/* Main Content Tabs */}
			<Tabs variant="soft-rounded" colorScheme="blue" mt={8}>
				<TabList>
					<Tab>{t("dashboard.overview")}</Tab>
					<Tab>{t("dashboard.orders")}</Tab>
					<Tab>{t("dashboard.invoices")}</Tab>
					<Tab>{t("dashboard.analytics")}</Tab>
				</TabList>

				<TabPanels>
					{/* Overview Tab */}
					<TabPanel>
						<Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
							{/* Recent Activity */}
							<Card bg={cardBg} border="1px" borderColor={borderColor}>
								<CardHeader>
									<Heading size="md" color={textColor}>
										{t("dashboard.recent_activity")}
									</Heading>
								</CardHeader>
								<CardBody>
									<VStack spacing={3} align="stretch">
										{recentActivity.map((activity, index) => (
											<MotionBox
												key={activity.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
												p={3}
												border="1px"
												borderColor={borderColor}
												borderRadius="md">
												<Flex justify="space-between" align="center">
													<HStack>
														<Box
															w={3}
															h={3}
															borderRadius="full"
															bg={
																activity.status === "completed"
																	? "green.500"
																	: "yellow.500"
															}
														/>
														<Text fontSize="sm" color={textColor}>
															{activity.description}
														</Text>
													</HStack>
													<Badge
														colorScheme={
															activity.status === "completed"
																? "green"
																: "yellow"
														}
														variant="subtle">
														{activity.status}
													</Badge>
												</Flex>
												<Text fontSize="xs" color="gray.500" mt={1}>
													{new Date(activity.timestamp).toLocaleString()}
												</Text>
											</MotionBox>
										))}
									</VStack>
								</CardBody>
							</Card>

							{/* Quick Actions */}
							<Card bg={cardBg} border="1px" borderColor={borderColor}>
								<CardHeader>
									<Heading size="md" color={textColor}>
										{t("dashboard.quick_actions")}
									</Heading>
								</CardHeader>
								<CardBody>
									<VStack spacing={3}>
										<Box
											w="100%"
											p={4}
											border="1px"
											borderColor={borderColor}
											borderRadius="md"
											cursor="pointer"
											_hover={{ bg: "gray.100" }}
											transition="all 0.2s">
											<HStack>
												<FaShoppingCart color="blue" />
												<Text color={textColor}>
													{t("dashboard.create_order")}
												</Text>
											</HStack>
										</Box>
										<Box
											w="100%"
											p={4}
											border="1px"
											borderColor={borderColor}
											borderRadius="md"
											cursor="pointer"
											_hover={{ bg: "gray.100" }}
											transition="all 0.2s">
											<HStack>
												<FaFileInvoice color="green" />
												<Text color={textColor}>
													{t("dashboard.create_invoice")}
												</Text>
											</HStack>
										</Box>
									</VStack>
								</CardBody>
							</Card>
						</Grid>
					</TabPanel>

					{/* Orders Tab */}
					<TabPanel>
						<Card bg={cardBg} border="1px" borderColor={borderColor}>
							<CardHeader>
								<Heading size="md" color={textColor}>
									{t("dashboard.orders_coming_soon")}
								</Heading>
							</CardHeader>
							<CardBody>
								<Text color={textColor}>
									{t("dashboard.orders_description")}
								</Text>
							</CardBody>
						</Card>
					</TabPanel>

					{/* Invoices Tab */}
					<TabPanel>
						<Card bg={cardBg} border="1px" borderColor={borderColor}>
							<CardHeader>
								<Heading size="md" color={textColor}>
									{t("dashboard.invoices_coming_soon")}
								</Heading>
							</CardHeader>
							<CardBody>
								<Text color={textColor}>
									{t("dashboard.invoices_description")}
								</Text>
							</CardBody>
						</Card>
					</TabPanel>

					{/* Analytics Tab */}
					<TabPanel>
						<Card bg={cardBg} border="1px" borderColor={borderColor}>
							<CardHeader>
								<Heading size="md" color={textColor}>
									{t("dashboard.analytics_coming_soon")}
								</Heading>
							</CardHeader>
							<CardBody>
								<Text color={textColor}>
									{t("dashboard.analytics_description")}
								</Text>
							</CardBody>
						</Card>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default DashboardOverview;
