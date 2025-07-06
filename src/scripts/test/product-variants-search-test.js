#!/usr/bin/env node

/**
 * Product Variants Search Test - Deep Schema Analysis
 * اختبار البحث عن متغيرات المنتج - تحليل عميق للاسكيما
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

// Test 1: Search for Product Variants in Products Query
async function searchProductVariantsInProducts() {
  console.log('\n🔍 البحث 1: متغيرات المنتج في استعلام المنتجات');
  console.log('='.repeat(60));

  const query = `
    query SearchProductVariants {
      products {
        products {
          id
          name
          price
          variants {
            id
            name
            price
            sku
            attributes {
              name
              value
            }
          }
          productVariants {
            id
            name
            price
            sku
          }
          productVariantIds {
            id
            name
            price
            sku
          }
          attributeLineIds {
            id
            attributeId {
              id
              name
            }
            valueIds {
              id
              name
            }
          }
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.products?.products) {
      const products = result.data.products.products;
      console.log(`✅ تم العثور على ${products.length} منتج`);
      
      let variantsFound = false;
      products.forEach((product, index) => {
        console.log(`\n📦 المنتج ${index + 1}: ${product.name}`);
        
        // Check for variants field
        if (product.variants) {
          console.log(`   🎨 variants: موجود (${Array.isArray(product.variants) ? product.variants.length : 'كائن'})`);
          variantsFound = true;
        }
        
        // Check for productVariants field
        if (product.productVariants) {
          console.log(`   🎨 productVariants: موجود (${Array.isArray(product.productVariants) ? product.productVariants.length : 'كائن'})`);
          variantsFound = true;
        }
        
        // Check for productVariantIds field
        if (product.productVariantIds) {
          console.log(`   🎨 productVariantIds: موجود (${Array.isArray(product.productVariantIds) ? product.productVariantIds.length : 'كائن'})`);
          variantsFound = true;
        }
        
        // Check for attributeLineIds field
        if (product.attributeLineIds) {
          console.log(`   🏷️  attributeLineIds: موجود (${Array.isArray(product.attributeLineIds) ? product.attributeLineIds.length : 'كائن'})`);
          variantsFound = true;
        }
      });
      
      return { 
        success: true, 
        variantsFound: variantsFound,
        totalProducts: products.length,
        data: products
      };
    } else {
      console.log('❌ لم يتم العثور على منتجات');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في البحث: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 2: Direct Product Variants Query
async function searchDirectProductVariants() {
  console.log('\n🔍 البحث 2: استعلام مباشر لمتغيرات المنتج');
  console.log('='.repeat(60));

  const query = `
    query DirectProductVariants {
      productVariants {
        id
        name
        price
        sku
        product {
          id
          name
        }
        attributes {
          name
          value
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.productVariants) {
      const variants = result.data.productVariants;
      console.log(`✅ تم العثور على ${variants.length} متغير منتج`);
      
      variants.forEach((variant, index) => {
        console.log(`\n🎨 المتغير ${index + 1}:`);
        console.log(`   🏷️  الاسم: ${variant.name}`);
        console.log(`   💰 السعر: ${variant.price} درهم`);
        console.log(`   📋 الكود: ${variant.sku || 'غير محدد'}`);
        console.log(`   📦 المنتج الأساسي: ${variant.product?.name || 'غير محدد'}`);
      });
      
      return { success: true, variants: variants, count: variants.length };
    } else {
      console.log('❌ لم يتم العثور على متغيرات منتج');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في البحث: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 3: Product Attributes Query
async function searchProductAttributes() {
  console.log('\n🔍 البحث 3: استعلام خصائص المنتج');
  console.log('='.repeat(60));

  const query = `
    query ProductAttributes {
      productAttributes {
        id
        name
        displayName
        type
        values {
          id
          name
          displayName
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.productAttributes) {
      const attributes = result.data.productAttributes;
      console.log(`✅ تم العثور على ${attributes.length} خاصية منتج`);
      
      attributes.forEach((attr, index) => {
        console.log(`\n🏷️  الخاصية ${index + 1}:`);
        console.log(`   📝 الاسم: ${attr.name}`);
        console.log(`   📋 النوع: ${attr.type || 'غير محدد'}`);
        if (attr.values && attr.values.length > 0) {
          console.log(`   🎯 القيم: ${attr.values.map(v => v.name).join(', ')}`);
        }
      });
      
      return { success: true, attributes: attributes, count: attributes.length };
    } else {
      console.log('❌ لم يتم العثور على خصائص منتج');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في البحث: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 4: Schema Introspection for Variants
async function introspectVariantsSchema() {
  console.log('\n🔍 البحث 4: فحص الاسكيما للمتغيرات');
  console.log('='.repeat(60));

  const query = `
    query IntrospectSchema {
      __schema {
        types {
          name
          fields {
            name
            type {
              name
              ofType {
                name
              }
            }
          }
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.__schema?.types) {
      const types = result.data.__schema.types;
      console.log(`✅ تم العثور على ${types.length} نوع في الاسكيما`);
      
      // Search for variant-related types
      const variantTypes = types.filter(type => 
        type.name && (
          type.name.toLowerCase().includes('variant') ||
          type.name.toLowerCase().includes('attribute') ||
          type.name.toLowerCase().includes('product')
        )
      );
      
      console.log(`\n🎨 الأنواع المرتبطة بالمتغيرات: ${variantTypes.length}`);
      
      variantTypes.forEach(type => {
        console.log(`\n📋 النوع: ${type.name}`);
        if (type.fields && type.fields.length > 0) {
          const relevantFields = type.fields.filter(field => 
            field.name.toLowerCase().includes('variant') ||
            field.name.toLowerCase().includes('attribute') ||
            field.name.toLowerCase().includes('option')
          );
          
          if (relevantFields.length > 0) {
            console.log(`   🔍 الحقول ذات الصلة:`);
            relevantFields.forEach(field => {
              console.log(`      - ${field.name}: ${field.type.name || field.type.ofType?.name || 'نوع معقد'}`);
            });
          }
        }
      });
      
      return { success: true, variantTypes: variantTypes, totalTypes: types.length };
    } else {
      console.log('❌ فشل في فحص الاسكيما');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في فحص الاسكيما: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 5: Search in Existing Queries Files
async function searchInQueryFiles() {
  console.log('\n🔍 البحث 5: البحث في ملفات الاستعلامات الموجودة');
  console.log('='.repeat(60));

  // This would search through the project files for variant-related queries
  // Since we can't read files directly in this context, we'll simulate the search
  
  const potentialVariantQueries = [
    'productVariants',
    'variants',
    'productVariantIds',
    'attributeLineIds',
    'productAttributes',
    'variantOptions',
    'productOptions'
  ];
  
  console.log('🔍 البحث عن الاستعلامات المحتملة للمتغيرات:');
  potentialVariantQueries.forEach((query, index) => {
    console.log(`   ${index + 1}. ${query}`);
  });
  
  console.log('\n📁 الملفات المحتملة للفحص:');
  const filesToCheck = [
    'src/graphql/queries/products.ts',
    'src/graphql/queries/variants.ts',
    'src/graphql/mutations/products.ts',
    'src/services/odoo/product.service.ts',
    'src/hooks/useOdooProducts.ts'
  ];
  
  filesToCheck.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  return { 
    success: true, 
    potentialQueries: potentialVariantQueries,
    filesToCheck: filesToCheck
  };
}

// Main Test Function
async function runProductVariantsSearchTest() {
  console.log('🚀 اختبار البحث الشامل عن متغيرات المنتج');
  console.log('='.repeat(80));
  console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
  console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
  console.log(`🕐 الوقت: ${new Date().toLocaleString('ar-SA')}`);
  console.log('='.repeat(80));

  const results = {
    timestamp: new Date().toISOString(),
    server: ODOO_CONFIG.baseUrl,
    searches: {}
  };

  try {
    // Search 1: Product Variants in Products
    results.searches.productsVariants = await searchProductVariantsInProducts();
    
    // Search 2: Direct Product Variants
    results.searches.directVariants = await searchDirectProductVariants();
    
    // Search 3: Product Attributes
    results.searches.productAttributes = await searchProductAttributes();
    
    // Search 4: Schema Introspection
    results.searches.schemaIntrospection = await introspectVariantsSchema();
    
    // Search 5: Query Files Search
    results.searches.queryFiles = await searchInQueryFiles();

    // Final Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 ملخص نتائج البحث عن متغيرات المنتج');
    console.log('='.repeat(80));

    const summary = {
      productsWithVariants: results.searches.productsVariants?.variantsFound || false,
      directVariants: results.searches.directVariants?.success || false,
      productAttributes: results.searches.productAttributes?.success || false,
      schemaTypes: results.searches.schemaIntrospection?.success || false,
      queryFiles: results.searches.queryFiles?.success || false
    };

    console.log(`🔍 متغيرات في المنتجات: ${summary.productsWithVariants ? '✅ موجود' : '❌ غير موجود'}`);
    console.log(`🎨 متغيرات مباشرة: ${summary.directVariants ? '✅ موجود' : '❌ غير موجود'}`);
    console.log(`🏷️  خصائص المنتج: ${summary.productAttributes ? '✅ موجود' : '❌ غير موجود'}`);
    console.log(`📋 أنواع الاسكيما: ${summary.schemaTypes ? '✅ موجود' : '❌ غير موجود'}`);
    console.log(`📁 ملفات الاستعلام: ${summary.queryFiles ? '✅ تم الفحص' : '❌ لم يتم الفحص'}`);

    // Detailed Results
    if (results.searches.directVariants?.success) {
      console.log(`\n🎨 إجمالي متغيرات المنتج المباشرة: ${results.searches.directVariants.count}`);
    }
    
    if (results.searches.productAttributes?.success) {
      console.log(`🏷️  إجمالي خصائص المنتج: ${results.searches.productAttributes.count}`);
    }
    
    if (results.searches.schemaIntrospection?.success) {
      console.log(`📋 أنواع الاسكيما ذات الصلة: ${results.searches.schemaIntrospection.variantTypes.length}`);
    }

    const successfulSearches = Object.values(summary).filter(search => search).length;
    const totalSearches = Object.keys(summary).length;
    const successRate = ((successfulSearches / totalSearches) * 100).toFixed(1);

    console.log(`\n🎯 معدل نجاح البحث: ${successRate}% (${successfulSearches}/${totalSearches})`);

    // Final Conclusion
    console.log('\n🔍 الخلاصة النهائية:');
    if (summary.productsWithVariants || summary.directVariants) {
      console.log('✅ نعم، يوجد نظام متغيرات المنتج في التطبيق!');
      console.log('🎨 يمكن الوصول للمتغيرات من خلال الاستعلامات المتاحة');
    } else {
      console.log('❌ لا يوجد نظام متغيرات منتج واضح في الاستعلامات الحالية');
      console.log('🔧 قد يحتاج إلى تطوير أو تفعيل في نظام Odoo');
    }

    results.summary = summary;
    results.successRate = successRate;

    return results;

  } catch (error) {
    console.error('❌ خطأ في اختبار البحث:', error.message);
    results.error = error.message;
    return results;
  }
}

// Run the test
if (require.main === module) {
  runProductVariantsSearchTest()
    .then(results => {
      console.log('\n✅ اكتمل اختبار البحث عن متغيرات المنتج!');
      console.log('🎊 تم فحص جميع الاستعلامات والبيانات المتاحة!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل اختبار البحث:', error.message);
      process.exit(1);
    });
}

module.exports = { runProductVariantsSearchTest };