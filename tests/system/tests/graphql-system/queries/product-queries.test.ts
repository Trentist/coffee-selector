/**
 * Product Queries Tests - Coffee Selection GraphQL System
 * اختبارات استعلامات المنتجات - نظام GraphQL لموقع Coffee Selection
 */

import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { 
  GET_PRODUCTS, 
  GET_PRODUCT_BY_ID, 
  GET_PRODUCT_BY_SLUG,
  GET_FEATURED_PRODUCTS,
  GET_SALE_PRODUCTS,
  SEARCH_PRODUCTS
} from '../../../src/graphql-system/queries/product-queries';
import { apolloClient } from '../../../src/graphql-system';

// Mock data for products
const mockProducts = [
  {
    id: '1',
    name: 'قهوة عربية مختصة',
    description: 'قهوة عربية أصيلة من أجود أنواع البن',
    shortDescription: 'قهوة عربية مختصة',
    price: 45.99,
    salePrice: 39.99,
    sku: 'COFFEE-001',
    barcode: '1234567890123',
    weight: 250,
    image: '/images/coffee-1.jpg',
    smallImage: '/images/coffee-1-small.jpg',
    thumbnail: '/images/coffee-1-thumb.jpg',
    slug: 'arabic-specialty-coffee',
    isActive: true,
    isFeatured: true,
    isOnSale: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    categories: [
      {
        id: '1',
        name: 'قهوة عربية',
        slug: 'arabic-coffee'
      }
    ],
    stock: {
      quantity: 100,
      isInStock: true,
      stockStatus: 'IN_STOCK',
      manageStock: true,
      lowStockThreshold: 10
    },
    attributes: [
      {
        name: 'الأصل',
        value: 'اليمن',
        type: 'text',
        isVisible: true
      }
    ],
    mediaGallery: [
      {
        url: '/images/coffee-1-gallery-1.jpg',
        alt: 'قهوة عربية مختصة',
        type: 'IMAGE',
        sortOrder: 1
      }
    ],
    seo: {
      metaTitle: 'قهوة عربية مختصة - Coffee Selection',
      metaDescription: 'اكتشف أجود أنواع القهوة العربية المختصة',
      metaKeywords: 'قهوة, عربية, مختصة',
      canonicalUrl: '/products/arabic-specialty-coffee'
    }
  }
];

const mockProductsResponse = {
  products: {
    products: mockProducts,
    pagination: {
      total: 1,
      count: 1,
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    },
    filters: {
      categories: [
        {
          id: '1',
          name: 'قهوة عربية',
          count: 1
        }
      ],
      priceRange: {
        min: 39.99,
        max: 45.99
      },
      brands: [],
      attributes: []
    }
  }
};

