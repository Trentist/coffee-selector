/**
 * خدمة إدارة المخزون
 * Inventory Management Service
 */

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  category: string;
}

export interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

class InventoryService {
  private inventory: InventoryItem[] = [];

  // الحصول على جميع عناصر المخزون
  getInventory(): InventoryItem[] {
    return this.inventory;
  }

  // إضافة عنصر جديد
  addItem(item: InventoryItem): void {
    this.inventory.push(item);
  }

  // تحديث كمية عنصر
  updateQuantity(id: string, quantity: number): void {
    const item = this.inventory.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
    }
  }

  // التحقق من انخفاض المخزون
  checkLowStock(): InventoryItem[] {
    return this.inventory.filter(item => item.quantity <= item.minQuantity);
  }

  // مسح المخزون
  clearInventory(): void {
    this.inventory = [];
  }
}

export default new InventoryService();