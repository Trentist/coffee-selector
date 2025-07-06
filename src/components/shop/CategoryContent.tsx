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
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@chakra-ui/react";
import { MdShoppingCart, MdFavorite } from "react-icons/md";
import { ProductGrid } from "@/components/product";
import { Product, ProductCategory } from "@/odoo-schema-full/types";

interface CategoryContentProps {
	category: ProductCategory;
	products: Product[];
	filteredProducts: Product[];
	activeFiltersCount: number;
	onNavigateToCategory: (categoryId: number) => void;
	onNavigateToCart: () => void;
	onNavigateToFavorites: () => void;
}

const CategoryContent: React.FC<CategoryContentProps> = ({
	category,
	products,
	filteredProducts,
	activeFiltersCount,
	onNavigateToCategory,
	onNavigateToCart,
	onNavigateToFavorites,
}) => {
	const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">(
		"grid",
	);
	const [currentSortBy, setCurrentSortBy] = useState<string>("newest");

	const textColor = useColorModeValue("gray.600", "gray.400");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	// ============================================================================
	// SORTED PRODUCTS - المنتجات المرتبة
	// ============================================================================

	const sortedProducts = useMemo(() => {
		const sorted = [...filteredProducts];

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
			{/* Breadcrumb - مسار التنقل */}
			<Breadcrumb separator=">" mb={4} color={textColor} fontSize="sm">
				<BreadcrumbItem>
					<BreadcrumbLink onClick={() => onNavigateToCategory(0)}>
						الرئيسية
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink onClick={() => onNavigateToCategory(0)}>
						المنتجات
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem isCurrentPage>
					<BreadcrumbLink>{category.name}</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>

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
						{category.name}
					</Text>
					<HStack spacing={4}>
						<Text color={textColor}>{filteredProducts.length} منتج</Text>
						{activeFiltersCount > 0 && (
							<Badge colorScheme="blue" variant="subtle">
								{activeFiltersCount} فلتر نشط
							</Badge>
						)}
					</HStack>
					{category.description && (
						<Text color={textColor} mt={2} fontSize="sm">
							{category.description}
						</Text>
					)}
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

			{/* Subcategories - الفئات الفرعية */}
			{category.children && category.children.length > 0 && (
				<Box mb={6}>
					<Text fontSize="lg" fontWeight="semibold" mb={3}>
						الفئات الفرعية
					</Text>
					<HStack spacing={3} flexWrap="wrap">
						{category.children.map((child) => (
							<Button
								key={child.id}
								variant="outline"
								size="sm"
								onClick={() => onNavigateToCategory(child.id)}>
								{child.name}
							</Button>
						))}
					</HStack>
				</Box>
			)}

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
						لم يتم العثور على منتجات في هذه الفئة
					</Text>
					<Text fontSize="sm">جرب تغيير الفلاتر أو البحث في فئات أخرى</Text>
				</Box>
			)}
		</Box>
	);
};

export default CategoryContent;
