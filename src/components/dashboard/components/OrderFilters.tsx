/**
 * Order Filters Component
 * مكون فلاتر الطلبات
 */

import React from "react";
import { HStack, Select, Text } from "@chakra-ui/react";
import { useThemeColors } from '@/theme/hooks/useThemeColors';

interface OrderFiltersProps {
	filters: {
		status: string;
		dateRange: string;
	};
	onFilterChange: (filters: any) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ filters, onFilterChange }) => {
	const { textPrimary } = useThemeColors();

	const handleStatusChange = (status: string) => {
		onFilterChange({ ...filters, status });
	};

	const handleDateRangeChange = (dateRange: string) => {
		onFilterChange({ ...filters, dateRange });
	};

	return (
		<HStack spacing={4}>
			<HStack>
				<Text fontSize="sm" color={textPrimary}>
					Status:
				</Text>
				<Select
					size="sm"
					value={filters.status}
					onChange={(e) => handleStatusChange(e.target.value)}
				>
					<option value="all">All</option>
					<option value="pending">Pending</option>
					<option value="processing">Processing</option>
					<option value="shipped">Shipped</option>
					<option value="delivered">Delivered</option>
					<option value="cancelled">Cancelled</option>
				</Select>
			</HStack>

			<HStack>
				<Text fontSize="sm" color={textPrimary}>
					Date Range:
				</Text>
				<Select
					size="sm"
					value={filters.dateRange}
					onChange={(e) => handleDateRangeChange(e.target.value)}
				>
					<option value="all">All Time</option>
					<option value="today">Today</option>
					<option value="week">This Week</option>
					<option value="month">This Month</option>
					<option value="year">This Year</option>
				</Select>
			</HStack>
		</HStack>
	);
};

export default OrderFilters;