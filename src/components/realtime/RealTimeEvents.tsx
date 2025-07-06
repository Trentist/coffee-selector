"use client";

/**
 * Real-time Events Display Component
 * مكون عرض الأحداث المباشرة
 */

import React, { useState, useEffect } from "react";
import {
	Box,
	VStack,
	HStack,
	Text,
	Badge,
	IconButton,
	Collapse,
	Divider,
	useColorModeValue,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import {
	FaChevronDown,
	FaChevronUp,
	FaTrash,
	FaBell,
	FaShoppingCart,
	FaBox,
	FaUser,
	FaCog,
} from "react-icons/fa";
import { useRealTimeEvents } from "./RealTimeProvider";
import { RealTimeEvent } from "@/odoo-schema-full/real-time-system";

interface RealTimeEventsProps {
	maxEvents?: number;
	showDetails?: boolean;
	autoScroll?: boolean;
	variant?: "compact" | "detailed" | "minimal";
}

interface EventDisplay {
	id: string;
	event: RealTimeEvent;
	timestamp: string;
	isNew: boolean;
}

export function RealTimeEvents({
	maxEvents = 10,
	showDetails = true,
	autoScroll = true,
	variant = "detailed",
}: RealTimeEventsProps) {
	const { lastMessage } = useRealTimeEvents();
	const [events, setEvents] = useState<EventDisplay[]>([]);
	const [isExpanded, setIsExpanded] = useState(true);
	const [hasNewEvents, setHasNewEvents] = useState(false);

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	// Add new event when received
	useEffect(() => {
		if (lastMessage?.event) {
			const newEvent: EventDisplay = {
				id: `${Date.now()}_${Math.random()}`,
				event: lastMessage.event,
				timestamp: lastMessage.timestamp,
				isNew: true,
			};

			setEvents((prev) => {
				const updated = [newEvent, ...prev.slice(0, maxEvents - 1)];
				return updated;
			});

			setHasNewEvents(true);

			// Mark as not new after 3 seconds
			setTimeout(() => {
				setEvents((prev) =>
					prev.map((e) => (e.id === newEvent.id ? { ...e, isNew: false } : e)),
				);
				setHasNewEvents(false);
			}, 3000);
		}
	}, [lastMessage, maxEvents]);

	const getEventIcon = (eventType: string) => {
		switch (eventType) {
			case "ORDER_UPDATE":
				return FaShoppingCart;
			case "INVENTORY_UPDATE":
				return FaBox;
			case "USER_UPDATE":
				return FaUser;
			case "SYSTEM_UPDATE":
				return FaCog;
			default:
				return FaBell;
		}
	};

	const getEventColor = (eventType: string) => {
		switch (eventType) {
			case "ORDER_UPDATE":
				return "blue";
			case "INVENTORY_UPDATE":
				return "green";
			case "USER_UPDATE":
				return "purple";
			case "SYSTEM_UPDATE":
				return "orange";
			default:
				return "gray";
		}
	};

	const getEventTitle = (event: RealTimeEvent) => {
		switch (event.type) {
			case "ORDER_UPDATE":
				return "تحديث الطلب";
			case "INVENTORY_UPDATE":
				return "تحديث المخزون";
			case "USER_UPDATE":
				return "تحديث المستخدم";
			case "SYSTEM_UPDATE":
				return "تحديث النظام";
			default:
				return "حدث جديد";
		}
	};

	const clearEvents = () => {
		setEvents([]);
		setHasNewEvents(false);
	};

	const formatTimestamp = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("ar-SA", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	const renderCompactEvent = (eventDisplay: EventDisplay) => (
		<HStack
			key={eventDisplay.id}
			p={2}
			bg={
				eventDisplay.isNew
					? `${getEventColor(eventDisplay.event.type)}.50`
					: "transparent"
			}
			borderRadius="md"
			borderLeft={`3px solid ${getEventColor(eventDisplay.event.type)}.500`}
			transition="all 0.2s"
			_hover={{ bg: `${getEventColor(eventDisplay.event.type)}.100` }}>
			<Icon
				as={getEventIcon(eventDisplay.event.type)}
				color={`${getEventColor(eventDisplay.event.type)}.500`}
				boxSize={4}
			/>
			<Text fontSize="sm" fontWeight="medium" flex={1}>
				{getEventTitle(eventDisplay.event)}
			</Text>
			<Text fontSize="xs" color="gray.500">
				{formatTimestamp(eventDisplay.timestamp)}
			</Text>
			{eventDisplay.isNew && (
				<Badge colorScheme={getEventColor(eventDisplay.event.type)} size="sm">
					جديد
				</Badge>
			)}
		</HStack>
	);

	const renderDetailedEvent = (eventDisplay: EventDisplay) => (
		<Box
			key={eventDisplay.id}
			p={3}
			bg={
				eventDisplay.isNew
					? `${getEventColor(eventDisplay.event.type)}.50`
					: bgColor
			}
			borderWidth={1}
			borderColor={borderColor}
			borderRadius="md"
			transition="all 0.2s"
			_hover={{ shadow: "md" }}>
			<HStack justify="space-between" mb={2}>
				<HStack spacing={2}>
					<Icon
						as={getEventIcon(eventDisplay.event.type)}
						color={`${getEventColor(eventDisplay.event.type)}.500`}
						boxSize={5}
					/>
					<Text fontWeight="bold" fontSize="md">
						{getEventTitle(eventDisplay.event)}
					</Text>
				</HStack>
				<HStack spacing={2}>
					<Badge colorScheme={getEventColor(eventDisplay.event.type)}>
						{eventDisplay.event.action}
					</Badge>
					{eventDisplay.isNew && (
						<Badge colorScheme="red" size="sm">
							جديد
						</Badge>
					)}
				</HStack>
			</HStack>

			<VStack align="start" spacing={1}>
				<Text fontSize="sm" color="gray.600">
					الكيان: {eventDisplay.event.entity} - {eventDisplay.event.entityId}
				</Text>
				<Text fontSize="sm" color="gray.600">
					الأولوية: {eventDisplay.event.priority}
				</Text>
				<Text fontSize="xs" color="gray.500">
					{formatTimestamp(eventDisplay.timestamp)}
				</Text>
			</VStack>

			{showDetails && eventDisplay.event.data && (
				<Box mt={2} p={2} bg="gray.50" borderRadius="md">
					<Text fontSize="xs" fontFamily="mono" color="gray.700">
						{JSON.stringify(eventDisplay.event.data, null, 2)}
					</Text>
				</Box>
			)}
		</Box>
	);

	const renderMinimalEvent = (eventDisplay: EventDisplay) => (
		<HStack
			key={eventDisplay.id}
			p={1}
			spacing={2}
			opacity={eventDisplay.isNew ? 1 : 0.7}>
			<Icon
				as={getEventIcon(eventDisplay.event.type)}
				color={`${getEventColor(eventDisplay.event.type)}.500`}
				boxSize={3}
			/>
			<Text fontSize="xs">{getEventTitle(eventDisplay.event)}</Text>
		</HStack>
	);

	const renderEvent = (eventDisplay: EventDisplay) => {
		switch (variant) {
			case "compact":
				return renderCompactEvent(eventDisplay);
			case "minimal":
				return renderMinimalEvent(eventDisplay);
			default:
				return renderDetailedEvent(eventDisplay);
		}
	};

	if (events.length === 0) {
		return (
			<Alert status="info" borderRadius="md">
				<AlertIcon />
				<AlertTitle>لا توجد أحداث!</AlertTitle>
				<AlertDescription>
					ستظهر هنا الأحداث المباشرة عند وصولها
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Box
			borderWidth={1}
			borderColor={borderColor}
			borderRadius="lg"
			bg={bgColor}
			overflow="hidden">
			<HStack
				p={3}
				bg="gray.50"
				justify="space-between"
				cursor="pointer"
				onClick={() => setIsExpanded(!isExpanded)}>
				<HStack spacing={2}>
					<Icon as={FaBell} color="blue.500" />
					<Text fontWeight="bold">الأحداث المباشرة</Text>
					<Badge colorScheme="blue" size="sm">
						{events.length}
					</Badge>
					{hasNewEvents && (
						<Badge colorScheme="red" size="sm">
							جديد
						</Badge>
					)}
				</HStack>
				<HStack spacing={2}>
					<IconButton
						size="sm"
						icon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
						aria-label="Toggle events"
						variant="ghost"
					/>
					<IconButton
						size="sm"
						icon={<FaTrash />}
						aria-label="Clear events"
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							clearEvents();
						}}
					/>
				</HStack>
			</HStack>

			<Collapse in={isExpanded}>
				<VStack spacing={0} align="stretch" maxH="400px" overflowY="auto">
					{events.map((eventDisplay, index) => (
						<React.Fragment key={eventDisplay.id}>
							{renderEvent(eventDisplay)}
							{index < events.length - 1 && <Divider />}
						</React.Fragment>
					))}
				</VStack>
			</Collapse>
		</Box>
	);
}

// Specialized event components
export function RealTimeEventsCompact() {
	return <RealTimeEvents variant="compact" maxEvents={5} />;
}

export function RealTimeEventsMinimal() {
	return <RealTimeEvents variant="minimal" maxEvents={3} />;
}

export function RealTimeEventsDetailed() {
	return (
		<RealTimeEvents variant="detailed" maxEvents={10} showDetails={true} />
	);
}
