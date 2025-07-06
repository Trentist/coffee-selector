/**
 * Navigation, Button, Action, Status, and Validation Text Constants
 * ثوابت نصوص التنقل والأزرار والإجراءات والحالات والتحقق
 */

// ============================================================================
// NAVIGATION TEXTS - نصوص التنقل
// ============================================================================

export const NAVIGATION_TEXTS = {
	// Main Navigation
	HOME: "navigation.home",
	ABOUT: "navigation.about", 
	SHOP: "navigation.shop",
	CONTACT: "navigation.contact",
	JOBS: "navigation.jobs",
	WHOLESALE: "navigation.wholesale",
	
	// Menu Navigation
	MENU: "navigation.menu",
	CLOSE: "navigation.close",
	OPEN: "navigation.open",
	TOGGLE_SIDEBAR: "navigation.toggle_sidebar",
	
	// User Navigation
	PROFILE: "navigation.profile",
	SETTINGS: "navigation.settings",
	DASHBOARD: "navigation.dashboard",
	ORDERS: "navigation.orders",
	INVOICES: "navigation.invoices",
	
	// Cart & Wishlist
	CART: "navigation.cart",
	WISHLIST: "navigation.wishlist",
	CHECKOUT: "navigation.checkout",
	
	// Authentication
	LOGIN: "navigation.login",
	REGISTER: "navigation.register", 
	LOGOUT: "navigation.logout",
	
	// Search
	SEARCH: "navigation.search",
	SEARCH_PLACEHOLDER: "navigation.search_placeholder",
	
	// Breadcrumbs
	BACK: "navigation.back",
	NEXT: "navigation.next",
	PREVIOUS: "navigation.previous",
	GO_TO: "navigation.go_to",
	BREADCRUMB_SEPARATOR: "navigation.breadcrumb_separator",
} as const;

// ============================================================================
// BUTTON TEXTS - نصوص الأزرار
// ============================================================================

export const BUTTON_TEXTS = {
	// Primary Actions
	SAVE: "buttons.save",
	CANCEL: "buttons.cancel",
	DELETE: "buttons.delete",
	EDIT: "buttons.edit",
	ADD: "buttons.add",
	REMOVE: "buttons.remove",
	UPDATE: "buttons.update",
	SUBMIT: "buttons.submit",
	CONFIRM: "buttons.confirm",
	
	// Navigation Buttons
	BACK: "buttons.back",
	NEXT: "buttons.next",
	PREVIOUS: "buttons.previous",
	CONTINUE: "buttons.continue",
	FINISH: "buttons.finish",
	
	// UI Buttons
	CLOSE: "buttons.close",
	OPEN: "buttons.open",
	VIEW: "buttons.view",
	SHOW: "buttons.show",
	HIDE: "buttons.hide",
	
	// File Actions
	DOWNLOAD: "buttons.download",
	UPLOAD: "buttons.upload",
	EXPORT: "buttons.export",
	IMPORT: "buttons.import",
	PRINT: "buttons.print",
	
	// Data Actions
	SEARCH: "buttons.search",
	FILTER: "buttons.filter",
	SORT: "buttons.sort",
	REFRESH: "buttons.refresh",
	RELOAD: "buttons.reload",
	
	// Status Buttons
	LOADING: "buttons.loading",
	PROCESSING: "buttons.processing",
	RETRY: "buttons.retry",
	
	// Selection Actions
	SELECT: "buttons.select",
	DESELECT: "buttons.deselect",
	SELECT_ALL: "buttons.select_all",
	CLEAR: "buttons.clear",
	RESET: "buttons.reset",
	
	// Approval Actions
	APPROVE: "buttons.approve",
	REJECT: "buttons.reject",
	ACTIVATE: "buttons.activate",
	DEACTIVATE: "buttons.deactivate",
	ENABLE: "buttons.enable",
	DISABLE: "buttons.disable",
	
	// Management Actions
	LOCK: "buttons.lock",
	UNLOCK: "buttons.unlock",
	ARCHIVE: "buttons.archive",
	RESTORE: "buttons.restore",
	DUPLICATE: "buttons.duplicate",
	CLONE: "buttons.clone",
	MERGE: "buttons.merge",
	SPLIT: "buttons.split",
	MOVE: "buttons.move",
	RENAME: "buttons.rename",
	
	// Data Management
	GROUP: "buttons.group",
	UNGROUP: "buttons.ungroup",
	EXPAND: "buttons.expand",
	COLLAPSE: "buttons.collapse",
	
	// Sharing
	SHARE: "buttons.share",
	COPY: "buttons.copy",
	PASTE: "buttons.paste",
	CUT: "buttons.cut",
} as const;

