"use client";

import { displayService } from "@/odoo-schema-full/services/display-service";
import { categoryProductService } from "@/odoo-schema-full/services/category-product-service";
import { ShopWrapper } from "@/components/shop";

// Server Component: fetch data on the server
export default async function ShopPage() {
	console.log("Fetching products and categories for the shop page...");
	const productsResult = await displayService.getAllProducts();
	const categoriesResult = await categoryProductService.getAllCategories();
	const products = productsResult.success ? productsResult.data || [] : [];
	console.log("Fetched products:", products);
	const categories = categoriesResult.success ? categoriesResult.data || [] : [];
	console.log("Fetched categories:", categories);

	return (
		<ShopWrapper
			products={products}
			categories={categories}
			initialPage="shop"
		/>
	);
}
