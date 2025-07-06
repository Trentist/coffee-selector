/**
 * Dashboard Constants
 * ثوابت لوحة التحكم
 */

import { DASHBOARD_KEYS } from "./translation-keys";

// Dashboard sections
export const DASHBOARD_SECTIONS = {
	OVERVIEW: {
		key: "overview",
		label: DASHBOARD_KEYS.OVERVIEW,
		icon: "home",
		path: "/dashboard",
	},
	PROFILE: {
		key: "profile",
		label: DASHBOARD_KEYS.PROFILE,
		icon: "user",
		path: "/dashboard/profile",
	},
	ORDERS: {
		key: "orders",
		label: DASHBOARD_KEYS.ORDERS,
		icon: "package",
		path: "/dashboard/orders",
	},
	INVOICES: {
		key: "invoices",
		label: DASHBOARD_KEYS.INVOICES,
		icon: "file-text",
		path: "/dashboard/invoices",
	},
	ORDER_TRACKING: {
		key: "order-tracking",
		label: DASHBOARD_KEYS.ORDER_TRACKING,
		icon: "truck",
		path: "/dashboard/order-tracking",
	},
	WISHLIST: {
		key: "wishlist",
		label: DASHBOARD_KEYS.WISHLIST,
		icon: "heart",
		path: "/dashboard/wishlist",
	},
	ADDRESSES: {
		key: "addresses",
		label: DASHBOARD_KEYS.ADDRESSES,
		icon: "map-pin",
		path: "/dashboard/addresses",
	},
	SETTINGS: {
		key: "settings",
		label: DASHBOARD_KEYS.SETTINGS,
		icon: "settings",
		path: "/dashboard/settings",
	},
} as const;

// Order status
export const ORDER_STATUS = {
	DRAFT: {
		key: "draft",
		label: "Draft",
		color: "gray",
		icon: "file",
	},
	CONFIRMED: {
		key: "confirmed",
		label: "Confirmed",
		color: "blue",
		icon: "check-circle",
	},
	SALE: {
		key: "sale",
		label: "Sale",
		color: "green",
		icon: "shopping-bag",
	},
	CANCELLED: {
		key: "cancelled",
		label: "Cancelled",
		color: "red",
		icon: "x-circle",
	},
} as const;

// Delivery status
export const DELIVERY_STATUS = {
	PENDING: {
		key: "pending",
		label: "Pending",
		color: "yellow",
		icon: "clock",
	},
	IN_TRANSIT: {
		key: "in_transit",
		label: "In Transit",
		color: "blue",
		icon: "truck",
	},
	OUT_FOR_DELIVERY: {
		key: "out_for_delivery",
		label: "Out for Delivery",
		color: "purple",
		icon: "package",
	},
	DELIVERED: {
		key: "delivered",
		label: "Delivered",
		color: "green",
		icon: "check-circle",
	},
	FAILED: {
		key: "failed",
		label: "Failed",
		color: "red",
		icon: "x-circle",
	},
} as const;

// Invoice status
export const INVOICE_STATUS = {
	DRAFT: {
		key: "draft",
		label: "Draft",
		color: "gray",
		icon: "file",
	},
	POSTED: {
		key: "posted",
		label: "Posted",
		color: "blue",
		icon: "check-circle",
	},
	PAID: {
		key: "paid",
		label: "Paid",
		color: "green",
		icon: "credit-card",
	},
	CANCELLED: {
		key: "cancelled",
		label: "Cancelled",
		color: "red",
		icon: "x-circle",
	},
} as const;

// Dashboard stats
export const DASHBOARD_STATS = {
	TOTAL_ORDERS: {
		key: "total_orders",
		label: "Total Orders",
		icon: "package",
		color: "blue",
	},
	PENDING_ORDERS: {
		key: "pending_orders",
		label: "Pending Orders",
		icon: "clock",
		color: "yellow",
	},
	COMPLETED_ORDERS: {
		key: "completed_orders",
		label: "Completed Orders",
		icon: "check-circle",
		color: "green",
	},
	TOTAL_SPENT: {
		key: "total_spent",
		label: "Total Spent",
		icon: "credit-card",
		color: "purple",
	},
	WISHLIST_ITEMS: {
		key: "wishlist_items",
		label: "Wishlist Items",
		icon: "heart",
		color: "red",
	},
} as const;

// Profile sections
export const PROFILE_SECTIONS = {
	PERSONAL_INFO: {
		key: "personal_info",
		label: "Personal Information",
		icon: "user",
	},
	CONTACT_INFO: {
		key: "contact_info",
		label: "Contact Information",
		icon: "phone",
	},
	SECURITY: {
		key: "security",
		label: "Security",
		icon: "shield",
	},
	PREFERENCES: {
		key: "preferences",
		label: "Preferences",
		icon: "settings",
	},
} as const;

// Settings sections
export const SETTINGS_SECTIONS = {
	ACCOUNT: {
		key: "account",
		label: "Account Settings",
		icon: "user",
	},
	NOTIFICATIONS: {
		key: "notifications",
		label: "Notifications",
		icon: "bell",
	},
	PRIVACY: {
		key: "privacy",
		label: "Privacy",
		icon: "lock",
	},
	LANGUAGE: {
		key: "language",
		label: "Language",
		icon: "globe",
	},
	THEME: {
		key: "theme",
		label: "Theme",
		icon: "palette",
	},
} as const;

// Pagination for dashboard lists
export const DASHBOARD_PAGINATION = {
	ORDERS_PER_PAGE: 10,
	INVOICES_PER_PAGE: 10,
	ADDRESSES_PER_PAGE: 5,
} as const;
