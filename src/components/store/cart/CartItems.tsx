"use client";
/**
 * CartItems Component
 * مكون عناصر السلة
 */

import { Box, Flex, Img, Stack, useColorModeValue } from "@chakra-ui/react";
import { FaHeart, FaReply, FaShareAlt, FaTrash } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

// Components
import { TextParagraph } from "@/components/ui/custom-text";
import CustomButton from "@/components/ui/custom-button";
// import { AmountCartItems } from "@/components/ui/cart-items-compoenets/amount-cart-items";
// import { Qty } from "@/components/ui/cart-items-compoenets/qty";
// import { cartReducer } from "@/store/cartReducer";

// Store
import { incrementQuantity, decrementQuantity } from "@/store/cartReducer";

// Types
import { CartItemsProps } from "./types/CartItems.types";

// Helpers
import {
	navigateToProduct,
	navigateToCategory,
	isOrderPage,
	isDashboardPurchasesPage,
} from "./helpers/CartItems.helpers";

export const CartItems = ({
	id,
	img,
	category,
	title,
	slug,
	selectedName,
	size,
	onCLick,
	price,
	quantity,
	link,
	category_link,
	onClickRepeat,
	onClickFavorite,
	onClickFavoriteColor,
	onClickShare,
	limited,
}: CartItemsProps) => {
	const dispatch = useDispatch();
	const color = useColorModeValue("#0D1616", "#fff");
	const router = useRouter();
	const pathname = usePathname();

	const orderPage = isOrderPage(pathname);
	const dashboardPurchasesPage = isDashboardPurchasesPage(pathname);

	return (
		<>
			<Flex
				w="100%"
				py="1rem"
				borderBottom={"1px"}
				borderTop="0"
				borderX="0"
				borderWidth={".5px"}
				borderColor={color}
				h={{ base: "100%", sn: "400px", md: "210px" }}
				gap="20px"
				flexDirection={{ base: "column", md: "row" }}
				justifyContent={"space-between"}
				alignItems="start"
				px="2">
				<Flex
					flexDirection={{ base: "column", md: "row" }}
					justifyContent={"space-between"}
					alignItems="start"
					overflow={"hidden"}>
					<Flex alignItems="start" gap="1rem">
						<Stack
							border="1px"
							borderColor={"#0D1616"}
							onClick={() => navigateToProduct(router, link)}
							w=""
							pos="relative"
							borderRadius="0"
							overflow="hidden"
							cursor={link ? "pointer" : "default"}>
							{img && (
								<Img
									src={img}
									alt={title}
									title={title}
									style={{
										objectFit: "cover",
										objectPosition: "center",
									}}
									loading="lazy"
									boxSize={"200px"}
								/>
							)}
						</Stack>
						<Stack display={{ base: "flex", md: "none" }} w="100%" gap="2rem">
							<Box h="100%" w="100%">
								<Box
									onClick={() => navigateToCategory(router, category_link)}
									cursor={category_link ? "pointer" : "default"}
									mb="1">
									<TextParagraph
										title={category}
										color={useColorModeValue("gray.600", "gray.400")}
									/>
								</Box>
								<Box
									onClick={() => navigateToProduct(router, link)}
									cursor={link ? "pointer" : "default"}
									mb="2">
									<TextParagraph title={title} />
								</Box>
								<TextParagraph title={slug} />
								{limited && (
									<TextParagraph
										title={limited}
										color={useColorModeValue("red.500", "red.300") as string}
									/>
								)}
							</Box>
						</Stack>
					</Flex>
					<Stack
						display={{ base: "flex", md: "none" }}
						flexDirection={{ base: "row", md: "column" }}
						justifyContent={"space-between"}
						gap=".7rem"
						borderColor={color}>
						{!orderPage && !dashboardPurchasesPage && (
							<>
								{selectedName && (
									<Flex
										justifyContent={"end"}
										alignItems={{ base: "center", sm: "center" }}
										gap="1rem">
										<TextParagraph title={selectedName} />
										<TextParagraph title={size} />
									</Flex>
								)}
							</>
						)}

						{!orderPage && (
							<Flex alignItems={"center"} gap="1rem">
								{onClickFavorite && (
									<CustomButton
										onClick={onClickFavorite}
										icon={
											<FaHeart color={onClickFavoriteColor} size="1.2rem" />
										}
										title=""
									/>
								)}
								{onClickRepeat && (
									<CustomButton
										onClick={onClickRepeat}
										icon={<FaReply color={color} size="1.2rem" />}
										title=""
									/>
								)}
								{onClickShare && (
									<CustomButton
										onClick={onClickShare}
										icon={<FaShareAlt color={color} size="1.2rem" />}
										title=""
									/>
								)}
							</Flex>
						)}
					</Stack>
				</Flex>
				<Stack
					w="100%"
					h={{ base: "", sm: "", md: "200px" }}
					px="1rem"
					gap="1rem"
					justify={"space-between"}>
					<Flex w="100%" h="">
						<Stack
							w="100%"
							h="100%"
							gap="2rem"
							display={{ base: "none", md: "flex" }}>
							<Box h="100%">
								<Box onClick={() => navigateToCategory(router, category_link)}>
									<TextParagraph title={category} />
								</Box>
								<Box onClick={() => navigateToProduct(router, link)}>
									<TextParagraph title={title} />
								</Box>
								<Box my=".3rem">
									<TextParagraph title={slug} />
									<TextParagraph title={limited} />
								</Box>
							</Box>

							{selectedName && (
								<Flex
									justifyContent={"start"}
									alignItems={{ base: "start", sm: "center" }}
									gap="1rem">
									<TextParagraph title={selectedName} />
									<TextParagraph title={size} />
								</Flex>
							)}
						</Stack>
					</Flex>
					<Box
						w="100%"
						alignItems={{ base: "start", md: "center" }}
						justifyContent={"space-between"}
						gap="15px"
						display={{ base: "flex", xl: "flex" }}
						flexDirection={{ base: "column-reverse", md: "row" }}>
						<Flex
							w="100%"
							alignItems={"center"}
							justifyContent={"space-between"}>
							{!orderPage && !dashboardPurchasesPage && (
								<CustomButton
									icon={<FaTrash size=".9rem" />}
									title=""
									onClick={onCLick}
								/>
							)}
							{/* <AmountCartItems price={price} /> */}
						</Flex>

					</Box>
				</Stack>
			</Flex>
		</>
	);
};
