/**
 * Order List Component
 * مكون قائمة الطلبات
 */

import React from "react";
import { VStack, Text, HStack, Badge, Box } from "@chakra-ui/react";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import { Order } from "../types/dashboard.types";
import { formatCurrency } from "../helpers/statsHelpers";

interface OrderListProps {
	orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
	const { textPrimary, textSecondary, cardBorder } = useThemeColors();

	const getStatusColor = (status: string) => {
		switch (status) {
			case "delivered":
				return "green";
			case "shipped":
				return "blue";
			case "processing":
				return "yellow";
			case "pending":
				return "orange";
			case "cancelled":
				return "red";
			default:
				return "gray";
		}
	};

	if (orders.length === 0) {
		return (
			<VStack spacing={4} py={8}>
				<Text fontSize="sm" color={textSecondary}>
					No orders found
				</Text>
			</VStack>
		);
	}

	return (
		<VStack spacing={3} align="stretch">
			{orders.map((order) => (
				<Box
					key={order.id}
					p={4}
					border="1px"
					borderColor={cardBorder}
					borderRadius="md">
					<HStack justify="space-between" mb={2}>
						<Text fontWeight="bold" color={textPrimary}>
							{order.orderNumber}
						</Text>
						<Badge colorScheme={getStatusColor(order.status)}>
							{order.status}
						</Badge>
					</HStack>
					<HStack justify="space-between">
						<Text fontSize="sm" color={textSecondary}>
							{new Date(order.createdAt).toLocaleDateString()}
						</Text>
						<Text fontWeight="bold" color={textPrimary}>
							{formatCurrency(order.total, order.currency)}
						</Text>
					</HStack>
				</Box>
			))}
		</VStack>
	);
};

export default OrderList;
