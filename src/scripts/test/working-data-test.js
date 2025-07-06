#!/usr/bin/env node

/**
 * Working Data Test - Using Proven GraphQL Queries
 * اختبار البيانات العاملة - باستخدام استعلامات GraphQL المثبتة
 */

const https = require('https');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
};

// GraphQL Request Helper
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
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`,
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

// Test Basic Products (Working Query from Report)
async function testBasicProducts() {
  console.log('\n🛍️ اختبار المنتجات الأساسية');
  console.log('='.repeat(50));

  const query = `
    query {
      products {
        id
        name
        displayName
        listPrice
        standardPrice
        defaultCode
        barcode
        weight
        volume
        description
        descriptionSale
        active
        saleOk
        purchaseOk
        qtyAvailable
        virtualAvailable
        incomingQty
        outgoingQty
        createDate
        writeDate
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.products) {
      const products = result.data.products;
      console.log(`✅ تم العثور على ${products.length} منتج`);
      
      // Show first 5 products with details
      products.slice(0, 5).forEach((product, index) => {
        console.log(`\n📦 المنتج ${index + 1}:`);
        console.log(`   🏷️  الاسم: ${product.name || product.displayName || 'غير محدد'}`);
        console.log(`   💰 سعر البيع: ${product.listPrice || 0} درهم`);
        console.log(`   💵 السعر القياسي: ${product.standardPrice || 0} درهم`);
        console.log(`   📋 الكود: ${product.defaultCode || 'غير محدد'}`);
        console.log(`   📊 المخزون المتاح: ${product.qtyAvailable || 0}`);
        console.log(`   📈 المخزون الافتراضي: ${product.virtualAvailable || 0}`);
        console.log(`   ⚖️  الوزن: ${product.weight || 0} كجم`);
        console.log(`   📏 الحجم: ${product.volume || 0} م³`);
        console.log(`   ✅ نشط: ${product.active ? 'نعم' : 'لا'}`);
        console.log(`   🛒 قابل للبيع: ${product.saleOk ? 'نعم' : 'لا'}`);
        
        if (product.description) {
          console.log(`   📝 الوصف: ${product.description.substring(0, 100)}...`);
        }
      });

      // Statistics
      const activeProducts = products.filter(p => p.active);
      const saleableProducts = products.filter(p => p.saleOk);
      const inStockProducts = products.filter(p => (p.qtyAvailable || 0) > 0);
      const withPrices = products.filter(p => (p.listPrice || 0) > 0);

      console.log(`\n📊 إحصائيات المنتجات:`);
      console.log(`   📦 إجمالي المنتجات: ${products.length}`);
      console.log(`   ✅ المنتجات النشطة: ${activeProducts.length}`);
      console.log(`   🛒 القابلة للبيع: ${saleableProducts.length}`);
      console.log(`   📊 المتوفرة في المخزون: ${inStockProducts.length}`);
      console.log(`   💰 التي لها أسعار: ${withPrices.length}`);

      return {
        success: true,
        count: products.length,
        statistics: {
          total: products.length,
          active: activeProducts.length,
          saleable: saleableProducts.length,
          inStock: inStockProducts.length,
          withPrices: withPrices.length
        },
        data: products
      };
    } else {
      console.log('❌ لم يتم العثور على منتجات');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المنتجات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Enhanced Products with More Details
async function testEnhancedProducts() {
  console.log('\n⭐ اختبار المنتجات المحسنة');
  console.log('='.repeat(50));

  const query = `
    query {
      products {
        id
        name
        displayName
        listPrice
        standardPrice
        defaultCode
        barcode
        weight
        volume
        description
        descriptionSale
        active
        saleOk
        purchaseOk
        qtyAvailable
        virtualAvailable
        incomingQty
        outgoingQty
        image1920
        imageSmall
        imageMedium
        websitePublished
        isPublished
        createDate
        writeDate
        categId {
          id
          name
          displayName
          completeName
        }
        productVariantIds {
          id
          displayName
          listPrice
          standardPrice
          defaultCode
          barcode
        }
        attributeLineIds {
          id
          attributeId {
            id
            name
            displayName
          }
          valueIds {
            id
            name
            displayName
          }
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.products) {
      const products = result.data.products;
      console.log(`✅ تم العثور على ${products.length} منتج محسن`);
      
      // Featured products (published and active)
      const featuredProducts = products.filter(p => p.websitePublished && p.active && p.saleOk);
      console.log(`⭐ المنتجات المميزة: ${featuredProducts.length}`);
      
      featuredProducts.slice(0, 3).forEach((product, index) => {
        console.log(`\n⭐ المنتج المميز ${index + 1}:`);
        console.log(`   🏷️  الاسم: ${product.name || product.displayName || 'غير محدد'}`);
        console.log(`   💰 السعر: ${product.listPrice || 0} درهم`);
        console.log(`   📋 الكود: ${product.defaultCode || 'غير محدد'}`);
        console.log(`   📊 المخزون: ${product.qtyAvailable || 0}`);
        console.log(`   📂 الفئة: ${product.categId?.name || 'غير محدد'}`);
        console.log(`   🖼️  له صورة: ${product.image1920 ? 'نعم' : 'لا'}`);
        console.log(`   🌐 منشور على الموقع: ${product.websitePublished ? 'نعم' : 'لا'}`);
        
        if (product.productVariantIds?.length > 0) {
          console.log(`   🎨 المتغيرات: ${product.productVariantIds.length}`);
          product.productVariantIds.slice(0, 2).forEach(variant => {
            console.log(`      - ${variant.displayName} (${variant.listPrice || 0} درهم)`);
          });
        }
        
        if (product.attributeLineIds?.length > 0) {
          console.log(`   🏷️  الخصائص: ${product.attributeLineIds.length}`);
          product.attributeLineIds.slice(0, 2).forEach(attr => {
            const values = attr.valueIds?.map(v => v.name).join(', ') || 'غير محدد';
            console.log(`      - ${attr.attributeId?.name}: ${values}`);
          });
        }
      });

      return {
        success: true,
        count: products.length,
        featured: featuredProducts.length,
        data: products
      };
    } else {
      console.log('❌ لم يتم العثور على منتجات محسنة');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المنتجات المحسنة: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Single Product Details
async function testSingleProduct() {
  console.log('\n🔍 اختبار منتج واحد بالتفصيل');
  console.log('='.repeat(50));

  const query = `
    query {
      product(id: 1) {
        id
        name
        displayName
        listPrice
        standardPrice
        defaultCode
        barcode
        weight
        volume
        description
        descriptionSale
        active
        saleOk
        purchaseOk
        qtyAvailable
        virtualAvailable
        incomingQty
        outgoingQty
        image1920
        imageSmall
        imageMedium
        websitePublished
        isPublished
        createDate
        writeDate
        categId {
          id
          name
          displayName
          completeName
          parentId {
            id
            name
            displayName
          }
        }
        productVariantIds {
          id
          displayName
          listPrice
          standardPrice
          defaultCode
          barcode
          qtyAvailable
        }
        attributeLineIds {
          id
          attributeId {
            id
            name
            displayName
            type
          }
          valueIds {
            id
            name
            displayName
          }
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.product) {
      const product = result.data.product;
      console.log(`✅ تفاصيل المنتج:`);
      
      console.log(`\n📦 معلومات أساسية:`);
      console.log(`   🆔 المعرف: ${product.id}`);
      console.log(`   🏷️  الاسم: ${product.name || product.displayName || 'غير محدد'}`);
      console.log(`   💰 سعر البيع: ${product.listPrice || 0} درهم`);
      console.log(`   💵 السعر القياسي: ${product.standardPrice || 0} درهم`);
      console.log(`   📋 الكود: ${product.defaultCode || 'غير محدد'}`);
      console.log(`   📊 المخزون المتاح: ${product.qtyAvailable || 0}`);
      console.log(`   📈 المخزون الافتراضي: ${product.virtualAvailable || 0}`);
      console.log(`   📥 الكمية الواردة: ${product.incomingQty || 0}`);
      console.log(`   📤 الكمية الصادرة: ${product.outgoingQty || 0}`);
      
      console.log(`\n📂 معلومات الفئة:`);
      if (product.categId) {
        console.log(`   🏷️  الفئة: ${product.categId.name || 'غير محدد'}`);
        console.log(`   📋 الاسم الكامل: ${product.categId.completeName || 'غير محدد'}`);
        if (product.categId.parentId) {
          console.log(`   👆 الفئة الأب: ${product.categId.parentId.name || 'غير محدد'}`);
        }
      } else {
        console.log(`   ❌ لا توجد فئة محددة`);
      }
      
      console.log(`\n🎨 المتغيرات:`);
      if (product.productVariantIds?.length > 0) {
        console.log(`   📊 عدد المتغيرات: ${product.productVariantIds.length}`);
        product.productVariantIds.forEach((variant, index) => {
          console.log(`   ${index + 1}. ${variant.displayName}`);
          console.log(`      💰 السعر: ${variant.listPrice || 0} درهم`);
          console.log(`      📋 الكود: ${variant.defaultCode || 'غير محدد'}`);
          console.log(`      📊 المخزون: ${variant.qtyAvailable || 0}`);
        });
      } else {
        console.log(`   ❌ لا توجد متغيرات`);
      }
      
      console.log(`\n🏷️  الخصائص:`);
      if (product.attributeLineIds?.length > 0) {
        console.log(`   📊 عدد الخصائص: ${product.attributeLineIds.length}`);
        product.attributeLineIds.forEach((attr, index) => {
          const values = attr.valueIds?.map(v => v.name).join(', ') || 'غير محدد';
          console.log(`   ${index + 1}. ${attr.attributeId?.name || 'غير محدد'}`);
          console.log(`      🏷️  النوع: ${attr.attributeId?.type || 'غير محدد'}`);
          console.log(`      📋 القيم: ${values}`);
        });
      } else {
        console.log(`   ❌ لا توجد خصائص`);
      }
      
      console.log(`\n🖼️  الصور:`);
      console.log(`   📸 صورة كبيرة: ${product.image1920 ? 'متوفرة' : 'غير متوفرة'}`);
      console.log(`   📷 صورة متوسطة: ${product.imageMedium ? 'متوفرة' : 'غير متوفرة'}`);
      console.log(`   📱 صورة صغيرة: ${product.imageSmall ? 'متوفرة' : 'غير متوفرة'}`);
      
      console.log(`\n🌐 النشر:`);
      console.log(`   ✅ نشط: ${product.active ? 'نعم' : 'لا'}`);
      console.log(`   🛒 قابل للبيع: ${product.saleOk ? 'نعم' : 'لا'}`);
      console.log(`   🌐 منشور على الموقع: ${product.websitePublished ? 'نعم' : 'لا'}`);
      
      if (product.description) {
        console.log(`\n📝 الوصف:`);
        console.log(`   ${product.description.substring(0, 200)}...`);
      }

      return {
        success: true,
        data: product
      };
    } else {
      console.log('❌ لم يتم العثور على المنتج');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المنتج: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Categories
async function testCategories() {
  console.log('\n📂 اختبار الفئات والأقسام');
  console.log('='.repeat(50));

  const query = `
    query {
      productCategories {
        id
        name
        displayName
        completeName
        parentId {
          id
          name
          displayName
        }
        childId {
          id
          name
          displayName
        }
        productCount
        sequence
        active
        createDate
        writeDate
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.productCategories) {
      const categories = result.data.productCategories;
      console.log(`✅ تم العثور على ${categories.length} فئة`);
      
      // Main categories (no parent)
      const mainCategories = categories.filter(cat => !cat.parentId);
      const subCategories = categories.filter(cat => cat.parentId);
      
      console.log(`📁 الفئات الرئيسية: ${mainCategories.length}`);
      console.log(`📂 الفئات الفرعية: ${subCategories.length}`);
      
      console.log(`\n🏷️  الفئات الرئيسية:`);
      mainCategories.forEach((category, index) => {
        console.log(`\n📂 ${index + 1}. ${category.name || category.displayName}`);
        console.log(`   🆔 المعرف: ${category.id}`);
        console.log(`   📋 الاسم الكامل: ${category.completeName || 'غير محدد'}`);
        console.log(`   📊 عدد المنتجات: ${category.productCount || 0}`);
        console.log(`   🔢 الترتيب: ${category.sequence || 0}`);
        console.log(`   ✅ نشط: ${category.active ? 'نعم' : 'لا'}`);
        
        // Find subcategories
        const subs = categories.filter(cat => cat.parentId?.id === category.id);
        if (subs.length > 0) {
          console.log(`   📁 الفئات الفرعية: ${subs.length}`);
          subs.forEach(sub => {
            console.log(`      - ${sub.name} (${sub.productCount || 0} منتج)`);
          });
        }
      });

      return {
        success: true,
        total: categories.length,
        main: mainCategories.length,
        sub: subCategories.length,
        data: categories
      };
    } else {
      console.log('❌ لم يتم العثور على فئات');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب الفئات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test GraphQL Schema
async function testGraphQLSchema() {
  console.log('\n🔍 اختبار مخطط GraphQL');
  console.log('='.repeat(50));

  const query = `
    query {
      __schema {
        types {
          name
          kind
          description
          fields {
            name
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
      const types = schema.types.filter(type => 
        !type.name.startsWith('__') && 
        type.kind === 'OBJECT' &&
        (type.name.toLowerCase().includes('product') || 
         type.name.toLowerCase().includes('category') ||
         type.name.toLowerCase().includes('page') ||
         type.name.toLowerCase().includes('blog'))
      );
      
      console.log(`✅ تم العثور على ${types.length} نوع مفيد في المخطط`);
      
      types.forEach(type => {
        console.log(`\n📋 النوع: ${type.name}`);
        if (type.description) {
          console.log(`   📝 الوصف: ${type.description}`);
        }
        if (type.fields && type.fields.length > 0) {
          console.log(`   🏷️  الحقول: ${type.fields.length}`);
          type.fields.slice(0, 5).forEach(field => {
            console.log(`      - ${field.name}: ${field.type?.name || field.type?.kind || 'غير محدد'}`);
          });
          if (type.fields.length > 5) {
            console.log(`      ... و ${type.fields.length - 5} حقل آخر`);
          }
        }
      });

      return {
        success: true,
        totalTypes: schema.types.length,
        usefulTypes: types.length,
        data: types
      };
    } else {
      console.log('❌ لم يتم العثور على مخطط');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المخطط: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main Test Function
async function runWorkingDataTest() {
  console.log('🚀 اختبار البيانات العاملة - استعلامات GraphQL المثبتة');
  console.log('='.repeat(70));
  console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
  console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
  console.log('='.repeat(70));

  const results = {
    timestamp: new Date().toISOString(),
    server: ODOO_CONFIG.baseUrl,
    tests: {}
  };

  try {
    // Test 1: Basic Products
    results.tests.basicProducts = await testBasicProducts();
    
    // Test 2: Enhanced Products
    results.tests.enhancedProducts = await testEnhancedProducts();
    
    // Test 3: Single Product
    results.tests.singleProduct = await testSingleProduct();
    
    // Test 4: Categories
    results.tests.categories = await testCategories();
    
    // Test 5: GraphQL Schema
    results.tests.schema = await testGraphQLSchema();

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 ملخص النتائج النهائي');
    console.log('='.repeat(70));
    
    const summary = {
      basicProducts: results.tests.basicProducts?.count || 0,
      enhancedProducts: results.tests.enhancedProducts?.count || 0,
      featuredProducts: results.tests.enhancedProducts?.featured || 0,
      categories: results.tests.categories?.total || 0,
      mainCategories: results.tests.categories?.main || 0,
      schemaTypes: results.tests.schema?.usefulTypes || 0
    };

    console.log(`🛍️  المنتجات الأساسية: ${summary.basicProducts}`);
    console.log(`⭐ المنتجات المحسنة: ${summary.enhancedProducts}`);
    console.log(`🌟 المنتجات المميزة: ${summary.featuredProducts}`);
    console.log(`📂 إجمالي الفئات: ${summary.categories} (${summary.mainCategories} رئيسية)`);
    console.log(`🔍 أنواع المخطط المفيدة: ${summary.schemaTypes}`);

    // Test Success Rate
    const successfulTests = Object.values(results.tests).filter(test => test.success).length;
    const totalTests = Object.keys(results.tests).length;
    const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

    console.log(`\n🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`);
    
    if (successRate >= 80) {
      console.log('🎉 ممتاز! النظام يعمل بشكل مثالي');
    } else if (successRate >= 60) {
      console.log('⚠️  جيد، لكن يحتاج تحسينات');
    } else {
      console.log('❌ يحتاج إصلاحات عاجلة');
    }

    console.log('\n🚀 النظام جاهز للاستخدام مع البيانات الحقيقية!');
    console.log('📋 يمكن الآن استخدام هذه الاستعلامات في التطبيق');

    results.summary = summary;
    results.successRate = successRate;

    return results;

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    results.error = error.message;
    return results;
  }
}

// Run the test
if (require.main === module) {
  runWorkingDataTest()
    .then(results => {
      console.log('\n✅ اكتمل اختبار البيانات العاملة بنجاح!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل اختبار البيانات:', error.message);
      process.exit(1);
    });
}

module.exports = { runWorkingDataTest };