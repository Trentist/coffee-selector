"use client";

import React, { useState, useMemo } from "react";
import {
	Box,
	Flex,
	HStack,
	Text,
	Select,
	Button,
	IconButton,
	useColorModeValue,
	Badge,
	Divider,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@chakra-ui/react";
import { MdShoppingCart, MdFavorite } from "react-icons/md";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { ProductGrid } from "@/components/product";
import { Product, ProductCategory } from "@/odoo-schema-full/types";

interface ShopContentProps {
	products: Product[];
	filteredProducts: Product[];
	activeFiltersCount: number;
	onNavigateToCategory: (categoryId: number) => void;
	onNavigateToCart: () => void;
	onNavigateToFavorites: () => void;
}

const ShopContent: React.FC<ShopContentProps> = ({
	products,
	filteredProducts,
	activeFiltersCount,
	onNavigateToCategory,
	onNavigateToCart,
	onNavigateToFavorites,
}) => {
	console.log("ShopContent rendered with products:", products);
	const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">(
		"grid",
	);
	const [currentSortBy, setCurrentSortBy] = useState<string>("newest");

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.600", "gray.400");

	// ============================================================================
	// SORTED PRODUCTS - المنتجات المرتبة
	// ============================================================================

	const sortedProducts = useMemo(() => {
		const sorted = [...filteredProducts];
		console.log("Sorting products by:", currentSortBy);
		switch (currentSortBy) {
			case "newest":
				sorted.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
				);
				break;
			case "oldest":
				sorted.sort(
					(a, b) =>
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
				);
				break;
			case "price_asc":
				sorted.sort(
					(a, b) => a.price.regularPrice.value - b.price.regularPrice.value,
				);
				break;
			case "price_desc":
				sorted.sort(
					(a, b) => b.price.regularPrice.value - a.price.regularPrice.value,
				);
				break;
			case "name_asc":
				sorted.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "name_desc":
				sorted.sort((a, b) => b.name.localeCompare(a.name));
				break;
			default:
				break;
		}

		return sorted;
	}, [filteredProducts, currentSortBy]);

	// ============================================================================
	// RENDER - العرض
	// ============================================================================

	return (
		<Box>
			{/* Header - الترويسة */}
			<Flex
				justifyContent="space-between"
				alignItems="center"
				mb={6}
				pb={4}
				borderBottom="1px"
				borderColor={borderColor}>
				<Box>
					<Text fontSize="2xl" fontWeight="bold" mb={2}>
						جميع المنتجات
					</Text>
					<HStack spacing={4}>
						<Text color={textColor}>{filteredProducts.length} منتج</Text>
						{activeFiltersCount > 0 && (
							<Badge colorScheme="blue" variant="subtle">
								{activeFiltersCount} فلتر نشط
							</Badge>
						)}
					</HStack>
				</Box>

				{/* Navigation Buttons - أزرار التنقل */}
				<HStack spacing={3}>
					<Button
						leftIcon={<MdShoppingCart />}
						variant="outline"
						size="sm"
						onClick={onNavigateToCart}>
						العربة
					</Button>
					<Button
						leftIcon={<MdFavorite />}
						variant="outline"
						size="sm"
						onClick={onNavigateToFavorites}>
						المفضلة
					</Button>
				</HStack>
			</Flex>

			{/* Controls - عناصر التحكم */}
			<Flex
				justifyContent="space-between"
				alignItems="center"
				mb={6}
				p={4}
				bg={useColorModeValue("gray.50", "gray.700")}
				borderRadius="md">
				{/* Sort Controls - عناصر الترتيب */}
				<HStack spacing={4}>
					<Text fontSize="sm" color={textColor}>
						ترتيب حسب:
					</Text>
					<Select
						size="sm"
						value={currentSortBy}
						onChange={(e) => setCurrentSortBy(e.target.value)}
						w="auto"
						minW="150px">
						<option value="newest">الأحدث</option>
						<option value="oldest">الأقدم</option>
						<option value="price_asc">السعر: من الأقل للأعلى</option>
						<option value="price_desc">السعر: من الأعلى للأقل</option>
						<option value="name_asc">الاسم: أ-ي</option>
						<option value="name_desc">الاسم: ي-أ</option>
					</Select>
				</HStack>

				{/* View Mode Controls - عناصر وضع العرض */}
				<HStack spacing={2}>
					<IconButton
						aria-label="عرض شبكي"
						icon={<ViewIcon />}
						size="sm"
						variant={currentViewMode === "grid" ? "solid" : "outline"}
						colorScheme="blue"
						onClick={() => setCurrentViewMode("grid")}
					/>
					<IconButton
						aria-label="عرض قائمة"
						icon={<ViewOffIcon />}
						size="sm"
						variant={currentViewMode === "list" ? "solid" : "outline"}
						colorScheme="blue"
						onClick={() => setCurrentViewMode("list")}
					/>
				</HStack>
			</Flex>

			{/* Products Grid - شبكة المنتجات */}
			<ProductGrid
				products={sortedProducts}
				viewMode={currentViewMode}
				onCategoryClick={onNavigateToCategory}
			/>

			{/* Empty State - حالة فارغة */}
			{filteredProducts.length === 0 && (
				<Box textAlign="center" py={12} color={textColor}>
					<Text fontSize="lg" mb={2}>
						لم يتم العثور على منتجات
					</Text>
					<Text fontSize="sm">جرب تغيير الفلاتر أو البحث عن منتجات أخرى</Text>
				</Box>
			)}
		</Box>
	);
};

export default ShopContent;
