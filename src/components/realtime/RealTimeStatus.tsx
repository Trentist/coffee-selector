"use client";

/**
 * Real-time Status Component
 * مكون حالة الوقت الفعلي
 */

import React from "react";
import {
	Box,
	Text,
	Badge,
	HStack,
	VStack,
	Icon,
	Tooltip,
} from "@chakra-ui/react";
import { useRealTimeConnection } from "./RealTimeProvider";
import {
	FaWifi,
	FaTimesCircle,
	FaCheckCircle,
	FaExclamationTriangle,
	FaSignal,
} from "react-icons/fa";

interface RealTimeStatusProps {
	showDetails?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: "inline" | "card" | "minimal";
}

export function RealTimeStatus({
	showDetails = true,
	size = "md",
	variant = "inline",
}: RealTimeStatusProps) {
	const { connection, getStatus } = useRealTimeConnection();
	const status = getStatus();

	const getStatusColor = () => {
		if (!status.isConnected) return "red";
		if (!status.isAuthenticated) return "orange";
		return "green";
	};

	const getStatusText = () => {
		if (!status.isConnected) return "غير متصل";
		if (!status.isAuthenticated) return "في انتظار المصادقة";
		return "متصل";
	};

	const getStatusIcon = () => {
		if (!status.isConnected) return FaWifi;
		if (!status.isAuthenticated) return FaExclamationTriangle;
		return FaWifi;
	};

	const getConnectionQuality = () => {
		if (!status.isConnected) return 0;
		if (!status.isAuthenticated) return 50;
		return 100;
	};

	const renderInline = () => (
		<HStack spacing={2} align="center">
			<Icon
				as={getStatusIcon()}
				color={`${getStatusColor()}.500`}
				boxSize={size === "sm" ? 3 : size === "lg" ? 5 : 4}
			/>
			<Text fontSize={size === "sm" ? "xs" : size === "lg" ? "md" : "sm"}>
				{getStatusText()}
			</Text>
			{showDetails && status.isConnected && (
				<Badge
					colorScheme={getStatusColor()}
					size={size === "sm" ? "sm" : "md"}>
					{connection.channels.length} قناة
				</Badge>
			)}
		</HStack>
	);

	const renderCard = () => (
		<Box
			p={4}
			borderWidth={1}
			borderRadius="lg"
			borderColor={`${getStatusColor()}.200`}
			bg={`${getStatusColor()}.50`}
			minW="200px">
			<VStack spacing={3} align="start">
				<HStack spacing={2} align="center">
					<Icon
						as={getStatusIcon()}
						color={`${getStatusColor()}.500`}
						boxSize={5}
					/>
					<Text fontWeight="bold" fontSize="md">
						حالة الاتصال المباشر
					</Text>
				</HStack>

				<Text fontSize="sm" color="gray.600">
					{getStatusText()}
				</Text>

				{showDetails && status.isConnected && (
					<VStack spacing={2} align="start" w="full">
						<HStack justify="space-between" w="full">
							<Text fontSize="xs" color="gray.500">
								القنوات المشترك بها:
							</Text>
							<Badge colorScheme="blue" size="sm">
								{connection.channels.length}
							</Badge>
						</HStack>

						<HStack justify="space-between" w="full">
							<Text fontSize="xs" color="gray.500">
								الغرف المنضم إليها:
							</Text>
							<Badge colorScheme="purple" size="sm">
								{connection.rooms.length}
							</Badge>
						</HStack>

						{connection.connectionId && (
							<HStack justify="space-between" w="full">
								<Text fontSize="xs" color="gray.500">
									معرف الاتصال:
								</Text>
								<Text fontSize="xs" fontFamily="mono" color="gray.600">
									{connection.connectionId.slice(-8)}
								</Text>
							</HStack>
						)}
					</VStack>
				)}

				<Box w="full">
					<HStack justify="space-between" mb={1}>
						<Text fontSize="xs" color="gray.500">
							جودة الاتصال:
						</Text>
						<Text fontSize="xs" fontWeight="bold">
							{getConnectionQuality()}%
						</Text>
					</HStack>
					<Box
						w="full"
						h={2}
						bg="gray.200"
						borderRadius="full"
						overflow="hidden">
						<Box
							h="full"
							bg={`${getStatusColor()}.500`}
							w={`${getConnectionQuality()}%`}
							transition="width 0.3s ease"
						/>
					</Box>
				</Box>
			</VStack>
		</Box>
	);

	const renderMinimal = () => (
		<Tooltip
			label={`${getStatusText()} - ${connection.channels.length} قناة`}
			placement="top">
			<Box>
				<Icon
					as={getStatusIcon()}
					color={`${getStatusColor()}.500`}
					boxSize={4}
					cursor="pointer"
				/>
			</Box>
		</Tooltip>
	);

	switch (variant) {
		case "card":
			return renderCard();
		case "minimal":
			return renderMinimal();
		default:
			return renderInline();
	}
}

// Specialized status components
export function RealTimeConnectionStatus() {
	return <RealTimeStatus variant="inline" showDetails={false} />;
}

export function RealTimeDetailedStatus() {
	return <RealTimeStatus variant="card" showDetails={true} size="lg" />;
}

export function RealTimeIndicator() {
	return <RealTimeStatus variant="minimal" />;
}
