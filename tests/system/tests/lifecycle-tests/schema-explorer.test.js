/**
 * GraphQL Schema Explorer Test
 * اختبار استكشاف مخطط GraphQL
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

async function exploreGraphQLSchema() {
  console.log('🔍 GraphQL Schema Explorer');
  console.log('=' .repeat(50));
  
  // Introspection query to get schema information
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        types {
          name
          kind
          description
          fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
            description
          }
        }
        queryType {
          name
          fields {
            name
            type {
              name
            }
            description
          }
        }
        mutationType {
          name
          fields {
            name
            type {
              name
            }
            description
          }
        }
      }
    }
  `;

  try {
    console.log('🔄 Fetching GraphQL schema...');
    const result = await makeGraphQLRequest(introspectionQuery);
    
    if (result.data?.__schema) {
      const schema = result.data.__schema;
      
      console.log('✅ Schema Retrieved Successfully');
      console.log(`📊 Total Types: ${schema.types.length}`);
      
      // Find Order type
      const orderType = schema.types.find(type => type.name === 'Order');
      if (orderType) {
        console.log('\n📋 ORDER TYPE FIELDS:');
        console.log('=' .repeat(40));
        
        orderType.fields.forEach(field => {
          const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
          console.log(`   ${field.name}: ${typeName}`);
        });
        
        // Look for shipping/aramex related fields
        console.log('\n🚚 SHIPPING RELATED FIELDS IN ORDER:');
        const shippingFields = orderType.fields.filter(field => 
          field.name.toLowerCase().includes('ship') ||
          field.name.toLowerCase().includes('delivery') ||
          field.name.toLowerCase().includes('carrier') ||
          field.name.toLowerCase().includes('track') ||
          field.name.toLowerCase().includes('aramex') ||
          field.name.toLowerCase().includes('label')
        );
        
        if (shippingFields.length > 0) {
          shippingFields.forEach(field => {
            const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
            console.log(`   ✅ ${field.name}: ${typeName}`);
          });
        } else {
          console.log('   ❌ No shipping/aramex fields found in Order type');
        }
      }
      
      // Find Cart type
      const cartType = schema.types.find(type => type.name === 'Cart');
      if (cartType) {
        console.log('\n🛒 CART TYPE FIELDS:');
        console.log('=' .repeat(40));
        
        cartType.fields.forEach(field => {
          const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
          console.log(`   ${field.name}: ${typeName}`);
        });
      }
      
      // Look for any Aramex-related types
      console.log('\n🔍 ARAMEX RELATED TYPES:');
      console.log('=' .repeat(40));
      
      const aramexTypes = schema.types.filter(type => 
        type.name.toLowerCase().includes('aramex') ||
        type.name.toLowerCase().includes('shipping') ||
        type.name.toLowerCase().includes('delivery') ||
        type.name.toLowerCase().includes('carrier')
      );
      
      if (aramexTypes.length > 0) {
        aramexTypes.forEach(type => {
          console.log(`\n📦 ${type.name} (${type.kind}):`);
          if (type.fields) {
            type.fields.forEach(field => {
              const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
              console.log(`   ${field.name}: ${typeName}`);
            });
          }
        });
      } else {
        console.log('   ❌ No Aramex-related types found');
      }
      
      // Look for available queries
      console.log('\n📋 AVAILABLE QUERIES:');
      console.log('=' .repeat(40));
      
      if (schema.queryType?.fields) {
        schema.queryType.fields.forEach(field => {
          console.log(`   ${field.name}: ${field.type.name}`);
        });
      }
      
      // Look for available mutations
      console.log('\n🔄 AVAILABLE MUTATIONS:');
      console.log('=' .repeat(40));
      
      if (schema.mutationType?.fields) {
        schema.mutationType.fields.forEach(field => {
          console.log(`   ${field.name}: ${field.type.name}`);
        });
      }
      
      return {
        success: true,
        schema: schema,
        hasAramexFields: aramexTypes.length > 0,
        orderFields: orderType?.fields || [],
        cartFields: cartType?.fields || []
      };
    } else {
      console.log('❌ Failed to retrieve schema');
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Schema exploration error:', error.message);
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  exploreGraphQLSchema()
    .then(result => {
      console.log('\n' + '='.repeat(60));
      if (result.success) {
        console.log('🎉 Schema Exploration COMPLETED');
        if (result.hasAramexFields) {
          console.log('✅ Aramex fields found in schema');
        } else {
          console.log('❌ No Aramex fields found in current schema');
          console.log('💡 Aramex fields may need to be added to the Odoo GraphQL schema');
        }
      } else {
        console.log('💥 Schema Exploration FAILED');
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { exploreGraphQLSchema };