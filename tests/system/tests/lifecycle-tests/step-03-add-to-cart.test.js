/**
 * Step 3: Add Product to Cart Test
 * الخطوة الثالثة: اختبار إضافة منتج للسلة والكوتيشن
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

async function testAddToCart() {
  console.log('🛒 Step 3: Add Product to Cart Test');
  console.log('=' .repeat(40));
  
  // First get available products
  const productsQuery = `
    query GetProducts {
      products {
        products {
          id
          name
          price
          slug
        }
      }
    }
  `;

  try {
    const productsResult = await makeGraphQLRequest(productsQuery);
    
    if (!productsResult.data?.products?.products?.[0]) {
      console.log('❌ No products available for cart test');
      return { success: false };
    }
    
    // Select first product with reasonable price
    const availableProducts = productsResult.data.products.products;
    const selectedProduct = availableProducts.find(p => p.price < 1000) || availableProducts[0];
    
    console.log(`📦 Selected Product: ${selectedProduct.name}`);
    console.log(`💰 Price: $${selectedProduct.price}`);
    console.log(`🆔 ID: ${selectedProduct.id}`);
    
    // Add product to cart
    const addToCartMutation = `
      mutation AddToCart($products: [ProductInput!]!) {
        cartAddMultipleItems(products: $products) {
          order {
            id
            name
            amountTotal
            amountUntaxed
            amountTax
            dateOrder
            orderLines {
              id
              name
              quantity
              priceUnit
              priceSubtotal
              priceTotal
              product {
                id
                name
                price
              }
            }
            partner {
              id
              name
              email
            }
          }
        }
      }
    `;

    const addToCartVariables = {
      products: [
        {
          id: parseInt(selectedProduct.id),
          quantity: 2
        }
      ]
    };

    console.log('\n🔄 Adding product to cart...');
    const cartResult = await makeGraphQLRequest(addToCartMutation, addToCartVariables);
    
    if (cartResult.data?.cartAddMultipleItems?.order) {
      const order = cartResult.data.cartAddMultipleItems.order;
      
      console.log('✅ Product Added to Cart: SUCCESS');
      console.log(`\n📋 Quotation Details:`);
      console.log(`   Order ID: ${order.id}`);
      console.log(`   Order Name: ${order.name}`);
      console.log(`   Status: Active Quotation`);
      console.log(`   Date: ${order.dateOrder}`);
      console.log(`   Total Amount: $${order.amountTotal}`);
      console.log(`   Untaxed Amount: $${order.amountUntaxed}`);
      console.log(`   Tax Amount: $${order.amountTax}`);
      
      console.log(`\n📦 Order Lines:`);
      order.orderLines.forEach((line, index) => {
        console.log(`   ${index + 1}. ${line.name}`);
        console.log(`      Product ID: ${line.product.id}`);
        console.log(`      Quantity: ${line.quantity}`);
        console.log(`      Unit Price: $${line.priceUnit}`);
        console.log(`      Subtotal: $${line.priceSubtotal}`);
        console.log(`      Total: $${line.priceTotal}`);
      });
      
      if (order.partner) {
        console.log(`\n👤 Customer Info:`);
        console.log(`   ID: ${order.partner.id}`);
        console.log(`   Name: ${order.partner.name || 'Guest'}`);
        console.log(`   Email: ${order.partner.email || 'Not provided'}`);
      }
      
      // Validate calculations
      const expectedSubtotal = selectedProduct.price * 2;
      const actualSubtotal = order.orderLines[0].priceSubtotal;
      const calculationCorrect = Math.abs(expectedSubtotal - actualSubtotal) < 0.01;
      
      console.log(`\n🧮 Calculation Validation:`);
      console.log(`   Expected: $${expectedSubtotal}`);
      console.log(`   Actual: $${actualSubtotal}`);
      console.log(`   Status: ${calculationCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
      
      return {
        success: true,
        quotation: order,
        selectedProduct: selectedProduct,
        calculationCorrect: calculationCorrect
      };
    } else {
      console.log('❌ Failed to add product to cart');
      if (cartResult.errors) {
        console.log('Errors:', JSON.stringify(cartResult.errors, null, 2));
      }
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Add to Cart Error:', error.message);
    return { success: false };
  }
}

if (require.main === module) {
  testAddToCart()
    .then(result => {
      console.log(result.success ? '\n🎉 Step 3 PASSED' : '\n💥 Step 3 FAILED');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testAddToCart };