// ============================================================================
// ACTION TEXTS - نصوص الإجراءات
// ============================================================================

export const ACTION_TEXTS = {
	// User Actions
	LOGIN: "actions.login",
	LOGOUT: "actions.logout",
	REGISTER: "actions.register",
	VERIFY_EMAIL: "actions.verify_email",
	RESET_PASSWORD: "actions.reset_password",
	CHANGE_PASSWORD: "actions.change_password",
	UPDATE_PROFILE: "actions.update_profile",
	
	// Cart Actions
	ADD_TO_CART: "actions.add_to_cart",
	REMOVE_FROM_CART: "actions.remove_from_cart",
	UPDATE_CART: "actions.update_cart",
	CLEAR_CART: "actions.clear_cart",
	PROCEED_TO_CHECKOUT: "actions.proceed_to_checkout",
	
	// Wishlist Actions
	ADD_TO_WISHLIST: "actions.add_to_wishlist",
	REMOVE_FROM_WISHLIST: "actions.remove_from_wishlist",
	MOVE_TO_CART: "actions.move_to_cart",
	
	// Order Actions
	PLACE_ORDER: "actions.place_order",
	CANCEL_ORDER: "actions.cancel_order",
	TRACK_ORDER: "actions.track_order",
	REORDER: "actions.reorder",
	
	// Payment Actions
	PROCESS_PAYMENT: "actions.process_payment",
	REFUND_PAYMENT: "actions.refund_payment",
	SAVE_PAYMENT_METHOD: "actions.save_payment_method",
	
	// Product Actions
	VIEW_PRODUCT: "actions.view_product",
	ADD_REVIEW: "actions.add_review",
	SHARE_PRODUCT: "actions.share_product",
	COMPARE_PRODUCT: "actions.compare_product",
	
	// Search Actions
	SEARCH_PRODUCTS: "actions.search_products",
	APPLY_FILTERS: "actions.apply_filters",
	CLEAR_FILTERS: "actions.clear_filters",
	SORT_RESULTS: "actions.sort_results",
	
	// Notification Actions
	SUBSCRIBE: "actions.subscribe",
	UNSUBSCRIBE: "actions.unsubscribe",
	MARK_AS_READ: "actions.mark_as_read",
	
	// Social Actions
	FOLLOW: "actions.follow",
	UNFOLLOW: "actions.unfollow",
	LIKE: "actions.like",
	UNLIKE: "actions.unlike",
	SHARE: "actions.share",
} as const;

// ============================================================================
// STATUS TEXTS - نصوص الحالة
// ============================================================================

export const STATUS_TEXTS = {
	// General Status
	LOADING: "status.loading",
	SUCCESS: "status.success",
	ERROR: "status.error",
	WARNING: "status.warning",
	INFO: "status.info",
	COMPLETED: "status.completed",
	PENDING: "status.pending",
	FAILED: "status.failed",
	CANCELLED: "status.cancelled",
	
	// User Status
	ACTIVE: "status.active",
	INACTIVE: "status.inactive",
	ONLINE: "status.online",
	OFFLINE: "status.offline",
	BUSY: "status.busy",
	AWAY: "status.away",
	
	// Order Status
	ORDER_PENDING: "status.order_pending",
	ORDER_CONFIRMED: "status.order_confirmed",
	ORDER_PROCESSING: "status.order_processing",
	ORDER_SHIPPED: "status.order_shipped",
	ORDER_DELIVERED: "status.order_delivered",
	ORDER_CANCELLED: "status.order_cancelled",
	ORDER_RETURNED: "status.order_returned",
	
	// Payment Status
	PAYMENT_PENDING: "status.payment_pending",
	PAYMENT_PAID: "status.payment_paid",
	PAYMENT_FAILED: "status.payment_failed",
	PAYMENT_REFUNDED: "status.payment_refunded",
	
	// Shipping Status
	SHIPPING_PENDING: "status.shipping_pending",
	SHIPPING_IN_TRANSIT: "status.shipping_in_transit",
	SHIPPING_DELIVERED: "status.shipping_delivered",
	SHIPPING_FAILED: "status.shipping_failed",
	
	// Product Status
	IN_STOCK: "status.in_stock",
	OUT_OF_STOCK: "status.out_of_stock",
	LOW_STOCK: "status.low_stock",
	BACKORDER: "status.backorder",
	
	// Account Status
	ACCOUNT_ACTIVE: "status.account_active",
	ACCOUNT_SUSPENDED: "status.account_suspended",
	ACCOUNT_VERIFIED: "status.account_verified",
	ACCOUNT_UNVERIFIED: "status.account_unverified",
	
	// System Status
	SYSTEM_ONLINE: "status.system_online",
	SYSTEM_OFFLINE: "status.system_offline",
	SYSTEM_MAINTENANCE: "status.system_maintenance",
} as const;

