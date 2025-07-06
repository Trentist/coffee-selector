import { displayService } from "@/odoo-schema-full/services/display-service";
import { categoryProductService } from "@/odoo-schema-full/services/category-product-service";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ShopWrapperClient from "@/components/shop/ShopWrapperClient";

interface CategoryPageProps {
	params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
	params,
}: CategoryPageProps): Promise<Metadata> {
	const { id } = await params;
	const t = await getTranslations("shop");

	try {
		const categoryId = parseInt(id, 10);
		if (isNaN(categoryId)) {
			return {
				title: t("category_not_found"),
				description: t("category_not_found"),
			};
		}

		// Get category data using the new service
		const categoryResult =
			await categoryProductService.getCategoryById(categoryId);

		if (!categoryResult.success || !categoryResult.data) {
			return {
				title: t("category_not_found"),
				description: t("category_not_found"),
			};
		}

		const category = categoryResult.data;

		return {
			title: category.meta_title || category.name || t("category_details"),
			description: category.meta_description || t("category_description"),
			openGraph: {
				title: category.meta_title || category.name,
				description: category.meta_description,
				images: category.image ? [category.image] : [],
			},
		};
	} catch {
		return {
			title: t("category_not_found"),
			description: t("category_not_found"),
		};
	}
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const { id } = await params;
	const categoryId = parseInt(id);

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
				initialPage="category"
				initialCategoryId={categoryId}
			/>
		);
	} catch (error) {
		console.error("Error fetching category data:", error);
		return (
			<ShopWrapperClient
				products={[]}
				categories={[]}
				initialPage="category"
				initialCategoryId={categoryId}
			/>
		);
	}
}
