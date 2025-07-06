/**
 * Profile Form Component
 * مكون نموذج الملف الشخصي
 */

import React, { useState } from "react";
import {
	Box,
	VStack,
	HStack,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Button,
	Avatar,
	Text,
	useToast,
	Flex,
} from "@chakra-ui/react";
import { useLocale } from "@/components/ui/useLocale";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import { User } from "../types/dashboard.types";

interface ProfileFormProps {
	user: User;
	onUpdate: (user: User) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdate }) => {
	const { t } = useLocale();
	const { textColor, bgColor, borderColor, buttonBg, buttonColor } = useThemeColors();
	const toast = useToast();

	const [formData, setFormData] = useState({
		name: user.name || "",
		email: user.email || "",
		phone: user.phone || "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = t("validation.name_required");
		}

		if (!formData.email.trim()) {
			newErrors.email = t("validation.email_required");
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = t("validation.email_invalid");
		}

		if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
			newErrors.phone = t("validation.phone_invalid");
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: "" }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			setIsLoading(true);

			// TODO: Replace with actual API call
			const updatedUser: User = {
				...user,
				...formData,
				updatedAt: new Date().toISOString(),
			};

			onUpdate(updatedUser);

			toast({
				title: t("dashboard.profile_updated"),
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: t("dashboard.update_failed"),
				description: error instanceof Error ? error.message : "Unknown error",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box as="form" onSubmit={handleSubmit}>
			<VStack spacing={6} align="stretch">
				{/* Avatar Section */}
				<Flex align="center" gap={4}>
					<Avatar
						size="lg"
						name={user.name}
						src={user.avatar}
						bg={textColor}
						color={bgColor}
					/>
					<VStack align="start" spacing={1}>
						<Text fontSize="lg" fontWeight="semibold" color={textColor}>
							{user.name}
						</Text>
						<Text fontSize="sm" color={textColor} opacity={0.7}>
							{user.email}
						</Text>
					</VStack>
				</Flex>

				{/* Name Field */}
				<FormControl isInvalid={!!errors.name}>
					<FormLabel color={textColor}>{t("dashboard.name")}</FormLabel>
					<Input
						value={formData.name}
						onChange={(e) => handleInputChange("name", e.target.value)}
						placeholder={t("dashboard.enter_name")}
						bg={bgColor}
						borderColor={borderColor}
						color={textColor}
						_focus={{
							borderColor: textColor,
							boxShadow: "none",
						}}
					/>
					<FormErrorMessage>{errors.name}</FormErrorMessage>
				</FormControl>

				{/* Email Field */}
				<FormControl isInvalid={!!errors.email}>
					<FormLabel color={textColor}>{t("dashboard.email")}</FormLabel>
					<Input
						type="email"
						value={formData.email}
						onChange={(e) => handleInputChange("email", e.target.value)}
						placeholder={t("dashboard.enter_email")}
						bg={bgColor}
						borderColor={borderColor}
						color={textColor}
						_focus={{
							borderColor: textColor,
							boxShadow: "none",
						}}
					/>
					<FormErrorMessage>{errors.email}</FormErrorMessage>
				</FormControl>

				{/* Phone Field */}
				<FormControl isInvalid={!!errors.phone}>
					<FormLabel color={textColor}>{t("dashboard.phone")}</FormLabel>
					<Input
						value={formData.phone}
						onChange={(e) => handleInputChange("phone", e.target.value)}
						placeholder={t("dashboard.enter_phone")}
						bg={bgColor}
						borderColor={borderColor}
						color={textColor}
						_focus={{
							borderColor: textColor,
							boxShadow: "none",
						}}
					/>
					<FormErrorMessage>{errors.phone}</FormErrorMessage>
				</FormControl>

				{/* Submit Button */}
				<Button
					type="submit"
					bg={buttonBg}
					color={buttonColor}
					isLoading={isLoading}
					loadingText={t("dashboard.updating")}
					_hover={{
						bg: buttonBg,
						opacity: 0.8,
					}}
					_disabled={{
						bg: buttonBg,
						opacity: 0.5,
					}}>
					{t("dashboard.update_profile")}
				</Button>
			</VStack>
		</Box>
	);
};

export default ProfileForm;