/**
 * Cart Service - خدمة العربة المتكاملة
 * Complete cart operations with Redux store integration
 */

import { ApolloClient, gql } from '@apollo/client';
import { store } from '../index';
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setCartLoading,
  setCartError,
  setCartData
} from './cartSlice';
import { CartItem, CartState, CartOperation } from './types';

// GraphQL Mutations
const CART_MUTATIONS = {
  ADD_MULTIPLE_ITEMS: gql`
    mutation CartAddMultipleItems($products: [CartProductInput!]!) {
      cartAddMultipleItems(products: $products) {
        success
        message
        cart {
          id
          name
          dateOrder
          amountTotal
          currency {
            id
            name
            symbol
          }
          orderLines {
            id
            name
            quantity
            priceUnit
            priceSubtotal
            priceTotal
            product {
              id
              name
              price
              slug
              image
            }
          }
        }
      }
    }
  `,

  UPDATE_MULTIPLE_ITEMS: gql`
    mutation CartUpdateMultipleItems($lines: [CartLineInput!]!) {
      cartUpdateMultipleItems(lines: $lines) {
        success
        message
        cart {
          id
          name
          amountTotal
          orderLines {
            id
            name
            quantity
            priceUnit
            priceSubtotal
            priceTotal
          }
        }
      }
    }
  `,

  REMOVE_MULTIPLE_ITEMS: gql`
    mutation CartRemoveMultipleItems($lineIds: [ID!]!) {
      cartRemoveMultipleItems(lineIds: $lineIds) {
        success
        message
        cart {
          id
          name
          amountTotal
          orderLines {
            id
            name
            quantity
            priceUnit
            priceSubtotal
            priceTotal
          }
        }
      }
    }
  `,

  CLEAR_CART: gql`
    mutation CartClear {
      cartClear {
        success
        message
        cart {
          id
          name
          amountTotal
          orderLines {
            id
          }
        }
      }
    }
  `
};

// GraphQL Queries
const CART_QUERIES = {
  GET_CART: gql`
    query GetCart {
      cart {
        order {
          id
          name
          dateOrder
          partner {
            id
            name
            email
            phone
          }
          orderLines {
            id
            name
            quantity
            priceUnit
            priceSubtotal
            priceTotal
            product {
              id
              name
              price
              slug
              image
              description
            }
          }
          amountUntaxed
          amountTax
          amountDelivery
          amountTotal
          currency {
            id
            name
            symbol
          }
          cartQuantity
          invoiceStatus
          deliveryStatus
        }
      }
    }
  `
};

export class CartService {
  private apolloClient: ApolloClient<any>;
  private isInitialized: boolean = false;

  constructor(apolloClient: ApolloClient<any>) {
    this.apolloClient = apolloClient;
  }

  /**
   * Initialize cart service
   */
  async initialize(): Promise<boolean> {
    try {
      store.dispatch(setCartLoading(true));

      // Load current cart state
      const cartData = await this.getCurrentCart();

      if (cartData.success) {
        store.dispatch(setCartData(cartData.cart));
      }

      this.isInitialized = true;
      store.dispatch(setCartLoading(false));

      return true;
    } catch (error) {
      store.dispatch(setCartError(error instanceof Error ? error.message : 'Cart initialization failed'));
      store.dispatch(setCartLoading(false));
      return false;
    }
  }

