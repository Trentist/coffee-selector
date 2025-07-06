/**
 * ProductGrid Component
 * Grid layout for displaying multiple product cards
 */

import React from "react";
import { SimpleGrid, Box, Text, Center, Spinner } from "@chakra-ui/react";
// // import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { ProductGridProps, Product } from "./types/ProductCard.types";

const MotionBox = Box;

const ProductGrid: React.FC<ProductGridProps> = ({
	products,
	columns = 4,
	gap = 4,
	variant = "default",
	showFilters = false,
	onProductClick,
	onAddToCart,
}) => {
	if (!products || products.length === 0) {
		return (
			<Center py={10}>
				<Text fontSize="lg" color="gray.500">
					لا توجد منتجات متاحة
				</Text>
			</Center>
		);
	}

	const handleProductClick = (product: Product) => {
		if (onProductClick) {
			onProductClick(product);
		}
	};

	const handleAddToCart = (product: Product) => {
		if (onAddToCart) {
			onAddToCart(product);
		}
	};

	return (
		<MotionBox>
			<SimpleGrid
				columns={{ base: 1, sm: 2, md: 3, lg: columns }}
				spacing={gap}
				py={4}>
				{products.map((product) => (
					<Box key={product.id} display="flex" justifyContent="center">
						<ProductCard
							product={product}
							variant={variant}
							onProductClick={handleProductClick}
							onAddToCart={handleAddToCart}
						/>
					</Box>
				))}
			</SimpleGrid>
		</MotionBox>
	);
};

export default ProductGrid;
