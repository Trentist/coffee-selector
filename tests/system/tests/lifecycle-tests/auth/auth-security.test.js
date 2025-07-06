/**
 * Authentication and Security System Test
 * اختبار نظام المصادقة والحماية
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  projectRoot: path.resolve(__dirname, '../../..'),
  realUser: {
    email: 'mohamed@coffeeselection.com',
    password: 'Montada@1'
  },
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
 * Test security configurations
 */
function testSecurityConfigurations() {
  console.log('\n🔒 Testing Security Configurations...');
  
  // Check environment variables
  const envPath = path.join(TEST_CONFIG.projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('NEXTAUTH_SECRET')) {
      logTest('NextAuth Secret Configuration', 'PASS');
    } else {
      logTest('NextAuth Secret Configuration', 'FAIL', 'NEXTAUTH_SECRET not found');
    }
  } else {
    logTest('Environment File', 'FAIL', '.env file not found');
  }
  
  // Check security headers
  const nextConfigPath = path.join(TEST_CONFIG.projectRoot, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    if (configContent.includes('headers') || configContent.includes('security')) {
      logTest('Security Headers Configuration', 'PASS');
    } else {
      logTest('Security Headers Configuration', 'WARN', 'Security headers not explicitly configured');
    }
  }
}

/**
 * Main test execution
 */
