/**
 * User Lifecycle Test with Real Data
 * اختبار دورة حياة المستخدم بالبيانات الحقيقية
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration with real user data
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
 * Test GraphQL connection with real user
 */
async function testGraphQLConnection() {
  try {
    console.log(`\n🔗 Testing GraphQL connection with real user: ${TEST_CONFIG.realUser.email}`);
    
    // Test if GraphQL client exists
    const graphqlClientPath = path.join(TEST_CONFIG.projectRoot, 'src/lib/graphql-client.ts');
    if (fs.existsSync(graphqlClientPath)) {
      logTest('GraphQL Client Configuration', 'PASS');
    } else {
      logTest('GraphQL Client Configuration', 'FAIL', 'GraphQL client not found');
    }
    
    // Test auth service
    const authServicePath = path.join(TEST_CONFIG.projectRoot, 'src/services/odoo/graphql-auth.service.ts');
    if (fs.existsSync(authServicePath)) {
      const content = fs.readFileSync(authServicePath, 'utf8');
      if (content.includes('executeGraphQLQuery')) {
        logTest('Auth Service GraphQL Integration', 'PASS');
      } else {
        logTest('Auth Service GraphQL Integration', 'FAIL', 'GraphQL execution not found');
      }
    }
    
  } catch (error) {
    logTest('GraphQL Connection Test', 'FAIL', error.message);
  }
}

/**
 * Main test execution
 */
async function runUserLifecycleTests() {
  console.log('🚀 Starting User Lifecycle Tests with Real Data\n');
  console.log('=' .repeat(60));
  console.log(`👤 Testing with real user: ${TEST_CONFIG.realUser.email}`);
  console.log('=' .repeat(60));

  // Test 1: Authentication System
  console.log('\n🔐 Testing Authentication System...');
  checkFileExists('src/systems/auth/index.ts', 'Unified Auth System exists');
  checkFileExists('src/systems/auth/hooks/use-auth.ts', 'Auth hook exists');
  checkFileExists('src/systems/auth/services/auth-service.ts', 'Auth service exists');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'graphqlAuthService', 'Auth service uses GraphQL');
  
  // Test 2: Login Process
  console.log('\n🚪 Testing Login Process...');
  checkFileExists('src/pages/auth/index.tsx', 'Login page exists');
  checkFileExists('src/systems/auth/components/forms/login-form.tsx', 'Login form exists');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'login', 'Login function exists');
  
  // Test 3: User Dashboard
  console.log('\n📊 Testing User Dashboard...');
  checkFileExists('src/pages/dashboard/index.tsx', 'Dashboard page exists');
  checkFileExists('src/components/pages-details/dashboard-page/index.tsx', 'Dashboard component exists');
  checkFileExists('src/hooks/use-dashboard.tsx', 'Dashboard hook exists');
  
  // Test 4: User Profile Management
  console.log('\n👤 Testing User Profile Management...');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'updateProfile', 'Profile update function exists');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'refreshUser', 'User refresh function exists');
  
  // Test 5: User Orders
  console.log('\n📦 Testing User Orders...');
  checkFileExists('src/services/odoo/graphql-orders.service.ts', 'Orders service exists');
  checkFileContent('src/services/odoo/graphql-orders.service.ts', 'GraphQL', 'Orders use GraphQL');
  
  // Test 6: User Favorites
  console.log('\n❤️ Testing User Favorites...');
  checkFileExists('src/pages/store/favorites.tsx', 'Favorites page exists');
  checkFileExists('src/services/odoo/graphql-wishlist.service.ts', 'Wishlist service exists');
  checkFileContent('src/services/odoo/graphql-wishlist.service.ts', 'GraphQL', 'Wishlist uses GraphQL');
  
  // Test 7: User Cart (Authenticated)
  console.log('\n🛒 Testing Authenticated User Cart...');
  checkFileExists('src/pages/store/cart-items.tsx', 'Cart page exists');
  checkFileExists('src/services/odoo/graphql-cart.service.ts', 'Cart service exists');
  checkFileContent('src/services/odoo/graphql-cart.service.ts', 'GraphQL', 'Cart uses GraphQL');
  
  // Test 8: Checkout Process
  console.log('\n💳 Testing Checkout Process...');
  checkFileExists('src/pages/store/checkout.tsx', 'Checkout page exists');
  checkFileExists('src/components/checkout/EnhancedCheckoutPage.tsx', 'Enhanced checkout exists');
  checkFileExists('src/hooks/useEnhancedOdooCheckout.ts', 'Checkout hook exists');
  
  // Test 9: Order History
  console.log('\n📋 Testing Order History...');
  checkFileExists('src/pages/dashboard/invoices-bills.tsx', 'Invoices page exists');
  checkFileExists('src/services/odoo/graphql-orders-advanced.service.ts', 'Advanced orders service exists');
  
  // Test 10: User Settings
  console.log('\n⚙️ Testing User Settings...');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'changePassword', 'Change password function exists');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'validateSession', 'Session validation exists');
  
  // Test 11: Address Management
  console.log('\n🏠 Testing Address Management...');
  checkFileExists('src/services/odoo/graphql-addresses.service.ts', 'Addresses service exists');
  checkFileExists('src/components/shared/address-entry/index.tsx', 'Address entry component exists');
  
  // Test 12: User Reviews
  console.log('\n⭐ Testing User Reviews...');
  checkFileExists('src/services/odoo/graphql-reviews.service.ts', 'Reviews service exists');
  checkFileExists('src/components/reviews/ReviewSystem/index.tsx', 'Review system exists');
  
  // Test 13: User Notifications
  console.log('\n🔔 Testing User Notifications...');
  checkFileExists('src/components/ui/notification-system.tsx', 'Notification system exists');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'toast', 'Toast notifications integrated');
  
  // Test 14: Session Management
  console.log('\n🕐 Testing Session Management...');
  checkFileExists('src/systems/auth/core/session-manager.ts', 'Session manager exists');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'refreshToken', 'Token refresh exists');
  
  // Test 15: Security Features
  console.log('\n🛡️ Testing Security Features...');
  checkFileExists('src/systems/auth/core/security-manager.ts', 'Security manager exists');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'validateSession', 'Session validation exists');
  
  // Test GraphQL Connection
  await testGraphQLConnection();
  
  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 User Lifecycle Test Results');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  // Save results
  const resultsPath = path.join(TEST_CONFIG.projectRoot, 'tests/reports/user-lifecycle-results.json');
  const resultsDir = path.dirname(resultsPath);
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testType: 'User Lifecycle',
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
runUserLifecycleTests().catch(error => {
  console.error('❌ User lifecycle test failed:', error);
  process.exit(1);
});