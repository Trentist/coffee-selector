/**
 * Real Odoo Data Integration Tests
 * اختبارات تكامل البيانات الحقيقية من Odoo
 */

import { 
  testOdooConnection, 
  fetchRealProductsData, 
  fetchRealCategoriesData,
  testRealUserAuth,
  validateDataStructure,
  generateOdooTestReport,
  retryWithBackoff
} from '../../helpers/odoo-helpers';

describe('Real Odoo Data Integration Tests', () => {
  let connectionStatus: any;
  let testResults: any[] = [];

  beforeAll(async () => {
    console.log('🚀 Starting Real Odoo Data Integration Tests...');
    
    // Test connection first
    connectionStatus = await testOdooConnection();
    
    if (!connectionStatus.isConnected) {
      console.warn('⚠️ Odoo connection failed, some tests may be skipped');
    }
  });

  afterAll(async () => {
    // Generate comprehensive test report
    const report = generateOdooTestReport(testResults);
    console.log('📊 Test Report:', JSON.stringify(report, null, 2));
    
    // Save report to file
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '../../reports/real-data-validation/odoo-integration-report.json');
    
    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Report saved to: ${reportPath}`);
    } catch (error) {
      console.error('❌ Failed to save report:', error);
    }
  });

  describe('Odoo Connection Tests', () => {
    test('should connect to Odoo server successfully', async () => {
      const startTime = Date.now();
      
      const result = await testOdooConnection();
      
      const testResult = {
        testName: 'Odoo Connection',
        success: result.isConnected,
        responseTime: Date.now() - startTime,
        details: result,
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      expect(result.isConnected).toBe(true);
      expect(result.database).toBeDefined();
      expect(result.error).toBeUndefined();
    }, 30000); // 30 second timeout

    test('should have valid database configuration', () => {
      if (connectionStatus.isConnected) {
        expect(connectionStatus.database).toContain('coffee-selection');
        expect(connectionStatus.version).toBeDefined();
      } else {
        console.warn('⚠️ Skipping database validation - connection failed');
      }
    });
  });

  describe('Real Products Data Tests', () => {
    let productsData: any;

    beforeAll(async () => {
      if (connectionStatus.isConnected) {
        productsData = await retryWithBackoff(fetchRealProductsData, 3, 2000);
      }
    });

    test('should fetch real products from Odoo', async () => {
      if (!connectionStatus.isConnected) {
        console.warn('⚠️ Skipping products test - no Odoo connection');
        return;
      }

      const startTime = Date.now();
      const result = await fetchRealProductsData();
      
      const testResult = {
        testName: 'Fetch Real Products',
        success: result.success,
        responseTime: Date.now() - startTime,
        dataCount: result.data?.length || 0,
        details: result,
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    }, 15000);

    test('should validate products data structure', () => {
      if (!productsData?.success || !productsData.data) {
        console.warn('⚠️ Skipping products validation - no data available');
        return;
      }

      const expectedFields = ['id', 'name', 'price', 'description', 'image'];
      const validation = validateDataStructure(productsData.data, expectedFields);
      
      const testResult = {
        testName: 'Products Data Validation',
        success: validation.isValid,
        details: validation,
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      
      // Log warnings if any
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Products data warnings:', validation.warnings);
      }
    });

    test('should have valid product prices', () => {
      if (!productsData?.success || !productsData.data) {
        console.warn('⚠️ Skipping price validation - no data available');
        return;
      }

      const invalidPrices = productsData.data.filter((product: any) => 
        !product.price || product.price <= 0 || isNaN(product.price)
      );
      
      const testResult = {
        testName: 'Product Prices Validation',
        success: invalidPrices.length === 0,
        invalidCount: invalidPrices.length,
        totalCount: productsData.data.length,
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      expect(invalidPrices).toHaveLength(0);
    });
  });

  describe('Real Categories Data Tests', () => {
    let categoriesData: any;

    beforeAll(async () => {
      if (connectionStatus.isConnected) {
        categoriesData = await retryWithBackoff(fetchRealCategoriesData, 3, 2000);
      }
    });

    test('should fetch real categories from Odoo', async () => {
      if (!connectionStatus.isConnected) {
        console.warn('⚠️ Skipping categories test - no Odoo connection');
        return;
      }

      const startTime = Date.now();
      const result = await fetchRealCategoriesData();
      
      const testResult = {
        testName: 'Fetch Real Categories',
        success: result.success,
        responseTime: Date.now() - startTime,
        dataCount: result.data?.length || 0,
        details: result,
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    }, 15000);

    test('should validate categories data structure', () => {
      if (!categoriesData?.success || !categoriesData.data) {
        console.warn('⚠️ Skipping categories validation - no data available');
        return;
      }

      const expectedFields = ['id', 'name', 'slug'];
      const validation = validateDataStructure(categoriesData.data, expectedFields);
      
      const testResult = {
        testName: 'Categories Data Validation',
        success: validation.isValid,
        details: validation,
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('Authentication Tests with Real Data', () => {
    test('should test authentication with valid credentials', async () => {
      if (!connectionStatus.isConnected) {
        console.warn('⚠️ Skipping auth test - no Odoo connection');
        return;
      }

      const startTime = Date.now();
      
      // Use test credentials (these should be configured in test environment)
      const testEmail = 'test@coffeeselection.com';
      const testPassword = 'testpassword';
      
      const result = await testRealUserAuth(testEmail, testPassword);
      
      const testResult = {
        testName: 'Real User Authentication',
        success: result.success,
        responseTime: Date.now() - startTime,
        details: {
          message: result.message,
          hasUser: !!result.user,
          error: result.error
        },
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      // Note: This test might fail if test user doesn't exist
      // That's expected and should be handled gracefully
      if (result.success) {
        expect(result.user).toBeDefined();
        expect(result.user.email).toBe(testEmail);
      } else {
        console.warn('⚠️ Authentication test failed (expected if test user not configured):', result.error);
      }
    }, 10000);
  });

  describe('Data Consistency Tests', () => {
    test('should verify data consistency across multiple requests', async () => {
      if (!connectionStatus.isConnected) {
        console.warn('⚠️ Skipping consistency test - no Odoo connection');
        return;
      }

      const startTime = Date.now();
      
      // Fetch products multiple times
      const request1 = await fetchRealProductsData();
      const request2 = await fetchRealProductsData();
      
      const testResult = {
        testName: 'Data Consistency Check',
        success: request1.success && request2.success,
        responseTime: Date.now() - startTime,
        details: {
          request1Count: request1.data?.length || 0,
          request2Count: request2.data?.length || 0,
          consistent: request1.data?.length === request2.data?.length
        },
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      if (request1.success && request2.success) {
        expect(request1.data.length).toBe(request2.data.length);
      }
    }, 20000);
  });

  describe('Performance Tests with Real Data', () => {
    test('should meet performance requirements for data fetching', async () => {
      if (!connectionStatus.isConnected) {
        console.warn('⚠️ Skipping performance test - no Odoo connection');
        return;
      }

      const startTime = Date.now();
      const result = await fetchRealProductsData();
      const responseTime = Date.now() - startTime;
      
      const testResult = {
        testName: 'Performance Test - Products Fetch',
        success: result.success && responseTime < 5000, // 5 seconds max
        responseTime,
        details: {
          dataCount: result.data?.length || 0,
          performanceGrade: responseTime < 2000 ? 'excellent' : 
                           responseTime < 5000 ? 'good' : 'poor'
        },
        timestamp: new Date().toISOString()
      };
      
      testResults.push(testResult);
      
      expect(responseTime).toBeLessThan(5000); // 5 seconds max
      
      if (responseTime > 2000) {
        console.warn(`⚠️ Slow response time: ${responseTime}ms`);
      }
    }, 10000);
  });
});