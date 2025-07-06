/**
 * Cart React Hooks - React hooks للعربة
 * Custom hooks for cart operations in React components
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../index';
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setCartLoading,
  setCartError
} from './cartSlice';
import { CartItem, CartOperation, CartQuotationData } from './types';
import { CartService } from './cart.service';
import { CartOperations } from './operations';

/**
 * Hook for cart state management
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cart);

  const cartService = useMemo(() => {
    // Initialize cart service with Apollo client
    // This should be injected from a provider or context
    return new CartService(null as any); // TODO: Inject Apollo client
  }, []);

  const cartOperations = useMemo(() => {
    return new CartOperations(cartService);
  }, [cartService]);

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      await cartService.initialize();
    };
    initializeCart();
  }, [cartService]);

  // Add product to cart
  const addProduct = useCallback(async (product: CartItem) => {
    dispatch(setCartLoading(true));
    try {
      const result = await cartOperations.addProductToCart(product);
      if (result.success) {
        dispatch(addToCart(product));
      } else {
        dispatch(setCartError(result.message));
      }
      return result;
    } catch (error) {
      dispatch(setCartError(error instanceof Error ? error.message : 'Failed to add product'));
      return { success: false, message: 'Failed to add product' };
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch, cartOperations]);

  // Update product quantity
  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    dispatch(setCartLoading(true));
    try {
      const result = await cartOperations.updateProductQuantity(lineId, quantity);
      if (result.success) {
        dispatch(updateCartItem({ lineId, quantity }));
      } else {
        dispatch(setCartError(result.message));
      }
      return result;
    } catch (error) {
      dispatch(setCartError(error instanceof Error ? error.message : 'Failed to update quantity'));
      return { success: false, message: 'Failed to update quantity' };
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch, cartOperations]);

  // Remove product from cart
  const removeProduct = useCallback(async (lineId: string) => {
    dispatch(setCartLoading(true));
    try {
      const result = await cartOperations.removeProductFromCart(lineId);
      if (result.success) {
        dispatch(removeFromCart(lineId));
      } else {
        dispatch(setCartError(result.message));
      }
      return result;
    } catch (error) {
      dispatch(setCartError(error instanceof Error ? error.message : 'Failed to remove product'));
      return { success: false, message: 'Failed to remove product' };
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch, cartOperations]);

  // Clear cart
  const clearCartItems = useCallback(async () => {
    dispatch(setCartLoading(true));
    try {
      const result = await cartOperations.clearCartWithConfirmation();
      if (result.success) {
        dispatch(clearCart());
      } else {
        dispatch(setCartError(result.message));
      }
      return result;
    } catch (error) {
      dispatch(setCartError(error instanceof Error ? error.message : 'Failed to clear cart'));
      return { success: false, message: 'Failed to clear cart' };
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch, cartOperations]);

  // Create quotation
  const createQuotation = useCallback(async (
    customerData: any,
    shippingData: any,
    specialInstructions?: string
  ) => {
    dispatch(setCartLoading(true));
    try {
      const result = await cartOperations.createCompleteQuotation(
        customerData,
        shippingData,
        specialInstructions
      );
      if (!result.success) {
        dispatch(setCartError(result.message));
      }
      return result;
    } catch (error) {
      dispatch(setCartError(error instanceof Error ? error.message : 'Failed to create quotation'));
      return { success: false, message: 'Failed to create quotation' };
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch, cartOperations]);

  // Calculate shipping
  const calculateShipping = useCallback(async (address: any, method: string) => {
    try {
      return await cartOperations.calculateShipping(address, method);
    } catch (error) {
      return { success: false, message: 'Failed to calculate shipping' };
    }
  }, [cartOperations]);

  // Apply discount
  const applyDiscount = useCallback(async (discountCode: string, discountAmount: number) => {
    try {
      return await cartOperations.applyDiscount(discountCode, discountAmount);
    } catch (error) {
      return { success: false, message: 'Failed to apply discount' };
    }
  }, [cartOperations]);

  // Get cart summary
  const cartSummary = useMemo(() => {
    return cartOperations.getCartSummary();
  }, [cartOperations, cartState]);

  // Check if product is in cart
  const isProductInCart = useCallback((productId: string) => {
    return cartService.findCartItem(productId) !== undefined;
  }, [cartService]);

  // Get product quantity in cart
  const getProductQuantity = useCallback((productId: string) => {
    const item = cartService.findCartItem(productId);
    return item ? item.quantity : 0;
  }, [cartService]);

  return {
    // State
    items: cartState.items,
    loading: cartState.loading,
    error: cartState.error,
    total: cartState.total,
    itemCount: cartState.itemCount,
    isEmpty: cartState.items.length === 0,

    // Computed values
    cartSummary,

    // Actions
    addProduct,
    updateQuantity,
    removeProduct,
    clearCart: clearCartItems,
    createQuotation,
    calculateShipping,
    applyDiscount,

    // Utilities
    isProductInCart,
    getProductQuantity,

    // Service access
    cartService,
    cartOperations
  };
};

/**
 * Hook for cart item management
 */
