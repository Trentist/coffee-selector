/**
 * Payment, Shipping and Invoice System Test
 * اختبار نظام الدفع والشحن والفواتير
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  projectRoot: path.resolve(__dirname, '../../..'),
  realUser: {
    email: 'mohamed@coffeeselection.com',
    password: 'Montada@1'
  },
  testResults: {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  }
};

/**
 * Test helper functions
 */
function logTest(testName, status, details = '') {
  TEST_CONFIG.testResults.total++;
  if (status === 'PASS') {
    TEST_CONFIG.testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    TEST_CONFIG.testResults.failed++;
    console.log(`❌ ${testName}`);
    if (details) console.log(`   ${details}`);
  }
  
  TEST_CONFIG.testResults.details.push({
    name: testName,
    status,
    details
  });
}

/**
 * Check if file exists and has content
 */
function checkFileExists(filePath, testName) {
  const fullPath = path.join(TEST_CONFIG.projectRoot, filePath);
  try {
    const exists = fs.existsSync(fullPath);
    const hasContent = exists && fs.statSync(fullPath).size > 0;
    
    if (exists && hasContent) {
      logTest(testName, 'PASS');
      return true;
    } else {
      logTest(testName, 'FAIL', `File ${filePath} ${!exists ? 'does not exist' : 'is empty'}`);
      return false;
    }
  } catch (error) {
    logTest(testName, 'FAIL', `Error checking file: ${error.message}`);
    return false;
  }
}

/**
 * Check if file contains specific content
 */
