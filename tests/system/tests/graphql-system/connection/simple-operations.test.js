/**
 * Simple Operations Test - Coffee Selection
 * اختبار العمليات البسيطة - موقع Coffee Selection
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf'
};

console.log('🔧 بدء اختبار العمليات البسيطة...');
console.log('==============================');

// Test 1: Basic Products Query
function testBasicProductsQuery() {
  return new Promise((resolve) => {
    console.log('🧪 اختبار 1: استعلام المنتجات الأساسي...');
    
    const productsQuery = `
      query GetBasicProducts {
        products(pageSize: 3) {
          products {
            id
            name
            price
            sku
          }
          totalCount
        }
      }
    `;
    
    const postData = JSON.stringify({ query: productsQuery });
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
            console.log('✅ نجح استعلام المنتجات الأساسي');
            console.log(`📦 إجمالي المنتجات: ${products.totalCount}`);
            console.log(`📋 المنتجات المستلمة: ${products.products.length}`);
            
            if (products.products.length > 0) {
              const sample = products.products[0];
              console.log(`📄 منتج عينة: ${sample.name}`);
              console.log(`💰 السعر: ${sample.price}`);
              console.log(`📋 الكود: ${sample.sku}`);
            }
            
            resolve({
              success: true,
              totalProducts: products.totalCount,
              receivedProducts: products.products.length
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

// Test 2: Basic Categories Query
function testBasicCategoriesQuery() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 2: استعلام الفئات الأساسي...');
    
    const categoriesQuery = `
      query GetBasicCategories {
        categories {
          categories {
            id
            name
            slug
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
            console.log('✅ نجح استعلام الفئات الأساسي');
            console.log(`📂 إجمالي الفئات: ${categories.totalCount}`);
            console.log(`📋 الفئات المستلمة: ${categories.categories.length}`);
            
            categories.categories.forEach((category, index) => {
              console.log(`📂 ${index + 1}. ${category.name} (${category.slug || 'بدون رابط'})`);
            });
            
            resolve({
              success: true,
              totalCategories: categories.totalCount,
              receivedCategories: categories.categories.length
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

// Test 3: Cart Status Check
function testCartStatusCheck() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 3: فحص حالة السلة...');
    
    const cartQuery = `
      query GetCartStatus {
        cart {
          order {
            id
            cartQuantity
            amountTotal
          }
        }
      }
    `;
    
    const postData = JSON.stringify({ query: cartQuery });
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
          
          if (response.data && response.data.cart) {
            const cart = response.data.cart;
            console.log('✅ نجح فحص حالة السلة');
            
            if (cart.order) {
              console.log(`🛒 معرف السلة: ${cart.order.id}`);
              console.log(`📦 عدد العناصر: ${cart.order.cartQuantity || 0}`);
              console.log(`💰 المجموع: ${cart.order.amountTotal || 0}`);
              
              if (cart.order.cartQuantity > 0) {
                console.log('🛍️ السلة تحتوي على عناصر');
              } else {
                console.log('🛒 السلة فارغة');
              }
            } else {
              console.log('🛒 لا توجد سلة نشطة');
            }
            
            resolve({
              success: true,
              hasCart: !!cart.order,
              itemCount: cart.order ? cart.order.cartQuantity : 0,
              total: cart.order ? cart.order.amountTotal : 0
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في فحص السلة:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات سلة`);
            resolve({
              success: false,
              error: 'No cart data found'
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

// Test 4: Website Menu Query
function testWebsiteMenuQuery() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 4: استعلام قائمة الموقع...');
    
    const menuQuery = `
      query GetWebsiteMenu {
        websiteMenu {
          id
          name
          url
          sequence
        }
      }
    `;
    
    const postData = JSON.stringify({ query: menuQuery });
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
          
          if (response.data && response.data.websiteMenu) {
            const menu = response.data.websiteMenu;
            console.log('✅ نجح استعلام قائمة الموقع');
            console.log(`📋 عدد عناصر القائمة: ${menu.length}`);
            
            menu.forEach((item, index) => {
              console.log(`📄 ${index + 1}. ${item.name} (${item.url || 'بدون رابط'})`);
            });
            
            resolve({
              success: true,
              menuItems: menu.length,
              menu: menu
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في استعلام القائمة:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات قائمة`);
            resolve({
              success: false,
              error: 'No menu data found'
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

// Run all simple operations tests
async function runSimpleOperationsTests() {
  console.log('🚀 تشغيل جميع اختبارات العمليات البسيطة...');
  console.log('=' .repeat(43));
  
  const results = {};
  
  // Test 1: Basic Products Query
  results.basicProducts = await testBasicProductsQuery();
  
  // Test 2: Basic Categories Query
  results.basicCategories = await testBasicCategoriesQuery();
  
  // Test 3: Cart Status Check
  results.cartStatus = await testCartStatusCheck();
  
  // Test 4: Website Menu Query
  results.websiteMenu = await testWebsiteMenuQuery();
  
  // Summary
  console.log('\\n📊 ملخص نتائج اختبارات العمليات البسيطة:');
  console.log('=' .repeat(40));
  
  const tests = [
    { name: 'استعلام المنتجات الأساسي', result: results.basicProducts },
    { name: 'استعلام الفئات الأساسي', result: results.basicCategories },
    { name: 'فحص حالة السلة', result: results.cartStatus },
    { name: 'استعلام قائمة الموقع', result: results.websiteMenu }
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
    console.log('\\n🎉 جميع اختبارات العمليات البسيطة نجحت بنسبة 100%!');
    console.log('🔧 النظام يدعم العمليات البسيطة بشكل صحيح');
    
    return { success: true, results };
  } else {
    console.log('\\n⚠️ بعض اختبارات العمليات البسيطة فشلت - يرجى مراجعة الأخطاء أعلاه');
    return { success: false, results };
  }
}

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runSimpleOperationsTests,
    testBasicProductsQuery,
    testBasicCategoriesQuery,
    testCartStatusCheck,
    testWebsiteMenuQuery
  };
}

// Run tests if called directly
if (require.main === module) {
  runSimpleOperationsTests()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 خطأ غير متوقع:', error);
      process.exit(1);
    });
}