export const useCartItem = (productId: string) => {
  const {
    addProduct,
    updateQuantity,
    removeProduct,
    isProductInCart,
    getProductQuantity
  } = useCart();

  const inCart = isProductInCart(productId);
  const quantity = getProductQuantity(productId);

  const addToCart = useCallback((product: CartItem) => {
    return addProduct(product);
  }, [addProduct]);

  const updateItemQuantity = useCallback((lineId: string, newQuantity: number) => {
    return updateQuantity(lineId, newQuantity);
  }, [updateQuantity]);

  const removeFromCart = useCallback((lineId: string) => {
    return removeProduct(lineId);
  }, [removeProduct]);

  return {
    inCart,
    quantity,
    addToCart,
    updateQuantity: updateItemQuantity,
    removeFromCart
  };
};

/**
 * Hook for cart quotation
 */
export const useCartQuotation = () => {
  const { createQuotation, calculateShipping, applyDiscount, cartSummary } = useCart();

  const createNewQuotation = useCallback(async (
    customerData: any,
    shippingData: any,
    specialInstructions?: string
  ) => {
    return createQuotation(customerData, shippingData, specialInstructions);
  }, [createQuotation]);

  const getShippingCost = useCallback(async (address: any, method: string) => {
    return calculateShipping(address, method);
  }, [calculateShipping]);

  const applyDiscountCode = useCallback(async (code: string, amount: number) => {
    return applyDiscount(code, amount);
  }, [applyDiscount]);

  return {
    createQuotation: createNewQuotation,
    calculateShipping: getShippingCost,
    applyDiscount: applyDiscountCode,
    cartSummary
  };
};

/**
 * Hook for cart persistence
 */
export const useCartPersistence = () => {
  const { cartService } = useCart();

  const saveCartToStorage = useCallback(() => {
    try {
      const cartData = cartService.getCartState();
      localStorage.setItem('cart_backup', JSON.stringify(cartData));
      return { success: true, message: 'Cart saved to storage' };
    } catch (error) {
      return { success: false, message: 'Failed to save cart' };
    }
  }, [cartService]);

  const loadCartFromStorage = useCallback(async () => {
    try {
      const storedData = localStorage.getItem('cart_backup');
      if (storedData) {
        const cartData = JSON.parse(storedData);
        return await cartService.syncCart();
      }
      return { success: false, message: 'No stored cart data found' };
    } catch (error) {
      return { success: false, message: 'Failed to load cart from storage' };
    }
  }, [cartService]);

  const clearStoredCart = useCallback(() => {
    try {
      localStorage.removeItem('cart_backup');
      return { success: true, message: 'Stored cart cleared' };
    } catch (error) {
      return { success: false, message: 'Failed to clear stored cart' };
    }
  }, []);

  return {
    saveCart: saveCartToStorage,
    loadCart: loadCartFromStorage,
    clearStoredCart
  };
};

/**
 * Hook for cart analytics
 */
export const useCartAnalytics = () => {
  const { cartService } = useCart();

  const getCartStatistics = useCallback(() => {
    return cartService.getCartStatistics();
  }, [cartService]);

  const exportCartData = useCallback(() => {
    return cartService.exportCartData();
  }, [cartService]);

  const importCartData = useCallback(async (data: any) => {
    return await cartService.importCartData(data);
  }, [cartService]);

  return {
    getStatistics: getCartStatistics,
    exportData: exportCartData,
    importData: importCartData
  };
};