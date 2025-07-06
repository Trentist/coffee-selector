/**
 * Quick Actions Component
 * مكون الإجراءات السريعة
 */

import React from "react";
import { VStack } from "@chakra-ui/react";
import { FaShoppingCart, FaHeart, FaUser, FaCog } from "react-icons/fa";
import QuickActionButton from './QuickActionButton';

const QuickActions: React.FC = () => {
	const handleViewOrders = () => {
		// TODO: Navigate to orders
		console.log('Navigate to orders');
	};

	const handleViewWishlist = () => {
		// TODO: Navigate to wishlist
		console.log('Navigate to wishlist');
	};

	const handleEditProfile = () => {
		// TODO: Navigate to profile
		console.log('Navigate to profile');
	};

	const handleSettings = () => {
		// TODO: Navigate to settings
		console.log('Navigate to settings');
	};

	return (
		<VStack spacing={3}>
			<QuickActionButton
				icon={FaShoppingCart}
				label="View Orders"
				onClick={handleViewOrders}
				color="blue"
			/>
			<QuickActionButton
				icon={FaHeart}
				label="My Wishlist"
				onClick={handleViewWishlist}
				color="pink"
			/>
			<QuickActionButton
				icon={FaUser}
				label="Edit Profile"
				onClick={handleEditProfile}
				color="green"
			/>
			<QuickActionButton
				icon={FaCog}
				label="Settings"
				onClick={handleSettings}
				color="gray"
			/>
		</VStack>
	);
};

export default QuickActions;