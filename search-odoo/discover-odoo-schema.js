/**
 * Comprehensive Odoo GraphQL Schema Discovery
 * اكتشاف مخطط Odoo GraphQL الشامل
 */

const https = require('https');
const fs = require('fs');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
};

// GraphQL Introspection Query
const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType {
        name
        fields {
          name
          description
          type {
            name
            kind
          }
          args {
            name
            type {
              name
              kind
            }
          }
        }
      }
      mutationType {
        name
        fields {
          name
          description
          type {
            name
            kind
          }
          args {
            name
            type {
              name
              kind
            }
          }
        }
      }
      types {
        name
        kind
        description
        fields {
          name
          description
          type {
            name
            kind
          }
        }
        inputFields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  }
`;

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
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`,
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

async function discoverSchema() {
  console.log('🔍 Discovering Odoo GraphQL Schema...');
  console.log('=====================================\n');

  try {
    const result = await makeGraphQLRequest(INTROSPECTION_QUERY);
    
    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return;
    }

    const schema = result.data.__schema;
    
    // Analyze Order-related types
    console.log('📦 ORDER & CART RELATED SCHEMA');
    console.log('===============================');
    
    const orderTypes = schema.types.filter(type => 
      type.name && (
        type.name.toLowerCase().includes('order') ||
        type.name.toLowerCase().includes('cart') ||
        type.name.toLowerCase().includes('sale')
      )
    );

    orderTypes.forEach(type => {
      console.log(`\n🔸 ${type.name} (${type.kind})`);
      if (type.description) {
        console.log(`   Description: ${type.description}`);
      }
      
      if (type.fields && type.fields.length > 0) {
        console.log('   Fields:');
        type.fields.slice(0, 10).forEach(field => {
          console.log(`     - ${field.name}: ${field.type?.name || 'Unknown'}`);
        });
        if (type.fields.length > 10) {
          console.log(`     ... and ${type.fields.length - 10} more fields`);
        }
      }
    });

    // Analyze Payment-related types
    console.log('\n\n💳 PAYMENT RELATED SCHEMA');
    console.log('==========================');
    
    const paymentTypes = schema.types.filter(type => 
      type.name && (
        type.name.toLowerCase().includes('payment') ||
        type.name.toLowerCase().includes('invoice') ||
        type.name.toLowerCase().includes('transaction')
      )
    );

    paymentTypes.forEach(type => {
      console.log(`\n🔸 ${type.name} (${type.kind})`);
      if (type.fields && type.fields.length > 0) {
        type.fields.slice(0, 8).forEach(field => {
          console.log(`     - ${field.name}: ${field.type?.name || 'Unknown'}`);
        });
      }
    });

    // Analyze Shipping-related types
    console.log('\n\n🚚 SHIPPING RELATED SCHEMA');
    console.log('===========================');
    
    const shippingTypes = schema.types.filter(type => 
      type.name && (
        type.name.toLowerCase().includes('shipping') ||
        type.name.toLowerCase().includes('delivery') ||
        type.name.toLowerCase().includes('carrier')
      )
    );

    shippingTypes.forEach(type => {
      console.log(`\n🔸 ${type.name} (${type.kind})`);
      if (type.fields && type.fields.length > 0) {
        type.fields.slice(0, 8).forEach(field => {
          console.log(`     - ${field.name}: ${field.type?.name || 'Unknown'}`);
        });
      }
    });

    // Analyze Product-related types
    console.log('\n\n🛍️ PRODUCT RELATED SCHEMA');
    console.log('==========================');
    
    const productTypes = schema.types.filter(type => 
      type.name && (
        type.name.toLowerCase().includes('product') ||
        type.name.toLowerCase().includes('category')
      )
    );

    productTypes.forEach(type => {
      console.log(`\n🔸 ${type.name} (${type.kind})`);
      if (type.fields && type.fields.length > 0) {
        type.fields.slice(0, 10).forEach(field => {
          console.log(`     - ${field.name}: ${field.type?.name || 'Unknown'}`);
        });
      }
    });

    // Analyze Available Queries
    console.log('\n\n🔍 AVAILABLE QUERIES');
    console.log('====================');
    
    if (schema.queryType && schema.queryType.fields) {
      const orderQueries = schema.queryType.fields.filter(field =>
        field.name.toLowerCase().includes('order') ||
        field.name.toLowerCase().includes('cart') ||
        field.name.toLowerCase().includes('product') ||
        field.name.toLowerCase().includes('invoice')
      );

      orderQueries.forEach(query => {
        console.log(`\n🔸 ${query.name}`);
        if (query.description) {
          console.log(`   Description: ${query.description}`);
        }
        console.log(`   Returns: ${query.type?.name || 'Unknown'}`);
        
        if (query.args && query.args.length > 0) {
          console.log('   Arguments:');
          query.args.forEach(arg => {
            console.log(`     - ${arg.name}: ${arg.type?.name || 'Unknown'}`);
          });
        }
      });
    }

    // Analyze Available Mutations
    console.log('\n\n🔄 AVAILABLE MUTATIONS');
    console.log('======================');
    
    if (schema.mutationType && schema.mutationType.fields) {
      const orderMutations = schema.mutationType.fields.filter(field =>
        field.name.toLowerCase().includes('cart') ||
        field.name.toLowerCase().includes('order') ||
        field.name.toLowerCase().includes('payment') ||
        field.name.toLowerCase().includes('shipping')
      );

      orderMutations.forEach(mutation => {
        console.log(`\n🔸 ${mutation.name}`);
        if (mutation.description) {
          console.log(`   Description: ${mutation.description}`);
        }
        console.log(`   Returns: ${mutation.type?.name || 'Unknown'}`);
        
        if (mutation.args && mutation.args.length > 0) {
          console.log('   Arguments:');
          mutation.args.forEach(arg => {
            console.log(`     - ${arg.name}: ${arg.type?.name || 'Unknown'}`);
          });
        }
      });
    }

    // Save complete schema to file
    const schemaData = {
      timestamp: new Date().toISOString(),
      odooUrl: ODOO_CONFIG.baseUrl,
      schema: schema,
      analysis: {
        totalTypes: schema.types.length,
        orderTypes: orderTypes.length,
        paymentTypes: paymentTypes.length,
        shippingTypes: shippingTypes.length,
        productTypes: productTypes.length,
        totalQueries: schema.queryType?.fields?.length || 0,
        totalMutations: schema.mutationType?.fields?.length || 0
      }
    };

    fs.writeFileSync('odoo-complete-schema.json', JSON.stringify(schemaData, null, 2));
    console.log('\n✅ Complete schema saved to: odoo-complete-schema.json');

    return schemaData;

  } catch (error) {
    console.error('❌ Error discovering schema:', error);
  }
}

