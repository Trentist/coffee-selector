/**
 * Enhanced Payment Processing Tests - Coffee Selection E2E
 * اختبارات معالجة الدفع المحسنة - اختبارات شاملة لنظام الدفع
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Enhanced Payment Processing - معالجة الدفع المحسنة', () => {
  let page: Page;

  const testCards = {
    valid: {
      number: '4242424242424242',
      expiry: '12/25',
      cvc: '123',
      name: 'Test User'
    },
    declined: {
      number: '4000000000000002',
      expiry: '12/25',
      cvc: '123',
      name: 'Declined Card'
    },
    insufficientFunds: {
      number: '4000000000009995',
      expiry: '12/25',
      cvc: '123',
      name: 'Insufficient Funds'
    },
    expired: {
      number: '4242424242424242',
      expiry: '01/20',
      cvc: '123',
      name: 'Expired Card'
    },
    requiresAuth: {
      number: '4000002500003155',
      expiry: '12/25',
      cvc: '123',
      name: '3D Secure Card'
    }
  };

  const testAddress = {
    firstName: 'أحمد',
    lastName: 'محمد',
    line1: 'شارع الملك فهد 123',
    city: 'الرياض',
    phone: '+966501234567',
    country: 'SA'
  };

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Complete setup to checkout page
    await setupCheckoutPage(page, testAddress);
  });

  test('should process successful payment with valid card', async () => {
    // Step 1: Fill payment form with valid card
    await fillPaymentForm(page, testCards.valid);
    
    // Step 2: Verify payment form validation
    await expect(page.locator('[data-testid="payment-form"]')).toHaveAttribute('data-valid', 'true');
    
    // Step 3: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 4: Verify payment processing state
    await expect(page.locator('[data-testid="payment-processing"]')).toBeVisible();
    await expect(page.locator('[data-testid="processing-spinner"]')).toBeVisible();
    
    // Step 5: Wait for payment completion
    await page.waitForSelector('[data-testid="payment-result"]', { timeout: 30000 });
    
    // Step 6: Verify successful payment
    const paymentResult = page.locator('[data-testid="payment-result"]');
    await expect(paymentResult).toHaveAttribute('data-status', 'success');
    
    // Step 7: Verify order creation
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    const orderId = await page.locator('[data-testid="order-id"]').textContent();
    expect(orderId).toBeTruthy();
    
    // Step 8: Verify payment details in confirmation
    await expect(page.locator('[data-testid="payment-method"]')).toContainText('****4242');
    
    console.log('✅ Successful payment processed with order ID:', orderId);
  });

  test('should handle declined card payment', async () => {
    // Step 1: Fill payment form with declined card
    await fillPaymentForm(page, testCards.declined);
    
    // Step 2: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 3: Wait for payment result
    await page.waitForSelector('[data-testid="payment-result"]', { timeout: 30000 });
    
    // Step 4: Verify payment failure
    const paymentResult = page.locator('[data-testid="payment-result"]');
    await expect(paymentResult).toHaveAttribute('data-status', 'failed');
    
    // Step 5: Verify error message
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]')).toContainText(/declined|مرفوض|failed|فشل/);
    
    // Step 6: Verify retry option available
    await expect(page.locator('[data-testid="retry-payment-btn"]')).toBeVisible();
    
    // Step 7: Verify order not created
    await expect(page.locator('[data-testid="order-confirmation"]')).not.toBeVisible();
    
    console.log('✅ Declined card payment handled correctly');
  });

  test('should handle insufficient funds scenario', async () => {
    // Step 1: Fill payment form with insufficient funds card
    await fillPaymentForm(page, testCards.insufficientFunds);
    
    // Step 2: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 3: Wait for payment result
    await page.waitForSelector('[data-testid="payment-result"]', { timeout: 30000 });
    
    // Step 4: Verify specific insufficient funds error
    const paymentResult = page.locator('[data-testid="payment-result"]');
    await expect(paymentResult).toHaveAttribute('data-status', 'failed');
    await expect(page.locator('[data-testid="payment-error"]')).toContainText(/insufficient|رصيد غير كافي/);
    
    // Step 5: Verify helpful error message
    await expect(page.locator('[data-testid="error-suggestion"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-suggestion"]')).toContainText(/try different|جرب بطاقة أخرى/);
    
    console.log('✅ Insufficient funds scenario handled correctly');
  });

  test('should validate payment form fields', async () => {
    // Step 1: Try to submit without filling payment details
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 2: Verify validation errors
    await expect(page.locator('[data-testid="card-number-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-expiry-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-cvc-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="cardholder-name-error"]')).toBeVisible();
    
    // Step 3: Fill invalid card number
    await fillCardNumber(page, '1234567890123456');
    await expect(page.locator('[data-testid="card-number-error"]')).toContainText(/invalid|غير صحيح/);
    
    // Step 4: Fill expired date
    await fillCardExpiry(page, '01/20');
    await expect(page.locator('[data-testid="card-expiry-error"]')).toContainText(/expired|منتهية/);
    
    // Step 5: Fill invalid CVC
    await fillCardCVC(page, '12');
    await expect(page.locator('[data-testid="card-cvc-error"]')).toContainText(/invalid|غير صحيح/);
    
    console.log('✅ Payment form validation working correctly');
  });

  test('should handle 3D Secure authentication', async () => {
    // Step 1: Fill payment form with 3D Secure card
    await fillPaymentForm(page, testCards.requiresAuth);
    
    // Step 2: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 3: Wait for 3D Secure challenge
    await page.waitForSelector('[data-testid="3ds-challenge"]', { timeout: 15000 });
    
    // Step 4: Complete 3D Secure authentication
    const challengeFrame = page.frameLocator('[data-testid="3ds-frame"]');
    await challengeFrame.locator('[data-testid="complete-auth-btn"]').click();
    
    // Step 5: Wait for payment completion
    await page.waitForSelector('[data-testid="payment-result"]', { timeout: 30000 });
    
    // Step 6: Verify successful authentication and payment
    const paymentResult = page.locator('[data-testid="payment-result"]');
    await expect(paymentResult).toHaveAttribute('data-status', 'success');
    
    console.log('✅ 3D Secure authentication handled correctly');
  });

  test('should create quotation before payment processing', async () => {
    // Step 1: Fill valid payment details
    await fillPaymentForm(page, testCards.valid);
    
    // Step 2: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 3: Verify quotation creation notification
    await expect(page.locator('[data-testid="quotation-created"]')).toBeVisible();
    
    // Step 4: Get quotation ID
    const quotationId = await page.locator('[data-testid="quotation-id"]').textContent();
    expect(quotationId).toBeTruthy();
    
    // Step 5: Verify quotation details
    await expect(page.locator('[data-testid="quotation-details"]')).toBeVisible();
    
    // Step 6: Wait for payment completion
    await page.waitForSelector('[data-testid="payment-result"][data-status="success"]', { timeout: 30000 });
    
    // Step 7: Verify quotation converted to sales order
    await expect(page.locator('[data-testid="sales-order-created"]')).toBeVisible();
    const salesOrderId = await page.locator('[data-testid="sales-order-id"]').textContent();
    expect(salesOrderId).toBeTruthy();
    
    console.log('✅ Quotation to sales order conversion working:', { quotationId, salesOrderId });
  });

  test('should handle payment timeout scenarios', async () => {
    // Step 1: Mock slow payment processing
    await page.route('**/api/payment/process', async route => {
      await new Promise(resolve => setTimeout(resolve, 35000)); // 35 second delay
      route.continue();
    });
    
    // Step 2: Fill payment form
    await fillPaymentForm(page, testCards.valid);
    
    // Step 3: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 4: Verify timeout handling
    await expect(page.locator('[data-testid="payment-timeout"]')).toBeVisible({ timeout: 40000 });
    await expect(page.locator('[data-testid="timeout-message"]')).toContainText(/timeout|انتهت المهلة/);
    
    // Step 5: Verify retry option
    await expect(page.locator('[data-testid="retry-payment-btn"]')).toBeVisible();
    
    console.log('✅ Payment timeout handled correctly');
  });

  test('should handle network errors during payment', async () => {
    // Step 1: Mock network error
    await page.route('**/api/payment/process', route => {
      route.abort('failed');
    });
    
    // Step 2: Fill payment form
    await fillPaymentForm(page, testCards.valid);
    
    // Step 3: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 4: Verify network error handling
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="network-error"]')).toContainText(/network|شبكة|connection|اتصال/);
    
    // Step 5: Verify retry option
    await expect(page.locator('[data-testid="retry-payment-btn"]')).toBeVisible();
    
    console.log('✅ Network error during payment handled correctly');
  });

  test('should save payment method for future use', async () => {
    // Step 1: Fill payment form
    await fillPaymentForm(page, testCards.valid);
    
    // Step 2: Check save payment method option
    await page.locator('[data-testid="save-payment-method"]').check();
    
    // Step 3: Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 4: Wait for payment success
    await page.waitForSelector('[data-testid="payment-result"][data-status="success"]', { timeout: 30000 });
    
    // Step 5: Verify payment method saved
    await expect(page.locator('[data-testid="payment-method-saved"]')).toBeVisible();
    
    // Step 6: Navigate to payment methods page
    await page.goto('/dashboard/payment-methods');
    
    // Step 7: Verify saved payment method appears
    await expect(page.locator('[data-testid="saved-payment-method"]')).toBeVisible();
    await expect(page.locator('[data-testid="saved-card-last4"]')).toContainText('4242');
    
    console.log('✅ Payment method saving functionality working');
  });

  test('should handle multiple payment attempts', async () => {
    // Step 1: First attempt with declined card
    await fillPaymentForm(page, testCards.declined);
    await page.locator('[data-testid="place-order-btn"]').click();
    await page.waitForSelector('[data-testid="payment-result"][data-status="failed"]', { timeout: 30000 });
    
    // Step 2: Retry with valid card
    await page.locator('[data-testid="retry-payment-btn"]').click();
    await fillPaymentForm(page, testCards.valid);
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Step 3: Verify successful payment on retry
    await page.waitForSelector('[data-testid="payment-result"][data-status="success"]', { timeout: 30000 });
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    
    console.log('✅ Multiple payment attempts handled correctly');
  });

  test('should calculate and display payment fees correctly', async () => {
    // Step 1: Fill payment form
    await fillPaymentForm(page, testCards.valid);
    
    // Step 2: Verify payment fee calculation
    const paymentFee = page.locator('[data-testid="payment-fee"]');
    if (await paymentFee.isVisible()) {
      const feeText = await paymentFee.textContent();
      const feeAmount = parseFloat(feeText?.replace(/[^\d.]/g, '') || '0');
      expect(feeAmount).toBeGreaterThanOrEqual(0);
    }
    
    // Step 3: Verify total includes payment fee
    const subtotal = await getNumericValue(page, '[data-testid="order-subtotal"]');
    const fee = await getNumericValue(page, '[data-testid="payment-fee"]');
    const total = await getNumericValue(page, '[data-testid="order-total"]');
    
    expect(Math.abs(total - (subtotal + fee))).toBeLessThan(0.01);
    
    console.log('✅ Payment fee calculation working correctly');
  });
});

