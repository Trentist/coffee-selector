#!/usr/bin/env node

/**
 * Comprehensive Authentication Test - All Auth Operations
 * اختبار المصادقة الشامل - جميع عمليات المصادقة
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

// Test User Login
async function testUserLogin() {
  console.log('\n🔐 اختبار تسجيل الدخول');
  console.log('='.repeat(50));

  const query = `
    mutation LoginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        success
        message
        token
        refreshToken
        expiresAt
        user {
          id
          name
          email
          phone
          role
          isVerified
          avatar
          createdAt
          updatedAt
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (result.data?.login) {
      const login = result.data.login;
      console.log(`✅ نتيجة تسجيل الدخول:`);
      console.log(`   🎯 النجاح: ${login.success ? 'نعم' : 'لا'}`);
      console.log(`   💬 الرسالة: ${login.message || 'غير محدد'}`);
      console.log(`   🔑 الرمز المميز: ${login.token ? 'متوفر' : 'غير متوفر'}`);
      console.log(`   🔄 رمز التحديث: ${login.refreshToken ? 'متوفر' : 'غير متوفر'}`);
      console.log(`   ⏰ انتهاء الصلاحية: ${login.expiresAt || 'غير محدد'}`);
      
      if (login.user) {
        console.log(`   👤 بيانات المستخدم:`);
        console.log(`      🆔 المعرف: ${login.user.id}`);
        console.log(`      🏷️  الاسم: ${login.user.name || 'غير محدد'}`);
        console.log(`      📧 البريد: ${login.user.email}`);
        console.log(`      📱 الهاتف: ${login.user.phone || 'غير محدد'}`);
        console.log(`      👑 الدور: ${login.user.role || 'غير محدد'}`);
        console.log(`      ✅ مُتحقق: ${login.user.isVerified ? 'نعم' : 'لا'}`);
      }

      return {
        success: true,
        token: login.token,
        refreshToken: login.refreshToken,
        user: login.user,
        data: login
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

// Test Get Current User
async function testGetCurrentUser(token) {
  console.log('\n👤 اختبار الحصول على المستخدم الحالي');
  console.log('='.repeat(50));

  const query = `
    query GetCurrentUser {
      me {
        id
        name
        email
        phone
        role
        isVerified
        avatar
        createdAt
        updatedAt
        preferences {
          language
          currency
          timezone
          notifications {
            email
            sms
            push
          }
        }
        profile {
          firstName
          lastName
          dateOfBirth
          gender
          bio
        }
        addresses {
          id
          type
          street
          street2
          city
          state
          country
          zipCode
          isDefault
        }
        stats {
          totalOrders
          totalSpent
          lastOrderDate
          memberSince
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {}, token);
    
    if (result.data?.me) {
      const user = result.data.me;
      console.log(`✅ بيانات المستخدم الحالي:`);
      console.log(`   🆔 المعرف: ${user.id}`);
      console.log(`   🏷️  الاسم: ${user.name || 'غير محدد'}`);
      console.log(`   📧 البريد: ${user.email}`);
      console.log(`   📱 الهاتف: ${user.phone || 'غير محدد'}`);
      console.log(`   👑 الدور: ${user.role || 'غير محدد'}`);
      console.log(`   ✅ مُتحقق: ${user.isVerified ? 'نعم' : 'لا'}`);
      
      if (user.preferences) {
        console.log(`   ⚙️  التفضيلات:`);
        console.log(`      🌐 اللغة: ${user.preferences.language || 'غير محدد'}`);
        console.log(`      💰 العملة: ${user.preferences.currency || 'غير محدد'}`);
        console.log(`      🕐 المنطقة الزمنية: ${user.preferences.timezone || 'غير محدد'}`);
      }
      
      if (user.addresses?.length > 0) {
        console.log(`   📍 العناوين: ${user.addresses.length}`);
        user.addresses.forEach((addr, index) => {
          console.log(`      ${index + 1}. ${addr.type || 'غير محدد'}: ${addr.city || 'غير محدد'}, ${addr.country || 'غير محدد'}`);
        });
      }
      
      if (user.stats) {
        console.log(`   📊 الإحصائيات:`);
        console.log(`      📦 إجمالي الطلبات: ${user.stats.totalOrders || 0}`);
        console.log(`      💰 إجمالي المبلغ: ${user.stats.totalSpent || 0}`);
        console.log(`      📅 عضو منذ: ${user.stats.memberSince || 'غير محدد'}`);
      }

      return {
        success: true,
        user: user
      };
    } else {
      console.log('❌ فشل الحصول على بيانات المستخدم');
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

// Test User Registration
async function testUserRegistration() {
  console.log('\n📝 اختبار تسجيل مستخدم جديد');
  console.log('='.repeat(50));

  const query = `
    mutation RegisterUser($input: RegisterInput!) {
      register(input: $input) {
        success
        message
        token
        refreshToken
        expiresAt
        verificationRequired
        user {
          id
          name
          email
          phone
          role
          isVerified
          avatar
          createdAt
          updatedAt
        }
      }
    }
  `;

  const testEmail = `test_${Date.now()}@coffeeselection.com`;

  try {
    const result = await makeGraphQLRequest(query, {
      input: {
        name: 'Test User Registration',
        email: testEmail,
        password: 'TestPassword123!',
        phone: '+971501234567'
      }
    });
    
    if (result.data?.register) {
      const register = result.data.register;
      console.log(`✅ نتيجة التسجيل:`);
      console.log(`   🎯 النجاح: ${register.success ? 'نعم' : 'لا'}`);
      console.log(`   💬 الرسالة: ${register.message || 'غير محدد'}`);
      console.log(`   🔑 الرمز المميز: ${register.token ? 'متوفر' : 'غير متوفر'}`);
      console.log(`   📧 يتطلب تحقق: ${register.verificationRequired ? 'نعم' : 'لا'}`);
      
      if (register.user) {
        console.log(`   👤 المستخدم الجديد:`);
        console.log(`      🆔 المعرف: ${register.user.id}`);
        console.log(`      🏷️  الاسم: ${register.user.name}`);
        console.log(`      📧 البريد: ${register.user.email}`);
      }

      return {
        success: true,
        user: register.user,
        token: register.token
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

// Test Password Reset Request
async function testPasswordResetRequest() {
  console.log('\n🔄 اختبار طلب إعادة تعيين كلمة المرور');
  console.log('='.repeat(50));

  const query = `
    mutation RequestPasswordReset($email: String!) {
      requestPasswordReset(email: $email) {
        success
        message
        resetToken
        expiresAt
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {
      email: TEST_USER.email
    });
    
    if (result.data?.requestPasswordReset) {
      const reset = result.data.requestPasswordReset;
      console.log(`✅ نتيجة طلب إعادة التعيين:`);
      console.log(`   🎯 النجاح: ${reset.success ? 'نعم' : 'لا'}`);
      console.log(`   💬 الرسالة: ${reset.message || 'غير محدد'}`);
      console.log(`   🔑 رمز الإعادة: ${reset.resetToken ? 'متوفر' : 'غير متوفر'}`);
      console.log(`   ⏰ انتهاء الصلاحية: ${reset.expiresAt || 'غير محدد'}`);

      return {
        success: true,
        resetToken: reset.resetToken
      };
    } else {
      console.log('❌ فشل طلب إعادة التعيين');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في طلب إعادة التعيين: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Refresh Token
async function testRefreshToken(refreshToken) {
  console.log('\n🔄 اختبار تحديث الرمز المميز');
  console.log('='.repeat(50));

  const query = `
    mutation RefreshToken($refreshToken: String!) {
      refreshToken(refreshToken: $refreshToken) {
        success
        token
        refreshToken
        expiresAt
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {
      refreshToken: refreshToken
    });
    
    if (result.data?.refreshToken) {
      const refresh = result.data.refreshToken;
      console.log(`✅ نتيجة تحديث الرمز:`);
      console.log(`   🎯 النجاح: ${refresh.success ? 'نعم' : 'لا'}`);
      console.log(`   🔑 الرمز الجديد: ${refresh.token ? 'متوفر' : 'غير متوفر'}`);
      console.log(`   🔄 رمز التحديث الجديد: ${refresh.refreshToken ? 'متوفر' : 'غير متوفر'}`);
      console.log(`   ⏰ انتهاء الصلاحية: ${refresh.expiresAt || 'غير محدد'}`);

      return {
        success: true,
        token: refresh.token,
        refreshToken: refresh.refreshToken
      };
    } else {
      console.log('❌ فشل تحديث الرمز');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في تحديث الرمز: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test User Logout
async function testUserLogout(token) {
  console.log('\n🚪 اختبار تسجيل الخروج');
  console.log('='.repeat(50));

  const query = `
    mutation LogoutUser {
      logout {
        success
        message
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {}, token);
    
    if (result.data?.logout) {
      const logout = result.data.logout;
      console.log(`✅ نتيجة تسجيل الخروج:`);
      console.log(`   🎯 النجاح: ${logout.success ? 'نعم' : 'لا'}`);
      console.log(`   💬 الرسالة: ${logout.message || 'غير محدد'}`);

      return {
        success: true
      };
    } else {
      console.log('❌ فشل تسجيل الخروج');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في تسجيل الخروج: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test User Security Settings
async function testUserSecurity(token) {
  console.log('\n🔒 اختبار إعدادات الأمان');
  console.log('='.repeat(50));

  const query = `
    query GetUserSecurity {
      userSecurity {
        twoFactorEnabled
        lastPasswordChange
        activeDevices {
          id
          name
          type
          browser
          os
          ipAddress
          location
          lastActive
          isCurrent
        }
        securityLog {
          id
          action
          timestamp
          ipAddress
          location
          deviceInfo
          success
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, {}, token);
    
    if (result.data?.userSecurity) {
      const security = result.data.userSecurity;
      console.log(`✅ إعدادات الأمان:`);
      console.log(`   🔐 المصادقة الثنائية: ${security.twoFactorEnabled ? 'مفعلة' : 'غير مفعلة'}`);
      console.log(`   🔑 آخر تغيير كلمة مرور: ${security.lastPasswordChange || 'غير محدد'}`);
      
      if (security.activeDevices?.length > 0) {
        console.log(`   📱 الأجهزة النشطة: ${security.activeDevices.length}`);
        security.activeDevices.forEach((device, index) => {
          console.log(`      ${index + 1}. ${device.name || 'غير محدد'} (${device.type || 'غير محدد'})`);
          console.log(`         🌐 المتصفح: ${device.browser || 'غير محدد'}`);
          console.log(`         💻 النظام: ${device.os || 'غير محدد'}`);
          console.log(`         🌍 الموقع: ${device.location || 'غير محدد'}`);
          console.log(`         ⏰ آخر نشاط: ${device.lastActive || 'غير محدد'}`);
          console.log(`         ✅ الحالي: ${device.isCurrent ? 'نعم' : 'لا'}`);
        });
      }
      
      if (security.securityLog?.length > 0) {
        console.log(`   📋 سجل الأمان: ${security.securityLog.length} إدخال`);
        security.securityLog.slice(0, 3).forEach((log, index) => {
          console.log(`      ${index + 1}. ${log.action || 'غير محدد'} - ${log.success ? 'نجح' : 'فشل'}`);
          console.log(`         ⏰ الوقت: ${log.timestamp || 'غير محدد'}`);
          console.log(`         🌍 الموقع: ${log.location || 'غير محدد'}`);
        });
      }

      return {
        success: true,
        security: security
      };
    } else {
      console.log('❌ فشل الحصول على إعدادات الأمان');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في إعدادات الأمان: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main Test Function
async function runComprehensiveAuthTest() {
  console.log('🚀 اختبار المصادقة الشامل - جميع العمليات');
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

  let userToken = null;
  let refreshToken = null;

  try {
    // Test 1: User Login
    results.tests.login = await testUserLogin();
    if (results.tests.login.success) {
      userToken = results.tests.login.token;
      refreshToken = results.tests.login.refreshToken;
    }
    
    // Test 2: Get Current User (if login successful)
    if (userToken) {
      results.tests.getCurrentUser = await testGetCurrentUser(userToken);
    }
    
    // Test 3: User Registration (new user)
    results.tests.registration = await testUserRegistration();
    
    // Test 4: Password Reset Request
    results.tests.passwordReset = await testPasswordResetRequest();
    
    // Test 5: Refresh Token (if available)
    if (refreshToken) {
      results.tests.refreshToken = await testRefreshToken(refreshToken);
    }
    
    // Test 6: User Security Settings (if token available)
    if (userToken) {
      results.tests.userSecurity = await testUserSecurity(userToken);
    }
    
    // Test 7: User Logout (if token available)
    if (userToken) {
      results.tests.logout = await testUserLogout(userToken);
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 ملخص نتائج اختبار المصادقة الشامل');
    console.log('='.repeat(70));
    
    const summary = {
      login: results.tests.login?.success || false,
      getCurrentUser: results.tests.getCurrentUser?.success || false,
      registration: results.tests.registration?.success || false,
      passwordReset: results.tests.passwordReset?.success || false,
      refreshToken: results.tests.refreshToken?.success || false,
      userSecurity: results.tests.userSecurity?.success || false,
      logout: results.tests.logout?.success || false
    };

    console.log(`🔐 تسجيل الدخول: ${summary.login ? '✅ نجح' : '❌ فشل'}`);
    console.log(`👤 الحصول على المستخدم: ${summary.getCurrentUser ? '✅ نجح' : '❌ فشل'}`);
    console.log(`📝 التسجيل: ${summary.registration ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🔄 إعادة تعيين كلمة المرور: ${summary.passwordReset ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🔄 تحديث الرمز: ${summary.refreshToken ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🔒 إعدادات الأمان: ${summary.userSecurity ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🚪 تسجيل الخروج: ${summary.logout ? '✅ نجح' : '❌ فشل'}`);

    // Test Success Rate
    const successfulTests = Object.values(summary).filter(test => test).length;
    const totalTests = Object.keys(summary).length;
    const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

    console.log(`\n🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`);
    
    if (successRate >= 80) {
      console.log('🎉 ممتاز! نظام المصادقة يعمل بشكل مثالي');
    } else if (successRate >= 60) {
      console.log('⚠️  جيد، لكن يحتاج تحسينات');
    } else {
      console.log('❌ يحتاج إصلاحات عاجلة');
    }

    console.log('\n🚀 نظام المصادقة جاهز للاستخدام!');
    console.log('📋 يمكن الآن استخدام هذه العمليات في التطبيق');

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
  runComprehensiveAuthTest()
    .then(results => {
      console.log('\n✅ اكتمل اختبار المصادقة الشامل بنجاح!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل اختبار المصادقة:', error.message);
      process.exit(1);
    });
}

module.exports = { runComprehensiveAuthTest };