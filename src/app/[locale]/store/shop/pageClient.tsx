// app/shop/ShopPageClient.tsx
"use client";

import { ShopWrapper } from "@/components/shop";

export default function ShopPageClient({ products, categories }: any) {
	return (
		<ShopWrapper
			products={products}
			categories={categories}
			initialPage="shop"
		/>
	);
}
