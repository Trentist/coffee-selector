/**
 * نظام إدارة المخزون - ملف التصدير الرئيسي
 * Inventory Management System - Main Export File
 */

// المكونات الرئيسية
export { default as StockManager } from "./StockManager";
export { default as InventoryDashboard } from "./InventoryDashboard";
export { default as StockLevelMonitor } from "./StockLevelMonitor";
export { default as InventoryAnalytics } from "./InventoryAnalytics";

// الأنواع
export type { StockLevel, StockAlert, InventoryAnalytics } from "./types";

// الخدمات
export { default as InventoryService } from "./services/InventoryService";

// الأدوات المساعدة
export * from "./utils/stockCalculations";
export * from "./utils/stockNotifications";