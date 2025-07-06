"use client";

import React, { useState, useCallback } from "react";
import {
	Box,
	Grid,
	GridItem,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { EnhancedFilterPanel } from "@/components/filters";
import { ProductGrid } from "@/components/product";
import { Product, ProductCategory } from "@/odoo-schema-full/types";
import ShopContent from "./ShopContent";

interface ShopLayoutProps {
	products: Product[];
	categories: ProductCategory[];
}

interface FilterState {
	activeFilters: Record<
		string,
		string | number | string[] | { min: number; max: number }
	>;
	productCount: number;
	isLoading: boolean;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ products, categories }) => {
	const [filterState, setFilterState] = useState<FilterState>({
		activeFilters: {},
		productCount: products.length,
		isLoading: false,
	});

	const isMobile = useBreakpointValue({ base: true, lg: false });
	const [isFilterOpen, setIsFilterOpen] = useState(!isMobile);

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	// إنشاء أقسام الفلترة
	const filterSections = [
		{
			id: "categories",
			title: "الفئات",
			type: "checkbox" as const,
			options: categories.map((cat) => ({
				id: cat.id.toString(),
				label: cat.name,
				count: products.filter((p) => p.categories.some((c) => c.id === cat.id))
					.length,
			})),
		},
		{
			id: "price",
			title: "السعر",
			type: "range" as const,
			min: 0,
			max: Math.max(...products.map((p) => p.price.regularPrice.value), 0),
			step: 10,
		},
		{
			id: "stock",
			title: "المخزون",
			type: "checkbox" as const,
			options: [
				{
					id: "in_stock",
					label: "متوفر",
					count: products.filter((p) => p.is_in_stock).length,
				},
				{
					id: "out_of_stock",
					label: "غير متوفر",
					count: products.filter((p) => !p.is_in_stock).length,
				},
			],
		},
	];

	const handleFiltersChange = useCallback(
		(
			filters: Record<
				string,
				string | number | string[] | { min: number; max: number }
			>,
		) => {
			setFilterState((prev) => ({
				...prev,
				activeFilters: filters,
				productCount: products.length, // سيتم تحديثه لاحقاً
			}));
		},
		[products.length],
	);

	const toggleFilter = () => {
		setIsFilterOpen(!isFilterOpen);
	};

	return (
		<Box bg={bgColor} minH="100vh">
			<Grid
				templateAreas={{
					base: `"main"`,
					lg: `"sidebar main"`,
				}}
				templateColumns={{
					base: "1fr",
					lg: "300px 1fr",
				}}
				gap={6}
				p={4}>
				{/* Sidebar - الفلترة */}
				<GridItem
					area="sidebar"
					display={{ base: isFilterOpen ? "block" : "none", lg: "block" }}
					borderRight={{ base: "none", lg: "1px solid" }}
					borderColor={borderColor}
					pr={{ base: 0, lg: 4 }}>
					<EnhancedFilterPanel
						sections={filterSections}
						onFiltersChange={handleFiltersChange}
						activeFilters={filterState.activeFilters}
						productCount={filterState.productCount}
						isLoading={filterState.isLoading}
					/>
				</GridItem>

				{/* Main Content - المحتوى الرئيسي */}
				<GridItem area="main">
					<Box>
						{/* Filter Toggle Button for Mobile */}
						{isMobile && (
							<Box mb={4}>
								<button
									onClick={toggleFilter}
									style={{
										padding: "8px 16px",
										backgroundColor: "#2D3748",
										color: "white",
										border: "none",
										borderRadius: "4px",
										cursor: "pointer",
									}}>
									{isFilterOpen ? "إخفاء الفلترة" : "إظهار الفلترة"}
								</button>
							</Box>
						)}

						{/* Main Content */}
						<ShopContent
							products={products}
							filteredProducts={products}
							activeFiltersCount={Object.keys(filterState.activeFilters).length}
						/>
					</Box>
				</GridItem>
			</Grid>
		</Box>
	);
};

export default ShopLayout;
