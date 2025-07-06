/**
 * Comprehensive GraphQL Test Suite - Coffee Selection
 * مجموعة اختبارات GraphQL الشاملة - موقع Coffee Selection
 */

const { runConnectionAndSyncTests } = require('./redis-sync-connection.test.js');
const { runDataAccessTests } = require('./data-access-test.test.js');
const { runSimpleOperationsTests } = require('./simple-operations.test.js');

console.log('🚀 بدء مجموعة الاختبارات الشاملة لـ GraphQL...');
console.log('=' .repeat(50));
console.log('📅 التاريخ والوقت:', new Date().toLocaleString('ar-EG'));
console.log('🌐 الخادم: coffee-selection-staging-20784644.dev.odoo.com');
console.log('=' .repeat(50));

async function runComprehensiveTests() {
  const testResults = {
    startTime: new Date(),
    tests: {},
    summary: {
      totalTestSuites: 0,
      passedTestSuites: 0,
      failedTestSuites: 0,
      overallSuccess: false
    }
  };

  try {
    console.log('\\n🔄 المرحلة 1: اختبار التوصيل والمزامنة...');
    console.log('=' .repeat(40));
    
    const connectionResults = await runConnectionAndSyncTests();
    testResults.tests.connection = connectionResults;
    testResults.summary.totalTestSuites++;
    
    if (connectionResults.success) {
      testResults.summary.passedTestSuites++;
      console.log('✅ نجحت مرحلة التوصيل والمزامنة');
    } else {
      console.log('❌ فشلت مرحلة التوصيل والمزامنة');
    }

    console.log('\\n📊 المرحلة 2: اختبار الوصول للبيانات...');
    console.log('=' .repeat(40));
    
    const dataAccessResults = await runDataAccessTests();
    testResults.tests.dataAccess = dataAccessResults;
    testResults.summary.totalTestSuites++;
    
    if (dataAccessResults.success) {
      testResults.summary.passedTestSuites++;
      console.log('✅ نجحت مرحلة الوصول للبيانات');
    } else {
      console.log('❌ فشلت مرحلة الوصول للبيانات');
    }

    console.log('\\n🔧 المرحلة 3: اختبار العمليات البسيطة...');
    console.log('=' .repeat(40));
    
    const operationsResults = await runSimpleOperationsTests();
    testResults.tests.operations = operationsResults;
    testResults.summary.totalTestSuites++;
    
    if (operationsResults.success) {
      testResults.summary.passedTestSuites++;
      console.log('✅ نجحت مرحلة العمليات البسيطة');
    } else {
      console.log('❌ فشلت مرحلة العمليات البسيطة');
    }

  } catch (error) {
    console.error('💥 خطأ أثناء تشغيل الاختبارات:', error.message);
    testResults.error = error.message;
  }

  // Calculate final results
  testResults.summary.failedTestSuites = testResults.summary.totalTestSuites - testResults.summary.passedTestSuites;
  testResults.summary.overallSuccess = testResults.summary.passedTestSuites === testResults.summary.totalTestSuites;
  testResults.endTime = new Date();
  testResults.duration = testResults.endTime - testResults.startTime;

  // Generate comprehensive report
  generateComprehensiveReport(testResults);

  return testResults;
}

