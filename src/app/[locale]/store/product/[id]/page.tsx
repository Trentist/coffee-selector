import { unifiedOdooService } from "@/odoo-schema-full";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { gql } from "@apollo/client";
import ProductClient from "./ProductClient";

// تعريف أنواع البيانات
interface ProductThumbnail {
	url: string;
}

interface ProductData {
	id: number;
	name: string;
	description?: string;
	price: number;
	weight?: number;
	image?: string;
	thumbnail?: ProductThumbnail;
	url_key?: string;
	short_description?: string;
	categories?: any[];
	alternative_products?: any[];
	accessory_products?: any[];
	meta_title?: string;
	meta_description?: string;
	meta_keywords?: string;
	variants?: any[];
	configurable_options?: any[];
	updatedAt?: string;
}

interface CleanProductData {
	id: number;
	name: string;
	price: number;
	weight: number;
	slug: string;
	description: string;
	image: string;
	thumbnail: string;
	smallImage: string;
	metaImage: string;
	categories: any[];
	alternativeProducts: any[];
	accessoryProducts: any[];
	metaTitle: string;
	metaDescription: string;
	metaKeywords: string;
	variants: any[];
	configurable_options: any[];
	updatedAt: string;
}

interface ProductResponse {
	product?: ProductData;
}

interface ProductsResponse {
	products?: {
		products?: ProductData[];
	};
}

interface ProductResult {
	product: CleanProductData;
	relatedProducts: any[];
}

// Helper function to clean product data
function cleanProductData(product: ProductData): CleanProductData {
	return {
		id: product.id,
		name: product.name || "منتج غير محدد",
		price: product.price || 0,
		weight: product.weight || 0,
		slug: product.url_key || product.id.toString(),
		description: product.description || product.short_description || "",
		image: product.image || product.thumbnail?.url || "",
		thumbnail: product.thumbnail?.url || "",
		smallImage: product.thumbnail?.url || "",
		metaImage: product.thumbnail?.url || "",
		categories: product.categories || [],
		alternativeProducts: product.alternative_products || [],
		accessoryProducts: product.accessory_products || [],
		metaTitle: product.meta_title || product.name,
		metaDescription: product.meta_description || product.description || "",
		metaKeywords: product.meta_keywords || "",
		variants: product.variants || [],
		configurable_options: product.configurable_options || [],
		updatedAt: product.updatedAt || "",
	};
}

// Shared GraphQL query for product details
const GET_PRODUCT_QUERY = gql`
	query GetProduct($id: Int!) {
		product(id: $id) {
			id
			name
			description
			price
			image
			thumbnail {
				url
			}
		}
	}
`;

// Shared GraphQL query for fetching all products
const GET_ALL_PRODUCTS_QUERY = gql`
	query GetProducts {
		products {
			products {
				id
				name
				description
				price
				image
				thumbnail {
					url
				}
			}
		}
	}
`;

function getFullImageUrl(path?: string): string {
	if (!path) return "/generic-product.png";
	if (path.startsWith("/web")) {
		try {
			const baseUrl =
				process.env.NEXT_PUBLIC_ODOO_URL ||
				"https://coffee-selection-staging-20784644.dev.odoo.com";
			return `${baseUrl}${path}`;
		} catch (error) {
			// في حالة حدوث أي خطأ، نعود بالصورة العامة
			console.error("Error constructing image URL:", error);
			return "/generic-product.png";
		}
	}
	return path;
}

interface ProductPageProps {
	params: Promise<{ id: string; locale: string }>;
}

// دالة إنشاء metadata للصفحة
export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { id } = await params;
	const t = await getTranslations("shop");

	try {
		const productId = parseInt(id, 10);
		if (isNaN(productId)) {
			return {
				title: t("product_not_found"),
				description: t("product_not_found"),
			};
		}

		const odooService = unifiedOdooService;
		try {
			const productResponse = await odooService.apollo.query({
				query: GET_PRODUCT_QUERY,
				variables: { id: productId },
			});

			const typedResponse = productResponse as { data: ProductResponse };
			const product = typedResponse?.data?.product;

			if (!product) {
				return {
					title: t("product_not_found"),
					description: t("product_not_found"),
				};
			}

			return {
				title: product.name || t("product_details"),
				description:
					product.description?.replace(/<[^>]*>/g, "") ||
					t("product_description"),
				openGraph: {
					title: product.name,
					description: product.description?.replace(/<[^>]*>/g, ""),
					images: [
						getFullImageUrl(product.image || product.thumbnail?.url || ""),
					],
				},
			};
		} catch (error) {
			console.error("Error generating metadata:", error);
			return {
				title: t("product_not_found"),
				description: t("product_not_found"),
			};
		}
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: t("product_not_found"),
			description: t("product_not_found"),
		};
	}
}

// دالة جلب بيانات المنتج
async function getProductData(
	productId: number,
): Promise<ProductResult | null> {
	try {
		const odooService = unifiedOdooService;
		// استخدام طريقة آمنة للـ logging
		console.log("Fetching product with ID:", productId);

		try {
			const productResponse = await odooService.apollo.query({
				query: GET_PRODUCT_QUERY,
				variables: { id: productId },
			});

			// استخدام نوع أكثر أمانًا
			const typedResponse = productResponse as { data: ProductResponse };
			const product = typedResponse?.data?.product;

			if (!product) {
				console.log("Product not found, trying from products list...");
				const allProductsResponse = await odooService.apollo.query({
					query: GET_ALL_PRODUCTS_QUERY,
				});

				// استخدام نوع أكثر أمانًا
				const typedAllProductsResponse = allProductsResponse as {
					data: ProductsResponse;
				};
				const allProducts = typedAllProductsResponse?.data?.products?.products;

				if (allProducts && Array.isArray(allProducts)) {
					// مقارنة بطريقة آمنة
					const foundProduct = allProducts.find((p) => p.id === productId);

					if (foundProduct) {
						const cleanProduct = cleanProductData(foundProduct);
						return { product: cleanProduct, relatedProducts: [] };
					}
				}
				return null;
			}

			return { product: cleanProductData(product), relatedProducts: [] };
		} catch (error) {
			console.error("Error in Apollo query:", error);
			return null;
		}
	} catch (error) {
		console.error("Error fetching product data:", error);
		return null;
	}
}

export default async function ProductPage({ params }: ProductPageProps) {
	try {
		const { id } = await params;
		const productId = parseInt(id, 10);

		if (isNaN(productId)) {
			notFound();
		}

		try {
			const data = await getProductData(productId);
			if (!data) {
				notFound();
			}

			return (
				<ProductClient
					product={data.product}
					relatedProducts={data.relatedProducts}
				/>
			);
		} catch (error) {
			console.error("Error loading product data:", error);
			notFound();
		}
	} catch (error) {
		console.error("Error processing product page:", error);
		notFound();
	}
}
