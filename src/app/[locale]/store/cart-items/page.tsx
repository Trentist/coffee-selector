import { Suspense } from "react";
import { displayService } from "@/odoo-schema-full/services/display-service";
import { categoryProductService } from "@/odoo-schema-full/services/category-product-service";
import { ShopWrapper } from "@/components/shop";
import { LoadingStatus } from "@/components/status/pages/StatusPages";

export default async function CartItemsPage() {
	try {
		// جلب البيانات من النظام الجديد الموحد
		const [productsResult, categoriesResult] = await Promise.allSettled([
			displayService.getAllProducts(),
			categoryProductService.getAllCategories()
		]);

		const products = productsResult.status === 'fulfilled' && productsResult.value.success 
			? productsResult.value.data || [] 
			: [];
		
		const categories = categoriesResult.status === 'fulfilled' && categoriesResult.value.success
			? categoriesResult.value.data || []
			: [];

		return (
			<Suspense fallback={<LoadingStatus statusType="loading" />}>
				<ShopWrapper
					products={products}
					categories={categories}
					initialPage="cart"
				/>
			</Suspense>
		);
	} catch (error) {
		console.error("Error fetching cart data:", error);
		return (
			<Suspense fallback={<LoadingStatus statusType="loading" />}>
				<ShopWrapper
					products={[]}
					categories={[]}
					initialPage="cart"
				/>
			</Suspense>
		);
	}
}
