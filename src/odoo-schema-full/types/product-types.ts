"use client";
/**
 * Product TypeScript Types
 * أنواع TypeScript للمنتجات - جميع الأنواع المتعلقة بالمنتجات
 */

// ============================================================================
// CORE PRODUCT TYPES
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
	stock_status: StockStatus;
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
	meta_title?: string;
	meta_description?: string;
	meta_keywords?: string;
	canonical_url?: string;
	og_image?: string;
	og_title?: string;
	og_description?: string;
}

export interface ProductPrice {
	regularPrice: Money;
	specialPrice?: Money;
	costPrice?: Money;
	wholesalePrice?: Money;
	bulkPricing?: BulkPricing[];
}

export interface Money {
	value: number;
	currency: string;
	formatted?: string;
}

export interface BulkPricing {
	min_quantity: number;
	max_quantity?: number;
	price: Money;
	discount_percentage?: number;
}

export interface ProductImage {
	url: string;
	alt: string;
	title?: string;
	width?: number;
	height?: number;
	is_main?: boolean;
	sort_order?: number;
}

export interface ProductDescription {
	html: string;
	plain_text?: string;
}

export interface ProductCategory {
	id: number;
	name: string;
	url_path: string;
	level: number;
	parent_id?: number;
	children?: ProductCategory[];
	image?: string;
	description?: string;
	product_count: number;
	meta_title?: string;
	meta_description?: string;
	is_active: boolean;
}

export type StockStatus =
	| "IN_STOCK"
	| "OUT_OF_STOCK"
	| "LOW_STOCK"
	| "BACKORDER";

export interface ProductDimensions {
	length: number;
	width: number;
	height: number;
	unit: "cm" | "inch";
}

export interface ProductAttribute {
	attribute_code: string;
	attribute_value: string;
	attribute_label?: string;
	attribute_type?: AttributeType;
	is_visible?: boolean;
	is_filterable?: boolean;
	is_searchable?: boolean;
	sort_order?: number;
}

export type AttributeType =
	| "text"
	| "select"
	| "multiselect"
	| "boolean"
	| "number"
	| "date"
	| "color"
	| "image";

// ============================================================================
// PRODUCT REVIEW TYPES
// ============================================================================

export interface ProductReview {
	id: number;
	product_id: number;
	user_id: number;
	rating: number;
	title: string;
	comment: string;
	created_at: string;
	updated_at?: string;
	user?: ReviewUser;
	helpful_count?: number;
	is_verified_purchase?: boolean;
	is_approved?: boolean;
	images?: ReviewImage[];
	helpful_votes?: HelpfulVote[];
}

export interface ReviewUser {
	id: number;
	name: string;
	avatar?: string;
	email?: string;
	is_verified?: boolean;
}

export interface ReviewImage {
	id: number;
	url: string;
	alt: string;
	width?: number;
	height?: number;
}

export interface HelpfulVote {
	id: number;
	user_id: number;
	is_helpful: boolean;
	created_at: string;
}

export interface ReviewSummary {
	average_rating: number;
	total_reviews: number;
	rating_distribution: RatingDistribution[];
	verified_purchases: number;
	recent_reviews: number;
}

export interface RatingDistribution {
	rating: number;
	count: number;
	percentage: number;
}

// ============================================================================
// PRODUCT VARIANT TYPES - أنواع متغيرات المنتج
// ============================================================================

export interface ProductVariant {
	id: number;
	product_id: number;
	sku: string;
	name?: string;
	price: ProductPrice;
	weight?: number;
	dimensions?: ProductDimensions;
	attributes: ProductAttribute[];
	is_in_stock: boolean;
	qty_available?: number;
	min_qty?: number;
	max_qty?: number;
	image?: ProductImage;
	created_at: string;
	updated_at: string;
}

// ============================================================================
// ENHANCED PRODUCT VARIANT TYPES - أنواع متغيرات المنتج المحسنة
// ============================================================================

export interface ProductVariantData {
	id: number;
	displayName: string;
	listPrice: number;
	standardPrice: number;
	defaultCode: string;
	attributeValues?: AttributeValue[];
}

export interface AttributeValue {
	id: number;
	name: string;
	displayName: string;
	attribute?: Attribute;
}

export interface Attribute {
	id: number;
	name: string;
	displayName: string;
	variantCreateMode?: VariantCreateMode;
}

export type VariantCreateMode = "ALWAYS" | "DYNAMIC" | "NEVER";

export interface ProductVariantInfo {
	combinationInfoVariant?: any;
	variantPrice: number;
	variantPriceAfterDiscount: number;
	variantHasDiscountedPrice: boolean;
	isVariantPossible: boolean;
	variantAttributeValues?: AttributeValue[];
	attributeValues?: AttributeValue[];
	productVariants?: ProductVariantData[];
	firstVariant?: Product;
}

// ============================================================================
// ENHANCED PRODUCT INTERFACE - واجهة المنتج المحسنة
// ============================================================================

