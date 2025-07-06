/**
 * Display Service - خدمة العرض
 * خدمة شاملة لعرض المنتجات والفئات مع جميع الاستعلامات العاملة
 */
import { getServerApolloClient } from "./lib/apolloServer";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql } from "@apollo/client";

import {
	Product,
	ProductCategory,
	ProductFilter,
	FilterType,
	FilterValue,
	ProductFilterInput,
	PriceRange,
	AttributeFilter,
	SortField,
	SortDirection,
	ProductSearchInput,
	ProductSearchResult,
	SearchFacet,
	FacetValue,
	ProductSuggestion,
	CompareList,
	CompareItem,
	ComparisonMatrix,
	ComparisonAttribute,
	ComparisonAttributeValue,
	ComparisonDifference,
	AttributeDifference,
	ProductRecommendation,
	RecommendationReason,
	RecommendationEngine,
	RecommendationType,
	PerformanceMetrics,
	ProductInventory,
	WarehouseLocation,
	StockMovement,
	MovementType,
	ProductAnalytics,
	AnalyticsPeriod,
	ProductPerformance,
	ProductMetrics,
	ProductTrends,
	TrendData,
	ForecastData,
	ProductComparisons,
	CompetitorComparison,
	FeatureComparison,
	MarketPosition,
	PageInfo,
	ApiResponse,
	ProductApiResponse,
	ProductsApiResponse,
	ProductSearchApiResponse,
	CompareListApiResponse,
	ProductInventoryApiResponse,
	ProductAnalyticsApiResponse,
} from "../types";

// ============================================================================
// GRAPHQL QUERIES - استعلامات GraphQL
// ============================================================================

// Get All Categories Query
const GET_ALL_CATEGORIES = gql`
	query GetAllCategories {
		categories {
			categories {
				id
				name
				slug
				metaDescription
				image
				imageFilename
				parent {
					id
					name
				}
				childs {
					id
					name
					slug
				}
			}
			totalCount
		}
	}
`;

// Get Category by ID Query
const GET_CATEGORY_BY_ID = gql`
	query GetCategoryById($id: Int!) {
		category(id: $id) {
			id
			name
			slug
			metaDescription
			image
			imageFilename
			parent {
				id
				name
			}
			childs {
				id
				name
				slug
			}
			products {
				id
				name
				price
				barcode
				weight
				description
				image
				imageFilename
				slug
				sku
				isInStock
				combinationInfoVariant
				variantPrice
				variantPriceAfterDiscount
				variantHasDiscountedPrice
				isVariantPossible
				variantAttributeValues {
					id
					name
					attribute {
						id
						name
					}
				}
				attributeValues {
					id
					name
					attribute {
						id
						name
					}
				}
				productVariants {
					id
					name
					price
					attributeValues {
						id
						name
					}
				}
				firstVariant {
					id
					name
					price
				}
			}
		}
	}
`;

// Get All Products Query
const GET_ALL_PRODUCTS = gql`
	query GetAllProducts {
		products {
			products {
				id
				name
				price
				barcode
				weight
				description
				image
				imageFilename
				slug
				sku
				isInStock
				categories {
					id
					name
					slug
				}
				combinationInfoVariant
				variantPrice
				variantPriceAfterDiscount
				variantHasDiscountedPrice
				isVariantPossible
				variantAttributeValues {
					id
					name
					attribute {
						id
						name
					}
				}
				attributeValues {
					id
					name
					attribute {
						id
						name
					}
				}
				productVariants {
					id
					name
					price
					attributeValues {
						id
						name
					}
				}
				firstVariant {
					id
					name
					price
				}
			}
			totalCount
			minPrice
			maxPrice
		}
	}
`;

// Get Product by ID Query
const GET_PRODUCT_BY_ID = gql`
	query GetProductById($id: Int!) {
		product(id: $id) {
			id
			name
			price
			barcode
			weight
			description
			image
			imageFilename
			slug
			sku
			isInStock
			categories {
				id
				name
				slug
			}
			combinationInfoVariant
			variantPrice
			variantPriceAfterDiscount
			variantHasDiscountedPrice
			isVariantPossible
			variantAttributeValues {
				id
				name
				attribute {
					id
					name
				}
			}
			attributeValues {
				id
				name
				attribute {
					id
					name
				}
			}
			productVariants {
				id
				name
				price
				attributeValues {
					id
					name
				}
			}
			firstVariant {
				id
				name
				price
			}
		}
	}
`;

