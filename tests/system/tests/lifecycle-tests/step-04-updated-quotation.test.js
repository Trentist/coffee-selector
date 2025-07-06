/**
 * Step 4 Updated: Get Quotation with Aramex Fields
 * الخطوة الرابعة المحدثة: جلب الكوتيشن مع حقول أرامكس
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

async function testUpdatedQuotation() {
  console.log('📋 Step 4 Updated: Get Quotation with All Fields');
  console.log('=' .repeat(50));
  
  // Try multiple query approaches to find the correct structure
  const queries = [
    {
      name: 'Current Cart Query',
      query: `
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
              carrierTrackingRef
              carrierTrackingUrl
              aramexLabel
              aramexTrackingNumber
              aramexShipmentId
              aramexReference
              aramexStatus
              aramexPickupDate
              aramexDeliveryDate
              aramexCost
              aramexWeight
              aramexDimensions
              aramexService
              aramexAccountNumber
              aramexWaybillNumber
              shippingLabel
              trackingNumber
              trackingUrl
              deliveryCarrier {
                id
                name
                deliveryType
              }
            }
          }
        }
      `
    },
    {
      name: 'Order Direct Query',
      query: `
        query GetCurrentOrder {
          currentOrder {
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
            carrierTrackingRef
            carrierTrackingUrl
            aramexLabel
            aramexTrackingNumber
            aramexShipmentId
            aramexReference
            aramexStatus
            aramexPickupDate
            aramexDeliveryDate
            aramexCost
            aramexWeight
            aramexDimensions
            aramexService
            aramexAccountNumber
            aramexWaybillNumber
            shippingLabel
            trackingNumber
            trackingUrl
            deliveryCarrier {
              id
              name
              deliveryType
            }
          }
        }
      `
    },
    {
      name: 'Simple Cart Query',
      query: `
        query GetSimpleCart {
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
      `
    }
  ];

  for (const queryTest of queries) {
    console.log(`\n🔄 Testing: ${queryTest.name}`);
    console.log('-'.repeat(30));
    
    try {
      const result = await makeGraphQLRequest(queryTest.query);
      
      if (result.errors) {
        console.log(`❌ GraphQL Errors in ${queryTest.name}:`);
        result.errors.forEach(error => {
          console.log(`   - ${error.message}`);
        });
        continue;
      }
      
      if (result.data?.cart?.order) {
        const order = result.data.cart.order;
        console.log(`✅ ${queryTest.name} SUCCESS`);
        
        console.log('\n📋 ORDER DETAILS:');
        console.log(`   Order ID: ${order.id}`);
        console.log(`   Order Name: ${order.name}`);
        console.log(`   Total Amount: $${order.amountTotal}`);
        console.log(`   Untaxed Amount: $${order.amountUntaxed}`);
        console.log(`   Tax Amount: $${order.amountTax}`);
        console.log(`   Date: ${order.dateOrder}`);
        
        if (order.orderLines && order.orderLines.length > 0) {
          console.log(`\n📦 ORDER LINES (${order.orderLines.length}):`);
          order.orderLines.forEach((line, index) => {
            console.log(`   ${index + 1}. ${line.name}`);
            console.log(`      Product ID: ${line.product?.id}`);
            console.log(`      Quantity: ${line.quantity}`);
            console.log(`      Unit Price: $${line.priceUnit}`);
            console.log(`      Subtotal: $${line.priceSubtotal}`);
          });
        }
        
        if (order.partner) {
          console.log(`\n👤 CUSTOMER INFO:`);
          console.log(`   ID: ${order.partner.id}`);
          console.log(`   Name: ${order.partner.name}`);
          console.log(`   Email: ${order.partner.email || 'N/A'}`);
          console.log(`   Phone: ${order.partner.phone || 'N/A'}`);
        }
        
        // Check for Aramex and shipping fields
        console.log(`\n🚚 SHIPPING & ARAMEX FIELDS:`);
        console.log(`   Carrier Tracking Ref: ${order.carrierTrackingRef || 'NOT FOUND'}`);
        console.log(`   Carrier Tracking URL: ${order.carrierTrackingUrl || 'NOT FOUND'}`);
        console.log(`   🏷️  Aramex Label: ${order.aramexLabel || 'NOT FOUND'}`);
        console.log(`   📍 Aramex Tracking Number: ${order.aramexTrackingNumber || 'NOT FOUND'}`);
        console.log(`   🆔 Aramex Shipment ID: ${order.aramexShipmentId || 'NOT FOUND'}`);
        console.log(`   📋 Aramex Reference: ${order.aramexReference || 'NOT FOUND'}`);
        console.log(`   📊 Aramex Status: ${order.aramexStatus || 'NOT FOUND'}`);
        console.log(`   📅 Aramex Pickup Date: ${order.aramexPickupDate || 'NOT FOUND'}`);
        console.log(`   📅 Aramex Delivery Date: ${order.aramexDeliveryDate || 'NOT FOUND'}`);
        console.log(`   💰 Aramex Cost: ${order.aramexCost || 'NOT FOUND'}`);
        console.log(`   ⚖️  Aramex Weight: ${order.aramexWeight || 'NOT FOUND'}`);
        console.log(`   📏 Aramex Dimensions: ${order.aramexDimensions || 'NOT FOUND'}`);
        console.log(`   🚚 Aramex Service: ${order.aramexService || 'NOT FOUND'}`);
        console.log(`   🔢 Aramex Account Number: ${order.aramexAccountNumber || 'NOT FOUND'}`);
        console.log(`   📄 Aramex Waybill Number: ${order.aramexWaybillNumber || 'NOT FOUND'}`);
        console.log(`   📦 Shipping Label: ${order.shippingLabel || 'NOT FOUND'}`);
        console.log(`   🔍 Tracking Number: ${order.trackingNumber || 'NOT FOUND'}`);
        console.log(`   🔗 Tracking URL: ${order.trackingUrl || 'NOT FOUND'}`);
        
        if (order.deliveryCarrier) {
          console.log(`\n🚛 DELIVERY CARRIER:`);
          console.log(`   Carrier ID: ${order.deliveryCarrier.id}`);
          console.log(`   Carrier Name: ${order.deliveryCarrier.name}`);
          console.log(`   Delivery Type: ${order.deliveryCarrier.deliveryType}`);
        }
        
        // Analyze Aramex Label
        console.log(`\n🔍 ARAMEX LABEL ANALYSIS:`);
        if (order.aramexLabel) {
          console.log(`✅ ARAMEX LABEL FOUND: ${order.aramexLabel}`);
          console.log(`📋 Label Type: ${typeof order.aramexLabel}`);
          console.log(`📏 Label Length: ${order.aramexLabel.length} characters`);
          console.log(`🔗 Label Source: order.aramexLabel`);
        } else {
          console.log(`❌ ARAMEX LABEL NOT FOUND in order object`);
        }
        
        return {
          success: true,
          order: order,
          hasAramexLabel: !!order.aramexLabel,
          aramexLabelValue: order.aramexLabel,
          queryUsed: queryTest.name
        };
      } else if (result.data?.currentOrder) {
        const order = result.data.currentOrder;
        console.log(`✅ ${queryTest.name} SUCCESS (currentOrder)`);
        // Similar processing for currentOrder...
        return {
          success: true,
          order: order,
          hasAramexLabel: !!order.aramexLabel,
          aramexLabelValue: order.aramexLabel,
          queryUsed: queryTest.name
        };
      } else {
        console.log(`❌ ${queryTest.name}: No order data found`);
      }
    } catch (error) {
      console.log(`❌ ${queryTest.name} Error: ${error.message}`);
    }
  }
  
  return { success: false };
}

if (require.main === module) {
  testUpdatedQuotation()
    .then(result => {
      console.log('\n' + '='.repeat(60));
      if (result.success) {
        console.log('🎉 Step 4 Updated PASSED');
        console.log(`📋 Query Used: ${result.queryUsed}`);
        if (result.hasAramexLabel) {
          console.log(`✅ ARAMEX LABEL CONFIRMED: ${result.aramexLabelValue}`);
        } else {
          console.log('❌ ARAMEX LABEL NOT FOUND');
        }
      } else {
        console.log('💥 Step 4 Updated FAILED');
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testUpdatedQuotation };