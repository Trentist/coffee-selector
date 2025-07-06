/**
 * Final Comprehensive Test Suite
 * مجموعة الاختبارات الشاملة النهائية
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

console.log('🚀 Running Final Comprehensive Test Suite...');
console.log('============================================');

const ODOO_CONFIG = {
  graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
  apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
};

// Test 1: Odoo Connection & Data
async function testOdooSystem() {
  console.log('\n🔍 Testing Odoo System...');
  
  const query = `
    query ComprehensiveTest {
      products(pageSize: 5) {
        products {
          id
          name
          price
          categories {
            id
            name
          }
        }
        totalCount
        minPrice
        maxPrice
      }
      categories(pageSize: 5) {
        categories {
          id
          name
        }
        totalCount
      }
    }
  `;

  return new Promise((resolve) => {
    const postData = JSON.stringify({ query });
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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.data && response.data.products && response.data.categories) {
            console.log(`✅ Odoo Connection: SUCCESS`);
            console.log(`📦 Products: ${response.data.products.totalCount}`);
            console.log(`📂 Categories: ${response.data.categories.totalCount}`);
            resolve({
              success: true,
              products: response.data.products.totalCount,
              categories: response.data.categories.totalCount
            });
          } else {
            console.log(`❌ Odoo Connection: FAILED`);
            resolve({ success: false, error: 'Invalid response' });
          }
        } catch (err) {
          console.log(`❌ Odoo Connection: PARSE ERROR`);
          resolve({ success: false, error: err.message });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Odoo Connection: NETWORK ERROR`);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`❌ Odoo Connection: TIMEOUT`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

// Test 2: Translation System
function testTranslationSystem() {
  console.log('\n🔍 Testing Translation System...');
  
  const translationFiles = [
    'public/locales/ar/common.json',
    'public/locales/en/common.json'
  ];

  let totalKeys = 0;
  let validFiles = 0;

  for (const filePath of translationFiles) {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const keyCount = Object.keys(content).length;
        totalKeys += keyCount;
        validFiles++;
        console.log(`✅ ${filePath}: ${keyCount} keys`);
      } catch (error) {
        console.log(`❌ ${filePath}: Invalid JSON`);
      }
    } else {
      console.log(`❌ ${filePath}: Not found`);
    }
  }

  const success = validFiles >= 2;
  console.log(`${success ? '✅' : '❌'} Translation System: ${success ? 'WORKING' : 'FAILED'}`);
  
  return {
    success,
    validFiles,
    totalKeys: totalKeys / validFiles || 0
  };
}

// Test 3: Component Structure
function testComponentStructure() {
  console.log('\n🔍 Testing Component Structure...');
  
  function findComponents(dir, components = []) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          findComponents(fullPath, components);
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          components.push(fullPath);
        }
      });
    } catch (error) {
      // Ignore errors
    }
    return components;
  }

  const srcDir = path.join(process.cwd(), 'src');
  const components = findComponents(srcDir);
  
  let validComponents = 0;
  let chakraComponents = 0;
  let translatedComponents = 0;

  components.forEach(comp => {
    try {
      const content = fs.readFileSync(comp, 'utf8');
      if (content.includes('export default') || content.includes('export {')) {
        validComponents++;
        if (content.includes('@chakra-ui')) chakraComponents++;
        if (content.includes('useTranslation') || content.includes('t(')) translatedComponents++;
      }
    } catch (error) {
      // Ignore errors
    }
  });

  console.log(`✅ Total Components: ${validComponents}`);
  console.log(`🎨 Chakra UI Components: ${chakraComponents}`);
  console.log(`🌐 Translated Components: ${translatedComponents}`);

  return {
    success: validComponents > 0,
    total: validComponents,
    chakra: chakraComponents,
    translated: translatedComponents,
    quality: Math.round((chakraComponents + translatedComponents) / (validComponents * 2) * 100)
  };
}

// Test 4: Project Configuration
function testProjectConfiguration() {
  console.log('\n🔍 Testing Project Configuration...');
  
  const configFiles = [
    'package.json',
    'next.config.js',
    'next-i18next.config.js',
    'tsconfig.json'
  ];

  let validConfigs = 0;
  const results = {};

  configFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file}: Found`);
      validConfigs++;
      results[file] = true;
    } else {
      console.log(`❌ ${file}: Missing`);
      results[file] = false;
    }
  });

  const success = validConfigs >= 3;
  console.log(`${success ? '✅' : '❌'} Project Configuration: ${success ? 'COMPLETE' : 'INCOMPLETE'}`);

  return {
    success,
    validConfigs,
    totalConfigs: configFiles.length,
    results
  };
}

// Test 5: Build System Check
function testBuildSystem() {
  console.log('\n🔍 Testing Build System...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`❌ Build System: No package.json`);
    return { success: false };
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    const dependencies = packageJson.dependencies || {};

    const requiredScripts = ['dev', 'build', 'start'];
    const requiredDeps = ['next', 'react', '@chakra-ui/react'];

    let validScripts = 0;
    let validDeps = 0;

    requiredScripts.forEach(script => {
      if (scripts[script]) {
        console.log(`✅ Script "${script}": Found`);
        validScripts++;
      } else {
        console.log(`❌ Script "${script}": Missing`);
      }
    });

    requiredDeps.forEach(dep => {
      if (dependencies[dep]) {
        console.log(`✅ Dependency "${dep}": Found`);
        validDeps++;
      } else {
        console.log(`❌ Dependency "${dep}": Missing`);
      }
    });

    const success = validScripts >= 3 && validDeps >= 3;
    console.log(`${success ? '✅' : '❌'} Build System: ${success ? 'READY' : 'INCOMPLETE'}`);

    return {
      success,
      validScripts,
      validDeps,
      totalScripts: requiredScripts.length,
      totalDeps: requiredDeps.length
    };
  } catch (error) {
    console.log(`❌ Build System: Invalid package.json`);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runComprehensiveTests() {
  const startTime = Date.now();
  
  console.log('🎯 Starting Comprehensive Application Testing...');
  
  // Run all tests
  const odooTest = await testOdooSystem();
  const translationTest = testTranslationSystem();
  const componentTest = testComponentStructure();
  const configTest = testProjectConfiguration();
  const buildTest = testBuildSystem();
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Calculate overall results
  const tests = [odooTest, translationTest, componentTest, configTest, buildTest];
  const passedTests = tests.filter(t => t.success).length;
  const totalTests = tests.length;
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  console.log('\n🏆 FINAL COMPREHENSIVE TEST RESULTS');
  console.log('===================================');
  console.log(`⏱️  Total Test Time: ${totalTime}ms`);
  console.log(`📊 Success Rate: ${successRate}%`);
  console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`);
  console.log('');
  
  // Individual test results
  console.log('📋 Individual Test Results:');
  console.log(`   1. Odoo System: ${odooTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   2. Translation System: ${translationTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   3. Component Structure: ${componentTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   4. Project Configuration: ${configTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   5. Build System: ${buildTest.success ? '✅ PASS' : '❌ FAIL'}`);
  
  // Detailed insights
  console.log('\n📈 Detailed Insights:');
  if (odooTest.success) {
    console.log(`   🔗 Data Connection: ${odooTest.products} products, ${odooTest.categories} categories`);
  }
  if (translationTest.success) {
    console.log(`   🌐 Internationalization: ${Math.round(translationTest.totalKeys)} translation keys`);
  }
  if (componentTest.success) {
    console.log(`   🧩 Component Quality: ${componentTest.quality}% (${componentTest.total} components)`);
  }
  
  // Generate final report
  const finalReport = {
    timestamp: new Date().toISOString(),
    testDuration: totalTime,
    successRate,
    passedTests,
    totalTests,
    tests: {
      odoo: odooTest,
      translation: translationTest,
      components: componentTest,
      configuration: configTest,
      build: buildTest
    },
    summary: {
      dataConnectivity: odooTest.success ? 'EXCELLENT' : 'FAILED',
      internationalization: translationTest.success ? 'WORKING' : 'BROKEN',
      componentArchitecture: componentTest.success ? 'GOOD' : 'POOR',
      projectSetup: configTest.success ? 'COMPLETE' : 'INCOMPLETE',
      buildReadiness: buildTest.success ? 'READY' : 'NOT_READY'
    },
    recommendations: []
  };
  
  // Add recommendations
  if (!odooTest.success) {
    finalReport.recommendations.push('Fix Odoo GraphQL connection and API configuration');
  }
  if (!translationTest.success) {
    finalReport.recommendations.push('Set up proper i18n translation files');
  }
  if (!componentTest.success) {
    finalReport.recommendations.push('Improve component structure and organization');
  }
  if (componentTest.quality < 70) {
    finalReport.recommendations.push('Increase Chakra UI and translation adoption in components');
  }
  if (!configTest.success) {
    finalReport.recommendations.push('Complete project configuration files');
  }
  if (!buildTest.success) {
    finalReport.recommendations.push('Fix build system dependencies and scripts');
  }
  
  // Save final report
  const reportsDir = 'tests/reports/real-data-validation';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(reportsDir, 'final-comprehensive-report.json'),
    JSON.stringify(finalReport, null, 2)
  );
  
  console.log('\n📄 Final comprehensive report saved to: tests/reports/real-data-validation/final-comprehensive-report.json');
  
  // Final verdict
  console.log('\n🎯 FINAL VERDICT:');
  if (successRate >= 90) {
    console.log('🎉 EXCELLENT! Application is production-ready with real data integration.');
  } else if (successRate >= 70) {
    console.log('✅ GOOD! Application is mostly ready with minor issues to address.');
  } else if (successRate >= 50) {
    console.log('⚠️  FAIR! Application needs significant improvements before production.');
  } else {
    console.log('❌ POOR! Application requires major fixes and is not ready for use.');
  }
  
  if (finalReport.recommendations.length > 0) {
    console.log('\n🔧 Recommendations:');
    finalReport.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  console.log('\n🏁 Comprehensive testing completed!');
  process.exit(successRate >= 70 ? 0 : 1);
}

// Run the comprehensive test suite
runComprehensiveTests().catch(console.error);