/**
 * New System Quotation Explorer Test
 * اختبار استكشاف الكوتيشن في النظام الجديد
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

async function exploreNewSystemQuotation() {
  console.log('🔍 New System Quotation Explorer');
  console.log('=' .repeat(50));
  
  // Using the new system cart query structure
  const newSystemCartQuery = `
    query GetNewSystemCart {
      cart {
        id
        items {
          id
          product {
            id
            name
            price
            image
            sku
            stock {
              quantity
              isInStock
              stockStatus
            }
          }
          variant {
            id
            name
            price
            sku
            attributes {
              name
              value
            }
          }
          quantity
          unitPrice
          totalPrice
          notes
        }
        totalItems
        subtotal
        tax
        shipping
        discount
        total
        currency
        appliedCoupons {
          id
          code
          type
          value
          discount
          description
        }
        shippingMethod {
          id
          name
          cost
          estimatedDelivery
          carrier
          trackingNumber
          trackingUrl
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
        }
        paymentMethod {
          id
          name
          code
          type
          provider
        }
        billingAddress {
          id
          name
          street
          street2
          city
          zip
          country {
            id
            name
            code
          }
          state {
            id
            name
            code
          }
          phone
          email
        }
        shippingAddress {
          id
          name
          street
          street2
          city
          zip
          country {
            id
            name
            code
          }
          state {
            id
            name
            code
          }
          phone
          email
        }
        customer {
          id
          name
          email
          phone
          isGuest
        }
        orderStatus
        orderState
        orderReference
        orderNotes
        internalNotes
        createdAt
        updatedAt
      }
    }
  `;

  try {
    console.log('🔄 Fetching cart data using new system...');
    const result = await makeGraphQLRequest(newSystemCartQuery);
    
    if (result.data?.cart) {
      const cart = result.data.cart;
      
      console.log('✅ New System Cart Data Retrieved');
      console.log('\n📋 COMPLETE CART STRUCTURE:');
      console.log('=' .repeat(60));
      
      // Basic Cart Information
      console.log('\n🆔 BASIC CART INFO:');
      console.log(`   Cart ID: ${cart.id || 'N/A'}`);
      console.log(`   Total Items: ${cart.totalItems || 0}`);
      console.log(`   Subtotal: $${cart.subtotal || 0}`);
      console.log(`   Tax: $${cart.tax || 0}`);
      console.log(`   Shipping: $${cart.shipping || 0}`);
      console.log(`   Discount: $${cart.discount || 0}`);
      console.log(`   Total: $${cart.total || 0}`);
      console.log(`   Currency: ${cart.currency || 'N/A'}`);
      
      // Order Status Information
      console.log('\n📊 ORDER STATUS:');
      console.log(`   Order Status: ${cart.orderStatus || 'N/A'}`);
      console.log(`   Order State: ${cart.orderState || 'N/A'}`);
      console.log(`   Order Reference: ${cart.orderReference || 'N/A'}`);
      console.log(`   Order Notes: ${cart.orderNotes || 'N/A'}`);
      console.log(`   Internal Notes: ${cart.internalNotes || 'N/A'}`);
      
      // Cart Items
      if (cart.items && cart.items.length > 0) {
        console.log(`\n📦 CART ITEMS (${cart.items.length}):`);
        cart.items.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.product?.name || 'N/A'}`);
          console.log(`      Product ID: ${item.product?.id || 'N/A'}`);
          console.log(`      SKU: ${item.product?.sku || 'N/A'}`);
          console.log(`      Price: $${item.product?.price || 0}`);
          console.log(`      Quantity: ${item.quantity || 0}`);
          console.log(`      Unit Price: $${item.unitPrice || 0}`);
          console.log(`      Total Price: $${item.totalPrice || 0}`);
          console.log(`      Stock Status: ${item.product?.stock?.stockStatus || 'N/A'}`);
          console.log(`      In Stock: ${item.product?.stock?.isInStock || false}`);
        });
      } else {
        console.log('\n📦 CART ITEMS: Empty');
      }
      
      // ARAMEX SHIPPING FIELDS - CRITICAL CHECK
      console.log('\n🚚 SHIPPING METHOD & ARAMEX FIELDS:');
      if (cart.shippingMethod) {
        console.log(`   Method ID: ${cart.shippingMethod.id || 'N/A'}`);
        console.log(`   Method Name: ${cart.shippingMethod.name || 'N/A'}`);
        console.log(`   Cost: $${cart.shippingMethod.cost || 0}`);
        console.log(`   Estimated Delivery: ${cart.shippingMethod.estimatedDelivery || 'N/A'}`);
        console.log(`   Carrier: ${cart.shippingMethod.carrier || 'N/A'}`);
        console.log(`   Tracking Number: ${cart.shippingMethod.trackingNumber || 'N/A'}`);
        console.log(`   Tracking URL: ${cart.shippingMethod.trackingUrl || 'N/A'}`);
        
        // ARAMEX SPECIFIC FIELDS
        console.log('\n📦 ARAMEX SPECIFIC FIELDS:');
        console.log(`   🏷️  Aramex Label: ${cart.shippingMethod.aramexLabel || 'NOT FOUND'}`);
        console.log(`   📍 Aramex Tracking Number: ${cart.shippingMethod.aramexTrackingNumber || 'NOT FOUND'}`);
        console.log(`   🆔 Aramex Shipment ID: ${cart.shippingMethod.aramexShipmentId || 'NOT FOUND'}`);
        console.log(`   📋 Aramex Reference: ${cart.shippingMethod.aramexReference || 'NOT FOUND'}`);
        console.log(`   📊 Aramex Status: ${cart.shippingMethod.aramexStatus || 'NOT FOUND'}`);
        console.log(`   📅 Aramex Pickup Date: ${cart.shippingMethod.aramexPickupDate || 'NOT FOUND'}`);
        console.log(`   📅 Aramex Delivery Date: ${cart.shippingMethod.aramexDeliveryDate || 'NOT FOUND'}`);
        console.log(`   💰 Aramex Cost: ${cart.shippingMethod.aramexCost || 'NOT FOUND'}`);
        console.log(`   ⚖️  Aramex Weight: ${cart.shippingMethod.aramexWeight || 'NOT FOUND'}`);
        console.log(`   📏 Aramex Dimensions: ${cart.shippingMethod.aramexDimensions || 'NOT FOUND'}`);
        console.log(`   🚚 Aramex Service: ${cart.shippingMethod.aramexService || 'NOT FOUND'}`);
        console.log(`   🔢 Aramex Account Number: ${cart.shippingMethod.aramexAccountNumber || 'NOT FOUND'}`);
        console.log(`   📄 Aramex Waybill Number: ${cart.shippingMethod.aramexWaybillNumber || 'NOT FOUND'}`);
        
        // Check for Aramex Label specifically
        console.log('\n🔍 ARAMEX LABEL ANALYSIS:');
        if (cart.shippingMethod.aramexLabel) {
          console.log(`✅ ARAMEX LABEL FOUND: ${cart.shippingMethod.aramexLabel}`);
          console.log(`📋 Label Type: ${typeof cart.shippingMethod.aramexLabel}`);
          console.log(`📏 Label Length: ${cart.shippingMethod.aramexLabel.length} characters`);
          console.log(`🔗 Label Source: shippingMethod.aramexLabel`);
        } else {
          console.log('❌ ARAMEX LABEL NOT FOUND in shippingMethod');
        }
      } else {
        console.log('❌ No shipping method found');
      }
      
      // Payment Method
      if (cart.paymentMethod) {
        console.log('\n💳 PAYMENT METHOD:');
        console.log(`   Method ID: ${cart.paymentMethod.id || 'N/A'}`);
        console.log(`   Method Name: ${cart.paymentMethod.name || 'N/A'}`);
        console.log(`   Code: ${cart.paymentMethod.code || 'N/A'}`);
        console.log(`   Type: ${cart.paymentMethod.type || 'N/A'}`);
        console.log(`   Provider: ${cart.paymentMethod.provider || 'N/A'}`);
      }
      
      // Customer Information
      if (cart.customer) {
        console.log('\n👤 CUSTOMER INFORMATION:');
        console.log(`   Customer ID: ${cart.customer.id || 'N/A'}`);
        console.log(`   Name: ${cart.customer.name || 'N/A'}`);
        console.log(`   Email: ${cart.customer.email || 'N/A'}`);
        console.log(`   Phone: ${cart.customer.phone || 'N/A'}`);
        console.log(`   Is Guest: ${cart.customer.isGuest || false}`);
      }
      
      // Addresses
      if (cart.shippingAddress) {
        console.log('\n📍 SHIPPING ADDRESS:');
        console.log(`   Name: ${cart.shippingAddress.name || 'N/A'}`);
        console.log(`   Street: ${cart.shippingAddress.street || 'N/A'}`);
        console.log(`   City: ${cart.shippingAddress.city || 'N/A'}`);
        console.log(`   ZIP: ${cart.shippingAddress.zip || 'N/A'}`);
        console.log(`   Country: ${cart.shippingAddress.country?.name || 'N/A'}`);
        console.log(`   Phone: ${cart.shippingAddress.phone || 'N/A'}`);
      }
      
      // Applied Coupons
      if (cart.appliedCoupons && cart.appliedCoupons.length > 0) {
        console.log(`\n🎫 APPLIED COUPONS (${cart.appliedCoupons.length}):`);
        cart.appliedCoupons.forEach((coupon, index) => {
          console.log(`   ${index + 1}. ${coupon.code || 'N/A'}`);
          console.log(`      Type: ${coupon.type || 'N/A'}`);
          console.log(`      Value: ${coupon.value || 0}`);
          console.log(`      Discount: $${coupon.discount || 0}`);
          console.log(`      Description: ${coupon.description || 'N/A'}`);
        });
      }
      
      // Timestamps
      console.log('\n📅 TIMESTAMPS:');
      console.log(`   Created At: ${cart.createdAt || 'N/A'}`);
      console.log(`   Updated At: ${cart.updatedAt || 'N/A'}`);
      
      return {
        success: true,
        cart: cart,
        hasAramexLabel: !!(cart.shippingMethod?.aramexLabel),
        aramexLabelValue: cart.shippingMethod?.aramexLabel,
        aramexLabelLocation: 'shippingMethod.aramexLabel'
      };
    } else {
      console.log('❌ No cart data found in new system');
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error exploring new system cart:', error.message);
    if (error.message.includes('Cannot query field')) {
      console.log('🔍 Some fields may not exist in the new system schema');
      console.log('📋 Error details:', error.message);
    }
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  exploreNewSystemQuotation()
    .then(result => {
      console.log(result.success ? '\n🎉 New System Exploration COMPLETED' : '\n💥 New System Exploration FAILED');
      if (result.hasAramexLabel) {
        console.log(`\n✅ ARAMEX LABEL CONFIRMED: Found at ${result.aramexLabelLocation}`);
        console.log(`📋 Value: ${result.aramexLabelValue}`);
      } else {
        console.log('\n❌ ARAMEX LABEL NOT FOUND in new system structure');
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { exploreNewSystemQuotation };