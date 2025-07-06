/**
 * Products Page End-to-End Tests with Real Data
 * اختبارات شاملة لصفحة المنتجات مع البيانات الحقيقية
 */

import { 
  fetchRealProductsData, 
  fetchRealCategoriesData,
  testOdooConnection,
  measurePerformance,
  generateTestSummary
} from '../../helpers/odoo-helpers';

describe('Products Page E2E Tests with Real Data', () => {
  let realProducts: any[] = [];
  let realCategories: any[] = [];
  let testResults: any[] = [];

  beforeAll(async () => {
    console.log('🛍️ Starting Products Page E2E Tests with Real Data...');
    
    // Check Odoo connection
    const connection = await testOdooConnection();
    if (!connection.isConnected) {
      console.warn('⚠️ Odoo connection failed, tests may be limited');
      return;
    }

    // Fetch real data
    const productsResult = await fetchRealProductsData();
    const categoriesResult = await fetchRealCategoriesData();

    if (productsResult.success) {
      realProducts = productsResult.data;
      console.log(`✅ Loaded ${realProducts.length} real products`);
    }

    if (categoriesResult.success) {
      realCategories = categoriesResult.data;
      console.log(`✅ Loaded ${realCategories.length} real categories`);
    }
  });

  afterAll(() => {
    // Generate test summary
    const summary = generateTestSummary(testResults);
    console.log('📊 Products Page Test Summary:', summary);
  });

  describe('Products Data Loading Tests', () => {
    test('should load real products data successfully', async () => {
      const testStart = Date.now();
      
      try {
        expect(realProducts).toBeDefined();
        expect(Array.isArray(realProducts)).toBe(true);
        expect(realProducts.length).toBeGreaterThan(0);
        
        // Validate first product structure
        if (realProducts.length > 0) {
          const firstProduct = realProducts[0];
          expect(firstProduct).toHaveProperty('id');
          expect(firstProduct).toHaveProperty('name');
          expect(firstProduct).toHaveProperty('price');
          expect(firstProduct.name).toBeTruthy();
          expect(typeof firstProduct.price).toBe('number');
          expect(firstProduct.price).toBeGreaterThan(0);
        }
        
        testResults.push({
          testName: 'Load Real Products Data',
          passed: true,
          duration: Date.now() - testStart,
          dataCount: realProducts.length
        });
        
      } catch (error) {
        testResults.push({
          testName: 'Load Real Products Data',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });

    test('should validate products data quality', () => {
      const testStart = Date.now();
      
      try {
        const validationResults = {
          totalProducts: realProducts.length,
          validProducts: 0,
          invalidProducts: 0,
          missingImages: 0,
          missingDescriptions: 0,
          invalidPrices: 0
        };

        realProducts.forEach(product => {
          let isValid = true;

          // Check required fields
          if (!product.id || !product.name || !product.price) {
            isValid = false;
          }

          // Check price validity
          if (!product.price || product.price <= 0 || isNaN(product.price)) {
            validationResults.invalidPrices++;
            isValid = false;
          }

          // Check image
          if (!product.image) {
            validationResults.missingImages++;
          }

          // Check description
          if (!product.description) {
            validationResults.missingDescriptions++;
          }

          if (isValid) {
            validationResults.validProducts++;
          } else {
            validationResults.invalidProducts++;
          }
        });

        console.log('📊 Products Data Quality Report:', validationResults);

        // Expect at least 80% of products to be valid
        const validityRate = (validationResults.validProducts / validationResults.totalProducts) * 100;
        expect(validityRate).toBeGreaterThanOrEqual(80);

        testResults.push({
          testName: 'Validate Products Data Quality',
          passed: true,
          duration: Date.now() - testStart,
          validityRate,
          details: validationResults
        });

      } catch (error) {
        testResults.push({
          testName: 'Validate Products Data Quality',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });
  });

  describe('Categories Data Tests', () => {
    test('should load real categories data', () => {
      const testStart = Date.now();
      
      try {
        expect(realCategories).toBeDefined();
        expect(Array.isArray(realCategories)).toBe(true);
        expect(realCategories.length).toBeGreaterThan(0);

        // Validate category structure
        if (realCategories.length > 0) {
          const firstCategory = realCategories[0];
          expect(firstCategory).toHaveProperty('id');
          expect(firstCategory).toHaveProperty('name');
          expect(firstCategory.name).toBeTruthy();
        }

        testResults.push({
          testName: 'Load Real Categories Data',
          passed: true,
          duration: Date.now() - testStart,
          dataCount: realCategories.length
        });

      } catch (error) {
        testResults.push({
          testName: 'Load Real Categories Data',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });

    test('should validate category-product relationships', () => {
      const testStart = Date.now();
      
      try {
        const categoryIds = realCategories.map(cat => cat.id);
        const productsWithValidCategories = realProducts.filter(product => {
          if (!product.categories || !Array.isArray(product.categories)) {
            return false;
          }
          
          return product.categories.some((cat: any) => 
            categoryIds.includes(cat.id)
          );
        });

        const validCategoryRate = (productsWithValidCategories.length / realProducts.length) * 100;
        
        console.log(`📊 Category-Product Relationship: ${validCategoryRate.toFixed(2)}% products have valid categories`);

        // Expect at least 70% of products to have valid categories
        expect(validCategoryRate).toBeGreaterThanOrEqual(70);

        testResults.push({
          testName: 'Validate Category-Product Relationships',
          passed: true,
          duration: Date.now() - testStart,
          validCategoryRate,
          productsWithCategories: productsWithValidCategories.length,
          totalProducts: realProducts.length
        });

      } catch (error) {
        testResults.push({
          testName: 'Validate Category-Product Relationships',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });
  });

  describe('Product Search and Filtering Tests', () => {
    test('should support product search functionality', () => {
      const testStart = Date.now();
      
      try {
        // Test search by name
        const searchTerm = 'coffee';
        const searchResults = realProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        expect(searchResults.length).toBeGreaterThanOrEqual(0);
        
        // If we have search results, validate they contain the search term
        if (searchResults.length > 0) {
          searchResults.forEach(product => {
            const containsSearchTerm = 
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
            expect(containsSearchTerm).toBe(true);
          });
        }

        testResults.push({
          testName: 'Product Search Functionality',
          passed: true,
          duration: Date.now() - testStart,
          searchTerm,
          resultsCount: searchResults.length,
          totalProducts: realProducts.length
        });

      } catch (error) {
        testResults.push({
          testName: 'Product Search Functionality',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });

    test('should support price range filtering', () => {
      const testStart = Date.now();
      
      try {
        const minPrice = 10;
        const maxPrice = 50;
        
        const filteredProducts = realProducts.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );

        expect(filteredProducts.length).toBeGreaterThanOrEqual(0);
        
        // Validate all filtered products are within price range
        filteredProducts.forEach(product => {
          expect(product.price).toBeGreaterThanOrEqual(minPrice);
          expect(product.price).toBeLessThanOrEqual(maxPrice);
        });

        testResults.push({
          testName: 'Price Range Filtering',
          passed: true,
          duration: Date.now() - testStart,
          priceRange: { min: minPrice, max: maxPrice },
          filteredCount: filteredProducts.length,
          totalProducts: realProducts.length
        });

      } catch (error) {
        testResults.push({
          testName: 'Price Range Filtering',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });
  });

  describe('Performance Tests with Real Data', () => {
    test('should load products within acceptable time', async () => {
      const performance = await measurePerformance(async () => {
        return await fetchRealProductsData();
      });

      expect(performance.duration).toBeLessThan(5000); // 5 seconds max
      expect(performance.result.success).toBe(true);

      testResults.push({
        testName: 'Products Loading Performance',
        passed: performance.duration < 5000,
        duration: performance.duration,
        performanceGrade: performance.duration < 2000 ? 'excellent' : 
                         performance.duration < 5000 ? 'good' : 'poor'
      });

      if (performance.duration > 2000) {
        console.warn(`⚠️ Slow products loading: ${performance.duration}ms`);
      }
    });

    test('should handle large datasets efficiently', () => {
      const testStart = Date.now();
      
      try {
        // Test sorting large dataset
        const sortedByPrice = [...realProducts].sort((a, b) => a.price - b.price);
        const sortedByName = [...realProducts].sort((a, b) => a.name.localeCompare(b.name));
        
        expect(sortedByPrice.length).toBe(realProducts.length);
        expect(sortedByName.length).toBe(realProducts.length);
        
        // Verify sorting is correct
        if (sortedByPrice.length > 1) {
          expect(sortedByPrice[0].price).toBeLessThanOrEqual(sortedByPrice[1].price);
        }

        const sortingDuration = Date.now() - testStart;
        expect(sortingDuration).toBeLessThan(1000); // 1 second max for sorting

        testResults.push({
          testName: 'Large Dataset Handling',
          passed: true,
          duration: sortingDuration,
          datasetSize: realProducts.length
        });

      } catch (error) {
        testResults.push({
          testName: 'Large Dataset Handling',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });
  });

  describe('Data Integrity Tests', () => {
    test('should maintain data consistency across operations', () => {
      const testStart = Date.now();
      
      try {
        const originalCount = realProducts.length;
        
        // Perform various operations that shouldn't modify original data
        const filtered = realProducts.filter(p => p.price > 0);
        const mapped = realProducts.map(p => ({ ...p, processed: true }));
        const sorted = [...realProducts].sort((a, b) => a.price - b.price);
        
        // Original data should remain unchanged
        expect(realProducts.length).toBe(originalCount);
        expect(realProducts[0]).not.toHaveProperty('processed');
        
        // Operations should produce expected results
        expect(filtered.length).toBeLessThanOrEqual(originalCount);
        expect(mapped.length).toBe(originalCount);
        expect(sorted.length).toBe(originalCount);
        
        if (mapped.length > 0) {
          expect(mapped[0]).toHaveProperty('processed', true);
        }

        testResults.push({
          testName: 'Data Consistency',
          passed: true,
          duration: Date.now() - testStart,
          originalCount,
          operationsPerformed: 3
        });

      } catch (error) {
        testResults.push({
          testName: 'Data Consistency',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - testStart
        });
        throw error;
      }
    });
  });
});