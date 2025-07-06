/**
 * Quotation Fields Explorer Test
 * اختبار استكشاف جميع حقول الكوتيشن
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

async function exploreQuotationFields() {
  console.log('🔍 Quotation Fields Explorer Test');
  console.log('=' .repeat(50));
  
  // Comprehensive query to get all possible fields
  const comprehensiveQuery = `
    query GetCompleteQuotation {
      cart {
        order {
          id
          name
          dateOrder
          amountTotal
          amountUntaxed
          amountTax
          amountDelivery
          note
          clientOrderRef
          reference
          origin
          accessToken
          validityDate
          confirmationDate
          effectiveDate
          commitmentDate
          invoiceStatus
          deliveryStatus
          locked
          currency {
            id
            name
            symbol
            rate
            position
          }
          pricelist {
            id
            name
            currency {
              id
              name
              symbol
            }
          }
          partner {
            id
            name
            displayName
            email
            phone
            mobile
            website
            vat
            isCompany
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
            category {
              id
              name
            }
          }
          partnerInvoice {
            id
            name
            displayName
            email
            phone
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
          }
          partnerShipping {
            id
            name
            displayName
            email
            phone
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
          }
          orderLines {
            id
            name
            sequence
            quantity
            productUom
            priceUnit
            priceSubtotal
            priceTotal
            discount
            taxId
            product {
              id
              name
              displayName
              sku
              barcode
              weight
              volume
              image
              smallImage
              thumbnail
              description
              shortDescription
              categories {
                id
                name
                slug
              }
            }
            productPackaging {
              id
              name
              qty
            }
          }
          shippingMethod {
            id
            name
            price
            description
            deliveryType
            fixedPrice
            margin
            freeOver
          }
          paymentMethod {
            id
            name
            code
            type
            provider
          }
          company {
            id
            name
            email
            phone
            website
            vat
            logo
            currency {
              id
              name
              symbol
            }
          }
          team {
            id
            name
            code
          }
          user {
            id
            name
            email
            phone
          }
          tags {
            id
            name
            color
          }
          invoices {
            id
            name
            number
            reference
            dateInvoice
            dateDue
            amountTotal
            amountUntaxed
            amountTax
            residual
            state
            paymentState
          }
          pickings {
            id
            name
            origin
            state
            scheduledDate
            dateDeadline
            dateDone
            priority
            location {
              id
              name
            }
            locationDest {
              id
              name
            }
            carrier {
              id
              name
              deliveryType
            }
            trackingRef
            weight
            volume
          }
          tasks {
            id
            name
            description
            dateDeadline
            priority
            stage {
              id
              name
            }
            user {
              id
              name
            }
          }
          opportunities {
            id
            name
            expectedRevenue
            probability
            dateDeadline
            stage {
              id
              name
            }
          }
          messageIds {
            id
            subject
            body
            date
            messageType
            author {
              id
              name
            }
          }
          activityIds {
            id
            summary
            note
            dateDeadline
            activityType {
              id
              name
            }
            user {
              id
              name
            }
          }
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
          deliveryInstructions
          signatureRequired
          insuranceValue
          codAmount
          customsValue
          customsDescription
          hazardousMaterial
          fragile
          perishable
          returnService
          saturdayDelivery
          holdAtLocation
          residentialDelivery
          adultSignatureRequired
          directSignatureRequired
          packageType
          serviceType
          deliveryConfirmation
          labelFormat
          labelSize
          printDensity
          thermalPrinter
          createDate
          writeDate
          createUid {
            id
            name
          }
          writeUid {
            id
            name
          }
        }
      }
    }
  `;

  try {
    console.log('🔄 Fetching comprehensive quotation data...');
    const result = await makeGraphQLRequest(comprehensiveQuery);
    
    if (result.data?.cart?.order) {
      const quotation = result.data.cart.order;
      
      console.log('✅ Quotation Data Retrieved Successfully');
      console.log('\n📋 COMPLETE QUOTATION FIELDS:');
      console.log('=' .repeat(60));
      
      // Basic Information
      console.log('\n🆔 BASIC INFORMATION:');
      console.log(`   ID: ${quotation.id || 'N/A'}`);
      console.log(`   Name: ${quotation.name || 'N/A'}`);
      console.log(`   Date Order: ${quotation.dateOrder || 'N/A'}`);
      console.log(`   Reference: ${quotation.reference || 'N/A'}`);
      console.log(`   Origin: ${quotation.origin || 'N/A'}`);
      console.log(`   Client Order Ref: ${quotation.clientOrderRef || 'N/A'}`);
      console.log(`   Access Token: ${quotation.accessToken || 'N/A'}`);
      
      // Financial Information
      console.log('\n💰 FINANCIAL INFORMATION:');
      console.log(`   Amount Total: $${quotation.amountTotal || 0}`);
      console.log(`   Amount Untaxed: $${quotation.amountUntaxed || 0}`);
      console.log(`   Amount Tax: $${quotation.amountTax || 0}`);
      console.log(`   Amount Delivery: $${quotation.amountDelivery || 0}`);
      
      // Status Information
      console.log('\n📊 STATUS INFORMATION:');
      console.log(`   Invoice Status: ${quotation.invoiceStatus || 'N/A'}`);
      console.log(`   Delivery Status: ${quotation.deliveryStatus || 'N/A'}`);
      console.log(`   Locked: ${quotation.locked || false}`);
      
      // Dates
      console.log('\n📅 IMPORTANT DATES:');
      console.log(`   Validity Date: ${quotation.validityDate || 'N/A'}`);
      console.log(`   Confirmation Date: ${quotation.confirmationDate || 'N/A'}`);
      console.log(`   Effective Date: ${quotation.effectiveDate || 'N/A'}`);
      console.log(`   Commitment Date: ${quotation.commitmentDate || 'N/A'}`);
      
      // ARAMEX FIELDS - CRITICAL CHECK
      console.log('\n📦 ARAMEX SHIPPING FIELDS:');
      console.log(`   🏷️  Aramex Label: ${quotation.aramexLabel || 'NOT FOUND'}`);
      console.log(`   📍 Aramex Tracking Number: ${quotation.aramexTrackingNumber || 'NOT FOUND'}`);
      console.log(`   🆔 Aramex Shipment ID: ${quotation.aramexShipmentId || 'NOT FOUND'}`);
      console.log(`   📋 Aramex Reference: ${quotation.aramexReference || 'NOT FOUND'}`);
      console.log(`   📊 Aramex Status: ${quotation.aramexStatus || 'NOT FOUND'}`);
      console.log(`   📅 Aramex Pickup Date: ${quotation.aramexPickupDate || 'NOT FOUND'}`);
      console.log(`   📅 Aramex Delivery Date: ${quotation.aramexDeliveryDate || 'NOT FOUND'}`);
      console.log(`   💰 Aramex Cost: ${quotation.aramexCost || 'NOT FOUND'}`);
      console.log(`   ⚖️  Aramex Weight: ${quotation.aramexWeight || 'NOT FOUND'}`);
      console.log(`   📏 Aramex Dimensions: ${quotation.aramexDimensions || 'NOT FOUND'}`);
      console.log(`   🚚 Aramex Service: ${quotation.aramexService || 'NOT FOUND'}`);
      console.log(`   🔢 Aramex Account Number: ${quotation.aramexAccountNumber || 'NOT FOUND'}`);
      console.log(`   📄 Aramex Waybill Number: ${quotation.aramexWaybillNumber || 'NOT FOUND'}`);
      
      // Generic Shipping Fields
      console.log('\n🚚 GENERIC SHIPPING FIELDS:');
      console.log(`   Shipping Label: ${quotation.shippingLabel || 'NOT FOUND'}`);
      console.log(`   Tracking Number: ${quotation.trackingNumber || 'NOT FOUND'}`);
      console.log(`   Tracking URL: ${quotation.trackingUrl || 'NOT FOUND'}`);
      
      // Currency Information
      if (quotation.currency) {
        console.log('\n💱 CURRENCY INFORMATION:');
        console.log(`   Currency ID: ${quotation.currency.id || 'N/A'}`);
        console.log(`   Currency Name: ${quotation.currency.name || 'N/A'}`);
        console.log(`   Currency Symbol: ${quotation.currency.symbol || 'N/A'}`);
        console.log(`   Currency Rate: ${quotation.currency.rate || 'N/A'}`);
        console.log(`   Currency Position: ${quotation.currency.position || 'N/A'}`);
      }
      
      // Partner Information
      if (quotation.partner) {
        console.log('\n👤 CUSTOMER INFORMATION:');
        console.log(`   Partner ID: ${quotation.partner.id || 'N/A'}`);
        console.log(`   Partner Name: ${quotation.partner.name || 'N/A'}`);
        console.log(`   Display Name: ${quotation.partner.displayName || 'N/A'}`);
        console.log(`   Email: ${quotation.partner.email || 'N/A'}`);
        console.log(`   Phone: ${quotation.partner.phone || 'N/A'}`);
        console.log(`   Mobile: ${quotation.partner.mobile || 'N/A'}`);
        console.log(`   VAT: ${quotation.partner.vat || 'N/A'}`);
        console.log(`   Is Company: ${quotation.partner.isCompany || false}`);
      }
      
      // Order Lines
      if (quotation.orderLines && quotation.orderLines.length > 0) {
        console.log(`\n📦 ORDER LINES (${quotation.orderLines.length} items):`);
        quotation.orderLines.forEach((line, index) => {
          console.log(`   ${index + 1}. ${line.name || 'N/A'}`);
          console.log(`      Product ID: ${line.product?.id || 'N/A'}`);
          console.log(`      SKU: ${line.product?.sku || 'N/A'}`);
          console.log(`      Quantity: ${line.quantity || 0}`);
          console.log(`      Unit Price: $${line.priceUnit || 0}`);
          console.log(`      Subtotal: $${line.priceSubtotal || 0}`);
          console.log(`      Discount: ${line.discount || 0}%`);
        });
      }
      
      // Shipping Method
      if (quotation.shippingMethod) {
        console.log('\n🚚 SHIPPING METHOD:');
        console.log(`   Method ID: ${quotation.shippingMethod.id || 'N/A'}`);
        console.log(`   Method Name: ${quotation.shippingMethod.name || 'N/A'}`);
        console.log(`   Price: $${quotation.shippingMethod.price || 0}`);
        console.log(`   Description: ${quotation.shippingMethod.description || 'N/A'}`);
        console.log(`   Delivery Type: ${quotation.shippingMethod.deliveryType || 'N/A'}`);
      }
      
      // Payment Method
      if (quotation.paymentMethod) {
        console.log('\n💳 PAYMENT METHOD:');
        console.log(`   Method ID: ${quotation.paymentMethod.id || 'N/A'}`);
        console.log(`   Method Name: ${quotation.paymentMethod.name || 'N/A'}`);
        console.log(`   Code: ${quotation.paymentMethod.code || 'N/A'}`);
        console.log(`   Type: ${quotation.paymentMethod.type || 'N/A'}`);
        console.log(`   Provider: ${quotation.paymentMethod.provider || 'N/A'}`);
      }
      
      // Audit Information
      console.log('\n📝 AUDIT INFORMATION:');
      console.log(`   Create Date: ${quotation.createDate || 'N/A'}`);
      console.log(`   Write Date: ${quotation.writeDate || 'N/A'}`);
      console.log(`   Created By: ${quotation.createUid?.name || 'N/A'}`);
      console.log(`   Modified By: ${quotation.writeUid?.name || 'N/A'}`);
      
      // Check for Aramex Label specifically
      console.log('\n🔍 ARAMEX LABEL ANALYSIS:');
      if (quotation.aramexLabel) {
        console.log(`✅ ARAMEX LABEL FOUND: ${quotation.aramexLabel}`);
        console.log(`📋 Label Type: ${typeof quotation.aramexLabel}`);
        console.log(`📏 Label Length: ${quotation.aramexLabel.length} characters`);
      } else {
        console.log('❌ ARAMEX LABEL NOT FOUND OR EMPTY');
        console.log('🔍 Checking alternative field names...');
        
        // Check for alternative field names
        const alternativeFields = [
          'aramex_label', 'aramexLabel', 'shipping_label', 'shippingLabel',
          'label', 'delivery_label', 'carrier_label', 'tracking_label'
        ];
        
        alternativeFields.forEach(field => {
          if (quotation[field]) {
            console.log(`✅ Found alternative field: ${field} = ${quotation[field]}`);
          }
        });
      }
      
      return {
        success: true,
        quotation: quotation,
        hasAramexLabel: !!quotation.aramexLabel,
        aramexLabelValue: quotation.aramexLabel
      };
    } else {
      console.log('❌ No quotation data found');
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error exploring quotation fields:', error.message);
    if (error.message.includes('Cannot query field')) {
      console.log('🔍 Some fields may not exist in the schema');
      console.log('📋 Error details:', error.message);
    }
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  exploreQuotationFields()
    .then(result => {
      console.log(result.success ? '\n🎉 Exploration COMPLETED' : '\n💥 Exploration FAILED');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { exploreQuotationFields };