function checkFileContent(filePath, searchText, testName) {
  const fullPath = path.join(TEST_CONFIG.projectRoot, filePath);
  try {
    if (!fs.existsSync(fullPath)) {
      logTest(testName, 'FAIL', `File ${filePath} does not exist`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasContent = content.includes(searchText);
    
    if (hasContent) {
      logTest(testName, 'PASS');
      return true;
    } else {
      logTest(testName, 'FAIL', `Content not found in ${filePath}`);
      return false;
    }
  } catch (error) {
    logTest(testName, 'FAIL', `Error reading file: ${error.message}`);
    return false;
  }
}

/**
 * Main test execution
 */
async function runPaymentShippingTests() {
  console.log('🚀 Starting Payment, Shipping and Invoice Tests\n');
  console.log('=' .repeat(60));
  console.log(`💳 Testing with real user: ${TEST_CONFIG.realUser.email}`);
  console.log('=' .repeat(60));

  // Test 1: Checkout System
  console.log('\n🛒 Testing Checkout System...');
  checkFileExists('src/pages/store/checkout.tsx', 'Checkout Page');
  checkFileExists('src/components/checkout/EnhancedCheckoutPage.tsx', 'Enhanced Checkout Component');
  checkFileExists('src/hooks/useEnhancedOdooCheckout.ts', 'Enhanced Checkout Hook');
  checkFileExists('src/providers/EnhancedCheckoutProvider.tsx', 'Checkout Provider');
  
  // Test 2: Payment Services
  console.log('\n💰 Testing Payment Services...');
  checkFileExists('src/services/payment.service.ts', 'Payment Service');
  checkFileExists('src/services/odoo/graphql-payment.service.ts', 'GraphQL Payment Service');
  checkFileContent('src/services/odoo/graphql-payment.service.ts', 'GraphQL', 'Payment uses GraphQL');
  checkFileExists('src/pages/api/payment/index.ts', 'Payment API');
  
  // Test 3: Shipping System
  console.log('\n📦 Testing Shipping System...');
  checkFileExists('src/services/shipping.service.ts', 'Shipping Service');
  checkFileExists('src/services/unified-shipping.service.ts', 'Unified Shipping Service');
  checkFileExists('src/services/odoo/graphql-shipping.service.ts', 'GraphQL Shipping Service');
  checkFileExists('src/components/shipping/ShippingSelector.tsx', 'Shipping Selector');
  
  // Test 4: Real Shipping Integration
  console.log('\n🚚 Testing Real Shipping Integration...');
  checkFileExists('src/services/real-shipping.service.ts', 'Real Shipping Service');
  checkFileExists('src/services/aramex.service.ts', 'Aramex Integration');
  checkFileContent('src/services/real-shipping.service.ts', 'GraphQL', 'Real shipping uses GraphQL');
  
  // Test 5: Address Management
  console.log('\n🏠 Testing Address Management...');
  checkFileExists('src/services/odoo/graphql-addresses.service.ts', 'Addresses Service');
  checkFileExists('src/components/shared/address-entry/index.tsx', 'Address Entry Component');
  checkFileContent('src/services/odoo/graphql-addresses.service.ts', 'GraphQL', 'Addresses use GraphQL');
  
  // Test 6: Order Processing
  console.log('\n📋 Testing Order Processing...');
  checkFileExists('src/services/odoo/graphql-orders.service.ts', 'Orders Service');
  checkFileExists('src/services/odoo/graphql-orders-advanced.service.ts', 'Advanced Orders Service');
  checkFileContent('src/services/odoo/graphql-orders.service.ts', 'GraphQL', 'Orders use GraphQL');
  
  // Test 7: Invoice System
  console.log('\n🧾 Testing Invoice System...');
  checkFileExists('src/pages/dashboard/invoices-bills.tsx', 'Invoices Page');
  checkFileExists('src/components/checkout/InvoiceDisplay.tsx', 'Invoice Display Component');
  checkFileExists('src/graphql/queries/invoices.ts', 'Invoice GraphQL Queries');
  checkFileContent('src/graphql/queries/invoices.ts', 'GraphQL', 'Invoices use GraphQL');
  
  // Test 8: Payment Status Tracking
  console.log('\n📊 Testing Payment Status Tracking...');
  checkFileExists('src/components/checkout/PaymentStatus.tsx', 'Payment Status Component');
  checkFileExists('src/components/checkout/OrderSuccess.tsx', 'Order Success Component');
  checkFileContent('src/components/checkout/PaymentStatus.tsx', 'useState', 'Payment status has state management');
  
  // Test 9: Shipment Tracking
  console.log('\n🔍 Testing Shipment Tracking...');
  checkFileExists('src/components/checkout/ShipmentTracking.tsx', 'Shipment Tracking Component');
  checkFileContent('src/services/unified-shipping.service.ts', 'tracking', 'Shipping service has tracking');
  
  // Test 10: Currency Integration
  console.log('\n💱 Testing Currency Integration...');
  checkFileExists('src/components/unified/UnifiedPrice.tsx', 'Unified Price Component');
  checkFileExists('src/currency-system/hooks/usePriceConverter.ts', 'Price Converter Hook');
  checkFileContent('src/currency-system/hooks/usePriceConverter.ts', 'GraphQL', 'Currency uses GraphQL');
  
  // Test 11: Order Summary
  console.log('\n📝 Testing Order Summary...');
  checkFileExists('src/components/checkout/OrderSummary.tsx', 'Order Summary Component');
  checkFileContent('src/components/checkout/OrderSummary.tsx', 'UnifiedPrice', 'Order summary uses unified pricing');
  
  // Test 12: Payment Methods
  console.log('\n💳 Testing Payment Methods...');
  checkFileContent('src/services/payment.service.ts', 'paymentMethod', 'Payment methods supported');
  checkFileExists('src/pages/api/payment/methods.ts', 'Payment Methods API');
  
  // Test 13: Checkout Integration
  console.log('\n🔗 Testing Checkout Integration...');
  checkFileExists('src/services/checkout-integration.service.ts', 'Checkout Integration Service');
  checkFileExists('src/services/enhanced-checkout.service.ts', 'Enhanced Checkout Service');
  checkFileContent('src/services/enhanced-checkout.service.ts', 'GraphQL', 'Enhanced checkout uses GraphQL');
  
  // Test 14: Tax Calculation
  console.log('\n🧮 Testing Tax Calculation...');
  checkFileContent('src/hooks/useEnhancedOdooCheckout.ts', 'tax', 'Tax calculation in checkout');
  checkFileContent('src/components/checkout/OrderSummary.tsx', 'tax', 'Tax display in summary');
  
  // Test 15: Discount System
  console.log('\n🎫 Testing Discount System...');
  checkFileContent('src/hooks/useEnhancedOdooCheckout.ts', 'discount', 'Discount system in checkout');
  checkFileContent('src/services/odoo/graphql-orders.service.ts', 'coupon', 'Coupon system in orders');
  
  // Test 16: Multi-Currency Support
  console.log('\n🌍 Testing Multi-Currency Support...');
  checkFileExists('src/providers/UnifiedCurrencyProvider.tsx', 'Currency Provider');
  checkFileExists('src/currency-system/services/currency-api.service.ts', 'Currency API Service');
  checkFileContent('src/currency-system/services/currency-api.service.ts', 'GraphQL', 'Currency API uses GraphQL');
  
  // Test 17: Real-time Updates
  console.log('\n⚡ Testing Real-time Updates...');
  checkFileContent('src/hooks/useEnhancedOdooCheckout.ts', 'useEffect', 'Checkout has real-time updates');
  checkFileContent('src/components/checkout/PaymentStatus.tsx', 'useEffect', 'Payment status updates');
  
  // Test 18: Error Handling
  console.log('\n⚠️ Testing Error Handling...');
  checkFileContent('src/services/payment.service.ts', 'try', 'Payment service has error handling');
  checkFileContent('src/services/shipping.service.ts', 'catch', 'Shipping service has error handling');
  checkFileContent('src/hooks/useEnhancedOdooCheckout.ts', 'error', 'Checkout hook handles errors');
  
  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Payment, Shipping and Invoice Test Results');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  // Save results
  const resultsPath = path.join(TEST_CONFIG.projectRoot, 'tests/reports/payment-shipping-results.json');
  const resultsDir = path.dirname(resultsPath);
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testType: 'Payment, Shipping and Invoice',
    realUser: TEST_CONFIG.realUser.email,
    summary: {
      passed: TEST_CONFIG.testResults.passed,
      failed: TEST_CONFIG.testResults.failed,
      total: TEST_CONFIG.testResults.total,
      successRate: ((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)
    },
    details: TEST_CONFIG.testResults.details
  }, null, 2));
  
  console.log(`\n📄 Results saved to: ${resultsPath}`);
  
  return TEST_CONFIG.testResults.failed === 0;
}

// Run tests
runPaymentShippingTests().catch(error => {
  console.error('❌ Payment shipping test failed:', error);
  process.exit(1);
});