// Get Products by Category Query
const GET_PRODUCTS_BY_CATEGORY = gql`
	query GetCategoryWithProducts($id: Int!) {
		category(id: $id) {
			id
			name
			displayName
			products {
				id
				name
				displayName
				price
				listPrice
				standardPrice
				defaultCode
				barcode
				weight
				volume
				description
				descriptionSale
				image
				imageFilename
				image1920
				imageSmall
				imageMedium
				slug
				sku
				isInStock
				websitePublished
				isPublished
				active
				saleOk
				purchaseOk
				combinationInfoVariant
				variantPrice
				variantPriceAfterDiscount
				variantHasDiscountedPrice
				isVariantPossible
				variantAttributeValues {
					id
					name
					displayName
					attribute {
						id
						name
						displayName
					}
				}
				attributeValues {
					id
					name
					displayName
					attribute {
						id
						name
						displayName
					}
				}
				productVariants {
					id
					displayName
					listPrice
					standardPrice
					defaultCode
					attributeValues {
						id
						name
						displayName
					}
				}
				productVariantIds {
					id
					displayName
					listPrice
					standardPrice
					defaultCode
				}
				attributeLineIds {
					id
					attributeId {
						id
						name
						displayName
					}
					valueIds {
						id
						name
						displayName
					}
				}
				firstVariant {
					id
					name
					displayName
					price
					listPrice
					standardPrice
					defaultCode
				}
				qtyAvailable
				virtualAvailable
				incomingQty
				outgoingQty
				createDate
				writeDate
			}
		}
	}
`;

// ============================================================================
// APOLLO CLIENT CONFIGURATION
// ============================================================================


// Use absolute URL on the server, relative on the client
function getOdooProxyUrl() {
  if (typeof window === "undefined") {
	// Server-side: use env or fallback
	const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000";
	// Remove trailing slash if present
	const baseUrl = base.replace(/\/$/, "");
	return `${baseUrl}/api/odoo-proxy`;
  }
  // Client-side: relative URL
  return "/api/odoo-proxy";
}

const resolvedOdooUrl = getOdooProxyUrl();
console.log("[Apollo] Using Odoo GraphQL endpoint (proxy):", resolvedOdooUrl);
const httpLink = createHttpLink({
  uri: resolvedOdooUrl,
});

const authLink = setContext((_, { headers }) => {
	const token =
		process.env.NEXT_PUBLIC_ODOO_API_KEY ||
		"d22fb86e790ba068c5b3bcfb801109892f3a0b38";
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

export const displayApolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			errorPolicy: "all",
		},
		query: {
			errorPolicy: "all",
		},
	},
});

// ============================================================================
// DISPLAY SERVICE CLASS
// ============================================================================

export class DisplayService {
	private client: ApolloClient<any>;

	constructor(client?: ApolloClient<any>) {
		
		this.client = client || getServerApolloClient();
	}

	// ============================================================================
	// CATEGORY METHODS - طرق الفئات
	// ============================================================================