  /**
   * Get current cart from server
   */
  async getCurrentCart(): Promise<{ success: boolean; cart?: any; error?: string }> {
    try {
      const result = await this.apolloClient.query({
        query: CART_QUERIES.GET_CART,
        fetchPolicy: 'network-only'
      });

      if (result.data?.cart?.order) {
        return { success: true, cart: result.data.cart.order };
      } else {
        return { success: false, error: 'No cart found' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cart'
      };
    }
  }

  /**
   * Add items to cart
   */
  async addToCart(items: CartItem[]): Promise<CartOperation> {
    try {
      store.dispatch(setCartLoading(true));
      store.dispatch(setCartError(null));

      const products = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const result = await this.apolloClient.mutate({
        mutation: CART_MUTATIONS.ADD_MULTIPLE_ITEMS,
        variables: { products }
      });

      if (result.data?.cartAddMultipleItems?.success) {
        const cartData = result.data.cartAddMultipleItems.cart;

        // Update Redux store
        store.dispatch(setCartData(cartData));

        // Add items to local state for immediate UI update
        items.forEach(item => {
          store.dispatch(addToCart(item));
        });

        store.dispatch(setCartLoading(false));

        return {
          success: true,
          message: result.data.cartAddMultipleItems.message || 'Items added successfully',
          cart: cartData
        };
      } else {
        const error = result.data?.cartAddMultipleItems?.message || 'Failed to add items';
        store.dispatch(setCartError(error));
        store.dispatch(setCartLoading(false));

        return {
          success: false,
          message: error
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add items to cart';
      store.dispatch(setCartError(errorMessage));
      store.dispatch(setCartLoading(false));

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Update cart items
   */
  async updateCartItems(items: { lineId: string; quantity: number }[]): Promise<CartOperation> {
    try {
      store.dispatch(setCartLoading(true));
      store.dispatch(setCartError(null));

      const lines = items.map(item => ({
        lineId: item.lineId,
        quantity: item.quantity
      }));

      const result = await this.apolloClient.mutate({
        mutation: CART_MUTATIONS.UPDATE_MULTIPLE_ITEMS,
        variables: { lines }
      });

      if (result.data?.cartUpdateMultipleItems?.success) {
        const cartData = result.data.cartUpdateMultipleItems.cart;

        // Update Redux store
        store.dispatch(setCartData(cartData));

        // Update local state
        items.forEach(item => {
          store.dispatch(updateCartItem({
            lineId: item.lineId,
            quantity: item.quantity
          }));
        });

        store.dispatch(setCartLoading(false));

        return {
          success: true,
          message: result.data.cartUpdateMultipleItems.message || 'Items updated successfully',
          cart: cartData
        };
      } else {
        const error = result.data?.cartUpdateMultipleItems?.message || 'Failed to update items';
        store.dispatch(setCartError(error));
        store.dispatch(setCartLoading(false));

        return {
          success: false,
          message: error
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart items';
      store.dispatch(setCartError(errorMessage));
      store.dispatch(setCartLoading(false));

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Remove items from cart
   */
  async removeFromCart(lineIds: string[]): Promise<CartOperation> {
    try {
      store.dispatch(setCartLoading(true));
      store.dispatch(setCartError(null));

      const result = await this.apolloClient.mutate({
        mutation: CART_MUTATIONS.REMOVE_MULTIPLE_ITEMS,
        variables: { lineIds }
      });

      if (result.data?.cartRemoveMultipleItems?.success) {
        const cartData = result.data.cartRemoveMultipleItems.cart;

        // Update Redux store
        store.dispatch(setCartData(cartData));

        // Remove from local state
        lineIds.forEach(lineId => {
          store.dispatch(removeFromCart(lineId));
        });

        store.dispatch(setCartLoading(false));

        return {
          success: true,
          message: result.data.cartRemoveMultipleItems.message || 'Items removed successfully',
          cart: cartData
        };
      } else {
        const error = result.data?.cartRemoveMultipleItems?.message || 'Failed to remove items';
        store.dispatch(setCartError(error));
        store.dispatch(setCartLoading(false));

        return {
          success: false,
          message: error
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove items from cart';
      store.dispatch(setCartError(errorMessage));
      store.dispatch(setCartLoading(false));

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<CartOperation> {
    try {
      store.dispatch(setCartLoading(true));
      store.dispatch(setCartError(null));

      const result = await this.apolloClient.mutate({
        mutation: CART_MUTATIONS.CLEAR_CART
      });

      if (result.data?.cartClear?.success) {
        const cartData = result.data.cartClear.cart;

        // Update Redux store
        store.dispatch(setCartData(cartData));

        // Clear local state
        store.dispatch(clearCart());

        store.dispatch(setCartLoading(false));

        return {
          success: true,
          message: result.data.cartClear.message || 'Cart cleared successfully',
          cart: cartData
        };
      } else {
        const error = result.data?.cartClear?.message || 'Failed to clear cart';
        store.dispatch(setCartError(error));
        store.dispatch(setCartLoading(false));

        return {
          success: false,
          message: error
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      store.dispatch(setCartError(errorMessage));
      store.dispatch(setCartLoading(false));

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get cart state from Redux store
   */
  getCartState(): CartState {
    return store.getState().cart;
  }

  /**
   * Check if cart is empty
   */
  isCartEmpty(): boolean {
    const state = this.getCartState();
    return state.items.length === 0;
  }

  /**
   * Get cart total
   */
  getCartTotal(): number {
    const state = this.getCartState();
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Get cart item count
   */
  getCartItemCount(): number {
    const state = this.getCartState();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Find item in cart by product ID
   */
  findCartItem(productId: string): CartItem | undefined {
    const state = this.getCartState();
    return state.items.find(item => item.productId === productId);
  }

  /**
   * Sync cart with server
   */
  async syncCart(): Promise<boolean> {
    try {
      const cartData = await this.getCurrentCart();

      if (cartData.success && cartData.cart) {
        store.dispatch(setCartData(cartData.cart));
        return true;
      } else {
        // If no server cart, clear local cart
        store.dispatch(clearCart());
        return false;
      }
    } catch (error) {
      store.dispatch(setCartError(error instanceof Error ? error.message : 'Failed to sync cart'));
      return false;
    }
  }

  /**
   * Create quotation from cart
   */
  async createQuotation(customerData: any, shippingData: any): Promise<CartOperation> {
    try {
      store.dispatch(setCartLoading(true));
      store.dispatch(setCartError(null));

      const cartState = this.getCartState();

      if (this.isCartEmpty()) {
        store.dispatch(setCartLoading(false));
        return {
          success: false,
          message: 'Cannot create quotation from empty cart'
        };
      }

      // Create quotation data
      const quotationData = {
        id: `QUOTE-${Date.now()}`,
        date: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        customer: customerData,
        addresses: {
          shipping: shippingData,
          billing: shippingData
        },
        items: cartState.items.map((item, index) => ({
          id: index + 1,
          productName: item.name,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        financial: {
          subtotal: this.getCartTotal(),
          tax: this.getCartTotal() * 0.05, // 5% VAT
          shipping: 28.574, // Standard shipping
          total: this.getCartTotal() * 1.05 + 28.574,
          currency: 'AED'
        },
        metadata: {
          source: 'cart-service',
          generatedAt: new Date().toISOString(),
          cartId: cartState.cartId || 'local'
        }
      };

      store.dispatch(setCartLoading(false));

      return {
        success: true,
        message: 'Quotation created successfully',
        quotation: quotationData
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create quotation';
      store.dispatch(setCartError(errorMessage));
      store.dispatch(setCartLoading(false));

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Validate cart operations
   */
  validateCartOperation(operation: 'add' | 'update' | 'remove', data: any): boolean {
    switch (operation) {
      case 'add':
        return data && data.productId && data.quantity > 0 && data.price > 0;
      case 'update':
        return data && data.lineId && data.quantity > 0;
      case 'remove':
        return data && Array.isArray(data) && data.length > 0;
      default:
        return false;
    }
  }

  /**
   * Get cart statistics
   */
  getCartStatistics() {
    const state = this.getCartState();
    const total = this.getCartTotal();
    const itemCount = this.getCartItemCount();
    const uniqueItems = state.items.length;

    return {
      total,
      itemCount,
      uniqueItems,
      averageItemPrice: uniqueItems > 0 ? total / uniqueItems : 0,
      isEmpty: this.isCartEmpty(),
      isLoading: state.loading,
      hasError: !!state.error
    };
  }
}

export default CartService;