export interface EnhancedProduct extends Product {
	// Variant Information
	combinationInfoVariant?: any;
	variantPrice?: number;
	variantPriceAfterDiscount?: number;
	variantHasDiscountedPrice?: boolean;
	isVariantPossible?: boolean;
	variantAttributeValues?: AttributeValue[];
	attributeValues?: AttributeValue[];
	productVariants?: ProductVariantData[];
	firstVariant?: Product;

	// Additional Product Fields
	displayName?: string;
	listPrice?: number;
	standardPrice?: number;
	defaultCode?: string;
	barcode?: string;
	weight?: number;
	volume?: number;
	descriptionSale?: string;
	image1920?: string;
	imageSmall?: string;
	imageMedium?: string;
	websitePublished?: boolean;
	isPublished?: boolean;
	active?: boolean;
	saleOk?: boolean;
	purchaseOk?: boolean;
	categId?: ProductCategory;
	productVariantIds?: ProductVariantData[];
	attributeLineIds?: AttributeLine[];
	qtyAvailable?: number;
	virtualAvailable?: number;
	incomingQty?: number;
	outgoingQty?: number;
	createDate?: string;
	writeDate?: string;
}

// ============================================================================
// ATTRIBUTE LINE TYPES - أنواع خطوط الخصائص
// ============================================================================

export interface AttributeLine {
	id: number;
	attributeId: Attribute;
	valueIds: AttributeValue[];
}

// ============================================================================
// PRODUCT FILTER TYPES - أنواع تصفية المنتجات
// ============================================================================

export interface ProductFilter {
	id: string;
	name: string;
	type: FilterType;
	values: FilterValue[];
	is_active: boolean;
	sort_order: number;
}

export type FilterType =
	| "range"
	| "select"
	| "multiselect"
	| "boolean"
	| "category"
	| "price"
	| "rating";

export interface FilterValue {
	id: string;
	label: string;
	value: string;
	count?: number;
	is_selected?: boolean;
	children?: FilterValue[];
}

export interface ProductFilterInput {
	category_id?: number;
	price_range?: PriceRange;
	attributes?: AttributeFilter[];
	in_stock?: boolean;
	on_sale?: boolean;
	rating?: number;
	search?: string;
	sort_by?: SortField;
	sort_direction?: SortDirection;
}

export interface PriceRange {
	min?: number;
	max?: number;
	currency: string;
}

export interface AttributeFilter {
	attribute_code: string;
	values: string[];
	operator?: "eq" | "in" | "like" | "gt" | "lt" | "gte" | "lte";
}

export type SortField =
	| "name"
	| "price"
	| "created_at"
	| "updated_at"
	| "rating"
	| "popularity"
	| "relevance";
export type SortDirection = "ASC" | "DESC";

// ============================================================================
// PRODUCT SEARCH TYPES
// ============================================================================

export interface ProductSearchInput {
	query: string;
	filters?: ProductFilterInput;
	page_size?: number;
	current_page?: number;
	sort_by?: SortField;
	sort_direction?: SortDirection;
}

export interface ProductSearchResult {
	products: Product[];
	total_count: number;
	page_info: PageInfo;
	search_suggestions?: string[];
	related_searches?: string[];
	facets?: SearchFacet[];
}

export interface SearchFacet {
	attribute_code: string;
	attribute_label: string;
	values: FacetValue[];
}

export interface FacetValue {
	value: string;
	label: string;
	count: number;
	is_selected: boolean;
}

export interface PageInfo {
	current_page: number;
	page_size: number;
	total_pages: number;
	total_count: number;
	has_next_page: boolean;
	has_previous_page: boolean;
}

export interface ProductSuggestion {
	id: number;
	name: string;
	sku: string;
	url_key: string;
	price: ProductPrice;
	image?: ProductImage;
	category?: string;
	in_stock: boolean;
	key: string;
	relevance_score?: number;
	search_highlight?: string;
}

// ============================================================================
// PRODUCT COMPARISON TYPES
// ============================================================================

export interface CompareList {
	id: string;
	items: CompareItem[];
	item_count: number;
	max_items: number;
	created_at: string;
	updated_at: string;
}

export interface CompareItem {
	id: number;
	product_id: number;
	name: string;
	sku: string;
	price: ProductPrice;
	image: ProductImage;
	attributes: ProductAttribute[];
	stock_status: StockStatus;
	is_in_stock: boolean;
	average_rating?: number;
	review_count?: number;
	added_at: string;
}

export interface ComparisonMatrix {
	products: Product[];
	attributes: ComparisonAttribute[];
	differences: ComparisonDifference[];
}

export interface ComparisonAttribute {
	code: string;
	label: string;
	values: ComparisonAttributeValue[];
}

export interface ComparisonAttributeValue {
	product_id: number;
	value: string;
	is_different: boolean;
}

export interface ComparisonDifference {
	attribute_code: string;
	attribute_label: string;
	differences: AttributeDifference[];
}

