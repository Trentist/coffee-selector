/**
 * Performance Monitor Component
 * مكون مراقبة الأداء
 */

"use client";

import React, { useState, useEffect } from "react";
import {
	Box,
	VStack,
	HStack,
	Text,
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
	Badge,
} from "@chakra-ui/react";
import {
	FiTrendingUp,
	FiTrendingDown,
	FiActivity,
	FiZap,
	FiClock,
} from "react-icons/fi";

interface PerformanceMetrics {
	cpu: number;
	memory: number;
	disk: number;
	network: number;
	responseTime: number;
	throughput: number;
	errorRate: number;
	uptime: number;
}

interface PerformanceAlert {
	type: "warning" | "error" | "info";
	message: string;
	timestamp: Date;
}

export const PerformanceMonitor: React.FC = () => {
	const [metrics, setMetrics] = useState<PerformanceMetrics>({
		cpu: 45,
		memory: 62,
		disk: 28,
		network: 75,
		responseTime: 150,
		throughput: 1200,
		errorRate: 0.5,
		uptime: 86400, // 24 hours
	});

	const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
	const [isMonitoring, setIsMonitoring] = useState(true);

	useEffect(() => {
		if (!isMonitoring) return;

		const interval = setInterval(() => {
			updateMetrics();
		}, 3000); // تحديث كل 3 ثوان

		return () => clearInterval(interval);
	}, [isMonitoring]);

	const updateMetrics = () => {
		// محاكاة تحديث مقاييس الأداء
		setMetrics((prev) => ({
			...prev,
			cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
			memory: Math.max(
				0,
				Math.min(100, prev.memory + (Math.random() - 0.5) * 5),
			),
			disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
			network: Math.max(
				0,
				Math.min(100, prev.network + (Math.random() - 0.5) * 15),
			),
			responseTime: Math.max(
				50,
				Math.min(500, prev.responseTime + (Math.random() - 0.5) * 50),
			),
			throughput: Math.max(
				500,
				Math.min(2000, prev.throughput + (Math.random() - 0.5) * 100),
			),
			errorRate: Math.max(
				0,
				Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5),
			),
			uptime: prev.uptime + 3,
		}));

		// فحص التنبيهات
		checkAlerts();
	};

	const checkAlerts = () => {
		const newAlerts: PerformanceAlert[] = [];

		if (metrics.cpu > 80) {
			newAlerts.push({
				type: "warning",
				message: "CPU usage is high",
				timestamp: new Date(),
			});
		}

		if (metrics.memory > 85) {
			newAlerts.push({
				type: "error",
				message: "Memory usage is critical",
				timestamp: new Date(),
			});
		}

		if (metrics.responseTime > 300) {
			newAlerts.push({
				type: "warning",
				message: "Response time is slow",
				timestamp: new Date(),
			});
		}

		if (metrics.errorRate > 2) {
			newAlerts.push({
				type: "error",
				message: "High error rate detected",
				timestamp: new Date(),
			});
		}

		if (newAlerts.length > 0) {
			setAlerts((prev) => [...newAlerts, ...prev.slice(0, 4)]); // الاحتفاظ بـ 5 تنبيهات فقط
		}
	};

	const getStatusColor = (
		value: number,
		thresholds: { warning: number; critical: number },
	) => {
		if (value >= thresholds.critical) return "red";
		if (value >= thresholds.warning) return "yellow";
		return "green";
	};

	const formatUptime = (seconds: number) => {
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${days}d ${hours}h ${minutes}m`;
	};

	const getTrendIcon = (current: number, previous: number) => {
		return current > previous ? (
			<Icon as={FiTrendingUp} color="green.500" />
		) : (
			<Icon as={FiTrendingDown} color="red.500" />
		);
	};

	return (
		<Box p={6} bg="white" borderRadius="lg" shadow="md">
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<HStack justify="space-between">
					<HStack>
						<Icon as={FiZap} color="orange.500" />
						<Text fontSize="xl" fontWeight="bold">
							Performance Monitor
						</Text>
					</HStack>
					<Badge colorScheme="blue" size="lg">
						Real-time
					</Badge>
				</HStack>

				{/* Alerts */}
				{alerts.length > 0 && (
					<VStack spacing={2} align="stretch">
						{alerts.map((alert, index) => (
							<Alert key={index} status={alert.type}>
								<AlertIcon />
								<Box>
									<AlertTitle>{alert.message}</AlertTitle>
									<AlertDescription>
										{alert.timestamp.toLocaleTimeString()}
									</AlertDescription>
								</Box>
							</Alert>
						))}
					</VStack>
				)}

				{/* System Metrics */}
				<Grid templateColumns="repeat(2, 1fr)" gap={4}>
					<GridItem>
						<Stat>
							<StatLabel>CPU Usage</StatLabel>
							<StatNumber>{metrics.cpu.toFixed(1)}%</StatNumber>
							<StatHelpText>
								<StatArrow type={metrics.cpu > 50 ? "increase" : "decrease"} />
								{Math.abs(metrics.cpu - 50).toFixed(1)}%
							</StatHelpText>
						</Stat>
					</GridItem>
					<GridItem>
						<Stat>
							<StatLabel>Memory Usage</StatLabel>
							<StatNumber>{metrics.memory.toFixed(1)}%</StatNumber>
							<StatHelpText>
								<StatArrow
									type={metrics.memory > 60 ? "increase" : "decrease"}
								/>
								{Math.abs(metrics.memory - 60).toFixed(1)}%
							</StatHelpText>
						</Stat>
					</GridItem>
					<GridItem>
						<Stat>
							<StatLabel>Response Time</StatLabel>
							<StatNumber>{Math.round(metrics.responseTime)}ms</StatNumber>
							<StatHelpText>
								<StatArrow
									type={metrics.responseTime > 200 ? "increase" : "decrease"}
								/>
								{Math.abs(metrics.responseTime - 200).toFixed(0)}ms
							</StatHelpText>
						</Stat>
					</GridItem>
					<GridItem>
						<Stat>
							<StatLabel>Error Rate</StatLabel>
							<StatNumber>{metrics.errorRate.toFixed(2)}%</StatNumber>
							<StatHelpText>
								<StatArrow
									type={metrics.errorRate > 1 ? "increase" : "decrease"}
								/>
								{Math.abs(metrics.errorRate - 1).toFixed(2)}%
							</StatHelpText>
						</Stat>
					</GridItem>
				</Grid>

				{/* Progress Bars */}
				<VStack spacing={4} align="stretch">
					<Box>
						<HStack justify="space-between" mb={2}>
							<Text fontSize="sm" fontWeight="medium">
								CPU Usage
							</Text>
							<Text fontSize="sm">{metrics.cpu.toFixed(1)}%</Text>
						</HStack>
						<Progress
							value={metrics.cpu}
							colorScheme={getStatusColor(metrics.cpu, {
								warning: 70,
								critical: 90,
							})}
							size="sm"
						/>
					</Box>

					<Box>
						<HStack justify="space-between" mb={2}>
							<Text fontSize="sm" fontWeight="medium">
								Memory Usage
							</Text>
							<Text fontSize="sm">{metrics.memory.toFixed(1)}%</Text>
						</HStack>
						<Progress
							value={metrics.memory}
							colorScheme={getStatusColor(metrics.memory, {
								warning: 80,
								critical: 95,
							})}
							size="sm"
						/>
					</Box>

					<Box>
						<HStack justify="space-between" mb={2}>
							<Text fontSize="sm" fontWeight="medium">
								Disk Usage
							</Text>
							<Text fontSize="sm">{metrics.disk.toFixed(1)}%</Text>
						</HStack>
						<Progress
							value={metrics.disk}
							colorScheme={getStatusColor(metrics.disk, {
								warning: 85,
								critical: 95,
							})}
							size="sm"
						/>
					</Box>

					<Box>
						<HStack justify="space-between" mb={2}>
							<Text fontSize="sm" fontWeight="medium">
								Network Usage
							</Text>
							<Text fontSize="sm">{metrics.network.toFixed(1)}%</Text>
						</HStack>
						<Progress
							value={metrics.network}
							colorScheme={getStatusColor(metrics.network, {
								warning: 80,
								critical: 95,
							})}
							size="sm"
						/>
					</Box>
				</VStack>

				{/* Additional Metrics */}
				<Grid templateColumns="repeat(3, 1fr)" gap={4}>
					<GridItem>
						<Box p={3} bg="gray.50" borderRadius="md" textAlign="center">
							<Icon as={FiClock} color="blue.500" boxSize={5} mb={2} />
							<Text fontSize="sm" fontWeight="medium">
								Uptime
							</Text>
							<Text fontSize="lg" fontWeight="bold">
								{formatUptime(metrics.uptime)}
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box p={3} bg="gray.50" borderRadius="md" textAlign="center">
							<Icon as={FiActivity} color="green.500" boxSize={5} mb={2} />
							<Text fontSize="sm" fontWeight="medium">
								Throughput
							</Text>
							<Text fontSize="lg" fontWeight="bold">
								{Math.round(metrics.throughput)} req/s
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box p={3} bg="gray.50" borderRadius="md" textAlign="center">
							<Icon as={FiZap} color="orange.500" boxSize={5} mb={2} />
							<Text fontSize="sm" fontWeight="medium">
								Performance
							</Text>
							<Text fontSize="lg" fontWeight="bold">
								{Math.round(
									((100 - metrics.errorRate * 10) *
										(100 - metrics.responseTime / 10)) /
										100,
								)}
								%
							</Text>
						</Box>
					</GridItem>
				</Grid>
			</VStack>
		</Box>
	);
};

export default PerformanceMonitor;
