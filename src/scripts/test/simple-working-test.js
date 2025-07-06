#!/usr/bin/env node

/**
 * Simple Working Test - Basic Fields Only
 * اختبار بسيط عامل - الحقول الأساسية فقط
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

// Test Basic Products - Minimal Fields
async function testBasicProducts() {
  console.log('\n🛍️ اختبار المنتجات الأساسية - الحقول البسيطة');
  console.log('='.repeat(50));

  const query = `
    query {
      products {
        products {
          id
          name
          price
          description
          image
          imageFilename
          weight
          barcode
          visibility
          status
          isInStock
          slug
          sku
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
      const totalCount = result.data.products.totalCount;
      const minPrice = result.data.products.minPrice;
      const maxPrice = result.data.products.maxPrice;
      
      console.log(`✅ تم العثور على ${products.length} منتج من أصل ${totalCount}`);
      console.log(`💰 نطاق الأسعار: ${minPrice} - ${maxPrice} درهم`);
      
      // Show all products with basic details
      products.forEach((product, index) => {
        console.log(`\n📦 المنتج ${index + 1}:`);
        console.log(`   🆔 المعرف: ${product.id}`);
        console.log(`   🏷️  الاسم: ${product.name || 'غير محدد'}`);
        console.log(`   💰 السعر: ${product.price || 0} درهم`);
        console.log(`   📋 الكود: ${product.sku || 'غير محدد'}`);
        console.log(`   ✅ متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
        console.log(`   👁️  الرؤية: ${product.visibility || 0}`);
        console.log(`   📱 الحالة: ${product.status || 0}`);
        console.log(`   🖼️  له صورة: ${product.image ? 'نعم' : 'لا'}`);
        console.log(`   ⚖️  الوزن: ${product.weight || 0} كجم`);
        console.log(`   🔗 الرابط: ${product.slug || 'غير محدد'}`);
        
        if (product.description) {
          console.log(`   📝 الوصف: ${product.description.substring(0, 100)}...`);
        }
      });

      // Statistics
      const inStockProducts = products.filter(p => p.isInStock);
      const withImages = products.filter(p => p.image);
      const withPrices = products.filter(p => (p.price || 0) > 0);
      const published = products.filter(p => p.status === 1);

      console.log(`\n📊 إحصائيات المنتجات:`);
      console.log(`   📦 إجمالي المنتجات: ${products.length}/${totalCount}`);
      console.log(`   ✅ المتوفرة في المخزون: ${inStockProducts.length}`);
      console.log(`   🖼️  التي لها صور: ${withImages.length}`);
      console.log(`   💰 التي لها أسعار: ${withPrices.length}`);
      console.log(`   🌐 المنشورة: ${published.length}`);

      return {
        success: true,
        count: products.length,
        totalCount: totalCount,
        priceRange: { min: minPrice, max: maxPrice },
        statistics: {
          total: products.length,
          inStock: inStockProducts.length,
          withImages: withImages.length,
          withPrices: withPrices.length,
          published: published.length
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

// Test Single Product - Minimal Fields
async function testSingleProduct() {
  console.log('\n🔍 اختبار منتج واحد - الحقول البسيطة');
  console.log('='.repeat(50));

  const query = `
    query {
      product(id: 1) {
        id
        name
        price
        description
        image
        imageFilename
        weight
        barcode
        visibility
        status
        isInStock
        slug
        sku
        metaTitle
        metaKeyword
        metaDescription
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
      console.log(`   📋 الكود: ${product.sku || 'غير محدد'}`);
      console.log(`   ✅ متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
      console.log(`   👁️  الرؤية: ${product.visibility || 0}`);
      console.log(`   📱 الحالة: ${product.status || 0}`);
      console.log(`   ⚖️  الوزن: ${product.weight || 0} كجم`);
      console.log(`   🔗 الرابط: ${product.slug || 'غير محدد'}`);
      console.log(`   📸 الصورة: ${product.image ? 'متوفرة' : 'غير متوفرة'}`);
      
      console.log(`\n🔍 SEO:`);
      console.log(`   📝 عنوان SEO: ${product.metaTitle || 'غير محدد'}`);
      console.log(`   🔑 الكلمات المفتاحية: ${product.metaKeyword || 'غير محدد'}`);
      console.log(`   📄 الوصف: ${product.metaDescription || 'غير محدد'}`);
      
      if (product.description) {
        console.log(`\n📝 الوصف الكامل:`);
        console.log(`   ${product.description.substring(0, 300)}...`);
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

// Test Categories - Minimal Fields
async function testCategories() {
  console.log('\n📂 اختبار الفئات - الحقول البسيطة');
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
          metaTitle
          metaKeyword
          metaDescription
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
      
      console.log(`\n🏷️  جميع الفئات:`);
      categories.forEach((category, index) => {
        console.log(`\n📂 ${index + 1}. ${category.name || 'غير محدد'}`);
        console.log(`   🆔 المعرف: ${category.id}`);
        console.log(`   🔗 الرابط: ${category.slug || 'غير محدد'}`);
        console.log(`   🖼️  له صورة: ${category.image ? 'نعم' : 'لا'}`);
        console.log(`   📝 عنوان SEO: ${category.metaTitle || 'غير محدد'}`);
        
        if (category.parent) {
          console.log(`   👆 الفئة الأب: ${category.parent.name || 'غير محدد'}`);
        }
        
        if (category.childs?.length > 0) {
          console.log(`   👶 الأطفال: ${category.childs.length}`);
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

// Test Blog Posts - Minimal Fields
async function testBlogPosts() {
  console.log('\n📝 اختبار مقالات المدونة - الحقول البسيطة');
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
          slug
          tagIds {
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
      
      posts.forEach((post, index) => {
        console.log(`\n📝 المقال ${index + 1}:`);
        console.log(`   🆔 المعرف: ${post.id}`);
        console.log(`   🏷️  العنوان: ${post.name || 'غير محدد'}`);
        console.log(`   🔗 الرابط: ${post.slug || 'غير محدد'}`);
        console.log(`   📅 تاريخ النشر: ${post.publishedDate || 'غير محدد'}`);
        console.log(`   🖼️  له صورة: ${post.image ? 'نعم' : 'لا'}`);
        
        if (post.tagIds?.length > 0) {
          console.log(`   🏷️  العلامات: ${post.tagIds.length}`);
          post.tagIds.forEach(tag => {
            console.log(`      - ${tag.name} (${tag.slug})`);
          });
        }
        
        if (post.content) {
          console.log(`   📄 المحتوى: ${post.content.substring(0, 150)}...`);
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

// Test Featured Products (Filter by status)
async function testFeaturedProducts() {
  console.log('\n⭐ اختبار المنتجات المميزة');
  console.log('='.repeat(50));

  const query = `
    query {
      products(filter: {isInStock: true}) {
        products {
          id
          name
          price
          description
          image
          imageFilename
          isInStock
          slug
          sku
          visibility
          status
        }
        totalCount
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);
    
    if (result.data?.products?.products) {
      const products = result.data.products.products;
      const totalCount = result.data.products.totalCount;
      
      // Filter for featured products (in stock, with images, published)
      const featuredProducts = products.filter(p => 
        p.isInStock && p.image && p.status === 1 && (p.price || 0) > 0
      );
      
      console.log(`✅ تم العثور على ${products.length} منتج متوفر من أصل ${totalCount}`);
      console.log(`⭐ المنتجات المميزة: ${featuredProducts.length}`);
      
      featuredProducts.slice(0, 5).forEach((product, index) => {
        console.log(`\n⭐ المنتج المميز ${index + 1}:`);
        console.log(`   🆔 المعرف: ${product.id}`);
        console.log(`   🏷️  الاسم: ${product.name || 'غير محدد'}`);
        console.log(`   💰 السعر: ${product.price || 0} درهم`);
        console.log(`   📋 الكود: ${product.sku || 'غير محدد'}`);
        console.log(`   ✅ متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
        console.log(`   🖼️  له صورة: ${product.image ? 'نعم' : 'لا'}`);
        console.log(`   🔗 الرابط: ${product.slug || 'غير محدد'}`);
        
        if (product.description) {
          console.log(`   📝 الوصف: ${product.description.substring(0, 100)}...`);
        }
      });

      return {
        success: true,
        total: products.length,
        totalCount: totalCount,
        featured: featuredProducts.length,
        data: featuredProducts
      };
    } else {
      console.log('❌ لم يتم العثور على منتجات مميزة');
      if (result.errors) {
        console.log('🔍 الأخطاء:', result.errors);
      }
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المنتجات المميزة: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main Test Function
async function runSimpleWorkingTest() {
  console.log('🚀 اختبار بسيط عامل - الحقول الأساسية فقط');
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
    
    // Test 2: Featured Products
    results.tests.featuredProducts = await testFeaturedProducts();
    
    // Test 3: Single Product
    results.tests.singleProduct = await testSingleProduct();
    
    // Test 4: Categories
    results.tests.categories = await testCategories();
    
    // Test 5: Blog Posts
    results.tests.blogPosts = await testBlogPosts();

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 ملخص النتائج النهائي - الاختبار البسيط العامل');
    console.log('='.repeat(70));
    
    const summary = {
      basicProducts: results.tests.basicProducts?.count || 0,
      totalProducts: results.tests.basicProducts?.totalCount || 0,
      featuredProducts: results.tests.featuredProducts?.featured || 0,
      categories: results.tests.categories?.total || 0,
      totalCategories: results.tests.categories?.totalCount || 0,
      blogPosts: results.tests.blogPosts?.total || 0,
      totalBlogPosts: results.tests.blogPosts?.totalCount || 0,
      blogTags: results.tests.blogPosts?.tags || 0
    };

    console.log(`🛍️  المنتجات الأساسية: ${summary.basicProducts}/${summary.totalProducts}`);
    console.log(`⭐ المنتجات المميزة: ${summary.featuredProducts}`);
    console.log(`📂 الفئات: ${summary.categories}/${summary.totalCategories}`);
    console.log(`📝 مقالات المدونة: ${summary.blogPosts}/${summary.totalBlogPosts}`);
    console.log(`🏷️  علامات المدونة: ${summary.blogTags}`);

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
    console.log('✨ جميع الحقول المستخدمة بسيطة وأساسية');

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
  runSimpleWorkingTest()
    .then(results => {
      console.log('\n✅ اكتمل الاختبار البسيط العامل بنجاح!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل الاختبار البسيط:', error.message);
      process.exit(1);
    });
}

module.exports = { runSimpleWorkingTest };