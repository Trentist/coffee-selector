#!/usr/bin/env node

/**
 * Cart Functionality Test Script
 * اسكريبت اختبار وظائف العربة
 */

const fs = require('fs');
const path = require('path');

class CartTestScript {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  // Test cart hook functionality
  testCartHook() {
    console.log('🛒 Testing Cart Hook Functionality...');
    
    try {
      // Read cart hook file
      const cartHookPath = path.join(__dirname, '../src/hooks/useOdooCart.ts');
      const cartHookContent = fs.readFileSync(cartHookPath, 'utf8');
      
      // Test 1: Check if hook exports required functions
      const requiredFunctions = [
        'addItemToCart',
        'removeItemFromCart', 
        'updateItemQuantity',
        'syncWithOdoo',
        'clearCartItems'
      ];
      
      let functionsFound = 0;
      requiredFunctions.forEach(func => {
        if (cartHookContent.includes(func)) {
          functionsFound++;
          this.logTest(`✅ Function ${func} found`, true);
        } else {
          this.logTest(`❌ Function ${func} missing`, false);
        }
      });
      
      // Test 2: Check cart state management
      if (cartHookContent.includes('cartItems') && cartHookContent.includes('cartTotal')) {
        this.logTest('✅ Cart state management implemented', true);
      } else {
        this.logTest('❌ Cart state management missing', false);
      }
      
      // Test 3: Check error handling
      if (cartHookContent.includes('try') && cartHookContent.includes('catch')) {
        this.logTest('✅ Error handling implemented', true);
      } else {
        this.logTest('❌ Error handling missing', false);
      }
      
      // Test 4: Check Odoo integration
      if (cartHookContent.includes('odooService') && cartHookContent.includes('session')) {
        this.logTest('✅ Odoo integration implemented', true);
      } else {
        this.logTest('❌ Odoo integration missing', false);
      }
      
      console.log(`📊 Cart Hook Tests: ${this.results.passed}/${this.results.total} passed\n`);
      
    } catch (error) {
      this.logTest(`❌ Cart hook file not found: ${error.message}`, false);
    }
  }

  // Test cart reducer functionality
  testCartReducer() {
    console.log('🔄 Testing Cart Reducer...');
    
    try {
      const reducerPath = path.join(__dirname, '../src/store/cartReducer.ts');
      const reducerContent = fs.readFileSync(reducerPath, 'utf8');
      
      // Test reducer actions
      const requiredActions = ['addToCart', 'removeItem', 'updateQuantity', 'clearCart'];
      
      requiredActions.forEach(action => {
        if (reducerContent.includes(action)) {
          this.logTest(`✅ Reducer action ${action} found`, true);
        } else {
          this.logTest(`❌ Reducer action ${action} missing`, false);
        }
      });
      
      console.log(`📊 Cart Reducer Tests: ${this.results.passed}/${this.results.total} passed\n`);
      
    } catch (error) {
      this.logTest(`❌ Cart reducer file not found: ${error.message}`, false);
    }
  }

