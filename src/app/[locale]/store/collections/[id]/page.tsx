import { Suspense } from "react";
import { displayService } from "@/odoo-schema-full/services/display-service";
import { categoryProductService } from "@/odoo-schema-full/services/category-product-service";
import { ShopWrapper } from "@/components/shop";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoadingStatus } from "@/components/status/pages/StatusPages";

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
					initialPage="category"
					initialCategoryId={categoryId}
				/>
			</Suspense>
		</>
	);
}
