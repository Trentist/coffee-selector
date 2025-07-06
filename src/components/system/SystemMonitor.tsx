/**
 * System Monitor Component
 * مكون مراقبة النظام
 */

"use client";

import React, { useState, useEffect } from "react";
import {
	Box,
	VStack,
	HStack,
	Text,
	Badge,
	Progress,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	Grid,
	GridItem,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Icon,
} from "@chakra-ui/react";
import {
	FiServer,
	FiDatabase,
	FiGlobe,
	FiActivity,
	FiCheckCircle,
	FiAlertTriangle,
} from "react-icons/fi";

interface SystemStatus {
	overall: "healthy" | "warning" | "critical";
	uptime: number;
	responseTime: number;
	errorRate: number;
	services: {
		odoo: ServiceStatus;
		redis: ServiceStatus;
		database: ServiceStatus;
		api: ServiceStatus;
	};
}

interface ServiceStatus {
	name: string;
	status: "online" | "offline" | "warning";
	responseTime: number;
	lastCheck: Date;
	error?: string;
}

export const SystemMonitor: React.FC = () => {
	const [systemStatus, setSystemStatus] = useState<SystemStatus>({
		overall: "healthy",
		uptime: 0,
		responseTime: 0,
		errorRate: 0,
		services: {
			odoo: {
				name: "Odoo API",
				status: "online",
				responseTime: 150,
				lastCheck: new Date(),
			},
			redis: {
				name: "Redis Cache",
				status: "online",
				responseTime: 5,
				lastCheck: new Date(),
			},
			database: {
				name: "Database",
				status: "online",
				responseTime: 200,
				lastCheck: new Date(),
			},
			api: {
				name: "API Gateway",
				status: "online",
				responseTime: 50,
				lastCheck: new Date(),
			},
		},
	});

	const [isMonitoring, setIsMonitoring] = useState(true);

	useEffect(() => {
		if (!isMonitoring) return;

		const interval = setInterval(() => {
			updateSystemStatus();
		}, 5000); // تحديث كل 5 ثوان

		return () => clearInterval(interval);
	}, [isMonitoring]);

	const updateSystemStatus = () => {
		// محاكاة تحديث حالة النظام
		setSystemStatus((prev) => ({
			...prev,
			uptime: prev.uptime + 5,
			responseTime: Math.random() * 100 + 50,
			errorRate: Math.random() * 5,
			services: {
				...prev.services,
				odoo: {
					...prev.services.odoo,
					responseTime: Math.random() * 200 + 100,
					lastCheck: new Date(),
					status: Math.random() > 0.95 ? "warning" : "online",
				},
				redis: {
					...prev.services.redis,
					responseTime: Math.random() * 10 + 2,
					lastCheck: new Date(),
					status: "online",
				},
				database: {
					...prev.services.database,
					responseTime: Math.random() * 300 + 150,
					lastCheck: new Date(),
					status: Math.random() > 0.98 ? "warning" : "online",
				},
				api: {
					...prev.services.api,
					responseTime: Math.random() * 100 + 30,
					lastCheck: new Date(),
					status: "online",
				},
			},
		}));

		// تحديث الحالة العامة
		setSystemStatus((prev) => {
			const offlineServices = Object.values(prev.services).filter(
				(s) => s.status === "offline",
			).length;
			const warningServices = Object.values(prev.services).filter(
				(s) => s.status === "warning",
			).length;

			let overall: "healthy" | "warning" | "critical" = "healthy";
			if (offlineServices > 0) overall = "critical";
			else if (warningServices > 0) overall = "warning";

			return { ...prev, overall };
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "online":
			case "healthy":
				return "green";
			case "warning":
				return "yellow";
			case "offline":
			case "critical":
				return "red";
			default:
				return "gray";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "online":
			case "healthy":
				return <Icon as={FiCheckCircle} color="green.500" />;
			case "warning":
				return <Icon as={FiAlertTriangle} color="yellow.500" />;
			case "offline":
			case "critical":
				return <Icon as={FiAlertTriangle} color="red.500" />;
			default:
				return <Icon as={FiActivity} color="gray.500" />;
		}
	};

	const formatUptime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	return (
		<Box p={6} bg="white" borderRadius="lg" shadow="md">
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<HStack justify="space-between">
					<HStack>
						<Icon as={FiServer} color="blue.500" />
						<Text fontSize="xl" fontWeight="bold">
							System Monitor
						</Text>
					</HStack>
					<Badge colorScheme={getStatusColor(systemStatus.overall)} size="lg">
						{systemStatus.overall.toUpperCase()}
					</Badge>
				</HStack>

				{/* Overall Status Alert */}
				{systemStatus.overall !== "healthy" && (
					<Alert
						status={systemStatus.overall === "critical" ? "error" : "warning"}>
						<AlertIcon />
						<Box>
							<AlertTitle>
								{systemStatus.overall === "critical"
									? "System Critical"
									: "System Warning"}
							</AlertTitle>
							<AlertDescription>
								{systemStatus.overall === "critical"
									? "One or more services are offline. Immediate attention required."
									: "Some services are experiencing issues. Monitor closely."}
							</AlertDescription>
						</Box>
					</Alert>
				)}

				{/* System Stats */}
				<Grid templateColumns="repeat(2, 1fr)" gap={4}>
					<GridItem>
						<Stat>
							<StatLabel>Uptime</StatLabel>
							<StatNumber>{formatUptime(systemStatus.uptime)}</StatNumber>
							<StatHelpText>
								<StatArrow type="increase" />
								23.36%
							</StatHelpText>
						</Stat>
					</GridItem>
					<GridItem>
						<Stat>
							<StatLabel>Response Time</StatLabel>
							<StatNumber>{Math.round(systemStatus.responseTime)}ms</StatNumber>
							<StatHelpText>
								<StatArrow type="decrease" />
								9.05%
							</StatHelpText>
						</Stat>
					</GridItem>
					<GridItem>
						<Stat>
							<StatLabel>Error Rate</StatLabel>
							<StatNumber>{systemStatus.errorRate.toFixed(2)}%</StatNumber>
							<StatHelpText>
								<StatArrow type="decrease" />
								2.1%
							</StatHelpText>
						</Stat>
					</GridItem>
					<GridItem>
						<Stat>
							<StatLabel>Active Services</StatLabel>
							<StatNumber>
								{
									Object.values(systemStatus.services).filter(
										(s) => s.status === "online",
									).length
								}
							</StatNumber>
							<StatHelpText>
								of {Object.keys(systemStatus.services).length} total
							</StatHelpText>
						</Stat>
					</GridItem>
				</Grid>

				{/* Service Status */}
				<Box>
					<Text fontSize="lg" fontWeight="medium" mb={4}>
						Service Status
					</Text>
					<VStack spacing={3} align="stretch">
						{Object.entries(systemStatus.services).map(([key, service]) => (
							<HStack
								key={key}
								justify="space-between"
								p={3}
								bg="gray.50"
								borderRadius="md">
								<HStack>
									{getStatusIcon(service.status)}
									<VStack align="start" spacing={0}>
										<Text fontWeight="medium">{service.name}</Text>
										<Text fontSize="xs" color="gray.500">
											Last check: {service.lastCheck.toLocaleTimeString()}
										</Text>
									</VStack>
								</HStack>
								<HStack>
									<Text fontSize="sm" color="gray.600">
										{service.responseTime}ms
									</Text>
									<Badge colorScheme={getStatusColor(service.status)}>
										{service.status}
									</Badge>
								</HStack>
							</HStack>
						))}
					</VStack>
				</Box>

				{/* Performance Metrics */}
				<Box>
					<Text fontSize="lg" fontWeight="medium" mb={4}>
						Performance Metrics
					</Text>
					<VStack spacing={4} align="stretch">
						<Box>
							<HStack justify="space-between" mb={2}>
								<Text fontSize="sm">CPU Usage</Text>
								<Text fontSize="sm">45%</Text>
							</HStack>
							<Progress value={45} colorScheme="blue" size="sm" />
						</Box>
						<Box>
							<HStack justify="space-between" mb={2}>
								<Text fontSize="sm">Memory Usage</Text>
								<Text fontSize="sm">62%</Text>
							</HStack>
							<Progress value={62} colorScheme="orange" size="sm" />
						</Box>
						<Box>
							<HStack justify="space-between" mb={2}>
								<Text fontSize="sm">Disk Usage</Text>
								<Text fontSize="sm">28%</Text>
							</HStack>
							<Progress value={28} colorScheme="green" size="sm" />
						</Box>
					</VStack>
				</Box>
			</VStack>
		</Box>
	);
};

export default SystemMonitor;
