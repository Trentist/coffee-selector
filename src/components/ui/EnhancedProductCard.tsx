"use client";
import {
	Box,
	Image,
	Text,
	Badge,
	Button,
	Flex,
	useColorModeValue,
	IconButton,
	Tooltip,
	AspectRatio,
	Skeleton,
	VStack,
	HStack,
} from "@chakra-ui/react";
// import { motion, React.Fragment } from "framer-motion";
import { FiHeart, FiShoppingCart, FiEye, FiShare2 } from "react-icons/fi";
import { useLocale } from "@/components/ui/useLocale";
import { useState } from "react";
// import { useCurrency } from "@/hooks/useCurrency";
// import { useFavorites } from "@/store/favorites/hooks/useFavorites";
import { EnhancedProductCardProps } from "./types/EnhancedProductCard.types";
import {
	getImageUrl,
	handleAddToCart,
	cardHoverAnimation,
	heartBeatAnimation,
} from "./helpers/EnhancedProductCard.helpers";
import { useCurrency } from "@/currency-system";

const MotionBox = Box;

const EnhancedProductCard = ({
	product,
	viewMode = "four",
	onAddToCart,
	onAddToWishlist,
	onQuickView,
	onShare,
}: EnhancedProductCardProps) => {
	const { t, isRTL } = useLocale();
	const { formatPrice } = useCurrency();
	const { isInWishlist } = useWishlist();
	const [isHovered, setIsHovered] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const bgColor = useColorModeValue("#fff", "#0D1616");
	const borderColor = useColorModeValue("#0D1616", "#fff");
	const textColor = useColorModeValue("#0D1616", "#fff");
	const priceColor = useColorModeValue("#0D1616", "#fff");

	const handleAddToCartClick = async () => {
		await handleAddToCart(product, onAddToCart, setIsLoading);
	};

	// تحديد تخطيط الكارت حسب وضع العرض
	const isListView = viewMode === "list";
	const isCompactView = viewMode === "popup";

	return (
		<MotionBox
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			whileHover={{ y: -8, scale: 1.02 }}
			transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			bg={bgColor}
			borderRadius="0"
			overflow="hidden"
			boxShadow="none"
			border="0"
			borderBottom="1px solid"
			borderColor={borderColor}
			_hover={{
				boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 0 20px ${borderColor}20`,
				borderColor: borderColor,
				animation: `${cardHoverAnimation} 0.6s ease-in-out`,
			}}
			cursor="pointer"
			position="relative"
			_before={{
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: `linear-gradient(135deg, ${borderColor}02, transparent, ${borderColor}01)`,
				opacity: 0,
				transition: "opacity 0.3s ease",
				zIndex: 0,
			}}
			_after={{
				content: '""',
				position: "absolute",
				top: "-2px",
				left: "-2px",
				right: "-2px",
				bottom: "-2px",
				background: `linear-gradient(45deg, ${borderColor}20, transparent, ${borderColor}10)`,
				borderRadius: "0",
				opacity: 0,
				transition: "opacity 0.3s ease",
				zIndex: -1,
			}}
			sx={{
				"&:hover::before": {
					opacity: 1,
				},
				"&:hover::after": {
					opacity: 1,
				},
			}}>
			{/* تخطيط القائمة */}
			{isListView ? (
				<Flex direction={{ base: "column", md: "row" }} h="200px">
					{/* صورة المنتج */}
					<Box w={{ base: "100%", md: "300px" }} h="200px" position="relative">
						<AspectRatio ratio={1}>
							<>
								{!imageLoaded && (
									<Skeleton w="100%" h="100%" borderRadius="0" />
								)}
								<Image
									src={getImageUrl(product.image) || "/placeholder-image.jpg"}
									alt={product.name || product.attributes?.name || "Product"}
									objectFit="cover"
									onLoad={() => setImageLoaded(true)}
									style={{ display: imageLoaded ? "block" : "none" }}
								/>
							</>
						</AspectRatio>

						{/* شارة العرض أو الخصم */}
						{product.discount && (
							<Badge
								position="absolute"
								top={2}
								left={isRTL ? "auto" : 2}
								right={isRTL ? 2 : "auto"}
								bg={borderColor}
								color={bgColor}
								borderRadius="0">
								-{product.discount}%
							</Badge>
						)}
					</Box>

					{/* تفاصيل المنتج */}
					<VStack
						flex="1"
						align="stretch"
						justify="space-between"
						p={6}
						spacing={4}>
						<VStack align="stretch" spacing={2}>
							<Text
								fontSize="xl"
								fontWeight="bold"
								color={textColor}
								noOfLines={2}>
								{product.name || product.attributes?.name || "منتج"}
							</Text>
							<Text fontSize="sm" color={textColor} noOfLines={3}>
								{product.description || product.attributes?.description || ""}
							</Text>
							<Text fontSize="2xl" fontWeight="bold" color={priceColor}>
								{formatPrice(product.price || product.attributes?.price || 0)}
							</Text>
						</VStack>

						<HStack spacing={2}>
							<Button
								size="md"
								bg={borderColor}
								color={bgColor}
								_hover={{
									bg: bgColor,
									color: borderColor,
									border: "1px solid",
									borderColor: borderColor,
								}}
								onClick={handleAddToCartClick}
								isLoading={isLoading}
								loadingText={t("common.processing")}
								borderRadius="0"
								flex="1">
								{t("common.add_to_cart")}
							</Button>
							<IconButton
								aria-label="Add to wishlist"
								icon={<FiHeart />}
								variant="outline"
								borderRadius="0"
								border="0"
								borderBottom="1px solid"
								borderColor={borderColor}
								bg={isInWishlist(product.id) ? "#ff4444" : bgColor}
								color={isInWishlist(product.id) ? "#fff" : borderColor}
								_hover={{
									bg: isInWishlist(product.id) ? "#ff6666" : borderColor,
									color: isInWishlist(product.id) ? "#fff" : bgColor,
									animation: `${heartBeatAnimation} 0.6s ease-in-out`,
								}}
								onClick={() => onAddToWishlist?.(product)}
							/>
						</HStack>
					</VStack>
				</Flex>
			) : (
				/* تخطيط الشبكة */
				<VStack spacing={0} align="stretch">
					{/* صورة المنتج */}
					<Box position="relative">
						<AspectRatio ratio={1}>
							<>
								{!imageLoaded && (
									<Skeleton w="100%" h="100%" borderRadius="0" />
								)}
								<Image
									src={getImageUrl(product.image) || "/placeholder-image.jpg"}
									alt={product.name || product.attributes?.name || "Product"}
									objectFit="cover"
									onLoad={() => setImageLoaded(true)}
									style={{ display: imageLoaded ? "block" : "none" }}
								/>
							</>
						</AspectRatio>

						{/* شارة العرض أو الخصم */}
						{product.discount && (
							<Badge
								position="absolute"
								top={2}
								left={isRTL ? "auto" : 2}
								right={isRTL ? 2 : "auto"}
								bg={borderColor}
								color={bgColor}
								borderRadius="0">
								-{product.discount}%
							</Badge>
						)}

						{/* أزرار الإجراءات السريعة */}
						<React.Fragment>
							{isHovered && (
								<Flex
									position="absolute"
									top={2}
									right={isRTL ? "auto" : 2}
									left={isRTL ? 2 : "auto"}
									direction="column"
									spacing={2}
									as={motion.div}
									initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
									// transition={{ duration: 0.2 }}
								>
									<Tooltip label={t("common.quick_view")} placement="left">
										<IconButton
											aria-label="Quick view"
											icon={<FiEye />}
											size="sm"
											bg={bgColor}
											color={borderColor}
											borderRadius="0"
											border="1px solid"
											borderColor={borderColor}
											_hover={{
												bg: borderColor,
												color: bgColor,
											}}
											onClick={() => onQuickView?.(product)}
										/>
									</Tooltip>
									<Tooltip label={t("common.share")} placement="left">
										<IconButton
											aria-label="Share product"
											icon={<FiShare2 />}
											size="sm"
											bg={bgColor}
											color={borderColor}
											borderRadius="0"
											border="1px solid"
											borderColor={borderColor}
											_hover={{
												bg: borderColor,
												color: bgColor,
											}}
											onClick={() => onShare?.(product)}
										/>
									</Tooltip>
								</Flex>
							)}
						</React.Fragment>

						{/* زر المفضلة */}
						<IconButton
							position="absolute"
							top={2}
							left={isRTL ? "auto" : 2}
							right={isRTL ? 2 : "auto"}
							aria-label="Add to wishlist"
							icon={<FiHeart />}
							size="sm"
							bg={isInWishlist(product.id) ? "#ff4444" : bgColor}
							color={isInWishlist(product.id) ? "#fff" : borderColor}
							borderRadius="0"
							border="1px solid"
							borderColor={borderColor}
							_hover={{
								bg: isInWishlist(product.id) ? "#ff6666" : borderColor,
								color: isInWishlist(product.id) ? "#fff" : bgColor,
								animation: `${heartBeatAnimation} 0.6s ease-in-out`,
							}}
							onClick={() => onAddToWishlist?.(product)}
						/>
					</Box>

					{/* تفاصيل المنتج */}
					<VStack p={4} spacing={3} align="stretch">
						<Text
							fontSize="lg"
							fontWeight="bold"
							color={textColor}
							noOfLines={2}
							lineHeight="1.2">
							{product.name || product.attributes?.name || "منتج"}
						</Text>
						{!isCompactView && (
							<Text fontSize="sm" color={textColor} noOfLines={2}>
								{product.description || product.attributes?.description || ""}
							</Text>
						)}
						<Text fontSize="xl" fontWeight="bold" color={priceColor}>
							{formatPrice(product.price || product.attributes?.price || 0)}
						</Text>

						{/* زر إضافة للسلة */}
						<Button
							size="md"
							bg={borderColor}
							color={bgColor}
							_hover={{
								bg: bgColor,
								color: borderColor,
								border: "1px solid",
								borderColor: borderColor,
							}}
							onClick={handleAddToCartClick}
							isLoading={isLoading}
							loadingText={t("common.processing")}
							borderRadius="0"
							leftIcon={<FiShoppingCart />}>
							{t("common.add_to_cart")}
						</Button>
					</VStack>
				</VStack>
			)}
		</MotionBox>
	);
};

export default EnhancedProductCard;
