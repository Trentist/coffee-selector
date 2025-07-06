/**
 * Simple Odoo Connection Test
 * اختبار اتصال Odoo البسيط
 */

const https = require('https');
const { URL } = require('url');

// Odoo configuration
const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf'
};

console.log('🚀 Starting Odoo Connection Test...');
console.log('================================');

// Test basic connection
function testOdooConnection() {
  return new Promise((resolve, reject) => {
    const url = new URL(ODOO_CONFIG.baseUrl);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log(`✅ Basic Connection: ${res.statusCode} ${res.statusMessage}`);
      resolve({
        success: true,
        status: res.statusCode,
        message: res.statusMessage
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Connection Error: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ Connection Timeout');
      req.destroy();
      resolve({
        success: false,
        error: 'Connection timeout'
      });
    });

    req.end();
  });
}

// Test GraphQL endpoint
function testGraphQLEndpoint() {
  return new Promise((resolve, reject) => {
    const url = new URL(ODOO_CONFIG.graphqlUrl);
    
    const postData = JSON.stringify({
      query: '{ __schema { types { name } } }'
    });

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
      timeout: 15000
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
            console.log(`✅ GraphQL Connection: SUCCESS`);
            console.log(`📊 Available Types: ${response.data.__schema.types.length}`);
            resolve({
              success: true,
              typesCount: response.data.__schema.types.length,
              response: response
            });
          } else if (response.errors) {
            console.log(`❌ GraphQL Errors:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ Unexpected Response:`, response);
            resolve({
              success: false,
              error: 'Unexpected response format'
            });
          }
        } catch (err) {
          console.log(`❌ JSON Parse Error: ${err.message}`);
          console.log(`Raw Response: ${data.substring(0, 200)}...`);
          resolve({
            success: false,
            error: 'Invalid JSON response',
            rawResponse: data.substring(0, 200)
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ GraphQL Request Error: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ GraphQL Request Timeout');
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

// Run tests
async function runTests() {
  console.log('🔍 Testing Basic Connection...');
  const basicTest = await testOdooConnection();
  
  console.log('\n🔍 Testing GraphQL Endpoint...');
  const graphqlTest = await testGraphQLEndpoint();
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`Basic Connection: ${basicTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`GraphQL Endpoint: ${graphqlTest.success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (basicTest.success && graphqlTest.success) {
    console.log('\n🎉 All tests passed! Odoo is ready for testing.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed. Check configuration.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(console.error);