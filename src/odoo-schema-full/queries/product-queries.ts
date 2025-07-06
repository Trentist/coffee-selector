/**
 * Product GraphQL Queries
 * استعلامات GraphQL للمنتجات - جميع الاستعلامات المتعلقة بالمنتجات
 */

import { gql } from "graphql-request";

// ============================================================================
// PRODUCT LISTING QUERIES
// ============================================================================

export const GET_PRODUCTS = gql`
	query GetProducts(
		$pageSize: Int
		$currentPage: Int
		$filters: ProductAttributeFilterInput
		$sort: ProductSortInput
	) {
		products(
			pageSize: $pageSize
			currentPage: $currentPage
			filter: $filters
			sort: $sort
		) {
			products {
				id
				name
				sku
				url_key
				price {
					regularPrice {
						amount {
							value
							currency
						}
					}
					specialPrice {
						amount {
							value
							currency
						}
					}
				}
				image {
					url
					alt
				}
				description {
					html
				}
				short_description {
					html
				}
				categories {
					id
					name
					url_path
				}
				stock_status
				weight
				attributes {
					attribute_code
					attribute_value
				}
				reviews {
					id
					rating
					title
					comment
					created_at
				}
				average_rating
				review_count
				is_in_stock
				qty_available
				created_at
				updated_at
			}
			total_count
			page_info {
				current_page
				page_size
				total_pages
			}
		}
	}
`;

export const GET_PRODUCT_BY_ID = gql`
	query GetProductById($id: Int!) {
		product(id: $id) {
			id
			name
			sku
			url_key
			price {
				regularPrice {
					amount {
						value
						currency
					}
				}
				specialPrice {
					amount {
						value
						currency
					}
				}
			}
			image {
				url
				alt
			}
			gallery {
				url
				alt
			}
			description {
				html
			}
			short_description {
				html
			}
			categories {
				id
				name
				url_path
			}
			stock_status
			weight
			dimensions {
				length
				width
				height
			}
			attributes {
				attribute_code
				attribute_value
				attribute_label
			}
			reviews {
				id
				user_id
				rating
				title
				comment
				created_at
				user {
					name
				}
			}
			average_rating
			review_count
			is_in_stock
			qty_available
			min_qty
			max_qty
			created_at
			updated_at
			related_products {
				id
				name
				sku
				price {
					regularPrice {
						amount {
							value
							currency
						}
					}
				}
				image {
					url
					alt
				}
			}
		}
	}
`;

export const GET_PRODUCT_BY_SLUG = gql`
	query GetProductBySlug($urlKey: String!) {
		products(filter: { url_key: { eq: $urlKey } }) {
			products {
				id
				name
				sku
				url_key
				price {
					regularPrice {
						amount {
							value
							currency
						}
					}
					specialPrice {
						amount {
							value
							currency
						}
					}
				}
				image {
					url
					alt
				}
				gallery {
					url
					alt
				}
				description {
					html
				}
				short_description {
					html
				}
				categories {
					id
					name
					url_path
				}
				stock_status
				weight
				dimensions {
					length
					width
					height
				}
				attributes {
					attribute_code
					attribute_value
					attribute_label
				}
				reviews {
					id
					user_id
					rating
					title
					comment
					created_at
					user {
						name
					}
				}
				average_rating
				review_count
				is_in_stock
				qty_available
				min_qty
				max_qty
				created_at
				updated_at
			}
		}
	}
`;

// ============================================================================
// PRODUCT SEARCH QUERIES
// ============================================================================

export const SEARCH_PRODUCTS = gql`
	query SearchProducts(
		$search: String!
		$pageSize: Int
		$currentPage: Int
		$filters: ProductAttributeFilterInput
		$sort: ProductSortInput
	) {
		products(
			search: $search
			pageSize: $pageSize
			currentPage: $currentPage
			filter: $filters
			sort: $sort
		) {
			products {
				id
				name
				sku
				url_key
				price {
					regularPrice {
						amount {
							value
							currency
						}
					}
					specialPrice {
						amount {
							value
							currency
						}
					}
				}
				image {
					url
					alt
				}
				short_description {
					html
				}
				categories {
					id
					name
					url_path
				}
				stock_status
				is_in_stock
				average_rating
				review_count
			}
			total_count
			page_info {
				current_page
				page_size
				total_pages
			}
		}
	}
`;

export const GET_PRODUCT_SUGGESTIONS = gql`
	query GetProductSuggestions($search: String!, $limit: Int) {
		productSuggestions(search: $search, limit: $limit) {
			id
			name
			sku
			url_key
			image {
				url
				alt
			}
			price {
				regularPrice {
					amount {
						value
						currency
					}
				}
			}
		}
	}
`;

