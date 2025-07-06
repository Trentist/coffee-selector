/**
 * Dashboard System Main Export
 * التصدير الرئيسي لنظام لوحة التحكم
 */

// Main Dashboard Components
export { default as DashboardPage } from "./DashboardPage";
export { DashboardLayout } from "./DashboardLayout";
export { default as DashboardSidebar } from "./DashboardSidebar";

// Dashboard Sections
export { default as DashboardOverview } from "./sections/DashboardOverview";
export { default as ProfileSection } from "./sections/ProfileSection";
export { default as OrdersSection } from "./sections/OrdersSection";
export { default as WishlistSection } from "./sections/WishlistSection";
export { default as AddressesSection } from "./sections/AddressesSection";
export { default as SettingsSection } from "./sections/SettingsSection";

// Settings Components
export { default as SettingsPage } from "./settings/SettingsPage";
export { default as AccountSecuritySection } from "./settings/sections/AccountSecuritySection";
export { default as PrivacyDataSection } from "./settings/sections/PrivacyDataSection";
export { default as GeneralPreferencesSection } from "./settings/sections/GeneralPreferencesSection";
export { default as OrdersShippingSection } from "./settings/sections/OrdersShippingSection";
export { default as CommunicationsSection } from "./settings/sections/CommunicationsSection";
export { default as AdvancedSecuritySection } from "./settings/sections/AdvancedSecuritySection";

// Settings Components
export { default as ProfileSettings } from "./settings/ProfileSettings";
export { default as ChangePassword } from "./settings/ChangePassword";
export { default as SettingsButtons } from "./settings/SettingsButtons";

// Dashboard Hooks
export { useDashboard } from "./hooks/useDashboard";
export { useSettings } from "./settings/hooks/useSettings";
export { usePrivacy } from "./settings/hooks/usePrivacy";
export { useSecuritySettings } from "./settings/hooks/useSecuritySettings";

// Dashboard Services
export * from "./settings/services/settingsQueries";
export * from "./settings/services/settingsMutations";

// Dashboard Types
export * from "./types/dashboard.types";
export * from "./settings/types/settings.types";
