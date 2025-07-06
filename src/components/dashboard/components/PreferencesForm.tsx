/**
 * Preferences Form Component
 * مكون نموذج التفضيلات
 */

import React, { useState } from "react";
import { VStack, HStack, FormControl, FormLabel, Select, Switch, Text, Button } from "@chakra-ui/react";
import { useThemeColors } from '@/theme/hooks/useThemeColors';

interface Preferences {
	language: string;
	currency: string;
	notifications: boolean;
}

interface PreferencesFormProps {
	preferences: Preferences;
	onUpdate: (preferences: Preferences) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onUpdate }) => {
	const { textPrimary } = useThemeColors();
	const [formData, setFormData] = useState(preferences);
	const [isEditing, setIsEditing] = useState(false);

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		onUpdate(formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData(preferences);
		setIsEditing(false);
	};

	return (
		<VStack spacing={4} align="stretch">
			<HStack justify="space-between">
				<Text fontWeight="bold" color={textPrimary}>
					User Preferences
				</Text>
				{!isEditing ? (
					<Button size="sm" onClick={() => setIsEditing(true)}>
						Edit
					</Button>
				) : (
					<HStack>
						<Button size="sm" colorScheme="blue" onClick={handleSave}>
							Save
						</Button>
						<Button size="sm" variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
					</HStack>
				)}
			</HStack>

			<FormControl>
				<FormLabel>Language</FormLabel>
				<Select
					value={formData.language}
					onChange={(e) => handleInputChange('language', e.target.value)}
					isDisabled={!isEditing}
				>
					<option value="en">English</option>
					<option value="ar">العربية</option>
				</Select>
			</FormControl>

			<FormControl>
				<FormLabel>Currency</FormLabel>
				<Select
					value={formData.currency}
					onChange={(e) => handleInputChange('currency', e.target.value)}
					isDisabled={!isEditing}
				>
					<option value="AED">AED (UAE Dirham)</option>
					<option value="USD">USD (US Dollar)</option>
					<option value="EUR">EUR (Euro)</option>
				</Select>
			</FormControl>

			<FormControl display="flex" alignItems="center">
				<FormLabel mb="0">
					Email Notifications
				</FormLabel>
				<Switch
					isChecked={formData.notifications}
					onChange={(e) => handleInputChange('notifications', e.target.checked)}
					isDisabled={!isEditing}
				/>
			</FormControl>
		</VStack>
	);
};

export default PreferencesForm;