// Helper functions for payment tests
async function setupCheckoutPage(page: Page, address: any) {
  // Navigate to shop and add product
  await page.goto('/store/shop');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 });
  
  const productCard = page.locator('[data-testid="product-card"]').first();
  await productCard.locator('[data-testid="add-to-cart-btn"]').click();
  
  // Go to checkout
  await page.goto('/store/checkout');
  await page.waitForLoadState('networkidle');
  
  // Fill address
  await page.locator('[data-testid="firstName-input"]').fill(address.firstName);
  await page.locator('[data-testid="lastName-input"]').fill(address.lastName);
  await page.locator('[data-testid="line1-input"]').fill(address.line1);
  await page.locator('[data-testid="city-input"]').fill(address.city);
  await page.locator('[data-testid="phone-input"]').fill(address.phone);
  await page.locator('[data-testid="country-select"]').click();
  await page.locator(`[data-value="${address.country}"]`).click();
  await page.locator('[data-testid="save-address-btn"]').click();
  
  // Select shipping method
  await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 10000 });
  await page.locator('[data-testid="shipping-option"]').first().click();
}

async function fillPaymentForm(page: Page, card: any) {
  await fillCardNumber(page, card.number);
  await fillCardExpiry(page, card.expiry);
  await fillCardCVC(page, card.cvc);
  await page.locator('[data-testid="cardholder-name"]').fill(card.name);
}

async function fillCardNumber(page: Page, number: string) {
  const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]');
  await cardNumberFrame.locator('[name="cardnumber"]').fill(number);
}

async function fillCardExpiry(page: Page, expiry: string) {
  const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]');
  await expiryFrame.locator('[name="exp-date"]').fill(expiry);
}

async function fillCardCVC(page: Page, cvc: string) {
  const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]');
  await cvcFrame.locator('[name="cvc"]').fill(cvc);
}

async function getNumericValue(page: Page, selector: string): Promise<number> {
  const element = page.locator(selector);
  if (await element.isVisible()) {
    const text = await element.textContent();
    return parseFloat(text?.replace(/[^\d.]/g, '') || '0');
  }
  return 0;
}

export const PaymentTestHelpers = {
  testCards,
  setupCheckoutPage,
  fillPaymentForm,
  fillCardNumber,
  fillCardExpiry,
  fillCardCVC,
  getNumericValue
};