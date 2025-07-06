/**
 * Invoices Section Component
 * مكون قسم الفواتير
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
	useColorModeValue,
} from "@chakra-ui/react";
import {
	FiDownload,
	FiEye,
	FiFileText,
	FiCalendar,
	FiDollarSign,
} from "react-icons/fi";
import { useLocale } from "@/components/ui/useLocale";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import DashboardCard from "../components/DashboardCard";
import { Invoice } from "../types/invoice.types";

const InvoicesSection: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary, borderColor } = useThemeColors();
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const bgColor = useColorModeValue("white", "gray.800");
	const cardBg = useColorModeValue("gray.50", "gray.700");

	useEffect(() => {
		loadInvoices();
	}, []);

	const loadInvoices = async () => {
		try {
			setIsLoading(true);

			// TODO: Replace with actual API call
			const mockInvoices: Invoice[] = [
				{
					id: "1",
					name: "INV-001",
					number: "2024-001",
					date: "2024-01-15",
					dueDate: "2024-02-15",
					total: 150.0,
					amountDue: 150.0,
					state: "posted",
					type: "out_invoice",
					currency: {
						id: "1",
						name: "UAE Dirham",
						symbol: "د.إ",
					},
					partner: {
						id: "1",
						name: "John Doe",
						email: "john@example.com",
						phone: "+971501234567",
					},
					lines: [
						{
							id: "1",
							name: "Coffee Beans",
							quantity: 2,
							price: 75.0,
							priceSubtotal: 150.0,
							priceTax: 0,
							priceTotal: 150.0,
							product: {
								id: "1",
								name: "Premium Coffee Beans",
							},
							taxes: [],
						},
					],
					taxes: [],
				},
				{
					id: "2",
					name: "INV-002",
					number: "2024-002",
					date: "2024-01-20",
					dueDate: "2024-02-20",
					total: 200.0,
					amountDue: 0,
					state: "paid",
					type: "out_invoice",
					currency: {
						id: "1",
						name: "UAE Dirham",
						symbol: "د.إ",
					},
					partner: {
						id: "2",
						name: "Jane Smith",
						email: "jane@example.com",
						phone: "+971501234568",
					},
					lines: [
						{
							id: "2",
							name: "Coffee Maker",
							quantity: 1,
							price: 200.0,
							priceSubtotal: 200.0,
							priceTax: 0,
							priceTotal: 200.0,
							product: {
								id: "2",
								name: "Coffee Maker Pro",
							},
							taxes: [],
						},
					],
					taxes: [],
				},
			];

			setInvoices(mockInvoices);
		} catch (error) {
			console.error("Failed to load invoices:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleViewInvoice = (invoice: Invoice) => {
		setSelectedInvoice(invoice);
		onOpen();
	};

	const handleDownloadInvoice = (invoice: Invoice) => {
		// TODO: Implement download functionality
		console.log("Downloading invoice:", invoice.name);
	};

	const getStatusColor = (state: string) => {
		switch (state) {
			case "draft":
				return "gray";
			case "posted":
				return "blue";
			case "paid":
				return "green";
			case "cancelled":
				return "red";
			default:
				return "gray";
		}
	};

	const getStatusText = (state: string) => {
		switch (state) {
			case "draft":
				return t("invoices.status.draft");
			case "posted":
				return t("invoices.status.posted");
			case "paid":
				return t("invoices.status.paid");
			case "cancelled":
				return t("invoices.status.cancelled");
			default:
				return state;
		}
	};

	if (isLoading) {
		return (
			<Flex justify="center" align="center" minH="400px">
				<VStack spacing={4}>
					<Spinner size="xl" color="blue.500" />
					<Text color={textSecondary}>{t("dashboard.loading_invoices")}</Text>
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
						{t("dashboard.invoices")}
					</Heading>
					<Text color={textSecondary}>
						{t("dashboard.invoices_description")}
					</Text>
				</Box>

				{/* Invoices Table */}
				<DashboardCard title={t("dashboard.invoices_list")}>
					{invoices.length === 0 ? (
						<VStack spacing={4} py={8}>
							<FiFileText size={48} color="gray" />
							<Text fontSize="sm" color={textSecondary}>
								{t("dashboard.no_invoices")}
							</Text>
						</VStack>
					) : (
						<Box overflowX="auto">
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th color={textPrimary}>{t("invoices.number")}</Th>
										<Th color={textPrimary}>{t("invoices.date")}</Th>
										<Th color={textPrimary}>{t("invoices.customer")}</Th>
										<Th color={textPrimary}>{t("invoices.total")}</Th>
										<Th color={textPrimary}>{t("invoices.status")}</Th>
										<Th color={textPrimary}>{t("invoices.actions")}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{invoices.map((invoice) => (
										<Tr key={invoice.id}>
											<Td color={textPrimary} fontWeight="medium">
												{invoice.number}
											</Td>
											<Td color={textSecondary}>
												{new Date(invoice.date).toLocaleDateString()}
											</Td>
											<Td color={textPrimary}>{invoice.partner.name}</Td>
											<Td color={textPrimary} fontWeight="bold">
												{invoice.currency.symbol} {invoice.total}
											</Td>
											<Td>
												<Badge colorScheme={getStatusColor(invoice.state)}>
													{getStatusText(invoice.state)}
												</Badge>
											</Td>
											<Td>
												<HStack spacing={2}>
													<IconButton
														aria-label={t("invoices.view")}
														icon={<FiEye />}
														size="sm"
														variant="ghost"
														onClick={() => handleViewInvoice(invoice)}
													/>
													<IconButton
														aria-label={t("invoices.download")}
														icon={<FiDownload />}
														size="sm"
														variant="ghost"
														onClick={() => handleDownloadInvoice(invoice)}
													/>
												</HStack>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</Box>
					)}
				</DashboardCard>
			</VStack>

			{/* Invoice Details Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent bg={bgColor}>
					<ModalHeader color={textPrimary}>
						{t("invoices.details")} - {selectedInvoice?.number}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						{selectedInvoice && (
							<VStack spacing={6} align="stretch">
								{/* Invoice Header */}
								<Card bg={cardBg}>
									<CardBody>
										<Grid templateColumns="repeat(2, 1fr)" gap={4}>
											<VStack align="start" spacing={2}>
												<HStack>
													<FiFileText />
													<Text fontWeight="bold" color={textPrimary}>
														{t("invoices.invoice_number")}:{" "}
														{selectedInvoice.number}
													</Text>
												</HStack>
												<HStack>
													<FiCalendar />
													<Text color={textSecondary}>
														{t("invoices.date")}:{" "}
														{new Date(
															selectedInvoice.date,
														).toLocaleDateString()}
													</Text>
												</HStack>
												<HStack>
													<FiDollarSign />
													<Text color={textSecondary}>
														{t("invoices.total")}:{" "}
														{selectedInvoice.currency.symbol}{" "}
														{selectedInvoice.total}
													</Text>
												</HStack>
											</VStack>
											<VStack align="end" spacing={2}>
												<Badge
													colorScheme={getStatusColor(selectedInvoice.state)}
													size="lg">
													{getStatusText(selectedInvoice.state)}
												</Badge>
												<Text color={textSecondary}>
													{t("invoices.due_date")}:{" "}
													{new Date(
														selectedInvoice.dueDate,
													).toLocaleDateString()}
												</Text>
											</VStack>
										</Grid>
									</CardBody>
								</Card>

								{/* Customer Information */}
								<Card bg={cardBg}>
									<CardBody>
										<Heading size="md" color={textPrimary} mb={4}>
											{t("invoices.customer_info")}
										</Heading>
										<VStack align="start" spacing={2}>
											<Text color={textPrimary}>
												<strong>{t("invoices.name")}:</strong>{" "}
												{selectedInvoice.partner.name}
											</Text>
											<Text color={textSecondary}>
												<strong>{t("invoices.email")}:</strong>{" "}
												{selectedInvoice.partner.email}
											</Text>
											<Text color={textSecondary}>
												<strong>{t("invoices.phone")}:</strong>{" "}
												{selectedInvoice.partner.phone}
											</Text>
										</VStack>
									</CardBody>
								</Card>

								{/* Invoice Lines */}
								<Card bg={cardBg}>
									<CardBody>
										<Heading size="md" color={textPrimary} mb={4}>
											{t("invoices.items")}
										</Heading>
										<Table variant="simple" size="sm">
											<Thead>
												<Tr>
													<Th color={textPrimary}>{t("invoices.product")}</Th>
													<Th color={textPrimary}>{t("invoices.quantity")}</Th>
													<Th color={textPrimary}>{t("invoices.price")}</Th>
													<Th color={textPrimary}>{t("invoices.total")}</Th>
												</Tr>
											</Thead>
											<Tbody>
												{selectedInvoice.lines.map((line) => (
													<Tr key={line.id}>
														<Td color={textPrimary}>{line.product.name}</Td>
														<Td color={textSecondary}>{line.quantity}</Td>
														<Td color={textSecondary}>
															{selectedInvoice.currency.symbol} {line.price}
														</Td>
														<Td color={textPrimary} fontWeight="bold">
															{selectedInvoice.currency.symbol}{" "}
															{line.priceTotal}
														</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</CardBody>
								</Card>

								{/* Actions */}
								<HStack justify="center" spacing={4}>
									<Button
										leftIcon={<FiDownload />}
										colorScheme="blue"
										onClick={() => handleDownloadInvoice(selectedInvoice)}>
										{t("invoices.download")}
									</Button>
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

export default InvoicesSection;
