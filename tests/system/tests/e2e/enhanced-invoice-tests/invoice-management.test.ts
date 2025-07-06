/**
 * Enhanced Invoice Management Tests - Coffee Selection E2E
 * اختبارات إدارة الفواتير المحسنة - اختبارات شاملة لنظام الفواتير
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Enhanced Invoice Management - إدارة الفواتير المحسنة', () => {
  let page: Page;

  const testOrder = {
    items: [
      { name: 'قهوة عربية مختصة', price: 85.00, quantity: 2 },
      { name: 'قهوة كولومبية', price: 95.00, quantity: 1 }
    ],
    subtotal: 265.00,
    tax: 39.75, // 15% VAT
    shipping: 25.00,
    total: 329.75
  };

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Login as authenticated user
    await page.goto('/auth/login');
    await page.locator('[data-testid="email-input"]').fill('test@coffeeselection.com');
    await page.locator('[data-testid="password-input"]').fill('testpassword');
    await page.locator('[data-testid="login-btn"]').click();
    await page.waitForURL('/dashboard');
  });

  test('should generate invoice after successful order completion', async () => {
    // Step 1: Create a completed order
    const orderId = await createCompletedOrder(page, testOrder);
    
    // Step 2: Navigate to order details
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 3: Verify invoice generation
    await expect(page.locator('[data-testid="invoice-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="invoice-number"]')).toBeVisible();
    
    const invoiceNumber = await page.locator('[data-testid="invoice-number"]').textContent();
    expect(invoiceNumber).toMatch(/INV-\d{6}/); // Invoice number format
    
    // Step 4: Verify invoice details
    await expect(page.locator('[data-testid="invoice-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="invoice-due-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="invoice-status"]')).toContainText(/paid|مدفوع/);
    
    console.log('✅ Invoice generated successfully:', invoiceNumber);
  });

  test('should display correct invoice calculations', async () => {
    // Step 1: Create order and navigate to invoice
    const orderId = await createCompletedOrder(page, testOrder);
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 2: Verify line items
    const invoiceItems = page.locator('[data-testid="invoice-item"]');
    await expect(invoiceItems).toHaveCount(testOrder.items.length);
    
    // Step 3: Verify each line item
    for (let i = 0; i < testOrder.items.length; i++) {
      const item = invoiceItems.nth(i);
      const expectedItem = testOrder.items[i];
      
      await expect(item.locator('[data-testid="item-name"]')).toContainText(expectedItem.name);
      await expect(item.locator('[data-testid="item-quantity"]')).toContainText(expectedItem.quantity.toString());
      await expect(item.locator('[data-testid="item-price"]')).toContainText(expectedItem.price.toString());
      
      const lineTotal = expectedItem.price * expectedItem.quantity;
      await expect(item.locator('[data-testid="item-total"]')).toContainText(lineTotal.toString());
    }
    
    // Step 4: Verify totals
    await verifyInvoiceTotals(page, testOrder);
    
    console.log('✅ Invoice calculations verified correctly');
  });

  test('should handle VAT calculation for Saudi Arabia', async () => {
    // Step 1: Create order with Saudi address
    const saudiOrder = { ...testOrder };
    const orderId = await createCompletedOrder(page, saudiOrder, 'SA');
    
    // Step 2: Navigate to invoice
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 3: Verify VAT calculation (15% for Saudi Arabia)
    const vatAmount = await getNumericValue(page, '[data-testid="invoice-vat"]');
    const expectedVat = testOrder.subtotal * 0.15;
    
    expect(Math.abs(vatAmount - expectedVat)).toBeLessThan(0.01);
    
    // Step 4: Verify VAT number display
    await expect(page.locator('[data-testid="company-vat-number"]')).toBeVisible();
    await expect(page.locator('[data-testid="company-vat-number"]')).toContainText(/\d{15}/);
    
    console.log('✅ VAT calculation for Saudi Arabia verified');
  });

  test('should generate PDF invoice for download', async () => {
    // Step 1: Create order and navigate to invoice
    const orderId = await createCompletedOrder(page, testOrder);
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 2: Generate PDF invoice
    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-testid="download-invoice-btn"]').click();
    
    // Step 3: Verify PDF download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/invoice.*\.pdf$/i);
    
    // Step 4: Verify download size (should be reasonable)
    const downloadPath = await download.path();
    if (downloadPath) {
      const fs = require('fs');
      const stats = fs.statSync(downloadPath);
      expect(stats.size).toBeGreaterThan(1000); // At least 1KB
      expect(stats.size).toBeLessThan(1000000); // Less than 1MB
    }
    
    console.log('✅ PDF invoice generated and downloaded');
  });

  test('should send invoice via email', async () => {
    // Step 1: Create order and navigate to invoice
    const orderId = await createCompletedOrder(page, testOrder);
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 2: Send invoice via email
    await page.locator('[data-testid="send-invoice-btn"]').click();
    
    // Step 3: Fill email details
    await page.locator('[data-testid="recipient-email"]').fill('customer@example.com');
    await page.locator('[data-testid="email-subject"]').fill('فاتورة طلبكم من Coffee Selection');
    await page.locator('[data-testid="email-message"]').fill('نشكركم لاختياركم Coffee Selection');
    
    // Step 4: Send email
    await page.locator('[data-testid="send-email-btn"]').click();
    
    // Step 5: Verify email sent confirmation
    await expect(page.locator('[data-testid="email-sent-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-sent-confirmation"]')).toContainText(/sent|تم الإرسال/);
    
    console.log('✅ Invoice sent via email successfully');
  });

  test('should display invoice history and status tracking', async () => {
    // Step 1: Navigate to invoices page
    await page.goto('/dashboard/invoices-bills');
    
    // Step 2: Verify invoices list
    await expect(page.locator('[data-testid="invoices-list"]')).toBeVisible();
    
    // Step 3: Check invoice filters
    await page.locator('[data-testid="status-filter"]').selectOption('paid');
    await page.locator('[data-testid="date-filter-from"]').fill('2024-01-01');
    await page.locator('[data-testid="date-filter-to"]').fill('2024-12-31');
    await page.locator('[data-testid="apply-filters-btn"]').click();
    
    // Step 4: Verify filtered results
    const invoiceRows = page.locator('[data-testid="invoice-row"]');
    if (await invoiceRows.count() > 0) {
      const firstInvoice = invoiceRows.first();
      await expect(firstInvoice.locator('[data-testid="invoice-status"]')).toContainText(/paid|مدفوع/);
    }
    
    // Step 5: Test sorting
    await page.locator('[data-testid="sort-by-date"]').click();
    await page.waitForTimeout(1000);
    
    console.log('✅ Invoice history and filtering working');
  });

  test('should handle invoice refunds and credit notes', async () => {
    // Step 1: Create paid order
    const orderId = await createCompletedOrder(page, testOrder);
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 2: Process refund
    await page.locator('[data-testid="process-refund-btn"]').click();
    
    // Step 3: Fill refund details
    await page.locator('[data-testid="refund-amount"]').fill('100.00');
    await page.locator('[data-testid="refund-reason"]').fill('منتج معيب');
    await page.locator('[data-testid="confirm-refund-btn"]').click();
    
    // Step 4: Verify credit note creation
    await expect(page.locator('[data-testid="credit-note-created"]')).toBeVisible();
    
    const creditNoteNumber = await page.locator('[data-testid="credit-note-number"]').textContent();
    expect(creditNoteNumber).toMatch(/CN-\d{6}/);
    
    // Step 5: Verify invoice status updated
    await expect(page.locator('[data-testid="invoice-status"]')).toContainText(/partially refunded|مسترد جزئياً/);
    
    console.log('✅ Refund and credit note processed:', creditNoteNumber);
  });

  test('should handle recurring invoice generation', async () => {
    // Step 1: Navigate to subscription orders
    await page.goto('/dashboard/subscriptions');
    
    // Step 2: Create subscription order
    await page.locator('[data-testid="create-subscription-btn"]').click();
    await page.locator('[data-testid="subscription-product"]').selectOption('monthly-coffee-box');
    await page.locator('[data-testid="billing-frequency"]').selectOption('monthly');
    await page.locator('[data-testid="create-subscription-confirm"]').click();
    
    // Step 3: Verify recurring invoice setup
    await expect(page.locator('[data-testid="recurring-invoice-setup"]')).toBeVisible();
    
    const nextInvoiceDate = await page.locator('[data-testid="next-invoice-date"]').textContent();
    expect(nextInvoiceDate).toBeTruthy();
    
    console.log('✅ Recurring invoice setup completed');
  });

  test('should export invoices in different formats', async () => {
    // Step 1: Navigate to invoices page
    await page.goto('/dashboard/invoices-bills');
    
    // Step 2: Select invoices for export
    const invoiceCheckboxes = page.locator('[data-testid="invoice-checkbox"]');
    const checkboxCount = await invoiceCheckboxes.count();
    
    for (let i = 0; i < Math.min(3, checkboxCount); i++) {
      await invoiceCheckboxes.nth(i).check();
    }
    
    // Step 3: Export as Excel
    const excelDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-testid="export-format"]').selectOption('excel');
    await page.locator('[data-testid="export-invoices-btn"]').click();
    
    const excelDownload = await excelDownloadPromise;
    expect(excelDownload.suggestedFilename()).toMatch(/\.xlsx?$/);
    
    // Step 4: Export as CSV
    const csvDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-testid="export-format"]').selectOption('csv');
    await page.locator('[data-testid="export-invoices-btn"]').click();
    
    const csvDownload = await csvDownloadPromise;
    expect(csvDownload.suggestedFilename()).toMatch(/\.csv$/);
    
    console.log('✅ Invoice export in multiple formats working');
  });

  test('should handle invoice payment reminders', async () => {
    // Step 1: Create unpaid invoice (simulate)
    await page.goto('/dashboard/invoices-bills');
    
    // Step 2: Find unpaid invoice
    const unpaidInvoice = page.locator('[data-testid="invoice-row"]').filter({ hasText: /unpaid|غير مدفوع/ }).first();
    
    if (await unpaidInvoice.isVisible()) {
      // Step 3: Send payment reminder
      await unpaidInvoice.locator('[data-testid="send-reminder-btn"]').click();
      
      // Step 4: Configure reminder
      await page.locator('[data-testid="reminder-template"]').selectOption('friendly');
      await page.locator('[data-testid="reminder-days"]').fill('7');
      await page.locator('[data-testid="send-reminder-confirm"]').click();
      
      // Step 5: Verify reminder sent
      await expect(page.locator('[data-testid="reminder-sent-confirmation"]')).toBeVisible();
    }
    
    console.log('✅ Payment reminder functionality working');
  });

  test('should integrate with accounting systems', async () => {
    // Step 1: Navigate to accounting integration
    await page.goto('/dashboard/settings/accounting');
    
    // Step 2: Configure integration
    await page.locator('[data-testid="accounting-system"]').selectOption('quickbooks');
    await page.locator('[data-testid="api-key"]').fill('test-api-key');
    await page.locator('[data-testid="save-integration-btn"]').click();
    
    // Step 3: Test sync
    await page.locator('[data-testid="sync-invoices-btn"]').click();
    
    // Step 4: Verify sync status
    await expect(page.locator('[data-testid="sync-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="sync-status"]')).toContainText(/success|نجح|completed|مكتمل/);
    
    console.log('✅ Accounting system integration working');
  });

  test('should handle multi-currency invoices', async () => {
    // Step 1: Create order with different currency
    const usdOrder = { ...testOrder, currency: 'USD' };
    const orderId = await createCompletedOrder(page, usdOrder, 'US');
    
    // Step 2: Navigate to invoice
    await page.goto(`/dashboard/orders/${orderId}`);
    
    // Step 3: Verify currency display
    await expect(page.locator('[data-testid="invoice-currency"]')).toContainText('USD');
    
    // Step 4: Verify exchange rate information
    const exchangeRateInfo = page.locator('[data-testid="exchange-rate-info"]');
    if (await exchangeRateInfo.isVisible()) {
      await expect(exchangeRateInfo).toContainText(/rate|سعر الصرف/);
    }
    
    // Step 5: Verify amounts in both currencies
    await expect(page.locator('[data-testid="amount-usd"]')).toBeVisible();
    await expect(page.locator('[data-testid="amount-sar"]')).toBeVisible();
    
    console.log('✅ Multi-currency invoice handling working');
  });
});

// Helper functions for invoice tests
async function createCompletedOrder(page: Page, orderData: any, country: string = 'SA'): Promise<string> {
  // Navigate to shop and add products
  await page.goto('/store/shop');
  await page.waitForLoadState('networkidle');
  
  // Add products to cart
  for (let i = 0; i < orderData.items.length; i++) {
    const productCard = page.locator('[data-testid="product-card"]').nth(i);
    await productCard.locator('[data-testid="add-to-cart-btn"]').click();
    await page.waitForTimeout(500);
  }
  
  // Go to checkout
  await page.goto('/store/checkout');
  await page.waitForLoadState('networkidle');
  
  // Fill address
  await page.locator('[data-testid="firstName-input"]').fill('أحمد');
  await page.locator('[data-testid="lastName-input"]').fill('محمد');
  await page.locator('[data-testid="line1-input"]').fill('شارع الملك فهد 123');
  await page.locator('[data-testid="city-input"]').fill('الرياض');
  await page.locator('[data-testid="phone-input"]').fill('+966501234567');
  await page.locator('[data-testid="country-select"]').click();
  await page.locator(`[data-value="${country}"]`).click();
  await page.locator('[data-testid="save-address-btn"]').click();
  
  // Select shipping
  await page.waitForSelector('[data-testid="shipping-options"]', { timeout: 10000 });
  await page.locator('[data-testid="shipping-option"]').first().click();
  
  // Complete payment
  const cardNumberFrame = page.frameLocator('[data-testid="card-number-frame"]');
  await cardNumberFrame.locator('[name="cardnumber"]').fill('4242424242424242');
  
  const expiryFrame = page.frameLocator('[data-testid="card-expiry-frame"]');
  await expiryFrame.locator('[name="exp-date"]').fill('12/25');
  
  const cvcFrame = page.frameLocator('[data-testid="card-cvc-frame"]');
  await cvcFrame.locator('[name="cvc"]').fill('123');
  
  await page.locator('[data-testid="cardholder-name"]').fill('Test User');
  await page.locator('[data-testid="place-order-btn"]').click();
  
  // Wait for order completion
  await page.waitForSelector('[data-testid="order-confirmation"]', { timeout: 30000 });
  
  // Get order ID
  const orderId = await page.locator('[data-testid="order-id"]').textContent();
  return orderId || '';
}

async function verifyInvoiceTotals(page: Page, expectedTotals: any) {
  const subtotal = await getNumericValue(page, '[data-testid="invoice-subtotal"]');
  const tax = await getNumericValue(page, '[data-testid="invoice-tax"]');
  const shipping = await getNumericValue(page, '[data-testid="invoice-shipping"]');
  const total = await getNumericValue(page, '[data-testid="invoice-total"]');
  
  expect(Math.abs(subtotal - expectedTotals.subtotal)).toBeLessThan(0.01);
  expect(Math.abs(tax - expectedTotals.tax)).toBeLessThan(0.01);
  expect(Math.abs(shipping - expectedTotals.shipping)).toBeLessThan(0.01);
  expect(Math.abs(total - expectedTotals.total)).toBeLessThan(0.01);
}

async function getNumericValue(page: Page, selector: string): Promise<number> {
  const element = page.locator(selector);
  if (await element.isVisible()) {
    const text = await element.textContent();
    return parseFloat(text?.replace(/[^\d.]/g, '') || '0');
  }
  return 0;
}

export const InvoiceTestHelpers = {
  testOrder,
  createCompletedOrder,
  verifyInvoiceTotals,
  getNumericValue
};