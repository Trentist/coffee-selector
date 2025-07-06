/**
 * Translation Keys Constants
 * ثوابت مفاتيح الترجمة
 */

// Common translation keys
export const COMMON_KEYS = {
	// Navigation
	HOME: "common.home",
	SHOP: "common.shop",
	ABOUT: "common.about",
	CONTACT: "common.contact",
	LOGIN: "common.login",
	REGISTER: "common.register",
	LOGOUT: "common.logout",
	PROFILE: "common.profile",
	SETTINGS: "common.settings",
	SEARCH: "common.search",
	CART: "common.cart",
	WISHLIST: "common.wishlist",
	CHECKOUT: "common.checkout",
	ORDERS: "common.orders",
	INVOICES: "common.invoices",
	DASHBOARD: "common.dashboard",

	// Actions
	ADD: "common.add",
	EDIT: "common.edit",
	DELETE: "common.delete",
	SAVE: "common.save",
	CANCEL: "common.cancel",
	CONFIRM: "common.confirm",
	SUBMIT: "common.submit",
	CLOSE: "common.close",
	BACK: "common.back",
	NEXT: "common.next",
	PREVIOUS: "common.previous",
	CONTINUE: "common.continue",
	FINISH: "common.finish",
	LOADING: "common.loading",

	// Status
	ACTIVE: "common.active",
	INACTIVE: "common.inactive",
	PENDING: "common.pending",
	COMPLETED: "common.completed",
	CANCELLED: "common.cancelled",
	PROCESSING: "common.processing",
	SHIPPED: "common.shipped",
	DELIVERED: "common.delivered",

	// Messages
	OPERATION_COMPLETED: "common.operation_completed_successfully",
	SOMETHING_WENT_WRONG: "common.something_went_wrong",
	PLEASE_CHECK_INPUT: "common.please_check_your_input",
	PLEASE_NOTE: "common.please_note",
	NO_DATA_FOUND: "common.no_data_found",
	NO_RESULTS_FOUND: "common.no_results_found",

	// Form
	EMAIL: "common.email",
	PASSWORD: "common.password",
	CONFIRM_PASSWORD: "common.confirm_password",
	FIRST_NAME: "common.first_name",
	LAST_NAME: "common.last_name",
	PHONE: "common.phone",
	ADDRESS: "common.address",
	CITY: "common.city",
	COUNTRY: "common.country",
	POSTAL_CODE: "common.postal_code",
	REQUIRED_FIELD: "common.required_field",
	INVALID_EMAIL: "common.invalid_email",
	PASSWORD_MISMATCH: "common.password_mismatch",

	// Currency
	CURRENCY: "common.currency",
	PRICE: "common.price",
	TOTAL: "common.total",
	SUBTOTAL: "common.subtotal",
	TAX: "common.tax",
	SHIPPING: "common.shipping",
	DISCOUNT: "common.discount",
	FREE: "common.free",

	// Language & Theme
	LANGUAGE: "common.language",
	ARABIC: "common.arabic",
	ENGLISH: "common.english",
	THEME: "common.theme",
	LIGHT: "common.light",
	DARK: "common.dark",
	AUTO: "common.auto",
} as const;

// Auth translation keys
export const AUTH_KEYS = {
	LOGIN_TITLE: "auth.login_title",
	REGISTER_TITLE: "auth.register_title",
	FORGOT_PASSWORD: "auth.forgot_password",
	RESET_PASSWORD: "auth.reset_password",
	EMAIL_PLACEHOLDER: "auth.email_placeholder",
	PASSWORD_PLACEHOLDER: "auth.password_placeholder",
	CONFIRM_PASSWORD_PLACEHOLDER: "auth.confirm_password_placeholder",
	LOGIN_BUTTON: "auth.login_button",
	REGISTER_BUTTON: "auth.register_button",
	FORGOT_PASSWORD_BUTTON: "auth.forgot_password_button",
	RESET_PASSWORD_BUTTON: "auth.reset_password_button",
	LOGIN_SUCCESS: "auth.login_success",
	REGISTER_SUCCESS: "auth.register_success",
	LOGOUT_SUCCESS: "auth.logout_success",
	LOGIN_ERROR: "auth.login_error",
	REGISTER_ERROR: "auth.register_error",
	INVALID_CREDENTIALS: "auth.invalid_credentials",
	EMAIL_REQUIRED: "auth.email_required",
	PASSWORD_REQUIRED: "auth.password_required",
	PASSWORD_MIN_LENGTH: "auth.password_min_length",
	PASSWORDS_NOT_MATCH: "auth.passwords_not_match",
} as const;

