/**
 * Order GraphQL Queries
 * استعلامات GraphQL للطلبات - جميع الاستعلامات المتعلقة بالطلبات والكوتيشن
 */

import { gql } from "graphql-request";

// ============================================================================
// ORDER LISTING QUERIES
// ============================================================================

export const GET_ORDERS = gql`
  query GetOrders(
    $pageSize: Int
    $currentPage: Int
    $filters: OrderFilterInput
    $sort: OrderSortInput
  ) {
    orders(
      pageSize: $pageSize
      currentPage: $currentPage
      filter: $filters
      sort: $sort
    ) {
      orders {
        id
        name
        partner_id
        date_order
        amount_total
        amount_tax
        amount_untaxed
        state
        payment_state
        delivery_state
        items {
          id
          product_id
          name
          sku
          quantity
          price_unit
          price_subtotal
          price_tax
          price_total
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
        payment_method
        shipping_method
        tracking_number
        notes
        created_at
        updated_at
        confirmation_date
        delivery_date
        quotation_id
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

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: Int!) {
    order(id: $id) {
      id
      name
      partner_id
      date_order
      amount_total
      amount_tax
      amount_untaxed
      state
      payment_state
      delivery_state
      items {
        id
        product_id
        name
        sku
        quantity
        price_unit
        price_subtotal
        price_tax
        price_total
        image {
          url
          alt
        }
        attributes {
          attribute_code
          attribute_value
        }
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
      payment_method
      shipping_method
      tracking_number
      notes
      created_at
      updated_at
      confirmation_date
      delivery_date
      quotation_id
      customer {
        id
        name
        email
        phone
      }
      payments {
        id
        amount
        payment_method
        transaction_id
        state
        created_at
      }
      shipments {
        id
        tracking_number
        carrier
        state
        created_at
        delivery_date
      }
      applied_coupons {
        code
        discount_amount
        discount_type
      }
    }
  }
`;

export const GET_ORDER_BY_NAME = gql`
  query GetOrderByName($name: String!) {
    orders(filter: { name: { eq: $name } }) {
      orders {
        id
        name
        partner_id
        date_order
        amount_total
        state
        payment_state
        delivery_state
        created_at
      }
    }
  }
`;

// ============================================================================
// QUOTATION QUERIES
// ============================================================================

