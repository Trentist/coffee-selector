/**
 * Filter System Constants
 * Constants related to filtering, sorting, and product management
 */

export type SortFilterItem = {
	name: string;
	slug: string | null;
	sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE" | "name";
	reverse: boolean;
};

export const defaultSort: SortFilterItem = {
	name: "filter.a_to_z",
	slug: null,
	sortKey: "name",
	reverse: false,
};

export const sorting: SortFilterItem[] = [
	defaultSort,
	{
		name: "filter.z_to_a",
		slug: "product-desc",
		sortKey: "name",
		reverse: true,
	},
	{
		name: "filter.price_low_to_high",
		slug: "price-asc",
		sortKey: "PRICE",
		reverse: false,
	},
	{
		name: "filter.price_high_to_low",
		slug: "price-desc",
		sortKey: "PRICE",
		reverse: true,
	},
];

// Additional sort options for enhanced filtering
export const EXTENDED_SORTING: SortFilterItem[] = [
	...sorting,
	{
		name: "filter.popularity",
		slug: "popularity-desc",
		sortKey: "BEST_SELLING",
		reverse: true,
	},
	{
		name: "filter.newest_first",
		slug: "newest-first",
		sortKey: "CREATED_AT",
		reverse: true,
	},
	{
		name: "filter.oldest_first",
		slug: "oldest-first",
		sortKey: "CREATED_AT",
		reverse: false,
	},
	{
		name: "filter.relevance",
		slug: "relevance",
		sortKey: "RELEVANCE",
		reverse: false,
	},
];

// Cache and API tags
export const TAGS = {
	collections: "collections",
	products: "products",
	cart: "cart",
	categories: "categories",
	filters: "filters",
	search: "search",
};

// Product visibility
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";

// API configuration
export const SHOPIFY_GRAPHQL_API_ENDPOINT = `/api/${process.env.ODOO_API_VERSION}`;

// Pagination
export const LIMIT = 12;
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// Local storage keys
export const TOKEN = "token";
export const SAVED_LOCAL_STORAGE = "shipping_address";
export const FILTER_STORAGE_KEY = "applied_filters";
export const SORT_STORAGE_KEY = "selected_sort";
export const VIEW_MODE_STORAGE_KEY = "view_mode";

// Filter types
export const FILTER_TYPES = {
	PRICE: "price",
	BRAND: "brand",
	CATEGORY: "category",
	RATING: "rating",
	AVAILABILITY: "availability",
	COLOR: "color",
	SIZE: "size",
	WEIGHT: "weight",
	MATERIAL: "material",
	LOCATION: "location",
	TAGS: "tags",
	DISCOUNT: "discount",
	NEW_ARRIVALS: "new_arrivals",
	BEST_SELLERS: "best_sellers",
	ON_SALE: "on_sale",
} as const;

// Filter presets
export const FILTER_PRESETS = {
	BEST_SELLERS: {
		name: "filter.best_sellers",
		filters: {
			sortKey: "BEST_SELLING",
			reverse: true,
		},
	},
	NEW_ARRIVALS: {
		name: "filter.new_arrivals",
		filters: {
			sortKey: "CREATED_AT",
			reverse: true,
		},
	},
	ON_SALE: {
		name: "filter.on_sale",
		filters: {
			discount: { min: 1, max: 100 },
		},
	},
	UNDER_50: {
		name: "filter.under_50",
		filters: {
			price: { min: 0, max: 50 },
		},
	},
	PREMIUM: {
		name: "filter.premium",
		filters: {
			price: { min: 100, max: 1000 },
		},
	},
} as const;

// Default filter values
export const DEFAULT_FILTER_VALUES = {
	price: { min: 0, max: 1000 },
	rating: { min: 0, max: 5 },
	discount: { min: 0, max: 100 },
	categories: [],
	brands: [],
	colors: [],
	sizes: [],
	availability: "all", // "all", "in_stock", "out_of_stock"
	sortBy: defaultSort,
	searchQuery: "",
	tags: [],
} as const;

// View modes
export const VIEW_MODES = {
	GRID: "grid",
	LIST: "list",
	CARD: "card",
} as const;

// Price ranges for quick filters
export const PRICE_RANGES = [
	{ label: "filter.under_25", min: 0, max: 25 },
	{ label: "filter.25_to_50", min: 25, max: 50 },
	{ label: "filter.50_to_100", min: 50, max: 100 },
	{ label: "filter.100_to_200", min: 100, max: 200 },
	{ label: "filter.over_200", min: 200, max: 9999 },
] as const;

// Rating options
export const RATING_OPTIONS = [
	{ label: "filter.5_stars", value: 5 },
	{ label: "filter.4_stars_up", value: 4 },
	{ label: "filter.3_stars_up", value: 3 },
	{ label: "filter.2_stars_up", value: 2 },
	{ label: "filter.1_star_up", value: 1 },
] as const;

// Filter animation durations
export const FILTER_ANIMATIONS = {
	FILTER_TOGGLE: 300,
	RESULTS_UPDATE: 500,
	SIDEBAR_TOGGLE: 250,
	DRAWER_SLIDE: 350,
} as const;

// Debounce delays
export const DEBOUNCE_DELAYS = {
	SEARCH: 300,
	PRICE_SLIDER: 500,
	FILTER_CHANGE: 200,
} as const;
