/**
 * Product GraphQL Mutations
 * طلبات GraphQL للمنتجات - جميع الطفرات المتعلقة بالمنتجات
 */

import { gql } from "graphql-request";

// ============================================================================
// PRODUCT MANAGEMENT MUTATIONS
// ============================================================================

export const CREATE_PRODUCT_MUTATION = gql`
	mutation CreateProduct($input: ProductInput!) {
		createProduct(input: $input) {
			product {
				id
				name
				description
				shortDescription
				sku
				price
				compareAtPrice
				cost
				weight
				dimensions
				images {
					id
					url
					alt
					position
				}
				categories {
					id
					name
					slug
				}
				attributes {
					id
					name
					values
				}
				inventory {
					quantity
					lowStockThreshold
					trackQuantity
				}
				seo {
					metaTitle
					metaDescription
					urlKey
				}
				status
				createdAt
				updatedAt
			}
			success
			message
		}
	}
`;

export const UPDATE_PRODUCT_MUTATION = gql`
	mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
		updateProduct(id: $id, input: $input) {
			product {
				id
				name
				description
				shortDescription
				sku
				price
				compareAtPrice
				cost
				weight
				dimensions
				images {
					id
					url
					alt
					position
				}
				categories {
					id
					name
					slug
				}
				attributes {
					id
					name
					values
				}
				inventory {
					quantity
					lowStockThreshold
					trackQuantity
				}
				seo {
					metaTitle
					metaDescription
					urlKey
				}
				status
				updatedAt
			}
			success
			message
		}
	}
`;

export const DELETE_PRODUCT_MUTATION = gql`
	mutation DeleteProduct($id: ID!) {
		deleteProduct(id: $id) {
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT INVENTORY MUTATIONS
// ============================================================================

export const UPDATE_PRODUCT_INVENTORY_MUTATION = gql`
	mutation UpdateProductInventory($id: ID!, $input: InventoryInput!) {
		updateProductInventory(id: $id, input: $input) {
			product {
				id
				inventory {
					quantity
					lowStockThreshold
					trackQuantity
					lastUpdated
				}
			}
			success
			message
		}
	}
