import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Flex,
	Stack,
	Text,
	Button,
	Divider,
	useColorModeValue,
	Box,
	IconButton,
	Image,
	Badge,
	Tooltip,
	HStack,
	VStack,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
	FiTrash2,
	FiShoppingCart,
	FiHeart,
	FiEye,
	FiShare2,
} from "react-icons/fi";
// import { motion, React.Fragment } from "framer-motion";
import { useLocale } from "@/components/ui/useLocale";
import { TextParagraph } from "@/components/ui/custom-text";
import { removeFavorite } from "@/store/favoritesSlice";
import { addToCart } from "@/store/cartReducer";
import { toast } from "react-toastify";
import ShareService from "@/services/shareService";

const MotionBox = Box;

interface WishlistDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export const WishlistDrawer = ({ isOpen, onClose }: WishlistDrawerProps) => {
	const { t } = useLocale();
	const router = useRouter();
	const dispatch = useDispatch();

	// Redux state
	const favorites = useSelector((state: any) => state.favorites?.items || []);

	// Theme colors
	const bg = useColorModeValue("#fff", "#0D1616");
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
		hidden: { x: 20, opacity: 0 },
		visible: {
			x: 0,
			opacity: 1,
			transition: { type: "spring" as const, stiffness: 300, damping: 24 },
		},
		exit: {
			x: -20,
			opacity: 0,
			transition: { duration: 0.2 },
		},
	};

	const handleRemoveFromWishlist = (productId: string) => {
		dispatch(removeFavorite(productId));
		toast.info(
			t("shop.removed_from_wishlist", {
				default: "تم إزالة المنتج من المفضلة",
			}),
		);
	};

	const handleAddToCart = (product: any) => {
		dispatch(
			addToCart({
				id: product.id,
				title: product.name || product.title,
				category: product.category || "general",
				image_profile: product.image || product.image_profile,
				price: product.price,
				text: product.description || product.text || "",
				quantity: 1,
				size: product.size || "medium",
				slug: product.slug || product.id.toString(),
			}),
		);
		toast.success(
			t("shop.added_to_cart", { default: "تم إضافة المنتج للسلة" }),
		);
	};

	const handleShareProduct = async (product: any) => {
		try {
			await ShareService.shareProduct(product);
		} catch (error) {
			console.error("Error sharing product:", error);
			toast.error("فشل في مشاركة المنتج");
		}
	};

	const handleViewProduct = (productId: string) => {
		router.push(`/store/product/${productId}`);
		onClose();
	};

	const getImageUrl = (imagePath: string) => {
		if (!imagePath) return "/placeholder-image.jpg";
		if (imagePath.startsWith("http")) return imagePath;
		return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
	};

	return (
		<Drawer size="lg" isOpen={isOpen} placement="right" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent bg={bg} color={color}>
				<DrawerCloseButton />

				<DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
					<Flex alignItems="center" gap={3}>
						<FiHeart size="24px" />
						<Box>
							<Text fontSize="lg" fontWeight="bold">
								{t("common.favorites")}
							</Text>
							<Text fontSize="sm" color="gray.500">
								{favorites.length} {t("common.items")}
							</Text>
						</Box>
					</Flex>
				</DrawerHeader>

				<DrawerBody>
					{favorites.length > 0 ? (
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible">
							<Stack spacing={4}>
								<React.Fragment>
									{favorites.map((item: any) => (
										<MotionBox
											key={item.id}
											variants={itemVariants}
											layout
											exit="exit"
											p={4}
											borderWidth="0.2px"
											borderColor={borderColor}
											borderRadius="0"
											bg={useColorModeValue("gray.50", "gray.800")}
											_hover={{
												shadow: "lg",
												transform: "translateY(-2px)",
												borderColor: useColorModeValue(
													"green.200",
													"green.600",
												),
											}}
											transition={{ duration: 0.2 }}>
											<VStack spacing={4} align="stretch">
												{/* Product Image & Info */}
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
															src={getImageUrl(
																item.image || item.image_profile,
															)}
															alt={item.name || item.title}
															w="100px"
															h="100px"
															objectFit="cover"
														/>
													</Box>

													{/* Product Details */}
													<VStack align="start" spacing={2} flex={1}>
														<Text
															fontWeight="bold"
															fontSize="md"
															cursor="pointer"
															onClick={() => handleViewProduct(item.id)}
															_hover={{ color: "blue.500" }}>
															{item.name || item.title}
														</Text>
														<Text fontSize="sm" color="gray.500">
															{item.category || "عام"}
														</Text>
														<Text fontWeight="bold" color="green.500">
															{item.price} ر.س
														</Text>
													</VStack>
												</HStack>

												{/* Action Buttons */}
												<HStack spacing={2} justify="space-between">
													{/* Add to Cart */}
													<Tooltip label={t("common.add_to_cart")} hasArrow>
														<IconButton
															size="sm"
															colorScheme="green"
															aria-label={t("common.add_to_cart")}
															icon={<FiShoppingCart />}
															onClick={() => handleAddToCart(item)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													{/* Quick View */}
													<Tooltip label={t("common.quick_view")} hasArrow>
														<IconButton
															size="sm"
															variant="outline"
															colorScheme="blue"
															aria-label={t("common.quick_view")}
															icon={<FiEye />}
															onClick={() => handleViewProduct(item.id)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													{/* Share Product */}
													<Tooltip label={t("common.share")} hasArrow>
														<IconButton
															size="sm"
															variant="outline"
															colorScheme="gray"
															aria-label={t("common.share")}
															icon={<FiShare2 />}
															onClick={() => handleShareProduct(item)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>

													{/* Remove from Favorites */}
													<Tooltip label={t("common.remove")} hasArrow>
														<IconButton
															size="sm"
															variant="outline"
															colorScheme="red"
															aria-label={t("common.remove")}
															icon={<FiTrash2 />}
															onClick={() => handleRemoveFromWishlist(item.id)}
															borderRadius="0"
															_hover={{ transform: "scale(1.1)" }}
															transition="all 0.2s"
														/>
													</Tooltip>
												</HStack>
											</VStack>
										</MotionBox>
									))}
								</React.Fragment>
							</Stack>
						</motion.div>
					) : (
						// Empty State
						<Flex
							direction="column"
							align="center"
							justify="center"
							h="300px"
							textAlign="center">
							<FiHeart size="64px" color="gray.300" />
							<Text fontSize="lg" fontWeight="bold" mt={4} color="gray.500">
								{t("wishlist.empty_title", { default: "قائمة المفضلة فارغة" })}
							</Text>
							<Text fontSize="md" color="gray.400" mt={2}>
								{t("wishlist.empty_description", {
									default: "أضف منتجات إلى المفضلة لتظهر هنا",
								})}
							</Text>
						</Flex>
					)}
				</DrawerBody>

				{favorites.length > 0 && (
					<DrawerFooter borderTopWidth="1px" borderColor={borderColor}>
						<Stack w="100%" spacing={3}>
							<Flex justify="space-between" align="center">
								<Text fontSize="sm" color="gray.500">
									{favorites.length} {t("common.items")}{" "}
									{t("wishlist.in_favorites", { default: "في المفضلة" })}
								</Text>
							</Flex>
							<Flex gap={3}>
								<Button variant="outline" onClick={onClose} flex={1}>
									{t("common.continue_shopping")}
								</Button>
								<Button
									colorScheme="green"
									onClick={() => {
										router.push("/store/wishlist");
										onClose();
									}}
									flex={1}>
									{t("wishlist.view_all", { default: "عرض الكل" })}
								</Button>
							</Flex>
						</Stack>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
};