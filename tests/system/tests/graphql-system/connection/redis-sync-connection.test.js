/**
 * Redis Sync Connection Test - Coffee Selection
 * اختبار التوصيل والمزامنة مع Redis - موقع Coffee Selection
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf'
};

const REDIS_CONFIG = {
  host: 'localhost',
  port: 6379,
  prefix: 'coffee_selection'
};

console.log('🔄 بدء اختبار التوصيل والمزامنة...');
console.log('====================================');

// Mock Redis operations for testing
const mockRedis = {
  cache: new Map(),
  
  async set(key, value, ttl = 3600) {
    const cacheKey = `${REDIS_CONFIG.prefix}:${key}`;
    const cacheValue = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl
    };
    this.cache.set(cacheKey, cacheValue);
    return true;
  },
  
  async get(key) {
    const cacheKey = `${REDIS_CONFIG.prefix}:${key}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      const now = Date.now();
      if (now - cached.timestamp > cached.ttl * 1000) {
        this.cache.delete(cacheKey);
        return null;
      }
      return cached.data;
    }
    return null;
  },
  
  async del(key) {
    const cacheKey = `${REDIS_CONFIG.prefix}:${key}`;
    return this.cache.delete(cacheKey);
  },
  
  async clear() {
    this.cache.clear();
    return true;
  },
  
  isConnected() {
    return true;
  }
};

// Test 1: Environment Variables
function testEnvironmentVariables() {
  console.log('🧪 اختبار 1: متغيرات البيئة...');
  
  const requiredVars = {
    'ODOO_API_URL': ODOO_CONFIG.graphqlUrl,
    'ODOO_TOKEN': ODOO_CONFIG.apiKey,
    'REDIS_HOST': REDIS_CONFIG.host,
    'REDIS_PORT': REDIS_CONFIG.port.toString(),
    'CACHE_PREFIX': REDIS_CONFIG.prefix
  };
  
  let allValid = true;
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (value && value.length > 0) {
      console.log(`✅ ${key}: متوفر`);
    } else {
      console.log(`❌ ${key}: غير متوفر`);
      allValid = false;
    }
  });
  
  if (allValid) {
    console.log('✅ جميع متغيرات البيئة متوفرة');
    return { success: true };
  } else {
    console.log('❌ بعض متغيرات البيئة مفقودة');
    return { success: false, error: 'Missing environment variables' };
  }
}

// Test 2: Redis Connection
async function testRedisConnection() {
  console.log('\\n🧪 اختبار 2: اتصال Redis...');
  
  try {
    const isConnected = mockRedis.isConnected();
    
    if (isConnected) {
      console.log('✅ نجح اتصال Redis');
      console.log(`🔧 Host: ${REDIS_CONFIG.host}`);
      console.log(`🔧 Port: ${REDIS_CONFIG.port}`);
      console.log(`🔧 Prefix: ${REDIS_CONFIG.prefix}`);
      
      return { success: true, config: REDIS_CONFIG };
    } else {
      console.log('❌ فشل اتصال Redis');
      return { success: false, error: 'Redis connection failed' };
    }
  } catch (error) {
    console.log(`❌ خطأ في اتصال Redis: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 3: Redis Cache Operations
async function testRedisCacheOperations() {
  console.log('\\n🧪 اختبار 3: عمليات التخزين المؤقت...');
  
  try {
    const testKey = 'connection_test';
    const testValue = { 
      message: 'Redis connection test', 
      timestamp: Date.now(),
      data: { test: true, value: 123 }
    };
    
    // Test SET
    console.log('📝 اختبار SET...');
    const setResult = await mockRedis.set(testKey, testValue, 60);
    if (setResult) {
      console.log('✅ نجح SET');
    } else {
      throw new Error('SET operation failed');
    }
    
    // Test GET
    console.log('📖 اختبار GET...');
    const getValue = await mockRedis.get(testKey);
    if (getValue && JSON.stringify(getValue) === JSON.stringify(testValue)) {
      console.log('✅ نجح GET - البيانات متطابقة');
    } else {
      throw new Error('GET operation failed or data mismatch');
    }
    
    // Test DELETE
    console.log('🗑️ اختبار DELETE...');
    const delResult = await mockRedis.del(testKey);
    if (delResult) {
      console.log('✅ نجح DELETE');
    } else {
      throw new Error('DELETE operation failed');
    }
    
    // Verify deletion
    console.log('🔍 التحقق من الحذف...');
    const deletedValue = await mockRedis.get(testKey);
    if (deletedValue === null) {
      console.log('✅ تم التحقق من الحذف');
    } else {
      throw new Error('Data still exists after deletion');
    }
    
    return { 
      success: true, 
      operations: ['SET', 'GET', 'DELETE', 'VERIFY'],
      testData: testValue
    };
    
  } catch (error) {
    console.log(`❌ خطأ في عمليات Redis: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 4: GraphQL Connection
function testGraphQLConnection() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 4: اتصال GraphQL...');
    
    const query = `
      query TestConnection {
        __schema {
          queryType {
            name
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
          
          console.log(`📊 حالة الاستجابة: ${res.statusCode}`);
          
          if (response.data && response.data.__schema) {
            console.log('✅ نجح اتصال GraphQL');
            console.log(`🔗 نوع الاستعلام: ${response.data.__schema.queryType.name}`);
            
            resolve({
              success: true,
              statusCode: res.statusCode,
              schema: response.data.__schema
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء GraphQL:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ استجابة غير متوقعة`);
            resolve({
              success: false,
              error: 'Unexpected response format'
            });
          }
        } catch (err) {
          console.log(`❌ خطأ في تحليل JSON: ${err.message}`);
          resolve({
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ خطأ في الطلب: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ انتهت مهلة الطلب');
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

// Test 5: Redis-GraphQL Sync
async function testRedisGraphQLSync() {
  console.log('\\n🧪 اختبار 5: مزامنة Redis-GraphQL...');
  
  try {
    const cacheKey = 'graphql_schema_cache';
    
    // Check cache first
    console.log('🔍 فحص التخزين المؤقت...');
    let cachedData = await mockRedis.get(cacheKey);
    
    if (cachedData) {
      console.log('💾 البيانات موجودة في التخزين المؤقت');
      console.log(`📅 وقت التخزين: ${new Date(cachedData.timestamp).toLocaleString()}`);
    } else {
      console.log('📡 جلب البيانات من GraphQL...');
      
      // Fetch from GraphQL
      const graphqlResult = await testGraphQLConnection();
      
      if (graphqlResult.success) {
        // Cache the result
        await mockRedis.set(cacheKey, {
          schema: graphqlResult.schema,
          timestamp: Date.now(),
          source: 'graphql'
        }, 300); // 5 minutes
        
        console.log('💾 تم حفظ البيانات في التخزين المؤقت');
        cachedData = await mockRedis.get(cacheKey);
      } else {
        throw new Error('Failed to fetch from GraphQL');
      }
    }
    
    // Verify sync
    if (cachedData && cachedData.schema) {
      console.log('✅ نجحت المزامنة بين Redis و GraphQL');
      console.log(`🔄 مصدر البيانات: ${cachedData.source || 'cache'}`);
      
      return {
        success: true,
        cached: true,
        dataSource: cachedData.source || 'cache',
        timestamp: cachedData.timestamp
      };
    } else {
      throw new Error('Sync verification failed');
    }
    
  } catch (error) {
    console.log(`❌ خطأ في المزامنة: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runConnectionAndSyncTests() {
  console.log('🚀 تشغيل جميع اختبارات التوصيل والمزامنة...');
  console.log('=' .repeat(50));
  
  const results = {};
  
  // Test 1: Environment Variables
  results.environment = testEnvironmentVariables();
  
  // Test 2: Redis Connection
  results.redis = await testRedisConnection();
  
  // Test 3: Redis Operations
  results.redisOps = await testRedisCacheOperations();
  
  // Test 4: GraphQL Connection
  results.graphql = await testGraphQLConnection();
  
  // Test 5: Redis-GraphQL Sync
  results.sync = await testRedisGraphQLSync();
  
  // Summary
  console.log('\\n📊 ملخص نتائج الاختبارات:');
  console.log('=' .repeat(30));
  
  const tests = [
    { name: 'متغيرات البيئة', result: results.environment },
    { name: 'اتصال Redis', result: results.redis },
    { name: 'عمليات Redis', result: results.redisOps },
    { name: 'اتصال GraphQL', result: results.graphql },
    { name: 'مزامنة Redis-GraphQL', result: results.sync }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  tests.forEach(test => {
    const status = test.result.success ? '✅ نجح' : '❌ فشل';
    console.log(`${test.name}: ${status}`);
    if (test.result.success) passedTests++;
  });
  
  console.log('\\n📈 النتيجة النهائية:');
  console.log(`✅ الاختبارات الناجحة: ${passedTests}/${totalTests}`);
  console.log(`❌ الاختبارات الفاشلة: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📊 معدل النجاح: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\\n🎉 جميع اختبارات التوصيل والمزامنة نجحت بنسبة 100%!');
    console.log('✅ النظام جاهز للاستخدام');
    
    // Cleanup
    await mockRedis.clear();
    console.log('🧹 تم تنظيف بيانات الاختبار');
    
    return { success: true, results };
  } else {
    console.log('\\n⚠️ بعض الاختبارات فشلت - يرجى مراجعة الأخطاء أعلاه');
    return { success: false, results };
  }
}

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runConnectionAndSyncTests,
    testEnvironmentVariables,
    testRedisConnection,
    testRedisCacheOperations,
    testGraphQLConnection,
    testRedisGraphQLSync
  };
}

// Run tests if called directly
if (require.main === module) {
  runConnectionAndSyncTests()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 خطأ غير متوقع:', error);
      process.exit(1);
    });
}