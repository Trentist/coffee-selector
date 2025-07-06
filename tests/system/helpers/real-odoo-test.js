/**
 * Real Odoo Data Test
 * اختبار البيانات الحقيقية من Odoo
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf'
};

console.log('🔍 Testing Real Odoo Data...');
console.log('============================');

// Test products query
function testProductsQuery() {
  return new Promise((resolve) => {
    const query = `
      query GetProducts {
        products {
          id
          name
          price
          description
          image
          categories {
            id
            name
          }
          inStock
        }
      }
    `;

    const postData = JSON.stringify({ query });
    const url = new URL(ODOO_CONFIG.graphqlUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`
      },
      timeout: 20000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.data && response.data.products) {
            const products = response.data.products;
            console.log(`✅ Products Query: SUCCESS`);
            console.log(`📦 Found ${products.length} products`);
            
            // Validate product structure
            let validProducts = 0;
            let invalidProducts = 0;
            
            products.forEach(product => {
              if (product.id && product.name && typeof product.price === 'number') {
                validProducts++;
              } else {
                invalidProducts++;
              }
            });
            
            console.log(`✅ Valid Products: ${validProducts}`);
            if (invalidProducts > 0) {
              console.log(`⚠️ Invalid Products: ${invalidProducts}`);
            }
            
            // Show sample product
            if (products.length > 0) {
              const sample = products[0];
              console.log(`📋 Sample Product:`);
              console.log(`   ID: ${sample.id}`);
              console.log(`   Name: ${sample.name}`);
              console.log(`   Price: ${sample.price}`);
              console.log(`   In Stock: ${sample.inStock}`);
            }
            
            resolve({
              success: true,
              count: products.length,
              validProducts,
              invalidProducts,
              sampleProduct: products[0]
            });
          } else if (response.errors) {
            console.log(`❌ GraphQL Errors:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ No products data found`);
            resolve({
              success: false,
              error: 'No products data'
            });
          }
        } catch (err) {
          console.log(`❌ JSON Parse Error: ${err.message}`);
          resolve({
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ Request Timeout');
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Test categories query
function testCategoriesQuery() {
  return new Promise((resolve) => {
    const query = `
      query GetCategories {
        categories {
          id
          name
          slug
          description
        }
      }
    `;

    const postData = JSON.stringify({ query });
    const url = new URL(ODOO_CONFIG.graphqlUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.data && response.data.categories) {
            const categories = response.data.categories;
            console.log(`✅ Categories Query: SUCCESS`);
            console.log(`📂 Found ${categories.length} categories`);
            
            if (categories.length > 0) {
              console.log(`📋 Sample Category: ${categories[0].name}`);
            }
            
            resolve({
              success: true,
              count: categories.length,
              sampleCategory: categories[0]
            });
          } else if (response.errors) {
            console.log(`❌ Categories GraphQL Errors:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ No categories data found`);
            resolve({
              success: false,
              error: 'No categories data'
            });
          }
        } catch (err) {
          console.log(`❌ Categories JSON Parse Error: ${err.message}`);
          resolve({
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Categories Request Error: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ Categories Request Timeout');
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Run real data tests
async function runRealDataTests() {
  console.log('🔍 Testing Products Data...');
  const productsTest = await testProductsQuery();
  
  console.log('\n🔍 Testing Categories Data...');
  const categoriesTest = await testCategoriesQuery();
  
  console.log('\n📊 Real Data Test Summary:');
  console.log('==========================');
  console.log(`Products Query: ${productsTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Categories Query: ${categoriesTest.success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (productsTest.success) {
    console.log(`📦 Products Count: ${productsTest.count}`);
    console.log(`✅ Valid Products: ${productsTest.validProducts}`);
  }
  
  if (categoriesTest.success) {
    console.log(`📂 Categories Count: ${categoriesTest.count}`);
  }
  
  // Generate test report
  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      products: productsTest,
      categories: categoriesTest
    },
    summary: {
      totalTests: 2,
      passedTests: (productsTest.success ? 1 : 0) + (categoriesTest.success ? 1 : 0),
      failedTests: (productsTest.success ? 0 : 1) + (categoriesTest.success ? 0 : 1)
    }
  };
  
  console.log('\n📄 Generating Test Report...');
  require('fs').writeFileSync(
    'tests/reports/real-data-validation/odoo-real-data-report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('✅ Report saved to: tests/reports/real-data-validation/odoo-real-data-report.json');
  
  if (productsTest.success && categoriesTest.success) {
    console.log('\n🎉 All real data tests passed! Data is ready for use.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some real data tests failed. Check GraphQL queries.');
    process.exit(1);
  }
}

// Create reports directory if it doesn't exist
require('fs').mkdirSync('tests/reports/real-data-validation', { recursive: true });

// Run the tests
runRealDataTests().catch(console.error);