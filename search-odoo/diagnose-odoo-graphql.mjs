#!/usr/bin/env node

/**
 * Odoo GraphQL Diagnostic Tool - أداة تشخيص GraphQL لـ Odoo
 * Comprehensive diagnostic for Odoo GraphQL issues
 */

import fetch from 'node-fetch';

// Configuration
const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  apiToken: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  email: 'mohamed@coffeeselection.com',
  password: 'Montada@1'
};

async function diagnoseOdooGraphQL() {
  console.log('🔍 بدء تشخيص شامل لـ Odoo GraphQL...\n');

  // Test 1: Basic connectivity
  console.log('🧪 اختبار 1: الاتصال الأساسي...');
  try {
    const response = await fetch(ODOO_CONFIG.baseUrl);
    console.log('✅ الخادم متاح - حالة:', response.status);
    console.log('📄 نوع المحتوى:', response.headers.get('content-type'));
  } catch (error) {
    console.log('❌ فشل الاتصال الأساسي:', error.message);
    return;
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: GraphQL endpoint availability
  console.log('🧪 اختبار 2: توفر نقطة GraphQL...');
  try {
    const response = await fetch(ODOO_CONFIG.graphqlUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; OdooTest/1.0)'
      }
    });
    
    console.log('📊 حالة الاستجابة:', response.status);
    console.log('📄 نوع المحتوى:', response.headers.get('content-type'));
    
    const responseText = await response.text();
    console.log('📝 محتوى الاستجابة (أول 200 حرف):', responseText.substring(0, 200));
    
    if (response.status === 405) {
      console.log('ℹ️  خطأ 405 يعني أن GET غير مدعوم - هذا طبيعي لـ GraphQL');
    }
  } catch (error) {
    console.log('❌ فشل الوصول لنقطة GraphQL:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: GraphQL POST with introspection
  console.log('🧪 اختبار 3: استعلام GraphQL البسيط...');
  try {
    const introspectionQuery = {
      query: `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `
    };

    const response = await fetch(ODOO_CONFIG.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ODOO_CONFIG.apiToken}`,
        'Accept': 'application/json',
        'User-Agent': 'OdooGraphQLClient/1.0'
      },
      body: JSON.stringify(introspectionQuery)
    });

    console.log('📊 حالة الاستجابة:', response.status);
    console.log('📄 نوع المحتوى:', response.headers.get('content-type'));

    const responseText = await response.text();
    console.log('📝 محتوى الاستجابة:', responseText);

    if (response.status === 200) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ استجابة JSON صحيحة');
        console.log('📋 البيانات:', JSON.stringify(jsonResponse, null, 2));
      } catch (parseError) {
        console.log('❌ فشل تحليل JSON:', parseError.message);
      }
    }
  } catch (error) {
    console.log('❌ فشل استعلام GraphQL:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Check authentication
  console.log('🧪 اختبار 4: فحص المصادقة...');
  try {
    const authQuery = {
      query: `
        query {
          me {
            id
            name
            email
          }
        }
      `
    };

    const response = await fetch(ODOO_CONFIG.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ODOO_CONFIG.apiToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(authQuery)
    });

    console.log('📊 حالة الاستجابة:', response.status);
    const responseText = await response.text();
    console.log('📝 محتوى الاستجابة:', responseText);
  } catch (error) {
    console.log('❌ فشل فحص المصادقة:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 5: Try different authentication methods
  console.log('🧪 اختبار 5: طرق مصادقة مختلفة...');
  
  const authMethods = [
    { name: 'Bearer Token', headers: { 'Authorization': `Bearer ${ODOO_CONFIG.apiToken}` } },
    { name: 'API Key Header', headers: { 'X-API-Key': ODOO_CONFIG.apiToken } },
    { name: 'Token Header', headers: { 'X-Token': ODOO_CONFIG.apiToken } },
    { name: 'No Auth', headers: {} }
  ];

  for (const method of authMethods) {
    console.log(`\n🔐 جاري اختبار: ${method.name}`);
    try {
      const testQuery = {
        query: `
          query {
            __type(name: "Query") {
              name
            }
          }
        `
      };

      const response = await fetch(ODOO_CONFIG.graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...method.headers
        },
        body: JSON.stringify(testQuery)
      });

      console.log(`   📊 حالة: ${response.status}`);
      
      if (response.status !== 400) {
        const responseText = await response.text();
        console.log(`   📝 الاستجابة: ${responseText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ خطأ: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 6: Check Redis configuration issue
  console.log('🧪 اختبار 6: فحص مشكلة Redis...');
  console.log('📋 من سجلات الخطأ، المشكلة الأساسية هي:');
  console.log('   ❌ "Please configure Redis"');
  console.log('   🔄 Cron job "Update Dirty Products Stock on Redis" يفشل');
  console.log('   📊 GraphQL يعيد خطأ 400');
  
  console.log('\n💡 التوصيات:');
  console.log('1. 🔧 تكوين Redis في Odoo');
  console.log('2. 🛠️ إصلاح إعدادات Redis في ملف التكوين');
  console.log('3. 🔄 إعادة تشغيل خدمة Odoo');
  console.log('4. 🧪 اختبار GraphQL مرة أخرى');

  console.log('\n🏁 انتهى التشخيص الشامل');
}

// Run the diagnostic
diagnoseOdooGraphQL().catch(console.error);