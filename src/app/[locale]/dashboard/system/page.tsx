/**
 * System Dashboard Page
 * صفحة لوحة تحكم النظام
 */

"use client";

import React, { useState } from "react";
import {
	Box,
	VStack,
	HStack,
	Text,
	Button,
	Tab,
	Tabs,
	TabList,
	TabPanel,
	TabPanels,
	Icon,
	useToast,
} from "@chakra-ui/react";
import {
	FiActivity,
	FiPlay,
	FiRefreshCw,
	FiSettings,
	FiBarChart,
	FiZap,
} from "react-icons/fi";
import TestRunner from "@/components/system/TestRunner";
import SystemMonitor from "@/components/system/SystemMonitor";
import PerformanceMonitor from "@/components/system/PerformanceMonitor";
import LayoutMain from "@/components/layout/layout-main";

export default function SystemDashboardPage() {
	const [activeTab, setActiveTab] = useState(0);
	const toast = useToast();

	const handleTestComplete = (results: any[]) => {
		const passedTests = results.filter(
			(suite) => suite.status === "passed",
		).length;
		const totalTests = results.length;

		toast({
			title:
				passedTests === totalTests ? "All Tests Passed!" : "Some Tests Failed",
			description: `${passedTests}/${totalTests} test suites passed`,
			status: passedTests === totalTests ? "success" : "warning",
			duration: 5000,
			isClosable: true,
		});
	};

	return (
		<LayoutMain>
			<Box p={6} maxW="7xl" mx="auto">
				<VStack spacing={8} align="stretch">
					{/* Header */}
					<Box>
						<HStack spacing={4} mb={2}>
							<Icon as={FiActivity} color="blue.500" boxSize={6} />
							<Text fontSize="2xl" fontWeight="bold">
								System Dashboard
							</Text>
						</HStack>
						<Text color="gray.600">
							مراقبة واختبار النظام المركزي لاختيار القهوة
						</Text>
					</Box>

					{/* Tabs */}
					<Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
						<TabList>
							<Tab>
								<HStack>
									<Icon as={FiBarChart} />
									<Text>System Monitor</Text>
								</HStack>
							</Tab>
							<Tab>
								<HStack>
									<Icon as={FiZap} />
									<Text>Performance</Text>
								</HStack>
							</Tab>
							<Tab>
								<HStack>
									<Icon as={FiPlay} />
									<Text>Test Runner</Text>
								</HStack>
							</Tab>
							<Tab>
								<HStack>
									<Icon as={FiSettings} />
									<Text>Configuration</Text>
								</HStack>
							</Tab>
						</TabList>

						<TabPanels>
							{/* System Monitor Tab */}
							<TabPanel>
								<SystemMonitor />
							</TabPanel>

							{/* Performance Monitor Tab */}
							<TabPanel>
								<PerformanceMonitor />
							</TabPanel>

							{/* Test Runner Tab */}
							<TabPanel>
								<TestRunner onComplete={handleTestComplete} />
							</TabPanel>

							{/* Configuration Tab */}
							<TabPanel>
								<Box p={6} bg="white" borderRadius="lg" shadow="md">
									<VStack spacing={6} align="stretch">
										<Text fontSize="xl" fontWeight="bold">
											System Configuration
										</Text>

										<Box>
											<Text fontSize="lg" fontWeight="medium" mb={4}>
												Environment Variables
											</Text>
											<VStack spacing={3} align="stretch">
												<HStack
													justify="space-between"
													p={3}
													bg="gray.50"
													borderRadius="md">
													<Text fontWeight="medium">Odoo GraphQL URL</Text>
													<Text fontSize="sm" color="gray.600">
														{process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL ||
															"Not configured"}
													</Text>
												</HStack>
												<HStack
													justify="space-between"
													p={3}
													bg="gray.50"
													borderRadius="md">
													<Text fontWeight="medium">Redis URL</Text>
													<Text fontSize="sm" color="gray.600">
														{process.env.REDIS_URL || "redis://localhost:6379"}
													</Text>
												</HStack>
												<HStack
													justify="space-between"
													p={3}
													bg="gray.50"
													borderRadius="md">
													<Text fontWeight="medium">Environment</Text>
													<Text fontSize="sm" color="gray.600">
														{process.env.NODE_ENV || "development"}
													</Text>
												</HStack>
											</VStack>
										</Box>

										<Box>
											<Text fontSize="lg" fontWeight="medium" mb={4}>
												Quick Actions
											</Text>
											<HStack spacing={4}>
												<Button
													leftIcon={<Icon as={FiRefreshCw} />}
													colorScheme="blue"
													variant="outline"
													onClick={() => window.location.reload()}>
													Refresh System
												</Button>
												<Button
													leftIcon={<Icon as={FiPlay} />}
													colorScheme="green"
													variant="outline"
													onClick={() => setActiveTab(1)}>
													Run Tests
												</Button>
											</HStack>
										</Box>
									</VStack>
								</Box>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</VStack>
			</Box>
		</LayoutMain>
	);
}
