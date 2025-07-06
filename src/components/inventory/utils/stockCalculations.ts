/**
 * أدوات حساب المخزون
 * Stock Calculation Utilities
 */

export interface StockItem {
  id: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
}

/**
 * حساب إجمالي المخزون
 * Calculate total stock
 */
export const calculateTotalStock = (items: StockItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * حساب نسبة المخزون المتاح
 * Calculate available stock percentage
 */
export const calculateStockPercentage = (current: number, max: number): number => {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
};

/**
 * التحقق من انخفاض المخزون
 * Check for low stock
 */
export const isLowStock = (item: StockItem): boolean => {
  return item.quantity <= item.minQuantity;
};

/**
 * حساب قيمة المخزون
 * Calculate stock value
 */
export const calculateStockValue = (items: StockItem[], prices: Record<string, number>): number => {
  return items.reduce((total, item) => {
    const price = prices[item.id] || 0;
    return total + (item.quantity * price);
  }, 0);
};