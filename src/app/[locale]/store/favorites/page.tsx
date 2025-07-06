import { displayService } from "@/odoo-schema-full/services/display-service";
import { categoryProductService } from "@/odoo-schema-full/services/category-product-service";
import ShopWrapperClient from "@/components/shop/ShopWrapperClient";

export default async function FavoritesPage() {
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
			<ShopWrapperClient
				products={products}
				categories={categories}
				initialPage="favorites"
			/>
		);
	} catch (error) {
		console.error("Error fetching favorites data:", error);
		return (
			<ShopWrapperClient
				products={[]}
				categories={[]}
				initialPage="favorites"
			/>
		);
	}
}