// ============================================================================
// PRODUCT CATEGORY QUERIES
// ============================================================================

export const GET_PRODUCT_CATEGORIES = gql`
	query GetProductCategories($pageSize: Int, $currentPage: Int) {
		categories(pageSize: $pageSize, currentPage: $currentPage) {
			items {
				id
				name
				url_path
				image
				description
				product_count
				level
				parent_id
				children {
					id
					name
					url_path
					product_count
					level
				}
			}
			total_count
			page_info {
				current_page
				page_size
				total_pages
			}
		}
	}
`;

export const GET_CATEGORY_PRODUCTS = gql`
	query GetCategoryProducts(
		$categoryId: Int!
		$pageSize: Int
		$currentPage: Int
		$filters: ProductAttributeFilterInput
		$sort: ProductSortInput
	) {
		categoryProducts(
			categoryId: $categoryId
			pageSize: $pageSize
			currentPage: $currentPage
			filter: $filters
			sort: $sort
		) {
			products {
				id
				name
				sku
				url_key
				price {
					regularPrice {
						amount {
							value
							currency
						}
					}
					specialPrice {
						amount {
							value
							currency
						}
					}
				}
				image {
					url
					alt
				}
				short_description {
					html
				}
				stock_status
				is_in_stock
				average_rating
				review_count
			}
			total_count
			page_info {
				current_page
				page_size
				total_pages
			}
		}
	}
`;

// ============================================================================
// PRODUCT ATTRIBUTE QUERIES
// ============================================================================

export const GET_PRODUCT_ATTRIBUTES = gql`
	query GetProductAttributes {
		productAttributes {
			id
			code
			label
			type
			required
			values {
				id
				value
				label
			}
		}
	}
`;

export const GET_PRODUCT_ATTRIBUTE_OPTIONS = gql`
	query GetProductAttributeOptions($attributeCode: String!) {
		productAttributeOptions(attributeCode: $attributeCode) {
			id
			value
			label
			sort_order
		}
	}
`;

// ============================================================================
// PRODUCT REVIEW QUERIES
// ============================================================================

export const GET_PRODUCT_REVIEWS = gql`
	query GetProductReviews(
		$productId: Int!
		$pageSize: Int
		$currentPage: Int
		$sort: ReviewSortInput
	) {
		productReviews(
			productId: $productId
			pageSize: $pageSize
			currentPage: $currentPage
			sort: $sort
		) {
			reviews {
				id
				product_id
				user_id
				rating
				title
				comment
				created_at
				updated_at
				user {
					id
					name
					avatar
				}
				helpful_count
				is_verified_purchase
			}
			total_count
			page_info {
				current_page
				page_size
				total_pages
			}
			summary {
				average_rating
				total_reviews
				rating_distribution {
					rating
					count
					percentage
				}
			}
		}
	}
`;

export const GET_USER_PRODUCT_REVIEW = gql`
	query GetUserProductReview($productId: Int!) {
		userProductReview(productId: $productId) {
			id
			product_id
			user_id
			rating
			title
			comment
			created_at
			updated_at
		}
	}
`;

// ============================================================================
// PRODUCT COMPARISON QUERIES
// ============================================================================

export const GET_COMPARE_LIST = gql`
	query GetCompareList {
		compareList {
			id
			items {
				id
				product_id
				name
				sku
				price {
					regularPrice {
						amount {
							value
							currency
						}
					}
				}
				image {
					url
					alt
				}
				attributes {
					attribute_code
					attribute_value
					attribute_label
				}
				stock_status
				is_in_stock
				average_rating
				review_count
			}
			item_count
		}
	}
`;

// ============================================================================
// PRODUCT RECOMMENDATION QUERIES
// ============================================================================

export const GET_RECOMMENDED_PRODUCTS = gql`
	query GetRecommendedProducts(
		$productId: Int
		$categoryId: Int
		$limit: Int
		$type: RecommendationType
	) {
		recommendedProducts(
			productId: $productId
			categoryId: $categoryId
			limit: $limit
			type: $type
		) {
			id
			name
			sku
			url_key
			price {
				regularPrice {
					amount {
						value
						currency
					}
				}
				specialPrice {
					amount {
						value
						currency
					}
				}
			}
			image {
				url
				alt
			}
			short_description {
				html
			}
			stock_status
			is_in_stock
			average_rating
			review_count
			recommendation_reason
		}
	}
`;

export const GET_TRENDING_PRODUCTS = gql`
	query GetTrendingProducts($limit: Int, $period: TrendingPeriod) {
		trendingProducts(limit: $limit, period: $period) {
			id
			name
			sku
			url_key
			price {
				regularPrice {
					amount {
						value
						currency
					}
				}
			}
			image {
				url
				alt
			}
			sales_count
			view_count
			average_rating
		}
	}
`;

