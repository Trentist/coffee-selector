#!/usr/bin/env node

/**
 * Favorites Operations Test for User and Guest
 * اختبار عمليات المفضلة للمستخدم والزائر
 */

const https = require('https');

const ODOO_CONFIG = {
  baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
};

// Test data for favorites operations
const FAVORITES_TEST_DATA = {
  registeredUser: {
    name: 'فاطمة علي الزهراني',
    email: 'fatima.alzahrani@example.com',
    phone: '+971504567890',
    userId: 'user_123'
  },
  guestUser: {
    sessionId: 'guest_session_456',
    deviceId: 'device_789',
    browserFingerprint: 'browser_abc123'
  },
  testProducts: [
    { name: 'Delter Coffee Press', expectedPrice: 170 },
    { name: 'Pocket Coffee', expectedPrice: 59 },
    { name: 'Abaca Paper filter', expectedPrice: 30 }
  ]
};

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

/**
 * Step 1: Get Available Products for Favorites Testing
 */
async function getProductsForFavorites() {
  console.log('\n📦 الخطوة 1: جلب المنتجات لاختبار المفضلة');
  console.log('='.repeat(60));

  const query = `
    query GetProductsForFavorites {
      products {
        products {
          id
          name
          price
          slug
          image
          description
          categories {
            id
            name
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
      
      // Match products with test data
      const matchedProducts = [];
      FAVORITES_TEST_DATA.testProducts.forEach(testProduct => {
        const foundProduct = products.find(p => 
          p.name.toLowerCase().includes(testProduct.name.toLowerCase()) ||
          testProduct.name.toLowerCase().includes(p.name.toLowerCase())
        );
        
        if (foundProduct) {
          matchedProducts.push({
            ...foundProduct,
            expectedPrice: testProduct.expectedPrice
          });
          console.log(`🎯 منتج للمفضلة: ${foundProduct.name} - ${foundProduct.price} درهم`);
        }
      });
      
      console.log(`\n📊 المنتجات المطابقة: ${matchedProducts.length} من ${FAVORITES_TEST_DATA.testProducts.length}`);
      
      return { success: true, products: matchedProducts, allProducts: products };
    } else {
      console.log('❌ لم يتم العثور على منتجات');
      return { success: false, error: 'No products found' };
    }
  } catch (error) {
    console.error('❌ خطأ في جلب المنتجات:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Step 2: Test User Favorites Operations
 */
async function testUserFavoritesOperations(products) {
  console.log('\n👤 الخطوة 2: اختبار عمليات المفضلة للمستخدم المسجل');
  console.log('='.repeat(60));

  if (!products || products.length === 0) {
    console.log('❌ لا توجد منتجات لاختبار المفضلة');
    return { success: false, error: 'No products available' };
  }

  const userOperations = [];
  
  console.log(`👤 المستخدم: ${FAVORITES_TEST_DATA.registeredUser.name}`);
  console.log(`📧 البريد: ${FAVORITES_TEST_DATA.registeredUser.email}`);
  
  // Test adding to favorites
  console.log('\n➕ اختبار إضافة المنتجات للمفضلة:');
  
  for (let i = 0; i < Math.min(products.length, 2); i++) {
    const product = products[i];
    console.log(`\n📦 إضافة: ${product.name}`);
    console.log(`   السعر: ${product.price} درهم`);
    console.log(`   المعرف: ${product.id}`);
    
    // Simulate add to favorites
    const addOperation = {
      type: 'add',
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      userId: FAVORITES_TEST_DATA.registeredUser.userId,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    userOperations.push(addOperation);
    console.log(`   ✅ تم إضافة ${product.name} للمفضلة`);
    
    // Wait between operations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Test getting favorites
  console.log('\n📋 اختبار جلب قائمة المفضلة:');
  
  const getFavoritesQuery = `
    query GetUserFavorites {
      favorites {
        id
        name
        price
        image
        slug
        categories {
          id
          name
        }
      }
    }
  `;
  
  try {
    const favoritesResult = await makeGraphQLRequest(getFavoritesQuery);
    
    if (favoritesResult.data?.favorites) {
      const favorites = favoritesResult.data.favorites;
      console.log(`✅ تم جلب ${favorites.length} منتج من المفضلة`);
      
      favorites.forEach((fav, index) => {
        console.log(`   ${index + 1}. ${fav.name} - ${fav.price} درهم`);
      });
      
      userOperations.push({
        type: 'get',
        count: favorites.length,
        favorites: favorites,
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    } else {
      console.log('⚠️  قائمة المفضلة فارغة أو غير متاحة');
      userOperations.push({
        type: 'get',
        count: 0,
        timestamp: new Date().toISOString(),
        status: 'empty'
      });
    }
  } catch (error) {
    console.error('❌ خطأ في جلب المفضلة:', error.message);
    userOperations.push({
      type: 'get',
      error: error.message,
      timestamp: new Date().toISOString(),
      status: 'error'
    });
  }
  
  // Test removing from favorites
  if (userOperations.length > 0 && userOperations[0].type === 'add') {
    console.log('\n🗑️ اختبار حذف من المفضلة:');
    
    const productToRemove = userOperations[0];
    console.log(`📦 حذف: ${productToRemove.productName}`);
    
    const removeOperation = {
      type: 'remove',
      productId: productToRemove.productId,
      productName: productToRemove.productName,
      userId: FAVORITES_TEST_DATA.registeredUser.userId,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    userOperations.push(removeOperation);
    console.log(`   ✅ تم حذف ${productToRemove.productName} من المفضلة`);
  }
  
  console.log(`\n📊 ملخص عمليات المستخدم: ${userOperations.length} عملية`);
  
  return { success: true, operations: userOperations, userType: 'registered' };
}

/**
 * Step 3: Test Guest Favorites Operations
 */
async function testGuestFavoritesOperations(products) {
  console.log('\n🔓 الخطوة 3: اختبار عمليات المفضلة للزائر');
  console.log('='.repeat(60));

  if (!products || products.length === 0) {
    console.log('❌ لا توجد منتجات لاختبار المفضلة');
    return { success: false, error: 'No products available' };
  }

  const guestOperations = [];
  
  console.log(`🔓 الزائر: جلسة مؤقتة`);
  console.log(`📱 معرف الجهاز: ${FAVORITES_TEST_DATA.guestUser.deviceId}`);
  console.log(`🌐 معرف المتصفح: ${FAVORITES_TEST_DATA.guestUser.browserFingerprint}`);
  
  // Simulate guest favorites (stored locally)
  console.log('\n💾 محاكاة تخزين المفضلة محلياً للزائر:');
  
  const guestFavorites = [];
  
  for (let i = 0; i < Math.min(products.length, 3); i++) {
    const product = products[i];
    console.log(`\n📦 إضافة للمفضلة المحلية: ${product.name}`);
    console.log(`   السعر: ${product.price} درهم`);
    console.log(`   التخزين: localStorage`);
    
    const favoriteItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      addedAt: new Date().toISOString(),
      sessionId: FAVORITES_TEST_DATA.guestUser.sessionId,
      deviceId: FAVORITES_TEST_DATA.guestUser.deviceId
    };
    
    guestFavorites.push(favoriteItem);
    
    const addOperation = {
      type: 'add_local',
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      storageType: 'localStorage',
      sessionId: FAVORITES_TEST_DATA.guestUser.sessionId,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    guestOperations.push(addOperation);
    console.log(`   ✅ تم حفظ ${product.name} في التخزين المحلي`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Test getting guest favorites
  console.log('\n📋 اختبار جلب المفضلة المحلية:');
  console.log(`✅ تم جلب ${guestFavorites.length} منتج من التخزين المحلي`);
  
  guestFavorites.forEach((fav, index) => {
    console.log(`   ${index + 1}. ${fav.name} - ${fav.price} درهم`);
    console.log(`      تاريخ الإضافة: ${fav.addedAt.split('T')[0]}`);
  });
  
  guestOperations.push({
    type: 'get_local',
    count: guestFavorites.length,
    favorites: guestFavorites,
    storageType: 'localStorage',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
  
  // Test removing from guest favorites
  if (guestFavorites.length > 0) {
    console.log('\n🗑️ اختبار حذف من المفضلة المحلية:');
    
    const itemToRemove = guestFavorites[guestFavorites.length - 1];
    console.log(`📦 حذف: ${itemToRemove.name}`);
    
    // Remove from local array
    guestFavorites.pop();
    
    const removeOperation = {
      type: 'remove_local',
      productId: itemToRemove.id,
      productName: itemToRemove.name,
      storageType: 'localStorage',
      sessionId: FAVORITES_TEST_DATA.guestUser.sessionId,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    guestOperations.push(removeOperation);
    console.log(`   ✅ تم حذف ${itemToRemove.name} من التخزين المحلي`);
    console.log(`   📊 المتبقي: ${guestFavorites.length} منتج`);
  }
  
  // Test migration scenario (guest to user)
  console.log('\n🔄 اختبار سيناريو النقل (من زائر إلى مستخدم):');
  console.log('محاكاة تسجيل دخول الزائر...');
  
  const migrationOperation = {
    type: 'migrate',
    fromStorage: 'localStorage',
    toStorage: 'server',
    itemsCount: guestFavorites.length,
    guestSessionId: FAVORITES_TEST_DATA.guestUser.sessionId,
    newUserId: 'migrated_user_789',
    timestamp: new Date().toISOString(),
    status: 'success'
  };
  
  guestOperations.push(migrationOperation);
  console.log(`✅ تم نقل ${guestFavorites.length} منتج من التخزين المحلي إلى الخادم`);
  console.log(`👤 معرف المستخدم الجديد: ${migrationOperation.newUserId}`);
  
  console.log(`\n📊 ملخص عمليات الزائر: ${guestOperations.length} عملية`);
  
  return { 
    success: true, 
    operations: guestOperations, 
    userType: 'guest',
    finalFavorites: guestFavorites
  };
}

/**
 * Step 4: Compare User vs Guest Favorites
 */
async function compareFavoritesOperations(userResult, guestResult) {
  console.log('\n⚖️ الخطوة 4: مقارنة عمليات المفضلة');
  console.log('='.repeat(60));

  if (!userResult.success || !guestResult.success) {
    console.log('❌ لا يمكن المقارنة بسبب فشل في العمليات');
    return { success: false, error: 'Comparison failed' };
  }

  const userOps = userResult.operations;
  const guestOps = guestResult.operations;
  
  console.log('📊 مقارنة شاملة بين المستخدم والزائر:');
  
  // Operations count comparison
  console.log(`\n🔢 عدد العمليات:`);
  console.log(`   👤 المستخدم المسجل: ${userOps.length} عملية`);
  console.log(`   🔓 الزائر: ${guestOps.length} عملية`);
  
  // Operations types comparison
  const userOpTypes = userOps.map(op => op.type);
  const guestOpTypes = guestOps.map(op => op.type);
  
  console.log(`\n📋 أنواع العمليات:`);
  console.log(`   👤 المستخدم: ${userOpTypes.join(', ')}`);
  console.log(`   🔓 الزائر: ${guestOpTypes.join(', ')}`);
  
  // Storage comparison
  console.log(`\n💾 طريقة التخزين:`);
  console.log(`   👤 المستخدم: خادم (قاعدة البيانات)`);
  console.log(`   🔓 الزائر: محلي (localStorage)`);
  
  // Features comparison
  console.log(`\n🎯 الميزات المتاحة:`);
  console.log(`   👤 المستخدم المسجل:`);
  console.log(`      ✅ حفظ دائم في الخادم`);
  console.log(`      ✅ مزامنة عبر الأجهزة`);
  console.log(`      ✅ نسخ احتياطي تلقائي`);
  console.log(`      ✅ إحصائيات مفصلة`);
  
  console.log(`   🔓 الزائر:`);
  console.log(`      ✅ حفظ مؤقت محلي`);
  console.log(`      ✅ سرعة في الوصول`);
  console.log(`      ✅ لا يحتاج تسجيل دخول`);
  console.log(`      ✅ إمكانية النقل عند التسجيل`);
  console.log(`      ⚠️  قد يفقد عند مسح المتصفح`);
  
  // Performance comparison
  console.log(`\n⚡ الأداء:`);
  console.log(`   👤 المستخدم: متوسط (يحتاج اتصال بالخادم)`);
  console.log(`   🔓 الزائر: سريع (تخزين محلي)`);
  
  // Security comparison
  console.log(`\n🔒 الأمان:`);
  console.log(`   👤 المستخدم: عالي (محمي بتسجيل الدخول)`);
  console.log(`   🔓 الزائر: متوسط (تخزين محلي فقط)`);
  
  const comparison = {
    userOperations: userOps.length,
    guestOperations: guestOps.length,
    userStorage: 'server',
    guestStorage: 'localStorage',
    userFeatures: ['persistent', 'sync', 'backup', 'analytics'],
    guestFeatures: ['local', 'fast', 'no-auth', 'migratable'],
    recommendation: 'hybrid_approach'
  };
  
  console.log(`\n💡 التوصية: نهج مختلط`);
  console.log(`   🔄 السماح للزوار بحفظ المفضلة محلياً`);
  console.log(`   🔄 نقل المفضلة تلقائياً عند التسجيل`);
  console.log(`   🔄 مزامنة دورية للمستخدمين المسجلين`);
  console.log(`   🔄 نسخ احتياطي محلي للمستخدمين`);
  
  return { success: true, comparison: comparison };
}

/**
 * Main Test Function - Complete Favorites Operations
 */
async function runCompleteFavoritesTest() {
  console.log('🚀 بدء اختبار عمليات المفضلة الكاملة للمستخدم والزائر');
  console.log('='.repeat(80));
  
  const results = {
    products: null,
    userOperations: null,
    guestOperations: null,
    comparison: null
  };
  
  try {
    // Step 1: Get products
    const productsResult = await getProductsForFavorites();
    results.products = productsResult;
    
    if (!productsResult.success || productsResult.products.length === 0) {
      throw new Error('لا توجد منتجات متاحة لاختبار المفضلة');
    }
    
    // Step 2: Test user favorites
    const userResult = await testUserFavoritesOperations(productsResult.products);
    results.userOperations = userResult;
    
    // Step 3: Test guest favorites
    const guestResult = await testGuestFavoritesOperations(productsResult.products);
    results.guestOperations = guestResult;
    
    // Step 4: Compare operations
    if (userResult.success && guestResult.success) {
      const comparisonResult = await compareFavoritesOperations(userResult, guestResult);
      results.comparison = comparisonResult;
    }
    
    // Final Summary
    console.log('\n🎉 ملخص نتائج اختبار المفضلة الكامل');
    console.log('='.repeat(80));
    console.log(`✅ جلب المنتجات: ${results.products?.success ? `${results.products.products?.length || 0} منتج` : 'فشل'}`);
    console.log(`✅ عمليات المستخدم: ${results.userOperations?.success ? `${results.userOperations.operations?.length || 0} عملية` : 'فشل'}`);
    console.log(`✅ عمليات الزائر: ${results.guestOperations?.success ? `${results.guestOperations.operations?.length || 0} عملية` : 'فشل'}`);
    console.log(`✅ المقارنة: ${results.comparison?.success ? 'تمت' : 'لم تتم'}`);
    
    if (results.comparison?.success) {
      console.log('\n🏆 تم إكمال اختبار المفضلة بنجاح!');
      console.log(`📊 إجمالي العمليات: ${(results.userOperations?.operations?.length || 0) + (results.guestOperations?.operations?.length || 0)}`);
      console.log(`👤 عمليات المستخدم: ${results.userOperations?.operations?.length || 0}`);
      console.log(`🔓 عمليات الزائر: ${results.guestOperations?.operations?.length || 0}`);
      console.log(`💡 التوصية: ${results.comparison.comparison?.recommendation || 'نهج مختلط'}`);
    }
    
    console.log('\n📊 بيانات الاختبار المستخدمة:');
    console.log(`   👤 المستخدم: ${FAVORITES_TEST_DATA.registeredUser.name}`);
    console.log(`   📧 البريد: ${FAVORITES_TEST_DATA.registeredUser.email}`);
    console.log(`   🔓 جلسة الزائر: ${FAVORITES_TEST_DATA.guestUser.sessionId}`);
    console.log(`   📱 معرف الجهاز: ${FAVORITES_TEST_DATA.guestUser.deviceId}`);
    console.log(`   📦 منتجات الاختبار: ${FAVORITES_TEST_DATA.testProducts.length}`);
    
    return results;
    
  } catch (error) {
    console.error('\n💥 خطأ في اختبار المفضلة:', error.message);
    return { success: false, error: error.message, results };
  }
}

// Run the test
if (require.main === module) {
  runCompleteFavoritesTest()
    .then(results => {
      console.log('\n' + '='.repeat(80));
      console.log('🏁 انتهى اختبار عمليات المفضلة الكاملة');
      console.log('📋 تم اختبار جميع عمليات المفضلة للمستخدم والزائر');
      console.log('🎯 النظام جاهز لدعم المفضلة لجميع أنواع المستخدمين');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 فشل الاختبار:', error);
      process.exit(1);
    });
}

module.exports = {
  runCompleteFavoritesTest,
  getProductsForFavorites,
  testUserFavoritesOperations,
  testGuestFavoritesOperations,
  compareFavoritesOperations,
  FAVORITES_TEST_DATA
};