"use client";

/**
 * Profile Section Component
 * مكون قسم الملف الشخصي
 */

import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Text, Flex, Spinner } from "@chakra-ui/react";
import { useLocale } from "@/components/ui/useLocale";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import DashboardCard from "../components/DashboardCard";
import ProfileForm from "../components/ProfileForm";
import AddressList from "../components/AddressList";
import PreferencesForm from "../components/PreferencesForm";
import { ProfileData } from "../types/dashboard.types";

const ProfileSection: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary } = useThemeColors();
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadProfileData();
	}, []);

	const loadProfileData = async () => {
		try {
			setIsLoading(true);

			// TODO: Replace with actual API call
			const mockProfileData: ProfileData = {
				user: {
					id: "1",
					name: "John Doe",
					email: "john@example.com",
					phone: "+971501234567",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				addresses: [
					{
						id: "1",
						type: "shipping",
						firstName: "John",
						lastName: "Doe",
						street: "123 Main St",
						city: "Dubai",
						state: "Dubai",
						zipCode: "12345",
						country: "UAE",
						phone: "+971501234567",
						isDefault: true,
					},
				],
				preferences: {
					language: "en",
					currency: "AED",
					notifications: true,
				},
			};

			setProfileData(mockProfileData);
		} catch (error) {
			console.error("Failed to load profile data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleProfileUpdate = async (updatedData: Partial<ProfileData>) => {
		try {
			// TODO: Replace with actual API call
			console.log("Updating profile:", updatedData);
			setProfileData((prev) => (prev ? { ...prev, ...updatedData } : null));
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	if (isLoading) {
		return (
			<Flex justify="center" align="center" minH="400px">
				<VStack spacing={4}>
					<Spinner size="xl" color="blue.500" />
					<Text color={textSecondary}>{t("dashboard.loading_profile")}</Text>
				</VStack>
			</Flex>
		);
	}

	if (!profileData) {
		return (
			<Box p={6}>
				<Text color="red.500">Failed to load profile data</Text>
			</Box>
		);
	}

	return (
		<Box w="100%" p={6}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box>
					<Heading size="lg" color={textPrimary} mb={2}>
						{t("dashboard.profile")}
					</Heading>
					<Text color={textSecondary}>
						{t("dashboard.profile_description")}
					</Text>
				</Box>

				{/* Profile Form */}
				<DashboardCard title={t("dashboard.personal_info")}>
					<ProfileForm
						user={profileData.user}
						onUpdate={(user) => handleProfileUpdate({ user })}
					/>
				</DashboardCard>

				{/* Addresses */}
				<DashboardCard title={t("dashboard.addresses")}>
					<AddressList
						addresses={profileData.addresses}
						onUpdate={(addresses) => handleProfileUpdate({ addresses })}
					/>
				</DashboardCard>

				{/* Preferences */}
				<DashboardCard title={t("dashboard.preferences")}>
					<PreferencesForm
						preferences={profileData.preferences}
						onUpdate={(preferences) => handleProfileUpdate({ preferences })}
					/>
				</DashboardCard>
			</VStack>
		</Box>
	);
};

export default ProfileSection;
