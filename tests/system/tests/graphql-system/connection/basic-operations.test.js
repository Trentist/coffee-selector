/**
 * Basic Operations Test - Coffee Selection
 * اختبار العمليات الأساسية - موقع Coffee Selection
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf'
};

console.log('🔧 بدء اختبار العمليات الأساسية...');
console.log('===============================');

// Test 1: Query Products with Filters
function testProductsQuery() {
  return new Promise((resolve) => {
    console.log('🧪 اختبار 1: استعلام المنتجات مع الفلاتر...');
    
    const productsQuery = `
      query GetFilteredProducts($filter: ProductFilterInput, $pageSize: Int) {
        products(filter: $filter, pageSize: $pageSize) {
          products {
            id
            name
            price
            sku
            isInStock
            categories {
              id
              name
            }
          }
          totalCount
          minPrice
          maxPrice
        }
      }
    `;

    const variables = { 
      filter: { inStock: true },
      pageSize: 5
    };
    
    const postData = JSON.stringify({ 
      query: productsQuery, 
      variables: variables 
    });
    
    const url = new URL(ODOO_CONFIG.graphqlUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          console.log(`📊 حالة الاستجابة: ${res.statusCode}`);
          
          if (response.data && response.data.products) {
            const products = response.data.products;
            console.log('✅ نجح استعلام المنتجات مع الفلاتر');
            console.log(`📦 إجمالي المنتجات: ${products.totalCount}`);
            console.log(`📋 المنتجات المستلمة: ${products.products.length}`);
            console.log(`💰 نطاق الأسعار: ${products.minPrice || 0} - ${products.maxPrice || 0}`);
            
            if (products.products.length > 0) {
              const sample = products.products[0];
              console.log(`📄 منتج عينة: ${sample.name} (${sample.sku})`);
              console.log(`💰 السعر: ${sample.price}`);
              console.log(`📦 متوفر: ${sample.isInStock ? 'نعم' : 'لا'}`);
            }
            
            resolve({
              success: true,
              totalProducts: products.totalCount,
              receivedProducts: products.products.length,
              priceRange: { min: products.minPrice, max: products.maxPrice }
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في استعلام المنتجات:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات منتجات`);
            resolve({
              success: false,
              error: 'No products data found'
            });
          }
        } catch (err) {
          console.log(`❌ خطأ في تحليل JSON: ${err.message}`);
          resolve({
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ خطأ في الطلب: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ انتهت مهلة الطلب');
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Test 2: Query Single Product by Slug
function testSingleProductQuery() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 2: استعلام منتج واحد بالرابط...');
    
    const productQuery = `
      query GetProductBySlug($slug: String) {
        product(slug: $slug) {
          id
          name
          price
          sku
          description
          isInStock
          slug
          categories {
            id
            name
            slug
          }
          mediaGallery {
            id
            image
            imageFilename
          }
        }
      }
    `;

    const variables = { 
      slug: "delter-coffee-press" // Using a known product slug
    };
    
    const postData = JSON.stringify({ 
      query: productQuery, 
      variables: variables 
    });
    
    const url = new URL(ODOO_CONFIG.graphqlUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          console.log(`📊 حالة الاستجابة: ${res.statusCode}`);
          
          if (response.data && response.data.product) {
            const product = response.data.product;
            console.log('✅ نجح استعلام المنتج الواحد');
            console.log(`📦 اسم المنتج: ${product.name}`);
            console.log(`💰 السعر: ${product.price}`);
            console.log(`📋 الكود: ${product.sku}`);
            console.log(`🔗 الرابط: ${product.slug}`);
            console.log(`📦 متوفر: ${product.isInStock ? 'نعم' : 'لا'}`);
            console.log(`📂 عدد الفئات: ${product.categories?.length || 0}`);
            console.log(`🖼️ عدد الصور: ${product.mediaGallery?.length || 0}`);
            
            resolve({
              success: true,
              product: product,
              hasImages: !!(product.mediaGallery && product.mediaGallery.length > 0),
              hasCategories: !!(product.categories && product.categories.length > 0)
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في استعلام المنتج:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لم يتم العثور على المنتج`);
            resolve({
              success: false,
              error: 'Product not found'
            });
          }
        } catch (err) {
          console.log(`❌ خطأ في تحليل JSON: ${err.message}`);
          resolve({
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ خطأ في الطلب: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ انتهت مهلة الطلب');
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Test 3: Query Categories with Products
function testCategoriesWithProducts() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 3: استعلام الفئات مع المنتجات...');
    
    const categoriesQuery = `
      query GetCategoriesWithProducts {
        categories(pageSize: 3) {
          categories {
            id
            name
            slug
            products {
              id
              name
              price
            }
          }
          totalCount
        }
      }
    `;
    
    const postData = JSON.stringify({ query: categoriesQuery });
    const url = new URL(ODOO_CONFIG.graphqlUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          console.log(`📊 حالة الاستجابة: ${res.statusCode}`);
          
          if (response.data && response.data.categories) {
            const categories = response.data.categories;
            console.log('✅ نجح استعلام الفئات مع المنتجات');
            console.log(`📂 إجمالي الفئات: ${categories.totalCount}`);
            console.log(`📋 الفئات المستلمة: ${categories.categories.length}`);
            
            let totalProducts = 0;
            categories.categories.forEach(category => {
              const productCount = category.products ? category.products.length : 0;
              totalProducts += productCount;
              console.log(`📂 ${category.name}: ${productCount} منتج`);
            });
            
            console.log(`📦 إجمالي المنتجات في الفئات: ${totalProducts}`);
            
            resolve({
              success: true,
              totalCategories: categories.totalCount,
              receivedCategories: categories.categories.length,
              totalProductsInCategories: totalProducts
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في استعلام الفئات:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات فئات`);
            resolve({
              success: false,
              error: 'No categories data found'
            });
          }
        } catch (err) {
          console.log(`❌ خطأ في تحليل JSON: ${err.message}`);
          resolve({
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ خطأ في الطلب: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ انتهت مهلة الطلب');
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Test 4: Query Orders (if available)
function testOrdersQuery() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 4: استعلام الطلبات...');
    
    const ordersQuery = `
      query GetOrders($pageSize: Int) {
        orders(pageSize: $pageSize) {
          orders {
            id
            name
            dateOrder
            stage
            amountTotal
            currency {
              name
              symbol
            }
            partner {
              name
              email
            }
          }
          totalCount
        }
      }
    `;

    const variables = { pageSize: 5 };
    const postData = JSON.stringify({ 
      query: ordersQuery, 
      variables: variables 
    });
    
    const url = new URL(ODOO_CONFIG.graphqlUrl);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${ODOO_CONFIG.apiKey}`
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          console.log(`📊 حالة الاستجابة: ${res.statusCode}`);
          
          if (response.data && response.data.orders) {
            const orders = response.data.orders;
            console.log('✅ نجح استعلام الطلبات');
            console.log(`📋 إجمالي الطلبات: ${orders.totalCount}`);
            console.log(`📦 الطلبات المستلمة: ${orders.orders.length}`);
            
            if (orders.orders.length > 0) {
              const sample = orders.orders[0];
              console.log(`📄 طلب عينة: ${sample.name}`);
              console.log(`📅 التاريخ: ${sample.dateOrder}`);
              console.log(`📊 الحالة: ${sample.stage}`);
              console.log(`💰 المجموع: ${sample.amountTotal} ${sample.currency?.symbol || ''}`);
              if (sample.partner) {
                console.log(`👤 العميل: ${sample.partner.name}`);
              }
            }
            
            resolve({
              success: true,
              totalOrders: orders.totalCount,
              receivedOrders: orders.orders.length,
              sampleOrder: orders.orders[0]
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في استعلام الطلبات:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات طلبات`);
            resolve({
              success: false,
              error: 'No orders data found'
            });
          }
        } catch (err) {
          console.log(`❌ خطأ في تحليل JSON: ${err.message}`);
          resolve({
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ خطأ في الطلب: ${err.message}`);
      resolve({
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      console.log('❌ انتهت مهلة الطلب');
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Run all basic operations tests
async function runBasicOperationsTests() {
  console.log('🚀 تشغيل جميع اختبارات العمليات الأساسية...');
  console.log('=' .repeat(45));
  
  const results = {};
  
  // Test 1: Products Query
  results.productsQuery = await testProductsQuery();
  
  // Test 2: Single Product Query
  results.singleProduct = await testSingleProductQuery();
  
  // Test 3: Categories with Products
  results.categoriesWithProducts = await testCategoriesWithProducts();
  
  // Test 4: Orders Query
  results.ordersQuery = await testOrdersQuery();
  
  // Summary
  console.log('\\n📊 ملخص نتائج اختبارات العمليات الأساسية:');
  console.log('=' .repeat(42));
  
  const tests = [
    { name: 'استعلام المنتجات مع الفلاتر', result: results.productsQuery },
    { name: 'استعلام منتج واحد', result: results.singleProduct },
    { name: 'الفئات مع المنتجات', result: results.categoriesWithProducts },
    { name: 'استعلام الطلبات', result: results.ordersQuery }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  tests.forEach(test => {
    const status = test.result.success ? '✅ نجح' : '❌ فشل';
    console.log(`${test.name}: ${status}`);
    if (test.result.success) passedTests++;
  });
  
  console.log('\\n📈 النتيجة النهائية:');
  console.log(`✅ الاختبارات الناجحة: ${passedTests}/${totalTests}`);
  console.log(`❌ الاختبارات الفاشلة: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📊 معدل النجاح: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\\n🎉 جميع اختبارات العمليات الأساسية نجحت بنسبة 100%!');
    console.log('🔧 النظام يدعم العمليات الأساسية بشكل صحيح');
    
    return { success: true, results };
  } else {
    console.log('\\n⚠️ بعض اختبارات العمليات الأساسية فشلت - يرجى مراجعة الأخطاء أعلاه');
    return { success: false, results };
  }
}

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runBasicOperationsTests,
    testProductsQuery,
    testSingleProductQuery,
    testCategoriesWithProducts,
    testOrdersQuery
  };
}

// Run tests if called directly
if (require.main === module) {
  runBasicOperationsTests()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 خطأ غير متوقع:', error);
      process.exit(1);
    });
}