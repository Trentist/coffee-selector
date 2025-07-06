#!/usr/bin/env node

/**
 * Comprehensive Data Test - New GraphQL System
 * اختبار البيانات الشامل - نظام GraphQL الجديد
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

// Test All Products
async function testAllProducts() {
  console.log('\n🛍️ اختبار جميع المنتجات');
  console.log('='.repeat(50));

  const query = `
    query GetAllProducts {
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
        image1920
        imageSmall
        imageMedium
        websitePublished
        isPublished
        active
        saleOk
        purchaseOk
        categId {
          id
          name
          displayName
        }
        productVariantIds {
          id
          displayName
          listPrice
          standardPrice
          defaultCode
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

      products.forEach((product, index) => {
        console.log(`\n📦 المنتج ${index + 1}:`);
        console.log(`   🏷️  الاسم: ${product.name || 'غير محدد'}`);
        console.log(`   💰 السعر: ${product.listPrice || 0} درهم`);
        console.log(`   📋 الكود: ${product.defaultCode || 'غير محدد'}`);
        console.log(`   📊 المخزون: ${product.qtyAvailable || 0}`);
        console.log(`   🏪 منشور: ${product.websitePublished ? 'نعم' : 'لا'}`);
        console.log(`   📂 الفئة: ${product.categId?.name || 'غير محدد'}`);

        if (product.productVariantIds?.length > 0) {
          console.log(`   🎨 المتغيرات: ${product.productVariantIds.length}`);
        }
      });

      return {
        success: true,
        count: products.length,
        data: products
      };
    } else {
      console.log('❌ لم يتم العثور على منتجات');
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المنتجات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Featured Products
async function testFeaturedProducts() {
  console.log('\n⭐ اختبار المنتجات المميزة');
  console.log('='.repeat(50));

  const query = `
    query GetFeaturedProducts {
      products(filter: {websitePublished: {eq: true}}) {
        id
        name
        displayName
        listPrice
        standardPrice
        defaultCode
        image1920
        websitePublished
        isPublished
        active
        categId {
          id
          name
          displayName
        }
        qtyAvailable
        virtualAvailable
        websiteSequence
        websiteRibbon {
          id
          name
          displayName
        }
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);

    if (result.data?.products) {
      const products = result.data.products;
      const featuredProducts = products.filter(p => p.websitePublished && p.active);

      console.log(`✅ تم العثور على ${featuredProducts.length} منتج مميز`);

      featuredProducts.slice(0, 5).forEach((product, index) => {
        console.log(`\n⭐ المنتج المميز ${index + 1}:`);
        console.log(`   🏷️  الاسم: ${product.name || 'غير محدد'}`);
        console.log(`   💰 السعر: ${product.listPrice || 0} درهم`);
        console.log(`   📋 الكود: ${product.defaultCode || 'غير محدد'}`);
        console.log(`   📊 المخزون: ${product.qtyAvailable || 0}`);
        console.log(`   📂 الفئة: ${product.categId?.name || 'غير محدد'}`);
        console.log(`   🎗️  الشارة: ${product.websiteRibbon?.name || 'بدون شارة'}`);
      });

      return {
        success: true,
        count: featuredProducts.length,
        data: featuredProducts
      };
    } else {
      console.log('❌ لم يتم العثور على منتجات مميزة');
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المنتجات المميزة: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Categories
async function testCategories() {
  console.log('\n📂 اختبار الأقسام والفئات');
  console.log('='.repeat(50));

  const query = `
    query GetCategories {
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
        websiteDescription
        websiteMetaTitle
        websiteMetaDescription
        websiteMetaKeywords
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
      console.log(`\n📁 الفئات الرئيسية: ${mainCategories.length}`);

      mainCategories.forEach((category, index) => {
        console.log(`\n📂 الفئة ${index + 1}:`);
        console.log(`   🏷️  الاسم: ${category.name || 'غير محدد'}`);
        console.log(`   📊 عدد المنتجات: ${category.productCount || 0}`);
        console.log(`   🔢 الترتيب: ${category.sequence || 0}`);
        console.log(`   ✅ نشط: ${category.active ? 'نعم' : 'لا'}`);

        // Sub categories
        const subCategories = categories.filter(cat => cat.parentId?.id === category.id);
        if (subCategories.length > 0) {
          console.log(`   📁 الفئات الفرعية: ${subCategories.length}`);
          subCategories.forEach(sub => {
            console.log(`      - ${sub.name} (${sub.productCount || 0} منتج)`);
          });
        }
      });

      return {
        success: true,
        count: categories.length,
        mainCategories: mainCategories.length,
        data: categories
      };
    } else {
      console.log('❌ لم يتم العثور على فئات');
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب الفئات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Website Pages
async function testWebsitePages() {
  console.log('\n📄 اختبار صفحات الموقع');
  console.log('='.repeat(50));

  const query = `
    query GetWebsitePages {
      websitePages {
        id
        name
        url
        websitePublished
        isPublished
        active
        websiteMetaTitle
        websiteMetaDescription
        websiteMetaKeywords
        arch
        type
        key
        priority
        createDate
        writeDate
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);

    if (result.data?.websitePages) {
      const pages = result.data.websitePages;
      const publishedPages = pages.filter(p => p.websitePublished && p.active);

      console.log(`✅ تم العثور على ${pages.length} صفحة (${publishedPages.length} منشورة)`);

      // Group pages by type
      const pageTypes = {
        'الصفحة الرئيسية': publishedPages.filter(p => p.url === '/' || p.key?.includes('homepage')),
        'من نحن': publishedPages.filter(p => p.url?.includes('about') || p.name?.toLowerCase().includes('about')),
        'تواصل معنا': publishedPages.filter(p => p.url?.includes('contact') || p.name?.toLowerCase().includes('contact')),
        'المدونة': publishedPages.filter(p => p.url?.includes('blog') || p.name?.toLowerCase().includes('blog')),
        'الصفحات القانونية': publishedPages.filter(p =>
          p.url?.includes('privacy') || p.url?.includes('terms') ||
          p.name?.toLowerCase().includes('privacy') || p.name?.toLowerCase().includes('terms')
        ),
        'صفحات أخرى': publishedPages.filter(p =>
          !p.url?.includes('about') && !p.url?.includes('contact') &&
          !p.url?.includes('blog') && !p.url?.includes('privacy') &&
          !p.url?.includes('terms') && p.url !== '/'
        )
      };

      Object.entries(pageTypes).forEach(([type, typePages]) => {
        if (typePages.length > 0) {
          console.log(`\n📑 ${type}: ${typePages.length} صفحة`);
          typePages.forEach(page => {
            console.log(`   📄 ${page.name || 'بدون اسم'}`);
            console.log(`      🔗 الرابط: ${page.url || 'غير محدد'}`);
            console.log(`      📝 العنوان: ${page.websiteMetaTitle || 'غير محدد'}`);
            console.log(`      🏷️  النوع: ${page.type || 'غير محدد'}`);
          });
        }
      });

      return {
        success: true,
        total: pages.length,
        published: publishedPages.length,
        byType: Object.fromEntries(
          Object.entries(pageTypes).map(([type, pages]) => [type, pages.length])
        ),
        data: pages
      };
    } else {
      console.log('❌ لم يتم العثور على صفحات');
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب الصفحات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Blog Posts
async function testBlogPosts() {
  console.log('\n📝 اختبار مقالات المدونة');
  console.log('='.repeat(50));

  const query = `
    query GetBlogPosts {
      blogPosts {
        id
        name
        subtitle
        content
        websitePublished
        isPublished
        active
        authorId {
          id
          name
          displayName
        }
        blogId {
          id
          name
          displayName
        }
        tagIds {
          id
          name
          displayName
        }
        websiteMetaTitle
        websiteMetaDescription
        websiteMetaKeywords
        createDate
        writeDate
        publishDate
      }
    }
  `;

  try {
    const result = await makeGraphQLRequest(query);

    if (result.data?.blogPosts) {
      const posts = result.data.blogPosts;
      const publishedPosts = posts.filter(p => p.websitePublished && p.active);

      console.log(`✅ تم العثور على ${posts.length} مقال (${publishedPosts.length} منشور)`);

      publishedPosts.slice(0, 5).forEach((post, index) => {
        console.log(`\n📝 المقال ${index + 1}:`);
        console.log(`   🏷️  العنوان: ${post.name || 'غير محدد'}`);
        console.log(`   📄 العنوان الفرعي: ${post.subtitle || 'غير محدد'}`);
        console.log(`   ✍️  الكاتب: ${post.authorId?.name || 'غير محدد'}`);
        console.log(`   📂 المدونة: ${post.blogId?.name || 'غير محدد'}`);
        console.log(`   📅 تاريخ النشر: ${post.publishDate || post.createDate || 'غير محدد'}`);

        if (post.tagIds?.length > 0) {
          console.log(`   🏷️  العلامات: ${post.tagIds.map(tag => tag.name).join(', ')}`);
        }
      });

      return {
        success: true,
        total: posts.length,
        published: publishedPosts.length,
        data: posts
      };
    } else {
      console.log('❌ لم يتم العثور على مقالات');
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`❌ خطأ في جلب المقالات: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main Test Function
async function runComprehensiveTest() {
  console.log('🚀 اختبار البيانات الشامل - نظام GraphQL الجديد');
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

    // Test 2: Featured Products
    results.tests.featuredProducts = await testFeaturedProducts();

    // Test 3: Categories
    results.tests.categories = await testCategories();

    // Test 4: Website Pages
    results.tests.websitePages = await testWebsitePages();

    // Test 5: Blog Posts
    results.tests.blogPosts = await testBlogPosts();

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 ملخص النتائج الشامل');
    console.log('='.repeat(70));

    const summary = {
      totalProducts: results.tests.allProducts?.count || 0,
      featuredProducts: results.tests.featuredProducts?.count || 0,
      categories: results.tests.categories?.count || 0,
      mainCategories: results.tests.categories?.mainCategories || 0,
      websitePages: results.tests.websitePages?.total || 0,
      publishedPages: results.tests.websitePages?.published || 0,
      blogPosts: results.tests.blogPosts?.total || 0,
      publishedBlogPosts: results.tests.blogPosts?.published || 0
    };

    console.log(`🛍️  إجمالي المنتجات: ${summary.totalProducts}`);
    console.log(`⭐ المنتجات المميزة: ${summary.featuredProducts}`);
    console.log(`📂 إجمالي الفئات: ${summary.categories} (${summary.mainCategories} رئيسية)`);
    console.log(`📄 صفحات الموقع: ${summary.websitePages} (${summary.publishedPages} منشورة)`);
    console.log(`📝 مقالات المدونة: ${summary.blogPosts} (${summary.publishedBlogPosts} منشورة)`);

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

    results.summary = summary;
    results.successRate = successRate;

    return results;

  } catch (error) {
    console.error('❌ خطأ في الاختبار الشامل:', error.message);
    results.error = error.message;
    return results;
  }
}

// Run the test
if (require.main === module) {
  runComprehensiveTest()
    .then(results => {
      console.log('\n✅ اكتمل الاختبار الشامل بنجاح!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ فشل الاختبار الشامل:', error.message);
      process.exit(1);
    });
}

module.exports = { runComprehensiveTest };