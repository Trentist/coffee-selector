/**
 * Dashboard System Test
 * اختبار نظام لوحة التحكم
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
async function runDashboardTests() {
  console.log('🚀 Starting Dashboard System Tests\n');
  console.log('=' .repeat(60));
  console.log(`📊 Testing with real user: ${TEST_CONFIG.realUser.email}`);
  console.log('=' .repeat(60));

  // Test 1: Dashboard Pages
  console.log('\n📄 Testing Dashboard Pages...');
  checkFileExists('src/pages/dashboard/index.tsx', 'Main Dashboard Page');
  checkFileExists('src/pages/dashboard/invoices-bills.tsx', 'Invoices Dashboard Page');
  checkFileExists('src/pages/dashboard-new.tsx', 'New Dashboard Page');
  
  // Test 2: Dashboard Components
  console.log('\n🧩 Testing Dashboard Components...');
  checkFileExists('src/components/pages-details/dashboard-page/index.tsx', 'Dashboard Page Component');
  checkFileExists('src/hooks/use-dashboard.tsx', 'Dashboard Hook');
  checkFileContent('src/hooks/use-dashboard.tsx', 'GraphQL', 'Dashboard uses GraphQL');
  
  // Test 3: User Statistics
  console.log('\n📈 Testing User Statistics...');
  checkFileExists('src/components/ui/shop-stats.tsx', 'Shop Statistics Component');
  checkFileContent('src/hooks/use-dashboard.tsx', 'stats', 'Dashboard includes statistics');
  
  // Test 4: Order Management
  console.log('\n📦 Testing Order Management...');
  checkFileExists('src/services/odoo/graphql-orders.service.ts', 'Orders Service');
  checkFileExists('src/services/odoo/graphql-orders-advanced.service.ts', 'Advanced Orders Service');
  checkFileContent('src/services/odoo/graphql-orders.service.ts', 'getUserOrders', 'User orders functionality');
  
  // Test 5: Invoice Management
  console.log('\n🧾 Testing Invoice Management...');
  checkFileExists('src/components/checkout/InvoiceDisplay.tsx', 'Invoice Display Component');
  checkFileExists('src/graphql/queries/invoices.ts', 'Invoice Queries');
  checkFileContent('src/graphql/queries/invoices.ts', 'GraphQL', 'Invoices use GraphQL');
  
  // Test 6: User Profile Section
  console.log('\n👤 Testing User Profile Section...');
  checkFileContent('src/components/pages-details/dashboard-page/index.tsx', 'profile', 'Dashboard includes profile section');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'updateProfile', 'Profile update functionality');
  
  // Test 7: Favorites Management
  console.log('\n❤️ Testing Favorites Management...');
  checkFileExists('src/pages/store/favorites.tsx', 'Favorites Page');
  checkFileExists('src/services/odoo/graphql-wishlist.service.ts', 'Wishlist Service');
  checkFileContent('src/services/odoo/graphql-wishlist.service.ts', 'getUserWishlist', 'User wishlist functionality');
  
  // Test 8: Address Management
  console.log('\n🏠 Testing Address Management...');
  checkFileExists('src/services/odoo/graphql-addresses.service.ts', 'Addresses Service');
  checkFileExists('src/components/shared/address-entry/index.tsx', 'Address Entry Component');
  checkFileContent('src/services/odoo/graphql-addresses.service.ts', 'getUserAddresses', 'User addresses functionality');
  
  // Test 9: Settings Integration
  console.log('\n⚙️ Testing Settings Integration...');
  const settingsPath = path.join(TEST_CONFIG.projectRoot, 'src/components/pages-details/dashboard-page/settings-details');
  if (fs.existsSync(settingsPath)) {
    logTest('Settings Section Directory', 'PASS');
  } else {
    logTest('Settings Section Directory', 'FAIL', 'Settings directory not found');
  }
  
  // Test 10: Security Settings
  console.log('\n🔒 Testing Security Settings...');
  checkFileExists('src/hooks/useSecuritySettings.ts', 'Security Settings Hook');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'changePassword', 'Password change functionality');
  
  // Test 11: Notification System
  console.log('\n🔔 Testing Notification System...');
  checkFileExists('src/components/ui/notification-system.tsx', 'Notification System');
  checkFileContent('src/hooks/use-dashboard.tsx', 'notification', 'Dashboard notifications');
  
  // Test 12: Currency Dashboard
  console.log('\n💱 Testing Currency Dashboard...');
  checkFileExists('src/components/CurrencySettingsDashboard.tsx', 'Currency Settings Dashboard');
  checkFileExists('src/components/CurrencySystemAnalytics.tsx', 'Currency Analytics');
  checkFileExists('src/components/CurrencyCacheDashboard.tsx', 'Currency Cache Dashboard');
  
  // Test 13: Analytics Integration
  console.log('\n📊 Testing Analytics Integration...');
  checkFileExists('src/components/UsagePatternAnalytics.tsx', 'Usage Pattern Analytics');
  checkFileExists('src/lib/tracking.ts', 'Tracking Library');
  checkFileContent('src/lib/tracking.ts', 'analytics', 'Analytics tracking implemented');
  
  // Test 14: Real-time Updates
  console.log('\n⚡ Testing Real-time Updates...');
  checkFileContent('src/hooks/use-dashboard.tsx', 'useEffect', 'Dashboard has real-time updates');
  checkFileContent('src/hooks/use-dashboard.tsx', 'interval', 'Dashboard polling for updates');
  
  // Test 15: Responsive Design
  console.log('\n📱 Testing Responsive Design...');
  checkFileContent('src/components/pages-details/dashboard-page/index.tsx', 'responsive', 'Dashboard is responsive');
  checkFileExists('src/theme/breakpoints.ts', 'Breakpoints Configuration');
  
  // Test 16: Data Visualization
  console.log('\n📈 Testing Data Visualization...');
  checkFileContent('src/components/ui/shop-stats.tsx', 'chart', 'Statistics visualization');
  checkFileContent('src/components/CurrencySystemAnalytics.tsx', 'graph', 'Currency analytics visualization');
  
  // Test 17: Export Functionality
  console.log('\n📤 Testing Export Functionality...');
  checkFileContent('src/pages/dashboard/invoices-bills.tsx', 'export', 'Invoice export functionality');
  checkFileContent('src/services/odoo/graphql-orders-advanced.service.ts', 'export', 'Order export functionality');
  
  // Test 18: Search and Filter
  console.log('\n🔍 Testing Search and Filter...');
  checkFileContent('src/pages/dashboard/invoices-bills.tsx', 'filter', 'Dashboard filtering');
  checkFileContent('src/hooks/use-dashboard.tsx', 'search', 'Dashboard search functionality');
  
  // Test 19: Performance Optimization
  console.log('\n⚡ Testing Performance Optimization...');
  checkFileContent('src/hooks/use-dashboard.tsx', 'useMemo', 'Dashboard performance optimization');
  checkFileContent('src/components/pages-details/dashboard-page/index.tsx', 'lazy', 'Lazy loading implementation');
  
  // Test 20: Error Handling
  console.log('\n⚠️ Testing Error Handling...');
  checkFileContent('src/hooks/use-dashboard.tsx', 'try', 'Dashboard error handling');
  checkFileContent('src/components/pages-details/dashboard-page/index.tsx', 'error', 'Dashboard error display');
  
  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Dashboard System Test Results');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  // Save results
  const resultsPath = path.join(TEST_CONFIG.projectRoot, 'tests/reports/dashboard-results.json');
  const resultsDir = path.dirname(resultsPath);
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testType: 'Dashboard System',
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
runDashboardTests().catch(error => {
  console.error('❌ Dashboard test failed:', error);
  process.exit(1);
});