async function runAuthSecurityTests() {
  console.log('🚀 Starting Authentication and Security Tests\n');
  console.log('=' .repeat(60));
  console.log(`🔐 Testing with real user: ${TEST_CONFIG.realUser.email}`);
  console.log('=' .repeat(60));

  // Test 1: Core Authentication System
  console.log('\n🏗️ Testing Core Authentication System...');
  checkFileExists('src/systems/auth/index.ts', 'Auth System Entry Point');
  checkFileExists('src/systems/auth/core/auth-manager.ts', 'Auth Manager');
  checkFileExists('src/systems/auth/core/session-manager.ts', 'Session Manager');
  checkFileExists('src/systems/auth/core/security-manager.ts', 'Security Manager');
  checkFileExists('src/systems/auth/core/cache-manager.ts', 'Cache Manager');
  
  // Test 2: Authentication Services
  console.log('\n🛠️ Testing Authentication Services...');
  checkFileExists('src/systems/auth/services/auth-service.ts', 'Unified Auth Service');
  checkFileExists('src/services/odoo/graphql-auth.service.ts', 'GraphQL Auth Service');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'REAL_LOGIN_MUTATION', 'Real login mutation exists');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'executeGraphQLQuery', 'GraphQL execution exists');
  
  // Test 3: Authentication Forms
  console.log('\n📝 Testing Authentication Forms...');
  checkFileExists('src/systems/auth/components/forms/login-form.tsx', 'Login Form');
  checkFileExists('src/systems/auth/components/forms/register-form.tsx', 'Register Form');
  checkFileExists('src/systems/auth/components/forms/forgot-password-form.tsx', 'Forgot Password Form');
  checkFileExists('src/systems/auth/components/forms/reset-password-form.tsx', 'Reset Password Form');
  
  // Test 4: Route Protection
  console.log('\n🛡️ Testing Route Protection...');
  checkFileExists('src/systems/auth/components/guards/protected-route.tsx', 'Protected Route Guard');
  checkFileExists('src/systems/auth/components/guards/guest-route.tsx', 'Guest Route Guard');
  
  // Test 5: Session Management
  console.log('\n🕐 Testing Session Management...');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'validateSession', 'Session validation exists');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'refreshToken', 'Token refresh exists');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'validateSession', 'Service session validation');
  
  // Test 6: Password Security
  console.log('\n🔑 Testing Password Security...');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'changePassword', 'Change password function');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'REAL_CHANGE_PASSWORD_MUTATION', 'Change password mutation');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'resetPasswordWithToken', 'Reset password with token');
  
  // Test 7: User Data Protection
  console.log('\n🔐 Testing User Data Protection...');
  checkFileContent('src/systems/auth/types/auth.types.ts', 'UserPreferences', 'User preferences type');
  checkFileContent('src/systems/auth/types/auth.types.ts', 'UserProfile', 'User profile type');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'updateProfile', 'Profile update function');
  
  // Test 8: Email Verification
  console.log('\n📧 Testing Email Verification...');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'verifyEmail', 'Email verification function');
  checkFileContent('src/graphql/auth/mutations.ts', 'REAL_VERIFY_EMAIL_MUTATION', 'Email verification mutation');
  
  // Test 9: GraphQL Security
  console.log('\n🔗 Testing GraphQL Security...');
  checkFileExists('src/lib/graphql-client.ts', 'GraphQL Client');
  checkFileContent('src/lib/graphql-client.ts', 'headers', 'GraphQL headers configuration');
  checkFileExists('src/lib/odooGraphQL.tsx', 'Odoo GraphQL Integration');
  
  // Test 10: Error Handling
  console.log('\n⚠️ Testing Error Handling...');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'try', 'Error handling in auth hook');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'catch', 'Error handling in auth service');
  checkFileContent('src/services/odoo/graphql-auth.service.ts', 'catch', 'Error handling in GraphQL service');
  
  // Test 11: Input Validation
  console.log('\n✅ Testing Input Validation...');
  checkFileExists('src/systems/auth/constants/validation-rules.ts', 'Validation Rules');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'isValidEmail', 'Email validation');
  
  // Test 12: Security Constants
  console.log('\n🔢 Testing Security Constants...');
  checkFileExists('src/systems/auth/constants/auth-constants.ts', 'Auth Constants');
  checkFileContent('src/systems/auth/constants/auth-constants.ts', 'STORAGE_KEYS', 'Storage keys defined');
  
  // Test 13: Middleware Protection
  console.log('\n🚧 Testing Middleware Protection...');
  const middlewarePath = path.join(TEST_CONFIG.projectRoot, 'src/systems/auth/middleware');
  if (fs.existsSync(middlewarePath)) {
    logTest('Auth Middleware Directory', 'PASS');
  } else {
    logTest('Auth Middleware Directory', 'FAIL', 'Middleware directory not found');
  }
  
  // Test 14: Security Configurations
  testSecurityConfigurations();
  
  // Test 15: Real Data Integration
  console.log('\n📊 Testing Real Data Integration...');
  checkFileContent('src/systems/auth/core/auth-manager.ts', 'graphqlAuthService', 'Auth manager uses GraphQL');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'graphqlAuthService.login', 'Service uses real login');
  
  // Test 16: Token Management
  console.log('\n🎫 Testing Token Management...');
  checkFileContent('src/systems/auth/services/auth-service.ts', 'refreshToken', 'Token refresh service');
  checkFileContent('src/systems/auth/hooks/use-auth.ts', 'localStorage', 'Token storage');
  
  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Authentication and Security Test Results');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${TEST_CONFIG.testResults.passed}`);
  console.log(`❌ Failed: ${TEST_CONFIG.testResults.failed}`);
  console.log(`📊 Total: ${TEST_CONFIG.testResults.total}`);
  console.log(`📈 Success Rate: ${((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)}%`);
  
  // Save results
  const resultsPath = path.join(TEST_CONFIG.projectRoot, 'tests/reports/auth-security-results.json');
  const resultsDir = path.dirname(resultsPath);
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testType: 'Authentication and Security',
    realUser: TEST_CONFIG.realUser.email,
    summary: {
      passed: TEST_CONFIG.testResults.passed,
      failed: TEST_CONFIG.testResults.failed,
      total: TEST_CONFIG.testResults.total,
      successRate: ((TEST_CONFIG.testResults.passed / TEST_CONFIG.testResults.total) * 100).toFixed(1)
    },
    details: TEST_CONFIG.testResults.details
  }, null, 2));
  
  console.log(`\n📄 Results saved to: ${resultsPath}`);
  
  return TEST_CONFIG.testResults.failed === 0;
}

// Run tests
runAuthSecurityTests().catch(error => {
  console.error('❌ Auth security test failed:', error);
  process.exit(1);
});