`;

export const ADJUST_PRODUCT_STOCK_MUTATION = gql`
	mutation AdjustProductStock($id: ID!, $quantity: Int!, $reason: String!) {
		adjustProductStock(id: $id, quantity: $quantity, reason: $reason) {
			product {
				id
				inventory {
					quantity
					lastUpdated
				}
			}
			adjustment {
				id
				quantity
				reason
				date
				user {
					id
					name
				}
			}
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT IMAGE MUTATIONS
// ============================================================================

export const ADD_PRODUCT_IMAGE_MUTATION = gql`
	mutation AddProductImage($productId: ID!, $input: ProductImageInput!) {
		addProductImage(productId: $productId, input: $input) {
			image {
				id
				url
				alt
				position
				createdAt
			}
			success
			message
		}
	}
`;

export const UPDATE_PRODUCT_IMAGE_MUTATION = gql`
	mutation UpdateProductImage($id: ID!, $input: ProductImageUpdateInput!) {
		updateProductImage(id: $id, input: $input) {
			image {
				id
				url
				alt
				position
				updatedAt
			}
			success
			message
		}
	}
`;

export const DELETE_PRODUCT_IMAGE_MUTATION = gql`
	mutation DeleteProductImage($id: ID!) {
		deleteProductImage(id: $id) {
			success
			message
		}
	}
`;

export const REORDER_PRODUCT_IMAGES_MUTATION = gql`
	mutation ReorderProductImages($productId: ID!, $imageIds: [ID!]!) {
		reorderProductImages(productId: $productId, imageIds: $imageIds) {
			images {
				id
				position
			}
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT CATEGORY MUTATIONS
// ============================================================================

export const ADD_PRODUCT_TO_CATEGORY_MUTATION = gql`
	mutation AddProductToCategory($productId: ID!, $categoryId: ID!) {
		addProductToCategory(productId: $productId, categoryId: $categoryId) {
			product {
				id
				categories {
					id
					name
					slug
				}
			}
			success
			message
		}
	}
`;

export const REMOVE_PRODUCT_FROM_CATEGORY_MUTATION = gql`
	mutation RemoveProductFromCategory($productId: ID!, $categoryId: ID!) {
		removeProductFromCategory(productId: $productId, categoryId: $categoryId) {
			product {
				id
				categories {
					id
					name
					slug
				}
			}
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT ATTRIBUTE MUTATIONS
// ============================================================================

export const ADD_PRODUCT_ATTRIBUTE_MUTATION = gql`
	mutation AddProductAttribute(
		$productId: ID!
		$input: ProductAttributeInput!
	) {
		addProductAttribute(productId: $productId, input: $input) {
			attribute {
				id
				name
				values
			}
			success
			message
		}
	}
`;

export const UPDATE_PRODUCT_ATTRIBUTE_MUTATION = gql`
	mutation UpdateProductAttribute(
		$id: ID!
		$input: ProductAttributeUpdateInput!
	) {
		updateProductAttribute(id: $id, input: $input) {
			attribute {
				id
				name
				values
			}
			success
			message
		}
	}
`;

export const DELETE_PRODUCT_ATTRIBUTE_MUTATION = gql`
	mutation DeleteProductAttribute($id: ID!) {
		deleteProductAttribute(id: $id) {
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT PRICING MUTATIONS
// ============================================================================

export const UPDATE_PRODUCT_PRICE_MUTATION = gql`
	mutation UpdateProductPrice($id: ID!, $input: ProductPriceInput!) {
		updateProductPrice(id: $id, input: $input) {
			product {
				id
				price
				compareAtPrice
				cost
				updatedAt
			}
			success
			message
		}
	}
`;

export const BULK_UPDATE_PRODUCT_PRICES_MUTATION = gql`
	mutation BulkUpdateProductPrices($input: [BulkProductPriceInput!]!) {
		bulkUpdateProductPrices(input: $input) {
			updatedProducts {
				id
				price
				compareAtPrice
			}
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT SEO MUTATIONS
// ============================================================================

export const UPDATE_PRODUCT_SEO_MUTATION = gql`
	mutation UpdateProductSEO($id: ID!, $input: ProductSEOInput!) {
		updateProductSEO(id: $id, input: $input) {
			product {
				id
				seo {
					metaTitle
					metaDescription
					urlKey
				}
				updatedAt
			}
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT STATUS MUTATIONS
// ============================================================================

export const UPDATE_PRODUCT_STATUS_MUTATION = gql`
	mutation UpdateProductStatus($id: ID!, $status: ProductStatus!) {
		updateProductStatus(id: $id, status: $status) {
			product {
				id
				status
				updatedAt
			}
			success
			message
		}
	}
`;

export const BULK_UPDATE_PRODUCT_STATUS_MUTATION = gql`
	mutation BulkUpdateProductStatus($ids: [ID!]!, $status: ProductStatus!) {
		bulkUpdateProductStatus(ids: $ids, status: $status) {
			updatedProducts {
				id
				status
			}
			success
			message
		}
	}
`;

// ============================================================================
// CART MANAGEMENT MUTATIONS
// ============================================================================

export const ADD_TO_CART_MUTATION = gql`
	mutation AddToCart($input: AddToCartInput!) {
		addToCart(input: $input) {
			cart {
				id
				items {
					id
					product_id
					name
					quantity
					price
					total
					image
				}
				total
				itemCount
			}
			success
			message
		}
	}
`;

export const UPDATE_CART_ITEM_MUTATION = gql`
	mutation UpdateCartItem($itemId: Int!, $quantity: Int!) {
		updateCartItem(itemId: $itemId, quantity: $quantity) {
			cart {
				id
				items {
					id
					product_id
					name
					quantity
					price
					total
				}
				total
				itemCount
			}
			success
			message
		}
	}
`;

export const REMOVE_FROM_CART_MUTATION = gql`
	mutation RemoveFromCart($itemId: Int!) {
		removeFromCart(itemId: $itemId) {
			cart {
				id
				items {
					id
					product_id
					name
					quantity
					price
					total
				}
				total
				itemCount
			}
			success
			message
		}
	}
`;

export const CLEAR_CART_MUTATION = gql`
	mutation ClearCart {
		clearCart {
			success
			message
		}
	}
`;

export const MERGE_GUEST_CART_MUTATION = gql`
	mutation MergeGuestCart($guestCartId: String!) {
		mergeGuestCart(guestCartId: $guestCartId) {
			cart {
				id
				items {
					id
					product_id
					name
					quantity
					price
					total
				}
				total
				itemCount
			}
			success
			message
		}
	}
`;

// ============================================================================
// WISHLIST MANAGEMENT MUTATIONS
// ============================================================================

export const ADD_TO_WISHLIST_MUTATION = gql`
	mutation AddToWishlist($productId: Int!) {
		addToWishlist(productId: $productId) {
			wishlist {
				id
				items {
					id
					product_id
					name
					price
					image
					addedAt
				}
				itemCount
			}
			success
			message
		}
	}
`;

export const REMOVE_FROM_WISHLIST_MUTATION = gql`
	mutation RemoveFromWishlist($productId: Int!) {
		removeFromWishlist(productId: $productId) {
			wishlist {
				id
				items {
					id
					product_id
					name
					price
					image
				}
				itemCount
			}
			success
			message
		}
	}
`;

export const CLEAR_WISHLIST_MUTATION = gql`
	mutation ClearWishlist {
		clearWishlist {
			success
			message
		}
	}
`;

export const MOVE_TO_CART_MUTATION = gql`
	mutation MoveToCart($productId: Int!, $quantity: Int!) {
		movetoCart(productId: $productId, quantity: $quantity) {
			cart {
				id
				items {
					id
					product_id
					name
					quantity
					price
					total
				}
				total
				itemCount
			}
			wishlist {
				id
				items {
					id
					product_id
					name
					price
					image
				}
				itemCount
			}
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT REVIEW MUTATIONS
// ============================================================================

export const ADD_PRODUCT_REVIEW_MUTATION = gql`
	mutation AddProductReview($input: ProductReviewInput!) {
		addProductReview(input: $input) {
			review {
				id
				product_id
				user_id
				rating
				title
				comment
				createdAt
			}
			success
			message
		}
	}
`;

export const UPDATE_PRODUCT_REVIEW_MUTATION = gql`
	mutation UpdateProductReview($reviewId: Int!, $input: ProductReviewInput!) {
		updateProductReview(reviewId: $reviewId, input: $input) {
			review {
				id
				product_id
				user_id
				rating
				title
				comment
				updatedAt
			}
			success
			message
		}
	}
`;

export const DELETE_PRODUCT_REVIEW_MUTATION = gql`
	mutation DeleteProductReview($reviewId: Int!) {
		deleteProductReview(reviewId: $reviewId) {
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT SHARING MUTATIONS
// ============================================================================

export const SHARE_PRODUCT_MUTATION = gql`
	mutation ShareProduct(
		$productId: Int!
		$platform: String!
		$message: String
	) {
		shareProduct(
			productId: $productId
			platform: $platform
			message: $message
		) {
			success
			message
			shareUrl
		}
	}
`;

// ============================================================================
// PRODUCT COMPARISON MUTATIONS
// ============================================================================

export const ADD_TO_COMPARE_MUTATION = gql`
	mutation AddToCompare($productId: Int!) {
		addToCompare(productId: $productId) {
			compareList {
				id
				items {
					id
					product_id
					name
					price
					image
				}
				itemCount
			}
			success
			message
		}
	}
`;

export const REMOVE_FROM_COMPARE_MUTATION = gql`
	mutation RemoveFromCompare($productId: Int!) {
		removeFromCompare(productId: $productId) {
			compareList {
				id
				items {
					id
					product_id
					name
					price
					image
				}
				itemCount
			}
			success
			message
		}
	}
`;

export const CLEAR_COMPARE_MUTATION = gql`
	mutation ClearCompare {
		clearCompare {
			success
			message
		}
	}
`;

// ============================================================================
// PRODUCT NOTIFICATION MUTATIONS
// ============================================================================

export const SUBSCRIBE_PRODUCT_NOTIFICATION_MUTATION = gql`
	mutation SubscribeProductNotification($productId: Int!, $email: String!) {
		subscribeProductNotification(productId: $productId, email: $email) {
			success
			message
		}
	}
`;

export const UNSUBSCRIBE_PRODUCT_NOTIFICATION_MUTATION = gql`
	mutation UnsubscribeProductNotification($productId: Int!, $email: String!) {
		unsubscribeProductNotification(productId: $productId, email: $email) {
			success
			message
		}
	}
`;

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface ProductInput {
	name: string;
	description?: string;
	shortDescription?: string;
	sku: string;
	price: number;
	compareAtPrice?: number;
	cost?: number;
	weight?: number;
	dimensions?: {
		length?: number;
		width?: number;
		height?: number;
	};
	categoryIds?: string[];
	attributeIds?: string[];
	inventory?: {
		quantity: number;
		lowStockThreshold?: number;
		trackQuantity: boolean;
	};
	seo?: {
		metaTitle?: string;
		metaDescription?: string;
		urlKey?: string;
	};
	status?: ProductStatus;
}

export interface ProductUpdateInput {
	name?: string;
	description?: string;
	shortDescription?: string;
	sku?: string;
	price?: number;
	compareAtPrice?: number;
	cost?: number;
	weight?: number;
	dimensions?: {
		length?: number;
		width?: number;
		height?: number;
	};
	status?: ProductStatus;
}

export interface InventoryInput {
	quantity: number;
	lowStockThreshold?: number;
	trackQuantity: boolean;
}

export interface ProductImageInput {
	url: string;
	alt?: string;
	position?: number;
}

export interface ProductImageUpdateInput {
	url?: string;
	alt?: string;
	position?: number;
}

export interface ProductAttributeInput {
	name: string;
	values: string[];
}

export interface ProductAttributeUpdateInput {
	name?: string;
	values?: string[];
}

export interface ProductPriceInput {
	price: number;
	compareAtPrice?: number;
	cost?: number;
}

export interface BulkProductPriceInput {
	id: string;
	price: number;
	compareAtPrice?: number;
	cost?: number;
}

export interface ProductSEOInput {
	metaTitle?: string;
	metaDescription?: string;
	urlKey?: string;
}

export interface AddToCartInput {
	productId: number;
	quantity: number;
	attributes?: ProductAttributeInput[];
}

export interface ProductReviewInput {
	productId: number;
	rating: number;
	title: string;
	comment: string;
}

// ============================================================================
// ENUM TYPES
// ============================================================================

export enum ProductStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	DRAFT = "draft",
	ARCHIVED = "archived",
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface Product {
	id: string;
	name: string;
	description?: string;
	shortDescription?: string;
	sku: string;
	price: number;
	compareAtPrice?: number;
	cost?: number;
	weight?: number;
	dimensions?: {
		length?: number;
		width?: number;
		height?: number;
	};
	images: ProductImage[];
	categories: ProductCategory[];
	attributes: ProductAttribute[];
	inventory: ProductInventory;
	seo: ProductSEO;
	status: ProductStatus;
	createdAt: string;
	updatedAt: string;
}

export interface ProductImage {
	id: string;
	url: string;
	alt?: string;
	position: number;
	createdAt: string;
	updatedAt?: string;
}

export interface ProductCategory {
	id: string;
	name: string;
	slug: string;
}

export interface ProductAttribute {
	id: string;
	name: string;
	values: string[];
}

export interface ProductInventory {
	quantity: number;
	lowStockThreshold?: number;
	trackQuantity: boolean;
	lastUpdated?: string;
}

export interface ProductSEO {
	metaTitle?: string;
	metaDescription?: string;
	urlKey?: string;
}

export interface ProductResult {
	product?: Product;
	success: boolean;
	message?: string;
	error?: string;
}

export interface CartItem {
	id: number;
	product_id: number;
	name: string;
	quantity: number;
	price: number;
	total: number;
	image?: string;
	attributes?: ProductAttribute[];
}

export interface Cart {
	id: string;
	items: CartItem[];
	total: number;
	itemCount: number;
}

export interface WishlistItem {
	id: number;
	product_id: number;
	name: string;
	price: number;
	image?: string;
	addedAt: string;
}

export interface Wishlist {
	id: string;
	items: WishlistItem[];
	itemCount: number;
}

export interface ProductReview {
	id: number;
	product_id: number;
	user_id: number;
	rating: number;
	title: string;
	comment: string;
	createdAt: string;
	updatedAt?: string;
}

export interface CompareItem {
	id: number;
	product_id: number;
	name: string;
	price: number;
	image?: string;
}

export interface CompareList {
	id: string;
	items: CompareItem[];
	itemCount: number;
}

export interface ProductMutationResult {
	success: boolean;
	message?: string;
	error?: string;
	cart?: Cart;
	wishlist?: Wishlist;
	review?: ProductReview;
	compareList?: CompareList;
	shareUrl?: string;
}
