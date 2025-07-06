/**
 * Custom Store Hooks
 * Hooks مخصصة للـ Store
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState, AppDispatch } from "../store";

// Typed useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Store utilities
export const useStore = () => {
	const dispatch = useAppDispatch();
	const state = useAppSelector((state) => state);

	return {
		dispatch,
		state,
		// Quick access to common selectors
		user: useAppSelector((state) => state.user),
		cart: useAppSelector((state) => state.cart),
		favorites: useAppSelector((state) => state.favorites),
		notifications: useAppSelector((state) => state.notifications),
		odoo: useAppSelector((state) => state.odoo),
	};
};

// Specific store hooks
export const useUserStore = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user);

	return {
		dispatch,
		user,
		isAuthenticated: user.isAuthenticated,
		currentUser: user.user,
		isLoading: user.isLoading,
		error: user.error,
	};
};

export const useCartStore = () => {
	const dispatch = useAppDispatch();
	const cart = useAppSelector((state) => state.cart);

	return {
		dispatch,
		cart,
		items: cart.items,
		totals: cart.totals,
		itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
		isLoading: cart.isLoading,
		error: cart.error,
	};
};

export const useFavoritesStore = () => {
	const dispatch = useAppDispatch();
	const favorites = useAppSelector((state) => state.favorites);

	return {
		dispatch,
		favorites,
		items: favorites.items,
		count: favorites.items.length,
		isLoading: favorites.isLoading,
		error: favorites.error,
	};
};

export const useNotificationsStore = () => {
	const dispatch = useAppDispatch();
	const notifications = useAppSelector((state) => state.notifications);

	return {
		dispatch,
		notifications: notifications.notifications,
		count: notifications.notifications.length,
		maxNotifications: notifications.maxNotifications,
	};
};

export const useOdooStore = () => {
	const dispatch = useAppDispatch();
	const odoo = useAppSelector((state) => state.odoo);

	return {
		dispatch,
		odoo,
		isConnected: odoo.isConnected,
		connectionStatus: odoo.connectionStatus,
		syncStatus: odoo.syncStatus,
		error: odoo.error,
	};
};
