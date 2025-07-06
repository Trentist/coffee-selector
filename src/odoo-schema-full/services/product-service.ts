/**
 * Product Service - خدمة المنتجات
 * خدمة شاملة لإدارة المنتجات والفئات مع جميع الاستعلامات العاملة
 */

import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	DocumentNode,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
	GET_PRODUCTS,
	GET_PRODUCT_BY_ID,
	GET_PRODUCT_BY_SLUG,
	GET_PRODUCT_REVIEWS,
	GET_PRODUCT_SUGGESTIONS,
	GET_COMPARE_LIST,
	GET_TRENDING_PRODUCTS,
	GET_PRODUCT_CATEGORIES,
	Product,
	ProductCategory,
	ProductReview,
	ProductSuggestion,
	CompareList,
	ProductStock,
	ProductsResponse,
	CategoriesResponse,
	ReviewsResponse,
	ProductAttributeFilterInput,
	ProductSortInput,
	ReviewSortInput,
	RecommendationType,
	TrendingPeriod,
} from "../queries/product-queries";

import {
	Product as ProductType,
	ProductCategory as ProductCategoryType,
	ProductReview as ProductReviewType,
	ProductSuggestion as ProductSuggestionType,
	CompareList as CompareListType,
	ProductInventory as ProductInventoryType,
	ProductAnalytics as ProductAnalyticsType,
	ProductSearchInput,
	ProductSearchResult,
	ProductFilterInput,
	ProductRecommendation,
	RecommendationReason,
	StockStatus,
	AttributeType,
	PageInfo,
	ApiResponse,
	ProductApiResponse,
	ProductsApiResponse,
	ProductSearchApiResponse,
	ProductInventoryApiResponse,
	ProductAnalyticsApiResponse,
} from "../types";

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

