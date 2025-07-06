/**
 * Complete Order Flow Integration Tests - Coffee Selection E2E
 * اختبارات تدفق الطلب الكامل - اختبارات التكامل الشاملة
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Complete Order Flow Integration - تكامل تدفق الطلب الكامل', () => {
  let page: Page;

  const completeOrderData = {
    customer: {
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'ahmed.mohammed@example.com',
      phone: '+966501234567'
    },
    address: {
      line1: 'شارع الملك فهد 123',
      line2: 'حي العليا',
      city: 'الرياض',
      postalCode: '12345',
      country: 'SA'
    },
    payment: {
      cardNumber: '4242424242424242',
      expiry: '12/25',
      cvc: '123',
      name: 'Ahmed Mohammed'
    },
    products: [
      { name: 'قهوة عربية مختصة', quantity: 2 },
      { name: 'قهوة كولومبية', quantity: 1 }
    ]
  };

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full order flow from cart to invoice', async () => {
    // Phase 1: Product Selection and Cart
    console.log('🛒 Phase 1: Adding products to cart...');
    
    await page.goto('/store/shop');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 });
    
    // Add multiple products to cart
    const productCards = await page.locator('[data-testid="product-card"]').all();
    for (let i = 0; i < Math.min(2, productCards.length); i++) {
      await productCards[i].locator('[data-testid="add-to-cart-btn"]').click();
      await page.waitForTimeout(1000);
    }
    
    // Verify cart counter
    const cartCounter = page.locator('[data-testid="cart-counter"]');
    await expect(cartCounter).toContainText('2');
    
    // Phase 2: Cart Review and Checkout Navigation
    console.log('📋 Phase 2: Reviewing cart and proceeding to checkout...');
    
    await cartCounter.click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2);
    
    // Proceed to checkout
    await page.locator('[data-testid="checkout-btn"]').click();
    await expect(page).toHaveURL(/.*checkout/);
    
    // Phase 3: Address and Customer Information
    console.log('📍 Phase 3: Filling customer and address information...');
    
    await page.locator('[data-testid="firstName-input"]').fill(completeOrderData.customer.firstName);
    await page.locator('[data-testid="lastName-input"]').fill(completeOrderData.customer.lastName);
    await page.locator('[data-testid="email-input"]').fill(completeOrderData.customer.email);
    await page.locator('[data-testid="phone-input"]').fill(completeOrderData.customer.phone);
    
    await page.locator('[data-testid="line1-input"]').fill(completeOrderData.address.line1);
    await page.locator('[data-testid="line2-input"]').fill(completeOrderData.address.line2);
    await page.locator('[data-testid="city-input"]').fill(completeOrderData.address.city);
    await page.locator('[data-testid="postalCode-input"]').fill(completeOrderData.address.postalCode);
    
    await page.locator('[data-testid="country-select"]').click();
    await page.locator(`[data-value="${completeOrderData.address.country}"]`).click();
    await page.locator('[data-testid="save-address-btn"]').click();
    
    // Verify address saved
    await expect(page.locator('[data-testid="selected-address"]')).toBeVisible();
    
    // Phase 4: Shipping Method Selection
    console.log('🚚 Phase 4: Selecting shipping method...');
    
    await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 15000 });
    const shippingOptions = page.locator('[data-testid="shipping-option"]');
    await expect(shippingOptions).toHaveCount.greaterThan(0);
    
    // Select Aramex shipping
    const aramexOption = shippingOptions.filter({ hasText: /aramex|أرامكس/ }).first();
    if (await aramexOption.isVisible()) {
      await aramexOption.click();
    } else {
      await shippingOptions.first().click();
    }
    
    // Verify shipping cost added to total
    await expect(page.locator('[data-testid="shipping-cost"]')).toBeVisible();
    
    // Phase 5: Payment Processing
    console.log('💳 Phase 5: Processing payment...');
    
    // Fill payment details
    const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]');
    await cardNumberFrame.locator('[name="cardnumber"]').fill(completeOrderData.payment.cardNumber);
    
    const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]');
    await expiryFrame.locator('[name="exp-date"]').fill(completeOrderData.payment.expiry);
    
    const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]');
    await cvcFrame.locator('[name="cvc"]').fill(completeOrderData.payment.cvc);
    
    await page.locator('[data-testid="cardholder-name"]').fill(completeOrderData.payment.name);
    
    // Submit payment
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Wait for payment processing
    await expect(page.locator('[data-testid="payment-processing"]')).toBeVisible();
    
    // Phase 6: Order Confirmation and Quotation
    console.log('📄 Phase 6: Verifying order confirmation and quotation...');
    
    await page.waitForSelector('[data-testid="payment-result"]', { timeout: 30000 });
    await expect(page.locator('[data-testid="payment-result"]')).toHaveAttribute('data-status', 'success');
    
    // Verify quotation created
    await expect(page.locator('[data-testid="quotation-created"]')).toBeVisible();
    const quotationId = await page.locator('[data-testid="quotation-id"]').textContent();
    expect(quotationId).toBeTruthy();
    
    // Verify sales order created
    await expect(page.locator('[data-testid="sales-order-created"]')).toBeVisible();
    const salesOrderId = await page.locator('[data-testid="sales-order-id"]').textContent();
    expect(salesOrderId).toBeTruthy();
    
    // Phase 7: Aramex Shipment Creation
    console.log('📦 Phase 7: Verifying Aramex shipment creation...');
    
    await expect(page.locator('[data-testid="aramex-shipment-created"]')).toBeVisible();
    const awbNumber = await page.locator('[data-testid="awb-number"]').textContent();
    expect(awbNumber).toBeTruthy();
    expect(awbNumber).toMatch(/^\d{10}$/);
    
    // Verify tracking URL
    const trackingUrl = await page.locator('[data-testid="tracking-url"]').getAttribute('href');
    expect(trackingUrl).toContain('aramex.com/track');
    
    // Phase 8: Invoice Generation
    console.log('🧾 Phase 8: Verifying invoice generation...');
    
    await expect(page.locator('[data-testid="invoice-generated"]')).toBeVisible();
    const invoiceNumber = await page.locator('[data-testid="invoice-number"]').textContent();
    expect(invoiceNumber).toMatch(/INV-\d{6}/);
    
    // Phase 9: Order Details Verification
    console.log('✅ Phase 9: Final verification of order details...');
    
    const orderId = await page.locator('[data-testid="order-id"]').textContent();
    
    // Navigate to order details page
    await page.goto(`/dashboard/orders/${orderId}`);
    await page.waitForLoadState('networkidle');
    
    // Verify all order components
    await expect(page.locator('[data-testid="order-status"]')).toContainText(/confirmed|مؤكد/);
    await expect(page.locator('[data-testid="payment-status"]')).toContainText(/paid|مدفوع/);
    await expect(page.locator('[data-testid="shipping-status"]')).toContainText(/processing|قيد المعالجة/);
    
    // Verify customer information
    await expect(page.locator('[data-testid="customer-name"]')).toContainText(completeOrderData.customer.firstName);
    await expect(page.locator('[data-testid="customer-email"]')).toContainText(completeOrderData.customer.email);
    
    // Verify shipping address
    await expect(page.locator('[data-testid="shipping-address"]')).toContainText(completeOrderData.address.line1);
    
    // Verify order items
    const orderItems = page.locator('[data-testid="order-item"]');
    await expect(orderItems).toHaveCount(2);
    
    console.log('🎉 Complete order flow test passed successfully!');
    console.log(`Order ID: ${orderId}`);
    console.log(`Quotation ID: ${quotationId}`);
    console.log(`Sales Order ID: ${salesOrderId}`);
    console.log(`AWB Number: ${awbNumber}`);
    console.log(`Invoice Number: ${invoiceNumber}`);
  });

  test('should handle guest checkout flow completely', async () => {
    console.log('👤 Testing complete guest checkout flow...');
    
    // Ensure guest session
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Add product to cart
    await page.goto('/store/shop');
    await page.waitForLoadState('networkidle');
    
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Proceed to checkout as guest
    await page.locator('[data-testid="cart-counter"]').click();
    await page.locator('[data-testid="guest-checkout-btn"]').click();
    
    // Fill guest information
    await page.locator('[data-testid="guest-email"]').fill('guest@example.com');
    await page.locator('[data-testid="guest-phone"]').fill('+966501234567');
    
    // Complete address and payment
    await fillAddressAndPayment(page, completeOrderData);
    
    // Verify guest order completion
    await page.waitForSelector('[data-testid="guest-order-confirmation"]', { timeout: 30000 });
    await expect(page.locator('[data-testid="guest-order-confirmation"]')).toBeVisible();
    
    const guestOrderId = await page.locator('[data-testid="guest-order-id"]').textContent();
    expect(guestOrderId).toBeTruthy();
    
    console.log('✅ Guest checkout flow completed successfully');
  });

  test('should handle order with coupon and discounts', async () => {
    console.log('🎫 Testing order flow with coupons and discounts...');
    
    // Add products to cart
    await page.goto('/store/shop');
    await page.waitForLoadState('networkidle');
    
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    // Go to checkout
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    
    // Fill basic information
    await fillAddressAndPayment(page, completeOrderData);
    
    // Apply coupon
    await page.locator('[data-testid="coupon-input"]').fill('WELCOME10');
    await page.locator('[data-testid="apply-coupon-btn"]').click();
    
    // Verify coupon applied
    await expect(page.locator('[data-testid="coupon-applied"]')).toBeVisible();
    await expect(page.locator('[data-testid="discount-amount"]')).toBeVisible();
    
    // Complete order
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Verify discount in final order
    await page.waitForSelector('[data-testid="order-confirmation"]', { timeout: 30000 });
    await expect(page.locator('[data-testid="applied-discount"]')).toBeVisible();
    
    console.log('✅ Order with coupon completed successfully');
  });

  test('should handle subscription order flow', async () => {
    console.log('🔄 Testing subscription order flow...');
    
    // Navigate to subscription products
    await page.goto('/store/subscriptions');
    await page.waitForLoadState('networkidle');
    
    // Select subscription product
    const subscriptionCard = page.locator('[data-testid="subscription-card"]').first();
    await subscriptionCard.click();
    
    // Configure subscription
    await page.locator('[data-testid="subscription-frequency"]').selectOption('monthly');
    await page.locator('[data-testid="subscription-quantity"]').fill('2');
    await page.locator('[data-testid="add-subscription-btn"]').click();
    
    // Complete checkout
    await fillAddressAndPayment(page, completeOrderData);
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Verify subscription created
    await page.waitForSelector('[data-testid="subscription-confirmation"]', { timeout: 30000 });
    await expect(page.locator('[data-testid="subscription-id"]')).toBeVisible();
    
    const subscriptionId = await page.locator('[data-testid="subscription-id"]').textContent();
    expect(subscriptionId).toBeTruthy();
    
    console.log('✅ Subscription order completed:', subscriptionId);
  });

  test('should handle international order with customs', async () => {
    console.log('🌍 Testing international order with customs...');
    
    const internationalAddress = {
      ...completeOrderData.address,
      country: 'AE',
      city: 'Dubai'
    };
    
    // Add products and go to checkout
    await page.goto('/store/shop');
    await page.waitForLoadState('networkidle');
    
    const productCard = page.locator('[data-testid="product-card"]').first();
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    
    await page.goto('/store/checkout');
    await page.waitForLoadState('networkidle');
    
    // Fill international address
    await fillCustomerInfo(page, completeOrderData.customer);
    await fillAddress(page, internationalAddress);
    
    // Verify customs information required
    await expect(page.locator('[data-testid="customs-declaration"]')).toBeVisible();
    
    // Fill customs details
    await page.locator('[data-testid="customs-description"]').fill('Coffee beans');
    await page.locator('[data-testid="customs-value"]').fill('100');
    await page.locator('[data-testid="customs-weight"]').fill('1');
    
    // Complete payment
    await fillPaymentInfo(page, completeOrderData.payment);
    await page.locator('[data-testid="place-order-btn"]').click();
    
    // Verify international shipping
    await page.waitForSelector('[data-testid="international-order-confirmation"]', { timeout: 30000 });
    await expect(page.locator('[data-testid="customs-info"]')).toBeVisible();
    
    console.log('✅ International order with customs completed');
  });
});

// Helper functions
async function fillAddressAndPayment(page: Page, orderData: any) {
  await fillCustomerInfo(page, orderData.customer);
  await fillAddress(page, orderData.address);
  await selectShipping(page);
  await fillPaymentInfo(page, orderData.payment);
}

async function fillCustomerInfo(page: Page, customer: any) {
  await page.locator('[data-testid="firstName-input"]').fill(customer.firstName);
  await page.locator('[data-testid="lastName-input"]').fill(customer.lastName);
  await page.locator('[data-testid="email-input"]').fill(customer.email);
  await page.locator('[data-testid="phone-input"]').fill(customer.phone);
}

async function fillAddress(page: Page, address: any) {
  await page.locator('[data-testid="line1-input"]').fill(address.line1);
  if (address.line2) {
    await page.locator('[data-testid="line2-input"]').fill(address.line2);
  }
  await page.locator('[data-testid="city-input"]').fill(address.city);
  if (address.postalCode) {
    await page.locator('[data-testid="postalCode-input"]').fill(address.postalCode);
  }
  await page.locator('[data-testid="country-select"]').click();
  await page.locator(`[data-value="${address.country}"]`).click();
  await page.locator('[data-testid="save-address-btn"]').click();
}

async function selectShipping(page: Page) {
  await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 15000 });
  await page.locator('[data-testid="shipping-option"]').first().click();
}

async function fillPaymentInfo(page: Page, payment: any) {
  const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]');
  await cardNumberFrame.locator('[name="cardnumber"]').fill(payment.cardNumber);
  
  const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]');
  await expiryFrame.locator('[name="exp-date"]').fill(payment.expiry);
  
  const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]');
  await cvcFrame.locator('[name="cvc"]').fill(payment.cvc);
  
  await page.locator('[data-testid="cardholder-name"]').fill(payment.name);
}

export const CompleteOrderFlowHelpers = {
  completeOrderData,
  fillAddressAndPayment,
  fillCustomerInfo,
  fillAddress,
  selectShipping,
  fillPaymentInfo
};