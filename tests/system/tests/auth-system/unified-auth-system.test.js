/**
 * Unified Authentication System Test
 * اختبار نظام المصادقة الموحد
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  projectRoot: path.resolve(__dirname, '../..'),
  authSystemPath: 'src/systems/auth',
  graphqlServicePath: 'src/services/odoo/graphql-auth.service.ts',
  testResults: {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  }
};

/**
 * Test helper functions
 */
function logTest(testName, status, details = '') {
  TEST_CONFIG.testResults.total++;
  if (status === 'PASS') {
    TEST_CONFIG.testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    TEST_CONFIG.testResults.failed++;
    console.log(`❌ ${testName}`);
    if (details) console.log(`   ${details}`);
  }
  
  TEST_CONFIG.testResults.details.push({
    name: testName,
    status,
    details
  });
}

/**
 * Check if file exists and has content
 */
function checkFileExists(filePath, testName) {
  const fullPath = path.join(TEST_CONFIG.projectRoot, filePath);
  try {
    const exists = fs.existsSync(fullPath);
    const hasContent = exists && fs.statSync(fullPath).size > 0;
    
    if (exists && hasContent) {
      logTest(testName, 'PASS');
      return true;
    } else {
      logTest(testName, 'FAIL', `File ${filePath} ${!exists ? 'does not exist' : 'is empty'}`);
      return false;
    }
  } catch (error) {
    logTest(testName, 'FAIL', `Error checking file: ${error.message}`);
    return false;
  }
}

/**
 * Check if file contains specific content
 */
function checkFileContent(filePath, searchText, testName) {
  const fullPath = path.join(TEST_CONFIG.projectRoot, filePath);
  try {
    if (!fs.existsSync(fullPath)) {
      logTest(testName, 'FAIL', `File ${filePath} does not exist`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasContent = content.includes(searchText);
    
    if (hasContent) {
      logTest(testName, 'PASS');
      return true;
    } else {
      logTest(testName, 'FAIL', `Content not found in ${filePath}`);
      return false;
    }
  } catch (error) {
    logTest(testName, 'FAIL', `Error reading file: ${error.message}`);
    return false;
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('🚀 Starting Unified Authentication System Tests\n');
  console.log('=' .repeat(60));

  // Test 1: Core System Files
  console.log('\n📁 Testing Core System Files...');
  checkFileExists('src/systems/auth/index.ts', 'Auth System Entry Point');
  checkFileExists('src/systems/auth/README.md', 'Auth System Documentation');
  
  // Test 2: Core Components
  console.log('\n🔧 Testing Core Components...');
  checkFileExists('src/systems/auth/core/auth-manager.ts', 'Auth Manager');
  checkFileExists('src/systems/auth/services/auth-service.ts', 'Unified Auth Service');
  checkFileExists('src/services/odoo/graphql-auth.service.ts', 'GraphQL Auth Service');
  
  // Test 3: GraphQL Integration
  console.log('\n🔗 Testing GraphQL Integration...');
  checkFileContent(
    'src/systems/auth/core/auth-manager.ts',
    'graphqlAuthService',
    'Auth Manager uses GraphQL Service'
  );
  
  checkFileContent(
    'src/services/odoo/graphql-auth.service.ts',
    'REAL_LOGIN_MUTATION',
    'GraphQL Service has Real Mutations'
  );
  
  // Test 4: Real Data Implementation
  console.log('\n✅ Testing Real Data Implementation...');
  checkFileContent(
    'src/systems/auth/services/auth-service.ts',
    'graphqlAuthService.login',
    'Auth Service uses real GraphQL login'
  );
  
  checkFileContent(
    'src/systems/auth/services/auth-service.ts',
    'graphqlAuthService.changePassword',
    'Auth Service has change password function'
  );
  
  // Test 5: New Functions
  console.log('\n🆕 Testing New Functions...');
  checkFileContent(
    'src/services/odoo/graphql-auth.service.ts',
    'resetPasswordWithToken',
    'GraphQL Service has reset password with token'
  );
  
  checkFileContent(
    'src/services/odoo/graphql-auth.service.ts',
    'updateProfile',
    'GraphQL Service has update profile'
  );
  
  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Test Results Summary');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  return TEST_CONFIG.testResults.failed === 0;
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});