/**
 * Discover Odoo GraphQL Schema
 * اكتشاف مخطط GraphQL في Odoo
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
};

console.log('🔍 Discovering Odoo GraphQL Schema...');
console.log('====================================');

function discoverSchema() {
  return new Promise((resolve) => {
    const query = `
      query IntrospectionQuery {
        __schema {
          queryType { name }
          mutationType { name }
          subscriptionType { name }
          types {
            ...FullType
          }
        }
      }

      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }

      fragment InputValue on __InputValue {
        name
        description
        type { ...TypeRef }
        defaultValue
      }

      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
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
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.data && response.data.__schema) {
            const schema = response.data.__schema;
            console.log(`✅ Schema Discovery: SUCCESS`);
            console.log(`📊 Total Types: ${schema.types.length}`);
            
            // Find Query type
            const queryType = schema.types.find(t => t.name === schema.queryType.name);
            if (queryType) {
              console.log(`\n🔍 Available Query Fields:`);
              queryType.fields.slice(0, 20).forEach(field => {
                console.log(`   - ${field.name}: ${getTypeString(field.type)}`);
              });
              
              if (queryType.fields.length > 20) {
                console.log(`   ... and ${queryType.fields.length - 20} more fields`);
              }
            }
            
            // Look for Product-related types
            console.log(`\n📦 Product-related Types:`);
            const productTypes = schema.types.filter(t => 
              t.name && t.name.toLowerCase().includes('product')
            );
            productTypes.forEach(type => {
              console.log(`   - ${type.name} (${type.kind})`);
              if (type.fields && type.fields.length > 0) {
                console.log(`     Fields: ${type.fields.slice(0, 5).map(f => f.name).join(', ')}${type.fields.length > 5 ? '...' : ''}`);
              }
            });
            
            // Look for Category-related types
            console.log(`\n📂 Category-related Types:`);
            const categoryTypes = schema.types.filter(t => 
              t.name && t.name.toLowerCase().includes('categor')
            );
            categoryTypes.forEach(type => {
              console.log(`   - ${type.name} (${type.kind})`);
              if (type.fields && type.fields.length > 0) {
                console.log(`     Fields: ${type.fields.slice(0, 5).map(f => f.name).join(', ')}${type.fields.length > 5 ? '...' : ''}`);
              }
            });
            
            // Save full schema
            require('fs').writeFileSync(
              'tests/reports/real-data-validation/odoo-schema.json',
              JSON.stringify(response.data, null, 2)
            );
            
            console.log(`\n✅ Full schema saved to: tests/reports/real-data-validation/odoo-schema.json`);
            
            resolve({
              success: true,
              schema: response.data.__schema,
              queryFields: queryType ? queryType.fields : [],
              productTypes,
              categoryTypes
            });
          } else if (response.errors) {
            console.log(`❌ Schema Discovery Errors:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ No schema data found`);
            resolve({
              success: false,
              error: 'No schema data'
            });
          }
        } catch (err) {
          console.log(`❌ JSON Parse Error: ${err.message}`);
          console.log(`Raw Response: ${data.substring(0, 500)}...`);
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

function getTypeString(type) {
  if (!type) return 'Unknown';
  
  if (type.kind === 'NON_NULL') {
    return getTypeString(type.ofType) + '!';
  } else if (type.kind === 'LIST') {
    return '[' + getTypeString(type.ofType) + ']';
  } else {
    return type.name || 'Unknown';
  }
}

// Create reports directory if it doesn't exist
require('fs').mkdirSync('tests/reports/real-data-validation', { recursive: true });

// Run schema discovery
discoverSchema().then(result => {
  if (result.success) {
    console.log('\n🎉 Schema discovery completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Schema discovery failed.');
    process.exit(1);
  }
}).catch(console.error);