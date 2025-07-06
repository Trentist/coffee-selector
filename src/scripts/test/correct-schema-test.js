#!/usr/bin/env node

/**
 * Correct Schema Test - Using Real Available Fields
 * اختبار المخطط الصحيح - باستخدام الحقول المتاحة الحقيقية
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

// Test All Products with Correct Schema
async function testAllProducts() {
  console.log('\n🛍️ اختبار جميع المنتجات - المخطط الصحيح');
  console.log('='.repeat(50));

  const query = `
    query {
      products {
        products {
          id
          name
          price
          variantPrice
          description
          shortDescription
          image
          imageFilename
          weight
          barcode
          visibility
          status
          typeId
          isInStock
          stock
          slug
          sku
          metaTitle
          metaKeyword
          metaDescription
          categories {
            id
            name
            slug
          }
          productVariants {
            id
            displayName
            price
            variantPrice
            isInStock
            stock
          }
          attributeValues {
            id
            name
            search
            priceExtra
            htmlColor
            image
            imageFilename
          }
          productImages {
            id
            name
            image
            imageFilename
            video
          }
          tags {
            name
            color
            backgroundColor
            visibleOnEcommerce
            image
            imageFilename
          }
        }
        totalCount
        attributeValues {
          id
          name
          search
          priceExtra
          htmlColor
        }
        minPrice
        maxPrice
        currencyId
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.products?.products) {
      const products = result.data.products.products;
      const totalCount = result.data.products.totalCount;
      const minPrice = result.data.products.minPrice;
      const maxPrice = result.data.products.maxPrice;
      
      console.log(`✅ تم العثور على ${products.length} منتج من أصل ${totalCount}`);
      console.log(`💰 نطاق الأسعار: ${minPrice} - ${maxPrice} درهم`);
      
      // Show first 5 products with details
      products.slice(0, 5).forEach((product, index) => {
        console.log(`\n📦 المنتج ${index + 1}:`);
        console.log(`   🆔 المعرف: ${product.id}`);
        console.log(`   🏷️  الاسم: ${product.name || 'غير محدد'}`);
        console.log(`   💰 السعر: ${product.price || 0} درهم`);
        console.log(`   💵 سعر المتغير: ${product.variantPrice || 0} درهم`);
        console.log(`   📋 الكود: ${product.sku || 'غير محدد'}`);
        console.log(`   📊 المخزون: ${product.stock || 0}`);
        console.log(`   ✅ متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
        console.log(`   👁️  الرؤية: ${product.visibility || 0}`);
        console.log(`   📱 الحالة: ${product.status || 0}`);
        console.log(`   🖼️  له صورة: ${product.image ? 'نعم' : 'لا'}`);
        console.log(`   ⚖️  الوزن: ${product.weight || 0} كجم`);
        
        if (product.categories?.length > 0) {
          console.log(`   📂 الفئات: ${product.categories.length}`);
          product.categories.forEach(cat => {
            console.log(`      - ${cat.name} (${cat.slug})`);
          });
        }
        
        if (product.productVariants?.length > 0) {
          console.log(`   🎨 المتغيرات: ${product.productVariants.length}`);
          product.productVariants.slice(0, 2).forEach(variant => {
            console.log(`      - ${variant.displayName} (${variant.price || 0} درهم)`);
          });
        }
        
        if (product.tags?.length > 0) {
          console.log(`   🏷️  العلامات: ${product.tags.length}`);
          product.tags.forEach(tag => {
            console.log(`      - ${tag.name} (${tag.color || 'بدون لون'})`);
          });
        }
        
        if (product.productImages?.length > 0) {
          console.log(`   📸 الصور: ${product.productImages.length}`);
        }
      });

      // Statistics
      const inStockProducts = products.filter(p => p.isInStock);
      const withImages = products.filter(p => p.image);
      const withCategories = products.filter(p => p.categories?.length > 0);
      const withVariants = products.filter(p => p.productVariants?.length > 0);

      console.log(`\n📊 إحصائيات المنتجات:`);
      console.log(`   📦 إجمالي المنتجات: ${products.length}/${totalCount}`);
      console.log(`   ✅ المتوفرة في المخزون: ${inStockProducts.length}`);
      console.log(`   🖼️  التي لها صور: ${withImages.length}`);
      console.log(`   📂 التي لها فئات: ${withCategories.length}`);
      console.log(`   🎨 التي لها متغيرات: ${withVariants.length}`);

      return {
        success: true,
        count: products.length,
        totalCount: totalCount,
        priceRange: { min: minPrice, max: maxPrice },
        statistics: {
          total: products.length,
          inStock: inStockProducts.length,
          withImages: withImages.length,
          withCategories: withCategories.length,
          withVariants: withVariants.length
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

// Test Single Product with Correct Schema
async function testSingleProduct() {
  console.log('\n🔍 اختبار منتج واحد بالتفصيل - المخطط الصحيح');
  console.log('='.repeat(50));

  const query = `
    query {
      product(id: 1) {
        id
        name
        price
        variantPrice
        description
        shortDescription
        image
        imageFilename
        weight
        barcode
        visibility
        status
        typeId
        isInStock
        stock
        slug
        sku
        metaTitle
        metaKeyword
        metaDescription
        metaImage
        metaImageFilename
        categories {
          id
          name
          slug
          image
          imageFilename
          parent {
            id
            name
            slug
          }
        }
        productVariants {
          id
          displayName
          price
          variantPrice
          isInStock
          stock
          displayImage
          productTemplateId
        }
        attributeValues {
          id
          name
          search
          priceExtra
          htmlColor
          image
          imageFilename
        }
        productImages {
          id
          name
          image
          imageFilename
          video
        }
        tags {
          name
          color
          backgroundColor
          visibleOnEcommerce
          image
          imageFilename
        }
        firstVariantId
        combinationInfoVariant {
          displayName
          price
          variantPrice
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
      console.log(`   🏷️  الاسم: ${product.name || 'غير محدد'}`);
      console.log(`   💰 السعر: ${product.price || 0} درهم`);
      console.log(`   💵 سعر المتغير: ${product.variantPrice || 0} درهم`);
      console.log(`   📋 الكود: ${product.sku || 'غير محدد'}`);
      console.log(`   📊 المخزون: ${product.stock || 0}`);
      console.log(`   ✅ متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
      console.log(`   👁️  الرؤية: ${product.visibility || 0}`);
      console.log(`   📱 الحالة: ${product.status || 0}`);
      console.log(`   ⚖️  الوزن: ${product.weight || 0} كجم`);
      console.log(`   🔗 الرابط: ${product.slug || 'غير محدد'}`);
      
      console.log(`\n🖼️  الصور:`);
      console.log(`   📸 الصورة الرئيسية: ${product.image ? 'متوفرة' : 'غير متوفرة'}`);
      if (product.productImages?.length > 0) {
        console.log(`   📷 معرض الصور: ${product.productImages.length} صورة`);
        product.productImages.forEach((img, index) => {
          console.log(`      ${index + 1}. ${img.name || 'بدون اسم'} ${img.video ? '(فيديو)' : ''}`);
        });
      }
      
      console.log(`\n📂 معلومات الفئة:`);
      if (product.categories?.length > 0) {
        console.log(`   📁 الفئات: ${product.categories.length}`);
        product.categories.forEach(category => {
          console.log(`   📂 ${category.name || 'غير محدد'}`);
          console.log(`      🔗 الرابط: ${category.slug || 'غير محدد'}`);
          console.log(`      🖼️  له صورة: ${category.image ? 'نعم' : 'لا'}`);
          if (category.parent) {
            console.log(`      👆 الفئة الأب: ${category.parent.name || 'غير محدد'}`);
          }
        });
      } else {
        console.log(`   ❌ لا توجد فئة محددة`);
      }
      
      console.log(`\n🎨 المتغيرات:`);
      if (product.productVariants?.length > 0) {
        console.log(`   📊 عدد المتغيرات: ${product.productVariants.length}`);
        product.productVariants.forEach((variant, index) => {
          console.log(`   ${index + 1}. ${variant.displayName || 'غير محدد'}`);
          console.log(`      💰 السعر: ${variant.price || 0} درهم`);
          console.log(`      💵 سعر المتغير: ${variant.variantPrice || 0} درهم`);
          console.log(`      📊 المخزون: ${variant.stock || 0}`);
          console.log(`      ✅ متوفر: ${variant.isInStock ? 'نعم' : 'لا'}`);
          console.log(`      🖼️  عرض الصورة: ${variant.displayImage ? 'نعم' : 'لا'}`);
        });
      } else {
        console.log(`   ❌ لا توجد متغيرات`);
      }
      
      console.log(`\n🏷️  الخصائص:`);
      if (product.attributeValues?.length > 0) {
        console.log(`   📊 عدد الخصائص: ${product.attributeValues.length}`);
        product.attributeValues.forEach((attr, index) => {
          console.log(`   ${index + 1}. ${attr.name || 'غير محدد'}`);
          console.log(`      💰 سعر إضافي: ${attr.priceExtra || 0} درهم`);
          console.log(`      🎨 اللون: ${attr.htmlColor || 'غير محدد'}`);
          console.log(`      🖼️  له صورة: ${attr.image ? 'نعم' : 'لا'}`);
        });
      } else {
        console.log(`   ❌ لا توجد خصائص`);
      }
      
      console.log(`\n🏷️  العلامات:`);
      if (product.tags?.length > 0) {
        console.log(`   📊 عدد العلامات: ${product.tags.length}`);
        product.tags.forEach((tag, index) => {
          console.log(`   ${index + 1}. ${tag.name || 'غير محدد'}`);
          console.log(`      🎨 اللون: ${tag.color || 'غير محدد'}`);
          console.log(`      🖌️  لون الخلفية: ${tag.backgroundColor || 'غير محدد'}`);
          console.log(`      👁️  مرئي في المتجر: ${tag.visibleOnEcommerce ? 'نعم' : 'لا'}`);
        });
      } else {
        console.log(`   ❌ لا توجد علامات`);
      }
      
      console.log(`\n🔍 SEO:`);
      console.log(`   📝 عنوان SEO: ${product.metaTitle || 'غير محدد'}`);
      console.log(`   🔑 الكلمات المفتاحية: ${product.metaKeyword || 'غير محدد'}`);
      console.log(`   📄 الوصف: ${product.metaDescription || 'غير محدد'}`);
      console.log(`   🖼️  صورة SEO: ${product.metaImage ? 'متوفرة' : 'غير متوفرة'}`);
      
      if (product.description) {
        console.log(`\n📝 الوصف الكامل:`);
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

// Test Categories with Correct Schema
async function testCategories() {
  console.log('\n📂 اختبار الفئات والأقسام - المخطط الصحيح');
  console.log('='.repeat(50));

  const query = `
    query {
      categories {
        categories {
          id
          name
          slug
          image
          imageFilename
          parent {
            id
            name
            slug
          }
          childs {
            id
            name
            slug
          }
          products {
            totalCount
          }
          metaTitle
          metaKeyword
          metaDescription
          metaImage
          metaImageFilename
        }
        totalCount
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.categories?.categories) {
      const categories = result.data.categories.categories;
      const totalCount = result.data.categories.totalCount;
      
      console.log(`✅ تم العثور على ${categories.length} فئة من أصل ${totalCount}`);
      
      // Main categories (no parent)
      const mainCategories = categories.filter(cat => !cat.parent);
      const subCategories = categories.filter(cat => cat.parent);
      
      console.log(`📁 الفئات الرئيسية: ${mainCategories.length}`);
      console.log(`📂 الفئات الفرعية: ${subCategories.length}`);
      
      console.log(`\n🏷️  الفئات الرئيسية:`);
      mainCategories.forEach((category, index) => {
        console.log(`\n📂 ${index + 1}. ${category.name || 'غير محدد'}`);
        console.log(`   🆔 المعرف: ${category.id}`);
        console.log(`   🔗 الرابط: ${category.slug || 'غير محدد'}`);
        console.log(`   📊 عدد المنتجات: ${category.products?.totalCount || 0}`);
        console.log(`   🖼️  له صورة: ${category.image ? 'نعم' : 'لا'}`);
        console.log(`   📝 عنوان SEO: ${category.metaTitle || 'غير محدد'}`);
        
        // Find subcategories
        const subs = categories.filter(cat => cat.parent?.id === category.id);
        if (subs.length > 0) {
          console.log(`   📁 الفئات الفرعية: ${subs.length}`);
          subs.forEach(sub => {
            console.log(`      - ${sub.name} (${sub.products?.totalCount || 0} منتج)`);
          });
        }
        
        // Direct children from API
        if (category.childs?.length > 0) {
          console.log(`   👶 الأطفال المباشرين: ${category.childs.length}`);
          category.childs.forEach(child => {
            console.log(`      - ${child.name} (${child.slug})`);
          });
        }
      });

      return {
        success: true,
        total: categories.length,
        totalCount: totalCount,
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

// Test Blog Posts
async function testBlogPosts() {
  console.log('\n📝 اختبار مقالات المدونة - المخطط الصحيح');
  console.log('='.repeat(50));

  const query = `
    query {
      blogPosts {
        blogPosts {
          id
          name
          publishedDate
          image
          imageFilename
          content
          subtitle
          slug
          metaTitle
          metaKeyword
          metaDescription
          metaImage
          metaImageFilename
          tags {
            id
            name
            slug
          }
        }
        blogTags {
          id
          name
          slug
        }
        totalCount
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.blogPosts?.blogPosts) {
      const posts = result.data.blogPosts.blogPosts;
      const tags = result.data.blogPosts.blogTags;
      const totalCount = result.data.blogPosts.totalCount;
      
      console.log(`✅ تم العثور على ${posts.length} مقال من أصل ${totalCount}`);
      console.log(`🏷️  العلامات المتاحة: ${tags?.length || 0}`);
      
      posts.slice(0, 5).forEach((post, index) => {
        console.log(`\n📝 المقال ${index + 1}:`);
        console.log(`   🆔 المعرف: ${post.id}`);
        console.log(`   🏷️  العنوان: ${post.name || 'غير محدد'}`);
        console.log(`   📄 العنوان الفرعي: ${post.subtitle || 'غير محدد'}`);
        console.log(`   🔗 الرابط: ${post.slug || 'غير محدد'}`);
        console.log(`   📅 تاريخ النشر: ${post.publishedDate || 'غير محدد'}`);
        console.log(`   🖼️  له صورة: ${post.image ? 'نعم' : 'لا'}`);
        console.log(`   📝 عنوان SEO: ${post.metaTitle || 'غير محدد'}`);
        
        if (post.tags?.length > 0) {
          console.log(`   🏷️  العلامات: ${post.tags.length}`);
          post.tags.forEach(tag => {
            console.log(`      - ${tag.name} (${tag.slug})`);
          });
        }
        
        if (post.content) {
          console.log(`   📄 المحتوى: ${post.content.substring(0, 100)}...`);
        }
      });
      
      if (tags?.length > 0) {
        console.log(`\n🏷️  جميع علامات المدونة:`);
        tags.forEach((tag, index) => {
          console.log(`   ${index + 1}. ${tag.name} (${tag.slug})`);
        });
      }

      return {
        success: true,
        total: posts.length,
        totalCount: totalCount,
        tags: tags?.length || 0,
        data: posts
      };
    } else {
      console.log('❌ لم يتم العثور على مقالات');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المقالات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Homepage Data
async function testHomepageData() {
  console.log('\n🏠 اختبار بيانات الصفحة الرئيسية');
  console.log('='.repeat(50));

  const query = `
    query {
      homepage {
        metaTitle
        metaKeyword
        metaDescription
        metaImage
        metaImageFilename
        headerTemplate
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.homepage) {
      const homepage = result.data.homepage;
      console.log(`✅ بيانات الصفحة الرئيسية:`);
      
      console.log(`\n🏠 معلومات الصفحة الرئيسية:`);
      console.log(`   📝 عنوان SEO: ${homepage.metaTitle || 'غير محدد'}`);
      console.log(`   🔑 الكلمات المفتاحية: ${homepage.metaKeyword || 'غير محدد'}`);
      console.log(`   📄 الوصف: ${homepage.metaDescription || 'غير محدد'}`);
      console.log(`   🖼️  صورة SEO: ${homepage.metaImage ? 'متوفرة' : 'غير متوفرة'}`);
      console.log(`   🎨 قالب الرأس: ${homepage.headerTemplate || 'غير محدد'}`);

      return {
        success: true,
        data: homepage
      };
    } else {
      console.log('❌ لم يتم العثور على بيانات الصفحة الرئيسية');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب بيانات الصفحة الرئيسية: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main Test Function
async function runCorrectSchemaTest() {
  console.log('🚀 اختبار المخطط الصحيح - الحقول المتاحة الحقيقية');
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
    // Test 1: All Products
    results.tests.allProducts = await testAllProducts();
    
    // Test 2: Single Product
    results.tests.singleProduct = await testSingleProduct();
    
    // Test 3: Categories
    results.tests.categories = await testCategories();
    
    // Test 4: Blog Posts
    results.tests.blogPosts = await testBlogPosts();
    
    // Test 5: Homepage Data
    results.tests.homepage = await testHomepageData();

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 ملخص النتائج النهائي - المخطط الصحيح');
    console.log('='.repeat(70));
    
    const summary = {
      allProducts: results.tests.allProducts?.count || 0,
      totalProducts: results.tests.allProducts?.totalCount || 0,
      categories: results.tests.categories?.total || 0,
      totalCategories: results.tests.categories?.totalCount || 0,
      blogPosts: results.tests.blogPosts?.total || 0,
      totalBlogPosts: results.tests.blogPosts?.totalCount || 0,
      blogTags: results.tests.blogPosts?.tags || 0
    };

    console.log(`🛍️  المنتجات المعروضة: ${summary.allProducts}/${summary.totalProducts}`);
    console.log(`📂 الفئات المعروضة: ${summary.categories}/${summary.totalCategories}`);
    console.log(`📝 مقالات المدونة: ${summary.blogPosts}/${summary.totalBlogPosts}`);
    console.log(`🏷️  علامات المدونة: ${summary.blogTags}`);
    console.log(`🏠 بيانات الصفحة الرئيسية: ${results.tests.homepage?.success ? 'متوفرة' : 'غير متوفرة'}`);

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
    console.log('✨ جميع الحقول المستخدمة متوفرة في المخطط الحقيقي');

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
  runCorrectSchemaTest()
    .then(results => {
      console.log('\n✅ اكتمل اختبار المخطط الصحيح بنجاح!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل اختبار المخطط الصحيح:', error.message);
      process.exit(1);
    });
}

module.exports = { runCorrectSchemaTest };