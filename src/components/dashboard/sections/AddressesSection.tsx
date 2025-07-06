"use client";

/**
 * Addresses Section Component
 * مكون قسم العناوين
 */

import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Text, Flex, Spinner } from "@chakra-ui/react";
import { useLocale } from "@/components/ui/useLocale";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import DashboardCard from "../components/DashboardCard";
import AddressList from "../components/AddressList";
import { Address } from "../types/dashboard.types";

const AddressesSection: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary } = useThemeColors();
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadAddresses();
	}, []);

	const loadAddresses = async () => {
		try {
			setIsLoading(true);

			// TODO: Replace with actual API call to Odoo
			// const response = await fetch('/api/customer/addresses');
			// const data = await response.json();
			// setAddresses(data);

			// For now, return empty addresses
			setAddresses([]);
		} catch (error) {
			console.error("Failed to load addresses:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateAddresses = (updatedAddresses: Address[]) => {
		setAddresses(updatedAddresses);
	};

	if (isLoading) {
		return (
			<Flex justify="center" align="center" minH="400px">
				<VStack spacing={4}>
					<Spinner size="xl" color="blue.500" />
					<Text color={textSecondary}>{t("dashboard.loading_addresses")}</Text>
				</VStack>
			</Flex>
		);
	}

	return (
		<Box w="100%" p={6}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box>
					<Heading size="lg" color={textPrimary} mb={2}>
						{t("dashboard.addresses")}
					</Heading>
					<Text color={textSecondary}>
						{t("dashboard.addresses_description")}
					</Text>
				</Box>

				{/* Addresses List */}
				<DashboardCard title={t("dashboard.saved_addresses")}>
					<AddressList addresses={addresses} onUpdate={handleUpdateAddresses} />
				</DashboardCard>
			</VStack>
		</Box>
	);
};

export default AddressesSection;
