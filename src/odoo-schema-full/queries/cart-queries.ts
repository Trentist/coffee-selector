/**
 * Cart GraphQL Queries
 * استعلامات GraphQL للسلة - جميع الاستعلامات المتعلقة بسلة التسوق
 */

import { gql } from "graphql-request";

// ============================================================================
// CART QUERIES
// ============================================================================

export const GET_CART = gql`
  query GetCart {
    cart {
      id
      customer_id
      items {
        id
        product_id
        name
        sku
        quantity
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
          specialPrice {
            amount {
              value
              currency
            }
          }
        }
        total {
          value
          currency
        }
        image {
          url
          alt
        }
        attributes {
          attribute_code
          attribute_value
          attribute_label
        }
        is_in_stock
        qty_available
        min_qty
        max_qty
        added_at
      }
      totals {
        subtotal {
          value
          currency
        }
        tax {
          value
          currency
        }
        shipping {
          value
          currency
        }
        discount {
          value
          currency
        }
        grand_total {
          value
          currency
        }
      }
      item_count
      created_at
      updated_at
      applied_coupons {
        code
        discount_amount {
          value
          currency
        }
        discount_type
        description
      }
      shipping_address {
        id
        name
        street
        city
        state
        country
        zip
        phone
      }
      billing_address {
        id
        name
        street
        city
        state
        country
        zip
        phone
      }
    }
  }
`;

export const GET_CART_ITEM_COUNT = gql`
  query GetCartItemCount {
    cart {
      item_count
    }
  }
`;

export const GET_CART_TOTALS = gql`
  query GetCartTotals {
    cart {
      totals {
        subtotal {
          value
          currency
        }
        tax {
          value
          currency
        }
        shipping {
          value
          currency
        }
        discount {
          value
          currency
        }
        grand_total {
          value
          currency
        }
      }
      applied_coupons {
        code
        discount_amount {
          value
          currency
        }
        discount_type
        description
      }
    }
  }
`;

// ============================================================================
// GUEST CART QUERIES
// ============================================================================

export const GET_GUEST_CART = gql`
  query GetGuestCart($guestCartId: String!) {
    guestCart(guestCartId: $guestCartId) {
      id
      guest_cart_id
      items {
        id
        product_id
        name
        sku
        quantity
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
          specialPrice {
            amount {
              value
              currency
            }
          }
        }
        total {
          value
          currency
        }
        image {
          url
          alt
        }
        attributes {
          attribute_code
          attribute_value
          attribute_label
        }
        is_in_stock
        qty_available
        min_qty
        max_qty
        added_at
      }
      totals {
        subtotal {
          value
          currency
        }
        tax {
          value
          currency
        }
        shipping {
          value
          currency
        }
        discount {
          value
          currency
        }
        grand_total {
          value
          currency
        }
      }
      item_count
      created_at
      updated_at
    }
  }
`;

// ============================================================================
// CART VALIDATION QUERIES
// ============================================================================

export const VALIDATE_CART = gql`
  query ValidateCart {
    validateCart {
      is_valid
      errors {
        type
        message
        item_id
        product_id
      }
      warnings {
        type
        message
        item_id
        product_id
      }
      updated_items {
        id
        product_id
        name
        quantity
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
        }
        is_in_stock
        qty_available
      }
    }
  }
`;

export const VALIDATE_CART_ITEM = gql`
  query ValidateCartItem($itemId: Int!) {
    validateCartItem(itemId: $itemId) {
      is_valid
      errors {
        type
        message
      }
      warnings {
        type
        message
      }
      item {
        id
        product_id
        name
        quantity
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
        }
        is_in_stock
        qty_available
        min_qty
        max_qty
      }
    }
  }
`;

// ============================================================================
// CART ESTIMATION QUERIES
// ============================================================================

export const ESTIMATE_CART_TOTALS = gql`
  query EstimateCartTotals($input: CartEstimationInput!) {
    estimateCartTotals(input: $input) {
      totals {
        subtotal {
          value
          currency
        }
        tax {
          value
          currency
        }
        shipping {
          value
          currency
        }
        discount {
          value
          currency
        }
        grand_total {
          value
          currency
        }
      }
      available_shipping_methods {
        id
        name
        price {
          value
          currency
        }
        estimated_days
        description
      }
      available_payment_methods {
        id
        name
        description
        is_available
      }
      applied_coupons {
        code
        discount_amount {
          value
          currency
        }
        discount_type
        description
      }
    }
  }
`;

