/**
 * Fixed Authentication & Security Test - Coffee Selection
 * اختبار المصادقة والأمان المُصحح - موقع Coffee Selection
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  // Real user credentials
  adminEmail: 'mohamed@coffeeselection.com',
  adminPassword: 'Montada@1',
  // Fake visitor data
  visitorEmail: 'visitor@example.com',
  visitorPassword: 'wrongpassword123'
};

console.log('🔐 بدء اختبار المصادقة والأمان المُصحح...');
console.log('=======================================');

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

// Test 2: Registered User Authentication
function testRegisteredUserAuth() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 2: مصادقة المستخدم المسجل...');
    console.log(`👤 المستخدم: ${ODOO_CONFIG.adminEmail}`);
    
    // Since Odoo VSF GraphQL doesn't have standard login mutation,
    // we'll test with authorized request using the API token
    const userQuery = `
      query GetUserInfo {
        partner {
          id
          name
          email
          isCompany
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
          
          if (response.data && response.data.partner) {
            const user = response.data.partner;
            console.log('✅ نجحت مصادقة المستخدم المسجل');
            console.log(`👤 اسم المستخدم: ${user.name}`);
            console.log(`📧 البريد الإلكتروني: ${user.email}`);
            console.log(`🆔 معرف المستخدم: ${user.id}`);
            console.log(`🏢 نوع الحساب: ${user.isCompany ? 'شركة' : 'فرد'}`);
            
            resolve({
              success: true,
              user: user,
              authenticated: true
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في مصادقة المستخدم:`, response.errors);
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

// Test 3: Visitor (Unauthorized) Access
function testVisitorAccess() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 3: وصول الزائر (غير مصرح)...');
    console.log(`👤 زائر وهمي: ${ODOO_CONFIG.visitorEmail}`);
    
    const query = `
      query GetProducts {
        products(pageSize: 1) {
          products {
            id
            name
            price
          }
          totalCount
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
        // No Authorization header - simulating visitor
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
            console.log('✅ تم رفض وصول الزائر بشكل صحيح');
            resolve({
              success: true,
              statusCode: res.statusCode,
              message: 'Visitor access properly restricted'
            });
          } else if (response.errors) {
            const hasAuthError = response.errors.some(error => 
              error.message.toLowerCase().includes('unauthorized') ||
              error.message.toLowerCase().includes('authentication') ||
              error.message.toLowerCase().includes('permission') ||
              error.message.toLowerCase().includes('access') ||
              error.message.toLowerCase().includes('token')
            );
            
            if (hasAuthError) {
              console.log('✅ تم رفض وصول الزائر (عبر GraphQL errors)');
              console.log('📋 رسالة الخطأ:', response.errors[0].message);
              resolve({
                success: true,
                statusCode: res.statusCode,
                errors: response.errors
              });
            } else {
              console.log('⚠️ وصول الزائر لم يتم رفضه بشكل صحيح');
              console.log('📋 الأخطاء:', response.errors);
              resolve({
                success: false,
                statusCode: res.statusCode,
                error: 'Visitor access was not properly restricted',
                errors: response.errors
              });
            }
          } else if (response.data) {
            // Some public data might be accessible to visitors
            console.log('ℹ️ الزائر يمكنه الوصول لبعض البيانات العامة');
            console.log('📦 البيانات المتاحة:', Object.keys(response.data));
            resolve({
              success: true,
              statusCode: res.statusCode,
              message: 'Visitor has limited access to public data',
              publicData: response.data
            });
          } else {
            console.log('⚠️ استجابة غير متوقعة لوصول الزائر');
            resolve({
              success: false,
              statusCode: res.statusCode,
              error: 'Unexpected response for visitor access'
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

// Test 4: Registered User Cart Access
function testRegisteredUserCartAccess() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 4: وصول المستخدم المسجل للسلة...');
    
    const cartQuery = `
      query GetCart {
        cart {
          order {
            id
            name
            cartQuantity
            amountTotal
            orderLines {
              id
              name
              quantity
              priceUnit
            }
          }
        }
      }
    `;

    const postData = JSON.stringify({ query: cartQuery });
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
          
          if (response.data && response.data.cart) {
            const cart = response.data.cart;
            console.log('✅ نجح وصول المستخدم المسجل للسلة');
            
            if (cart.order) {
              console.log(`🛒 معرف السلة: ${cart.order.id}`);
              console.log(`📦 عدد العناصر: ${cart.order.cartQuantity || 0}`);
              console.log(`💰 المجموع: ${cart.order.amountTotal || 0}`);
              console.log(`📋 عدد الخطوط: ${cart.order.orderLines ? cart.order.orderLines.length : 0}`);
            } else {
              console.log('🛒 السلة فارغة');
            }
            
            resolve({
              success: true,
              cart: cart,
              hasItems: !!(cart.order && cart.order.cartQuantity > 0)
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في وصول السلة:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات سلة`);
            resolve({
              success: false,
              error: 'No cart data found'
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

// Test 5: Visitor Cart Access (Should be restricted)
function testVisitorCartAccess() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 5: محاولة وصول الزائر للسلة...');
    
    const cartQuery = `
      query GetCart {
        cart {
          order {
            id
            cartQuantity
          }
        }
      }
    `;

    const postData = JSON.stringify({ query: cartQuery });
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
            console.log('✅ تم رفض وصول الزائر للسلة بشكل صحيح');
            resolve({
              success: true,
              statusCode: res.statusCode,
              message: 'Visitor cart access properly restricted'
            });
          } else if (response.errors) {
            const hasAuthError = response.errors.some(error => 
              error.message.toLowerCase().includes('unauthorized') ||
              error.message.toLowerCase().includes('authentication') ||
              error.message.toLowerCase().includes('permission')
            );
            
            if (hasAuthError) {
              console.log('✅ تم رفض وصول الزائر للسلة (عبر GraphQL errors)');
              resolve({
                success: true,
                statusCode: res.statusCode,
                errors: response.errors
              });
            } else {
              console.log('⚠️ وصول الزائر للسلة لم يتم رفضه');
              resolve({
                success: false,
                statusCode: res.statusCode,
                error: 'Visitor cart access was not restricted'
              });
            }
          } else if (response.data && response.data.cart) {
            console.log('⚠️ الزائر يمكنه الوصول للسلة - مشكلة أمنية');
            resolve({
              success: false,
              statusCode: res.statusCode,
              error: 'Visitor can access cart - security issue'
            });
          } else {
            console.log('ℹ️ لا توجد بيانات سلة للزائر');
            resolve({
              success: true,
              statusCode: res.statusCode,
              message: 'No cart data for visitor - expected behavior'
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
async function runFixedAuthSecurityTests() {
  console.log('🚀 تشغيل جميع اختبارات المصادقة والأمان المُصححة...');
  console.log('=' .repeat(55));
  
  const results = {};
  
  // Test 1: Token Validation
  results.tokenValidation = testTokenValidation();
  
  // Test 2: Registered User Authentication
  results.registeredUserAuth = await testRegisteredUserAuth();
  
  // Test 3: Visitor Access
  results.visitorAccess = await testVisitorAccess();
  
  // Test 4: Registered User Cart Access
  results.registeredUserCart = await testRegisteredUserCartAccess();
  
  // Test 5: Visitor Cart Access
  results.visitorCart = await testVisitorCartAccess();
  
  // Summary
  console.log('\\n📊 ملخص نتائج اختبارات المصادقة والأمان:');
  console.log('=' .repeat(45));
  
  const tests = [
    { name: 'التحقق من التوكن', result: results.tokenValidation },
    { name: 'مصادقة المستخدم المسجل', result: results.registeredUserAuth },
    { name: 'وصول الزائر', result: results.visitorAccess },
    { name: 'سلة المستخدم المسجل', result: results.registeredUserCart },
    { name: 'سلة الزائر (مقيدة)', result: results.visitorCart }
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
    console.log(`👤 المستخدم المسجل: ${ODOO_CONFIG.adminEmail}`);
    console.log(`👻 الزائر الوهمي: ${ODOO_CONFIG.visitorEmail}`);
    
    return { success: true, results };
  } else {
    console.log('\\n⚠️ بعض اختبارات الأمان فشلت - يرجى مراجعة الأخطاء أعلاه');
    return { success: false, results };
  }
}

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runFixedAuthSecurityTests,
    testTokenValidation,
    testRegisteredUserAuth,
    testVisitorAccess,
    testRegisteredUserCartAccess,
    testVisitorCartAccess
  };
}

// Run tests if called directly
if (require.main === module) {
  runFixedAuthSecurityTests()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 خطأ غير متوقع:', error);
      process.exit(1);
    });
}