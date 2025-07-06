/**
 * Address List Component
 * مكون قائمة العناوين
 */

import React, { useState } from "react";
import { VStack, HStack, Text, Button, Box, Badge } from "@chakra-ui/react";
import { useThemeColors } from '@/theme/hooks/useThemeColors';
import { Address } from '../types/dashboard.types';

interface AddressListProps {
	addresses: Address[];
	onUpdate: (addresses: Address[]) => void;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, onUpdate }) => {
	const { textPrimary, textSecondary, cardBorder } = useThemeColors();
	const [isAdding, setIsAdding] = useState(false);

	const handleAddAddress = () => {
		// TODO: Implement add address functionality
		console.log('Add new address');
	};

	const handleEditAddress = (addressId: string) => {
		// TODO: Implement edit address functionality
		console.log('Edit address:', addressId);
	};

	const handleDeleteAddress = (addressId: string) => {
		const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
		onUpdate(updatedAddresses);
	};

	return (
		<VStack spacing={4} align="stretch">
			<HStack justify="space-between">
				<Text fontWeight="bold" color={textPrimary}>
					Saved Addresses
				</Text>
				<Button size="sm" onClick={handleAddAddress}>
					Add Address
				</Button>
			</HStack>

			{addresses.map((address) => (
				<Box
					key={address.id}
					p={4}
					border="1px"
					borderColor={cardBorder}
					borderRadius="md"
				>
					<HStack justify="space-between" mb={2}>
						<Badge colorScheme={address.type === 'shipping' ? 'blue' : 'green'}>
							{address.type}
						</Badge>
						{address.isDefault && (
							<Badge colorScheme="purple">Default</Badge>
						)}
					</HStack>

					<Text fontWeight="bold" color={textPrimary}>
						{address.firstName} {address.lastName}
					</Text>
					<Text fontSize="sm" color={textSecondary}>
						{address.street}
					</Text>
					<Text fontSize="sm" color={textSecondary}>
						{address.city}, {address.state} {address.zipCode}
					</Text>
					<Text fontSize="sm" color={textSecondary}>
						{address.country}
					</Text>
					<Text fontSize="sm" color={textSecondary}>
						{address.phone}
					</Text>

					<HStack mt={3} spacing={2}>
						<Button size="xs" onClick={() => handleEditAddress(address.id)}>
							Edit
						</Button>
						<Button
							size="xs"
							colorScheme="red"
							variant="outline"
							onClick={() => handleDeleteAddress(address.id)}
						>
							Delete
						</Button>
					</HStack>
				</Box>
			))}

			{addresses.length === 0 && (
				<Text fontSize="sm" color={textSecondary} textAlign="center" py={4}>
					No addresses saved
				</Text>
			)}
		</VStack>
	);
};

export default AddressList;