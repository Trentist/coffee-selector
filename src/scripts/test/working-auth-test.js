#!/usr/bin/env node

/**
 * Working Authentication Test - Real Schema Fields
 * اختبار المصادقة العامل - الحقول الحقيقية للمخطط
 */

const https = require('https');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
};

const TEST_USER = {
  email: 'mohamed@coffeeselection.com',
  password: 'Montada@1',
  name: 'Mohamed Test User'
};

// GraphQL Request Helper
async function makeGraphQLRequest(query, variables = {}, token = null) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${ODOO_CONFIG.apiKey}`;
    }
    
    const options = {
      hostname: 'coffee-selection-staging-20784644.dev.odoo.com',
      port: 443,
      path: '/graphql/vsf',
      method: 'POST',
      headers: headers
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

// Test Simple Login
async function testSimpleLogin() {
  console.log('\n🔐 اختبار تسجيل الدخول البسيط');
  console.log('='.repeat(50));

  const query = `
    mutation LoginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          id
          name
          email
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (result.data?.login?.user) {
      const user = result.data.login.user;
      console.log(`✅ تسجيل الدخول نجح:`);
      console.log(`   🆔 المعرف: ${user.id}`);
      console.log(`   🏷️  الاسم: ${user.name || 'غير محدد'}`);
      console.log(`   📧 البريد: ${user.email}`);

      return {
        success: true,
        user: user
      };
    } else {
      console.log('❌ فشل تسجيل الدخول');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في تسجيل الدخول: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Simple Registration
async function testSimpleRegistration() {
  console.log('\n📝 اختبار التسجيل البسيط');
  console.log('='.repeat(50));

  const query = `
    mutation RegisterUser($email: String!, $name: String!, $password: String!) {
      register(email: $email, name: $name, password: $password) {
        id
        name
        email
      }
    }
  `;

  const testEmail = `test_${Date.now()}@coffeeselection.com`;

  try {
    const result = await makeGraphQLRequest(query, {
      email: testEmail,
      name: 'Test User Registration',
      password: 'TestPassword123!'
    });
    
    if (result.data?.register) {
      const user = result.data.register;
      console.log(`✅ التسجيل نجح:`);
      console.log(`   🆔 المعرف: ${user.id}`);
      console.log(`   🏷️  الاسم: ${user.name || 'غير محدد'}`);
      console.log(`   📧 البريد: ${user.email}`);

      return {
        success: true,
        user: user
      };
    } else {
      console.log('❌ فشل التسجيل');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في التسجيل: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Password Reset
async function testPasswordReset() {
  console.log('\n🔄 اختبار إعادة تعيين كلمة المرور');
  console.log('='.repeat(50));

  const query = `
    mutation ResetPassword($email: String!) {
      resetPassword(email: $email)
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {
      email: TEST_USER.email
    });
    
    if (result.data?.resetPassword !== undefined) {
      console.log(`✅ طلب إعادة التعيين تم إرساله`);
      console.log(`   📧 البريد: ${TEST_USER.email}`);
      console.log(`   📨 النتيجة: ${result.data.resetPassword}`);

      return {
        success: true,
        result: result.data.resetPassword
      };
    } else {
      console.log('❌ فشل طلب إعادة التعيين');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في إعادة التعيين: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Get Current User (Me)
async function testGetMe() {
  console.log('\n👤 اختبار الحصول على المستخدم الحالي');
  console.log('='.repeat(50));

  const query = `
    query GetMe {
      me {
        id
        name
        email
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.me) {
      const user = result.data.me;
      console.log(`✅ بيانات المستخدم الحالي:`);
      console.log(`   🆔 المعرف: ${user.id}`);
      console.log(`   🏷️  الاسم: ${user.name || 'غير محدد'}`);
      console.log(`   📧 البريد: ${user.email}`);

      return {
        success: true,
        user: user
      };
    } else {
      console.log('❌ فشل الحصول على المستخدم الحالي');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في الحصول على المستخدم: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Available Auth Schema
async function testAuthSchema() {
  console.log('\n🔍 اختبار مخطط المصادقة المتاح');
  console.log('='.repeat(50));

  const query = `
    query {
      __schema {
        mutationType {
          fields {
            name
            description
            args {
              name
              type {
                name
                kind
              }
            }
          }
        }
        queryType {
          fields {
            name
            description
            type {
              name
              kind
            }
          }
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.__schema) {
      const schema = result.data.__schema;
      
      // Auth-related mutations
      const authMutations = schema.mutationType?.fields?.filter(field => 
        field.name.toLowerCase().includes('login') ||
        field.name.toLowerCase().includes('register') ||
        field.name.toLowerCase().includes('auth') ||
        field.name.toLowerCase().includes('password') ||
        field.name.toLowerCase().includes('reset')
      ) || [];
      
      // Auth-related queries
      const authQueries = schema.queryType?.fields?.filter(field => 
        field.name.toLowerCase().includes('me') ||
        field.name.toLowerCase().includes('user') ||
        field.name.toLowerCase().includes('auth')
      ) || [];

      console.log(`✅ طفرات المصادقة المتاحة: ${authMutations.length}`);
      authMutations.forEach(mutation => {
        console.log(`   🔧 ${mutation.name}`);
        if (mutation.args?.length > 0) {
          console.log(`      المعاملات: ${mutation.args.map(arg => arg.name).join(', ')}`);
        }
      });

      console.log(`\n✅ استعلامات المصادقة المتاحة: ${authQueries.length}`);
      authQueries.forEach(query => {
        console.log(`   🔍 ${query.name}`);
      });

      return {
        success: true,
        mutations: authMutations,
        queries: authQueries
      };
    } else {
      console.log('❌ فشل الحصول على المخطط');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في الحصول على المخطط: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test User Profile Update
async function testUpdateProfile() {
  console.log('\n✏️ اختبار تحديث الملف الشخصي');
  console.log('='.repeat(50));

  const query = `
    mutation UpdateProfile($name: String!) {
      updateProfile(name: $name) {
        id
        name
        email
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {
      name: 'Mohamed Updated Name'
    });
    
    if (result.data?.updateProfile) {
      const user = result.data.updateProfile;
      console.log(`✅ تحديث الملف الشخصي نجح:`);
      console.log(`   🆔 المعرف: ${user.id}`);
      console.log(`   🏷️  الاسم الجديد: ${user.name}`);
      console.log(`   📧 البريد: ${user.email}`);

      return {
        success: true,
        user: user
      };
    } else {
      console.log('❌ فشل تحديث الملف الشخصي');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في تحديث الملف الشخصي: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main Test Function
async function runWorkingAuthTest() {
  console.log('🚀 اختبار المصادقة العامل - الحقول الحقيقية');
  console.log('='.repeat(70));
  console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
  console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
  console.log(`👤 المستخدم: ${TEST_USER.email}`);
  console.log('='.repeat(70));

  const results = {
    timestamp: new Date().toISOString(),
    server: ODOO_CONFIG.baseUrl,
    testUser: TEST_USER.email,
    tests: {}
  };

  try {
    // Test 1: Auth Schema Discovery
    results.tests.authSchema = await testAuthSchema();
    
    // Test 2: Simple Login
    results.tests.login = await testSimpleLogin();
    
    // Test 3: Get Current User
    results.tests.getCurrentUser = await testGetMe();
    
    // Test 4: Simple Registration
    results.tests.registration = await testSimpleRegistration();
    
    // Test 5: Password Reset
    results.tests.passwordReset = await testPasswordReset();
    
    // Test 6: Update Profile
    results.tests.updateProfile = await testUpdateProfile();

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 ملخص نتائج اختبار المصادقة العامل');
    console.log('='.repeat(70));
    
    const summary = {
      authSchema: results.tests.authSchema?.success || false,
      login: results.tests.login?.success || false,
      getCurrentUser: results.tests.getCurrentUser?.success || false,
      registration: results.tests.registration?.success || false,
      passwordReset: results.tests.passwordReset?.success || false,
      updateProfile: results.tests.updateProfile?.success || false
    };

    console.log(`🔍 اكتشاف مخطط المصادقة: ${summary.authSchema ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🔐 تسجيل الدخول: ${summary.login ? '✅ نجح' : '❌ فشل'}`);
    console.log(`👤 الحصول على المستخدم: ${summary.getCurrentUser ? '✅ نجح' : '❌ فشل'}`);
    console.log(`📝 التسجيل: ${summary.registration ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🔄 إعادة تعيين كلمة المرور: ${summary.passwordReset ? '✅ نجح' : '❌ فشل'}`);
    console.log(`✏️ تحديث الملف الشخصي: ${summary.updateProfile ? '✅ نجح' : '❌ فشل'}`);

    // Test Success Rate
    const successfulTests = Object.values(summary).filter(test => test).length;
    const totalTests = Object.keys(summary).length;
    const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

    console.log(`\n🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`);
    
    if (successRate >= 80) {
      console.log('🎉 ممتاز! نظام المصادقة يعمل بشكل مثالي');
    } else if (successRate >= 60) {
      console.log('⚠️  جيد، لكن يحتاج تحسينات');
    } else if (successRate >= 30) {
      console.log('⚠️  بعض العمليات تعمل، يحتاج تطوير');
    } else {
      console.log('❌ يحتاج إصلاحات عاجلة');
    }

    // Show available auth operations
    if (results.tests.authSchema?.success) {
      const mutations = results.tests.authSchema.mutations || [];
      const queries = results.tests.authSchema.queries || [];
      
      console.log('\n📋 العمليات المتاحة للاستخدام:');
      console.log(`   🔧 الطفرات: ${mutations.map(m => m.name).join(', ')}`);
      console.log(`   🔍 الاستعلامات: ${queries.map(q => q.name).join(', ')}`);
    }

    console.log('\n🚀 يمكن الآن استخدام العمليات الناجحة في التطبيق!');

    results.summary = summary;
    results.successRate = successRate;

    return results;

  } catch (error) {
    console.error('❌ خطأ في اختبار المصادقة:', error.message);
    results.error = error.message;
    return results;
  }
}

// Run the test
if (require.main === module) {
  runWorkingAuthTest()
    .then(results => {
      console.log('\n✅ اكتمل اختبار المصادقة العامل بنجاح!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل اختبار المصادقة:', error.message);
      process.exit(1);
    });
}

module.exports = { runWorkingAuthTest };