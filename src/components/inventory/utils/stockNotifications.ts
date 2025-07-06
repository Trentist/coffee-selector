/**
 * أدوات إشعارات المخزون
 * Stock Notification Utilities
 */

export interface StockNotification {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock';
  message: string;
  timestamp: Date;
  itemId: string;
}

/**
 * إنشاء إشعار انخفاض المخزون
 * Create low stock notification
 */
export const createLowStockNotification = (itemId: string, itemName: string): StockNotification => {
  return {
    id: `low_stock_${itemId}_${Date.now()}`,
    type: 'low_stock',
    message: `المخزون منخفض للمنتج: ${itemName}`,
    timestamp: new Date(),
    itemId
  };
};

/**
 * إنشاء إشعار نفاد المخزون
 * Create out of stock notification
 */
export const createOutOfStockNotification = (itemId: string, itemName: string): StockNotification => {
  return {
    id: `out_of_stock_${itemId}_${Date.now()}`,
    type: 'out_of_stock',
    message: `نفذ المخزون للمنتج: ${itemName}`,
    timestamp: new Date(),
    itemId
  };
};

/**
 * إنشاء إشعار زيادة المخزون
 * Create overstock notification
 */
export const createOverstockNotification = (itemId: string, itemName: string): StockNotification => {
  return {
    id: `overstock_${itemId}_${Date.now()}`,
    type: 'overstock',
    message: `المخزون زائد للمنتج: ${itemName}`,
    timestamp: new Date(),
    itemId
  };
};

/**
 * تنسيق رسالة الإشعار
 * Format notification message
 */
export const formatNotificationMessage = (notification: StockNotification): string => {
  return `${notification.message} - ${notification.timestamp.toLocaleString('ar-SA')}`;
};