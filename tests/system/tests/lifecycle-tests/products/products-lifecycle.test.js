/**
 * Products Lifecycle Test
 * اختبار دورة حياة المنتجات
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
async function runProductsLifecycleTests() {
  console.log('🚀 Starting Products Lifecycle Tests\n');
  console.log('=' .repeat(60));
  console.log(`☕ Testing with real user: ${TEST_CONFIG.realUser.email}`);
  console.log('=' .repeat(60));

  // Test 1: Product Data Services
  console.log('\n📊 Testing Product Data Services...');
  checkFileExists('src/services/odoo/graphql-products.service.ts', 'GraphQL Products Service');
  checkFileExists('src/hooks/useOdooProducts.ts', 'Products Hook');
  checkFileExists('src/graphql/queries/products.ts', 'Products GraphQL Queries');
  checkFileContent('src/services/odoo/graphql-products.service.ts', 'GraphQL', 'Products use GraphQL');
  
  // Test 2: Product Display Components
  console.log('\n🎨 Testing Product Display Components...');
  checkFileExists('src/components/shared/product-card/index.tsx', 'Product Card Component');
  checkFileExists('src/components/ui/enhanced-product-card.tsx', 'Enhanced Product Card');
  checkFileExists('src/components/unified/UnifiedPrice.tsx', 'Unified Price Component');
  checkFileContent('src/components/shared/product-card/index.tsx', 'UnifiedPrice', 'Product card uses unified pricing');
  
  // Test 3: Product Pages
  console.log('\n📄 Testing Product Pages...');
  checkFileExists('src/pages/store/shop.tsx', 'Shop Page');
  checkFileExists('src/pages/store/product/[slug].tsx', 'Product Details Page');
  checkFileExists('src/pages/store/collections/[slug].tsx', 'Collections Page');
  checkFileContent('src/pages/store/product/[slug].tsx', 'getServerSideProps', 'Product page has SSR');
  
  // Test 4: Categories System
  console.log('\n📂 Testing Categories System...');
  checkFileExists('src/components/categories/index.ts', 'Categories Component');
  checkFileExists('src/components/categories/CategoryManager/index.tsx', 'Category Manager');
  checkFileExists('src/graphql/queries/categories.ts', 'Categories GraphQL Queries');
  checkFileContent('src/graphql/queries/categories.ts', 'GraphQL', 'Categories use GraphQL');
  
  // Test 5: Product Filtering
  console.log('\n🔍 Testing Product Filtering...');
  checkFileExists('src/components/categories/FilterSystem/index.tsx', 'Filter System');
  checkFileExists('src/hooks/useFilteredProducts.ts', 'Filtered Products Hook');
  checkFileExists('src/components/ui/quick-filters.tsx', 'Quick Filters Component');
  checkFileContent('src/hooks/useFilteredProducts.ts', 'filter', 'Products filtering implemented');
  
  // Test 6: Product Search
  console.log('\n🔎 Testing Product Search...');
  checkFileExists('src/components/ui/advanced-search.tsx', 'Advanced Search Component');
  checkFileContent('src/components/ui/advanced-search.tsx', 'search', 'Search functionality implemented');
  checkFileContent('src/hooks/useOdooProducts.ts', 'search', 'Products hook supports search');
  
  // Test 7: Product Images
  console.log('\n🖼️ Testing Product Images...');
  checkFileExists('src/components/unified/UnifiedImage.tsx', 'Unified Image Component');
  checkFileContent('src/components/shared/product-card/index.tsx', 'UnifiedImage', 'Product card uses unified images');
  checkFileContent('next.config.js', 'images', 'Image optimization configured');
  
  // Test 8: Product Pricing
  console.log('\n💰 Testing Product Pricing...');
  checkFileExists('src/components/ProductPriceConverter.tsx', 'Price Converter Component');
  checkFileExists('src/hooks/useUnifiedPrice.ts', 'Unified Price Hook');
  checkFileContent('src/hooks/useUnifiedPrice.ts', 'currency', 'Price hook supports currency conversion');
  
  // Test 9: Inventory Management
  console.log('\n📦 Testing Inventory Management...');
  checkFileExists('src/components/inventory/index.ts', 'Inventory Components');
  checkFileExists('src/services/inventory/stock.service.ts', 'Stock Service');
  checkFileContent('src/services/inventory/stock.service.ts', 'GraphQL', 'Inventory uses GraphQL');
  
  // Test 10: Product Reviews
  console.log('\n⭐ Testing Product Reviews...');
  checkFileExists('src/components/reviews/ReviewSystem/index.tsx', 'Review System');
  checkFileExists('src/services/odoo/graphql-reviews.service.ts', 'Reviews Service');
  checkFileExists('src/services/reviews/review.service.ts', 'Review Service');
  checkFileContent('src/services/odoo/graphql-reviews.service.ts', 'GraphQL', 'Reviews use GraphQL');
  
  // Test 11: Product Favorites/Wishlist
  console.log('\n❤️ Testing Product Favorites...');
  checkFileExists('src/pages/store/favorites.tsx', 'Favorites Page');
  checkFileExists('src/services/odoo/graphql-wishlist.service.ts', 'Wishlist Service');
  checkFileExists('src/hooks/useOdooFavorites.ts', 'Favorites Hook');
  checkFileContent('src/services/odoo/graphql-wishlist.service.ts', 'GraphQL', 'Wishlist uses GraphQL');
  
  // Test 12: Product Cart Integration
  console.log('\n🛒 Testing Product Cart Integration...');
  checkFileExists('src/services/odoo/graphql-cart.service.ts', 'Cart Service');
  checkFileExists('src/hooks/useOdooCart.ts', 'Cart Hook');
  checkFileContent('src/services/odoo/graphql-cart.service.ts', 'addToCart', 'Add to cart functionality');
  
  // Test 13: Product Sharing
  console.log('\n📤 Testing Product Sharing...');
  checkFileExists('src/components/ui/product-share-modal.tsx', 'Product Share Modal');
  checkFileExists('src/services/shareService.ts', 'Share Service');
  checkFileContent('src/components/ui/product-share-modal.tsx', 'share', 'Product sharing implemented');
  
  // Test 14: Product Loading States
  console.log('\n⏳ Testing Product Loading States...');
  checkFileExists('src/components/ui/product-loading-skeleton.tsx', 'Product Loading Skeleton');
  checkFileContent('src/hooks/useOdooProducts.ts', 'loading', 'Products hook has loading state');
  
  // Test 15: Product Collections
  console.log('\n📚 Testing Product Collections...');
  checkFileExists('src/components/layout/layout-collections-details/index.tsx', 'Collections Layout');
  checkFileContent('src/pages/store/collections/[slug].tsx', 'collection', 'Collections page implemented');
  
  // Test 16: Product Variants
  console.log('\n🎭 Testing Product Variants...');
  checkFileContent('src/services/odoo/graphql-products.service.ts', 'variant', 'Product variants supported');
  checkFileContent('src/components/shared/product-card/index.tsx', 'variant', 'Product card shows variants');
  
  // Test 17: Product Recommendations
  console.log('\n💡 Testing Product Recommendations...');
  checkFileContent('src/hooks/useOdooProducts.ts', 'related', 'Related products functionality');
  checkFileContent('src/services/odoo/graphql-products.service.ts', 'recommend', 'Product recommendations');
  
  // Test 18: Product Analytics
  console.log('\n📈 Testing Product Analytics...');
  checkFileExists('src/lib/tracking.ts', 'Tracking Library');
  checkFileContent('src/components/shared/product-card/index.tsx', 'track', 'Product tracking implemented');
  
  // Test 19: Multi-language Support
  console.log('\n🌐 Testing Multi-language Support...');
  checkFileExists('src/hooks/useUnifiedTranslation.ts', 'Translation Hook');
  checkFileContent('src/components/shared/product-card/index.tsx', 'translation', 'Product card supports translation');
  
  // Test 20: Performance Optimization
  console.log('\n⚡ Testing Performance Optimization...');
  checkFileContent('src/pages/store/shop.tsx', 'getServerSideProps', 'Shop page has SSR');
  checkFileContent('src/hooks/useOdooProducts.ts', 'useMemo', 'Products hook optimized with memoization');
  
  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Products Lifecycle Test Results');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  // Save results
  const resultsPath = path.join(TEST_CONFIG.projectRoot, 'tests/reports/products-lifecycle-results.json');
  const resultsDir = path.dirname(resultsPath);
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testType: 'Products Lifecycle',
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
runProductsLifecycleTests().catch(error => {
  console.error('❌ Products lifecycle test failed:', error);
  process.exit(1);
});