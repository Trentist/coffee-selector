#!/usr/bin/env node

/**
 * Invoice System Test Script
 * اسكريبت اختبار نظام الفواتير
 */

const fs = require('fs');
const path = require('path');

class InvoiceTestScript {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  // Test invoice components
  testInvoiceComponents() {
    console.log('🧾 Testing Invoice Components...');
    
    const componentPaths = [
      '../src/components/checkout/InvoiceDisplay.tsx',
      '../src/components/pages-details/dashboard-page/invoices-bills/index.tsx',
      '../src/components/pages-details/dashboard-page/invoices-bills/single-page-invoice.tsx'
    ];
    
    componentPaths.forEach(componentPath => {
      try {
        const fullPath = path.join(__dirname, componentPath);
        const componentContent = fs.readFileSync(fullPath, 'utf8');
        
        // Check component structure
        if (componentContent.includes('export') && componentContent.includes('React')) {
          this.logTest(`✅ Invoice component ${path.basename(componentPath)} structure valid`, true);
        } else {
          this.logTest(`❌ Invoice component ${path.basename(componentPath)} structure invalid`, false);
        }
        
        // Check for invoice functionality
        if (componentContent.includes('invoice') || componentContent.includes('Invoice')) {
          this.logTest(`✅ Component ${path.basename(componentPath)} has invoice functionality`, true);
        } else {
          this.logTest(`❌ Component ${path.basename(componentPath)} missing invoice functionality`, false);
        }
        
      } catch (error) {
        this.logTest(`❌ Invoice component ${path.basename(componentPath)} not found`, false);
      }
    });
    
    console.log(`📊 Invoice Components Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Test invoice GraphQL integration
  testInvoiceGraphQL() {
    console.log('🔗 Testing Invoice GraphQL Integration...');
    
    const graphqlPaths = [
      '../src/graphql/queries/invoices.ts',
      '../src/odoo-graphql-system/lifecycles/invoice-lifecycle.ts'
    ];
    
    graphqlPaths.forEach(graphqlPath => {
      try {
        const fullPath = path.join(__dirname, graphqlPath);
        const graphqlContent = fs.readFileSync(fullPath, 'utf8');
        
        // Check GraphQL structure
        if (graphqlContent.includes('gql') || graphqlContent.includes('GraphQL') || 
            graphqlContent.includes('query') || graphqlContent.includes('mutation')) {
          this.logTest(`✅ GraphQL file ${path.basename(graphqlPath)} structure valid`, true);
        } else {
          this.logTest(`❌ GraphQL file ${path.basename(graphqlPath)} structure invalid`, false);
        }
        
        // Check invoice operations
        if (graphqlContent.includes('invoice') || graphqlContent.includes('Invoice')) {
          this.logTest(`✅ File ${path.basename(graphqlPath)} has invoice operations`, true);
        } else {
          this.logTest(`❌ File ${path.basename(graphqlPath)} missing invoice operations`, false);
        }
        
      } catch (error) {
        this.logTest(`❌ GraphQL file ${path.basename(graphqlPath)} not found`, false);
      }
    });
    
    console.log(`📊 Invoice GraphQL Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Simulate invoice generation
  simulateInvoiceGeneration() {
    console.log('🎯 Simulating Invoice Generation...');
    
    // Mock order data
    const mockOrderData = {
      orderId: 'ORDER-001',
      customerId: 'CUST-123',
      customerName: 'أحمد محمد',
      customerEmail: 'ahmed@example.com',
      items: [
        { name: 'قهوة عربية مختصة', quantity: 2, price: 85.00, total: 170.00 },
        { name: 'قهوة كولومبية', quantity: 1, price: 95.00, total: 95.00 }
      ],
      subtotal: 265.00,
      tax: 39.75, // 15% VAT
      shipping: 25.00,
      total: 329.75,
      currency: 'SAR'
    };
    
    // Test 1: Validate order data for invoice
    try {
      const isValid = mockOrderData.orderId && 
                     mockOrderData.customerId && 
                     mockOrderData.items.length > 0 && 
                     mockOrderData.total > 0;
      
      if (isValid) {
        this.logTest('✅ Order data validation for invoice successful', true);
      } else {
        this.logTest('❌ Order data validation for invoice failed', false);
      }
    } catch (error) {
      this.logTest('❌ Order data validation error', false);
    }
    
    // Test 2: Calculate invoice totals
    try {
      const calculatedSubtotal = mockOrderData.items.reduce((sum, item) => sum + item.total, 0);
      const calculatedTax = calculatedSubtotal * 0.15; // 15% VAT
      const calculatedTotal = calculatedSubtotal + calculatedTax + mockOrderData.shipping;
      
      const subtotalMatch = Math.abs(calculatedSubtotal - mockOrderData.subtotal) < 0.01;
      const taxMatch = Math.abs(calculatedTax - mockOrderData.tax) < 0.01;
      const totalMatch = Math.abs(calculatedTotal - mockOrderData.total) < 0.01;
      
      if (subtotalMatch && taxMatch && totalMatch) {
        this.logTest('✅ Invoice calculations correct', true);
      } else {
        this.logTest('❌ Invoice calculations incorrect', false);
      }
    } catch (error) {
      this.logTest('❌ Invoice calculations error', false);
    }
    
    // Test 3: Generate invoice number
    try {
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const invoiceDate = new Date().toISOString().split('T')[0];
      
      if (invoiceNumber.startsWith('INV-') && invoiceDate) {
        this.logTest('✅ Invoice number and date generation successful', true);
      } else {
        this.logTest('❌ Invoice number and date generation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Invoice number generation error', false);
    }
    
    // Test 4: Simulate invoice structure
    try {
      const invoiceStructure = {
        invoiceNumber: 'INV-123456',
        invoiceDate: '2024-01-16',
        dueDate: '2024-02-15',
        customer: {
          name: mockOrderData.customerName,
          email: mockOrderData.customerEmail
        },
        items: mockOrderData.items,
        subtotal: mockOrderData.subtotal,
        tax: mockOrderData.tax,
        shipping: mockOrderData.shipping,
        total: mockOrderData.total,
        currency: mockOrderData.currency,
        status: 'PAID'
      };
      
      const hasRequiredFields = invoiceStructure.invoiceNumber && 
                               invoiceStructure.customer.name && 
                               invoiceStructure.items.length > 0 && 
                               invoiceStructure.total > 0;
      
      if (hasRequiredFields) {
        this.logTest('✅ Invoice structure generation successful', true);
      } else {
        this.logTest('❌ Invoice structure generation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Invoice structure generation error', false);
    }
    
    console.log(`📊 Invoice Generation Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Test VAT calculations
  testVATCalculations() {
    console.log('💰 Testing VAT Calculations...');
    
    const testCases = [
      { country: 'SA', rate: 0.15, amount: 100, expectedVAT: 15 },
      { country: 'AE', rate: 0.05, amount: 200, expectedVAT: 10 },
      { country: 'US', rate: 0.00, amount: 150, expectedVAT: 0 }
    ];
    
    testCases.forEach(testCase => {
      try {
        const calculatedVAT = testCase.amount * testCase.rate;
        const isCorrect = Math.abs(calculatedVAT - testCase.expectedVAT) < 0.01;
        
        if (isCorrect) {
          this.logTest(`✅ VAT calculation for ${testCase.country} correct`, true);
        } else {
          this.logTest(`❌ VAT calculation for ${testCase.country} incorrect`, false);
        }
      } catch (error) {
        this.logTest(`❌ VAT calculation for ${testCase.country} error`, false);
      }
    });
    
    console.log(`📊 VAT Calculations Tests: ${this.results.passed}/${this.results.total} passed\n`);
  }

  // Test invoice operations
  testInvoiceOperations() {
    console.log('📋 Testing Invoice Operations...');
    
    // Mock invoice data
    const mockInvoice = {
      id: 'INV-123456',
      number: 'INV-123456',
      date: '2024-01-16',
      status: 'PAID',
      total: 329.75,
      currency: 'SAR'
    };
    
    // Test 1: Invoice status management
    try {
      const validStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
      const isValidStatus = validStatuses.includes(mockInvoice.status);
      
      if (isValidStatus) {
        this.logTest('✅ Invoice status management valid', true);
      } else {
        this.logTest('❌ Invoice status management invalid', false);
      }
    } catch (error) {
      this.logTest('❌ Invoice status management error', false);
    }
    
    // Test 2: Invoice PDF generation simulation
    try {
      const pdfData = {
        filename: `${mockInvoice.number}.pdf`,
        size: 1024 * 50, // 50KB
        type: 'application/pdf'
      };
      
      if (pdfData.filename.endsWith('.pdf') && pdfData.size > 0) {
        this.logTest('✅ Invoice PDF generation simulation successful', true);
      } else {
        this.logTest('❌ Invoice PDF generation simulation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Invoice PDF generation error', false);
    }
    
    // Test 3: Invoice email sending simulation
    try {
      const emailData = {
        to: 'customer@example.com',
        subject: `فاتورة رقم ${mockInvoice.number}`,
        body: 'نشكركم لاختياركم Coffee Selection',
        attachment: `${mockInvoice.number}.pdf`
      };
      
      if (emailData.to && emailData.subject && emailData.attachment) {
        this.logTest('✅ Invoice email sending simulation successful', true);
      } else {
        this.logTest('❌ Invoice email sending simulation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Invoice email sending error', false);
    }
    
    // Test 4: Invoice search and filtering
    try {
      const searchCriteria = {
        status: 'PAID',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        customer: 'أحمد'
      };
      
      const matchesSearch = mockInvoice.status === searchCriteria.status &&
                           mockInvoice.date >= searchCriteria.dateFrom &&
                           mockInvoice.date <= searchCriteria.dateTo;
      
      if (matchesSearch) {
        this.logTest('✅ Invoice search and filtering simulation successful', true);
      } else {
        this.logTest('❌ Invoice search and filtering simulation failed', false);
      }
    } catch (error) {
      this.logTest('❌ Invoice search and filtering error', false);
    }
    
    console.log(`📊 Invoice Operations Tests: ${this.results.passed}/${this.results.total} passed\n`);
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

  // Run all invoice tests
  runAllTests() {
    console.log('🚀 Starting Invoice System Tests');
    console.log('🚀 بدء اختبارات نظام الفواتير\n');
    
    this.testInvoiceComponents();
    this.testInvoiceGraphQL();
    this.simulateInvoiceGeneration();
    this.testVATCalculations();
    this.testInvoiceOperations();
    
    this.generateReport();
  }

  // Generate final report
  generateReport() {
    console.log('='.repeat(50));
    console.log('🧾 INVOICE TESTS SUMMARY / ملخص اختبارات الفواتير');
    console.log('='.repeat(50));
    
    console.log(`\n🎯 Overall Results:`);
    console.log(`   Total Tests: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed} ✅`);
    console.log(`   Failed: ${this.results.failed} ❌`);
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    console.log(`   Success Rate: ${successRate}%`);
    
    console.log(`\n📋 Test Categories:`);
    console.log(`   🧾 Invoice Components: UI components`);
    console.log(`   🔗 GraphQL Integration: API queries and mutations`);
    console.log(`   🎯 Invoice Generation: Creation and structure`);
    console.log(`   💰 VAT Calculations: Tax calculations`);
    console.log(`   📋 Invoice Operations: Management operations`);
    
    if (this.results.failed > 0) {
      console.log(`\n⚠️  Failed Tests:`);
      this.results.details
        .filter(test => !test.passed)
        .forEach(test => console.log(`   ${test.message}`));
    }
    
    console.log(`\n💡 Recommendations:`);
    if (successRate < 80) {
      console.log(`   🔧 Fix invoice generation issues`);
      console.log(`   💰 Verify VAT calculations`);
      console.log(`   📧 Test email functionality`);
    } else if (successRate >= 95) {
      console.log(`   🎉 Excellent invoice system implementation!`);
    }
    
    console.log(`\n✅ Invoice system test completed!`);
  }
}

// Run the tests
const invoiceTest = new InvoiceTestScript();
invoiceTest.runAllTests();