// ============================================================================
// CART HISTORY QUERIES
// ============================================================================

export const GET_CART_HISTORY = gql`
  query GetCartHistory($pageSize: Int, $currentPage: Int) {
    cartHistory(pageSize: $pageSize, currentPage: $currentPage) {
      carts {
        id
        created_at
        item_count
        totals {
          grand_total {
            value
            currency
          }
        }
        status
        converted_to_order
        order_id
      }
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;

// ============================================================================
// CART ANALYTICS QUERIES
// ============================================================================

export const GET_CART_ANALYTICS = gql`
  query GetCartAnalytics($period: AnalyticsPeriod) {
    cartAnalytics(period: $period) {
      total_carts
      abandoned_carts
      conversion_rate
      average_cart_value {
        value
        currency
      }
      top_products {
        product_id
        name
        sku
        quantity_added
        revenue {
          value
          currency
        }
      }
      cart_abandonment_reasons {
        reason
        count
        percentage
      }
    }
  }
`;

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface CartEstimationInput {
  items: CartEstimationItem[];
  shipping_address?: AddressInput;
  billing_address?: AddressInput;
  coupon_codes?: string[];
  shipping_method_id?: string;
  payment_method_id?: string;
}

export interface CartEstimationItem {
  product_id: number;
  quantity: number;
  attributes?: {
    [key: string]: string;
  };
}

export interface AddressInput {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
}

export type AnalyticsPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface Cart {
  id: string;
  customer_id?: number;
  items: CartItem[];
  totals: CartTotals;
  item_count: number;
  created_at: string;
  updated_at: string;
  applied_coupons?: AppliedCoupon[];
  shipping_address?: Address;
  billing_address?: Address;
}

export interface GuestCart {
  id: string;
  guest_cart_id: string;
  items: CartItem[];
  totals: CartTotals;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  price: ProductPrice;
  total: Money;
  image: ProductImage;
  attributes: ProductAttribute[];
  is_in_stock: boolean;
  qty_available?: number;
  min_qty?: number;
  max_qty?: number;
  added_at: string;
}

export interface CartTotals {
  subtotal: Money;
  tax: Money;
  shipping: Money;
  discount: Money;
  grand_total: Money;
}

export interface ProductPrice {
  regularPrice: Money;
  specialPrice?: Money;
}

export interface Money {
  value: number;
  currency: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductAttribute {
  attribute_code: string;
  attribute_value: string;
  attribute_label?: string;
}

export interface AppliedCoupon {
  code: string;
  discount_amount: Money;
  discount_type: string;
  description?: string;
}

export interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
}

export interface CartValidationResult {
  is_valid: boolean;
  errors: CartError[];
  warnings: CartWarning[];
  updated_items?: CartItem[];
}

export interface CartError {
  type: string;
  message: string;
  item_id?: number;
  product_id?: number;
}

export interface CartWarning {
  type: string;
  message: string;
  item_id?: number;
  product_id?: number;
}

export interface CartEstimationResult {
  totals: CartTotals;
  available_shipping_methods: ShippingMethod[];
  available_payment_methods: PaymentMethod[];
  applied_coupons: AppliedCoupon[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: Money;
  estimated_days: number;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  is_available: boolean;
}

export interface CartHistory {
  carts: CartHistoryItem[];
  total_count: number;
  page_info: PageInfo;
}

export interface CartHistoryItem {
  id: string;
  created_at: string;
  item_count: number;
  totals: {
    grand_total: Money;
  };
  status: string;
  converted_to_order: boolean;
  order_id?: number;
}

export interface CartAnalytics {
  total_carts: number;
  abandoned_carts: number;
  conversion_rate: number;
  average_cart_value: Money;
  top_products: TopProduct[];
  cart_abandonment_reasons: AbandonmentReason[];
}

export interface TopProduct {
  product_id: number;
  name: string;
  sku: string;
  quantity_added: number;
  revenue: Money;
}

export interface AbandonmentReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface PageInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
}