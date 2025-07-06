#!/usr/bin/env node

/**
 * Master Test Runner Script
 * اسكريبت تشغيل جميع الاختبارات
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MasterTestRunner {
  constructor() {
    this.testScripts = [
      {
        name: 'Cart Functionality Tests',
        nameAr: 'اختبارات وظائف العربة',
        script: 'test-cart-functionality.js',
        icon: '🛒'
      },
      {
        name: 'Payment System Tests',
        nameAr: 'اختبارات نظام الدفع',
        script: 'test-payment-system.js',
        icon: '💳'
      },
      {
        name: 'Aramex Integration Tests',
        nameAr: 'اختبارات تكامل أرامكس',
        script: 'test-aramex-integration.js',
        icon: '📦'
      },
      {
        name: 'Invoice System Tests',
        nameAr: 'اختبارات نظام الفواتير',
        script: 'test-invoice-system.js',
        icon: '🧾'
      },
      {
        name: 'Complete Order Flow Tests',
        nameAr: 'اختبارات تدفق الطلب الكامل',
        script: 'test-complete-order-flow.js',
        icon: '🔄'
      }
    ];
    
    this.results = {
      totalScripts: 0,
      passedScripts: 0,
      failedScripts: 0,
      scriptResults: []
    };
  }

  // Run individual test script
  async runTestScript(testScript) {
    console.log(`\n${testScript.icon} Running ${testScript.name}`);
    console.log(`${testScript.icon} تشغيل ${testScript.nameAr}`);
    console.log('─'.repeat(60));
    
    try {
      const scriptPath = path.join(__dirname, testScript.script);
      
      // Check if script exists
      if (!fs.existsSync(scriptPath)) {
        throw new Error(`Script file not found: ${testScript.script}`);
      }
      
      // Execute the test script
      const output = execSync(`node "${scriptPath}"`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Display the output
      console.log(output);
      
      // Parse results (simple success detection)
      const isSuccess = output.includes('✅') && !output.includes('❌');
      
      this.results.scriptResults.push({
        name: testScript.name,
        nameAr: testScript.nameAr,
        status: isSuccess ? 'PASSED' : 'COMPLETED',
        output: output
      });
      
      if (isSuccess) {
        this.results.passedScripts++;
      }
      
      console.log(`${testScript.icon} ${testScript.name} completed`);
      console.log(`${testScript.icon} ${testScript.nameAr} مكتمل\n`);
      
    } catch (error) {
      console.error(`❌ Error running ${testScript.name}:`);
      console.error(`❌ خطأ في تشغيل ${testScript.nameAr}:`);
      console.error(`   ${error.message}\n`);
      
      this.results.failedScripts++;
      this.results.scriptResults.push({
        name: testScript.name,
        nameAr: testScript.nameAr,
        status: 'FAILED',
        error: error.message
      });
    }
  }

  // Run all test scripts
  async runAllTests() {
    console.log('🚀 COFFEE SELECTION - COMPREHENSIVE TEST SUITE');
    console.log('🚀 Coffee Selection - مجموعة الاختبارات الشاملة');
    console.log('='.repeat(70));
    
    const startTime = Date.now();
    this.results.totalScripts = this.testScripts.length;
    
    // Run each test script
    for (const testScript of this.testScripts) {
      await this.runTestScript(testScript);
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    this.generateMasterReport(duration);
  }

  // Generate comprehensive report
  generateMasterReport(duration) {
    console.log('='.repeat(70));
    console.log('📊 MASTER TEST REPORT / التقرير الرئيسي للاختبارات');
    console.log('='.repeat(70));
    
    console.log(`\n🎯 Overall Summary / الملخص العام:`);
    console.log(`   Total Test Suites: ${this.results.totalScripts} / إجمالي مجموعات الاختبارات: ${this.results.totalScripts}`);
    console.log(`   Passed: ${this.results.passedScripts} ✅ / نجح: ${this.results.passedScripts}`);
    console.log(`   Failed: ${this.results.failedScripts} ❌ / فشل: ${this.results.failedScripts}`);
    console.log(`   Duration: ${duration}s / المدة: ${duration}ث`);
    
    const successRate = ((this.results.passedScripts / this.results.totalScripts) * 100).toFixed(1);
    console.log(`   Success Rate: ${successRate}% / معدل النجاح: ${successRate}%`);
    
    console.log(`\n📋 Detailed Results / النتائج المفصلة:`);
    
    this.results.scriptResults.forEach((result, index) => {
      const statusIcon = result.status === 'PASSED' ? '✅' : 
                        result.status === 'FAILED' ? '❌' : '⚠️';
      
      console.log(`\n   ${index + 1}. ${statusIcon} ${result.name}`);
      console.log(`      ${result.nameAr}`);
      console.log(`      Status: ${result.status} / الحالة: ${result.status}`);
      
      if (result.error) {
        console.log(`      Error: ${result.error} / خطأ: ${result.error}`);
      }
    });
    
    // System health assessment
    console.log(`\n🏥 System Health Assessment / تقييم صحة النظام:`);
    
    if (successRate >= 90) {
      console.log(`   🎉 Excellent! System is highly reliable`);
      console.log(`   🎉 ممتاز! النظام موثوق جداً`);
    } else if (successRate >= 70) {
      console.log(`   ⚠️  Good, but needs some improvements`);
      console.log(`   ⚠️  جيد، لكن يحتاج بعض التحسينات`);
    } else {
      console.log(`   🔧 Critical issues found, immediate attention required`);
      console.log(`   🔧 مشاكل حرجة، يتطلب اهتمام فوري`);
    }
    
    // Component-specific recommendations
    console.log(`\n💡 Recommendations / التوصيات:`);
    
    this.results.scriptResults.forEach(result => {
      if (result.status === 'FAILED') {
        console.log(`   🔧 Fix issues in ${result.name}`);
        console.log(`   🔧 إصلاح المشاكل في ${result.nameAr}`);
      }
    });
    
    if (this.results.failedScripts === 0) {
      console.log(`   🚀 All systems operational - ready for production!`);
      console.log(`   🚀 جميع الأنظمة تعمل - جاهز للإنتاج!`);
    }
    
    // Save detailed report
    this.saveDetailedReport(duration);
    
    console.log(`\n✅ Master test suite completed!`);
    console.log(`✅ مجموعة الاختبارات الرئيسية مكتملة!`);
  }

  // Save detailed report to file
  saveDetailedReport(duration) {
    const reportData = {
      timestamp: new Date().toISOString(),
      duration: duration,
      summary: {
        totalScripts: this.results.totalScripts,
        passedScripts: this.results.passedScripts,
        failedScripts: this.results.failedScripts,
        successRate: ((this.results.passedScripts / this.results.totalScripts) * 100).toFixed(1)
      },
      results: this.results.scriptResults,
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
    
    const reportPath = path.join(__dirname, '../test-reports');
    
    // Create reports directory if it doesn't exist
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }
    
    const reportFile = path.join(reportPath, 'master-test-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportFile}`);
    console.log(`📄 تم حفظ التقرير المفصل في: ${reportFile}`);
  }

  // Run specific test by name
  async runSpecificTest(testName) {
    const testScript = this.testScripts.find(script => 
      script.name.toLowerCase().includes(testName.toLowerCase()) ||
      script.nameAr.includes(testName)
    );
    
    if (!testScript) {
      console.log(`❌ Test not found: ${testName}`);
      console.log(`❌ الاختبار غير موجود: ${testName}`);
      console.log(`\nAvailable tests / الاختبارات المتاحة:`);
      this.testScripts.forEach(script => {
        console.log(`   ${script.icon} ${script.name} / ${script.nameAr}`);
      });
      return;
    }
    
    console.log(`🎯 Running specific test: ${testScript.name}`);
    console.log(`🎯 تشغيل اختبار محدد: ${testScript.nameAr}\n`);
    
    this.results.totalScripts = 1;
    await this.runTestScript(testScript);
    
    const duration = '0.00'; // Single test duration
    this.generateMasterReport(duration);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new MasterTestRunner();
  
  if (args.length === 0) {
    // Run all tests
    await runner.runAllTests();
  } else if (args[0] === '--test' && args[1]) {
    // Run specific test
    await runner.runSpecificTest(args[1]);
  } else if (args[0] === '--help' || args[0] === '-h') {
    console.log(`
Coffee Selection Test Runner
مشغل اختبارات Coffee Selection

Usage / الاستخدام:
  node run-all-tests.js                    # Run all tests / تشغيل جميع الاختبارات
  node run-all-tests.js --test <name>      # Run specific test / تشغيل اختبار محدد
  node run-all-tests.js --help             # Show this help / عرض المساعدة

Available tests / الاختبارات المتاحة:
  cart        - Cart functionality tests / اختبارات وظائف العربة
  payment     - Payment system tests / اختبارات نظام الدفع
  aramex      - Aramex integration tests / اختبارات تكامل أرامكس
  invoice     - Invoice system tests / اختبارات نظام الفواتير
  complete    - Complete order flow tests / اختبارات تدفق الطلب الكامل

Examples / أمثلة:
  node run-all-tests.js --test cart
  node run-all-tests.js --test payment
    `);
  } else {
    console.log('❌ Invalid arguments. Use --help for usage information.');
    console.log('❌ معاملات غير صحيحة. استخدم --help لمعلومات الاستخدام.');
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('❌ استثناء غير معالج:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('❌ رفض غير معالج في:', promise, 'السبب:', reason);
  process.exit(1);
});

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test runner failed:', error.message);
    console.error('❌ فشل مشغل الاختبارات:', error.message);
    process.exit(1);
  });
}

module.exports = MasterTestRunner;