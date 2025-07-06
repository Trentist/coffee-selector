/**
 * Enhanced Aramex Integration Tests - Coffee Selection E2E
 * اختبارات تكامل أرامكس المحسنة - اختبارات شاملة لنظام الشحن
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Enhanced Aramex Integration - تكامل أرامكس المحسن', () => {
  let page: Page;

  const testAddresses = {
    domestic: {
      firstName: 'أحمد',
      lastName: 'محمد',
      line1: 'شارع الملك فهد 123',
      city: 'الرياض',
      phone: '+966501234567',
      country: 'SA'
    },
    international: {
      firstName: 'Ahmed',
      lastName: 'Mohammed',
      line1: 'Sheikh Zayed Road 456',
      city: 'Dubai',
      phone: '+971501234567',
      country: 'AE'
    }
  };

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Setup order for shipping tests
    await setupOrderForShipping(page);
  });

  test('should calculate domestic shipping rates accurately', async () => {
    // Step 1: Fill domestic address
    await fillShippingAddress(page, testAddresses.domestic);
    
    // Step 2: Wait for shipping options to load
    await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 15000 });
    
    // Step 3: Verify Aramex options are available
    const aramexOptions = page.locator('[data-testid="aramex-shipping-option"]');
    await expect(aramexOptions).toHaveCount.greaterThan(0);
    
    // Step 4: Verify domestic shipping rates
    const standardOption = aramexOptions.filter({ hasText: /standard|عادي/ }).first();
    const expressOption = aramexOptions.filter({ hasText: /express|سريع/ }).first();
    
    if (await standardOption.isVisible()) {
      const standardPrice = await getShippingPrice(standardOption);
      expect(standardPrice).toBeGreaterThan(0);
      expect(standardPrice).toBeLessThan(100); // Reasonable domestic rate
    }
    
    if (await expressOption.isVisible()) {
      const expressPrice = await getShippingPrice(expressOption);
      const standardPrice = await getShippingPrice(standardOption);
      expect(expressPrice).toBeGreaterThan(standardPrice); // Express should cost more
    }
    
    console.log('✅ Domestic shipping rates calculated correctly');
  });

  test('should calculate international shipping rates', async () => {
    // Step 1: Fill international address
    await fillShippingAddress(page, testAddresses.international);
    
    // Step 2: Wait for shipping options
    await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 15000 });
    
    // Step 3: Verify international shipping options
    const aramexOptions = page.locator('[data-testid="aramex-shipping-option"]');
    await expect(aramexOptions).toHaveCount.greaterThan(0);
    
    // Step 4: Verify international rates are higher
    const internationalOption = aramexOptions.first();
    const internationalPrice = await getShippingPrice(internationalOption);
    expect(internationalPrice).toBeGreaterThan(20); // International should be more expensive
    
    // Step 5: Verify delivery time estimates
    await expect(internationalOption.locator('[data-testid="delivery-estimate"]')).toBeVisible();
    const deliveryText = await internationalOption.locator('[data-testid="delivery-estimate"]').textContent();
    expect(deliveryText).toMatch(/\d+.*day|يوم/);
    
    console.log('✅ International shipping rates calculated correctly');
  });

  test('should create Aramex shipment after successful payment', async () => {
    // Step 1: Complete checkout process
    await fillShippingAddress(page, testAddresses.domestic);
    await selectAramexShipping(page);
    await completePayment(page);
    
    // Step 2: Wait for order confirmation
    await page.waitForSelector('[data-testid="order-confirmation"]', { timeout: 30000 });
    
    // Step 3: Verify Aramex shipment creation
    await expect(page.locator('[data-testid="aramex-shipment-created"]')).toBeVisible();
    
    // Step 4: Get AWB number
    const awbNumber = await page.locator('[data-testid="awb-number"]').textContent();
    expect(awbNumber).toBeTruthy();
    expect(awbNumber).toMatch(/^\d{10}$/); // Aramex AWB format
    
    // Step 5: Verify tracking URL
    const trackingUrl = await page.locator('[data-testid="tracking-url"]').getAttribute('href');
    expect(trackingUrl).toContain('aramex.com/track');
    expect(trackingUrl).toContain(awbNumber || '');
    
    console.log('✅ Aramex shipment created with AWB:', awbNumber);
  });

  test('should track shipment status updates', async () => {
    // Step 1: Create shipment
    await fillShippingAddress(page, testAddresses.domestic);
    await selectAramexShipping(page);
    await completePayment(page);
    
    // Step 2: Get order ID and navigate to tracking
    const orderId = await page.locator('[data-testid="order-id"]').textContent();
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 3: Verify tracking section
    await expect(page.locator('[data-testid="shipment-tracking"]')).toBeVisible();
    
    // Step 4: Check tracking updates
    const trackingUpdates = page.locator('[data-testid="tracking-update"]');
    await expect(trackingUpdates).toHaveCount.greaterThan(0);
    
    // Step 5: Verify tracking update structure
    const firstUpdate = trackingUpdates.first();
    await expect(firstUpdate.locator('[data-testid="update-status"]')).toBeVisible();
    await expect(firstUpdate.locator('[data-testid="update-date"]')).toBeVisible();
    await expect(firstUpdate.locator('[data-testid="update-location"]')).toBeVisible();
    
    console.log('✅ Shipment tracking working correctly');
  });

  test('should handle Aramex service unavailability', async () => {
    // Step 1: Mock Aramex service error
    await page.route('**/api/aramex/**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Aramex service unavailable' })
      });
    });
    
    // Step 2: Fill shipping address
    await fillShippingAddress(page, testAddresses.domestic);
    
    // Step 3: Verify error handling
    await expect(page.locator('[data-testid="aramex-service-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="aramex-service-error"]')).toContainText(/unavailable|غير متاح/);
    
    // Step 4: Verify fallback shipping options
    await expect(page.locator('[data-testid="alternative-shipping"]')).toBeVisible();
    
    console.log('✅ Aramex service unavailability handled correctly');
  });

  test('should validate address with Aramex service', async () => {
    // Step 1: Fill invalid address
    const invalidAddress = {
      ...testAddresses.domestic,
      line1: 'عنوان غير صحيح 999999',
      city: 'مدينة غير موجودة'
    };
    
    await fillShippingAddress(page, invalidAddress);
    
    // Step 2: Trigger address validation
    await page.locator('[data-testid="validate-address-btn"]').click();
    
    // Step 3: Verify validation results
    await expect(page.locator('[data-testid="address-validation-result"]')).toBeVisible();
    
    // Step 4: Check for address suggestions
    const suggestions = page.locator('[data-testid="address-suggestion"]');
    if (await suggestions.count() > 0) {
      await expect(suggestions.first()).toBeVisible();
      
      // Step 5: Select suggested address
      await suggestions.first().click();
      
      // Step 6: Verify address updated
      const updatedCity = await page.locator('[data-testid="city-input"]').inputValue();
      expect(updatedCity).not.toBe(invalidAddress.city);
    }
    
    console.log('✅ Address validation with Aramex working');
  });

  test('should schedule pickup for multiple shipments', async () => {
    // Step 1: Create multiple orders (simulate)
    const orders = ['ORDER-001', 'ORDER-002', 'ORDER-003'];
    
    // Step 2: Navigate to pickup scheduling
    await page.goto('/dashboard/aramex/pickup');
    
    // Step 3: Select orders for pickup
    for (const orderId of orders) {
      const orderCheckbox = page.locator(`[data-testid="order-${orderId}"]`);
      if (await orderCheckbox.isVisible()) {
        await orderCheckbox.check();
      }
    }
    
    // Step 4: Schedule pickup
    await page.locator('[data-testid="pickup-date"]').fill('2024-02-01');
    await page.locator('[data-testid="pickup-time-from"]').fill('09:00');
    await page.locator('[data-testid="pickup-time-to"]').fill('17:00');
    await page.locator('[data-testid="schedule-pickup-btn"]').click();
    
    // Step 5: Verify pickup scheduled
    await expect(page.locator('[data-testid="pickup-confirmation"]')).toBeVisible();
    
    const pickupGUID = await page.locator('[data-testid="pickup-guid"]').textContent();
    expect(pickupGUID).toBeTruthy();
    
    console.log('✅ Pickup scheduled with GUID:', pickupGUID);
  });

  test('should handle shipment cancellation', async () => {
    // Step 1: Create shipment
    await fillShippingAddress(page, testAddresses.domestic);
    await selectAramexShipping(page);
    await completePayment(page);
    
    const orderId = await page.locator('[data-testid="order-id"]').textContent();
    
    // Step 2: Navigate to order management
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 3: Cancel shipment
    await page.locator('[data-testid="cancel-shipment-btn"]').click();
    
    // Step 4: Confirm cancellation
    await page.locator('[data-testid="cancellation-reason"]').fill('طلب العميل');
    await page.locator('[data-testid="confirm-cancel-btn"]').click();
    
    // Step 5: Verify cancellation
    await expect(page.locator('[data-testid="shipment-cancelled"]')).toBeVisible();
    await expect(page.locator('[data-testid="shipment-status"]')).toContainText(/cancelled|ملغي/);
    
    // Step 6: Verify refund calculation
    const refundAmount = page.locator('[data-testid="refund-amount"]');
    if (await refundAmount.isVisible()) {
      const refundText = await refundAmount.textContent();
      const refund = parseFloat(refundText?.replace(/[^\d.]/g, '') || '0');
      expect(refund).toBeGreaterThanOrEqual(0);
    }
    
    console.log('✅ Shipment cancellation handled correctly');
  });

  test('should generate and download shipping labels', async () => {
    // Step 1: Create shipment
    await fillShippingAddress(page, testAddresses.domestic);
    await selectAramexShipping(page);
    await completePayment(page);
    
    const orderId = await page.locator('[data-testid="order-id"]').textContent();
    
    // Step 2: Navigate to shipment details
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 3: Generate shipping label
    await page.locator('[data-testid="generate-label-btn"]').click();
    
    // Step 4: Select label format
    await page.locator('[data-testid="label-format"]').selectOption('PDF');
    await page.locator('[data-testid="confirm-generate-btn"]').click();
    
    // Step 5: Verify label generation
    await expect(page.locator('[data-testid="label-generated"]')).toBeVisible();
    
    // Step 6: Download label
    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-testid="download-label-btn"]').click();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('.pdf');
    
    console.log('✅ Shipping label generated and downloaded');
  });

  test('should handle return shipment creation', async () => {
    // Step 1: Create original shipment
    await fillShippingAddress(page, testAddresses.domestic);
    await selectAramexShipping(page);
    await completePayment(page);
    
    const orderId = await page.locator('[data-testid="order-id"]').textContent();
    
    // Step 2: Navigate to returns
    await page.goto(`/dashboard/orders/${orderId}/return`);
    
    // Step 3: Create return shipment
    await page.locator('[data-testid="return-reason"]').selectOption('defective');
    await page.locator('[data-testid="return-notes"]').fill('منتج معيب - طلب استبدال');
    await page.locator('[data-testid="create-return-btn"]').click();
    
    // Step 4: Verify return shipment created
    await expect(page.locator('[data-testid="return-shipment-created"]')).toBeVisible();
    
    const returnAwb = await page.locator('[data-testid="return-awb"]').textContent();
    expect(returnAwb).toBeTruthy();
    
    // Step 5: Verify return tracking
    await expect(page.locator('[data-testid="return-tracking-url"]')).toBeVisible();
    
    console.log('✅ Return shipment created with AWB:', returnAwb);
  });

  test('should display real-time shipping costs', async () => {
    // Step 1: Fill address
    await fillShippingAddress(page, testAddresses.domestic);
    
    // Step 2: Wait for rate calculation
    await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 15000 });
    
    // Step 3: Verify cost breakdown
    const aramexOption = page.locator('[data-testid="aramex-shipping-option"]').first();
    await aramexOption.click();
    
    // Step 4: Check cost details
    await expect(page.locator('[data-testid="shipping-cost-breakdown"]')).toBeVisible();
    
    const baseRate = await getNumericValue(page, '[data-testid="base-rate"]');
    const fuelSurcharge = await getNumericValue(page, '[data-testid="fuel-surcharge"]');
    const totalShipping = await getNumericValue(page, '[data-testid="total-shipping"]');
    
    expect(baseRate).toBeGreaterThan(0);
    expect(totalShipping).toBeGreaterThanOrEqual(baseRate);
    
    console.log('✅ Real-time shipping costs displayed correctly');
  });

  test('should handle bulk shipment operations', async () => {
    // Step 1: Navigate to bulk operations
    await page.goto('/dashboard/aramex/bulk-operations');
    
    // Step 2: Upload CSV file for bulk shipments
    const fileInput = page.locator('[data-testid="bulk-file-input"]');
    await fileInput.setInputFiles('./test-data/bulk-shipments.csv');
    
    // Step 3: Process bulk shipments
    await page.locator('[data-testid="process-bulk-btn"]').click();
    
    // Step 4: Verify processing results
    await expect(page.locator('[data-testid="bulk-processing-results"]')).toBeVisible();
    
    const successCount = await page.locator('[data-testid="success-count"]').textContent();
    const failureCount = await page.locator('[data-testid="failure-count"]').textContent();
    
    expect(parseInt(successCount || '0')).toBeGreaterThanOrEqual(0);
    expect(parseInt(failureCount || '0')).toBeGreaterThanOrEqual(0);
    
    console.log('✅ Bulk shipment operations working');
  });
});

// Helper functions for Aramex tests
async function setupOrderForShipping(page: Page) {
  await page.goto('/store/shop');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 });
  
  const productCard = page.locator('[data-testid="product-card"]').first();
  await productCard.locator('[data-testid="add-to-cart-btn"]').click();
  
  await page.goto('/store/checkout');
  await page.waitForLoadState('networkidle');
}

async function fillShippingAddress(page: Page, address: any) {
  await page.locator('[data-testid="firstName-input"]').fill(address.firstName);
  await page.locator('[data-testid="lastName-input"]').fill(address.lastName);
  await page.locator('[data-testid="line1-input"]').fill(address.line1);
  await page.locator('[data-testid="city-input"]').fill(address.city);
  await page.locator('[data-testid="phone-input"]').fill(address.phone);
  await page.locator('[data-testid="country-select"]').click();
  await page.locator(`[data-value="${address.country}"]`).click();
  await page.locator('[data-testid="save-address-btn"]').click();
}

async function selectAramexShipping(page: Page) {
  await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 15000 });
  await page.locator('[data-testid="aramex-shipping-option"]').first().click();
}

async function completePayment(page: Page) {
  const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]');
  await cardNumberFrame.locator('[name="cardnumber"]').fill('4242424242424242');
  
  const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]');
  await expiryFrame.locator('[name="exp-date"]').fill('12/25');
  
  const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]');
  await cvcFrame.locator('[name="cvc"]').fill('123');
  
  await page.locator('[data-testid="cardholder-name"]').fill('Test User');
  await page.locator('[data-testid="place-order-btn"]').click();
  
  await page.waitForSelector('[data-testid="payment-result"][data-status="success"]', { timeout: 30000 });
}

async function getShippingPrice(option: any): Promise<number> {
  const priceText = await option.locator('[data-testid="shipping-price"]').textContent();
  return parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
}

async function getNumericValue(page: Page, selector: string): Promise<number> {
  const element = page.locator(selector);
  if (await element.isVisible()) {
    const text = await element.textContent();
    return parseFloat(text?.replace(/[^\d.]/g, '') || '0');
  }
  return 0;
}

export const AramexTestHelpers = {
  testAddresses,
  setupOrderForShipping,
  fillShippingAddress,
  selectAramexShipping,
  completePayment,
  getShippingPrice,
  getNumericValue
};