"use client";
import { toast } from "react-toastify";
// import { ProductDetailsRedesigned } from "@/components/pages-details/store-pages/product-details/index-redesigned";
import React, { Suspense, useState } from "react";
import LayoutMain from "@/components/layout/layout-main";
import LoadingScreen from "@/components/shared/loading";
import { Box } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import toggleFavorite from "@/store/favorites/favoritesSlice";
import { useTranslations } from "next-intl";

function getFullImageUrl(path?: string) {
	if (!path) return "/generic-product.png";
	if (path.startsWith("/web")) {
		const baseUrl =
			process.env.NEXT_PUBLIC_ODOO_URL ||
			"https://coffee-selection-staging-20784644.dev.odoo.com";
		return `${baseUrl}${path}`;
	}
	return path;
}

interface ProductClientProps {
	product: any;
	relatedProducts: any[];
}

export default function ProductClient({
	product,
	relatedProducts,
}: ProductClientProps) {
	const t = useTranslations("shop");
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();

	// استخراج صورة المنتج الرئيسية
	const mainImage = getFullImageUrl(
		product.image || product.thumbnail || product.smallImage,
	);

	// Format product description
	const formattedDescription =
		product.description?.replace(/<[^>]*>/g, "") || t("no_description");

	const formatProducts = (products: any[] | null) => {
		if (!products) return [];
		return products.map((product, index) => ({
			...product,
			image: getFullImageUrl(product.image),
			key: `${product.id}-${index}`,
		}));
	};

	const handleAddToCart = () => {
		const cartItem = {
			id: product.id.toString(),
			title: product.name,
			price: product.price,
			category:
				product.categories && product.categories.length > 0
					? product.categories[0].name
					: "",
			text: formattedDescription,
			image_profile: mainImage,
			quantity: quantity,
		};

		dispatch(addToCart(cartItem));
		toast.success(t("added_to_cart"));
	};

	const handleToggleFavorite = () => {
		const favoriteItem = {
			id: product.id.toString(),
			title: product.name,
			price: product.price,
			category:
				product.categories && product.categories.length > 0
					? product.categories[0].name
					: "",
			text: formattedDescription,
			image_profile: mainImage,
		};

		dispatch(toggleFavorite(favoriteItem.id));
		toast.success(t("added_to_favorites"));
	};

	return (
		<LayoutMain>
			<Suspense fallback={<LoadingScreen />}>
				<Box>
					{/* <ProductDetailsRedesigned
						product={product}
						relatedProducts={formatProducts(relatedProducts)}
						onAddToCart={handleAddToCart}
						onToggleFavorite={handleToggleFavorite}
						quantity={quantity}
						setQuantity={setQuantity}
					/> */}
				</Box>
			</Suspense>
		</LayoutMain>
	);
}
