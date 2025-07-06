/**
 * Category & Product Service - خدمة الفئات والمنتجات
 * خدمة شاملة لإدارة الفئات والمنتجات مع جميع الاستعلامات العاملة
 */

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql } from "graphql-request";

import {
	Product,
	ProductCategory,
	ProductPrice,
	Money,
	ProductImage,
	ProductDescription,
	ProductAttribute,
	StockStatus,
	ProductDimensions,
	ProductReview,
	ReviewUser,
	ProductVariant,
	ProductConfigurableOption,
	ConfigurableOptionValue,
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
				slug
			}
			childs {
				id
				name
				slug
				metaDescription
			}
			products {
				id
				name
				price
				image
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
			description
			websiteDescription
			image
			imageFilename
			slug
			sku
			isInStock
			attributeValues {
				name
				value
			}
		}
	}
`;

// Get Products by Category Query
const GET_PRODUCTS_BY_CATEGORY = gql`
	query GetProductsByCategory($categoryId: Int!) {
		categoryProducts(categoryId: $categoryId) {
			products {
				id
				name
				price
				description
				image
				imageFilename
				slug
				sku
				isInStock
			}
			totalCount
		}
	}
`;

// ============================================================================
// APOLLO CLIENT CONFIGURATION
// ============================================================================

const httpLink = createHttpLink({
	uri:
		process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL ||
		"https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf",
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

export const categoryProductApolloClient = new ApolloClient({
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
// CATEGORY & PRODUCT SERVICE CLASS
// ============================================================================

export class CategoryProductService {
	private client: ApolloClient<any>;

	constructor(client?: ApolloClient<any>) {
		this.client = client || categoryProductApolloClient;
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
			const { data } = await this.client.query({
				query: GET_ALL_PRODUCTS,
			});

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

			return {
				success: false,
				error: "لم يتم العثور على منتجات",
			};
		} catch (error) {
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
				variables: { categoryId },
			});

			if (data?.categoryProducts?.products) {
				const products: Product[] = data.categoryProducts.products.map(
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
						total_count: data.categoryProducts.totalCount,
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
	// RECOMMENDATION METHODS - طرق التوصيات
	// ============================================================================

	/**
	 * Get product recommendations
	 * الحصول على توصيات المنتجات
	 */
	async getProductRecommendations(
		productId: number,
		type: RecommendationType = "RELATED",
		limit: number = 5,
	): Promise<ApiResponse<ProductRecommendation[]>> {
		try {
			// Get all products first
			const result = await this.getAllProducts();

			if (result.success && result.data) {
				// Filter out the current product
				const otherProducts = result.data.filter((p) => p.id !== productId);

				// Simple recommendation logic (can be enhanced)
				const recommendations: ProductRecommendation[] = otherProducts
					.slice(0, limit)
					.map((product) => ({
						id: product.id,
						name: product.name,
						sku: product.sku,
						url_key: product.url_key,
						price: product.price,
						image: product.image,
						short_description: product.short_description,
						stock_status: product.stock_status,
						is_in_stock: product.is_in_stock,
						average_rating: product.average_rating,
						review_count: product.review_count,
						recommendation_reason: type as RecommendationReason,
						confidence_score: Math.random() * 0.5 + 0.5, // Random confidence score
					}));

				return {
					success: true,
					data: recommendations,
					message: `تم العثور على ${recommendations.length} توصية`,
				};
			}

			return {
				success: false,
				error: "لم يتم العثور على توصيات",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	// ============================================================================
	// COMPARE METHODS - طرق المقارنة
	// ============================================================================

	/**
	 * Get compare list
	 * الحصول على قائمة المقارنة
	 */
	async getCompareList(): Promise<CompareListApiResponse> {
		try {
			// For now, return an empty compare list
			// This can be enhanced to use actual compare list functionality
			const compareList: CompareList = {
				id: "compare-list-" + Date.now(),
				items: [],
				item_count: 0,
				max_items: 4,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			return {
				success: true,
				data: compareList,
				message: "قائمة المقارنة فارغة",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	// ============================================================================
	// INVENTORY METHODS - طرق المخزون
	// ============================================================================

	/**
	 * Get product inventory
	 * الحصول على مخزون المنتج
	 */
	async getProductInventory(
		productId: number,
	): Promise<ProductInventoryApiResponse> {
		try {
			// Get product first
			const productResult = await this.getProductById(productId);

			if (productResult.success && productResult.data) {
				const product = productResult.data;

				const inventory: ProductInventory = {
					product_id: productId,
					sku: product.sku,
					qty_available: product.qty_available || 0,
					qty_reserved: 0, // Not available in current schema
					qty_on_hand: product.qty_available || 0,
					stock_status: product.stock_status,
					is_in_stock: product.is_in_stock,
					low_stock_threshold: 5, // Default value
					backorder_allowed: false, // Default value
					warehouse_locations: [
						{
							warehouse_id: 1,
							warehouse_name: "المستودع الرئيسي",
							qty_available: product.qty_available || 0,
							qty_reserved: 0,
							qty_on_hand: product.qty_available || 0,
							location_code: "MAIN",
						},
					],
					stock_movements: [], // Not available in current schema
				};

				return {
					success: true,
					data: inventory,
					message: `معلومات المخزون للمنتج: ${product.name}`,
				};
			}

			return {
				success: false,
				error: `لم يتم العثور على مخزون للمنتج: ${productId}`,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "خطأ غير معروف",
			};
		}
	}

	// ============================================================================
	// ANALYTICS METHODS - طرق التحليلات
	// ============================================================================

	/**
	 * Get product analytics
	 * الحصول على تحليلات المنتج
	 */
	async getProductAnalytics(
		productId: number,
	): Promise<ProductAnalyticsApiResponse> {
		try {
			// Get product first
			const productResult = await this.getProductById(productId);

			if (productResult.success && productResult.data) {
				const product = productResult.data;

				const analytics: ProductAnalytics = {
					product_id: productId,
					views: Math.floor(Math.random() * 1000), // Mock data
					unique_views: Math.floor(Math.random() * 800), // Mock data
					add_to_cart_count: Math.floor(Math.random() * 100), // Mock data
					purchase_count: Math.floor(Math.random() * 50), // Mock data
					conversion_rate: Math.random() * 0.1, // Mock data
					revenue: {
						value: product.price.regularPrice.value * Math.random() * 50,
						currency: product.price.regularPrice.currency,
					},
					average_order_value: {
						value: product.price.regularPrice.value * (1 + Math.random()),
						currency: product.price.regularPrice.currency,
					},
					review_count: product.review_count || 0,
					average_rating: product.average_rating || 0,
					return_rate: Math.random() * 0.05, // Mock data
					time_period: "MONTH" as AnalyticsPeriod,
				};

				return {
					success: true,
					data: analytics,
					message: `تحليلات المنتج: ${product.name}`,
				};
			}

			return {
				success: false,
				error: `لم يتم العثور على تحليلات للمنتج: ${productId}`,
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
			sku: graphqlProduct.sku || "",
			url_key: graphqlProduct.slug || "",
			price: {
				regularPrice: {
					value: graphqlProduct.price || 0,
					currency: "AED",
				},
			},
			image: {
				url: graphqlProduct.image || "",
				alt: graphqlProduct.name,
			},
			description: {
				html:
					graphqlProduct.description || graphqlProduct.websiteDescription || "",
			},
			short_description: {
				html: graphqlProduct.description || "",
			},
			categories:
				graphqlProduct.categories?.map((cat: any) => ({
					id: cat.id,
					name: cat.name,
					url_path: cat.slug || "",
					level: 0,
					product_count: 0,
					is_active: true,
				})) || [],
			stock_status: graphqlProduct.isInStock
				? "IN_STOCK"
				: ("OUT_OF_STOCK" as StockStatus),
			attributes:
				graphqlProduct.attributeValues?.map((attr: any) => ({
					attribute_code: attr.name,
					attribute_value: attr.value,
					attribute_label: attr.name,
				})) || [],
			is_in_stock: graphqlProduct.isInStock || false,
			qty_available: 0, // Not available in current schema
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
	}
}

// ============================================================================
// SERVICE INSTANCE EXPORT
// ============================================================================

export const categoryProductService = new CategoryProductService();

// ============================================================================
// HOOKS EXPORT
// ============================================================================

export const useCategoryProductService = () => categoryProductService;
