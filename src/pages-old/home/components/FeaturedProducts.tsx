/**
 * Featured Products Component - مكون المنتجات المميزة
 * تم تحديثه لاستخدام النظام الموحد الجديد
 */
"use client";

import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	VStack,
	Text,
	SimpleGrid,
	useColorModeValue,
	Spinner,
	Alert,
	AlertIcon,
	Button,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// استيراد الأنواع الجديدة
import {
	FeaturedProduct,
	FeaturedProductsProps,
} from "../types/HomePage.types";

// استيراد خدمة المنتجات الجديدة
import { ProductService } from "../../../odoo-schema-full/services/product-service";

// استيراد المكونات والثوابت
import ProductCard from "@/components/product/ProductCard";
import {
	FEATURED_PRODUCTS_CONSTANTS,
	ERROR_CONSTANTS,
} from "../../../constants/home-constants";

const MotionBox = Box;

// ============================================================================
// FEATURED PRODUCTS COMPONENT - مكون المنتجات المميزة
// ============================================================================

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
	products: initialProducts = [],
	loading: initialLoading = false,
	error: initialError,
	config = {},
}) => {
	const t = useTranslations("home");
	const textColor = useColorModeValue("gray.800", "white");
	const [products, setProducts] = useState<FeaturedProduct[]>(initialProducts);
	const [loading, setLoading] = useState(initialLoading);
	const [error, setError] = useState(initialError);

	// تهيئة خدمة المنتجات
	const productService = new ProductService();

	// جلب المنتجات المميزة
	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			if (initialProducts.length > 0) {
				setProducts(initialProducts);
				return;
			}

			setLoading(true);
			setError(undefined);

			try {
				const limit = config?.limit || 8;
				const result = await productService.getFeaturedProducts(limit);

				if (result.success && result.data) {
					// تحويل المنتجات إلى FeaturedProduct
					const featuredProducts: FeaturedProduct[] = result.data.map(
						(product) => ({
							...product,
							rating: product.average_rating || 0,
							reviewCount: product.review_count || 0,
							isNew: product.created_at
								? new Date().getTime() -
										new Date(product.created_at).getTime() <
									30 * 24 * 60 * 60 * 1000
								: false,
							isSale: product.price?.specialPrice ? true : false,
							discount:
								product.price?.regularPrice && product.price?.specialPrice
									? Math.round(
											((product.price.regularPrice.value -
												product.price.specialPrice.value) /
												product.price.regularPrice.value) *
												100,
										)
									: 0,
							originalPrice: product.price?.regularPrice?.value || 0,
						}),
					);

					setProducts(featuredProducts);
				} else {
					setError(result.error || t(ERROR_CONSTANTS.FETCH_ERROR));
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: t(ERROR_CONSTANTS.UNEXPECTED_ERROR),
				);
			} finally {
				setLoading(false);
			}
		};

		fetchFeaturedProducts();
	}, [initialProducts, config?.limit, t]);

	// معالج النقر على المنتج
	const handleProductClick = (product: FeaturedProduct) => {
		// يمكن إضافة التنقل إلى صفحة المنتج هنا
		console.log("تم النقر على المنتج:", product.name);
		// router.push(`/product/${product.url_key || product.id}`);
	};

	// معالج إعادة المحاولة
	const handleRetry = () => {
		setProducts([]);
		setError(undefined);
		// إعادة تشغيل useEffect
	};

	return (
		<Box py={16}>
			<Container maxW="container.xl">
				<VStack spacing={12}>
					{/* Header */}
					<VStack spacing={4} textAlign="center">
						<Text
							fontSize={{ base: "2xl", md: "4xl" }}
							fontWeight="bold"
							color={textColor}>
							{t(FEATURED_PRODUCTS_CONSTANTS.TITLE)}
						</Text>
						<Text
							fontSize="lg"
							color={useColorModeValue("gray.600", "gray.300")}
							maxW="2xl">
							{t(FEATURED_PRODUCTS_CONSTANTS.SUBTITLE)}
						</Text>
					</VStack>

					{/* Loading State */}
					{loading && (
						<VStack spacing={4}>
							<Spinner size="lg" color="brand.500" />
							<Text color="gray.500">
								{t(FEATURED_PRODUCTS_CONSTANTS.LOADING)}
							</Text>
						</VStack>
					)}

					{/* Error State */}
					{error && (
						<Alert status="error" borderRadius="md">
							<AlertIcon />
							<VStack align="start" spacing={2}>
								<Text>{t(FEATURED_PRODUCTS_CONSTANTS.ERROR)}</Text>
								<Text fontSize="sm" color="gray.600">
									{error}
								</Text>
								<Button size="sm" colorScheme="brand" onClick={handleRetry}>
									{t(FEATURED_PRODUCTS_CONSTANTS.RETRY)}
								</Button>
							</VStack>
						</Alert>
					)}

					{/* Products Grid */}
					{!loading && !error && products.length > 0 && (
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 4 }}
							spacing={6}
							w="full">
							{products.map((product, index) => (
								<MotionBox
									key={product.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}>
									<ProductCard
										product={product}
										onClick={handleProductClick}
										showRating={true}
										showDiscount={true}
									/>
								</MotionBox>
							))}
						</SimpleGrid>
					)}

					{/* Empty State */}
					{!loading && !error && products.length === 0 && (
						<VStack spacing={4}>
							<Text color="gray.500">
								{t(FEATURED_PRODUCTS_CONSTANTS.NO_PRODUCTS)}
							</Text>
							<Button colorScheme="brand" onClick={handleRetry}>
								{t(FEATURED_PRODUCTS_CONSTANTS.REFRESH)}
							</Button>
						</VStack>
					)}

					{/* View All Products Button */}
					{!loading && !error && products.length > 0 && (
						<Button
							size="lg"
							colorScheme="brand"
							variant="outline"
							onClick={() => {
								// التنقل إلى صفحة جميع المنتجات
								console.log("عرض جميع المنتجات");
								// router.push("/products");
							}}>
							{t(FEATURED_PRODUCTS_CONSTANTS.VIEW_ALL)}
						</Button>
					)}
				</VStack>
			</Container>
		</Box>
	);
};

export default FeaturedProducts;
