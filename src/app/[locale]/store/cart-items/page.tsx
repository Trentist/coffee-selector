"use client";
import { Suspense } from "react";
import { displayService } from "@/odoo-schema-full/services/display-service";
import { categoryProductService } from "@/odoo-schema-full/services/category-product-service";
import { ShopWrapper } from "@/components/shop";
import { LoadingStatus } from "@/components/status/pages/StatusPages";

export default async function CartItemsPage() {
	// جلب البيانات من النظام الجديد الموحد
	const productsResult = await displayService.getAllProducts();
	const categoriesResult = await categoryProductService.getAllCategories();

	const products = productsResult.success ? productsResult.data || [] : [];
	const categories = categoriesResult.success
		? categoriesResult.data || []
		: [];

	return (
		<>
			<Suspense fallback={<LoadingStatus statusType="loading" />}>
				<ShopWrapper
					products={products}
					categories={categories}
					initialPage="cart"
				/>
			</Suspense>
		</>
	);
}