	/**
	 * Get all categories
	 * الحصول على جميع الفئات
	 */
	async getAllCategories(): Promise<ApiResponse<ProductCategory[]>> {
		try {
			const { data } = await this.client.query({
				query: GET_ALL_CATEGORIES,
			});

			if (data?.categories?.categories) {
				const categories: ProductCategory[] = data.categories.categories.map(
					this.mapGraphQLCategoryToType,
				);

				return {
					success: true,
					data: categories,
					message: `تم العثور على ${categories.length} فئة`,
				};
			}

			return {
				success: false,
				error: "لم يتم العثور على فئات",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	/**
	 * Get category by ID
	 * الحصول على فئة بالمعرف
	 */
	async getCategoryById(id: number): Promise<ApiResponse<ProductCategory>> {
		try {
			const { data } = await this.client.query({
				query: GET_CATEGORY_BY_ID,
				variables: { id },
			});

			if (data?.category) {
				const category: ProductCategory = this.mapGraphQLCategoryToType(
					data.category,
				);

				return {
					success: true,
					data: category,
					message: `تم العثور على الفئة: ${category.name}`,
				};
			}

			return {
				success: false,
				error: `لم يتم العثور على الفئة بالمعرف: ${id}`,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	// ============================================================================
	// PRODUCT METHODS - طرق المنتجات
	// ============================================================================

	/**
	 * Get all products
	 * الحصول على جميع المنتجات
	 */
async getAllProducts(): Promise<ProductsApiResponse> {
	try {
		const response = await this.client.query({
			query: GET_ALL_PRODUCTS,
		});
		// Log the full response and endpoint for debugging
		console.log("[Apollo] Endpoint:", resolvedOdooUrl);
		console.log("[Apollo] Full response:", response);
		const { data, errors } = response;
		if (errors && errors.length > 0) {
			console.error("[Apollo] GraphQL errors:", errors);
			return {
				success: false,
				error: errors.map((e: any) => e.message).join(" | ") || "GraphQL error",
			};
		}
		if (data?.products?.products) {
			const products: Product[] = data.products.products.map(
				this.mapGraphQLProductToType,
			);
			return {
				success: true,
				data: products,
				message: `تم العثور على ${products.length} منتج`,
				pagination: {
					current_page: 1,
					page_size: products.length,
					total_pages: 1,
					total_count: data.products.totalCount,
					has_next_page: false,
					has_previous_page: false,
				},
			};
		}
		// Log the raw data if products are missing
		console.error("[Apollo] No products found. Raw data:", data);
		return {
			success: false,
			error: "لم يتم العثور على منتجات",
		};
	} catch (error: any) {
		// Log the error and any response text if available
		if (error && error.networkError && error.networkError.result) {
			console.error("[Apollo] Network error result:", error.networkError.result);
		}
		console.error("[Apollo] getAllProducts error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "خطأ غير معروف",
		};
	}
}

	/**
	 * Get product by ID
	 * الحصول على منتج بالمعرف
	 */
	async getProductById(id: number): Promise<ProductApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_BY_ID,
				variables: { id },
			});

			if (data?.product) {
				const product: Product = this.mapGraphQLProductToType(data.product);

				return {
					success: true,
					data: product,
					message: `تم العثور على المنتج: ${product.name}`,
				};
			}

			return {
				success: false,
				error: `لم يتم العثور على المنتج بالمعرف: ${id}`,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	/**
	 * Get products by category ID
	 * الحصول على منتجات فئة معينة
	 */
	async getProductsByCategory(
		categoryId: number,
	): Promise<ProductsApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCTS_BY_CATEGORY,
				variables: { id: categoryId },
			});

			if (data?.category) {
				const products: Product[] = data.category.products.map(
					this.mapGraphQLProductToType,
				);

				return {
					success: true,
					data: products,
					message: `تم العثور على ${products.length} منتج في الفئة`,
					pagination: {
						current_page: 1,
						page_size: products.length,
						total_pages: 1,
						total_count: products.length,
						has_next_page: false,
						has_previous_page: false,
					},
				};
			}

			return {
				success: false,
				error: `لم يتم العثور على منتجات في الفئة: ${categoryId}`,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	// ============================================================================
	// SEARCH METHODS - طرق البحث
	// ============================================================================

	/**
	 * Search products
	 * البحث في المنتجات
	 */
	async searchProducts(
		searchInput: ProductSearchInput,
	): Promise<ProductSearchApiResponse> {
		try {
			// Use the general products query with search filter
			const result = await this.getAllProducts();

			if (result.success && result.data) {
				let filteredProducts = result.data;

				// Apply search filter
				if (searchInput.query) {
					const query = searchInput.query.toLowerCase();
					filteredProducts = filteredProducts.filter(
						(product) =>
							product.name.toLowerCase().includes(query) ||
							product.sku.toLowerCase().includes(query) ||
							product.description?.html.toLowerCase().includes(query),
					);
				}

				// Apply category filter
				if (searchInput.filters?.category_id) {
					filteredProducts = filteredProducts.filter((product) =>
						product.categories.some(
							(cat) => cat.id === searchInput.filters!.category_id,
						),
					);
				}

				// Apply price range filter
				if (searchInput.filters?.price_range) {
					const { min, max } = searchInput.filters.price_range;
					filteredProducts = filteredProducts.filter((product) => {
						const price = product.price.regularPrice.value;
						return (!min || price >= min) && (!max || price <= max);
					});
				}

				// Apply in stock filter
				if (searchInput.filters?.in_stock) {
					filteredProducts = filteredProducts.filter(
						(product) => product.is_in_stock,
					);
				}

				// Apply sorting
				if (searchInput.sort_by) {
					filteredProducts.sort((a, b) => {
						let aValue: any, bValue: any;

						switch (searchInput.sort_by) {
							case "name":
								aValue = a.name;
								bValue = b.name;
								break;
							case "price":
								aValue = a.price.regularPrice.value;
								bValue = b.price.regularPrice.value;
								break;
							case "created_at":
								aValue = new Date(a.created_at);
								bValue = new Date(b.created_at);
								break;
							default:
								aValue = a.name;
								bValue = b.name;
						}

						if (searchInput.sort_direction === "DESC") {
							return aValue > bValue ? -1 : 1;
						}
						return aValue < bValue ? -1 : 1;
					});
				}

				// Apply pagination
				const pageSize = searchInput.page_size || 20;
				const currentPage = searchInput.current_page || 1;
				const startIndex = (currentPage - 1) * pageSize;
				const endIndex = startIndex + pageSize;
				const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

				const searchResult: ProductSearchResult = {
					products: paginatedProducts,
					total_count: filteredProducts.length,
					page_info: {
						current_page: currentPage,
						page_size: pageSize,
						total_pages: Math.ceil(filteredProducts.length / pageSize),
						total_count: filteredProducts.length,
						has_next_page: endIndex < filteredProducts.length,
						has_previous_page: currentPage > 1,
					},
				};

				return {
					success: true,
					data: searchResult,
					message: `تم العثور على ${filteredProducts.length} منتج`,
				};
			}

			return {
				success: false,
				error: "فشل في البحث",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	// ============================================================================
	// DATA MAPPING METHODS - طرق تحويل البيانات
	// ============================================================================

	/**
	 * Map GraphQL category to TypeScript type
	 * تحويل فئة GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLCategoryToType(graphqlCategory: any): ProductCategory {
		return {
			id: graphqlCategory.id,
			name: graphqlCategory.name,
			url_path: graphqlCategory.slug || "",
			level: 0, // Default level
			parent_id: graphqlCategory.parent?.id,
			children: graphqlCategory.childs?.map((child: any) => ({
				id: child.id,
				name: child.name,
				url_path: child.slug || "",
				level: 1,
				product_count: 0,
				is_active: true,
			})),
			image: graphqlCategory.image,
			description: graphqlCategory.metaDescription,
			product_count: 0, // Not available in current schema
			meta_title: graphqlCategory.name,
			meta_description: graphqlCategory.metaDescription,
			is_active: true,
		};
	}

	/**
	 * Map GraphQL product to TypeScript type
	 * تحويل منتج GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLProductToType(graphqlProduct: any): Product {
		return {
			id: graphqlProduct.id,
			name: graphqlProduct.name,
			sku: graphqlProduct.sku || graphqlProduct.barcode || "",
			url_key: graphqlProduct.slug || "",
			price: {
				regularPrice: {
					value: graphqlProduct.price || 0,
					currency: "AED",
				},
				specialPrice: graphqlProduct.variantPriceAfterDiscount
					? {
							value: graphqlProduct.variantPriceAfterDiscount,
							currency: "AED",
						}
					: undefined,
			},
			image: {
				url: graphqlProduct.image || "",
				alt: graphqlProduct.name,
			},
			description: {
				html: graphqlProduct.description || "",
			},
			short_description: {
				html: graphqlProduct.description || "",
			},
			categories:
				graphqlProduct.categories?.map((cat: any) => ({
					id: cat.id,
					name: cat.name,
					url_path: cat.slug || "",
				})) || [],
			stock_status: graphqlProduct.isInStock ? "IN_STOCK" : "OUT_OF_STOCK",
			weight: graphqlProduct.weight,
			dimensions: undefined,
			attributes:
				graphqlProduct.attributeValues?.map((attr: any) => ({
					attribute_code: attr.attribute?.name || attr.name,
					attribute_value: attr.name,
					attribute_label: attr.attribute?.name || attr.name,
				})) || [],
			reviews: [],
			average_rating: undefined,
			review_count: undefined,
			is_in_stock: graphqlProduct.isInStock,
			qty_available: undefined,
			min_qty: undefined,
			max_qty: undefined,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			related_products: [],
			// Enhanced Product Fields
			meta_title: graphqlProduct.name,
			meta_description: graphqlProduct.description,
			meta_keywords: graphqlProduct.sku || graphqlProduct.barcode,
			canonical_url: graphqlProduct.slug,
			og_image: graphqlProduct.image,
			og_title: graphqlProduct.name,
			og_description: graphqlProduct.description,
		};
	}
}

// ============================================================================
// SERVICE INSTANCE EXPORT
// ============================================================================

export const displayService = new DisplayService();

// ============================================================================
// HOOKS EXPORT
// ============================================================================

export const useDisplayService = () => displayService;