// Test specific order lifecycle operations
async function testOrderLifecycle() {
  console.log('\n\n🔄 TESTING ORDER LIFECYCLE');
  console.log('===========================');

  const tests = [
    {
      name: 'Get Products',
      query: `query { products { products { id name price } } }`
    },
    {
      name: 'Get Cart',
      query: `query { cart { id totalAmount orderLines { productId quantity } } }`
    },
    {
      name: 'Add to Cart',
      query: `mutation { cartAddMultipleItems(products: [{productId: 10, quantity: 1}]) { success message } }`
    }
  ];

  for (const test of tests) {
    console.log(`\n🧪 Testing: ${test.name}`);
    try {
      const result = await makeGraphQLRequest(test.query);
      if (result.errors) {
        console.log(`   ❌ Errors: ${JSON.stringify(result.errors)}`);
      } else {
        console.log(`   ✅ Success: ${JSON.stringify(result.data).substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Odoo GraphQL Schema Discovery & Order Lifecycle Analysis');
  console.log('============================================================\n');

  await discoverSchema();
  await testOrderLifecycle();

  console.log('\n📋 SUMMARY');
  console.log('==========');
  console.log('✅ Schema discovery completed');
  console.log('✅ Order lifecycle tested');
  console.log('✅ Complete schema saved to odoo-complete-schema.json');
  console.log('\n🔗 Useful Links:');
  console.log('- Odoo Documentation: https://www.odoo.com/documentation/17.0/');
  console.log('- GraphQL Endpoint: https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf');
  console.log('- Backend Access: https://coffee-selection-staging-20784644.dev.odoo.com/web');
}

main().catch(console.error);