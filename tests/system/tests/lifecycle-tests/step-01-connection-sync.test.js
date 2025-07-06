/**
 * Step 1: Connection and Sync Test
 * الخطوة الأولى: اختبار الاتصال والتزامن
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

async function testConnectionAndSync() {
  console.log('🔗 Step 1: Connection and Sync Test');
  console.log('=' .repeat(40));
  
  const startTime = Date.now();
  
  // Test basic connection
  const connectionQuery = `
    query TestConnection {
      __schema {
        queryType {
          name
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(connectionQuery);
    const responseTime = Date.now() - startTime;
    
    if (result.data && result.data.__schema) {
      console.log('✅ GraphQL Connection: SUCCESS');
      console.log(`⏱️  Response Time: ${responseTime}ms`);
      console.log(`🔗 Endpoint: ${TEST_CONFIG.odoo.graphqlUrl}`);
      console.log(`🔑 API Key: ${TEST_CONFIG.odoo.apiKey.substring(0, 8)}...`);
      
      // Test sync with real data
      const syncQuery = `
        query TestSync {
          products {
            products {
              id
              name
              price
            }
          }
        }
      `;
      
      const syncResult = await makeGraphQLRequest(syncQuery);
      
      if (syncResult.data && syncResult.data.products) {
        console.log('✅ Data Sync: SUCCESS');
        console.log(`📦 Products Available: ${syncResult.data.products.products.length}`);
        return true;
      } else {
        console.log('❌ Data Sync: FAILED');
        return false;
      }
    } else {
      console.log('❌ GraphQL Connection: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    return false;
  }
}

if (require.main === module) {
  testConnectionAndSync()
    .then(success => {
      console.log(success ? '\n🎉 Step 1 PASSED' : '\n💥 Step 1 FAILED');
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testConnectionAndSync };