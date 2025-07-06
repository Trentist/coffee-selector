"use client";

/**
 * Orders Section Component
 * مكون قسم الطلبات
 */

import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Text, Flex, Spinner } from "@chakra-ui/react";
import { useLocale } from "@/components/ui/useLocale";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import DashboardCard from "../components/DashboardCard";
import OrderList from "../components/OrderList";
import OrderFilters from "../components/OrderFilters";
import { Order } from "../types/dashboard.types";

const OrdersSection: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary } = useThemeColors();
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filters, setFilters] = useState({
		status: "all",
		dateRange: "all",
	});

	useEffect(() => {
		loadOrders();
	}, [filters]);

	const loadOrders = async () => {
		try {
			setIsLoading(true);

			// TODO: Replace with actual API call to Odoo
			// const response = await fetch('/api/orders');
			// const data = await response.json();
			// setOrders(data);

			// For now, return empty orders
			setOrders([]);
		} catch (error) {
			console.error("Failed to load orders:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFilterChange = (newFilters: any) => {
		setFilters(newFilters);
	};

	if (isLoading) {
		return (
			<Flex justify="center" align="center" minH="400px">
				<VStack spacing={4}>
					<Spinner size="xl" color="blue.500" />
					<Text color={textSecondary}>{t("dashboard.loading_orders")}</Text>
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
						{t("dashboard.orders")}
					</Heading>
					<Text color={textSecondary}>{t("dashboard.orders_description")}</Text>
				</Box>

				{/* Filters */}
				<DashboardCard>
					<OrderFilters filters={filters} onFilterChange={handleFilterChange} />
				</DashboardCard>

				{/* Orders List */}
				<DashboardCard title={t("dashboard.order_history")}>
					<OrderList orders={orders} />
				</DashboardCard>
			</VStack>
		</Box>
	);
};

export default OrdersSection;
