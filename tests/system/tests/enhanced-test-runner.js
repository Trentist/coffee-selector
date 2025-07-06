#!/usr/bin/env node

/**
 * Enhanced Test Runner for Coffee Selection
 * مشغل الاختبارات المحسن لموقع Coffee Selection
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class EnhancedTestRunner {
  constructor() {
    this.testSuites = {
      cart: {
        name: 'Cart Functionality Tests',
        nameAr: 'اختبارات وظائف العربة',
        path: './tests/e2e/enhanced-cart-tests',
        priority: 1
      },
      payment: {
        name: 'Payment Processing Tests',
        nameAr: 'اختبارات معالجة الدفع',
        path: './tests/e2e/enhanced-payment-tests',
        priority: 2
      },
      aramex: {
        name: 'Aramex Integration Tests',
        nameAr: 'اختبارات تكامل أرامكس',
        path: './tests/e2e/enhanced-aramex-tests',
        priority: 3
      },
      invoice: {
        name: 'Invoice Management Tests',
        nameAr: 'اختبارات إدارة الفواتير',
        path: './tests/e2e/enhanced-invoice-tests',
        priority: 4
      },
      integration: {
        name: 'Complete Integration Tests',
        nameAr: 'اختبارات التكامل الشاملة',
        path: './tests/e2e/enhanced-integration-tests',
        priority: 5
      }
    };

    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      duration: 0,
      suiteResults: {}
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Enhanced Test Suite for Coffee Selection');
    console.log('🚀 بدء مجموعة الاختبارات المحسنة لموقع Coffee Selection\n');

    const startTime = Date.now();

    // Sort test suites by priority
    const sortedSuites = Object.entries(this.testSuites)
      .sort(([,a], [,b]) => a.priority - b.priority);

    for (const [key, suite] of sortedSuites) {
      await this.runTestSuite(key, suite);
    }

    this.results.duration = Date.now() - startTime;
    this.generateReport();
  }

  async runTestSuite(key, suite) {
    console.log(`\n📋 Running ${suite.name}`);
    console.log(`📋 تشغيل ${suite.nameAr}`);
    console.log('─'.repeat(50));

    const suiteStartTime = Date.now();

    try {
      // Check if test files exist
      if (!fs.existsSync(suite.path)) {
        console.log(`⚠️  Test suite directory not found: ${suite.path}`);
        this.results.suiteResults[key] = {
          status: 'skipped',
          reason: 'Directory not found',
          duration: 0
        };
        return;
      }

      // Run the test suite
      const command = `npx playwright test ${suite.path} --reporter=json`;
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const testResults = JSON.parse(output);
      const suiteDuration = Date.now() - suiteStartTime;

      // Process results
      const suiteStats = this.processTestResults(testResults);
      
      this.results.suiteResults[key] = {
        status: 'completed',
        ...suiteStats,
        duration: suiteDuration
      };

      // Update overall results
      this.results.passed += suiteStats.passed;
      this.results.failed += suiteStats.failed;
      this.results.skipped += suiteStats.skipped;
      this.results.total += suiteStats.total;

      console.log(`✅ ${suite.name} completed`);
      console.log(`✅ ${suite.nameAr} مكتمل`);
      console.log(`   Passed: ${suiteStats.passed}, Failed: ${suiteStats.failed}, Skipped: ${suiteStats.skipped}`);
      console.log(`   نجح: ${suiteStats.passed}, فشل: ${suiteStats.failed}, تم تخطيه: ${suiteStats.skipped}`);

    } catch (error) {
      const suiteDuration = Date.now() - suiteStartTime;
      
      console.log(`❌ ${suite.name} failed`);
      console.log(`❌ ${suite.nameAr} فشل`);
      console.log(`   Error: ${error.message}`);

      this.results.suiteResults[key] = {
        status: 'failed',
        error: error.message,
        duration: suiteDuration,
        passed: 0,
        failed: 1,
        skipped: 0,
        total: 1
      };

      this.results.failed += 1;
      this.results.total += 1;
    }
  }

  processTestResults(testResults) {
    const stats = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0
    };

    if (testResults.suites) {
      testResults.suites.forEach(suite => {
        suite.specs.forEach(spec => {
          spec.tests.forEach(test => {
            stats.total++;
            
            if (test.results && test.results.length > 0) {
              const result = test.results[0];
              switch (result.status) {
                case 'passed':
                  stats.passed++;
                  break;
                case 'failed':
                  stats.failed++;
                  break;
                case 'skipped':
                  stats.skipped++;
                  break;
              }
            }
          });
        });
      });
    }

    return stats;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ENHANCED TEST RESULTS SUMMARY');
    console.log('📊 ملخص نتائج الاختبارات المحسنة');
    console.log('='.repeat(60));

    console.log(`\n🎯 Overall Results / النتائج الإجمالية:`);
    console.log(`   Total Tests: ${this.results.total} / إجمالي الاختبارات: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed} / نجح: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed} / فشل: ${this.results.failed}`);
    console.log(`   Skipped: ${this.results.skipped} / تم تخطيه: ${this.results.skipped}`);
    console.log(`   Duration: ${(this.results.duration / 1000).toFixed(2)}s / المدة: ${(this.results.duration / 1000).toFixed(2)}ث`);

    const successRate = this.results.total > 0 ? 
      ((this.results.passed / this.results.total) * 100).toFixed(1) : 0;
    console.log(`   Success Rate: ${successRate}% / معدل النجاح: ${successRate}%`);

    console.log(`\n📋 Suite Details / تفاصيل المجموعات:`);
    
    Object.entries(this.results.suiteResults).forEach(([key, result]) => {
      const suite = this.testSuites[key];
      const status = result.status === 'completed' ? '✅' : 
                    result.status === 'failed' ? '❌' : '⚠️';
      
      console.log(`\n   ${status} ${suite.name}`);
      console.log(`      ${suite.nameAr}`);
      
      if (result.status === 'completed') {
        console.log(`      Tests: ${result.total}, Passed: ${result.passed}, Failed: ${result.failed}`);
        console.log(`      الاختبارات: ${result.total}, نجح: ${result.passed}, فشل: ${result.failed}`);
      } else if (result.status === 'failed') {
        console.log(`      Error: ${result.error}`);
        console.log(`      خطأ: ${result.error}`);
      } else {
        console.log(`      Reason: ${result.reason}`);
        console.log(`      السبب: ${result.reason}`);
      }
      
      console.log(`      Duration: ${(result.duration / 1000).toFixed(2)}s`);
      console.log(`      المدة: ${(result.duration / 1000).toFixed(2)}ث`);
    });

    // Generate recommendations
    this.generateRecommendations();

    // Save detailed report
    this.saveDetailedReport();
  }

  generateRecommendations() {
    console.log(`\n💡 Recommendations / التوصيات:`);

    if (this.results.failed > 0) {
      console.log(`   🔧 Fix ${this.results.failed} failing tests`);
      console.log(`   🔧 إصلاح ${this.results.failed} اختبار فاشل`);
    }

    if (this.results.skipped > 0) {
      console.log(`   📝 Review ${this.results.skipped} skipped tests`);
      console.log(`   📝 مراجعة ${this.results.skipped} اختبار تم تخطيه`);
    }

    const successRate = this.results.total > 0 ? 
      ((this.results.passed / this.results.total) * 100) : 0;

    if (successRate < 80) {
      console.log(`   ⚠️  Success rate is below 80% - investigate failing tests`);
      console.log(`   ⚠️  معدل النجاح أقل من 80% - تحقق من الاختبارات الفاشلة`);
    } else if (successRate >= 95) {
      console.log(`   🎉 Excellent test coverage and success rate!`);
      console.log(`   🎉 تغطية اختبارات ممتازة ومعدل نجاح عالي!`);
    }

    // Performance recommendations
    if (this.results.duration > 300000) { // 5 minutes
      console.log(`   ⚡ Consider optimizing test performance - current duration: ${(this.results.duration / 1000).toFixed(2)}s`);
      console.log(`   ⚡ فكر في تحسين أداء الاختبارات - المدة الحالية: ${(this.results.duration / 1000).toFixed(2)}ث`);
    }
  }

  saveDetailedReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        skipped: this.results.skipped,
        duration: this.results.duration,
        successRate: this.results.total > 0 ? 
          ((this.results.passed / this.results.total) * 100).toFixed(1) : 0
      },
      suites: this.results.suiteResults,
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };

    const reportPath = path.join(__dirname, 'test-reports', 'enhanced-test-report.json');
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    console.log(`📄 تم حفظ التقرير المفصل في: ${reportPath}`);
  }

  async runSpecificSuite(suiteName) {
    if (!this.testSuites[suiteName]) {
      console.log(`❌ Test suite '${suiteName}' not found`);
      console.log(`❌ مجموعة الاختبارات '${suiteName}' غير موجودة`);
      console.log(`Available suites: ${Object.keys(this.testSuites).join(', ')}`);
      console.log(`المجموعات المتاحة: ${Object.keys(this.testSuites).join(', ')}`);
      return;
    }

    const suite = this.testSuites[suiteName];
    console.log(`🎯 Running specific test suite: ${suite.name}`);
    console.log(`🎯 تشغيل مجموعة اختبارات محددة: ${suite.nameAr}`);

    const startTime = Date.now();
    await this.runTestSuite(suiteName, suite);
    this.results.duration = Date.now() - startTime;
    
    this.generateReport();
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new EnhancedTestRunner();

  if (args.length === 0) {
    // Run all tests
    await runner.runAllTests();
  } else if (args[0] === '--suite' && args[1]) {
    // Run specific suite
    await runner.runSpecificSuite(args[1]);
  } else if (args[0] === '--help' || args[0] === '-h') {
    console.log(`
Enhanced Test Runner for Coffee Selection
مشغل الاختبارات المحسن لموقع Coffee Selection

Usage:
  node enhanced-test-runner.js                    # Run all test suites
  node enhanced-test-runner.js --suite <name>     # Run specific suite
  node enhanced-test-runner.js --help             # Show this help

Available test suites:
  cart        - Cart functionality tests
  payment     - Payment processing tests  
  aramex      - Aramex integration tests
  invoice     - Invoice management tests
  integration - Complete integration tests

Examples:
  node enhanced-test-runner.js --suite cart
  node enhanced-test-runner.js --suite payment
    `);
  } else {
    console.log('❌ Invalid arguments. Use --help for usage information.');
    console.log('❌ معاملات غير صحيحة. استخدم --help لمعلومات الاستخدام.');
  }
}

// Handle uncaught exceptions
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

module.exports = EnhancedTestRunner;