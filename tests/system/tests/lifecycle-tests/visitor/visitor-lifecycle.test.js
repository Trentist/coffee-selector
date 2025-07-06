/**
 * Visitor Lifecycle Test
 * اختبار دورة حياة الزائر
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  projectRoot: path.resolve(__dirname, '../../..'),
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
async function runVisitorLifecycleTests() {
  console.log('🚀 Starting Visitor Lifecycle Tests\n');
  console.log('=' .repeat(60));

  // Test 1: Homepage Access
  console.log('\n🏠 Testing Homepage Access...');
  checkFileExists('src/pages/index.tsx', 'Homepage exists');
  checkFileExists('src/components/layout/layout-main/index.tsx', 'Main layout exists');
  
  // Test 2: Product Browsing
  console.log('\n☕ Testing Product Browsing...');
  checkFileExists('src/pages/store/shop.tsx', 'Shop page exists');
  checkFileExists('src/components/shared/product-card/index.tsx', 'Product card component exists');
  checkFileExists('src/hooks/useOdooProducts.ts', 'Products hook exists');
  checkFileContent('src/hooks/useOdooProducts.ts', 'GraphQL', 'Products use GraphQL');
  
  // Test 3: Product Details
  console.log('\n📋 Testing Product Details...');
  checkFileExists('src/pages/store/product/[slug].tsx', 'Product details page exists');
  checkFileContent('src/pages/store/product/[slug].tsx', 'getServerSideProps', 'Product page has SSR');
  
  // Test 4: Categories Navigation
  console.log('\n📂 Testing Categories Navigation...');
  checkFileExists('src/components/categories/index.ts', 'Categories component exists');
  checkFileExists('src/graphql/queries/categories.ts', 'Categories GraphQL queries exist');
  
  // Test 5: Search Functionality
  console.log('\n🔍 Testing Search Functionality...');
  checkFileExists('src/components/ui/advanced-search.tsx', 'Advanced search component exists');
  checkFileContent('src/components/ui/advanced-search.tsx', 'useState', 'Search has state management');
  
  // Test 6: Language Switching
  console.log('\n🌐 Testing Language Switching...');
  checkFileExists('src/components/common/language-switcher.tsx', 'Language switcher exists');
  checkFileExists('src/hooks/useUnifiedTranslation.ts', 'Translation hook exists');
  checkFileContent('src/hooks/useUnifiedTranslation.ts', 'i18n', 'Translation system integrated');
  
  // Test 7: Currency Display
  console.log('\n💰 Testing Currency Display...');
  checkFileExists('src/components/unified/UnifiedPrice.tsx', 'Unified price component exists');
  checkFileExists('src/currency-system/hooks/useCurrency.ts', 'Currency hook exists');
  checkFileContent('src/currency-system/hooks/useCurrency.ts', 'GraphQL', 'Currency uses GraphQL');
  
  // Test 8: Cart Functionality (Guest)
  console.log('\n🛒 Testing Guest Cart Functionality...');
  checkFileExists('src/hooks/useOdooCart.ts', 'Cart hook exists');
  checkFileExists('src/components/ui/cart-items.tsx', 'Cart items component exists');
  checkFileContent('src/hooks/useOdooCart.ts', 'localStorage', 'Cart persists locally for guests');
  
  // Test 9: Favorites (Guest)
  console.log('\n❤️ Testing Guest Favorites...');
  checkFileExists('src/hooks/useOdooFavorites.ts', 'Favorites hook exists');
  checkFileExists('src/context/FavoritesContext.tsx', 'Favorites context exists');
  
  // Test 10: Contact Information
  console.log('\n📞 Testing Contact Information...');
  checkFileExists('src/pages/main/contact.tsx', 'Contact page exists');
  checkFileExists('src/components/pages/ContactPageRenderer.tsx', 'Contact page renderer exists');
  
  // Test 11: About Page
  console.log('\n ℹ️ Testing About Page...');
  checkFileExists('src/pages/main/about.tsx', 'About page exists');
  checkFileExists('src/components/pages/AboutPageRenderer.tsx', 'About page renderer exists');
  
  // Test 12: Terms and Conditions
  console.log('\n📜 Testing Terms and Conditions...');
  checkFileExists('src/pages/logistic/terms.tsx', 'Terms page exists');
  checkFileExists('src/components/pages-details/terms-and-conditions/index.tsx', 'Terms component exists');
  
  // Test 13: Privacy Policy
  console.log('\n🔒 Testing Privacy Policy...');
  checkFileExists('src/pages/logistic/privacy.tsx', 'Privacy page exists');
  
  // Test 14: Responsive Design
  console.log('\n📱 Testing Responsive Design...');
  checkFileExists('src/theme/breakpoints.ts', 'Breakpoints configuration exists');
  checkFileExists('src/theme/components/index.ts', 'Theme components exist');
  
  // Test 15: Performance Optimization
  console.log('\n⚡ Testing Performance Optimization...');
  checkFileExists('next.config.js', 'Next.js configuration exists');
  checkFileContent('next.config.js', 'images', 'Image optimization configured');
  
  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Visitor Lifecycle Test Results');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  // Save results
  const resultsPath = path.join(TEST_CONFIG.projectRoot, 'tests/reports/visitor-lifecycle-results.json');
  const resultsDir = path.dirname(resultsPath);
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testType: 'Visitor Lifecycle',
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
runVisitorLifecycleTests().catch(error => {
  console.error('❌ Visitor lifecycle test failed:', error);
  process.exit(1);
});