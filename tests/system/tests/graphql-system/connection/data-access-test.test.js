/**
 * Data Access Test - Coffee Selection
 * اختبار الوصول للبيانات - موقع Coffee Selection
 */

const https = require('https');
const { URL } = require('url');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  database: 'coffee-selection-staging-20784644',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf'
};

console.log('📊 بدء اختبار الوصول للبيانات...');
console.log('===============================');

// Test 1: Public Data Access (Products)
function testPublicDataAccess() {
  return new Promise((resolve) => {
    console.log('🧪 اختبار 1: الوصول للبيانات العامة (المنتجات)...');
    
    const productsQuery = `
      query GetPublicProducts {
        products(pageSize: 3) {
          products {
            id
            name
            price
            sku
            isInStock
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
            console.log('✅ نجح الوصول للبيانات العامة');
            console.log(`📦 إجمالي المنتجات: ${products.totalCount}`);
            console.log(`📋 المنتجات المستلمة: ${products.products.length}`);
            
            if (products.products.length > 0) {
              const sample = products.products[0];
              console.log(`📄 منتج عينة: ${sample.name}`);
              console.log(`💰 السعر: ${sample.price}`);
              console.log(`📦 متوفر: ${sample.isInStock ? 'نعم' : 'لا'}`);
            }
            
            resolve({
              success: true,
              totalProducts: products.totalCount,
              receivedProducts: products.products.length,
              sampleProduct: products.products[0]
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في الوصول للبيانات:`, response.errors);
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

// Test 2: Categories Access
function testCategoriesAccess() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 2: الوصول لفئات المنتجات...');
    
    const categoriesQuery = `
      query GetCategories {
        categories(pageSize: 5) {
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
            console.log('✅ نجح الوصول لفئات المنتجات');
            console.log(`📂 إجمالي الفئات: ${categories.totalCount}`);
            console.log(`📋 الفئات المستلمة: ${categories.categories.length}`);
            
            if (categories.categories.length > 0) {
              const sample = categories.categories[0];
              console.log(`📄 فئة عينة: ${sample.name}`);
              console.log(`🔗 الرابط: ${sample.slug || 'غير متوفر'}`);
            }
            
            resolve({
              success: true,
              totalCategories: categories.totalCount,
              receivedCategories: categories.categories.length,
              sampleCategory: categories.categories[0]
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في الوصول للفئات:`, response.errors);
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

// Test 3: Cart Access (Authenticated)
function testCartAccess() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 3: الوصول للسلة (مصادق)...');
    
    const cartQuery = `
      query GetCart {
        cart {
          order {
            id
            name
            cartQuantity
            amountTotal
            currency {
              name
              symbol
            }
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
            console.log('✅ نجح الوصول للسلة');
            
            if (cart.order) {
              console.log(`🛒 معرف السلة: ${cart.order.id}`);
              console.log(`📦 عدد العناصر: ${cart.order.cartQuantity || 0}`);
              console.log(`💰 المجموع: ${cart.order.amountTotal || 0}`);
              if (cart.order.currency) {
                console.log(`💱 العملة: ${cart.order.currency.name} (${cart.order.currency.symbol})`);
              }
            } else {
              console.log('🛒 السلة فارغة أو غير موجودة');
            }
            
            resolve({
              success: true,
              cart: cart,
              hasOrder: !!cart.order,
              itemCount: cart.order ? cart.order.cartQuantity : 0
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في الوصول للسلة:`, response.errors);
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

// Test 4: Countries Data
function testCountriesData() {
  return new Promise((resolve) => {
    console.log('\\n🧪 اختبار 4: الوصول لبيانات البلدان...');
    
    const countriesQuery = `
      query GetCountries {
        countries(pageSize: 5) {
          countries {
            id
            name
            code
          }
          totalCount
        }
      }
    `;

    const postData = JSON.stringify({ query: countriesQuery });
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
          
          if (response.data && response.data.countries) {
            const countries = response.data.countries;
            console.log('✅ نجح الوصول لبيانات البلدان');
            console.log(`🌍 إجمالي البلدان: ${countries.totalCount}`);
            console.log(`📋 البلدان المستلمة: ${countries.countries.length}`);
            
            if (countries.countries.length > 0) {
              const sample = countries.countries[0];
              console.log(`📄 بلد عينة: ${sample.name} (${sample.code})`);
            }
            
            resolve({
              success: true,
              totalCountries: countries.totalCount,
              receivedCountries: countries.countries.length,
              sampleCountry: countries.countries[0]
            });
          } else if (response.errors) {
            console.log(`❌ أخطاء في الوصول للبلدان:`, response.errors);
            resolve({
              success: false,
              errors: response.errors
            });
          } else {
            console.log(`⚠️ لا توجد بيانات بلدان`);
            resolve({
              success: false,
              error: 'No countries data found'
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

// Run all data access tests
async function runDataAccessTests() {
  console.log('🚀 تشغيل جميع اختبارات الوصول للبيانات...');
  console.log('=' .repeat(45));
  
  const results = {};
  
  // Test 1: Public Data Access
  results.publicData = await testPublicDataAccess();
  
  // Test 2: Categories Access
  results.categories = await testCategoriesAccess();
  
  // Test 3: Cart Access
  results.cart = await testCartAccess();
  
  // Test 4: Countries Data
  results.countries = await testCountriesData();
  
  // Summary
  console.log('\\n📊 ملخص نتائج اختبارات الوصول للبيانات:');
  console.log('=' .repeat(40));
  
  const tests = [
    { name: 'البيانات العامة (المنتجات)', result: results.publicData },
    { name: 'فئات المنتجات', result: results.categories },
    { name: 'السلة', result: results.cart },
    { name: 'بيانات البلدان', result: results.countries }
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
    console.log('\\n🎉 جميع اختبارات الوصول للبيانات نجحت بنسبة 100%!');
    console.log('📊 النظام يعمل بشكل صحيح ويمكن الوصول للبيانات');
    
    return { success: true, results };
  } else {
    console.log('\\n⚠️ بعض اختبارات الوصول للبيانات فشلت - يرجى مراجعة الأخطاء أعلاه');
    return { success: false, results };
  }
}

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runDataAccessTests,
    testPublicDataAccess,
    testCategoriesAccess,
    testCartAccess,
    testCountriesData
  };
}

// Run tests if called directly
if (require.main === module) {
  runDataAccessTests()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 خطأ غير متوقع:', error);
      process.exit(1);
    });
}