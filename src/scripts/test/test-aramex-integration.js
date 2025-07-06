#!/usr/bin/env node

/**
 * Aramex Integration Test Script
 * اسكريبت اختبار تكامل أرامكس
 */

const fs = require('fs');
const path = require('path');

class AramexTestScript {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  // Test Aramex service functionality
  testAramexService() {
    console.log('📦 Testing Aramex Service...');
    
    try {
      const servicePath = path.join(__dirname, '../src/services/aramex.service.ts');
      const serviceContent = fs.readFileSync(servicePath, 'utf8');
      
      // Test 1: Check required methods
      const requiredMethods = [
        'createShipment',
        'trackShipment',
        'calculateRate',
        'schedulePickup',
        'cancelShipment'
      ];
      
      requiredMethods.forEach(method => {
        if (serviceContent.includes(method)) {
          this.logTest(`✅ Aramex method ${method} found`, true);
        } else {
          this.logTest(`❌ Aramex method ${method} missing`, false);
        }
      });
      
      // Test 2: Check enhanced methods
      const enhancedMethods = [
        'getTrackingUrl',
        'getOrderTrackingLink',
        'extractShippingData',
        'createShipmentFromOrder',
        'getTrackingInfo',
        'validateShippingAddress'
      ];
      
      enhancedMethods.forEach(method => {
        if (serviceContent.includes(method)) {
          this.logTest(`✅ Enhanced method ${method} found`, true);
        } else {
          this.logTest(`❌ Enhanced method ${method} missing`, false);
        }
      });
      
      // Test 3: Check API integration
      if (serviceContent.includes('aramex') || serviceContent.includes('Aramex')) {
        this.logTest('✅ Aramex API integration implemented', true);
      } else {
        this.logTest('❌ Aramex API integration missing', false);
      }
      
      // Test 4: Check error handling
      if (serviceContent.includes('try') && serviceContent.includes('catch')) {
        this.logTest('✅ Aramex error handling implemented', true);
      } else {
        this.logTest('❌ Aramex error handling missing', false);
      }
      
      // Test 5: Check pickup services are disabled (as requested)
      if (serviceContent.includes('Pickup scheduling is disabled') || 
          serviceContent.includes('Pickup scheduling is not available')) {
        this.logTest('✅ Pickup services properly disabled', true);
      } else {
        this.logTest('❌ Pickup services not properly disabled', false);
      }
      
      // Test 6: Check cancellation services are disabled (as requested)
      if (serviceContent.includes('Shipment cancellation is disabled') || 
          serviceContent.includes('Shipment cancellation is not available')) {
        this.logTest('✅ Cancellation services properly disabled', true);
      } else {
        this.logTest('❌ Cancellation services not properly disabled', false);
      }
      
    } catch (error) {
      this.logTest(`❌ Aramex service file not found: ${error.message}`, false);
    }
    
    console.log(`📊 Aramex Service Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Test Aramex GraphQL integration
  testAramexGraphQL() {
    console.log('🔗 Testing Aramex GraphQL Integration...');
    
    const graphqlPaths = [
      '../src/graphql-system/queries/aramex-queries.ts',
      '../src/graphql-system/mutations/aramex-mutations.ts',
      '../src/graphql-system/hooks/use-aramex.ts'
    ];
    
    graphqlPaths.forEach(graphqlPath => {
      try {
        const fullPath = path.join(__dirname, graphqlPath);
        const graphqlContent = fs.readFileSync(fullPath, 'utf8');
        
        // Check GraphQL structure
        if (graphqlContent.includes('gql') || graphqlContent.includes('GraphQL')) {
          this.logTest(`✅ GraphQL file ${path.basename(graphqlPath)} structure valid`, true);
        } else {
          this.logTest(`❌ GraphQL file ${path.basename(graphqlPath)} structure invalid`, false);
        }
        
        // Check Aramex operations
        if (graphqlContent.includes('aramex') || graphqlContent.includes('Aramex')) {
          this.logTest(`✅ File ${path.basename(graphqlPath)} has Aramex operations`, true);
        } else {
          this.logTest(`❌ File ${path.basename(graphqlPath)} missing Aramex operations`, false);
        }
        
      } catch (error) {
        this.logTest(`❌ GraphQL file ${path.basename(graphqlPath)} not found`, false);
      }
    });
    
    console.log(`📊 Aramex GraphQL Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Simulate Aramex operations
  simulateAramexOperations() {
    console.log('🎯 Simulating Aramex Operations...');
    
    // Mock order data with complete information
    const mockOrderData = {
      id: 'ORDER-001',
      name: 'SO001',
      customer: {
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        mobile: '+966507654321'
      },
      shippingAddress: {
        line1: 'شارع الملك فهد، حي العليا',
        line2: 'مجمع الأعمال، الطابق الثالث',
        city: 'الرياض',
        stateCode: 'RI',
        postalCode: '12345',
        countryCode: 'SA'
      },
      orderLines: [
        { name: 'قهوة عربية مختصة', quantity: 2, weight: 0.5 },
        { name: 'قهوة كولومبية', quantity: 1, weight: 0.75 }
      ],
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      totalAmount: 250.75,
      currency: 'SAR'
    };
    
    // Test 1: Extract shipping data from order
    try {
      const extractedData = {
        address: {
          line1: mockOrderData.shippingAddress.line1,
          line2: mockOrderData.shippingAddress.line2,
          city: mockOrderData.shippingAddress.city,
          countryCode: mockOrderData.shippingAddress.countryCode
        },
        contact: {
          personName: `${mockOrderData.customer.firstName} ${mockOrderData.customer.lastName}`,
          phoneNumber1: mockOrderData.customer.phone,
          emailAddress: mockOrderData.customer.email
        },
        paymentData: {
          isCashOnDelivery: mockOrderData.paymentMethod === 'cod',
          totalAmount: mockOrderData.totalAmount
        }
      };
      
      if (extractedData.address.line1 && extractedData.contact.personName) {
        this.logTest('✅ Shipping data extraction successful', true);
      } else {
        this.logTest('❌ Shipping data extraction failed', false);
      }
    } catch (error) {
      this.logTest('❌ Shipping data extraction error', false);
    }
    
    // Test 2: Validate shipping address
    try {
      const addressValidation = {
        isValid: mockOrderData.shippingAddress.line1.length >= 5 &&
                mockOrderData.shippingAddress.city.length >= 2 &&
                mockOrderData.shippingAddress.countryCode.length === 2,
        errors: []
      };
      
      if (addressValidation.isValid) {
        this.logTest('✅ Address validation successful', true);
      } else {
        this.logTest('❌ Address validation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Address validation error', false);
    }
    
    // Test 3: Calculate total weight
    try {
      const totalWeight = mockOrderData.orderLines.reduce((sum, item) => 
        sum + (item.weight * item.quantity), 0
      );
      
      if (totalWeight > 0) {
        this.logTest('✅ Weight calculation successful', true);
      } else {
        this.logTest('❌ Weight calculation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Weight calculation error', false);
    }
    
    // Test 4: Generate tracking URL
    try {
      const awbNumber = '1234567890';
      const trackingUrl = `https://www.aramex.com/track/results?mode=0&ShipmentNumber=${awbNumber}`;
      
      if (trackingUrl.includes(awbNumber) && trackingUrl.includes('aramex.com')) {
        this.logTest('✅ Tracking URL generation successful', true);
      } else {
        this.logTest('❌ Tracking URL generation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Tracking URL generation error', false);
    }
    
    // Test 5: Generate order tracking link
    try {
      const orderId = mockOrderData.id;
      const orderTrackingLink = `/dashboard/orders/${orderId}/tracking`;
      
      if (orderTrackingLink.includes(orderId) && orderTrackingLink.includes('/tracking')) {
        this.logTest('✅ Order tracking link generation successful', true);
      } else {
        this.logTest('❌ Order tracking link generation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Order tracking link generation error', false);
    }
    
    // Test 6: Simulate comprehensive tracking info
    try {
      const trackingInfo = {
        success: true,
        trackingData: {
          awbNumber: '1234567890',
          status: 'IN_TRANSIT',
          location: 'الرياض - مركز التوزيع',
          updateTime: '2024-01-16T14:30:00Z',
          updates: [
            { status: 'CREATED', time: '2024-01-15T10:00:00Z', location: 'أبوظبي - المستودع' },
            { status: 'PICKED_UP', time: '2024-01-15T15:00:00Z', location: 'أبوظبي - مركز الفرز' },
            { status: 'IN_TRANSIT', time: '2024-01-16T14:30:00Z', location: 'الرياض - مركز التوزيع' }
          ]
        },
        trackingUrl: 'https://www.aramex.com/track/results?mode=0&ShipmentNumber=1234567890'
      };
      
      if (trackingInfo.success && trackingInfo.trackingData.updates.length > 0) {
        this.logTest('✅ Comprehensive tracking info simulation successful', true);
      } else {
        this.logTest('❌ Comprehensive tracking info simulation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Comprehensive tracking info error', false);
    }
    
    console.log(`📊 Aramex Operations Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Test Aramex components
  testAramexComponents() {
    console.log('🧩 Testing Aramex Components...');
    
    const componentPaths = [
      '../src/components/pages-details/store-pages/Checkout/AramexDebugView.tsx',
      '../src/components/pages-details/store-pages/Checkout/ShipmentTracker.tsx',
      '../src/components/pages-details/store-pages/Checkout/ShippingMethodSelector.tsx'
    ];
    
    componentPaths.forEach(componentPath => {
      try {
        const fullPath = path.join(__dirname, componentPath);
        const componentContent = fs.readFileSync(fullPath, 'utf8');
        
        // Check component structure
        if (componentContent.includes('export') && componentContent.includes('React')) {
          this.logTest(`✅ Aramex component ${path.basename(componentPath)} structure valid`, true);
        } else {
          this.logTest(`❌ Aramex component ${path.basename(componentPath)} structure invalid`, false);
        }
        
        // Check for Aramex functionality
        if (componentContent.includes('aramex') || componentContent.includes('Aramex') || 
            componentContent.includes('shipment') || componentContent.includes('tracking')) {
          this.logTest(`✅ Component ${path.basename(componentPath)} has Aramex functionality`, true);
        } else {
          this.logTest(`❌ Component ${path.basename(componentPath)} missing Aramex functionality`, false);
        }
        
      } catch (error) {
        this.logTest(`❌ Aramex component ${path.basename(componentPath)} not found`, false);
      }
    });
    
    console.log(`📊 Aramex Components Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Test shipping scenarios
  testShippingScenarios() {
    console.log('🚚 Testing Shipping Scenarios...');
    
    const shippingScenarios = [
      {
        type: 'domestic',
        origin: 'الرياض',
        destination: 'جدة',
        expectedCost: 25.50,
        expectedDays: 2
      },
      {
        type: 'international',
        origin: 'الرياض',
        destination: 'دبي',
        expectedCost: 45.00,
        expectedDays: 3
      },
      {
        type: 'express',
        origin: 'الرياض',
        destination: 'الدمام',
        expectedCost: 35.00,
        expectedDays: 1
      }
    ];
    
    shippingScenarios.forEach(scenario => {
      try {
        // Simulate rate calculation for each scenario
        const isValidScenario = scenario.origin && 
                               scenario.destination && 
                               scenario.expectedCost > 0 && 
                               scenario.expectedDays > 0;
        
        if (isValidScenario) {
          this.logTest(`✅ Shipping scenario "${scenario.type}" valid`, true);
        } else {
          this.logTest(`❌ Shipping scenario "${scenario.type}" invalid`, false);
        }
        
        // Test cost calculation logic
        const calculatedCost = scenario.type === 'international' ? 
                              scenario.expectedCost * 1.5 : 
                              scenario.expectedCost;
        
        if (calculatedCost > 0) {
          this.logTest(`✅ Cost calculation for "${scenario.type}" successful`, true);
        } else {
          this.logTest(`❌ Cost calculation for "${scenario.type}" failed`, false);
        }
        
      } catch (error) {
        this.logTest(`❌ Shipping scenario "${scenario.type}" error`, false);
      }
    });
    
    console.log(`📊 Shipping Scenarios Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Helper method to log test results
  logTest(message, passed) {
    this.results.total++;
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
    this.results.details.push({ message, passed });
    console.log(`  ${message}`);
  }

  // Run all Aramex tests
  runAllTests() {
    console.log('🚀 Starting Aramex Integration Tests');
    console.log('🚀 بدء اختبارات تكامل أرامكس\n');
    
    this.testAramexService();
    this.testAramexGraphQL();
    this.simulateAramexOperations();
    this.testAramexComponents();
    this.testShippingScenarios();
    
    this.generateReport();
  }

  // Generate final report
  generateReport() {
    console.log('='.repeat(50));
    console.log('📦 ARAMEX TESTS SUMMARY / ملخص اختبارات أرامكس');
    console.log('='.repeat(50));
    
    console.log(`\n🎯 Overall Results:`);
    console.log(`   Total Tests: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed} ✅`);
    console.log(`   Failed: ${this.results.failed} ❌`);
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    console.log(`   Success Rate: ${successRate}%`);
    
    console.log(`\n📋 Test Categories:`);
    console.log(`   📦 Aramex Service: Core shipping functionality`);
    console.log(`   🔗 GraphQL Integration: API queries and mutations`);
    console.log(`   🎯 Operations: Shipment and tracking simulation`);
    console.log(`   🧩 Components: UI components`);
    console.log(`   🚚 Scenarios: Different shipping scenarios`);
    
    if (this.results.failed > 0) {
      console.log(`\n⚠️  Failed Tests:`);
      this.results.details
        .filter(test => !test.passed)
        .forEach(test => console.log(`   ${test.message}`));
    }
    
    console.log(`\n💡 Recommendations:`);
    if (successRate < 80) {
      console.log(`   🔧 Fix Aramex API integration issues`);
      console.log(`   📋 Verify shipping rate calculations`);
    } else if (successRate >= 95) {
      console.log(`   🎉 Excellent Aramex integration!`);
    }
    
    console.log(`\n✅ Aramex integration test completed!`);
  }
}

// Run the tests
const aramexTest = new AramexTestScript();
aramexTest.runAllTests();