// ============================================================================
// PRODUCT STOCK QUERIES
// ============================================================================

export const GET_PRODUCT_STOCK = gql`
	query GetProductStock($productId: Int!) {
		productStock(productId: $productId) {
			product_id
			qty_available
			qty_reserved
			qty_on_hand
			stock_status
			is_in_stock
			low_stock_threshold
			backorder_allowed
			expected_date
		}
	}
`;

export const GET_MULTIPLE_PRODUCT_STOCK = gql`
	query GetMultipleProductStock($productIds: [Int!]!) {
		multipleProductStock(productIds: $productIds) {
			product_id
			qty_available
			qty_reserved
			qty_on_hand
			stock_status
			is_in_stock
			low_stock_threshold
			backorder_allowed
			expected_date
		}
	}
`;

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface ProductAttributeFilterInput {
	category_id?: number;
	price_range?: {
		min?: number;
		max?: number;
	};
	attributes?: {
		[key: string]: string[];
	};
	in_stock?: boolean;
	on_sale?: boolean;
	rating?: number;
	search?: string;
}

export interface ProductSortInput {
	field: string;
	direction: "ASC" | "DESC";
}

export interface ReviewSortInput {
	field: string;
	direction: "ASC" | "DESC";
}

export type RecommendationType =
	| "RELATED"
	| "SIMILAR"
	| "FREQUENTLY_BOUGHT"
	| "PERSONALIZED";
export type TrendingPeriod = "DAY" | "WEEK" | "MONTH";

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface Product {
	id: number;
	name: string;
	sku: string;
	url_key: string;
	price: ProductPrice;
	image: ProductImage;
	gallery?: ProductImage[];
	description: ProductDescription;
	short_description: ProductDescription;
	categories: ProductCategory[];
	stock_status: string;
	weight?: number;
	dimensions?: ProductDimensions;
	attributes: ProductAttribute[];
	reviews?: ProductReview[];
	average_rating?: number;
	review_count?: number;
	is_in_stock: boolean;
	qty_available?: number;
	min_qty?: number;
	max_qty?: number;
	created_at: string;
	updated_at: string;
	related_products?: Product[];
}

export interface ProductPrice {
	regularPrice: Money;
	specialPrice?: Money;
}

export interface Money {
	amount: {
		value: number;
		currency: string;
	};
}

export interface ProductImage {
	url: string;
	alt: string;
}

export interface ProductDescription {
	html: string;
}

export interface ProductCategory {
	id: number;
	name: string;
	url_path: string;
	level?: number;
	parent_id?: number;
	children?: ProductCategory[];
}

export interface ProductAttribute {
	attribute_code: string;
	attribute_value: string;
	attribute_label?: string;
}

export interface ProductDimensions {
	length: number;
	width: number;
	height: number;
}

export interface ProductReview {
	id: number;
	product_id: number;
	user_id: number;
	rating: number;
	title: string;
	comment: string;
	created_at: string;
	updated_at?: string;
	user?: {
		id: number;
		name: string;
		avatar?: string;
	};
	helpful_count?: number;
	is_verified_purchase?: boolean;
}

export interface ProductSuggestion {
	id: number;
	name: string;
	sku: string;
	url_key: string;
	image: ProductImage;
	price: ProductPrice;
}

export interface ProductStock {
	product_id: number;
	qty_available: number;
	qty_reserved: number;
	qty_on_hand: number;
	stock_status: string;
	is_in_stock: boolean;
	low_stock_threshold?: number;
	backorder_allowed: boolean;
	expected_date?: string;
}

export interface ProductsResponse {
	products: Product[];
	total_count: number;
	page_info: PageInfo;
}

export interface PageInfo {
	current_page: number;
	page_size: number;
	total_pages: number;
}

export interface CategoriesResponse {
	items: ProductCategory[];
	total_count: number;
	page_info: PageInfo;
}

export interface ReviewsResponse {
	reviews: ProductReview[];
	total_count: number;
	page_info: PageInfo;
	summary: ReviewSummary;
}

export interface ReviewSummary {
	average_rating: number;
	total_reviews: number;
	rating_distribution: RatingDistribution[];
}

export interface RatingDistribution {
	rating: number;
	count: number;
	percentage: number;
}

export interface CompareList {
	id: string;
	items: CompareItem[];
	item_count: number;
}

export interface CompareItem {
	id: number;
	product_id: number;
	name: string;
	sku: string;
	price: ProductPrice;
	image: ProductImage;
	attributes: ProductAttribute[];
	stock_status: string;
	is_in_stock: boolean;
	average_rating?: number;
	review_count?: number;
}
