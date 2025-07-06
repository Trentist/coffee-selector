/**
 * Order Tracking Section Component
 * مكون قسم متابعة الطلبات
 */

import React, { useState, useEffect } from "react";
import {
	Box,
	VStack,
	Heading,
	Text,
	Flex,
	Spinner,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	Button,
	HStack,
	IconButton,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Grid,
	Card,
	CardBody,
	Progress,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiTruck, FiEye, FiPackage, FiMapPin, FiClock } from "react-icons/fi";
import { useLocale } from "@/components/ui/useLocale";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import DashboardCard from "../components/DashboardCard";
import { Order } from "../types/order-tracking.types";

const OrderTrackingSection: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary, borderColor } = useThemeColors();
	const [orders, setOrders] = useState<Order[]>([]);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const bgColor = useColorModeValue("white", "gray.800");
	const cardBg = useColorModeValue("gray.50", "gray.700");

	useEffect(() => {
		loadOrders();
	}, []);

	const loadOrders = async () => {
		try {
			setIsLoading(true);

			// TODO: Replace with actual API call
			const mockOrders: Order[] = [
				{
					id: "1",
					name: "SO-001",
					state: "confirmed",
					dateOrder: "2024-01-15",
					amountTotal: 150.0,
					partner: {
						id: "1",
						name: "John Doe",
						email: "john@example.com",
						phone: "+971501234567",
					},
					orderLines: [
						{
							id: "1",
							productName: "Premium Coffee Beans",
							quantity: 2,
							priceSubtotal: 150.0,
						},
					],
					shippingAddress: {
						id: "1",
						name: "John Doe",
						street: "123 Main St",
						city: "Dubai",
						country: {
							name: "UAE",
						},
					},
					paymentMethod: {
						id: "1",
						name: "Credit Card",
						type: "card",
					},
					shippingMethod: {
						id: "1",
						name: "Express Delivery",
						price: 20.0,
					},
					trackingNumber: "TRK123456789",
					deliveryDate: "2024-01-20",
					invoiceStatus: "posted",
					deliveryStatus: "in_transit",
					trackingSteps: [
						{
							id: "1",
							status: "order_placed",
							title: "Order Placed",
							description: "Order has been placed successfully",
							date: "2024-01-15T10:00:00Z",
							completed: true,
						},
						{
							id: "2",
							status: "order_confirmed",
							title: "Order Confirmed",
							description: "Order has been confirmed and is being processed",
							date: "2024-01-15T14:00:00Z",
							completed: true,
						},
						{
							id: "3",
							status: "shipped",
							title: "Shipped",
							description: "Order has been shipped and is in transit",
							date: "2024-01-16T09:00:00Z",
							completed: true,
						},
						{
							id: "4",
							status: "out_for_delivery",
							title: "Out for Delivery",
							description: "Order is out for delivery",
							date: "2024-01-20T08:00:00Z",
							completed: false,
						},
						{
							id: "5",
							status: "delivered",
							title: "Delivered",
							description: "Order has been delivered successfully",
							date: null,
							completed: false,
						},
					],
				},
				{
					id: "2",
					name: "SO-002",
					state: "sale",
					dateOrder: "2024-01-10",
					amountTotal: 200.0,
					partner: {
						id: "2",
						name: "Jane Smith",
						email: "jane@example.com",
						phone: "+971501234568",
					},
					orderLines: [
						{
							id: "2",
							productName: "Coffee Maker Pro",
							quantity: 1,
							priceSubtotal: 200.0,
						},
					],
					shippingAddress: {
						id: "2",
						name: "Jane Smith",
						street: "456 Oak Ave",
						city: "Abu Dhabi",
						country: {
							name: "UAE",
						},
					},
					paymentMethod: {
						id: "2",
						name: "PayPal",
						type: "paypal",
					},
					shippingMethod: {
						id: "2",
						name: "Standard Delivery",
						price: 15.0,
					},
					trackingNumber: "TRK987654321",
					deliveryDate: "2024-01-15",
					invoiceStatus: "paid",
					deliveryStatus: "delivered",
					trackingSteps: [
						{
							id: "1",
							status: "order_placed",
							title: "Order Placed",
							description: "Order has been placed successfully",
							date: "2024-01-10T10:00:00Z",
							completed: true,
						},
						{
							id: "2",
							status: "order_confirmed",
							title: "Order Confirmed",
							description: "Order has been confirmed and is being processed",
							date: "2024-01-10T14:00:00Z",
							completed: true,
						},
						{
							id: "3",
							status: "shipped",
							title: "Shipped",
							description: "Order has been shipped and is in transit",
							date: "2024-01-11T09:00:00Z",
							completed: true,
						},
						{
							id: "4",
							status: "out_for_delivery",
							title: "Out for Delivery",
							description: "Order is out for delivery",
							date: "2024-01-15T08:00:00Z",
							completed: true,
						},
						{
							id: "5",
							status: "delivered",
							title: "Delivered",
							description: "Order has been delivered successfully",
							date: "2024-01-15T14:00:00Z",
							completed: true,
						},
					],
				},
			];

			setOrders(mockOrders);
		} catch (error) {
			console.error("Failed to load orders:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleViewOrder = (order: Order) => {
		setSelectedOrder(order);
		onOpen();
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "draft":
				return "gray";
			case "confirmed":
				return "blue";
			case "sale":
				return "green";
			case "cancelled":
				return "red";
			default:
				return "gray";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "draft":
				return t("orders.status.draft");
			case "confirmed":
				return t("orders.status.confirmed");
			case "sale":
				return t("orders.status.sale");
			case "cancelled":
				return t("orders.status.cancelled");
			default:
				return status;
		}
	};

	const getDeliveryStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "gray";
			case "in_transit":
				return "blue";
			case "out_for_delivery":
				return "orange";
			case "delivered":
				return "green";
			case "failed":
				return "red";
			default:
				return "gray";
		}
	};

	const getDeliveryStatusText = (status: string) => {
		switch (status) {
			case "pending":
				return t("orders.delivery.pending");
			case "in_transit":
				return t("orders.delivery.in_transit");
			case "out_for_delivery":
				return t("orders.delivery.out_for_delivery");
			case "delivered":
				return t("orders.delivery.delivered");
			case "failed":
				return t("orders.delivery.failed");
			default:
				return status;
		}
	};

	const getProgressPercentage = (order: Order) => {
		const completedSteps = order.trackingSteps.filter(
			(step) => step.completed,
		).length;
		return (completedSteps / order.trackingSteps.length) * 100;
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
						{t("dashboard.order_tracking")}
					</Heading>
					<Text color={textSecondary}>
						{t("dashboard.order_tracking_description")}
					</Text>
				</Box>

				{/* Orders Table */}
				<DashboardCard title={t("dashboard.orders_list")}>
					{orders.length === 0 ? (
						<VStack spacing={4} py={8}>
							<FiPackage size={48} color="gray" />
							<Text fontSize="sm" color={textSecondary}>
								{t("dashboard.no_orders")}
							</Text>
						</VStack>
					) : (
						<Box overflowX="auto">
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th color={textPrimary}>{t("orders.number")}</Th>
										<Th color={textPrimary}>{t("orders.date")}</Th>
										<Th color={textPrimary}>{t("orders.customer")}</Th>
										<Th color={textPrimary}>{t("orders.total")}</Th>
										<Th color={textPrimary}>{t("orders.status")}</Th>
										<Th color={textPrimary}>{t("orders.delivery_status")}</Th>
										<Th color={textPrimary}>{t("orders.progress")}</Th>
										<Th color={textPrimary}>{t("orders.actions")}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{orders.map((order) => (
										<Tr key={order.id}>
											<Td color={textPrimary} fontWeight="medium">
												{order.name}
											</Td>
											<Td color={textSecondary}>
												{new Date(order.dateOrder).toLocaleDateString()}
											</Td>
											<Td color={textPrimary}>{order.partner.name}</Td>
											<Td color={textPrimary} fontWeight="bold">
												د.إ {order.amountTotal}
											</Td>
											<Td>
												<Badge colorScheme={getStatusColor(order.state)}>
													{getStatusText(order.state)}
												</Badge>
											</Td>
											<Td>
												<Badge
													colorScheme={getDeliveryStatusColor(
														order.deliveryStatus,
													)}>
													{getDeliveryStatusText(order.deliveryStatus)}
												</Badge>
											</Td>
											<Td>
												<Progress
													value={getProgressPercentage(order)}
													size="sm"
													colorScheme="blue"
													w="100px"
												/>
											</Td>
											<Td>
												<IconButton
													aria-label={t("orders.view")}
													icon={<FiEye />}
													size="sm"
													variant="ghost"
													onClick={() => handleViewOrder(order)}
												/>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</Box>
					)}
				</DashboardCard>
			</VStack>

			{/* Order Details Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent bg={bgColor}>
					<ModalHeader color={textPrimary}>
						{t("orders.details")} - {selectedOrder?.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						{selectedOrder && (
							<VStack spacing={6} align="stretch">
								{/* Order Header */}
								<Card bg={cardBg}>
									<CardBody>
										<Grid templateColumns="repeat(2, 1fr)" gap={4}>
											<VStack align="start" spacing={2}>
												<HStack>
													<FiPackage />
													<Text fontWeight="bold" color={textPrimary}>
														{t("orders.order_number")}: {selectedOrder.name}
													</Text>
												</HStack>
												<HStack>
													<FiClock />
													<Text color={textSecondary}>
														{t("orders.date")}:{" "}
														{new Date(
															selectedOrder.dateOrder,
														).toLocaleDateString()}
													</Text>
												</HStack>
												<Text color={textSecondary}>
													{t("orders.total")}: د.إ {selectedOrder.amountTotal}
												</Text>
											</VStack>
											<VStack align="end" spacing={2}>
												<Badge
													colorScheme={getStatusColor(selectedOrder.state)}
													size="lg">
													{getStatusText(selectedOrder.state)}
												</Badge>
												<Badge
													colorScheme={getDeliveryStatusColor(
														selectedOrder.deliveryStatus,
													)}>
													{getDeliveryStatusText(selectedOrder.deliveryStatus)}
												</Badge>
											</VStack>
										</Grid>
									</CardBody>
								</Card>

								{/* Customer Information */}
								<Card bg={cardBg}>
									<CardBody>
										<Heading size="md" color={textPrimary} mb={4}>
											{t("orders.customer_info")}
										</Heading>
										<VStack align="start" spacing={2}>
											<Text color={textPrimary}>
												<strong>{t("orders.name")}:</strong>{" "}
												{selectedOrder.partner.name}
											</Text>
											<Text color={textSecondary}>
												<strong>{t("orders.email")}:</strong>{" "}
												{selectedOrder.partner.email}
											</Text>
											<Text color={textSecondary}>
												<strong>{t("orders.phone")}:</strong>{" "}
												{selectedOrder.partner.phone}
											</Text>
										</VStack>
									</CardBody>
								</Card>

								{/* Shipping Information */}
								<Card bg={cardBg}>
									<CardBody>
										<Heading size="md" color={textPrimary} mb={4}>
											{t("orders.shipping_info")}
										</Heading>
										<VStack align="start" spacing={2}>
											<HStack>
												<FiMapPin />
												<Text color={textPrimary}>
													{selectedOrder.shippingAddress.street},{" "}
													{selectedOrder.shippingAddress.city}
												</Text>
											</HStack>
											<HStack>
												<FiTruck />
												<Text color={textSecondary}>
													{t("orders.tracking_number")}:{" "}
													{selectedOrder.trackingNumber}
												</Text>
											</HStack>
											<Text color={textSecondary}>
												{t("orders.estimated_delivery")}:{" "}
												{new Date(
													selectedOrder.deliveryDate,
												).toLocaleDateString()}
											</Text>
										</VStack>
									</CardBody>
								</Card>

								{/* Tracking Progress */}
								<Card bg={cardBg}>
									<CardBody>
										<Heading size="md" color={textPrimary} mb={4}>
											{t("orders.tracking_progress")}
										</Heading>
										<VStack spacing={4} align="stretch">
											{selectedOrder.trackingSteps.map((step, index) => (
												<HStack key={step.id} spacing={4}>
													<Box
														w="8"
														h="8"
														borderRadius="full"
														bg={step.completed ? "green.500" : "gray.300"}
														display="flex"
														alignItems="center"
														justifyContent="center"
														color="white"
														fontSize="sm"
														fontWeight="bold">
														{index + 1}
													</Box>
													<VStack align="start" spacing={1} flex={1}>
														<Text fontWeight="bold" color={textPrimary}>
															{step.title}
														</Text>
														<Text fontSize="sm" color={textSecondary}>
															{step.description}
														</Text>
														{step.date && (
															<Text fontSize="xs" color={textSecondary}>
																{new Date(step.date).toLocaleString()}
															</Text>
														)}
													</VStack>
												</HStack>
											))}
										</VStack>
									</CardBody>
								</Card>

								{/* Actions */}
								<HStack justify="center" spacing={4}>
									<Button variant="outline" onClick={onClose}>
										{t("common.close")}
									</Button>
								</HStack>
							</VStack>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default OrderTrackingSection;
