/**
 * ShipmentTracker Component
 * مكون تتبع الشحنات
 */

import React, { useState, useEffect } from "react";
import {
	Box,
	VStack,
	HStack,
	Text,
	Input,
	Button,
	useToast,
	Spinner,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Badge,
	useColorModeValue,
} from "@chakra-ui/react";

// Components
import { useLocale } from "@/components/ui/useLocale";

// Types
import {
	ShipmentTrackerProps,
	TrackingInfo,
} from "./types/ShipmentTracker.types";

// Helpers
import {
	getStatusColor,
	trackShipment,
} from "./helpers/ShipmentTracker.helpers";

const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({
	trackingNumber: initialTrackingNumber,
	onTrackingFound,
}) => {
	const { t } = useLocale();
	const toast = useToast();

	const [trackingNumber, setTrackingNumber] = useState(
		initialTrackingNumber || "",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
	const [error, setError] = useState<string | null>(null);

	const bgColor = useColorModeValue("white", "#0D1616");
	const textColor = useColorModeValue("#0D1616", "#fff");
	const borderColor = useColorModeValue("#0D1616", "#fff");

	const handleTrack = () => {
		trackShipment(
			trackingNumber,
			(data) => {
				setTrackingInfo(data);
				setError(null);
				onTrackingFound?.(data);
				toast({
					title: t("tracking.success"),
					description: t("tracking.info_found"),
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			},
			(errorMessage) => {
				setError(errorMessage);
				toast({
					title: t("tracking.error"),
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			},
			setIsLoading,
			t,
		);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleTrack();
		}
	};

	useEffect(() => {
		if (initialTrackingNumber) {
			handleTrack();
		}
	}, [initialTrackingNumber]);

	return (
		<Box
			bg={bgColor}
			border=".2px solid"
			borderColor={borderColor}
			borderRadius="0"
			p={6}>
			<VStack spacing={4} align="stretch">
				<Text
					fontSize="lg"
					fontWeight="bold"
					color={textColor}
					textAlign="center">
					{t("tracking.title")}
				</Text>

				<HStack>
					<Input
						placeholder={t("tracking.enter_number")}
						value={trackingNumber}
						onChange={(e) => setTrackingNumber(e.target.value)}
						onKeyPress={handleKeyPress}
						borderRadius="0"
						color={textColor}
						_placeholder={{ color: "gray.500" }}
					/>
					<Button
						onClick={handleTrack}
						isLoading={isLoading}
						loadingText={t("tracking.tracking")}
						colorScheme="blue"
						borderRadius="0">
						{t("tracking.track")}
					</Button>
				</HStack>

				{isLoading && (
					<Box textAlign="center" py={4}>
						<Spinner size="lg" color="blue.500" />
						<Text mt={2} color={textColor}>
							{t("tracking.loading")}
						</Text>
					</Box>
				)}

				{error && (
					<Alert status="error" borderRadius="0">
						<AlertIcon />
						<AlertTitle>{t("tracking.error")}</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{trackingInfo && (
					<VStack spacing={4} align="stretch">
						<Box>
							<Text color={textColor} fontSize="sm" fontWeight="bold">
								{t("tracking.tracking_number")}: {trackingInfo.id}
							</Text>
							<Badge colorScheme={getStatusColor(trackingInfo.status)} mt={1}>
								{t(`tracking.status.${trackingInfo.status}`)}
							</Badge>
						</Box>

						{trackingInfo.estimatedDelivery && (
							<Box>
								<Text color={textColor} fontSize="sm" fontWeight="bold">
									{t("tracking.estimated_delivery")}:
								</Text>
								<Text color={textColor} fontSize="sm">
									{trackingInfo.estimatedDelivery}
								</Text>
							</Box>
						)}

						{trackingInfo.currentLocation && (
							<Box>
								<Text color={textColor} fontSize="sm" fontWeight="bold">
									{t("tracking.current_location")}:
								</Text>
								<Text color={textColor} fontSize="sm">
									{trackingInfo.currentLocation}
								</Text>
							</Box>
						)}

						{trackingInfo.updates && trackingInfo.updates.length > 0 && (
							<Box>
								<Text color={textColor} fontSize="sm" fontWeight="bold" mb={2}>
									{t("tracking.updates")}:
								</Text>
								<VStack spacing={2} align="stretch">
									{trackingInfo.updates.map((update, index) => (
										<Box
											key={index}
											p={3}
											border=".2px solid"
											borderColor="gray.200"
											borderRadius="0">
											<HStack justify="space-between" mb={1}>
												<Text color={textColor} fontSize="xs" fontWeight="bold">
													{update.date}
												</Text>
												<Badge
													colorScheme={getStatusColor(update.status)}
													size="sm">
													{t(`tracking.status.${update.status}`)}
												</Badge>
											</HStack>
											{update.location && (
												<Text color={textColor} fontSize="xs" mb={1}>
													{update.location}
												</Text>
											)}
											<Text color={textColor} fontSize="xs">
												{update.description}
											</Text>
										</Box>
									))}
								</VStack>
							</Box>
						)}
					</VStack>
				)}
			</VStack>
		</Box>
	);
};

export default ShipmentTracker;
