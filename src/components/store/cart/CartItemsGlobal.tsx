"use client";
/**
 * CartItemsGlobal Component
 * مكون السلة العامة
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, useColorModeValue } from "@chakra-ui/react";

// Components
import { CartItems } from "./CartItems";

// Store
// import { addToCart, removeItem } from "@/store/cartReducer";

// Types
import {
	CartItemsGlobalProps,
	CartProduct,
} from "./types/CartItemsGlobal.types";
import { CartState } from "@/types/product";

// Helpers
import {
	getImageUrl,
	handleShareProduct,
} from "./helpers/CartItemsGlobal.helpers";

export const CartItemsGlobal = ({ products }: CartItemsGlobalProps) => {
	const color = useColorModeValue("#0D1616", "#fff");
	const dispatch = useDispatch();

	/**
	 * Reorder a product by adding it back to the cart
	 * إعادة طلب منتج بإضافته للسلة مرة أخرى
	 */
	const handleRepeatOrder = (item: CartProduct): void => {
		// dispatch(addToCart(item));
		window.location.href = "/store/cart-items";
	};

	return (
		<>
			{/* Render cart items if products exist */}
			{products?.length > 0 ? (
				<>
					{products?.map((item: CartProduct) => (
						<CartItems
							key={item?.id}
							id={item?.id}
							img={
								getImageUrl(item?.image_profile) ||
								getImageUrl(item?.image_profile)
							}
							category={item?.category}
							title={item?.title}
							text={item?.text}
							size={item?.size}
							limited={item?.limited}
							onCLick={() => dispatch(removeItem(item?.id))}
							price={item?.price}
							quantity={item?.quantity}
							onClickShare={() => handleShareProduct(item)}
						/>
					))}
				</>
			) : (
				<>
					{/* Render empty cart message if no products exist */}
					<Box textAlign="center" py={8}>
						<p>Your Cart is empty</p>
					</Box>
				</>
			)}
		</>
	);
};
