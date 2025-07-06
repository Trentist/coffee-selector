// اكتشاف Schema الحقيقي لـ Odoo GraphQL
import fetch from 'node-fetch';
import fs from 'fs';

const ODOO_CONFIG = {
  apiUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  database: 'coffee-selection-staging-20784644',
  username: 'mohamed@coffeeselection.com',
  password: 'Montada@1'
};

// اكتشاف Schema الكامل
async function discoverOdooSchema() {
  console.log('🔍 اكتشاف Schema الحقيقي لـ Odoo GraphQL...\n');

  try {
    // استعلام Introspection للحصول على Schema الكامل
    const introspectionQuery = {
      query: `
        query IntrospectionQuery {
          __schema {
            queryType {
              name
              fields {
                name
                description
                type {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
                args {
                  name
                  type {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
            mutationType {
              name
              fields {
                name
                description
                type {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
                args {
                  name
                  type {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
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
              }
              inputFields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
              }
            }
          }
        }
      `
    };

    console.log('📡 إرسال استعلام Introspection إلى Odoo...');

    const response = await fetch(ODOO_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ODOO_TOKEN || process.env.NEXT_PUBLIC_ODOO_TOKEN || ''}`,
      },
      body: JSON.stringify(introspectionQuery)
    });

    const result = await response.json();

    if (result.errors) {
      console.error('❌ خطأ في Introspection:', result.errors);
      return null;
    }

    const schema = result.data.__schema;

    console.log('✅ تم الحصول على Schema بنجاح!\n');

    // تحليل الاستعلامات المتاحة
    console.log('📋 الاستعلامات المتاحة (Queries):');
    console.log('='.repeat(60));

    if (schema.queryType && schema.queryType.fields) {
      schema.queryType.fields.forEach(field => {
        console.log(`🔍 ${field.name}`);
        if (field.description) {
          console.log(`   📝 ${field.description}`);
        }
        if (field.args && field.args.length > 0) {
          console.log(`   📥 المعاملات: ${field.args.map(arg => arg.name).join(', ')}`);
        }
        console.log(`   📤 النوع: ${field.type.name || field.type.kind}`);
        console.log('');
      });
    }

    // تحليل الطفرات المتاحة
    console.log('\n🔄 الطفرات المتاحة (Mutations):');
    console.log('='.repeat(60));

    if (schema.mutationType && schema.mutationType.fields) {
      schema.mutationType.fields.forEach(field => {
        console.log(`🔧 ${field.name}`);
        if (field.description) {
          console.log(`   📝 ${field.description}`);
        }
        if (field.args && field.args.length > 0) {
          console.log(`   📥 المعاملات: ${field.args.map(arg => arg.name).join(', ')}`);
        }
        console.log(`   📤 النوع: ${field.type.name || field.type.kind}`);
        console.log('');
      });
    }

    // تحليل الأنواع المتاحة
    console.log('\n📊 الأنواع المتاحة (Types):');
    console.log('='.repeat(60));

    const relevantTypes = schema.types.filter(type =>
      !type.name.startsWith('__') &&
      (type.name.toLowerCase().includes('product') ||
       type.name.toLowerCase().includes('customer') ||
       type.name.toLowerCase().includes('order') ||
       type.name.toLowerCase().includes('partner') ||
       type.name.toLowerCase().includes('sale'))
    );

    relevantTypes.forEach(type => {
      console.log(`📦 ${type.name} (${type.kind})`);
      if (type.description) {
        console.log(`   📝 ${type.description}`);
      }
      if (type.fields && type.fields.length > 0) {
        console.log(`   🏷️ الحقول: ${type.fields.slice(0, 5).map(f => f.name).join(', ')}${type.fields.length > 5 ? '...' : ''}`);
      }
      console.log('');
    });

    return schema;

  } catch (error) {
    console.error('❌ خطأ في اكتشاف Schema:', error.message);
    return null;
  }
}

// اختبار استعلامات بسيطة
async function testBasicQueries() {
  console.log('\n🧪 اختبار الاستعلامات الأساسية...\n');

  const basicQueries = [
    {
      name: 'products',
      query: `query { products { edges { node { id name } } } }`
    },
    {
      name: 'categories',
      query: `query { categories { edges { node { id name } } } }`
    },
    {
      name: 'me',
      query: `query { me { id email } }`
    }
  ];

  for (const testQuery of basicQueries) {
    try {
      console.log(`🔍 اختبار ${testQuery.name}...`);

      const response = await fetch(ODOO_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ODOO_TOKEN || process.env.NEXT_PUBLIC_ODOO_TOKEN || ''}`,
        },
        body: JSON.stringify({ query: testQuery.query })
      });

      const result = await response.json();

      if (result.errors) {
        console.log(`❌ ${testQuery.name}: ${result.errors[0].message}`);
      } else if (result.data) {
        console.log(`✅ ${testQuery.name}: يعمل بنجاح`);
        console.log(`   📊 البيانات: ${JSON.stringify(result.data).substring(0, 100)}...`);
      }

    } catch (error) {
      console.log(`❌ ${testQuery.name}: خطأ - ${error.message}`);
    }

    console.log('');
  }
}