export interface AttributeDifference {
	product_id: number;
	value: string;
	is_better?: boolean;
	is_worse?: boolean;
}

// ============================================================================
// PRODUCT RECOMMENDATION TYPES
// ============================================================================

export interface ProductRecommendation {
	id: number;
	name: string;
	sku: string;
	url_key: string;
	price: ProductPrice;
	image: ProductImage;
	short_description?: ProductDescription;
	stock_status: StockStatus;
	is_in_stock: boolean;
	average_rating?: number;
	review_count?: number;
	recommendation_reason: RecommendationReason;
	confidence_score?: number;
}

export type RecommendationReason =
	| "RELATED_PRODUCT"
	| "SIMILAR_PRODUCT"
	| "FREQUENTLY_BOUGHT_TOGETHER"
	| "CUSTOMERS_ALSO_VIEWED"
	| "PERSONALIZED"
	| "TRENDING"
	| "NEW_ARRIVAL"
	| "BEST_SELLER";

export interface RecommendationEngine {
	type: RecommendationType;
	algorithm: string;
	parameters: Record<string, any>;
	performance_metrics: PerformanceMetrics;
}

export type RecommendationType =
	| "COLLABORATIVE"
	| "CONTENT_BASED"
	| "HYBRID"
	| "RULE_BASED";

export interface PerformanceMetrics {
	click_through_rate: number;
	conversion_rate: number;
	revenue_lift: number;
	accuracy: number;
	coverage: number;
}

// ============================================================================
// PRODUCT INVENTORY TYPES
// ============================================================================

export interface ProductInventory {
	product_id: number;
	sku: string;
	qty_available: number;
	qty_reserved: number;
	qty_on_hand: number;
	stock_status: StockStatus;
	is_in_stock: boolean;
	low_stock_threshold?: number;
	backorder_allowed: boolean;
	expected_date?: string;
	warehouse_locations: WarehouseLocation[];
	stock_movements: StockMovement[];
}

export interface WarehouseLocation {
	warehouse_id: number;
	warehouse_name: string;
	qty_available: number;
	qty_reserved: number;
	qty_on_hand: number;
	location_code?: string;
}

export interface StockMovement {
	id: number;
	product_id: number;
	warehouse_id: number;
	movement_type: MovementType;
	quantity: number;
	reference: string;
	date: string;
	notes?: string;
}

export type MovementType = "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT" | "RETURN";

// ============================================================================
// PRODUCT ANALYTICS TYPES
// ============================================================================

export interface ProductAnalytics {
	product_id: number;
	views: number;
	unique_views: number;
	add_to_cart_count: number;
	purchase_count: number;
	conversion_rate: number;
	revenue: Money;
	average_order_value: Money;
	review_count: number;
	average_rating: number;
	return_rate: number;
	time_period: AnalyticsPeriod;
}

export type AnalyticsPeriod = "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";

export interface ProductPerformance {
	product_id: number;
	name: string;
	sku: string;
	metrics: ProductMetrics;
	trends: ProductTrends;
	comparisons: ProductComparisons;
}

export interface ProductMetrics {
	sales_volume: number;
	revenue: Money;
	profit_margin: number;
	inventory_turnover: number;
	customer_satisfaction: number;
	market_share: number;
}

export interface ProductTrends {
	sales_trend: TrendData[];
	price_trend: TrendData[];
	inventory_trend: TrendData[];
	demand_forecast: ForecastData[];
}

export interface TrendData {
	date: string;
	value: number;
	change_percentage?: number;
}

export interface ForecastData {
	date: string;
	predicted_value: number;
	confidence_interval: {
		lower: number;
		upper: number;
	};
}

export interface ProductComparisons {
	category_rank: number;
	competitor_comparison: CompetitorComparison[];
	market_position: MarketPosition;
}

export interface CompetitorComparison {
	competitor_name: string;
	price_difference: Money;
	feature_comparison: FeatureComparison[];
}

export interface FeatureComparison {
	feature: string;
	our_product: boolean;
	competitor_product: boolean;
}

export interface MarketPosition {
	price_position: "PREMIUM" | "COMPETITIVE" | "BUDGET";
	quality_position: "HIGH" | "MEDIUM" | "LOW";
	market_share_percentage: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PageInfo {
	current_page: number;
	page_size: number;
	total_pages: number;
	total_count: number;
	has_next_page: boolean;
	has_previous_page: boolean;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	pagination?: PageInfo;
}

export type ProductApiResponse = ApiResponse<Product>;
export type ProductsApiResponse = ApiResponse<Product[]>;
export type ProductSearchApiResponse = ApiResponse<ProductSearchResult>;
export type CompareListApiResponse = ApiResponse<CompareList>;
export type ProductInventoryApiResponse = ApiResponse<ProductInventory>;
export type ProductAnalyticsApiResponse = ApiResponse<ProductAnalytics>;
