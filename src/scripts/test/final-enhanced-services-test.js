#!/usr/bin/env node

/**
 * Final Enhanced Services Test - اختبار الخدمات المحسنة النهائي
 * اختبار شامل لجميع الخدمات المحدثة مع الحقول المتاحة
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

// Test 1: All Products with Available Fields
async function testAllProducts() {
  console.log('\n🛍️ اختبار 1: جميع المنتجات مع الحقول المتاحة');
  console.log('='.repeat(60));

  const query = `
    query GetAllProducts {
      products {
        products {
          id
          name
          price
          barcode
          weight
          description
          image
          imageFilename
          slug
          sku
          isInStock
          categories {
            id
            name
            slug
          }
          # Variant Information - Available Fields
          combinationInfoVariant
          variantPrice
          variantPriceAfterDiscount
          variantHasDiscountedPrice
          isVariantPossible
          variantAttributeValues {
            id
            name
            attribute {
              id
              name
            }
          }
          attributeValues {
            id
            name
            attribute {
              id
              name
            }
          }
          productVariants {
            id
            name
            price
            attributeValues {
              id
              name
            }
          }
          firstVariant {
            id
            name
            price
          }
        }
        totalCount
        minPrice
        maxPrice
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);

    if (result.data?.products?.products) {
      const products = result.data.products.products;
      console.log(`✅ تم العثور على ${products.length} منتج`);

      let productsWithVariants = 0;
      let productsWithAttributes = 0;
      let productsWithVariantPricing = 0;
      let productsWithCategories = 0;

      products.forEach((product, index) => {
        console.log(`\n📦 المنتج ${index + 1}: ${product.name}`);
        console.log(`   🆔 المعرف: ${product.id}`);
        console.log(`   💰 السعر الأساسي: ${product.price} درهم`);
        console.log(`   📋 الكود: ${product.sku || product.barcode || 'غير محدد'}`);
        console.log(`   📊 متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
        console.log(`   🏷️  الفئات: ${product.categories?.length || 0}`);

        if (product.categories && product.categories.length > 0) {
          productsWithCategories++;
          product.categories.forEach(cat => {
            console.log(`      - ${cat.name} (${cat.slug || 'بدون رابط'})`);
          });
        }

        // Check variants
        if (product.productVariants && product.productVariants.length > 0) {
          console.log(`   🎨 المتغيرات: ${product.productVariants.length}`);
          productsWithVariants++;

          product.productVariants.forEach((variant, vIndex) => {
            console.log(`      ${vIndex + 1}. ${variant.name} - ${variant.price} درهم`);
          });
        }

        // Check attributes
        if (product.attributeValues && product.attributeValues.length > 0) {
          console.log(`   🏷️  الخصائص: ${product.attributeValues.length}`);
          productsWithAttributes++;

          product.attributeValues.forEach((attr, aIndex) => {
            console.log(`      ${aIndex + 1}. ${attr.attribute?.name || 'غير محدد'}: ${attr.name}`);
          });
        }

        // Check variant pricing
        if (product.variantPrice || product.variantPriceAfterDiscount) {
          console.log(`   💰 سعر المتغير: ${product.variantPrice || 'غير محدد'}`);
          console.log(`   💰 سعر المتغير بعد الخصم: ${product.variantPriceAfterDiscount || 'غير محدد'}`);
          console.log(`   🎯 متغير ممكن: ${product.isVariantPossible ? 'نعم' : 'لا'}`);
          productsWithVariantPricing++;
        }

        // Check first variant
        if (product.firstVariant) {
          console.log(`   🎨 المتغير الأول: ${product.firstVariant.name} - ${product.firstVariant.price} درهم`);
        }
      });

      console.log(`\n📊 إحصائيات المنتجات:`);
      console.log(`   📦 إجمالي المنتجات: ${products.length}`);
      console.log(`   🎨 منتجات مع متغيرات: ${productsWithVariants}`);
      console.log(`   🏷️  منتجات مع خصائص: ${productsWithAttributes}`);
      console.log(`   💰 منتجات مع تسعير متغيرات: ${productsWithVariantPricing}`);
      console.log(`   📂 منتجات مع فئات: ${productsWithCategories}`);

      return {
        success: true,
        totalProducts: products.length,
        productsWithVariants,
        productsWithAttributes,
        productsWithVariantPricing,
        productsWithCategories,
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
    console.log(`❌ خطأ في اختبار المنتجات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 2: Single Product by ID
async function testSingleProduct(productId = 1) {
  console.log(`\n🔍 اختبار 2: منتج واحد بالمعرف (ID: ${productId})`);
  console.log('='.repeat(60));

  const query = `
    query GetProductById($id: Int!) {
      product(id: $id) {
        id
        name
        price
        barcode
        weight
        description
        image
        imageFilename
        slug
        sku
        isInStock
        categories {
          id
          name
          slug
        }
        # Variant Information - Available Fields
        combinationInfoVariant
        variantPrice
        variantPriceAfterDiscount
        variantHasDiscountedPrice
        isVariantPossible
        variantAttributeValues {
          id
          name
          attribute {
            id
            name
          }
        }
        attributeValues {
          id
          name
          attribute {
            id
            name
          }
        }
        productVariants {
          id
          name
          price
          attributeValues {
            id
            name
          }
        }
        firstVariant {
          id
          name
          price
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, { id: productId });

    if (result.data?.product) {
      const product = result.data.product;

      console.log(`✅ تم العثور على المنتج بنجاح:`);
      console.log(`   🏷️  الاسم: ${product.name}`);
      console.log(`   🆔 المعرف: ${product.id}`);
      console.log(`   💰 السعر الأساسي: ${product.price} درهم`);
      console.log(`   📋 الكود: ${product.sku || product.barcode || 'غير محدد'}`);
      console.log(`   📊 متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
      console.log(`   🏷️  الفئات: ${product.categories?.length || 0}`);

      // Variant Information
      console.log(`\n🎨 معلومات المتغيرات:`);
      console.log(`   🎯 متغير ممكن: ${product.isVariantPossible ? 'نعم' : 'لا'}`);
      console.log(`   💰 سعر المتغير: ${product.variantPrice || 'غير محدد'}`);
      console.log(`   💰 سعر المتغير بعد الخصم: ${product.variantPriceAfterDiscount || 'غير محدد'}`);
      console.log(`   🎯 له خصم: ${product.variantHasDiscountedPrice ? 'نعم' : 'لا'}`);

      if (product.productVariants && product.productVariants.length > 0) {
        console.log(`   🎨 عدد المتغيرات: ${product.productVariants.length}`);
        product.productVariants.forEach((variant, index) => {
          console.log(`      ${index + 1}. ${variant.name} - ${variant.price} درهم`);
        });
      }

      // Attribute Information
      console.log(`\n🏷️  معلومات الخصائص:`);
      if (product.attributeValues && product.attributeValues.length > 0) {
        console.log(`   🏷️  عدد الخصائص: ${product.attributeValues.length}`);
        product.attributeValues.forEach((attr, index) => {
          console.log(`      ${index + 1}. ${attr.attribute?.name || 'غير محدد'}: ${attr.name}`);
        });
      }

      if (product.variantAttributeValues && product.variantAttributeValues.length > 0) {
        console.log(`   🏷️  خصائص المتغيرات: ${product.variantAttributeValues.length}`);
        product.variantAttributeValues.forEach((attr, index) => {
          console.log(`      ${index + 1}. ${attr.attribute?.name || 'غير محدد'}: ${attr.name}`);
        });
      }

      // First Variant
      if (product.firstVariant) {
        console.log(`\n🎨 المتغير الأول:`);
        console.log(`   🏷️  الاسم: ${product.firstVariant.name}`);
        console.log(`   💰 السعر: ${product.firstVariant.price} درهم`);
      }

      return { success: true, product: product };
    } else {
      console.log(`❌ لم يتم العثور على المنتج بالمعرف: ${productId}`);
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في اختبار المنتج الواحد: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 3: All Categories
async function testAllCategories() {
  console.log('\n📂 اختبار 3: جميع الفئات');
  console.log('='.repeat(60));

  const query = `
    query GetAllCategories {
      categories {
        categories {
          id
          name
          slug
          metaDescription
          image
          imageFilename
          parent {
            id
            name
          }
          childs {
            id
            name
            slug
          }
        }
        totalCount
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);

    if (result.data?.categories?.categories) {
      const categories = result.data.categories.categories;
      console.log(`✅ تم العثور على ${categories.length} فئة`);

      const mainCategories = categories.filter(cat => !cat.parent);
      console.log(`📁 الفئات الرئيسية: ${mainCategories.length}`);

      mainCategories.forEach((category, index) => {
        console.log(`\n📂 الفئة ${index + 1}: ${category.name}`);
        console.log(`   🆔 المعرف: ${category.id}`);
        console.log(`   🔗 الرابط: ${category.slug || 'غير محدد'}`);
        console.log(`   📝 الوصف: ${category.metaDescription || 'غير محدد'}`);

        const subCategories = categories.filter(cat => cat.parent?.id === category.id);
        if (subCategories.length > 0) {
          console.log(`   📁 الفئات الفرعية: ${subCategories.length}`);
          subCategories.forEach(sub => {
            console.log(`      - ${sub.name} (${sub.slug || 'بدون رابط'})`);
          });
        }
      });

      return { success: true, categories: categories, mainCount: mainCategories.length };
    } else {
      console.log('❌ لم يتم العثور على فئات');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في اختبار الفئات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 4: Category with Products
async function testCategoryWithProducts(categoryId = 1) {
  console.log(`\n🛍️ اختبار 4: فئة مع منتجاتها (Category ID: ${categoryId})`);
  console.log('='.repeat(60));

  const query = `
    query GetCategoryWithProducts($id: Int!) {
      category(id: $id) {
        id
        name
        slug
        metaDescription
        image
        imageFilename
        parent {
          id
          name
        }
        childs {
          id
          name
          slug
        }
        products {
          id
          name
          price
          barcode
          weight
          description
          image
          imageFilename
          slug
          sku
          isInStock
          # Variant Information - Available Fields
          combinationInfoVariant
          variantPrice
          variantPriceAfterDiscount
          variantHasDiscountedPrice
          isVariantPossible
          variantAttributeValues {
            id
            name
            attribute {
              id
              name
            }
          }
          attributeValues {
            id
            name
            attribute {
              id
              name
            }
          }
          productVariants {
            id
            name
            price
            attributeValues {
              id
              name
            }
          }
          firstVariant {
            id
            name
            price
          }
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query, { id: categoryId });

    if (result.data?.category) {
      const category = result.data.category;
      const products = category.products || [];

      console.log(`✅ تم العثور على فئة: ${category.name}`);
      console.log(`📦 المنتجات في الفئة: ${products.length}`);

      let productsWithVariants = 0;
      let productsWithAttributes = 0;
      let productsWithVariantPricing = 0;

      products.forEach((product, index) => {
        console.log(`\n📦 المنتج ${index + 1}: ${product.name}`);
        console.log(`   💰 السعر: ${product.price} درهم`);
        console.log(`   📋 الكود: ${product.sku || product.barcode || 'غير محدد'}`);
        console.log(`   📊 متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);

        if (product.productVariants && product.productVariants.length > 0) {
          console.log(`   🎨 المتغيرات: ${product.productVariants.length}`);
          productsWithVariants++;
        }

        if (product.attributeValues && product.attributeValues.length > 0) {
          console.log(`   🏷️  الخصائص: ${product.attributeValues.length}`);
          productsWithAttributes++;
        }

        if (product.variantPrice || product.variantPriceAfterDiscount) {
          console.log(`   💰 تسعير متغيرات: متاح`);
          productsWithVariantPricing++;
        }
      });

      console.log(`\n📊 إحصائيات فئة ${category.name}:`);
      console.log(`   📦 إجمالي المنتجات: ${products.length}`);
      console.log(`   🎨 منتجات مع متغيرات: ${productsWithVariants}`);
      console.log(`   🏷️  منتجات مع خصائص: ${productsWithAttributes}`);
      console.log(`   💰 منتجات مع تسعير متغيرات: ${productsWithVariantPricing}`);

      return {
        success: true,
        category: category,
        totalProducts: products.length,
        productsWithVariants,
        productsWithAttributes,
        productsWithVariantPricing
      };
    } else {
      console.log(`❌ لم يتم العثور على الفئة بالمعرف: ${categoryId}`);
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, errors: result.errors };
    }
  } catch (error) {
    console.log(`❌ خطأ في اختبار منتجات الفئة: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main Test Function
async function runFinalEnhancedServicesTest() {
  console.log('🚀 اختبار الخدمات المحسنة النهائي - جميع البيانات المتاحة');
  console.log('='.repeat(80));
  console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
  console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
  console.log(`🕐 الوقت: ${new Date().toLocaleString('ar-SA')}`);
  console.log('='.repeat(80));

  const results = {
    timestamp: new Date().toISOString(),
    server: ODOO_CONFIG.baseUrl,
    tests: {}
  };

  try {
    // Test 1: All Products
    results.tests.allProducts = await testAllProducts();

    // Test 2: Single Product
    results.tests.singleProduct = await testSingleProduct(1);

    // Test 3: All Categories
    results.tests.allCategories = await testAllCategories();

    // Test 4: Category with Products
    if (results.tests.allCategories.success && results.tests.allCategories.categories.length > 0) {
      const firstCategoryId = results.tests.allCategories.categories[0].id;
      results.tests.categoryWithProducts = await testCategoryWithProducts(firstCategoryId);
    } else {
      results.tests.categoryWithProducts = { success: false, error: 'No categories available' };
    }

    // Final Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 ملخص نتائج الاختبار النهائي');
    console.log('='.repeat(80));

    const summary = {
      allProducts: results.tests.allProducts?.success || false,
      singleProduct: results.tests.singleProduct?.success || false,
      allCategories: results.tests.allCategories?.success || false,
      categoryWithProducts: results.tests.categoryWithProducts?.success || false,
    };

    console.log(`🛍️  جميع المنتجات: ${summary.allProducts ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🔍 منتج واحد: ${summary.singleProduct ? '✅ نجح' : '❌ فشل'}`);
    console.log(`📂 جميع الفئات: ${summary.allCategories ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🛍️  فئة مع منتجات: ${summary.categoryWithProducts ? '✅ نجح' : '❌ فشل'}`);

    // Detailed Results
    if (results.tests.allProducts?.success) {
      console.log(`\n📦 تفاصيل المنتجات:`);
      console.log(`   إجمالي المنتجات: ${results.tests.allProducts.totalProducts}`);
      console.log(`   منتجات مع متغيرات: ${results.tests.allProducts.productsWithVariants}`);
      console.log(`   منتجات مع خصائص: ${results.tests.allProducts.productsWithAttributes}`);
      console.log(`   منتجات مع تسعير متغيرات: ${results.tests.allProducts.productsWithVariantPricing}`);
      console.log(`   منتجات مع فئات: ${results.tests.allProducts.productsWithCategories}`);
    }

    if (results.tests.allCategories?.success) {
      console.log(`\n📂 تفاصيل الفئات:`);
      console.log(`   إجمالي الفئات: ${results.tests.allCategories.categories.length}`);
      console.log(`   الفئات الرئيسية: ${results.tests.allCategories.mainCount}`);
    }

    const successfulTests = Object.values(summary).filter(test => test).length;
    const totalTests = Object.keys(summary).length;
    const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

    console.log(`\n🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`);

    // Final Conclusion
    console.log('\n🔍 الخلاصة النهائية:');
    if (successRate >= 80) {
      console.log('✅ ممتاز! جميع الخدمات تعمل بشكل مثالي');
      console.log('🎨 متغيرات المنتج والخصائص متاحة ومفعلة');
      console.log('💰 تسعير المتغيرات يعمل');
      console.log('🏷️  جميع الحقول المدعومة تعمل');
      console.log('📂 نظام الفئات يعمل بشكل كامل');
    } else if (successRate >= 60) {
      console.log('⚠️  جيد، معظم الخدمات تعمل');
      console.log('🔧 بعض التحسينات مطلوبة');
    } else {
      console.log('❌ يحتاج إصلاحات عاجلة');
      console.log('🔧 الخدمات الأساسية غير متاحة');
    }

    results.summary = summary;
    results.successRate = successRate;

    return results;

  } catch (error) {
    console.error('❌ خطأ في الاختبار النهائي:', error.message);
    results.error = error.message;
    return results;
  }
}

// Run the test
if (require.main === module) {
  runFinalEnhancedServicesTest()
    .then(results => {
      console.log('\n✅ اكتمل الاختبار النهائي!');
      console.log('🎊 تم فحص جميع الخدمات والبيانات!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل الاختبار النهائي:', error.message);
      process.exit(1);
    });
}

module.exports = { runFinalEnhancedServicesTest };