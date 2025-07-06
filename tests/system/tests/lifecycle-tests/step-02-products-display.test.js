/**
 * Step 2: Products Display Test
 * الخطوة الثانية: اختبار عرض المنتجات
 */

const https = require('https');

const TEST_CONFIG = {
  odoo: {
    baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
    graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
    apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
  }
};

async function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: 'coffee-selection-staging-20784644.dev.odoo.com',
      port: 443,
      path: '/graphql/vsf',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_CONFIG.odoo.apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testProductsDisplay() {
  console.log('🛍️ Step 2: Products Display Test');
  console.log('=' .repeat(40));
  
  const productsQuery = `
    query GetProducts {
      products {
        products {
          id
          name
          price
          slug
          description
          weight
          image
          categories {
            id
            name
            slug
          }
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(productsQuery);
    
    if (result.data && result.data.products && result.data.products.products) {
      const products = result.data.products.products;
      
      console.log('✅ Products Retrieved: SUCCESS');
      console.log(`📦 Total Products: ${products.length}`);
      
      // Display first 3 products with details
      console.log('\n📋 Product Details:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Slug: ${product.slug}`);
        console.log(`   Weight: ${product.weight || 'N/A'}`);
        console.log(`   Image: ${product.image ? 'Available' : 'Not Available'}`);
        console.log(`   Categories: ${product.categories?.length || 0}`);
        if (product.description) {
          console.log(`   Description: ${product.description.substring(0, 50)}...`);
        }
      });
      
      // Validate product data quality
      let validProducts = 0;
      products.forEach(product => {
        if (product.id && product.name && product.price !== undefined && product.slug) {
          validProducts++;
        }
      });
      
      const validityRate = (validProducts / products.length) * 100;
      console.log(`\n📊 Data Quality: ${validityRate.toFixed(1)}% valid products`);
      
      if (validityRate >= 90) {
        console.log('✅ Product Data Quality: EXCELLENT');
        return { success: true, products: products };
      } else {
        console.log('⚠️ Product Data Quality: NEEDS IMPROVEMENT');
        return { success: false, products: products };
      }
    } else {
      console.log('❌ Products Retrieval: FAILED');
      return { success: false, products: [] };
    }
  } catch (error) {
    console.log('❌ Products Display Error:', error.message);
    return { success: false, products: [] };
  }
}

if (require.main === module) {
  testProductsDisplay()
    .then(result => {
      console.log(result.success ? '\n🎉 Step 2 PASSED' : '\n💥 Step 2 FAILED');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testProductsDisplay };