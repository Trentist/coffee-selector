/**
 * Location Selector Component
 * Displays current location and allows manual selection
 */

import React from 'react';
import {
	Box,
	Text,
	HStack,
	Spinner,
	Icon,
	Tooltip,
} from '@chakra-ui/react';
import { FiMapPin, FiGlobe } from 'react-icons/fi';
import { EnhancedIPData } from '../../../services/location';

interface LocationSelectorProps {
	locationData: EnhancedIPData | null;
	loading: boolean;
	error: string | null;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
	locationData,
	loading,
	error,
}) => {
	const getLocationDisplay = () => {
		if (loading) {
			return (
				<HStack spacing={2}>
					<Spinner size="xs" />
					<Text fontSize="xs">Detecting location...</Text>
				</HStack>
			);
		}

		if (error) {
			return (
				<HStack spacing={2}>
					<Icon as={FiGlobe} color="red.500" />
					<Text fontSize="xs" color="red.500">
						Location unavailable
					</Text>
				</HStack>
			);
		}

		if (locationData) {
			const { city, country_name, country_code } = locationData;
			const displayText = city && country_name
				? `${city}, ${country_name}`
				: country_name || country_code || 'Unknown location';

			return (
				<Tooltip
					label={`${locationData.ip} - ${locationData.timezone}`}
					placement="top"
					hasArrow
				>
					<HStack spacing={2} cursor="pointer" _hover={{ opacity: 0.8 }}>
						<Icon as={FiMapPin} color="blue.500" />
						<Text fontSize="xs" fontWeight="medium">
							{displayText}
						</Text>
					</HStack>
				</Tooltip>
			);
		}

		return (
			<HStack spacing={2}>
				<Icon as={FiGlobe} color="gray.400" />
				<Text fontSize="xs" color="gray.400">
					Location not detected
				</Text>
			</HStack>
		);
	};

	return (
		<Box>
			{getLocationDisplay()}
		</Box>
	);
};