function generateComprehensiveReport(results) {
  console.log('\\n' + '=' .repeat(60));
  console.log('📋 التقرير الشامل لاختبارات GraphQL');
  console.log('=' .repeat(60));
  
  console.log(`⏰ وقت البدء: ${results.startTime.toLocaleString('ar-EG')}`);
  console.log(`⏰ وقت الانتهاء: ${results.endTime.toLocaleString('ar-EG')}`);
  console.log(`⏱️ المدة الإجمالية: ${Math.round(results.duration / 1000)} ثانية`);
  
  console.log('\\n📊 ملخص النتائج:');
  console.log('-' .repeat(30));
  console.log(`🧪 إجمالي مجموعات الاختبار: ${results.summary.totalTestSuites}`);
  console.log(`✅ المجموعات الناجحة: ${results.summary.passedTestSuites}`);
  console.log(`❌ المجموعات الفاشلة: ${results.summary.failedTestSuites}`);
  console.log(`📈 معدل النجاح الإجمالي: ${Math.round((results.summary.passedTestSuites / results.summary.totalTestSuites) * 100)}%`);
  
  console.log('\\n🔍 تفاصيل كل مجموعة اختبار:');
  console.log('-' .repeat(35));
  
  // Connection Tests Details
  if (results.tests.connection) {
    const conn = results.tests.connection;
    console.log(`🔄 التوصيل والمزامنة: ${conn.success ? '✅ نجح' : '❌ فشل'}`);
    if (conn.results) {
      console.log(`   📊 متغيرات البيئة: ${conn.results.environment?.success ? '✅' : '❌'}`);
      console.log(`   📊 اتصال Redis: ${conn.results.redis?.success ? '✅' : '❌'}`);
      console.log(`   📊 عمليات Redis: ${conn.results.redisOps?.success ? '✅' : '❌'}`);
      console.log(`   📊 اتصال GraphQL: ${conn.results.graphql?.success ? '✅' : '❌'}`);
      console.log(`   📊 مزامنة Redis-GraphQL: ${conn.results.sync?.success ? '✅' : '❌'}`);
    }
  }
  
  // Data Access Tests Details
  if (results.tests.dataAccess) {
    const data = results.tests.dataAccess;
    console.log(`📊 الوصول للبيانات: ${data.success ? '✅ نجح' : '❌ فشل'}`);
    if (data.results) {
      console.log(`   📦 البيانات العامة: ${data.results.publicData?.success ? '✅' : '❌'}`);
      console.log(`   📂 الفئات: ${data.results.categories?.success ? '✅' : '❌'}`);
      console.log(`   🛒 السلة: ${data.results.cart?.success ? '✅' : '❌'}`);
      console.log(`   🌍 البلدان: ${data.results.countries?.success ? '✅' : '❌'}`);
    }
  }
  
  // Operations Tests Details
  if (results.tests.operations) {
    const ops = results.tests.operations;
    console.log(`🔧 العمليات البسيطة: ${ops.success ? '✅ نجح' : '❌ فشل'}`);
    if (ops.results) {
      console.log(`   📦 المنتجات الأساسية: ${ops.results.basicProducts?.success ? '✅' : '❌'}`);
      console.log(`   📂 الفئات الأساسية: ${ops.results.basicCategories?.success ? '✅' : '❌'}`);
      console.log(`   🛒 حالة السلة: ${ops.results.cartStatus?.success ? '✅' : '❌'}`);
      console.log(`   📋 قائمة الموقع: ${ops.results.websiteMenu?.success ? '✅' : '❌'}`);
    }
  }
  
  console.log('\\n📈 إحصائيات البيانات:');
  console.log('-' .repeat(25));
  
  // Data Statistics
  if (results.tests.dataAccess?.results?.publicData?.totalProducts) {
    console.log(`📦 إجمالي المنتجات: ${results.tests.dataAccess.results.publicData.totalProducts}`);
  }
  
  if (results.tests.dataAccess?.results?.categories?.totalCategories) {
    console.log(`📂 إجمالي الفئات: ${results.tests.dataAccess.results.categories.totalCategories}`);
  }
  
  if (results.tests.dataAccess?.results?.countries?.totalCountries) {
    console.log(`🌍 إجمالي البلدان: ${results.tests.dataAccess.results.countries.totalCountries}`);
  }
  
  if (results.tests.operations?.results?.websiteMenu?.menuItems) {
    console.log(`📋 عناصر القائمة: ${results.tests.operations.results.websiteMenu.menuItems}`);
  }
  
  console.log('\\n🎯 التوصيات:');
  console.log('-' .repeat(15));
  
  if (results.summary.overallSuccess) {
    console.log('✅ جميع الاختبارات نجحت! النظام جاهز للاستخدام.');
    console.log('🚀 يمكن المتابعة لمرحلة الإنتاج.');
    console.log('📊 النظام يدعم جميع العمليات الأساسية بشكل صحيح.');
  } else {
    console.log('⚠️ بعض الاختبارات فشلت. يرجى مراجعة التفاصيل أعلاه.');
    console.log('🔧 قم بإصلاح المشاكل قبل المتابعة للإنتاج.');
    
    if (results.summary.passedTestSuites > 0) {
      console.log(`✅ ${results.summary.passedTestSuites} من ${results.summary.totalTestSuites} مجموعات نجحت.`);
    }
  }
  
  console.log('\\n📄 حفظ التقرير...');
  
  // Save detailed report
  const fs = require('fs');
  const reportPath = 'tests/reports/comprehensive-graphql-test-report.json';
  
  try {
    fs.mkdirSync('tests/reports', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`✅ تم حفظ التقرير المفصل في: ${reportPath}`);
  } catch (error) {
    console.log(`❌ فشل في حفظ التقرير: ${error.message}`);
  }
  
  console.log('=' .repeat(60));
  
  if (results.summary.overallSuccess) {
    console.log('🎉 تهانينا! جميع اختبارات GraphQL نجحت بنسبة 100%!');
  } else {
    console.log(`📊 نجح ${Math.round((results.summary.passedTestSuites / results.summary.totalTestSuites) * 100)}% من الاختبارات`);
  }
  
  console.log('=' .repeat(60));
}

// Run comprehensive tests if called directly
if (require.main === module) {
  runComprehensiveTests()
    .then(results => {
      process.exit(results.summary.overallSuccess ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 خطأ غير متوقع في الاختبارات الشاملة:', error);
      process.exit(1);
    });
}

// Export for use in other tests
module.exports = {
  runComprehensiveTests,
  generateComprehensiveReport
};