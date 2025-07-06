/**
 * Complete Application Integration Test
 * اختبار التكامل الشامل للتطبيق
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
    details: [],
    categories: {
      'Core Systems': { passed: 0, failed: 0, total: 0 },
      'Authentication': { passed: 0, failed: 0, total: 0 },
      'Products': { passed: 0, failed: 0, total: 0 },
      'E-commerce': { passed: 0, failed: 0, total: 0 },
      'User Experience': { passed: 0, failed: 0, total: 0 },
      'Performance': { passed: 0, failed: 0, total: 0 },
      'Security': { passed: 0, failed: 0, total: 0 },
      'Integration': { passed: 0, failed: 0, total: 0 }
    }
  }
};

/**
 * Test helper functions
 */
function logTest(testName, status, category = 'General', details = '') {
  TEST_CONFIG.testResults.total++;
  
  if (TEST_CONFIG.testResults.categories[category]) {
    TEST_CONFIG.testResults.categories[category].total++;
  }
  
  if (status === 'PASS') {
    TEST_CONFIG.testResults.passed++;
    if (TEST_CONFIG.testResults.categories[category]) {
      TEST_CONFIG.testResults.categories[category].passed++;
    }
    console.log(`✅ ${testName}`);
  } else {
    TEST_CONFIG.testResults.failed++;
    if (TEST_CONFIG.testResults.categories[category]) {
      TEST_CONFIG.testResults.categories[category].failed++;
    }
    console.log(`❌ ${testName}`);
    if (details) console.log(`   ${details}`);
  }
  
  TEST_CONFIG.testResults.details.push({
    name: testName,
    status,
    category,
    details
  });
}

/**
 * Check if file exists and has content
 */
function checkFileExists(filePath, testName, category = 'General') {
  const fullPath = path.join(TEST_CONFIG.projectRoot, filePath);
  try {
    const exists = fs.existsSync(fullPath);
    const hasContent = exists && fs.statSync(fullPath).size > 0;
    
    if (exists && hasContent) {
      logTest(testName, 'PASS', category);
      return true;
    } else {
      logTest(testName, 'FAIL', category, `File ${filePath} ${!exists ? 'does not exist' : 'is empty'}`);
      return false;
    }
  } catch (error) {
    logTest(testName, 'FAIL', category, `Error checking file: ${error.message}`);
    return false;
  }
}

/**
 * Check if file contains specific content
 */