// ============================================================================
// VALIDATION TEXTS - نصوص التحقق
// ============================================================================

export const VALIDATION_TEXTS = {
	// Required Fields
	REQUIRED: "validation.required",
	FIELD_REQUIRED: "validation.field_required",
	ALL_FIELDS_REQUIRED: "validation.all_fields_required",
	
	// Email Validation
	EMAIL_REQUIRED: "validation.email_required",
	EMAIL_INVALID: "validation.email_invalid",
	EMAIL_ALREADY_EXISTS: "validation.email_already_exists",
	EMAIL_NOT_FOUND: "validation.email_not_found",
	
	// Password Validation
	PASSWORD_REQUIRED: "validation.password_required",
	PASSWORD_TOO_SHORT: "validation.password_too_short",
	PASSWORD_TOO_WEAK: "validation.password_too_weak",
	PASSWORD_MISMATCH: "validation.password_mismatch",
	PASSWORD_INCORRECT: "validation.password_incorrect",
	
	// Phone Validation
	PHONE_REQUIRED: "validation.phone_required",
	PHONE_INVALID: "validation.phone_invalid",
	PHONE_ALREADY_EXISTS: "validation.phone_already_exists",
	
	// Name Validation
	NAME_REQUIRED: "validation.name_required",
	FIRST_NAME_REQUIRED: "validation.first_name_required",
	LAST_NAME_REQUIRED: "validation.last_name_required",
	
	// Address Validation
	ADDRESS_REQUIRED: "validation.address_required",
	CITY_REQUIRED: "validation.city_required",
	COUNTRY_REQUIRED: "validation.country_required",
	POSTAL_CODE_REQUIRED: "validation.postal_code_required",
	POSTAL_CODE_INVALID: "validation.postal_code_invalid",
	
	// Number Validation
	QUANTITY_REQUIRED: "validation.quantity_required",
	QUANTITY_MIN: "validation.quantity_min",
	QUANTITY_MAX: "validation.quantity_max",
	PRICE_REQUIRED: "validation.price_required",
	PRICE_INVALID: "validation.price_invalid",
	
	// File Validation
	FILE_REQUIRED: "validation.file_required",
	FILE_TOO_LARGE: "validation.file_too_large",
	FILE_TYPE_INVALID: "validation.file_type_invalid",
	FILE_UPLOAD_FAILED: "validation.file_upload_failed",
	
	// Date Validation
	DATE_REQUIRED: "validation.date_required",
	DATE_INVALID: "validation.date_invalid",
	DATE_PAST: "validation.date_past",
	DATE_FUTURE: "validation.date_future",
	
	// Length Validation
	MIN_LENGTH: "validation.min_length",
	MAX_LENGTH: "validation.max_length",
	EXACT_LENGTH: "validation.exact_length",
	
	// Format Validation
	INVALID_FORMAT: "validation.invalid_format",
	ALPHANUMERIC_ONLY: "validation.alphanumeric_only",
	NUMBERS_ONLY: "validation.numbers_only",
	LETTERS_ONLY: "validation.letters_only",
	
	// Business Logic Validation
	INSUFFICIENT_STOCK: "validation.insufficient_stock",
	ORDER_LIMIT_EXCEEDED: "validation.order_limit_exceeded",
	COUPON_INVALID: "validation.coupon_invalid",
	COUPON_EXPIRED: "validation.coupon_expired",
	COUPON_ALREADY_USED: "validation.coupon_already_used",
	
	// Authentication Validation
	LOGIN_REQUIRED: "validation.login_required",
	PERMISSION_DENIED: "validation.permission_denied",
	SESSION_EXPIRED: "validation.session_expired",
	ACCOUNT_LOCKED: "validation.account_locked",
	
	// Network Validation
	NETWORK_ERROR: "validation.network_error",
	CONNECTION_TIMEOUT: "validation.connection_timeout",
	SERVER_ERROR: "validation.server_error",
	MAINTENANCE_MODE: "validation.maintenance_mode",
} as const;

// ============================================================================
// MESSAGE TEXTS - نصوص الرسائل
// ============================================================================

