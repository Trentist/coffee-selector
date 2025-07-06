/**
 * GraphQL Mutations Index
 * ملف التصدير الرئيسي لجميع الطفرات
 */

// ============================================================================
// AUTHENTICATION MUTATIONS
// ============================================================================

export * from "./auth-mutations";

// ============================================================================
// PRODUCT MUTATIONS
// ============================================================================

export * from "./product-mutations";

// ============================================================================
// ORDER MUTATIONS
// ============================================================================

export * from "./order-mutations";

// ============================================================================
// CUSTOMER MUTATIONS
// ============================================================================

export * from "./customer-mutations";

// ============================================================================
// MUTATION TYPES SUMMARY
// ============================================================================

/**
 * All available GraphQL mutations organized by category
 * جميع الطفرات المتاحة منظمة حسب الفئة
 */

export const MUTATION_CATEGORIES = {
	// Authentication & User Management
	AUTH: [
		"LOGIN_MUTATION",
		"LOGIN_WITH_2FA_MUTATION",
		"REGISTER_MUTATION",
		"VERIFY_EMAIL_MUTATION",
		"RESEND_VERIFICATION_MUTATION",
		"RESET_PASSWORD_MUTATION",
		"RESET_PASSWORD_WITH_TOKEN_MUTATION",
		"CHANGE_PASSWORD_MUTATION",
		"UPDATE_PROFILE_MUTATION",
		"DELETE_ACCOUNT_MUTATION",
		"REFRESH_TOKEN_MUTATION",
		"REVOKE_TOKEN_MUTATION",
		"LOGOUT_MUTATION",
		"ENABLE_2FA_MUTATION",
		"VERIFY_2FA_MUTATION",
		"DISABLE_2FA_MUTATION",
		"LINK_SOCIAL_ACCOUNT_MUTATION",
		"UNLINK_SOCIAL_ACCOUNT_MUTATION",
		"NEWSLETTER_SUBSCRIBE_MUTATION",
	],

	// Product & Shopping Management
	PRODUCT: [
		"ADD_TO_CART_MUTATION",
		"UPDATE_CART_ITEM_MUTATION",
		"REMOVE_FROM_CART_MUTATION",
		"CLEAR_CART_MUTATION",
		"MERGE_GUEST_CART_MUTATION",
		"ADD_TO_WISHLIST_MUTATION",
		"REMOVE_FROM_WISHLIST_MUTATION",
		"CLEAR_WISHLIST_MUTATION",
		"MOVE_TO_CART_MUTATION",
		"ADD_PRODUCT_REVIEW_MUTATION",
		"UPDATE_PRODUCT_REVIEW_MUTATION",
		"DELETE_PRODUCT_REVIEW_MUTATION",
		"SHARE_PRODUCT_MUTATION",
		"ADD_TO_COMPARE_MUTATION",
		"REMOVE_FROM_COMPARE_MUTATION",
		"CLEAR_COMPARE_MUTATION",
		"SUBSCRIBE_PRODUCT_NOTIFICATION_MUTATION",
		"UNSUBSCRIBE_PRODUCT_NOTIFICATION_MUTATION",
	],

	// Order & Quotation Management
	ORDER: [
		"CREATE_QUOTATION_MUTATION",
		"UPDATE_QUOTATION_MUTATION",
		"SEND_QUOTATION_MUTATION",
		"CONVERT_QUOTATION_TO_ORDER_MUTATION",
		"CANCEL_QUOTATION_MUTATION",
		"CREATE_ORDER_MUTATION",
		"UPDATE_ORDER_MUTATION",
		"CONFIRM_ORDER_MUTATION",
		"CANCEL_ORDER_MUTATION",
		"VALIDATE_ORDER_MUTATION",
		"ADD_ORDER_ITEM_MUTATION",
		"UPDATE_ORDER_ITEM_MUTATION",
		"REMOVE_ORDER_ITEM_MUTATION",
		"PROCESS_PAYMENT_MUTATION",
		"REFUND_PAYMENT_MUTATION",
		"SAVE_PAYMENT_METHOD_MUTATION",
		"DELETE_PAYMENT_METHOD_MUTATION",
		"CREATE_SHIPPING_LABEL_MUTATION",
		"UPDATE_SHIPPING_STATUS_MUTATION",
		"APPLY_COUPON_MUTATION",
		"REMOVE_COUPON_MUTATION",
	],

	// Customer & Address Management
	CUSTOMER: [
		"CREATE_CUSTOMER_MUTATION",
		"UPDATE_CUSTOMER_MUTATION",
		"DEACTIVATE_CUSTOMER_MUTATION",
		"REACTIVATE_CUSTOMER_MUTATION",
		"ADD_CUSTOMER_ADDRESS_MUTATION",
		"UPDATE_CUSTOMER_ADDRESS_MUTATION",
		"DELETE_CUSTOMER_ADDRESS_MUTATION",
		"SET_DEFAULT_SHIPPING_ADDRESS_MUTATION",
		"SET_DEFAULT_BILLING_ADDRESS_MUTATION",
		"CREATE_GUEST_CUSTOMER_MUTATION",
		"CONVERT_GUEST_TO_REGISTERED_MUTATION",
		"UPDATE_CUSTOMER_PREFERENCES_MUTATION",
		"SUBSCRIBE_NEWSLETTER_MUTATION",
		"UPDATE_MARKETING_PREFERENCES_MUTATION",
		"ADD_CUSTOMER_NOTE_MUTATION",
		"UPDATE_CUSTOMER_NOTE_MUTATION",
		"DELETE_CUSTOMER_NOTE_MUTATION",
		"ADD_CUSTOMER_TAG_MUTATION",
		"REMOVE_CUSTOMER_TAG_MUTATION",
		"UPDATE_CUSTOMER_CREDIT_LIMIT_MUTATION",
	],
} as const;

/**
 * Mutation usage examples
 * أمثلة على استخدام الطفرات
 */

export const MUTATION_EXAMPLES = {
	// Login example
	LOGIN: `
    const { login } = useMutation(LOGIN_MUTATION);
    const result = await login({
      email: "user@example.com",
      password: "password123"
    });
  `,

	// Add to cart example
	ADD_TO_CART: `
    const { addToCart } = useMutation(ADD_TO_CART_MUTATION);
    const result = await addToCart({
      input: {
        productId: 123,
        quantity: 2
      }
    });
  `,

	// Create order example
	CREATE_ORDER: `
    const { createOrder } = useMutation(CREATE_ORDER_MUTATION);
    const result = await createOrder({
      input: {
        partner_id: 456,
        items: [{ product_id: 123, quantity: 1 }],
        shipping_address: { /* address details */ },
        billing_address: { /* address details */ },
        payment_method: "credit_card"
      }
    });
  `,

	// Create customer example
	CREATE_CUSTOMER: `
    const { createCustomer } = useMutation(CREATE_CUSTOMER_MUTATION);
    const result = await createCustomer({
      input: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890"
      }
    });
  `,
} as const;