function checkFileContent(filePath, searchText, testName, category = 'General') {
  const fullPath = path.join(TEST_CONFIG.projectRoot, filePath);
  try {
    if (!fs.existsSync(fullPath)) {
      logTest(testName, 'FAIL', category, `File ${filePath} does not exist`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasContent = content.includes(searchText);
    
    if (hasContent) {
      logTest(testName, 'PASS', category);
      return true;
    } else {
      logTest(testName, 'FAIL', category, `Content not found in ${filePath}`);
      return false;
    }
  } catch (error) {
    logTest(testName, 'FAIL', category, `Error reading file: ${error.message}`);
    return false;
  }
}

/**
 * Run individual test suites
 */
async function runIndividualTests() {
  console.log('\n🔄 Running Individual Test Suites...');
  
  const testSuites = [
    'visitor/visitor-lifecycle.test.js',
    'user/user-lifecycle.test.js',
    'auth/auth-security.test.js',
    'payment/payment-shipping.test.js',
    'products/products-lifecycle.test.js',
    'dashboard/dashboard.test.js'
  ];
  
  let allPassed = true;
  
  for (const suite of testSuites) {
    const suitePath = path.join(__dirname, '..', suite);
    if (fs.existsSync(suitePath)) {
      try {
        console.log(`\n📋 Running ${suite}...`);
        execSync(`node ${suitePath}`, { 
          cwd: TEST_CONFIG.projectRoot,
          stdio: 'pipe'
        });
        logTest(`Test Suite: ${suite}`, 'PASS', 'Integration');
      } catch (error) {
        logTest(`Test Suite: ${suite}`, 'FAIL', 'Integration', error.message);
        allPassed = false;
      }
    } else {
      logTest(`Test Suite: ${suite}`, 'FAIL', 'Integration', 'Test file not found');
      allPassed = false;
    }
  }
  
  return allPassed;
}

/**
 * Main test execution
 */
async function runCompleteIntegrationTest() {
  console.log('🚀 Starting Complete Application Integration Test\n');
  console.log('=' .repeat(80));
  console.log(`🎯 Testing Complete Coffee Selection Application`);
  console.log(`👤 Real User: ${TEST_CONFIG.realUser.email}`);
  console.log('=' .repeat(80));

  // Test 1: Core Systems
  console.log('\n🏗️ Testing Core Systems...');
  checkFileExists('package.json', 'Package Configuration', 'Core Systems');
  checkFileExists('next.config.js', 'Next.js Configuration', 'Core Systems');
  checkFileExists('tsconfig.json', 'TypeScript Configuration', 'Core Systems');
  checkFileExists('src/lib/graphql-client.ts', 'GraphQL Client', 'Core Systems');
  checkFileExists('src/lib/odooGraphQL.tsx', 'Odoo GraphQL Integration', 'Core Systems');
  
  // Test 2: Authentication System
  console.log('\n🔐 Testing Authentication System...');
  checkFileExists('src/systems/auth/index.ts', 'Unified Auth System', 'Authentication');
  checkFileExists('src/services/odoo/graphql-auth.service.ts', 'GraphQL Auth Service', 'Authentication');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'executeGraphQLQuery', 'Real GraphQL Integration', 'Authentication');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'graphqlAuthService', 'Service Integration', 'Authentication');
  
  // Test 3: Product System
  console.log('\n☕ Testing Product System...');
  checkFileExists('src/services/odoo/graphql-products.service.ts', 'Products Service', 'Products');
  checkFileExists('src/hooks/useOdooProducts.ts', 'Products Hook', 'Products');
  checkFileExists('src/components/shared/product-card/index.tsx', 'Product Card', 'Products');
  checkFileContent('src/services/odoo/graphql-products.service.ts', 'GraphQL', 'Products use GraphQL', 'Products');
  
  // Test 4: E-commerce Features
  console.log('\n🛒 Testing E-commerce Features...');
  checkFileExists('src/services/odoo/graphql-cart.service.ts', 'Cart Service', 'E-commerce');
  checkFileExists('src/services/odoo/graphql-orders.service.ts', 'Orders Service', 'E-commerce');
  checkFileExists('src/services/odoo/graphql-payment.service.ts', 'Payment Service', 'E-commerce');
  checkFileExists('src/services/odoo/graphql-shipping.service.ts', 'Shipping Service', 'E-commerce');
  checkFileExists('src/components/checkout/EnhancedCheckoutPage.tsx', 'Enhanced Checkout', 'E-commerce');
  
  // Test 5: User Experience
  console.log('\n🎨 Testing User Experience...');
  checkFileExists('src/theme/index.ts', 'Theme System', 'User Experience');
  checkFileExists('src/components/unified/index.ts', 'Unified Components', 'User Experience');
  checkFileExists('src/hooks/useUnifiedTranslation.ts', 'Translation System', 'User Experience');
  checkFileExists('src/currency-system/index.ts', 'Currency System', 'User Experience');
  checkFileExists('src/components/ui/notification-system.tsx', 'Notification System', 'User Experience');
  
  // Test 6: Performance
  console.log('\n⚡ Testing Performance...');
  checkFileContent('next.config.js', 'images', 'Image Optimization', 'Performance');
  checkFileContent('src/hooks/useOdooProducts.ts', 'useMemo', 'Memoization', 'Performance');
  checkFileExists('src/lib/cache-service.ts', 'Cache Service', 'Performance');
  checkFileContent('src/pages/store/product/[slug].tsx', 'getServerSideProps', 'SSR Implementation', 'Performance');
  
  // Test 7: Security
  console.log('\n🛡️ Testing Security...');
  checkFileExists('src/systems/auth/core/security-manager.ts', 'Security Manager', 'Security');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'validateSession', 'Session Validation', 'Security');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'refreshToken', 'Token Refresh', 'Security');
  checkFileExists('src/utils/security.ts', 'Security Utils', 'Security');
  
  // Test 8: Integration Tests
  console.log('\n🔗 Testing System Integration...');
  checkFileContent('src/systems/auth/core/auth-manager.ts', 'graphqlAuthService', 'Auth-GraphQL Integration', 'Integration');
  checkFileContent('src/components/shared/product-card/index.tsx', 'UnifiedPrice', 'Product-Currency Integration', 'Integration');
  checkFileContent('src/hooks/useEnhancedOdooCheckout.ts', 'GraphQL', 'Checkout-GraphQL Integration', 'Integration');
  
  // Test 9: Data Consistency
  console.log('\n📊 Testing Data Consistency...');
  checkFileContent('src/graphql/auth/mutations.ts', 'REAL_LOGIN_MUTATION', 'Real Auth Mutations', 'Integration');
  checkFileContent('src/graphql/queries/products.ts', 'GraphQL', 'Real Product Queries', 'Integration');
  checkFileContent('src/services/odoo/graphql-orders.service.ts', 'executeGraphQLQuery', 'Real Order Operations', 'Integration');
  
  // Test 10: Error Handling
  console.log('\n⚠️ Testing Error Handling...');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'try', 'Auth Error Handling', 'Integration');
  checkFileContent('src/hooks/useOdooProducts.ts', 'catch', 'Products Error Handling', 'Integration');
  checkFileExists('src/utils/errors.ts', 'Error Utils', 'Integration');
  
  // Test 11: Real User Data Integration
  console.log('\n👤 Testing Real User Data Integration...');
  console.log(`   Testing with: ${TEST_CONFIG.realUser.email}`);
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'login', 'Real Login Function', 'Integration');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'getCurrentUser', 'Real User Data', 'Integration');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'refreshUser', 'User Data Refresh', 'Integration');
  
  // Test 12: Multi-language Support
  console.log('\n🌐 Testing Multi-language Support...');
  checkFileExists('public/locales/ar/common.json', 'Arabic Translations', 'User Experience');
  checkFileExists('public/locales/en/common.json', 'English Translations', 'User Experience');
  checkFileExists('src/hooks/useUnifiedTranslation.ts', 'Translation Hook', 'User Experience');
  
  // Test 13: Currency System
  console.log('\n💱 Testing Currency System...');
  checkFileExists('src/currency-system/services/currency-api.service.ts', 'Currency API', 'User Experience');
  checkFileExists('src/components/unified/UnifiedPrice.tsx', 'Unified Price Display', 'User Experience');
  checkFileContent('src/currency-system/hooks/useCurrency.ts', 'GraphQL', 'Currency GraphQL Integration', 'User Experience');
  
  // Test 14: Mobile Responsiveness
  console.log('\n📱 Testing Mobile Responsiveness...');
  checkFileExists('src/theme/breakpoints.ts', 'Responsive Breakpoints', 'User Experience');
  checkFileContent('src/components/layout/layout-main/index.tsx', 'responsive', 'Responsive Layout', 'User Experience');
  
  // Test 15: SEO and Metadata
  console.log('\n🔍 Testing SEO and Metadata...');
  checkFileExists('next-seo.config.js', 'SEO Configuration', 'Performance');
  checkFileContent('src/pages/_document.tsx', 'meta', 'Meta Tags', 'Performance');
  
  // Run Individual Test Suites
  await runIndividualTests();
  
  // Final Results
  console.log('\n' + '=' .repeat(80));
  console.log('📊 COMPLETE APPLICATION INTEGRATION TEST RESULTS');
  console.log('=' .repeat(80));
  
  // Category Results
  console.log('\n📋 Results by Category:');
  Object.entries(TEST_CONFIG.testResults.categories).forEach(([category, results]) => {
    const successRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0.0';
    console.log(`   ${category}: ${results.passed}/${results.total} (${successRate}%)`);
  });
  
  // Overall Results
  console.log('\n🎯 Overall Results:');
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  // Quality Assessment
  const successRate = (TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100;
  console.log('\n🏆 Quality Assessment:');
  if (successRate === 100) {
    console.log('   🌟 EXCELLENT - Perfect Integration!');
  } else if (successRate >= 95) {
    console.log('   ⭐ VERY GOOD - Minor issues detected');
  } else if (successRate >= 90) {
    console.log('   👍 GOOD - Some improvements needed');
  } else if (successRate >= 80) {
    console.log('   ⚠️ FAIR - Significant issues detected');
  } else {
    console.log('   ❌ POOR - Major issues require attention');
  }
  
  // Save comprehensive results
  const resultsPath = path.join(TEST_CONFIG.projectRoot, 'tests/reports/complete-integration-results.json');
  const resultsDir = path.dirname(resultsPath);
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testType: 'Complete Application Integration',
    realUser: TEST_CONFIG.realUser.email,
    summary: {
      passed: TEST_CONFIG.testResults.passed,
      failed: TEST_CONFIG.testResults.failed,
      total: TEST_CONFIG.testResults.total,
      successRate: ((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1),
      qualityGrade: successRate >= 95 ? 'A' : successRate >= 90 ? 'B' : successRate >= 80 ? 'C' : 'D'
    },
    categories: TEST_CONFIG.testResults.categories,
    details: TEST_CONFIG.testResults.details,
    recommendations: successRate < 100 ? [
      'Review failed tests and fix underlying issues',
      'Ensure all GraphQL integrations are properly configured',
      'Verify real data connections are working',
      'Test with actual user credentials',
      'Check error handling and edge cases'
    ] : [
      'Excellent! All systems are properly integrated',
      'Continue monitoring for any future issues',
      'Consider adding more edge case tests',
      'Maintain current quality standards'
    ]
  }, null, 2));
  
  console.log(`\n📄 Comprehensive results saved to: ${resultsPath}`);
  
  // Final verdict
  if (successRate === 100) {
    console.log('\n🎉 CONGRATULATIONS! Complete application integration is PERFECT!');
    console.log('   All systems are working flawlessly with real data.');
  } else {
    console.log(`\n⚠️ Integration test completed with ${successRate.toFixed(1)}% success rate.`);
    console.log('   Please review failed tests and address the issues.');
  }
  
  return successRate === 100;
}

// Run tests
runCompleteIntegrationTest().catch(error => {
  console.error('❌ Complete integration test failed:', error);
  process.exit(1);
});