export const GET_QUOTATIONS = gql`
  query GetQuotations(
    $pageSize: Int
    $currentPage: Int
    $filters: QuotationFilterInput
    $sort: QuotationSortInput
  ) {
    quotations(
      pageSize: $pageSize
      currentPage: $currentPage
      filter: $filters
      sort: $sort
    ) {
      quotations {
        id
        name
        partner_id
        date_order
        amount_total
        amount_tax
        amount_untaxed
        state
        items {
          id
          product_id
          name
          sku
          quantity
          price_unit
          price_subtotal
          price_tax
          price_total
        }
        notes
        valid_until
        created_at
        updated_at
        sent_date
        customer {
          id
          name
          email
          phone
        }
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

export const GET_QUOTATION_BY_ID = gql`
  query GetQuotationById($id: Int!) {
    quotation(id: $id) {
      id
      name
      partner_id
      date_order
      amount_total
      amount_tax
      amount_untaxed
      state
      items {
        id
        product_id
        name
        sku
        quantity
        price_unit
        price_subtotal
        price_tax
        price_total
        image {
          url
          alt
        }
        attributes {
          attribute_code
          attribute_value
        }
      }
      notes
      valid_until
      created_at
      updated_at
      sent_date
      customer {
        id
        name
        email
        phone
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

// ============================================================================
// ORDER STATUS QUERIES
// ============================================================================

export const GET_ORDER_STATUS = gql`
  query GetOrderStatus($orderId: Int!) {
    orderStatus(orderId: $orderId) {
      order_id
      state
      payment_state
      delivery_state
      status_history {
        state
        date
        note
        user {
          id
          name
        }
      }
      next_actions {
        action
        label
        description
        is_available
      }
    }
  }
`;

export const GET_ORDER_TRACKING = gql`
  query GetOrderTracking($orderId: Int!) {
    orderTracking(orderId: $orderId) {
      order_id
      tracking_number
      carrier
      status
      estimated_delivery
      tracking_events {
        date
        status
        location
        description
      }
      shipment_details {
        weight
        dimensions
        package_count
      }
    }
  }
`;

// ============================================================================
// PAYMENT QUERIES
// ============================================================================

export const GET_ORDER_PAYMENTS = gql`
  query GetOrderPayments($orderId: Int!) {
    orderPayments(orderId: $orderId) {
      payments {
        id
        order_id
        amount
        payment_method
        transaction_id
        state
        created_at
        processed_at
        refunded_amount
        refunds {
          id
          amount
          reason
          state
          created_at
        }
      }
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentMethods {
      id
      name
      description
      is_available
      fees {
        type
        amount
        currency
      }
      supported_currencies
      processing_time
    }
  }
`;

export const GET_SAVED_PAYMENT_METHODS = gql`
  query GetSavedPaymentMethods {
    savedPaymentMethods {
      id
      name
      type
      last4
      expiry_month
      expiry_year
      is_default
      created_at
    }
  }
`;

// ============================================================================
// SHIPPING QUERIES
// ============================================================================

export const GET_SHIPPING_METHODS = gql`
  query GetShippingMethods($address: AddressInput!) {
    shippingMethods(address: $address) {
      methods {
        id
        name
        description
        price {
          value
          currency
        }
        estimated_days
        is_available
        restrictions {
          max_weight
          max_dimensions
          excluded_countries
          excluded_products
        }
      }
    }
  }
`;

export const GET_SHIPPING_RATES = gql`
  query GetShippingRates($input: ShippingRateInput!) {
    shippingRates(input: $input) {
      rates {
        method_id
        name
        price {
          value
          currency
        }
        estimated_days
        description
      }
    }
  }
`;

export const GET_SHIPPING_TRACKING = gql`
  query GetShippingTracking($trackingNumber: String!, $carrier: String) {
    shippingTracking(trackingNumber: $trackingNumber, carrier: $carrier) {
      tracking_number
      carrier
      status
      estimated_delivery
      events {
        date
        status
        location
        description
      }
    }
  }
`;

// ============================================================================
// COUPON QUERIES
// ============================================================================

export const VALIDATE_COUPON = gql`
  query ValidateCoupon($code: String!, $cartTotal: Float!) {
    validateCoupon(code: $code, cartTotal: $cartTotal) {
      is_valid
      coupon {
        id
        code
        name
        description
        discount_type
        discount_value
        minimum_amount
        maximum_discount
        usage_limit
        used_count
        valid_from
        valid_until
        applicable_products
        applicable_categories
      }
      discount_amount
      message
    }
  }
`;

export const GET_AVAILABLE_COUPONS = gql`
  query GetAvailableCoupons($cartTotal: Float!) {
    availableCoupons(cartTotal: $cartTotal) {
      coupons {
        id
        code
        name
        description
        discount_type
        discount_value
        minimum_amount
        maximum_discount
        valid_until
      }
    }
  }
`;

// ============================================================================
// ORDER ANALYTICS QUERIES
// ============================================================================

export const GET_ORDER_ANALYTICS = gql`
  query GetOrderAnalytics($period: AnalyticsPeriod) {
    orderAnalytics(period: $period) {
      total_orders
      total_revenue {
        value
        currency
      }
      average_order_value {
        value
        currency
      }
      conversion_rate
      top_products {
        product_id
        name
        sku
        quantity_sold
        revenue {
          value
          currency
        }
      }
      order_status_distribution {
        status
        count
        percentage
      }
      revenue_by_period {
        period
        revenue {
          value
          currency
        }
        order_count
      }
    }
  }
`;

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface OrderFilterInput {
  state?: string[];
  payment_state?: string[];
  delivery_state?: string[];
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  customer_id?: number;
  tracking_number?: string;
}

export interface QuotationFilterInput {
  state?: string[];
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  customer_id?: number;
  valid_until?: string;
}

export interface OrderSortInput {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface QuotationSortInput {
  field: string;
  direction: 'ASC' | 'DESC';
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

export interface ShippingRateInput {
  items: ShippingItem[];
  origin_address: AddressInput;
  destination_address: AddressInput;
}

export interface ShippingItem {
  product_id: number;
  quantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export type AnalyticsPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface Order {
  id: number;
  name: string;
  partner_id: number;
  date_order: string;
  amount_total: number;
  amount_tax: number;
  amount_untaxed: number;
  state: string;
  payment_state: string;
  delivery_state: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  shipping_method: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  confirmation_date?: string;
  delivery_date?: string;
  quotation_id?: number;
  customer?: Customer;
  payments?: Payment[];
  shipments?: Shipment[];
  applied_coupons?: AppliedCoupon[];
}

export interface Quotation {
  id: number;
  name: string;
  partner_id: number;
  date_order: string;
  amount_total: number;
  amount_tax: number;
  amount_untaxed: number;
  state: string;
  items: QuotationItem[];
  notes?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
  sent_date?: string;
  customer?: Customer;
  shipping_address?: Address;
  billing_address?: Address;
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  price_unit: number;
  price_subtotal: number;
  price_tax: number;
  price_total: number;
  image?: ProductImage;
  attributes?: ProductAttribute[];
}

export interface QuotationItem {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  price_unit: number;
  price_subtotal: number;
  price_tax: number;
  price_total: number;
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

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  state: string;
  created_at: string;
  processed_at?: string;
  refunded_amount?: number;
  refunds?: Refund[];
}

export interface Refund {
  id: number;
  amount: number;
  reason?: string;
  state: string;
  created_at: string;
}

export interface Shipment {
  id: number;
  tracking_number: string;
  carrier: string;
  state: string;
  created_at: string;
  delivery_date?: string;
}

export interface AppliedCoupon {
  code: string;
  discount_amount: number;
  discount_type: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductAttribute {
  attribute_code: string;
  attribute_value: string;
}

export interface OrdersResponse {
  orders: Order[];
  total_count: number;
  page_info: PageInfo;
}

export interface QuotationsResponse {
  quotations: Quotation[];
  total_count: number;
  page_info: PageInfo;
}

export interface PageInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
}

export interface OrderStatus {
  order_id: number;
  state: string;
  payment_state: string;
  delivery_state: string;
  status_history: StatusHistory[];
  next_actions: NextAction[];
}

export interface StatusHistory {
  state: string;
  date: string;
  note?: string;
  user: {
    id: number;
    name: string;
  };
}

export interface NextAction {
  action: string;
  label: string;
  description: string;
  is_available: boolean;
}

export interface OrderTracking {
  order_id: number;
  tracking_number: string;
  carrier: string;
  status: string;
  estimated_delivery: string;
  tracking_events: TrackingEvent[];
  shipment_details: ShipmentDetails;
}

export interface TrackingEvent {
  date: string;
  status: string;
  location: string;
  description: string;
}

export interface ShipmentDetails {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  package_count: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  is_available: boolean;
  fees: PaymentFee[];
  supported_currencies: string[];
  processing_time: string;
}

export interface PaymentFee {
  type: string;
  amount: number;
  currency: string;
}

export interface SavedPaymentMethod {
  id: number;
  name: string;
  type: string;
  last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: Money;
  estimated_days: number;
  is_available: boolean;
  restrictions: ShippingRestrictions;
}

export interface Money {
  value: number;
  currency: string;
}

export interface ShippingRestrictions {
  max_weight?: number;
  max_dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  excluded_countries?: string[];
  excluded_products?: number[];
}

export interface ShippingRate {
  method_id: string;
  name: string;
  price: Money;
  estimated_days: number;
  description: string;
}

export interface CouponValidation {
  is_valid: boolean;
  coupon: Coupon;
  discount_amount: number;
  message: string;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  minimum_amount: number;
  maximum_discount: number;
  usage_limit: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  applicable_products: number[];
  applicable_categories: number[];
}

export interface OrderAnalytics {
  total_orders: number;
  total_revenue: Money;
  average_order_value: Money;
  conversion_rate: number;
  top_products: TopProduct[];
  order_status_distribution: StatusDistribution[];
  revenue_by_period: RevenuePeriod[];
}

export interface TopProduct {
  product_id: number;
  name: string;
  sku: string;
  quantity_sold: number;
  revenue: Money;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface RevenuePeriod {
  period: string;
  revenue: Money;
  order_count: number;
}