// اختبار مع مصادقة مختلفة
async function testWithAuthentication() {
  console.log('\n🔐 اختبار مع طرق مصادقة مختلفة...\n');

  // 1. بدون مصادقة
  console.log('🔍 اختبار بدون مصادقة...');
  try {
    const response = await fetch(ODOO_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query { __schema { queryType { name } } }`
      })
    });

    const result = await response.json();
    if (result.data) {
      console.log('✅ يعمل بدون مصادقة');
    } else {
      console.log('❌ يتطلب مصادقة');
    }
  } catch (error) {
    console.log('❌ خطأ:', error.message);
  }

  // 2. مع Token
  if (process.env.ODOO_TOKEN || process.env.NEXT_PUBLIC_ODOO_TOKEN) {
    console.log('\n🎫 اختبار مع Token...');
    try {
      const response = await fetch(ODOO_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ODOO_TOKEN || process.env.NEXT_PUBLIC_ODOO_TOKEN}`,
        },
        body: JSON.stringify({
          query: `query { __schema { queryType { name } } }`
        })
      });

      const result = await response.json();
      if (result.data) {
        console.log('✅ يعمل مع Token');
      } else {
        console.log('❌ Token غير صحيح');
      }
    } catch (error) {
      console.log('❌ خطأ:', error.message);
    }
  }

  // 3. مع Basic Auth
  console.log('\n🔑 اختبار مع Basic Auth...');
  try {
    const auth = Buffer.from(`${ODOO_CONFIG.username}:${ODOO_CONFIG.password}`).toString('base64');

    const response = await fetch(ODOO_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        query: `query { __schema { queryType { name } } }`
      })
    });

    const result = await response.json();
    if (result.data) {
      console.log('✅ يعمل مع Basic Auth');
    } else {
      console.log('❌ Basic Auth غير مقبول');
    }
  } catch (error) {
    console.log('❌ خطأ:', error.message);
  }
}

// تشغيل جميع الاختبارات
async function runDiscovery() {
  console.log('🚀 بدء اكتشاف Odoo GraphQL Schema...\n');

  // اكتشاف Schema
  const schema = await discoverOdooSchema();

  if (schema) {
    // اختبار الاستعلامات الأساسية
    await testBasicQueries();

    // اختبار المصادقة
    await testWithAuthentication();

    console.log('\n📋 ملخص الاكتشاف:');
    console.log('='.repeat(50));
    console.log(`📊 عدد الاستعلامات: ${schema.queryType?.fields?.length || 0}`);
    console.log(`🔄 عدد الطفرات: ${schema.mutationType?.fields?.length || 0}`);
    console.log(`📦 عدد الأنواع: ${schema.types?.length || 0}`);

    // حفظ Schema في ملف
    fs.writeFileSync('odoo-schema-discovery.json', JSON.stringify(schema, null, 2));
    console.log('💾 تم حفظ Schema في odoo-schema-discovery.json');

  } else {
    console.log('❌ فشل في اكتشاف Schema');
  }

  console.log('\n🏁 انتهى الاكتشاف!');
}

// تشغيل الاكتشاف
runDiscovery().catch(console.error);