"use client";
/**
 * ProductCard Component
 * Responsive product card component with multiple variants
 */

import React, { useState } from "react";
import {
	Box,
	Image,
	Text,
	Button,
	Flex,
	Badge,
	IconButton,
	useColorModeValue,
	Tooltip,
	HStack,
	VStack,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiHeart, FiEye, FiShoppingCart, FiStar } from "react-icons/fi";
import { ProductCardProps } from "./types/ProductCard.types";
import {
	formatPrice,
	calculateDiscount,
	getProductImage,
	getProductStatus,
	getProductStatusColor,
	getCardSize,
	getImageSize,
	truncateText,
	isProductOnSale,
	getProductRating,
	getProductVariants,
} from "./helpers/ProductCard.helpers";

const MotionBox = Box;

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	variant = "default",
	size = "md",
	showRating = true,
	showStock = true,
	showDiscount = true,
	showQuickView = true,
	showWishlist = true,
	showCompare = false,
	onAddToCart,
	onQuickView,
	onWishlistToggle,
	onCompareToggle,
	onProductClick,
	className,
}) => {
	console.log("Product Card", product);
	const [isHovered, setIsHovered] = useState(false);
	const [isWishlisted, setIsWishlisted] = useState(false);

	const bg = useColorModeValue("#fff", "#0D1616");
	const borderColor = useColorModeValue("#E2E8F0", "#2D3748");
	const textColor = useColorModeValue("#0D1616", "#fff");
	const hoverBg = useColorModeValue("#F7FAFC", "#1A202C");

	const cardSize = getCardSize(size);
	const imageSize = getImageSize(size);
	const variants = getProductVariants();
	const variantConfig = variants[variant];

	const handleAddToCart = () => {
		if (onAddToCart) {
			onAddToCart(product);
		}
	};

	const handleQuickView = () => {
		if (onQuickView) {
			onQuickView(product);
		}
	};

	const handleWishlistToggle = () => {
		setIsWishlisted(!isWishlisted);
		if (onWishlistToggle) {
			onWishlistToggle(product);
		}
	};

	const handleProductClick = () => {
		if (onProductClick) {
			onProductClick(product);
		}
	};

	const discountPercentage = product.originalPrice
		? calculateDiscount(product.originalPrice, product.price)
		: product.discountPercentage || 0;

	const { stars, text: ratingText } = getProductRating(product.rating);

	return (
		<MotionBox
			className={className}
			cursor="pointer"
			onClick={handleProductClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<Box
				bg={bg}
				border="1px solid"
				borderColor={borderColor}
				borderRadius="0"
				overflow="hidden"
				transition="all 0.3s ease"
				_hover={{
					transform: "translateY(-4px)",
					boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
					borderColor: textColor,
				}}
				width={cardSize.width}
				height={cardSize.height}>
				{/* Product Image */}
				<Box position="relative" overflow="hidden">
					<h1>Product Card</h1>
					{/* <Image
						src={getProductImage(product)}
						alt={product.name}
						width={imageSize.width}
						height={imageSize.height}
						objectFit="cover"
						transition="transform 0.3s ease"
						_hover={{ transform: "scale(1.05)" }}
					/> */}

					{/* Discount Badge */}
					{showDiscount && discountPercentage > 0 && (
						<Badge
							position="absolute"
							top={2}
							right={2}
							bg="red.500"
							color="white"
							borderRadius="0"
							px={2}
							py={1}>
							-{discountPercentage}%
						</Badge>
					)}

					{/* Action Buttons */}
					<Flex
						position="absolute"
						top={2}
						left={2}
						direction="column"
						gap={2}
						opacity={isHovered ? 1 : 0}
						transition="opacity 0.3s ease">
						{showWishlist && (
							<Tooltip label="إضافة إلى المفضلة">
								<IconButton
									aria-label="Add to wishlist"
									icon={<FiHeart />}
									size="sm"
									bg={bg}
									color={isWishlisted ? "red.500" : textColor}
									borderRadius="0"
									onClick={(e) => {
										e.stopPropagation();
										handleWishlistToggle();
									}}
									_hover={{ bg: hoverBg }}
								/>
							</Tooltip>
						)}

						{showQuickView && (
							<Tooltip label="عرض سريع">
								<IconButton
									aria-label="Quick view"
									icon={<FiEye />}
									size="sm"
									bg={bg}
									color={textColor}
									borderRadius="0"
									onClick={(e) => {
										e.stopPropagation();
										handleQuickView();
									}}
									_hover={{ bg: hoverBg }}
								/>
							</Tooltip>
						)}
					</Flex>
				</Box>

				{/* Product Info */}
				<VStack p={4} spacing={2} align="stretch">
					{/* Category */}
					<Text fontSize="xs" color="gray.500" textTransform="uppercase">
						{product.category}
					</Text>

					{/* Product Name */}
					<Text
						fontSize="sm"
						fontWeight="bold"
						color={textColor}
						lineHeight="1.2"
						noOfLines={2}>
						{truncateText(product.name, 40)}
					</Text>

					{/* Rating */}
					{variantConfig.showRating && product.rating && (
						<HStack spacing={1}>
							<HStack spacing={1}>
								{Array.from({ length: 5 }).map((_, i) => (
									<FiStar
										key={i}
										size={12}
										color={i < stars ? "#FFD700" : "#E2E8F0"}
									/>
								))}
							</HStack>
							<Text fontSize="xs" color="gray.500">
								({product.reviewCount || 0})
							</Text>
						</HStack>
					)}

					{/* Price */}
					<HStack spacing={2} align="center">
						<Text fontSize="lg" fontWeight="bold" color={textColor}>
							{formatPrice(product.price, product.currency)}
						</Text>
						{product.originalPrice && product.originalPrice > product.price && (
							<Text
								fontSize="sm"
								color="gray.500"
								textDecoration="line-through">
								{formatPrice(product.originalPrice, product.currency)}
							</Text>
						)}
					</HStack>

					{/* Stock Status */}
					{variantConfig.showStock && (
						<Text fontSize="xs" color={getProductStatusColor(product)}>
							{getProductStatus(product)}
						</Text>
					)}

					{/* Add to Cart Button */}
					<Button
						size="sm"
						bg={bg}
						color={textColor}
						border="1px solid"
						borderColor={textColor}
						borderRadius="0"
						onClick={(e) => {
							e.stopPropagation();
							handleAddToCart();
						}}
						_hover={{
							bg: textColor,
							color: bg,
						}}
						transition="all 0.3s ease"
						leftIcon={<FiShoppingCart />}>
						إضافة للسلة
					</Button>
				</VStack>
			</Box>
		</MotionBox>
	);
};

export default ProductCard;
