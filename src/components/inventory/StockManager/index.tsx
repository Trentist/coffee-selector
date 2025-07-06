"use client";

/**
 * مكون إدارة المخزون المتقدم
 * واجهة شاملة لمراقبة وإدارة المخزون
 */

import React, { useState, useEffect, useMemo } from "react";
import {
	Box,
	VStack,
	HStack,
	Heading,
	Text,
	Button,
	Input,
	Select,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	Progress,
	Card,
	CardBody,
	CardHeader,
	SimpleGrid,
	Flex,
	IconButton,
	Tooltip,
	useColorModeValue,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Spinner,
	Alert,
	AlertIcon,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	InputGroup,
	InputLeftElement,
	FormControl,
	FormLabel,
	NumberInput,
	NumberInputField,
	Switch,
} from "@chakra-ui/react";
import {
	FiSearch,
	FiFilter,
	FiDownload,
	FiEdit,
	FiEye,
	FiAlertTriangle,
	FiTrendingUp,
	FiTrendingDown,
	FiRefreshCw,
	FiSettings,
	FiBarChart,
	FiPackage,
	FiShoppingCart,
} from "react-icons/fi";
// import { motion } from "framer-motion";
import { useLocale } from "@/components/ui/useLocale";

const MotionBox = Box;
const MotionCard = Card;

// أنواع البيانات للمكون
interface StockManagerProps {
	productId?: number;
	locationId?: number;
	initialView?: "overview" | "products" | "alerts" | "analytics";
}

interface FilterOptions {
	search: string;
	status: string;
	category: string;
	location: string;
	alertType: string;
	sortBy: string;
	sortOrder: string;
}

interface StockLevel {
	product_id: number;
	product_name: string;
	product_sku: string;
	current_stock: number;
	reserved_qty: number;
	available_qty: number;
	incoming_qty: number;
	outgoing_qty: number;
	min_stock_level: number;
	max_stock_level: number;
	reorder_point: number;
	stock_status: "in_stock" | "low_stock" | "out_of_stock" | "overstock";
	last_updated: string;
	location_id: number;
	location_name: string;
	unit_cost: number;
	total_value: number;
}

interface StockAlert {
	id: string;
	type: "low_stock" | "out_of_stock" | "overstock" | "expiry";
	product_id: number;
	product_name: string;
	message: string;
	severity: "low" | "medium" | "high" | "critical";
	created_at: string;
	is_read: boolean;
}

interface InventoryAnalytics {
	total_products: number;
	total_stock_value: number;
	low_stock_products: number;
	out_of_stock_products: number;
	overstock_products: number;
	stock_turnover_ratio: number;
	average_stock_age: number;
	top_products_by_value: Array<{
		product_id: number;
		product_name: string;
		stock_value: number;
		percentage: number;
	}>;
}

/**
 * مكون إدارة المخزون الرئيسي
 */
