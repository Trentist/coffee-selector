/**
 * TypeScript Types Index
 * ملف التصدير الرئيسي لجميع أنواع البيانات
 */

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export * from "./product-types";

// ============================================================================
// ORDER TYPES
// ============================================================================

export type {
	Order,
	OrderState,
	PaymentState,
	DeliveryState,
	OrderPriority,
	OrderSource,
	OrderChannel,
	OrderItem,
	Address,
	Customer,
	PaymentTerms,
	CustomerTag,
	CustomerPreferences,
	Quotation,
	QuotationState,
	QuotationItem,
	QuotationTag,
	Payment,
	PaymentDetails,
	PaymentFee,
	GatewayResponse,
	RiskLevel,
	Refund,
	RefundState,
	PaymentMethod,
	PaymentMethodFee,
	SavedPaymentMethod,
	SavedPaymentMethodDetails,
	Shipment,
	ShipmentState,
	ShipmentItem,
	PackageDetails,
	TrackingEvent,
	ShippingMethod,
	ShippingRestrictions,
	ShippingFeature,
	ShippingCarrier,
	ShippingRate,
	Coupon,
	DiscountType,
	AppliedCoupon,
	CouponValidation,
	CouponValidationError,
	OrderStatus,
	StatusHistory,
	StatusUser,
	NextAction,
	RiskAssessment,
	RiskFactor,
	RiskRecommendation,
	OrderAnalytics,
	TopProduct,
	StatusDistribution,
	RevenuePeriod,
	CustomerSegment,
	PaymentMethodAnalytics,
	ShippingMethodAnalytics,
	OrderTag,
	OrderApiResponse,
	OrdersApiResponse,
	QuotationApiResponse,
	QuotationsApiResponse,
	PaymentApiResponse,
	ShipmentApiResponse,
	OrderStatusApiResponse,
	OrderAnalyticsApiResponse,
} from "./order-types";

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

// ============================================================================
// CART TYPES
// ============================================================================

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

// ============================================================================
// SHIPPING TYPES
// ============================================================================

// ============================================================================
// PAYMENT TYPES
// ============================================================================

// ============================================================================
// COUPON TYPES
// ============================================================================

// ============================================================================
// INVENTORY TYPES
// ============================================================================

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

// ============================================================================
// COMMON TYPES
// ============================================================================

// ============================================================================
// TYPE CATEGORIES SUMMARY
// ============================================================================

/**
 * All available TypeScript types organized by category
 * جميع أنواع TypeScript المتاحة منظمة حسب الفئة
 */

export const TYPE_CATEGORIES = {
	// Product Management
	PRODUCT: [
		"Product",
		"ProductPrice",
		"Money",
		"BulkPricing",
		"ProductImage",
		"ProductDescription",
		"ProductCategory",
		"StockStatus",
		"ProductDimensions",
		"ProductAttribute",
		"AttributeType",
		"ProductReview",
		"ReviewUser",
		"ReviewImage",
		"HelpfulVote",
		"ReviewSummary",
		"RatingDistribution",
		"ProductVariant",
		"ProductConfigurableOption",
		"ConfigurableOptionValue",
		"ProductFilter",
		"FilterType",
		"FilterValue",
		"ProductFilterInput",
		"PriceRange",
		"AttributeFilter",
		"SortField",
		"SortDirection",
		"ProductSearchInput",
		"ProductSearchResult",
		"SearchFacet",
		"FacetValue",
		"ProductSuggestion",
		"CompareList",
		"CompareItem",
		"ComparisonMatrix",
		"ComparisonAttribute",
		"ComparisonAttributeValue",
		"ComparisonDifference",
		"AttributeDifference",
		"ProductRecommendation",
		"RecommendationReason",
		"RecommendationEngine",
		"RecommendationType",
		"PerformanceMetrics",
		"ProductInventory",
		"WarehouseLocation",
		"StockMovement",
		"MovementType",
		"ProductAnalytics",
		"AnalyticsPeriod",
		"ProductPerformance",
		"ProductMetrics",
		"ProductTrends",
		"TrendData",
		"ForecastData",
		"ProductComparisons",
		"CompetitorComparison",
		"FeatureComparison",
		"MarketPosition",
	],

	// Order Management
	ORDER: [
		"Order",
		"OrderState",
		"PaymentState",
		"DeliveryState",
		"OrderPriority",
		"OrderSource",
		"OrderChannel",
		"OrderItem",
		"Address",
		"Customer",
		"PaymentTerms",
		"CustomerTag",
		"CustomerPreferences",
		"Quotation",
		"QuotationState",
		"QuotationItem",
		"QuotationTag",
		"Payment",
		"PaymentDetails",
		"PaymentFee",
		"GatewayResponse",
		"RiskLevel",
		"Refund",
		"RefundState",
		"PaymentMethod",
		"PaymentMethodFee",
		"SavedPaymentMethod",
		"SavedPaymentMethodDetails",
		"Shipment",
		"ShipmentState",
		"ShipmentItem",
		"PackageDetails",
		"TrackingEvent",
		"ShippingMethod",
		"ShippingRestrictions",
		"ShippingFeature",
		"ShippingCarrier",
		"ShippingRate",
		"Coupon",
		"DiscountType",
		"AppliedCoupon",
		"CouponValidation",
		"CouponValidationError",
		"OrderStatus",
		"StatusHistory",
		"StatusUser",
		"NextAction",
		"RiskAssessment",
		"RiskFactor",
		"RiskRecommendation",
		"OrderAnalytics",
		"TopProduct",
		"StatusDistribution",
		"RevenuePeriod",
		"CustomerSegment",
		"PaymentMethodAnalytics",
		"ShippingMethodAnalytics",
	],

	// Common Types
	COMMON: [
		"PageInfo",
		"ApiResponse",
		"ProductApiResponse",
		"ProductsApiResponse",
		"ProductSearchApiResponse",
		"CompareListApiResponse",
		"ProductInventoryApiResponse",
		"ProductAnalyticsApiResponse",
		"OrderApiResponse",
		"OrdersApiResponse",
		"QuotationApiResponse",
		"QuotationsApiResponse",
		"PaymentApiResponse",
		"ShipmentApiResponse",
		"OrderStatusApiResponse",
		"OrderAnalyticsApiResponse",
	],
} as const;

