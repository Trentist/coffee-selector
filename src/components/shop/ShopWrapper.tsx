"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
	Box,
	Grid,
	GridItem,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { EnhancedFilterPanel } from "@/components/filters";
import { Product, ProductCategory } from "@/odoo-schema-full/types";
import ShopContent from "./ShopContent";
import CartContent from "./CartContent";
import FavoritesContent from "./FavoritesContent";
import CategoryContent from "./CategoryContent";

// ============================================================================
// TYPES - الأنواع
// ============================================================================

export type ShopPageType = "shop" | "cart" | "favorites" | "category";

interface ShopWrapperProps {
	products: Product[];
	categories: ProductCategory[];
	initialPage?: ShopPageType;
	initialCategoryId?: number;
}

interface FilterState {
	activeFilters: Record<
		string,
		string | number | string[] | { min: number; max: number }
	>;
	productCount: number;
	isLoading: boolean;
}

interface PageState {
	currentPage: ShopPageType;
	selectedCategoryId?: number;
	selectedCategory?: ProductCategory;
}

// ============================================================================
// SHOP WRAPPER COMPONENT - مكون غلاف المتجر
// ============================================================================

const ShopWrapper: React.FC<ShopWrapperProps> = ({
	products,
	categories,
	initialPage = "shop",
	initialCategoryId,
}) => {
	// ============================================================================
	// STATE MANAGEMENT - إدارة الحالة
	// ============================================================================
	const [filterState, setFilterState] = useState<FilterState>({
		activeFilters: {},
		productCount: products.length,
		isLoading: false,
	});

	const [pageState, setPageState] = useState<PageState>({
		currentPage: initialPage as ShopPageType,
		selectedCategoryId: initialCategoryId,
		selectedCategory: initialCategoryId
			? categories.find((cat) => cat.id === initialCategoryId)
			: undefined,
	});

	// ============================================================================
	// RESPONSIVE CONFIGURATION - إعدادات الاستجابة
	// ============================================================================

	const isMobile = useBreakpointValue({ base: true, md: false });
	const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

	const filterColumnSpan = useMemo(() => {
		if (isMobile) return 12;
		if (isTablet) return 3;
		return 3;
	}, [isMobile, isTablet]);

	const contentColumnSpan = useMemo(() => {
		if (isMobile) return 12;
		if (isTablet) return 9;
		return 9;
	}, [isMobile, isTablet]);

	// ============================================================================
	// FILTER HANDLERS - معالجات الفلترة
	// ============================================================================

	const handleFilterChange = useCallback(
		(newFilters: Record<string, any>) => {
			setFilterState((prev) => ({
				...prev,
				activeFilters: newFilters,
				isLoading: true,
			}));

			// Simulate filter processing
			setTimeout(() => {
				setFilterState((prev) => ({
					...prev,
					isLoading: false,
					productCount: Math.floor(Math.random() * products.length) + 1,
				}));
			}, 300);
		},
		[products.length],
	);

	const handleFilterReset = useCallback(() => {
		setFilterState({
			activeFilters: {},
			productCount: products.length,
			isLoading: false,
		});
	}, [products.length]);

	// ============================================================================
	// NAVIGATION HANDLERS - معالجات التنقل
	// ============================================================================

	const navigateToPage = useCallback(
		(page: ShopPageType, categoryId?: number) => {
			setPageState({
				currentPage: page,
				selectedCategoryId: categoryId,
				selectedCategory: categoryId
					? categories.find((cat) => cat.id === categoryId)
					: undefined,
			});
		},
		[categories],
	);

	const navigateToCategory = useCallback(
		(categoryId: number) => {
			const category = categories.find((cat) => cat.id === categoryId);
			if (category) {
				setPageState({
					currentPage: "category",
					selectedCategoryId: categoryId,
					selectedCategory: category,
				});
			}
		},
		[categories],
	);

	// ============================================================================
	// FILTERED PRODUCTS - المنتجات المفلترة
	// ============================================================================

	const filteredProducts = useMemo(() => {
		let filtered = products;

		// Apply category filter if on category page
		if (pageState.currentPage === "category" && pageState.selectedCategoryId) {
			filtered = filtered.filter((product) =>
				product.categories.some(
					(cat) => cat.id === pageState.selectedCategoryId,
				),
			);
		}

		// Apply active filters
		if (Object.keys(filterState.activeFilters).length > 0) {
			filtered = filtered.filter((product) => {
				// Price filter
				if (filterState.activeFilters.price_range) {
					const priceRange = filterState.activeFilters.price_range as {
						min: number;
						max: number;
					};
					const price = product.price.regularPrice.value;
					if (
						(priceRange.min && price < priceRange.min) ||
						(priceRange.max && price > priceRange.max)
					) {
						return false;
					}
				}

				// Category filter
				if (filterState.activeFilters.category_id) {
					const categoryId = filterState.activeFilters.category_id as number;
					if (!product.categories.some((cat) => cat.id === categoryId)) {
						return false;
					}
				}

				// Stock filter
				if (filterState.activeFilters.in_stock) {
					if (!product.is_in_stock) {
						return false;
					}
				}

				return true;
			});
		}

		return filtered;
		
	}, [products, pageState, filterState.activeFilters]);

	// ============================================================================
	// CONTENT RENDERER - عارض المحتوى
	// ============================================================================

	const renderContent = () => {
		switch (pageState.currentPage) {
			case "shop":
				return (
					<ShopContent
						products={filteredProducts}
						filteredProducts={filteredProducts}
						activeFiltersCount={Object.keys(filterState.activeFilters).length}
						onNavigateToCategory={navigateToCategory}
						onNavigateToCart={() => navigateToPage("cart")}
						onNavigateToFavorites={() => navigateToPage("favorites")}
					/>
				);

			case "cart":
				return (
					<CartContent
						onNavigateToShop={() => navigateToPage("shop")}
						onNavigateToFavorites={() => navigateToPage("favorites")}
					/>
				);

			case "favorites":
				return (
					<FavoritesContent
						onNavigateToShop={() => navigateToPage("shop")}
						onNavigateToCart={() => navigateToPage("cart")}
					/>
				);

			case "category":
				return (
					<CategoryContent
						category={pageState.selectedCategory!}
						products={filteredProducts}
						filteredProducts={filteredProducts}
						activeFiltersCount={Object.keys(filterState.activeFilters).length}
						onNavigateToCategory={navigateToCategory}
						onNavigateToCart={() => navigateToPage("cart")}
						onNavigateToFavorites={() => navigateToPage("favorites")}
					/>
				);

			default:
				return (
					<ShopContent
						products={filteredProducts}
						filteredProducts={filteredProducts}
						activeFiltersCount={Object.keys(filterState.activeFilters).length}
						onNavigateToCategory={navigateToCategory}
						onNavigateToCart={() => navigateToPage("cart")}
						onNavigateToFavorites={() => navigateToPage("favorites")}
					/>
				);
		}
	};

	// ============================================================================
	// RENDER - العرض
	// ============================================================================

	return (
		<Box
			bg={useColorModeValue("gray.50", "gray.900")}
			minH="100vh"
			py={4}
			px={4}>
			<Grid templateColumns={`repeat(12, 1fr)`} gap={6} maxW="1400px" mx="auto">
				{/* Filter Panel - لوحة الفلترة */}
				<GridItem colSpan={filterColumnSpan}>
					<EnhancedFilterPanel
						categories={categories}
						products={products}
						activeFilters={filterState.activeFilters}
						productCount={filterState.productCount}
						isLoading={filterState.isLoading}
						onFilterChange={handleFilterChange}
						onFilterReset={handleFilterReset}
						currentPage={pageState.currentPage}
						selectedCategory={pageState.selectedCategory}
						onNavigateToCategory={navigateToCategory}
						onNavigateToCart={() => navigateToPage("cart")}
						onNavigateToFavorites={() => navigateToPage("favorites")}
					/>
				</GridItem>

				{/* Main Content - المحتوى الرئيسي */}
				<GridItem colSpan={contentColumnSpan}>
					<Box
						bg={useColorModeValue("white", "gray.800")}
						borderRadius="lg"
						boxShadow="sm"
						p={6}
						minH="600px">
						{renderContent()}
					</Box>
				</GridItem>
			</Grid>
		</Box>
	);
};

export default ShopWrapper;
