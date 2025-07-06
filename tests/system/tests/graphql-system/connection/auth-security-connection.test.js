/**
 * Authentication & Security Connection Test - Coffee Selection
 * اختبار اتصال المصادقة والأمان - موقع Coffee Selection
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  adminEmail: 'mohamed@coffeeselection.com',
  adminPassword: 'Montada@1'
};

console.log('🔐 بدء اختبار المصادقة والأمان...');
console.log('==================================');

// Test 1: Token Validation
function testTokenValidation() {
  console.log('🧪 اختبار 1: التحقق من صحة التوكن...');
  
  const token = ODOO_CONFIG.apiKey;
  
  if (!token) {
    console.log('❌ التوكن غير موجود');
    return { success: false, error: 'Token not found' };
  }
  
  if (token.length < 20) {
    console.log('❌ التوكن قصير جداً');
    return { success: false, error: 'Token too short' };
  }
  
  if (!/^[a-f0-9]+$/i.test(token)) {
    console.log('❌ تنسيق التوكن غير صحيح');
    return { success: false, error: 'Invalid token format' };
  }
  
  console.log('✅ التوكن صحيح');
  console.log(`🔑 طول التوكن: ${token.length} حرف`);
  console.log(`🔑 بداية التوكن: ${token.substring(0, 8)}...`);
  
  return { 
    success: true, 
    tokenLength: token.length,
    tokenPreview: token.substring(0, 8) + '...'
  };
}

// Test 2: Login Authentication
function testLoginAuthentication() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 2: تسجيل الدخول...');
    
    const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          success
          message
          user {
            id
            name
            email
            isActive
          }
          token
        }
      }
    `;

    const variables = {
      email: ODOO_CONFIG.adminEmail,
      password: ODOO_CONFIG.adminPassword
    };

    const postData = JSON.stringify({ 
      query: loginMutation, 
      variables: variables 
    });
    
    const url = new URL(ODOO_CONFIG.graphqlUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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
          
          if (response.data && response.data.login) {
            const loginResult = response.data.login;
            
            if (loginResult.success) {
              console.log('✅ نجح تسجيل الدخول');
              console.log(`👤 اسم المستخدم: ${loginResult.user.name}`);
              console.log(`📧 البريد الإلكتروني: ${loginResult.user.email}`);
              console.log(`🆔 معرف المستخدم: ${loginResult.user.id}`);
              console.log(`🟢 حالة المستخدم: ${loginResult.user.isActive ? 'نشط' : 'غير نشط'}`);
              
              if (loginResult.token) {
                console.log(`🔑 تم الحصول على توكن: ${loginResult.token.substring(0, 8)}...`);
              }
              
              resolve({
                success: true,
                user: loginResult.user,
                hasToken: !!loginResult.token,
                tokenPreview: loginResult.token ? loginResult.token.substring(0, 8) + '...' : null
              });
            } else {
              console.log(`❌ فشل تسجيل الدخول: ${loginResult.message}`);
              resolve({
                success: false,
                error: loginResult.message
              });
            }
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

// Test 3: Authorized Request
function testAuthorizedRequest() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 3: طلب مصرح به...');
    
    const userQuery = `
      query GetCurrentUser {
        me {
          id
          name
          email
          isActive
          groups {
            id
            name
          }
        }
      }
    `;

    const postData = JSON.stringify({ query: userQuery });
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
          
          if (response.data && response.data.me) {
            const user = response.data.me;
            console.log('✅ نجح الطلب المصرح به');
            console.log(`👤 المستخدم الحالي: ${user.name}`);
            console.log(`📧 البريد الإلكتروني: ${user.email}`);
            console.log(`🆔 معرف المستخدم: ${user.id}`);
            
            if (user.groups && user.groups.length > 0) {
              console.log(`👥 المجموعات: ${user.groups.map(g => g.name).join(', ')}`);
            }
            
            resolve({
              success: true,
              user: user,
              groupsCount: user.groups ? user.groups.length : 0
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء GraphQL:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات مستخدم`);
            resolve({
              success: false,
              error: 'No user data found'
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

// Test 4: Unauthorized Request
function testUnauthorizedRequest() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 4: طلب غير مصرح به...');
    
    const query = `
      query GetProducts {
        products {
          products {
            id
            name
            price
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
        'Content-Length': Buffer.byteLength(postData)
        // No Authorization header
      },
      timeout: 10000
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
          
          if (res.statusCode === 401 || res.statusCode === 403) {
            console.log('✅ تم رفض الطلب غير المصرح به بشكل صحيح');
            resolve({
              success: true,
              statusCode: res.statusCode,
              message: 'Unauthorized request properly rejected'
            });
          } else if (response.errors) {
            const hasAuthError = response.errors.some(error => 
              error.message.toLowerCase().includes('unauthorized') ||
              error.message.toLowerCase().includes('authentication') ||
              error.message.toLowerCase().includes('permission')
            );
            
            if (hasAuthError) {
              console.log('✅ تم رفض الطلب غير المصرح به (عبر GraphQL errors)');
              resolve({
                success: true,
                statusCode: res.statusCode,
                errors: response.errors
              });
            } else {
              console.log('⚠️ الطلب غير المصرح به لم يتم رفضه');
              resolve({
                success: false,
                statusCode: res.statusCode,
                error: 'Unauthorized request was not rejected'
              });
            }
          } else if (response.data) {
            console.log('⚠️ الطلب غير المصرح به نجح - مشكلة أمنية محتملة');
            resolve({
              success: false,
              statusCode: res.statusCode,
              error: 'Unauthorized request succeeded - potential security issue'
            });
          } else {
            console.log('⚠️ استجابة غير متوقعة للطلب غير المصرح به');
            resolve({
              success: false,
              statusCode: res.statusCode,
              error: 'Unexpected response for unauthorized request'
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

// Run all authentication and security tests
async function runAuthSecurityTests() {
  console.log('🚀 تشغيل جميع اختبارات المصادقة والأمان...');
  console.log('=' .repeat(50));
  
  const results = {};
  
  // Test 1: Token Validation
  results.tokenValidation = testTokenValidation();
  
  // Test 2: Login Authentication
  results.loginAuth = await testLoginAuthentication();
  
  // Test 3: Authorized Request
  results.authorizedRequest = await testAuthorizedRequest();
  
  // Test 4: Unauthorized Request
  results.unauthorizedRequest = await testUnauthorizedRequest();
  
  // Summary
  console.log('\\n📊 ملخص نتائج اختبارات المصادقة والأمان:');
  console.log('=' .repeat(40));
  
  const tests = [
    { name: 'التحقق من التوكن', result: results.tokenValidation },
    { name: 'تسجيل الدخول', result: results.loginAuth },
    { name: 'الطلب المصرح به', result: results.authorizedRequest },
    { name: 'الطلب غير المصرح به', result: results.unauthorizedRequest }
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
    console.log('\\n🎉 جميع اختبارات المصادقة والأمان نجحت بنسبة 100%!');
    console.log('🔐 النظام آمن وجاهز للاستخدام');
    
    return { success: true, results };
  } else {
    console.log('\\n⚠️ بعض اختبارات الأمان فشلت - يرجى مراجعة الأخطاء أعلاه');
    return { success: false, results };
  }
}

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAuthSecurityTests,
    testTokenValidation,
    testLoginAuthentication,
    testAuthorizedRequest,
    testUnauthorizedRequest
  };
}

// Run tests if called directly
if (require.main === module) {
  runAuthSecurityTests()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 خطأ غير متوقع:', error);
      process.exit(1);
    });
}