// Shop translation keys
export const SHOP_KEYS = {
	// Cart
	CART_TITLE: "shop.cart.title",
	CART_EMPTY: "shop.cart.empty",
	CART_SUBTOTAL: "shop.cart.subtotal",
	CART_TOTAL: "shop.cart.total",
	CART_TAX: "shop.cart.tax",
	CART_SHIPPING: "shop.cart.shipping",
	CART_DISCOUNT: "shop.cart.discount",
	CART_CHECKOUT: "shop.cart.checkout",
	CART_CONTINUE_SHOPPING: "shop.cart.continue_shopping",
	CART_REMOVE_ITEM: "shop.cart.remove_item",
	CART_UPDATE_QUANTITY: "shop.cart.update_quantity",
	CART_SAVE_FOR_LATER: "shop.cart.save_for_later",
	CART_APPLY_COUPON: "shop.cart.apply_coupon",
	CART_COUPON_CODE: "shop.cart.coupon_code",

	// Categories
	CATEGORIES_TITLE: "shop.categories.title",
	CATEGORIES_ALL: "shop.categories.all_categories",
	CATEGORIES_ARABIC_COFFEE: "shop.categories.arabic_coffee",
	CATEGORIES_COFFEE_BEANS: "shop.categories.coffee_beans",
	CATEGORIES_COFFEE_MACHINES: "shop.categories.coffee_machines",
	CATEGORIES_ESPRESSO: "shop.categories.espresso",
	CATEGORIES_FILTER_COFFEE: "shop.categories.filter_coffee",
	CATEGORIES_GROUND_COFFEE: "shop.categories.ground_coffee",
	CATEGORIES_INSTANT_COFFEE: "shop.categories.instant_coffee",
	CATEGORIES_COFFEE_ACCESSORIES: "shop.categories.coffee_accessories",

	// Product Card
	PRODUCT_CARD_ADD_TO_CART: "shop.product_card.add_to_cart",
	PRODUCT_CARD_ADD_TO_WISHLIST: "shop.product_card.add_to_wishlist",
	PRODUCT_CARD_REMOVE_FROM_WISHLIST: "shop.product_card.remove_from_wishlist",
	PRODUCT_CARD_QUICK_VIEW: "shop.product_card.quick_view",
	PRODUCT_CARD_IN_STOCK: "shop.product_card.in_stock",
	PRODUCT_CARD_OUT_OF_STOCK: "shop.product_card.out_of_stock",
	PRODUCT_CARD_LOW_STOCK: "shop.product_card.low_stock",
	PRODUCT_CARD_NEW: "shop.product_card.new",
	PRODUCT_CARD_HOT: "shop.product_card.hot",
	PRODUCT_CARD_SALE: "shop.product_card.sale",
	PRODUCT_CARD_DISCOUNT: "shop.product_card.discount",
	PRODUCT_CARD_PRICE_FROM: "shop.product_card.price_from",
	PRODUCT_CARD_PRICE_TO: "shop.product_card.price_to",
	PRODUCT_CARD_WEIGHT: "shop.product_card.weight",

	// Filters
	FILTERS_TITLE: "shop.filters.title",
	FILTERS_APPLY: "shop.filters.apply_filters",
	FILTERS_CLEAR_ALL: "shop.filters.clear_all",
	FILTERS_CATEGORIES: "shop.filters.categories",
	FILTERS_BRANDS: "shop.filters.brands",
	FILTERS_PRICE_RANGE: "shop.filters.price_range",
	FILTERS_SORT_BY: "shop.filters.sort_by",
	FILTERS_SORT_OPTIONS: "shop.filters.sort_options",
	FILTERS_SORT_NAME_A_Z: "shop.filters.sort_options.name_a_z",
	FILTERS_SORT_NAME_Z_A: "shop.filters.sort_options.name_z_a",
	FILTERS_SORT_NEWEST: "shop.filters.sort_options.newest",
	FILTERS_SORT_POPULARITY: "shop.filters.sort_options.popularity",
	FILTERS_SORT_PRICE_LOW_HIGH: "shop.filters.sort_options.price_low_high",
	FILTERS_SORT_PRICE_HIGH_LOW: "shop.filters.sort_options.price_high_low",
	FILTERS_SORT_RATING: "shop.filters.sort_options.rating",

	// Search
	SEARCH_PLACEHOLDER: "shop.search.placeholder",
	SEARCH_NO_RESULTS: "shop.search.no_results",
	SEARCH_CLEAR_HISTORY: "shop.search.clear_history",
	SEARCH_RECENT_SEARCHES: "shop.search.recent_searches",
	SEARCH_SUGGESTIONS: "shop.search.search_suggestions",

	// Wishlist
	WISHLIST_TITLE: "shop.wishlist.title",
	WISHLIST_EMPTY: "shop.wishlist.empty",
	WISHLIST_ADD_ITEMS: "shop.wishlist.add_items",
	WISHLIST_MOVE_TO_CART: "shop.wishlist.move_to_cart",
	WISHLIST_REMOVE_ALL: "shop.wishlist.remove_all",
} as const;

// Dashboard translation keys
export const DASHBOARD_KEYS = {
	OVERVIEW: "dashboard.overview",
	PROFILE: "dashboard.profile",
	ORDERS: "dashboard.orders",
	INVOICES: "dashboard.invoices",
	ORDER_TRACKING: "dashboard.order_tracking",
	WISHLIST: "dashboard.wishlist",
	ADDRESSES: "dashboard.addresses",
	SETTINGS: "dashboard.settings",
	LOADING_INVOICES: "dashboard.loading_invoices",
	LOADING_ORDERS: "dashboard.loading_orders",
	INVOICES_DESCRIPTION: "dashboard.invoices_description",
	ORDER_TRACKING_DESCRIPTION: "dashboard.order_tracking_description",
	INVOICES_LIST: "dashboard.invoices_list",
	ORDERS_LIST: "dashboard.orders_list",
	NO_INVOICES: "dashboard.no_invoices",
	NO_ORDERS: "dashboard.no_orders",
} as const;