export const MESSAGE_TEXTS = {
	// Success Messages
	OPERATION_SUCCESSFUL: "messages.operation_successful",
	SAVED_SUCCESSFULLY: "messages.saved_successfully",
	DELETED_SUCCESSFULLY: "messages.deleted_successfully",
	UPDATED_SUCCESSFULLY: "messages.updated_successfully",
	ADDED_SUCCESSFULLY: "messages.added_successfully",
	REMOVED_SUCCESSFULLY: "messages.removed_successfully",
	
	// Error Messages
	SOMETHING_WENT_WRONG: "messages.something_went_wrong",
	OPERATION_FAILED: "messages.operation_failed",
	SAVE_FAILED: "messages.save_failed",
	DELETE_FAILED: "messages.delete_failed",
	UPDATE_FAILED: "messages.update_failed",
	ADD_FAILED: "messages.add_failed",
	
	// Warning Messages
	ARE_YOU_SURE: "messages.are_you_sure",
	CONFIRM_DELETE: "messages.confirm_delete",
	UNSAVED_CHANGES: "messages.unsaved_changes",
	DATA_WILL_BE_LOST: "messages.data_will_be_lost",
	
	// Info Messages
	NO_DATA_FOUND: "messages.no_data_found",
	NO_RESULTS_FOUND: "messages.no_results_found",
	LOADING_DATA: "messages.loading_data",
	PROCESSING_REQUEST: "messages.processing_request",
	
	// Confirmation Messages
	CONFIRM_ACTION: "messages.confirm_action",
	CONFIRM_OPERATION: "messages.confirm_operation",
	PROCEED_WITH_ACTION: "messages.proceed_with_action",
	
	// Notification Messages
	NOTIFICATION_SENT: "messages.notification_sent",
	EMAIL_SENT: "messages.email_sent",
	SMS_SENT: "messages.sms_sent",
	
	// System Messages
	SYSTEM_MAINTENANCE: "messages.system_maintenance",
	SYSTEM_UNAVAILABLE: "messages.system_unavailable",
	PLEASE_TRY_AGAIN: "messages.please_try_again",
	CONTACT_SUPPORT: "messages.contact_support",
} as const;

// ============================================================================
// ARIA LABELS - تسميات إمكانية الوصول
// ============================================================================

export const ARIA_LABELS = {
	// Navigation
	MENU: "aria_labels.menu",
	CLOSE: "aria_labels.close",
	OPEN: "aria_labels.open",
	NAVIGATION: "aria_labels.navigation",
	BREADCRUMB: "aria_labels.breadcrumb",
	
	// Shopping
	SHOPPING_CART: "aria_labels.shopping_cart",
	WISHLIST: "aria_labels.wishlist",
	SEARCH: "aria_labels.search",
	PRODUCT_IMAGE: "aria_labels.product_image",
	
	// User
	USER_ACCOUNT: "aria_labels.user_account",
	PROFILE: "aria_labels.profile",
	SETTINGS: "aria_labels.settings",
	
	// Actions
	ADD_TO_CART: "aria_labels.add_to_cart",
	REMOVE_FROM_CART: "aria_labels.remove_from_cart",
	ADD_TO_WISHLIST: "aria_labels.add_to_wishlist",
	REMOVE_FROM_WISHLIST: "aria_labels.remove_from_wishlist",
	
	// Forms
	FORM_SUBMIT: "aria_labels.form_submit",
	FORM_RESET: "aria_labels.form_reset",
	FORM_CLOSE: "aria_labels.form_close",
	
	// Media
	PLAY_VIDEO: "aria_labels.play_video",
	PAUSE_VIDEO: "aria_labels.pause_video",
	MUTE_AUDIO: "aria_labels.mute_audio",
	UNMUTE_AUDIO: "aria_labels.unmute_audio",
	
	// Social
	SHARE_ON_FACEBOOK: "aria_labels.share_on_facebook",
	SHARE_ON_TWITTER: "aria_labels.share_on_twitter",
	SHARE_ON_LINKEDIN: "aria_labels.share_on_linkedin",
	
	// Communication
	PHONE_CALL: "aria_labels.phone_call",
	EMAIL: "aria_labels.email",
	WHATSAPP: "aria_labels.whatsapp",
	
	// Settings
	CHANGE_LANGUAGE: "aria_labels.change_language",
	CHANGE_THEME: "aria_labels.change_theme",
	CHANGE_CURRENCY: "aria_labels.change_currency",
} as const;

// ============================================================================
// EXPORT ALL CONSTANTS - تصدير جميع الثوابت
// ============================================================================

export const ALL_NAVIGATION_TEXTS = {
	NAVIGATION: NAVIGATION_TEXTS,
	BUTTONS: BUTTON_TEXTS,
	ACTIONS: ACTION_TEXTS,
	STATUS: STATUS_TEXTS,
	VALIDATION: VALIDATION_TEXTS,
	MESSAGES: MESSAGE_TEXTS,
	ARIA_LABELS: ARIA_LABELS,
} as const;

export default ALL_NAVIGATION_TEXTS;