/**
 * Type usage examples
 * أمثلة على استخدام الأنواع
 */

export const TYPE_EXAMPLES = {
	// Product example
	PRODUCT: `
    const product: Product = {
      id: 1,
      name: "Coffee Beans",
      sku: "COFFEE-001",
      url_key: "coffee-beans",
      price: {
        regularPrice: { value: 25.99, currency: "USD" },
        specialPrice: { value: 19.99, currency: "USD" }
      },
      image: { url: "/images/coffee.jpg", alt: "Coffee Beans" },
      description: { html: "<p>Premium coffee beans</p>" },
      short_description: { html: "<p>High quality coffee</p>" },
      categories: [{ id: 1, name: "Coffee", url_path: "coffee" }],
      stock_status: "IN_STOCK",
      attributes: [
        { attribute_code: "color", attribute_value: "Brown" }
      ],
      is_in_stock: true,
      qty_available: 100,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    };
  `,

	// Order example
	ORDER: `
    const order: Order = {
      id: 1,
      name: "SO001",
      partner_id: 1,
      date_order: "2024-01-01T00:00:00Z",
      amount_total: 25.99,
      amount_tax: 2.60,
      amount_untaxed: 23.39,
      state: "SALE",
      payment_state: "PAID",
      delivery_state: "DELIVERED",
      items: [{
        id: 1,
        product_id: 1,
        name: "Coffee Beans",
        sku: "COFFEE-001",
        quantity: 1,
        price_unit: 25.99,
        price_subtotal: 25.99,
        price_tax: 2.60,
        price_total: 28.59,
        is_delivered: true,
        delivered_quantity: 1
      }],
      shipping_address: {
        id: 1,
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        country: "US",
        zip: "10001",
        phone: "+1234567890"
      },
      billing_address: {
        id: 1,
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        country: "US",
        zip: "10001",
        phone: "+1234567890"
      },
      payment_method: "credit_card",
      shipping_method: "standard",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    };
  `,

	// Customer example
	CUSTOMER: `
    const customer: Customer = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      is_company: false,
      preferences: {
        language: "en",
        currency: "USD",
        timezone: "America/New_York",
        newsletter_subscription: true,
        marketing_emails: false,
        sms_notifications: true
      }
    };
  `,

	// Cart example
	CART: `
    const cart: Cart = {
      id: "cart_123",
      customer_id: 1,
      items: [{
        id: 1,
        product_id: 1,
        name: "Coffee Beans",
        sku: "COFFEE-001",
        quantity: 2,
        price: {
          regularPrice: { value: 25.99, currency: "USD" }
        },
        total: { value: 51.98, currency: "USD" },
        image: { url: "/images/coffee.jpg", alt: "Coffee Beans" },
        attributes: [],
        is_in_stock: true,
        added_at: "2024-01-01T00:00:00Z"
      }],
      totals: {
        subtotal: { value: 51.98, currency: "USD" },
        tax: { value: 5.20, currency: "USD" },
        shipping: { value: 5.99, currency: "USD" },
        discount: { value: 0, currency: "USD" },
        grand_total: { value: 63.17, currency: "USD" }
      },
      item_count: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    };
  `,
} as const;
