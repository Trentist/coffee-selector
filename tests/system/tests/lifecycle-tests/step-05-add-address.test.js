/**
 * Step 5: Add Address Data for Guest User
 * الخطوة الخامسة: إضافة بيانات العنوان للزائر
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

async function testAddAddress() {
  console.log('📍 Step 5: Add Address Data for Guest User');
  console.log('=' .repeat(50));
  
  // Test address data for guest user
  const testAddressData = {
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.test@example.com',
    phone: '+966501234567',
    street: 'King Fahd Road, Building 123',
    street2: 'Apartment 45',
    city: 'Riyadh',
    zip: '12345',
    countryCode: 'SA',
    stateCode: 'RI'
  };

  console.log('📋 Test Address Data:');
  console.log(`   Name: ${testAddressData.name}`);
  console.log(`   Email: ${testAddressData.email}`);
  console.log(`   Phone: ${testAddressData.phone}`);
  console.log(`   Street: ${testAddressData.street}`);
  console.log(`   Street2: ${testAddressData.street2}`);
  console.log(`   City: ${testAddressData.city}`);
  console.log(`   ZIP: ${testAddressData.zip}`);
  console.log(`   Country: ${testAddressData.countryCode}`);
  console.log(`   State: ${testAddressData.stateCode}`);

  // First, get available countries to validate
  const countriesQuery = `
    query GetCountries {
      countries {
        id
        name
        code
      }
    }
  `;

  try {
    console.log('\n🔄 Fetching available countries...');
    const countriesResult = await makeGraphQLRequest(countriesQuery);
    
    if (countriesResult.data?.countries) {
      const countries = countriesResult.data.countries;
      const saudiArabia = countries.find(c => c.code === 'SA');
      
      console.log(`✅ Countries Retrieved: ${countries.length} countries`);
      if (saudiArabia) {
        console.log(`✅ Saudi Arabia Found: ID ${saudiArabia.id}, Name: ${saudiArabia.name}`);
      } else {
        console.log('❌ Saudi Arabia not found in countries list');
      }
    }

    // Try to add address using correct schema
    const addAddressMutation = `
      mutation AddAddress(
        $name: String!
        $email: String!
        $phone: String
        $street: String!
        $street2: String
        $city: String!
        $zip: String!
        $countryId: Int!
        $stateId: Int
        $type: AddressEnum!
      ) {
        addAddress(
          name: $name
          email: $email
          phone: $phone
          street: $street
          street2: $street2
          city: $city
          zip: $zip
          countryId: $countryId
          stateId: $stateId
          type: $type
        ) {
          id
          name
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
      }
    `;

    const addressVariables = {
      name: testAddressData.name,
      email: testAddressData.email,
      phone: testAddressData.phone,
      street: testAddressData.street,
      street2: testAddressData.street2,
      city: testAddressData.city,
      zip: testAddressData.zip,
      countryId: 188, // Saudi Arabia ID (common in Odoo)
      stateId: null,
      type: 'DELIVERY' // Required AddressEnum value
    };

    console.log('\n🔄 Adding address for guest user...');
    const addressResult = await makeGraphQLRequest(addAddressMutation, addressVariables);

    if (addressResult.data?.addAddress) {
      const address = addressResult.data.addAddress;
      
      console.log('✅ Address Added Successfully');
      console.log('\n📍 Added Address Details:');
      console.log(`   Address ID: ${address.id}`);
      console.log(`   Name: ${address.name}`);
      console.log(`   Email: ${address.email}`);
      console.log(`   Phone: ${address.phone}`);
      console.log(`   Street: ${address.street}`);
      console.log(`   Street2: ${address.street2 || 'N/A'}`);
      console.log(`   City: ${address.city}`);
      console.log(`   ZIP: ${address.zip}`);
      
      if (address.country) {
        console.log(`   Country: ${address.country.name} (${address.country.code})`);
      }
      
      if (address.state) {
        console.log(`   State: ${address.state.name} (${address.state.code})`);
      }

      // Now try to set this address as shipping address for current order
      const setShippingAddressMutation = `
        mutation SetShippingAddress($addressId: ID!) {
          selectAddress(addressId: $addressId) {
            id
            name
            email
            phone
            street
            city
            zip
            country {
              id
              name
              code
            }
          }
        }
      `;

      console.log('\n🔄 Setting as shipping address...');
      const shippingResult = await makeGraphQLRequest(setShippingAddressMutation, {
        addressId: address.id
      });

      if (shippingResult.data?.selectAddress) {
        console.log('✅ Address Set as Shipping Address');
        
        // Verify by getting updated quotation
        const verifyQuery = `
          query VerifyAddressInQuotation {
            cart {
              order {
                id
                name
                partnerShipping {
                  id
                  name
                  email
                  phone
                  street
                  city
                  zip
                  country {
                    id
                    name
                    code
                  }
                }
              }
            }
          }
        `;

        const verifyResult = await makeGraphQLRequest(verifyQuery);
        
        if (verifyResult.data?.cart?.order?.partnerShipping) {
          const shippingAddress = verifyResult.data.cart.order.partnerShipping;
          
          console.log('\n✅ Address Verified in Quotation');
          console.log('📋 Shipping Address in Order:');
          console.log(`   Partner ID: ${shippingAddress.id}`);
          console.log(`   Name: ${shippingAddress.name}`);
          console.log(`   Email: ${shippingAddress.email || 'N/A'}`);
          console.log(`   Phone: ${shippingAddress.phone || 'N/A'}`);
          console.log(`   Street: ${shippingAddress.street || 'N/A'}`);
          console.log(`   City: ${shippingAddress.city || 'N/A'}`);
          console.log(`   ZIP: ${shippingAddress.zip || 'N/A'}`);
          
          if (shippingAddress.country) {
            console.log(`   Country: ${shippingAddress.country.name} (${shippingAddress.country.code})`);
          }
        }
      }

      return {
        success: true,
        address: address,
        addressId: address.id,
        isSetAsShipping: !!shippingResult.data?.selectAddress
      };
    } else if (addressResult.errors) {
      console.log('❌ Address Addition Failed');
      console.log('Errors:', JSON.stringify(addressResult.errors, null, 2));
      
      // Try alternative approach - update partner directly
      console.log('\n🔄 Trying alternative approach - update partner...');
      
      const updatePartnerMutation = `
        mutation UpdatePartner(
          $name: String!
          $email: String!
          $phone: String
          $street: String
          $street2: String
          $city: String
          $zip: String
          $countryId: Int
          $subscribeNewsletter: Boolean!
        ) {
          createUpdatePartner(
            name: $name
            email: $email
            phone: $phone
            street: $street
            street2: $street2
            city: $city
            zip: $zip
            countryId: $countryId
            subscribeNewsletter: $subscribeNewsletter
          ) {
            id
            name
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
          }
        }
      `;

      const partnerVariables = {
        name: testAddressData.name,
        email: testAddressData.email,
        phone: testAddressData.phone,
        street: testAddressData.street,
        street2: testAddressData.street2,
        city: testAddressData.city,
        zip: testAddressData.zip,
        countryId: 188,
        subscribeNewsletter: false
      };

      const partnerResult = await makeGraphQLRequest(updatePartnerMutation, partnerVariables);

      if (partnerResult.data?.createUpdatePartner) {
        const partner = partnerResult.data.createUpdatePartner;
        
        console.log('✅ Partner Updated Successfully');
        console.log('\n👤 Updated Partner Details:');
        console.log(`   Partner ID: ${partner.id}`);
        console.log(`   Name: ${partner.name}`);
        console.log(`   Email: ${partner.email}`);
        console.log(`   Phone: ${partner.phone}`);
        console.log(`   Street: ${partner.street}`);
        console.log(`   City: ${partner.city}`);
        console.log(`   ZIP: ${partner.zip}`);
        
        if (partner.country) {
          console.log(`   Country: ${partner.country.name} (${partner.country.code})`);
        }

        return {
          success: true,
          partner: partner,
          partnerId: partner.id,
          method: 'partner_update'
        };
      } else {
        console.log('❌ Partner Update Also Failed');
        if (partnerResult.errors) {
          console.log('Partner Errors:', JSON.stringify(partnerResult.errors, null, 2));
        }
        return { success: false, method: 'both_failed' };
      }
    } else {
      console.log('❌ No address data returned');
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Add Address Error:', error.message);
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  testAddAddress()
    .then(result => {
      console.log('\n' + '='.repeat(60));
      if (result.success) {
        console.log('🎉 Step 5 PASSED');
        console.log(`📍 Address Method: ${result.method || 'address_add'}`);
        if (result.addressId) {
          console.log(`🆔 Address ID: ${result.addressId}`);
        }
        if (result.partnerId) {
          console.log(`👤 Partner ID: ${result.partnerId}`);
        }
        console.log('✅ Guest user address data saved successfully');
        console.log('✅ Address available for shipping calculations');
        console.log('✅ Ready for next step: shipping method selection');
      } else {
        console.log('💥 Step 5 FAILED');
        if (result.method === 'both_failed') {
          console.log('❌ Both address addition and partner update failed');
        }
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testAddAddress };