/**
 * Dashboard System Export
 * تصدير نظام لوحة التحكم
 */

// Main Dashboard Components
export { default as DashboardPage } from "./DashboardPage";
export { default as OverviewSection } from "./sections/OverviewSection";
export { default as OrdersSection } from "./sections/OrdersSection";
export { default as ProfileSection } from "./sections/ProfileSection";
export { default as InvoicesSection } from "./sections/InvoicesSection";
export { default as OrderTrackingSection } from "./sections/OrderTrackingSection";

// Dashboard Components
export { default as DashboardCard } from "./components/DashboardCard";
export { default as QuickActions } from "./components/QuickActions";
export { default as OrderList } from "./components/OrderList";
export { default as OrderFilters } from "./components/OrderFilters";

// Dashboard Hooks
export { useDashboard } from "./hooks/useDashboard";

// Settings System
export * from "./settings";

// Core Components
export { default as StatsCard } from "./components/StatsCard";
export { default as ActivityItem } from "./components/ActivityItem";
export { default as ActivityList } from "./components/ActivityList";
export { default as QuickActionButton } from "./components/QuickActionButton";
export { default as AddressList } from "./components/AddressList";
export { default as PreferencesForm } from "./components/PreferencesForm";

// Hooks
export { useDashboardStats } from "./hooks/useDashboardStats";
export { useRecentActivity } from "./hooks/useRecentActivity";

// Helpers
export {
	formatCurrency,
	formatPercentage,
	getStatsData,
} from "./helpers/statsHelpers";

// Types
export type {
	User,
	DashboardTab,
	Order,
	OrderItem,
	WishlistItem,
	Address,
	DashboardStats,
	RecentActivity,
	ProfileData,
	StatsCardData,
} from "./types/dashboard.types";

// Invoice Types
export type {
	Invoice,
	InvoiceLine,
	InvoiceTax,
	InvoiceFilters,
	InvoicesResult,
} from "./types/invoice.types";

// Order Tracking Types
export type {
	Order as TrackingOrder,
	OrderLine,
	TrackingStep,
	OrderFilters as TrackingOrderFilters,
	OrdersResult as TrackingOrdersResult,
} from "./types/order-tracking.types";
