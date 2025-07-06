/**
 * Step 4: Get Quotation Data Test
 * الخطوة الرابعة: اختبار جلب بيانات الكوتيشن
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

async function testGetQuotation() {
  console.log('📋 Step 4: Get Quotation Data Test');
  console.log('=' .repeat(40));
  
  // Get current cart/quotation
  const getCartQuery = `
    query GetCart {
      cart {
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
              slug
              image
            }
          }
          partner {
            id
            name
            email
            phone
          }
        }
      }
    }
  `;

  try {
    console.log('🔄 Retrieving current quotation...');
    const result = await makeGraphQLRequest(getCartQuery);
    
    if (result.data?.cart?.order) {
      const quotation = result.data.cart.order;
      
      console.log('✅ Quotation Retrieved: SUCCESS');
      console.log(`\n📋 Quotation Summary:`);
      console.log(`   Order ID: ${quotation.id}`);
      console.log(`   Order Name: ${quotation.name}`);
      console.log(`   Date Created: ${quotation.dateOrder}`);
      console.log(`   Total Amount: $${quotation.amountTotal}`);
      console.log(`   Untaxed Amount: $${quotation.amountUntaxed}`);
      console.log(`   Tax Amount: $${quotation.amountTax}`);
      
      console.log(`\n📦 Items in Quotation: ${quotation.orderLines?.length || 0}`);
      if (quotation.orderLines && quotation.orderLines.length > 0) {
        quotation.orderLines.forEach((line, index) => {
        console.log(`\n   ${index + 1}. ${line.name}`);
        console.log(`      Product ID: ${line.product.id}`);
        console.log(`      Product Name: ${line.product.name}`);
        console.log(`      Product Price: $${line.product.price}`);
        console.log(`      Product Slug: ${line.product.slug}`);
        console.log(`      Product Image: ${line.product.image ? 'Available' : 'Not Available'}`);
        console.log(`      Quantity: ${line.quantity}`);
        console.log(`      Unit Price: $${line.priceUnit}`);
        console.log(`      Subtotal: $${line.priceSubtotal}`);
        console.log(`      Total: $${line.priceTotal}`);
        });
      } else {
        console.log('   No items in quotation');
      }
      
      if (quotation.partner) {
        console.log(`\n👤 Customer Information:`);
        console.log(`   Customer ID: ${quotation.partner.id}`);
        console.log(`   Name: ${quotation.partner.name || 'Guest Customer'}`);
        console.log(`   Email: ${quotation.partner.email || 'Not provided'}`);
        console.log(`   Phone: ${quotation.partner.phone || 'Not provided'}`);
      }
      
      // Validate quotation data completeness
      const hasRequiredData = quotation.id && quotation.name && 
                             quotation.amountTotal !== undefined && (quotation.orderLines?.length || 0) >= 0;
      
      console.log(`\n🔍 Data Validation:`);
      console.log(`   Has Order ID: ${quotation.id ? '✅' : '❌'}`);
      console.log(`   Has Order Name: ${quotation.name ? '✅' : '❌'}`);
      console.log(`   Has Total Amount: ${quotation.amountTotal ? '✅' : '❌'}`);
      console.log(`   Has Order Lines: ${(quotation.orderLines?.length || 0) > 0 ? '✅' : '❌'}`);
      console.log(`   Has Customer Info: ${quotation.partner ? '✅' : '❌'}`);
      
      // Calculate totals validation
      const calculatedTotal = quotation.orderLines?.reduce((sum, line) => sum + line.priceSubtotal, 0) || 0;
      const totalMatches = Math.abs(calculatedTotal - quotation.amountUntaxed) < 0.01;
      
      console.log(`\n🧮 Calculations Check:`);
      console.log(`   Calculated Subtotal: $${calculatedTotal}`);
      console.log(`   Quotation Subtotal: $${quotation.amountUntaxed}`);
      console.log(`   Match Status: ${totalMatches ? '✅ CORRECT' : '❌ INCORRECT'}`);
      
      return {
        success: hasRequiredData && totalMatches,
        quotation: quotation,
        dataComplete: hasRequiredData,
        calculationsCorrect: totalMatches
      };
    } else {
      console.log('❌ No active quotation found');
      console.log('ℹ️ This might be normal if no products were added to cart');
      return { success: false, quotation: null };
    }
  } catch (error) {
    console.log('❌ Get Quotation Error:', error.message);
    return { success: false, quotation: null };
  }
}

if (require.main === module) {
  testGetQuotation()
    .then(result => {
      console.log(result.success ? '\n🎉 Step 4 PASSED' : '\n💥 Step 4 FAILED');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testGetQuotation };