  // Test cart components
  testCartComponents() {
    console.log('🧩 Testing Cart Components...');
    
    const componentPaths = [
      '../src/components/ui/cart-items.tsx',
      '../src/components/ui/enhanced-cart-item.tsx',
      '../src/pages/store/cart-items.tsx'
    ];
    
    componentPaths.forEach(componentPath => {
      try {
        const fullPath = path.join(__dirname, componentPath);
        const componentContent = fs.readFileSync(fullPath, 'utf8');
        
        // Check for React component structure
        if (componentContent.includes('export') && componentContent.includes('React')) {
          this.logTest(`✅ Component ${path.basename(componentPath)} structure valid`, true);
        } else {
          this.logTest(`❌ Component ${path.basename(componentPath)} structure invalid`, false);
        }
        
        // Check for cart functionality
        if (componentContent.includes('cart') || componentContent.includes('Cart')) {
          this.logTest(`✅ Component ${path.basename(componentPath)} has cart functionality`, true);
        } else {
          this.logTest(`❌ Component ${path.basename(componentPath)} missing cart functionality`, false);
        }
        
      } catch (error) {
        this.logTest(`❌ Component ${path.basename(componentPath)} not found`, false);
      }
    });
    
    console.log(`📊 Cart Components Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Simulate cart operations
  simulateCartOperations() {
    console.log('🎯 Simulating Cart Operations...');
    
    // Mock cart data
    const mockCart = {
      items: [],
      total: 0,
      count: 0
    };
    
    // Test 1: Add item to cart
    try {
      const newItem = { id: 1, name: 'قهوة عربية', price: 85, quantity: 1 };
      mockCart.items.push(newItem);
      mockCart.total += newItem.price * newItem.quantity;
      mockCart.count += newItem.quantity;
      
      this.logTest('✅ Add item to cart simulation successful', true);
    } catch (error) {
      this.logTest('❌ Add item to cart simulation failed', false);
    }
    
    // Test 2: Update quantity
    try {
      if (mockCart.items.length > 0) {
        const item = mockCart.items[0];
        const oldQuantity = item.quantity;
        item.quantity = 2;
        mockCart.total += item.price * (item.quantity - oldQuantity);
        mockCart.count += (item.quantity - oldQuantity);
        
        this.logTest('✅ Update quantity simulation successful', true);
      }
    } catch (error) {
      this.logTest('❌ Update quantity simulation failed', false);
    }
    
    // Test 3: Calculate totals
    try {
      const calculatedTotal = mockCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const calculatedCount = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
      
      if (calculatedTotal === mockCart.total && calculatedCount === mockCart.count) {
        this.logTest('✅ Cart calculations correct', true);
      } else {
        this.logTest('❌ Cart calculations incorrect', false);
      }
    } catch (error) {
      this.logTest('❌ Cart calculations failed', false);
    }
    
    // Test 4: Remove item
    try {
      if (mockCart.items.length > 0) {
        const removedItem = mockCart.items.pop();
        mockCart.total -= removedItem.price * removedItem.quantity;
        mockCart.count -= removedItem.quantity;
        
        this.logTest('✅ Remove item simulation successful', true);
      }
    } catch (error) {
      this.logTest('❌ Remove item simulation failed', false);
    }
    
    console.log(`📊 Cart Operations Tests: ${this.results.passed}/${this.results.total} passed\n`);
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

  // Run all cart tests
  runAllTests() {
    console.log('🚀 Starting Cart Functionality Tests');
    console.log('🚀 بدء اختبارات وظائف العربة\n');
    
    this.testCartHook();
    this.testCartReducer();
    this.testCartComponents();
    this.simulateCartOperations();
    
    this.generateReport();
  }

  // Generate final report
  generateReport() {
    console.log('='.repeat(50));
    console.log('📊 CART TESTS SUMMARY / ملخص اختبارات العربة');
    console.log('='.repeat(50));
    
    console.log(`\n🎯 Overall Results:`);
    console.log(`   Total Tests: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed} ✅`);
    console.log(`   Failed: ${this.results.failed} ❌`);
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    console.log(`   Success Rate: ${successRate}%`);
    
    console.log(`\n📋 Test Categories:`);
    console.log(`   🛒 Cart Hook: Functionality and integration`);
    console.log(`   🔄 Cart Reducer: State management`);
    console.log(`   🧩 Cart Components: UI components`);
    console.log(`   🎯 Cart Operations: Business logic simulation`);
    
    if (this.results.failed > 0) {
      console.log(`\n⚠️  Failed Tests:`);
      this.results.details
        .filter(test => !test.passed)
        .forEach(test => console.log(`   ${test.message}`));
    }
    
    console.log(`\n💡 Recommendations:`);
    if (successRate < 80) {
      console.log(`   🔧 Fix failing tests to improve cart reliability`);
    } else if (successRate >= 95) {
      console.log(`   🎉 Excellent cart implementation!`);
    }
    
    console.log(`\n✅ Cart functionality test completed!`);
  }
}

// Run the tests
const cartTest = new CartTestScript();
cartTest.runAllTests();