export const apolloClient = new ApolloClient({
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
// PRODUCT SERVICE CLASS
// ============================================================================

export class ProductService {
	private client: ApolloClient<any>;

	constructor(client?: ApolloClient<any>) {
		this.client = client || apolloClient;
	}

	// ============================================================================
	// PRODUCT LISTING METHODS
	// ============================================================================

	/**
	 * Get all products with filtering and pagination
	 * الحصول على جميع المنتجات مع التصفية والترقيم
	 */
	async getProducts(
		pageSize: number = 20,
		currentPage: number = 1,
		filters?: ProductFilterInput,
		sortBy?: string,
		sortDirection: "ASC" | "DESC" = "DESC",
	): Promise<ProductsApiResponse> {
		try {
			const sort: ProductSortInput = {
				field: sortBy || "created_at",
				direction: sortDirection,
			};

			const graphqlFilters: ProductAttributeFilterInput = {
				category_id: filters?.category_id,
				price_range: filters?.price_range
					? {
							min: filters.price_range.min,
							max: filters.price_range.max,
						}
					: undefined,
				attributes: filters?.attributes?.reduce(
					(acc, attr) => {
						acc[attr.attribute_code] = attr.values;
						return acc;
					},
					{} as Record<string, string[]>,
				),
				in_stock: filters?.in_stock,
				on_sale: filters?.on_sale,
				rating: filters?.rating,
				search: filters?.search,
			};

			const { data } = await this.client.query({
				query: GET_PRODUCTS,
				variables: {
					pageSize,
					currentPage,
					filters: graphqlFilters,
					sort,
				},
			});

			if (data?.products) {
				const products: ProductType[] = data.products.products.products.map(
					this.mapGraphQLProductToType,
				);
				const pageInfo: PageInfo = data.products.products.page_info;

				return {
					success: true,
					data: products,
					pagination: pageInfo,
				};
			}

			return {
				success: false,
				error: "No products found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
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
				const product: ProductType = this.mapGraphQLProductToType(data.product);
				return {
					success: true,
					data: product,
				};
			}

			return {
				success: false,
				error: "Product not found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get product by slug/URL key
	 * الحصول على منتج بالرابط
	 */
	async getProductBySlug(urlKey: string): Promise<ProductApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_BY_SLUG,
				variables: { urlKey },
			});

			if (data?.products?.products?.length > 0) {
				const product: ProductType = this.mapGraphQLProductToType(
					data.products.products[0],
				);
				return {
					success: true,
					data: product,
				};
			}

			return {
				success: false,
				error: "Product not found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get featured products
	 * الحصول على المنتجات المميزة
	 */
	async getFeaturedProducts(limit: number = 10): Promise<ProductsApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_TRENDING_PRODUCTS,
				variables: { limit },
			});

			if (data?.trendingProducts) {
				const products: ProductType[] = data.trendingProducts.map(
					this.mapGraphQLProductToType,
				);
				return {
					success: true,
					data: products,
				};
			}

			return {
				success: false,
				error: "No featured products found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get new products
	 * الحصول على المنتجات الجديدة
	 */
	async getNewProducts(limit: number = 10): Promise<ProductsApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_TRENDING_PRODUCTS,
				variables: { limit },
			});

			if (data?.trendingProducts) {
				const products: ProductType[] = data.trendingProducts.map(
					this.mapGraphQLProductToType,
				);
				return {
					success: true,
					data: products,
				};
			}

			return {
				success: false,
				error: "No new products found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get best selling products
	 * الحصول على المنتجات الأكثر مبيعاً
	 */
	async getBestSellers(limit: number = 10): Promise<ProductsApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_TRENDING_PRODUCTS,
				variables: { limit },
			});

			if (data?.trendingProducts) {
				const products: ProductType[] = data.trendingProducts.map(
					this.mapGraphQLProductToType,
				);
				return {
					success: true,
					data: products,
				};
			}

			return {
				success: false,
				error: "No best sellers found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// ============================================================================
	// CATEGORY METHODS
	// ============================================================================

	/**
	 * Get all categories
	 * الحصول على جميع الفئات
	 */
	async getCategories(): Promise<ApiResponse<ProductCategoryType[]>> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_CATEGORIES,
			});

			if (data?.categories) {
				const categories: ProductCategoryType[] = data.categories.map(
					this.mapGraphQLCategoryToType,
				);
				return {
					success: true,
					data: categories,
				};
			}

			return {
				success: false,
				error: "No categories found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get category by ID
	 * الحصول على فئة بالمعرف
	 */
	async getCategoryById(id: number): Promise<ApiResponse<ProductCategoryType>> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_CATEGORIES,
				variables: { id },
			});

			if (data?.category) {
				const category: ProductCategoryType = this.mapGraphQLCategoryToType(
					data.category,
				);
				return {
					success: true,
					data: category,
				};
			}

			return {
				success: false,
				error: "Category not found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get products by category ID
	 * الحصول على منتجات فئة معينة
	 */
	async getProductsByCategory(
		categoryId: number,
		pageSize: number = 20,
		currentPage: number = 1,
	): Promise<ProductsApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_CATEGORIES,
				variables: {
					categoryId,
					pageSize,
					currentPage,
				},
			});

			if (data?.categoryProducts) {
				const products: ProductType[] = data.categoryProducts.products.map(
					this.mapGraphQLProductToType,
				);
				const pageInfo: PageInfo = data.categoryProducts.page_info;

				return {
					success: true,
					data: products,
					pagination: pageInfo,
				};
			}

			return {
				success: false,
				error: "No products found in category",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// ============================================================================
	// REVIEW METHODS
	// ============================================================================

	/**
	 * Get product reviews
	 * الحصول على تقييمات المنتج
	 */
	async getProductReviews(
		productId: number,
		pageSize: number = 10,
		currentPage: number = 1,
		sortBy?: string,
		sortDirection: "ASC" | "DESC" = "DESC",
	): Promise<ApiResponse<ProductReviewType[]>> {
		try {
			const sort: ReviewSortInput = {
				field: sortBy || "created_at",
				direction: sortDirection,
			};

			const { data } = await this.client.query({
				query: GET_PRODUCT_REVIEWS,
				variables: {
					productId,
					pageSize,
					currentPage,
					sort,
				},
			});

			if (data?.productReviews) {
				const reviews: ProductReviewType[] = data.productReviews.reviews.map(
					this.mapGraphQLReviewToType,
				);
				return {
					success: true,
					data: reviews,
				};
			}

			return {
				success: false,
				error: "No reviews found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// ============================================================================
	// SEARCH AND SUGGESTION METHODS
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
			const filters: ProductFilterInput = {
				search: searchInput.query,
				...searchInput.filters,
			};

			const result = await this.getProducts(
				searchInput.page_size || 20,
				searchInput.current_page || 1,
				filters,
				searchInput.sort_by,
				searchInput.sort_direction,
			);

			if (result.success && result.data) {
				const searchResult: ProductSearchResult = {
					products: result.data,
					total_count: result.pagination?.total_count || 0,
					page_info: result.pagination || {
						current_page: 1,
						page_size: 20,
						total_pages: 1,
						total_count: 0,
						has_next_page: false,
						has_previous_page: false,
					},
				};

				return {
					success: true,
					data: searchResult,
				};
			}

			return {
				success: false,
				error: "Search failed",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get product suggestions
	 * الحصول على اقتراحات المنتجات
	 */
	async getProductSuggestions(
		query: string,
		limit: number = 5,
	): Promise<ApiResponse<ProductSuggestionType[]>> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_SUGGESTIONS,
				variables: { query, limit },
			});

			if (data?.productSuggestions) {
				const suggestions: ProductSuggestionType[] =
					data.productSuggestions.map(this.mapGraphQLSuggestionToType);
				return {
					success: true,
					data: suggestions,
				};
			}

			return {
				success: false,
				error: "No suggestions found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// ============================================================================
	// COMPARE METHODS
	// ============================================================================

	/**
	 * Get compare list
	 * الحصول على قائمة المقارنة
	 */
	async getCompareList(): Promise<ApiResponse<CompareListType>> {
		try {
			const { data } = await this.client.query({
				query: GET_COMPARE_LIST,
			});

			if (data?.compareList) {
				const compareList: CompareListType = this.mapGraphQLCompareListToType(
					data.compareList,
				);
				return {
					success: true,
					data: compareList,
				};
			}

			return {
				success: false,
				error: "Compare list not found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// ============================================================================
	// INVENTORY METHODS
	// ============================================================================

	/**
	 * Get product inventory
	 * الحصول على مخزون المنتج
	 */
	async getProductInventory(
		productId: number,
	): Promise<ProductInventoryApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_CATEGORIES,
				variables: { productId },
			});

			if (data?.productInventory) {
				const inventory: ProductInventoryType = this.mapGraphQLInventoryToType(
					data.productInventory,
				);
				return {
					success: true,
					data: inventory,
				};
			}

			return {
				success: false,
				error: "Inventory not found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// ============================================================================
	// ANALYTICS METHODS
	// ============================================================================

	/**
	 * Get product analytics
	 * الحصول على تحليلات المنتج
	 */
	async getProductAnalytics(
		productId: number,
	): Promise<ProductAnalyticsApiResponse> {
		try {
			const { data } = await this.client.query({
				query: GET_PRODUCT_CATEGORIES,
				variables: { productId },
			});

			if (data?.productAnalytics) {
				const analytics: ProductAnalyticsType = this.mapGraphQLAnalyticsToType(
					data.productAnalytics,
				);
				return {
					success: true,
					data: analytics,
				};
			}

			return {
				success: false,
				error: "Analytics not found",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	// ============================================================================
	// DATA MAPPING METHODS
	// ============================================================================

	/**
	 * Map GraphQL product to TypeScript type
	 * تحويل منتج GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLProductToType(graphqlProduct: any): ProductType {
		return {
			id: graphqlProduct.id,
			name: graphqlProduct.name,
			sku: graphqlProduct.sku,
			url_key: graphqlProduct.url_key,
			price: {
				regularPrice: {
					value: graphqlProduct.price.regularPrice.amount.value,
					currency: graphqlProduct.price.regularPrice.amount.currency,
				},
				specialPrice: graphqlProduct.price.specialPrice
					? {
							value: graphqlProduct.price.specialPrice.amount.value,
							currency: graphqlProduct.price.specialPrice.amount.currency,
						}
					: undefined,
			},
			image: {
				url: graphqlProduct.image.url,
				alt: graphqlProduct.image.alt,
			},
			gallery: graphqlProduct.gallery?.map((img: any) => ({
				url: img.url,
				alt: img.alt,
			})),
			description: {
				html: graphqlProduct.description.html,
			},
			short_description: {
				html: graphqlProduct.short_description.html,
			},
			categories: graphqlProduct.categories.map((cat: any) => ({
				id: cat.id,
				name: cat.name,
				url_path: cat.url_path,
			})),
			stock_status: graphqlProduct.stock_status as StockStatus,
			weight: graphqlProduct.weight,
			dimensions: graphqlProduct.dimensions
				? {
						length: graphqlProduct.dimensions.length,
						width: graphqlProduct.dimensions.width,
						height: graphqlProduct.dimensions.height,
						unit: "cm",
					}
				: undefined,
			attributes: graphqlProduct.attributes.map((attr: any) => ({
				attribute_code: attr.attribute_code,
				attribute_value: attr.attribute_value,
				attribute_label: attr.attribute_label,
			})),
			reviews: graphqlProduct.reviews?.map((review: any) => ({
				id: review.id,
				product_id: graphqlProduct.id,
				user_id: review.user_id,
				rating: review.rating,
				title: review.title,
				comment: review.comment,
				created_at: review.created_at,
				user: review.user
					? {
							id: review.user.id,
							name: review.user.name,
							avatar: review.user.avatar,
						}
					: undefined,
			})),
			average_rating: graphqlProduct.average_rating,
			review_count: graphqlProduct.review_count,
			is_in_stock: graphqlProduct.is_in_stock,
			qty_available: graphqlProduct.qty_available,
			min_qty: graphqlProduct.min_qty,
			max_qty: graphqlProduct.max_qty,
			created_at: graphqlProduct.created_at,
			updated_at: graphqlProduct.updated_at,
			related_products: graphqlProduct.related_products?.map((prod: any) => ({
				id: prod.id,
				name: prod.name,
				sku: prod.sku,
				url_key: prod.url_key,
				price: {
					regularPrice: {
						value: prod.price.regularPrice.amount.value,
						currency: prod.price.regularPrice.amount.currency,
					},
				},
				image: {
					url: prod.image.url,
					alt: prod.image.alt,
				},
			})),
		};
	}

	/**
	 * Map GraphQL category to TypeScript type
	 * تحويل فئة GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLCategoryToType(graphqlCategory: any): ProductCategoryType {
		return {
			id: graphqlCategory.id,
			name: graphqlCategory.name,
			url_path: graphqlCategory.url_path,
			level: graphqlCategory.level || 0,
			parent_id: graphqlCategory.parent_id,
			children: graphqlCategory.children?.map((child: any) => ({
				id: child.id,
				name: child.name,
				url_path: child.url_path,
				level: child.level || 0,
			})),
			image: graphqlCategory.image,
			description: graphqlCategory.description,
			product_count: graphqlCategory.product_count || 0,
			meta_title: graphqlCategory.meta_title,
			meta_description: graphqlCategory.meta_description,
			is_active: graphqlCategory.is_active !== false,
		};
	}

	/**
	 * Map GraphQL review to TypeScript type
	 * تحويل تقييم GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLReviewToType(graphqlReview: any): ProductReviewType {
		return {
			id: graphqlReview.id,
			product_id: graphqlReview.product_id,
			user_id: graphqlReview.user_id,
			rating: graphqlReview.rating,
			title: graphqlReview.title,
			comment: graphqlReview.comment,
			created_at: graphqlReview.created_at,
			updated_at: graphqlReview.updated_at,
			user: graphqlReview.user
				? {
						id: graphqlReview.user.id,
						name: graphqlReview.user.name,
						avatar: graphqlReview.user.avatar,
						email: graphqlReview.user.email,
						is_verified: graphqlReview.user.is_verified,
					}
				: undefined,
			helpful_count: graphqlReview.helpful_count,
			is_verified_purchase: graphqlReview.is_verified_purchase,
			is_approved: graphqlReview.is_approved,
		};
	}

	/**
	 * Map GraphQL suggestion to TypeScript type
	 * تحويل اقتراح GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLSuggestionToType(
		graphqlSuggestion: any,
	): ProductSuggestionType {
		return {
			id: graphqlSuggestion.id,
			name: graphqlSuggestion.name,
			sku: graphqlSuggestion.sku,
			url_key: graphqlSuggestion.url_key,
			image: graphqlSuggestion.image
				? {
						url: graphqlSuggestion.image.url,
						alt: graphqlSuggestion.image.alt,
					}
				: undefined,
			price: graphqlSuggestion.price
				? {
						regularPrice: {
							value: graphqlSuggestion.price.regularPrice.amount.value,
							currency: graphqlSuggestion.price.regularPrice.amount.currency,
						},
					}
				: undefined,
			relevance_score: graphqlSuggestion.relevance_score,
			search_highlight: graphqlSuggestion.search_highlight,
		};
	}

	/**
	 * Map GraphQL compare list to TypeScript type
	 * تحويل قائمة مقارنة GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLCompareListToType(
		graphqlCompareList: any,
	): CompareListType {
		return {
			id: graphqlCompareList.id,
			items: graphqlCompareList.items.map((item: any) => ({
				id: item.id,
				product_id: item.product_id,
				name: item.name,
				sku: item.sku,
				price: {
					regularPrice: {
						value: item.price.regularPrice.amount.value,
						currency: item.price.regularPrice.amount.currency,
					},
				},
				image: {
					url: item.image.url,
					alt: item.image.alt,
				},
				attributes: item.attributes.map((attr: any) => ({
					attribute_code: attr.attribute_code,
					attribute_value: attr.attribute_value,
				})),
				stock_status: item.stock_status as StockStatus,
				is_in_stock: item.is_in_stock,
				average_rating: item.average_rating,
				review_count: item.review_count,
				added_at: item.added_at,
			})),
			item_count: graphqlCompareList.item_count,
			max_items: graphqlCompareList.max_items || 4,
			created_at: graphqlCompareList.created_at,
			updated_at: graphqlCompareList.updated_at,
		};
	}

	/**
	 * Map GraphQL inventory to TypeScript type
	 * تحويل مخزون GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLInventoryToType(
		graphqlInventory: any,
	): ProductInventoryType {
		return {
			product_id: graphqlInventory.product_id,
			sku: graphqlInventory.sku,
			qty_available: graphqlInventory.qty_available,
			qty_reserved: graphqlInventory.qty_reserved,
			qty_on_hand: graphqlInventory.qty_on_hand,
			stock_status: graphqlInventory.stock_status as StockStatus,
			is_in_stock: graphqlInventory.is_in_stock,
			low_stock_threshold: graphqlInventory.low_stock_threshold,
			backorder_allowed: graphqlInventory.backorder_allowed,
			expected_date: graphqlInventory.expected_date,
			warehouse_locations: graphqlInventory.warehouse_locations?.map(
				(loc: any) => ({
					warehouse_id: loc.warehouse_id,
					warehouse_name: loc.warehouse_name,
					qty_available: loc.qty_available,
					qty_reserved: loc.qty_reserved,
					qty_on_hand: loc.qty_on_hand,
					location_code: loc.location_code,
				}),
			),
			stock_movements: graphqlInventory.stock_movements?.map((mov: any) => ({
				id: mov.id,
				product_id: mov.product_id,
				warehouse_id: mov.warehouse_id,
				movement_type: mov.movement_type,
				quantity: mov.quantity,
				reference: mov.reference,
				date: mov.date,
				notes: mov.notes,
			})),
		};
	}

	/**
	 * Map GraphQL analytics to TypeScript type
	 * تحويل تحليلات GraphQL إلى نوع TypeScript
	 */
	private mapGraphQLAnalyticsToType(
		graphqlAnalytics: any,
	): ProductAnalyticsType {
		return {
			product_id: graphqlAnalytics.product_id,
			views: graphqlAnalytics.views,
			unique_views: graphqlAnalytics.unique_views,
			add_to_cart_count: graphqlAnalytics.add_to_cart_count,
			purchase_count: graphqlAnalytics.purchase_count,
			conversion_rate: graphqlAnalytics.conversion_rate,
			revenue: {
				value: graphqlAnalytics.revenue.value,
				currency: graphqlAnalytics.revenue.currency,
			},
			average_order_value: {
				value: graphqlAnalytics.average_order_value.value,
				currency: graphqlAnalytics.average_order_value.currency,
			},
			review_count: graphqlAnalytics.review_count,
			average_rating: graphqlAnalytics.average_rating,
			return_rate: graphqlAnalytics.return_rate,
			time_period: graphqlAnalytics.time_period,
		};
	}
}

// ============================================================================
// SERVICE INSTANCE EXPORT
// ============================================================================

export const productService = new ProductService();

// ============================================================================
// HOOKS EXPORT
// ============================================================================

export const useProductService = () => productService;
