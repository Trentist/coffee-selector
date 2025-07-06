/**
 * Enhanced Cart Functionality Tests - Coffee Selection E2E
 * اختبارات وظائف العربة المحسنة - اختبارات شاملة لموقع Coffee Selection
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Enhanced Cart Functionality - وظائف العربة المحسنة', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Navigate to shop with proper loading
    await page.goto('/store/shop');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 });
  });

  test('should add single product to cart with real data validation', async () => {
    // Step 1: Get product details before adding
    const productCard = page.locator('[data-testid="product-card"]').first();
    const productName = await productCard.locator('[data-testid="product-name"]').textContent();
    const productPrice = await productCard.locator('[data-testid="product-price"]').textContent();
    
    // Step 2: Add product to cart
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Step 3: Verify success notification
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="toast-success"]')).toContainText(/added|أضيف/);
    
    // Step 4: Verify cart counter updated
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toBeVisible();
    await expect(cartCounter).toContainText('1');
    
    // Step 5: Open cart and verify product details
    await cartCounter.click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
    
    const cartItem = page.locator('[data-testid="cart-item"]').first();
    await expect(cartItem.locator('[data-testid="item-name"]')).toContainText(productName || '');
    await expect(cartItem.locator('[data-testid="item-price"]')).toContainText(productPrice?.replace(/[^\d.]/g, '') || '');
    
    console.log('✅ Single product added to cart with validation');
  });

  test('should handle multiple products with quantity management', async () => {
    const productCards = await page.locator('[data-testid="product-card"]').all();
    const productsToAdd = Math.min(3, productCards.length);
    
    // Step 1: Add multiple different products
    for (let i = 0; i < productsToAdd; i++) {
      await productCards[i].locator('[data-testid="add-to-cart-btn"]').click();
      await page.waitForTimeout(1000); // Wait between additions
    }
    
    // Step 2: Verify cart counter shows correct total
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toContainText(productsToAdd.toString());
    
    // Step 3: Open cart and verify all items
    await cartCounter.click();
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(productsToAdd);
    
    // Step 4: Test quantity increase for first item
    const firstItem = cartItems.first();
    await firstItem.locator('[data-testid="quantity-increase"]').click();
    await expect(firstItem.locator('[data-testid="item-quantity"]')).toContainText('2');
    
    // Step 5: Verify total counter updated
    await expect(cartCounter).toContainText((productsToAdd + 1).toString());
    
    console.log('✅ Multiple products with quantity management working');
  });

  test('should calculate totals correctly with real pricing', async () => {
    const productCards = await page.locator('[data-testid="product-card"]').all();
    let expectedSubtotal = 0;
    
    // Step 1: Add products and calculate expected total
    for (let i = 0; i < Math.min(2, productCards.length); i++) {
      const priceText = await productCards[i].locator('[data-testid="product-price"]').textContent();
      const price = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
      expectedSubtotal += price;
      
      await productCards[i].locator('[data-testid="add-to-cart-btn"]').click();
      await page.waitForTimeout(500);
    }
    
    // Step 2: Open cart and verify calculations
    await page.locator('[data-testid="cart-counter"]').click();
    
    const subtotalElement = page.locator('[data-testid="cart-subtotal"]');
    const subtotalText = await subtotalElement.textContent();
    const actualSubtotal = parseFloat(subtotalText?.replace(/[^\d.]/g, '') || '0');
    
    // Step 3: Verify subtotal accuracy (within 0.01 tolerance)
    expect(Math.abs(actualSubtotal - expectedSubtotal)).toBeLessThan(0.01);
    
    // Step 4: Verify tax calculation if applicable
    const taxElement = page.locator('[data-testid="cart-tax"]');
    if (await taxElement.isVisible()) {
      const taxText = await taxElement.textContent();
      const taxAmount = parseFloat(taxText?.replace(/[^\d.]/g, '') || '0');
      expect(taxAmount).toBeGreaterThanOrEqual(0);
    }
    
    // Step 5: Verify final total
    const totalElement = page.locator('[data-testid="cart-total"]');
    const totalText = await totalElement.textContent();
    const finalTotal = parseFloat(totalText?.replace(/[^\d.]/g, '') || '0');
    expect(finalTotal).toBeGreaterThanOrEqual(actualSubtotal);
    
    console.log('✅ Cart calculations verified with real pricing');
  });

  test('should handle cart persistence across page navigation', async () => {
    // Step 1: Add product to cart
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Step 2: Navigate to different page
    await page.goto('/main/about');
    await page.waitForLoadState('networkidle');
    
    // Step 3: Verify cart counter persists
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toBeVisible();
    await expect(cartCounter).toContainText('1');
    
    // Step 4: Navigate back to shop
    await page.goto('/store/shop');
    await page.waitForLoadState('networkidle');
    
    // Step 5: Verify cart still contains item
    await cartCounter.click();
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    
    console.log('✅ Cart persistence across navigation working');
  });

  test('should handle cart item removal with confirmation', async () => {
    // Step 1: Add multiple products
    const productCards = await page.locator('[data-testid="product-card"]').all();
    for (let i = 0; i < Math.min(2, productCards.length); i++) {
      await productCards[i].locator('[data-testid="add-to-cart-btn"]').click();
      await page.waitForTimeout(500);
    }
    
    // Step 2: Open cart
    await page.locator('[data-testid="cart-counter"]').click();
    
    // Step 3: Remove first item
    const firstItem = page.locator('[data-testid="cart-item"]').first();
    await firstItem.locator('[data-testid="remove-item-btn"]').click();
    
    // Step 4: Handle confirmation if present
    const confirmDialog = page.locator('[data-testid="remove-confirmation"]');
    if (await confirmDialog.isVisible()) {
      await page.locator('[data-testid="confirm-remove-btn"]').click();
    }
    
    // Step 5: Verify item removed
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="cart-counter"]')).toContainText('1');
    
    console.log('✅ Cart item removal with confirmation working');
  });

  test('should clear entire cart with confirmation', async () => {
    // Step 1: Add multiple products
    const productCards = await page.locator('[data-testid="product-card"]').all();
    for (let i = 0; i < Math.min(3, productCards.length); i++) {
      await productCards[i].locator('[data-testid="add-to-cart-btn"]').click();
      await page.waitForTimeout(500);
    }
    
    // Step 2: Open cart
    await page.locator('[data-testid="cart-counter"]').click();
    
    // Step 3: Clear cart
    await page.locator('[data-testid="clear-cart-btn"]').click();
    
    // Step 4: Confirm clearing
    await expect(page.locator('[data-testid="clear-cart-confirmation"]')).toBeVisible();
    await page.locator('[data-testid="confirm-clear-btn"]').click();
    
    // Step 5: Verify cart is empty
    await expect(page.locator('[data-testid="cart-empty"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-counter"]')).not.toBeVisible();
    
    console.log('✅ Clear entire cart functionality working');
  });

  test('should handle cart checkout navigation', async () => {
    // Step 1: Add product to cart
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Step 2: Open cart and proceed to checkout
    await page.locator('[data-testid="cart-counter"]').click();
    await page.locator('[data-testid="checkout-btn"]').click();
    
    // Step 3: Verify navigation to checkout
    await expect(page).toHaveURL(/.*checkout/);
    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
    
    // Step 4: Verify cart items transferred to checkout
    await expect(page.locator('[data-testid="checkout-item"]')).toHaveCount(1);
    
    console.log('✅ Cart to checkout navigation working');
  });

  test('should handle cart with guest user session', async () => {
    // Step 1: Ensure guest session
    await page.evaluate(() => {
      localStorage.removeItem('auth-token');
      sessionStorage.clear();
    });
    
    // Step 2: Add product as guest
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Step 3: Verify guest cart functionality
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toBeVisible();
    await expect(cartCounter).toContainText('1');
    
    // Step 4: Open cart and verify guest checkout option
    await cartCounter.click();
    await expect(page.locator('[data-testid="guest-checkout-btn"]')).toBeVisible();
    
    console.log('✅ Guest cart functionality working');
  });

  test('should handle cart quantity limits and validation', async () => {
    // Step 1: Add product to cart
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Step 2: Open cart
    await page.locator('[data-testid="cart-counter"]').click();
    
    // Step 3: Test maximum quantity limit
    const cartItem = page.locator('[data-testid="cart-item"]').first();
    const increaseBtn = cartItem.locator('[data-testid="quantity-increase"]');
    
    // Increase quantity multiple times
    for (let i = 0; i < 10; i++) {
      await increaseBtn.click();
      await page.waitForTimeout(200);
    }
    
    // Step 4: Verify quantity limit enforcement
    const quantityInput = cartItem.locator('[data-testid="quantity-input"]');
    const finalQuantity = await quantityInput.inputValue();
    expect(parseInt(finalQuantity)).toBeLessThanOrEqual(99); // Assuming max limit
    
    // Step 5: Test minimum quantity (should not go below 1)
    const decreaseBtn = cartItem.locator('[data-testid="quantity-decrease"]');
    for (let i = 0; i < 20; i++) {
      await decreaseBtn.click();
      await page.waitForTimeout(200);
    }
    
    const minQuantity = await quantityInput.inputValue();
    expect(parseInt(minQuantity)).toBeGreaterThanOrEqual(1);
    
    console.log('✅ Cart quantity limits and validation working');
  });

  test('should handle cart with currency conversion', async () => {
    // Step 1: Change currency if currency selector exists
    const currencySelector = page.locator('[data-testid="currency-selector"]');
    if (await currencySelector.isVisible()) {
      await currencySelector.click();
      await page.locator('[data-value="USD"]').click();
      await page.waitForTimeout(1000);
    }
    
    // Step 2: Add product to cart
    const productCard = page.locator('[data-testid="product-card"]').first();
    const originalPrice = await productCard.locator('[data-testid="product-price"]').textContent();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Step 3: Open cart and verify currency
    await page.locator('[data-testid="cart-counter"]').click();
    const cartPrice = await page.locator('[data-testid="cart-total"]').textContent();
    
    // Step 4: Verify currency symbol consistency
    if (originalPrice?.includes('$')) {
      expect(cartPrice).toContain('$');
    } else if (originalPrice?.includes('ر.س')) {
      expect(cartPrice).toContain('ر.س');
    }
    
    console.log('✅ Cart currency handling working');
  });
});

// Helper functions for cart tests
export const CartTestHelpers = {
  async addProductToCart(page: Page, productIndex: number = 0) {
    const productCard = page.locator('[data-testid="product-card"]').nth(productIndex);
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    await page.waitForSelector('[data-testid="toast-success"]', { timeout: 5000 });
  },

  async openCart(page: Page) {
    await page.locator('[data-testid="cart-counter"]').click();
    await page.waitForSelector('[data-testid="cart-drawer"]', { timeout: 5000 });
  },

  async getCartItemCount(page: Page): Promise<number> {
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    if (await cartCounter.isVisible()) {
      const countText = await cartCounter.textContent();
      return parseInt(countText || '0');
    }
    return 0;
  },

  async calculateExpectedTotal(page: Page, productIndices: number[]): Promise<number> {
    let total = 0;
    for (const index of productIndices) {
      const productCard = page.locator('[data-testid="product-card"]').nth(index);
      const priceText = await productCard.locator('[data-testid="product-price"]').textContent();
      const price = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
      total += price;
    }
    return total;
  },

  async verifyCartPersistence(page: Page, expectedCount: number) {
    await page.reload();
    await page.waitForLoadState('networkidle');
    const actualCount = await this.getCartItemCount(page);
    expect(actualCount).toBe(expectedCount);
  }
};