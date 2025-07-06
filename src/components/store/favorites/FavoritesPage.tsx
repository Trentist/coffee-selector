"use client";
"use client";

/**
 * Favorites Page Component
 * Displays user's favorite products with grid and list views
 */

import React, { useState } from "react";
import {
	Box,
	Text,
	Container,
	Grid,
	GridItem,
	VStack,
	HStack,
	Image,
	Badge,
	IconButton,
	Tooltip,
	useColorModeValue,
	Heading,
	Button,
	Flex,
	useDisclosure,
} from "@chakra-ui/react";
// import { motion, React.Fragment } from "framer-motion";
import {
	FiShoppingCart,
	FiHeart,
	FiEye,
	FiShare2,
	FiTrash2,
	FiGrid,
	FiList,
} from "react-icons/fi";
import { FavoritesPageProps, ViewMode } from "./types/FavoritesPage.types";
import {
	getImageUrl,
	formatPrice,
	getGridTemplateColumns,
} from "./helpers/FavoritesPage.helpers";

const MotionBox = Box;
const MotionGridItem = GridItem;

const FavoritesPage: React.FC<FavoritesPageProps> = ({
	items = [],
	loading = false,
	error = null,
}) => {
	// Local state
	const [viewMode, setViewMode] = useState<ViewMode["type"]>("grid");

	// Theme colors
	const bg = useColorModeValue("#fff", "#0D1616");
	const cardBg = useColorModeValue("gray.50", "gray.800");
	const color = useColorModeValue("#0D1616", "#fff");
	const borderColor = useColorModeValue("#E2E8F0", "#2D3748");

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring" as const, stiffness: 300, damping: 24 },
		},
		exit: {
			y: -20,
			opacity: 0,
			transition: { duration: 0.2 },
		},
	};

	// Event handlers
	const handleRemoveFromWishlist = (productId: string) => {
		// TODO: Implement remove from favorites
		console.log("Remove from favorites:", productId);
	};

	const handleAddToCart = (product: any) => {
		// TODO: Implement add to cart
		console.log("Add to cart:", product);
	};

	const handleShareProduct = async (product: any) => {
		// TODO: Implement share product
		console.log("Share product:", product);
	};

	const handleViewProduct = (productId: string) => {
		// TODO: Implement view product
		console.log("View product:", productId);
	};

	if (loading) {
		return (
			<Container maxW="1400px" py={8}>
				<VStack spacing={6}>
					<Heading as="h1" size="xl" textAlign="center" color={color}>
						المفضلة
					</Heading>
					<Text>جاري التحميل...</Text>
				</VStack>
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxW="1400px" py={8}>
				<VStack spacing={6}>
					<Heading as="h1" size="xl" textAlign="center" color={color}>
						المفضلة
					</Heading>
					<Text color="red.500">خطأ: {error}</Text>
				</VStack>
			</Container>
		);
	}

	return (
		<Container maxW="1400px" py={8}>
			{/* Header */}
			<VStack spacing={6} mb={8}>
				<Heading as="h1" size="xl" textAlign="center" color={color}>
					المفضلة
				</Heading>

				{items.length > 0 && (
					<HStack spacing={4} justify="space-between" w="100%">
						<Text color="gray.500">{items.length} منتج في المفضلة</Text>

						{/* View Mode Toggle */}
						<HStack spacing={2}>
							<Tooltip label="عرض شبكي">
								<IconButton
									aria-label="Grid view"
									icon={<FiGrid />}
									size="sm"
									variant={viewMode === "grid" ? "solid" : "outline"}
									colorScheme="green"
									onClick={() => setViewMode("grid")}
								/>
							</Tooltip>
							<Tooltip label="عرض قائمة">
								<IconButton
									aria-label="List view"
									icon={<FiList />}
									size="sm"
									variant={viewMode === "list" ? "solid" : "outline"}
									colorScheme="green"
									onClick={() => setViewMode("list")}
								/>
							</Tooltip>
						</HStack>
					</HStack>
				)}
			</VStack>

			{/* Content */}
			{items.length > 0 ? (
				<div>
					<Grid templateColumns={getGridTemplateColumns(viewMode)} gap={6}>
						<React.Fragment>
							{items.map((item) => (
								<MotionGridItem key={item.id}>
									<Box
										p={4}
										borderWidth="0.2px"
										borderColor={borderColor}
										borderRadius="0"
										bg={cardBg}
										_hover={{
											shadow: "lg",
											transform: "translateY(-4px)",
											borderColor: useColorModeValue("green.200", "green.600"),
										}}
										transition="all 0.3s ease">
										{viewMode === "grid" ? (
											// Grid View
											<VStack spacing={4} align="stretch">
												{/* Product Image */}
												<Box
													position="relative"
													cursor="pointer"
													onClick={() => handleViewProduct(item.id)}
													borderRadius="0"
													overflow="hidden"
													_hover={{ transform: "scale(1.05)" }}
													transition="transform 0.2s">
													<Image
														src={getImageUrl(item.image || item.image_profile)}
														alt={item.name || item.title}
														w="100%"
														h="200px"
														objectFit="cover"
														fallbackSrc="/placeholder-image.jpg"
													/>
													<Box
														position="absolute"
														top="0"
														left="0"
														right="0"
														bottom="0"
														bg="blackAlpha.400"
														opacity="0"
														_hover={{ opacity: 1 }}
														transition="opacity 0.2s"
														display="flex"
														alignItems="center"
														justifyContent="center">
														<FiEye color="white" size="32px" />
													</Box>
												</Box>

												{/* Product Details */}
												<VStack align="start" spacing={2}>
													<Text
														fontWeight="bold"
														fontSize="md"
														noOfLines={2}
														cursor="pointer"
														onClick={() => handleViewProduct(item.id)}
														_hover={{ color: "green.500" }}
														transition="color 0.2s">
														{item.name || item.title}
													</Text>
													<Badge
														colorScheme="gray"
														variant="subtle"
														borderRadius="0"
														px={2}>
														{item.category}
													</Badge>
													<Text
														fontWeight="bold"
														color="green.500"
														fontSize="lg">
														{formatPrice(item.price)}
													</Text>
												</VStack>

												{/* Action Buttons */}
												<HStack spacing={2} justify="center">
													<Tooltip label="إضافة للسلة" hasArrow>
														<IconButton
															size="md"
															colorScheme="green"
															aria-label="إضافة للسلة"
															icon={<FiShoppingCart />}
															onClick={() => handleAddToCart(item)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													<Tooltip label="عرض سريع" hasArrow>
														<IconButton
															size="md"
															variant="outline"
															colorScheme="blue"
															aria-label="عرض سريع"
															icon={<FiEye />}
															onClick={() => handleViewProduct(item.id)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													<Tooltip label="مشاركة" hasArrow>
														<IconButton
															size="md"
															variant="outline"
															colorScheme="gray"
															aria-label="مشاركة"
															icon={<FiShare2 />}
															onClick={() => handleShareProduct(item)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													<Tooltip label="إزالة من المفضلة" hasArrow>
														<IconButton
															size="md"
															variant="outline"
															colorScheme="red"
															aria-label="إزالة من المفضلة"
															icon={<FiTrash2 />}
															onClick={() => handleRemoveFromWishlist(item.id)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>
												</HStack>
											</VStack>
										) : (
											// List View
											<HStack spacing={4} align="start">
												{/* Product Image */}
												<Box
													flexShrink={0}
													cursor="pointer"
													onClick={() => handleViewProduct(item.id)}
													position="relative"
													borderRadius="0"
													overflow="hidden"
													_hover={{ transform: "scale(1.05)" }}
													transition="transform 0.2s">
													<Image
														src={getImageUrl(item.image || item.image_profile)}
														alt={item.name || item.title}
														w="120px"
														h="120px"
														objectFit="cover"
														fallbackSrc="/placeholder-image.jpg"
													/>
												</Box>

												{/* Product Details */}
												<VStack flex={1} align="start" spacing={2}>
													<Text
														fontWeight="bold"
														fontSize="lg"
														cursor="pointer"
														onClick={() => handleViewProduct(item.id)}
														_hover={{ color: "green.500" }}
														transition="color 0.2s">
														{item.name || item.title}
													</Text>
													<Badge
														colorScheme="gray"
														variant="subtle"
														borderRadius="0"
														px={3}>
														{item.category}
													</Badge>
													<Text
														fontWeight="bold"
														color="green.500"
														fontSize="xl">
														{formatPrice(item.price)}
													</Text>
												</VStack>

												{/* Action Buttons */}
												<VStack spacing={2}>
													<Tooltip label="إضافة للسلة" hasArrow>
														<IconButton
															size="md"
															colorScheme="green"
															aria-label="إضافة للسلة"
															icon={<FiShoppingCart />}
															onClick={() => handleAddToCart(item)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													<Tooltip label="عرض سريع" hasArrow>
														<IconButton
															size="md"
															variant="outline"
															colorScheme="blue"
															aria-label="عرض سريع"
															icon={<FiEye />}
															onClick={() => handleViewProduct(item.id)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													<Tooltip label="مشاركة" hasArrow>
														<IconButton
															size="md"
															variant="outline"
															colorScheme="gray"
															aria-label="مشاركة"
															icon={<FiShare2 />}
															onClick={() => handleShareProduct(item)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													<Tooltip label="إزالة من المفضلة" hasArrow>
														<IconButton
															size="md"
															variant="outline"
															colorScheme="red"
															aria-label="إزالة من المفضلة"
															icon={<FiTrash2 />}
															onClick={() => handleRemoveFromWishlist(item.id)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>
												</VStack>
											</HStack>
										)}
									</Box>
								</MotionGridItem>
							))}
						</React.Fragment>
					</Grid>
				</div>
			) : (
				// Empty State
				<VStack spacing={6} py={12}>
					<Box textAlign="center">
						<FiHeart size="64px" color="gray" />
					</Box>
					<Heading as="h2" size="lg" color="gray.500">
						المفضلة فارغة
					</Heading>
					<Text color="gray.400" textAlign="center">
						لم تقم بإضافة أي منتجات للمفضلة بعد
					</Text>
					<Button colorScheme="green" size="lg">
						تصفح المنتجات
					</Button>
				</VStack>
			)}
		</Container>
	);
};

export default FavoritesPage;