const StockManager: React.FC<StockManagerProps> = ({
	productId,
	locationId,
	initialView = "overview",
}) => {
	const { t, isRTL } = useLocale();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// ألوان الثيم
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const cardBg = useColorModeValue("gray.50", "gray.700");

	// حالة المكون
	const [activeTab, setActiveTab] = useState<number>(
		initialView === "overview"
			? 0
			: initialView === "products"
				? 1
				: initialView === "alerts"
					? 2
					: initialView === "analytics"
						? 3
						: 0,
	);
	const [loading, setLoading] = useState(false);
	const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
	const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
	const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<StockLevel | null>(
		null,
	);
	const [filters, setFilters] = useState<FilterOptions>({
		search: "",
		status: "all",
		category: "all",
		location: "all",
		alertType: "all",
		sortBy: "product_name",
		sortOrder: "asc",
	});

	// حالة إعدادات المتقدمة
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [refreshInterval, setRefreshInterval] = useState(30); // ثواني
	const [showLowStockOnly, setShowLowStockOnly] = useState(false);

	/**
	 * تحميل البيانات عند بدء المكون
	 */
	useEffect(() => {
		loadStockData();
		loadAlerts();
		loadAnalytics();
	}, [productId, locationId]);

	/**
	 * التحديث التلقائي
	 */
	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			loadStockData();
			loadAlerts();
		}, refreshInterval * 1000);

		return () => clearInterval(interval);
	}, [autoRefresh, refreshInterval]);

	/**
	 * تحميل بيانات المخزون
	 */
	const loadStockData = async () => {
		try {
			setLoading(true);
			// TODO: Replace with actual API call to Odoo
			// const response = await fetch('/api/inventory/stock-levels');
			// const data = await response.json();
			// setStockLevels(data);

			// For now, return empty data
			setStockLevels([]);
		} catch (error) {
			toast({
				title: "خطأ في تحميل البيانات",
				description: "فشل في تحميل بيانات المخزون",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	/**
	 * تحميل التنبيهات
	 */
	const loadAlerts = async () => {
		try {
			// TODO: Replace with actual API call to Odoo
			// const response = await fetch('/api/inventory/alerts');
			// const data = await response.json();
			// setStockAlerts(data);

			// For now, return empty alerts
			setStockAlerts([]);
		} catch (error) {
			console.error("Error loading alerts:", error);
		}
	};

	/**
	 * تحميل التحليلات
	 */
	const loadAnalytics = async () => {
		try {
			// TODO: Replace with actual API call to Odoo
			// const response = await fetch('/api/inventory/analytics');
			// const data = await response.json();
			// setAnalytics(data);

			// For now, return empty analytics
			setAnalytics({
				total_products: 0,
				total_stock_value: 0,
				low_stock_products: 0,
				out_of_stock_products: 0,
				overstock_products: 0,
				stock_turnover_ratio: 0,
				average_stock_age: 0,
				top_products_by_value: [],
			});
		} catch (error) {
			console.error("Error loading analytics:", error);
		}
	};

	/**
	 * فلترة المنتجات
	 */
	const filteredStockLevels = useMemo(() => {
		let filtered = [...stockLevels];

		// فلترة البحث
		if (filters.search) {
			const searchTerm = filters.search.toLowerCase();
			filtered = filtered.filter(
				(stock) =>
					stock.product_name.toLowerCase().includes(searchTerm) ||
					stock.product_sku.toLowerCase().includes(searchTerm) ||
					stock.location_name.toLowerCase().includes(searchTerm),
			);
		}

		// فلترة الحالة
		if (filters.status !== "all") {
			filtered = filtered.filter(
				(stock) => stock.stock_status === filters.status,
			);
		}

		// فلترة المخزون المنخفض فقط
		if (showLowStockOnly) {
			filtered = filtered.filter(
				(stock) =>
					stock.stock_status === "low_stock" ||
					stock.stock_status === "out_of_stock",
			);
		}

		// الترتيب
		filtered.sort((a, b) => {
			let aValue: any = a[filters.sortBy as keyof StockLevel];
			let bValue: any = b[filters.sortBy as keyof StockLevel];

			if (typeof aValue === "string") {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (filters.sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [stockLevels, filters, showLowStockOnly]);

	/**
	 * الحصول على لون حالة المخزون
	 */
	const getStatusColor = (status: string) => {
		switch (status) {
			case "in_stock":
				return "green";
			case "low_stock":
				return "orange";
			case "out_of_stock":
				return "red";
			case "overstock":
				return "blue";
			default:
				return "gray";
		}
	};

	/**
	 * رندر جدول المنتجات
	 */
	const renderProductsTable = () => (
		<MotionCard
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			bg={bgColor}
			borderRadius="lg"
			borderWidth={1}
			borderColor={borderColor}>
			<CardHeader>
				<VStack spacing={4} align="stretch">
					<HStack justify="space-between">
						<Heading size="md">مستويات المخزون</Heading>
						<HStack>
							<FormControl display="flex" alignItems="center">
								<FormLabel htmlFor="low-stock-only" mb="0" fontSize="sm">
									المخزون المنخفض فقط
								</FormLabel>
								<Switch
									id="low-stock-only"
									isChecked={showLowStockOnly}
									onChange={(e) => setShowLowStockOnly(e.target.checked)}
								/>
							</FormControl>
							<Button
								leftIcon={<FiRefreshCw />}
								onClick={loadStockData}
								isLoading={loading}
								size="sm">
								تحديث
							</Button>
						</HStack>
					</HStack>

					{/* أدوات البحث والفلترة */}
					<HStack spacing={4}>
						<InputGroup>
							<InputLeftElement>
								<FiSearch />
							</InputLeftElement>
							<Input
								placeholder="البحث في المنتجات..."
								value={filters.search}
								onChange={(e) =>
									setFilters({ ...filters, search: e.target.value })
								}
							/>
						</InputGroup>
						<Select
							value={filters.status}
							onChange={(e) =>
								setFilters({ ...filters, status: e.target.value })
							}>
							<option value="all">جميع الحالات</option>
							<option value="in_stock">متوفر</option>
							<option value="low_stock">منخفض</option>
							<option value="out_of_stock">غير متوفر</option>
							<option value="overstock">زائد</option>
						</Select>
						<Select
							value={filters.sortBy}
							onChange={(e) =>
								setFilters({ ...filters, sortBy: e.target.value })
							}>
							<option value="product_name">ترتيب بالاسم</option>
							<option value="current_stock">ترتيب بالمخزون</option>
							<option value="total_value">ترتيب بالقيمة</option>
						</Select>
					</HStack>
				</VStack>
			</CardHeader>

			<CardBody>
				{loading ? (
					<Flex justify="center" py={8}>
						<Spinner size="lg" />
					</Flex>
				) : (
					<Box overflowX="auto">
						<Table variant="simple" size="sm">
							<Thead>
								<Tr>
									<Th>المنتج</Th>
									<Th>رمز المنتج</Th>
									<Th isNumeric>المخزون الحالي</Th>
									<Th isNumeric>محجوز</Th>
									<Th isNumeric>متاح</Th>
									<Th>الحالة</Th>
									<Th isNumeric>القيمة</Th>
									<Th>الموقع</Th>
									<Th>الإجراءات</Th>
								</Tr>
							</Thead>
							<Tbody>
								{filteredStockLevels.map((stock) => (
									<Tr key={`${stock.product_id}_${stock.location_id}`}>
										<Td fontWeight="medium">{stock.product_name}</Td>
										<Td fontSize="sm" color="gray.500">
											{stock.product_sku}
										</Td>
										<Td isNumeric>{stock.current_stock}</Td>
										<Td isNumeric color="orange.500">
											{stock.reserved_qty}
										</Td>
										<Td isNumeric fontWeight="bold">
											{stock.available_qty}
										</Td>
										<Td>
											<Badge colorScheme={getStatusColor(stock.stock_status)}>
												{stock.stock_status === "in_stock"
													? "متوفر"
													: stock.stock_status === "low_stock"
														? "منخفض"
														: stock.stock_status === "out_of_stock"
															? "غير متوفر"
															: stock.stock_status === "overstock"
																? "زائد"
																: "غير محدد"}
											</Badge>
										</Td>
										<Td isNumeric fontWeight="medium">
											{new Intl.NumberFormat("ar-AE", {
												style: "currency",
												currency: "AED",
												minimumFractionDigits: 0,
											}).format(stock.total_value)}
										</Td>
										<Td fontSize="sm">{stock.location_name}</Td>
										<Td>
											<HStack spacing={1}>
												<Tooltip label="عرض التفاصيل">
													<IconButton
														icon={<FiEye />}
														size="sm"
														variant="ghost"
														aria-label="عرض التفاصيل"
														onClick={() => {
															setSelectedProduct(stock);
															onOpen();
														}}
													/>
												</Tooltip>
												<Tooltip label="تحديث المخزون">
													<IconButton
														icon={<FiEdit />}
														size="sm"
														variant="ghost"
														aria-label="تحديث المخزون"
														onClick={() => {
															// فتح نموذج تحديث المخزون
														}}
													/>
												</Tooltip>
											</HStack>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>

						{filteredStockLevels.length === 0 && (
							<Flex justify="center" py={8}>
								<Text color="gray.500">
									لا توجد منتجات تطابق المعايير المحددة
								</Text>
							</Flex>
						)}
					</Box>
				)}
			</CardBody>
		</MotionCard>
	);

	/**
	 * رندر الإحصائيات
	 */
	const renderStatistics = () => {
		if (!analytics) return null;

		return (
			<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
				<MotionBox
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}>
					<Stat
						bg="white"
						p={4}
						rounded="lg"
						shadow="sm"
						borderLeft="4px"
						borderColor="brown.500">
						<StatLabel fontSize="xs">إجمالي المنتجات</StatLabel>
						<StatNumber color="brown.600" fontSize="lg">
							{analytics.total_products}
						</StatNumber>
						<StatHelpText fontSize="xs">منتجات في المخزون</StatHelpText>
					</Stat>
				</MotionBox>

				<MotionBox
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}>
					<Stat
						bg="white"
						p={4}
						rounded="lg"
						shadow="sm"
						borderLeft="4px"
						borderColor="green.500">
						<StatLabel fontSize="xs">القيمة الإجمالية</StatLabel>
						<StatNumber color="green.600" fontSize="lg">
							{analytics.total_stock_value.toLocaleString()} ر.س
						</StatNumber>
						<StatHelpText fontSize="xs">
							متوسط دوران: {analytics.stock_turnover_ratio.toFixed(1)}
						</StatHelpText>
					</Stat>
				</MotionBox>

				<MotionBox
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}>
					<Stat
						bg="white"
						p={4}
						rounded="lg"
						shadow="sm"
						borderLeft="4px"
						borderColor="orange.500">
						<StatLabel fontSize="xs">المخزون المنخفض</StatLabel>
						<StatNumber color="orange.600" fontSize="lg">
							{analytics.low_stock_products}
						</StatNumber>
						<StatHelpText fontSize="xs">تحتاج إعادة طلب</StatHelpText>
					</Stat>
				</MotionBox>

				<MotionBox
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}>
					<Stat
						bg="white"
						p={4}
						rounded="lg"
						shadow="sm"
						borderLeft="4px"
						borderColor="red.500">
						<StatLabel fontSize="xs">غير متوفر</StatLabel>
						<StatNumber color="red.600" fontSize="lg">
							{analytics.out_of_stock_products}
						</StatNumber>
						<StatHelpText fontSize="xs">نفذ من المخزون</StatHelpText>
					</Stat>
				</MotionBox>
			</SimpleGrid>
		);
	};

	return (
		<Box>
			{/* Header */}
			<VStack spacing={6} mb={8}>
				<Heading as="h1" size="xl" textAlign="center">
					إدارة المخزون
				</Heading>
				<Text color="gray.500" textAlign="center">
					مراقبة وإدارة مخزون المنتجات في الوقت الفعلي
				</Text>
			</VStack>

			{/* Tabs */}
			<Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
				<TabList>
					<Tab>نظرة عامة</Tab>
					<Tab>المنتجات</Tab>
					<Tab>التنبيهات</Tab>
					<Tab>التحليلات</Tab>
				</TabList>

				<TabPanels>
					{/* Overview Tab */}
					<TabPanel>
						<VStack spacing={6} align="stretch">
							{renderStatistics()}
							<Alert status="info">
								<AlertIcon />
								مرحباً بك في لوحة إدارة المخزون. استخدم التبويبات للتنقل بين
								الأقسام المختلفة.
							</Alert>
						</VStack>
					</TabPanel>

					{/* Products Tab */}
					<TabPanel>
						<VStack spacing={6} align="stretch">
							{renderProductsTable()}
						</VStack>
					</TabPanel>

					{/* Alerts Tab */}
					<TabPanel>
						<VStack spacing={6} align="stretch">
							<Card>
								<CardHeader>
									<Heading size="md">تنبيهات المخزون</Heading>
								</CardHeader>
								<CardBody>
									{stockAlerts.length > 0 ? (
										<VStack spacing={4} align="stretch">
											{stockAlerts.map((alert) => (
												<Alert
													key={alert.id}
													status={
														alert.severity === "critical"
															? "error"
															: alert.severity === "high"
																? "warning"
																: "info"
													}>
													<AlertIcon />
													<Box>
														<Text fontWeight="bold">{alert.product_name}</Text>
														<Text fontSize="sm">{alert.message}</Text>
													</Box>
												</Alert>
											))}
										</VStack>
									) : (
										<Text color="gray.500" textAlign="center">
											لا توجد تنبيهات حالياً
										</Text>
									)}
								</CardBody>
							</Card>
						</VStack>
					</TabPanel>

					{/* Analytics Tab */}
					<TabPanel>
						<VStack spacing={6} align="stretch">
							<Card>
								<CardHeader>
									<Heading size="md">تحليلات المخزون</Heading>
								</CardHeader>
								<CardBody>
									{analytics ? (
										<VStack spacing={4} align="stretch">
											<Text>
												متوسط عمر المخزون: {analytics.average_stock_age} يوم
											</Text>
											<Text>
												نسبة دوران المخزون:{" "}
												{(analytics.stock_turnover_ratio * 100).toFixed(1)}%
											</Text>
										</VStack>
									) : (
										<Text color="gray.500" textAlign="center">
											جاري تحميل التحليلات...
										</Text>
									)}
								</CardBody>
							</Card>
						</VStack>
					</TabPanel>
				</TabPanels>
			</Tabs>

			{/* Product Details Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>تفاصيل المخزون</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						{selectedProduct && (
							<VStack spacing={4} align="stretch">
								<Text fontWeight="bold" fontSize="lg">
									{selectedProduct.product_name}
								</Text>
								<SimpleGrid columns={2} spacing={4}>
									<Stat>
										<StatLabel>المخزون الحالي</StatLabel>
										<StatNumber>{selectedProduct.current_stock}</StatNumber>
									</Stat>
									<Stat>
										<StatLabel>الكمية المتاحة</StatLabel>
										<StatNumber>{selectedProduct.available_qty}</StatNumber>
									</Stat>
									<Stat>
										<StatLabel>الكمية المحجوزة</StatLabel>
										<StatNumber color="orange.500">
											{selectedProduct.reserved_qty}
										</StatNumber>
									</Stat>
									<Stat>
										<StatLabel>القيمة الإجمالية</StatLabel>
										<StatNumber>
											{new Intl.NumberFormat("ar-AE", {
												style: "currency",
												currency: "AED",
											}).format(selectedProduct.total_value)}
										</StatNumber>
									</Stat>
								</SimpleGrid>

								<Box>
									<Text fontWeight="medium" mb={2}>
										مستوى المخزون
									</Text>
									<Progress
										value={
											(selectedProduct.available_qty /
												selectedProduct.max_stock_level) *
											100
										}
										colorScheme={getStatusColor(selectedProduct.stock_status)}
										size="lg"
										borderRadius="md"
									/>
								</Box>
							</VStack>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default StockManager;
