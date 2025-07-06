import { displayService } from "@/odoo-schema-full/services/display-service";
import { categoryProductService } from "@/odoo-schema-full/services/category-product-service";
import ShopWrapperClient from "@/components/shop/ShopWrapperClient";

// Server Component: fetch data on the server
export default async function ShopPage() {
	console.log("Fetching products and categories for the shop page...");
	
	try {
		// Fetch data with proper error handling
		const [productsResult, categoriesResult] = await Promise.allSettled([
			displayService.getAllProducts(),
			categoryProductService.getAllCategories()
		]);

		// Handle products result
		const products = productsResult.status === 'fulfilled' && productsResult.value.success 
			? productsResult.value.data || [] 
			: [];
		
		// Handle categories result
		const categories = categoriesResult.status === 'fulfilled' && categoriesResult.value.success 
			? categoriesResult.value.data || [] 
			: [];

		console.log("Fetched products:", products.length);
		console.log("Fetched categories:", categories.length);

		return (
			<ShopWrapperClient
				products={products}
				categories={categories}
				initialPage="shop"
			/>
		);
	} catch (error) {
		console.error("Error fetching shop data:", error);
		// Return empty arrays to prevent crashes
		return (
			<ShopWrapperClient
				products={[]}
				categories={[]}
				initialPage="shop"
			/>
		);
	}
}