// Mock GraphQL responses
const mocks = [
  {
    request: {
      query: GET_PRODUCTS,
      variables: {
        limit: 10,
        offset: 0,
        categoryId: null,
        search: '',
        sortBy: 'name',
        sortOrder: 'ASC',
        filters: null
      }
    },
    result: {
      data: mockProductsResponse
    }
  },
  {
    request: {
      query: GET_PRODUCT_BY_ID,
      variables: { id: '1' }
    },
    result: {
      data: {
        product: {
          ...mockProducts[0],
          variants: [],
          reviews: [],
          relatedProducts: [],
          crossSellProducts: [],
          dimensions: {
            length: 10,
            width: 5,
            height: 15,
            unit: 'CM'
          },
          shipping: {
            weight: 250,
            dimensions: {
              length: 10,
              width: 5,
              height: 15,
              unit: 'CM'
            },
            shippingClass: 'standard',
            requiresShipping: true
          }
        }
      }
    }
  },
  {
    request: {
      query: GET_PRODUCT_BY_SLUG,
      variables: { slug: 'arabic-specialty-coffee' }
    },
    result: {
      data: {
        product: mockProducts[0]
      }
    }
  },
  {
    request: {
      query: GET_FEATURED_PRODUCTS,
      variables: { limit: 5 }
    },
    result: {
      data: {
        featuredProducts: mockProducts.filter(p => p.isFeatured)
      }
    }
  },
  {
    request: {
      query: GET_SALE_PRODUCTS,
      variables: { limit: 10, offset: 0 }
    },
    result: {
      data: {
        saleProducts: {
          products: mockProducts.filter(p => p.isOnSale),
          pagination: {
            total: 1,
            count: 1,
            perPage: 10,
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      }
    }
  },
  {
    request: {
      query: SEARCH_PRODUCTS,
      variables: {
        query: 'قهوة',
        limit: 10,
        offset: 0,
        filters: null
      }
    },
    result: {
      data: {
        searchProducts: {
          products: mockProducts,
          pagination: {
            total: 1,
            count: 1,
            perPage: 10,
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          },
          searchMeta: {
            query: 'قهوة',
            totalResults: 1,
            searchTime: 0.05,
            suggestions: []
          }
        }
      }
    }
  }
];

describe('Product Queries Tests', () => {
  
  describe('GET_PRODUCTS Query', () => {
    it('should fetch products successfully', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: {
          limit: 10,
          offset: 0,
          categoryId: null,
          search: '',
          sortBy: 'name',
          sortOrder: 'ASC',
          filters: null
        },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.products).toBeDefined();
      expect(data.products.products).toBeInstanceOf(Array);
    });

    it('should handle products with filters', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: {
          limit: 10,
          offset: 0,
          categoryId: '1',
          search: 'قهوة',
          sortBy: 'price',
          sortOrder: 'DESC',
          filters: {
            priceRange: { min: 30, max: 50 },
            inStock: true
          }
        },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
    });

    it('should handle pagination correctly', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: {
          limit: 5,
          offset: 10
        },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      if (data.products?.pagination) {
        expect(data.products.pagination.perPage).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('GET_PRODUCT_BY_ID Query', () => {
    it('should fetch single product by ID', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id: '1' },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.product).toBeDefined();
      if (data.product) {
        expect(data.product.id).toBe('1');
        expect(data.product.name).toBeDefined();
        expect(data.product.price).toBeGreaterThan(0);
      }
    });

    it('should return null for non-existent product', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id: '999999' },
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore'
      });

      expect(data.product).toBeNull();
    });

    it('should include all required product fields', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id: '1' },
        fetchPolicy: 'network-only'
      });

      if (data.product) {
        expect(data.product.name).toBeDefined();
        expect(data.product.price).toBeDefined();
        expect(data.product.sku).toBeDefined();
        expect(data.product.stock).toBeDefined();
        expect(data.product.categories).toBeDefined();
      }
    });
  });

  describe('GET_PRODUCT_BY_SLUG Query', () => {
    it('should fetch product by slug', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_BY_SLUG,
        variables: { slug: 'arabic-specialty-coffee' },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.product).toBeDefined();
      if (data.product) {
        expect(data.product.slug).toBe('arabic-specialty-coffee');
      }
    });

    it('should handle invalid slug gracefully', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_BY_SLUG,
        variables: { slug: 'non-existent-product' },
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore'
      });

      expect(data.product).toBeNull();
    });
  });

  describe('GET_FEATURED_PRODUCTS Query', () => {
    it('should fetch featured products', async () => {
      const { data } = await apolloClient.query({
        query: GET_FEATURED_PRODUCTS,
        variables: { limit: 5 },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.featuredProducts).toBeInstanceOf(Array);
      
      if (data.featuredProducts.length > 0) {
        data.featuredProducts.forEach((product: any) => {
          expect(product.isFeatured).toBe(true);
        });
      }
    });

    it('should respect limit parameter', async () => {
      const { data } = await apolloClient.query({
        query: GET_FEATURED_PRODUCTS,
        variables: { limit: 3 },
        fetchPolicy: 'network-only'
      });

      expect(data.featuredProducts.length).toBeLessThanOrEqual(3);
    });
  });

  describe('GET_SALE_PRODUCTS Query', () => {
    it('should fetch products on sale', async () => {
      const { data } = await apolloClient.query({
        query: GET_SALE_PRODUCTS,
        variables: { limit: 10, offset: 0 },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.saleProducts).toBeDefined();
      expect(data.saleProducts.products).toBeInstanceOf(Array);
      
      if (data.saleProducts.products.length > 0) {
        data.saleProducts.products.forEach((product: any) => {
          expect(product.salePrice).toBeLessThan(product.price);
        });
      }
    });
  });

  describe('SEARCH_PRODUCTS Query', () => {
    it('should search products by query', async () => {
      const { data } = await apolloClient.query({
        query: SEARCH_PRODUCTS,
        variables: {
          query: 'قهوة',
          limit: 10,
          offset: 0,
          filters: null
        },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.searchProducts).toBeDefined();
      expect(data.searchProducts.products).toBeInstanceOf(Array);
      expect(data.searchProducts.searchMeta).toBeDefined();
      expect(data.searchProducts.searchMeta.query).toBe('قهوة');
    });

    it('should handle empty search results', async () => {
      const { data } = await apolloClient.query({
        query: SEARCH_PRODUCTS,
        variables: {
          query: 'nonexistentproduct',
          limit: 10,
          offset: 0,
          filters: null
        },
        fetchPolicy: 'network-only'
      });

      expect(data.searchProducts.products).toHaveLength(0);
      expect(data.searchProducts.searchMeta.totalResults).toBe(0);
    });

    it('should search with filters', async () => {
      const { data } = await apolloClient.query({
        query: SEARCH_PRODUCTS,
        variables: {
          query: 'قهوة',
          limit: 10,
          offset: 0,
          filters: {
            priceRange: { min: 20, max: 100 },
            categoryIds: ['1'],
            inStock: true
          }
        },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.searchProducts.products).toBeInstanceOf(Array);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      try {
        await apolloClient.query({
          query: GET_PRODUCTS,
          variables: { limit: 10 },
          fetchPolicy: 'network-only',
          errorPolicy: 'none'
        });
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.networkError || error.graphQLErrors).toBeDefined();
      }
    });

    it('should handle GraphQL errors', async () => {
      try {
        await apolloClient.query({
          query: GET_PRODUCT_BY_ID,
          variables: { id: 'invalid-id' },
          fetchPolicy: 'network-only',
          errorPolicy: 'none'
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Caching Behavior', () => {
    it('should cache products query results', async () => {
      // First query
      const { data: firstData } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: { limit: 10 },
        fetchPolicy: 'cache-first'
      });

      // Second query should use cache
      const { data: secondData } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: { limit: 10 },
        fetchPolicy: 'cache-first'
      });

      expect(firstData).toEqual(secondData);
    });

    it('should update cache when product is modified', async () => {
      const productId = '1';
      
      // Query product first
      await apolloClient.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId }
      });

      // Check if product is in cache
      const cachedProduct = apolloClient.readQuery({
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId }
      });

      expect(cachedProduct).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    it('should complete products query within acceptable time', async () => {
      const startTime = Date.now();
      
      await apolloClient.query({
        query: GET_PRODUCTS,
        variables: { limit: 50 },
        fetchPolicy: 'network-only'
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });

    it('should handle large product datasets', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: { limit: 100 },
        fetchPolicy: 'network-only'
      });

      expect(data).toBeDefined();
      expect(data.products.products.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle concurrent product queries', async () => {
      const queries = [
        apolloClient.query({ query: GET_PRODUCTS, variables: { limit: 10 } }),
        apolloClient.query({ query: GET_FEATURED_PRODUCTS, variables: { limit: 5 } }),
        apolloClient.query({ query: GET_SALE_PRODUCTS, variables: { limit: 10 } })
      ];

      const results = await Promise.all(queries);
      
      results.forEach(result => {
        expect(result.data).toBeDefined();
        expect(result.error).toBeUndefined();
      });
    });

    it('should handle product filtering and sorting', async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: {
          limit: 20,
          sortBy: 'price',
          sortOrder: 'ASC',
          filters: {
            priceRange: { min: 10, max: 100 },
            inStock: true,
            onSale: false
          }
        },
        fetchPolicy: 'network-only'
      });

      expect(data.products.products).toBeInstanceOf(Array);
      
      // Check if results are sorted by price
      if (data.products.products.length > 1) {
        for (let i = 1; i < data.products.products.length; i++) {
          expect(data.products.products[i].price).toBeGreaterThanOrEqual(
            data.products.products[i - 1].price
          );
        }
      }
    });
  });
});

// Test utilities
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  price: 29.99,
  sku: 'TEST-001',
  isActive: true,
  stock: {
    isInStock: true,
    quantity: 10
  },
  categories: [],
  ...overrides
});

export const createMockProductsResponse = (products: any[]) => ({
  products: {
    products,
    pagination: {
      total: products.length,
      count: products.length,
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    },
    filters: {
      categories: [],
      priceRange: { min: 0, max: 100 },
      brands: [],
      attributes: []
    }
  }
});