// Alerts translation keys
export const ALERTS_KEYS = {
	// Success
	SUCCESS_TITLE: "alerts.success.title",
	SUCCESS_DEFAULT: "alerts.success.default",
	SUCCESS_OPERATION_COMPLETED: "alerts.success.operation_completed",
	SUCCESS_DATA_SAVED: "alerts.success.data_saved",
	SUCCESS_ORDER_PLACED: "alerts.success.order_placed",
	SUCCESS_PAYMENT_SUCCESSFUL: "alerts.success.payment_successful",

	// Error
	ERROR_TITLE: "alerts.error.title",
	ERROR_DEFAULT: "alerts.error.default",
	ERROR_SERVER_ERROR: "alerts.error.server_error",
	ERROR_VALIDATION_ERROR: "alerts.error.validation_error",
	ERROR_PERMISSION_ERROR: "alerts.error.permission_error",
	ERROR_FILE_TOO_LARGE: "alerts.error.file_too_large",
	ERROR_INVALID_FILE_TYPE: "alerts.error.invalid_file_type",

	// Warning
	WARNING_TITLE: "alerts.warning.title",
	WARNING_DEFAULT: "alerts.warning.default",
	WARNING_SESSION_EXPIRING: "alerts.warning.session_expiring",
	WARNING_CART_EXPIRING: "alerts.warning.cart_expiring",
	WARNING_PAYMENT_REQUIRED: "alerts.warning.payment_required",
	WARNING_ADDRESS_REQUIRED: "alerts.warning.address_required",

	// Info
	INFO_TITLE: "alerts.info.title",
	INFO_DEFAULT: "alerts.info.default",
	INFO_MAINTENANCE: "alerts.info.maintenance",
	INFO_UPDATE_AVAILABLE: "alerts.info.update_available",
	INFO_NEW_FEATURES: "alerts.info.new_features",
	INFO_ORDER_STATUS: "alerts.info.order_status",

	// Confirmations
	CONFIRM_DELETE_ITEM: "alerts.confirmations.delete_item",
	CONFIRM_DELETE_ADDRESS: "alerts.confirmations.delete_address",
	CONFIRM_CLEAR_CART: "alerts.confirmations.clear_cart",
	CONFIRM_CLEAR_WISHLIST: "alerts.confirmations.clear_wishlist",
	CONFIRM_CANCEL_ORDER: "alerts.confirmations.cancel_order",
	CONFIRM_LOGOUT: "alerts.confirmations.logout",
	CONFIRM_UNSAVED_CHANGES: "alerts.confirmations.unsaved_changes",

	// Actions
	ACTIONS_CONFIRM: "alerts.actions.confirm",
	ACTIONS_CANCEL: "alerts.actions.cancel",
	ACTIONS_RETRY: "alerts.actions.retry",
	ACTIONS_DISMISS: "alerts.actions.dismiss",
	ACTIONS_VIEW_DETAILS: "alerts.actions.view_details",
	ACTIONS_CONTINUE: "alerts.actions.continue",
	ACTIONS_SAVE: "alerts.actions.save",
	ACTIONS_DELETE: "alerts.actions.delete",
	ACTIONS_UPDATE: "alerts.actions.update",
	ACTIONS_REFRESH: "alerts.actions.refresh",
} as const;

// Checkout translation keys
export const CHECKOUT_KEYS = {
	TITLE: "checkout.title",
	BILLING_ADDRESS: "checkout.billing_address",
	SHIPPING_ADDRESS: "checkout.shipping_address",
	PAYMENT_METHOD: "checkout.payment_method",
	ORDER_SUMMARY: "checkout.order_summary",
	ORDER_CONFIRMATION: "checkout.order_confirmation",
	PLACE_ORDER: "checkout.place_order",
	TRACK_ORDER: "checkout.track_order",
	ESTIMATED_DELIVERY: "checkout.estimated_delivery",
	VALIDATION_CARD_EXPIRES_SOON: "checkout.validation.card_expires_soon",
	VALIDATION_CARD_VALID: "checkout.validation.card_valid",
	VALIDATION_CVC_VALID: "checkout.validation.cvc_valid",
	VALIDATION_EXPIRY_DATE_VALID: "checkout.validation.expiry_date_valid",
} as const;

// Export all keys
export const TRANSLATION_KEYS = {
	COMMON: COMMON_KEYS,
	AUTH: AUTH_KEYS,
	SHOP: SHOP_KEYS,
	DASHBOARD: DASHBOARD_KEYS,
	ALERTS: ALERTS_KEYS,
	CHECKOUT: CHECKOUT_KEYS,
} as const;
