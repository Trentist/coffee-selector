"use client";

/**
 * React Hooks - Coffee Selection Central System
 * React Hooks - النظام المركزي لكوفي سيليكشن
 */

import { useState, useEffect, useCallback } from "react";
import { COFFEE_SELECTION_CONFIG } from "../central-system";
import { cacheService, realtimeService } from "../redis-client";

// ============================================================================
// CACHE HOOKS - Hooks الخاصة بالتخزين المؤقت
// ============================================================================

export const useCache = <T>(key: string, initialData?: T) => {
	const [data, setData] = useState<T | null>(initialData || null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { request } = await import("graphql-request");
			const cached = await cacheService.getCachedProducts(key);
			if (cached) {
				setData(cached);
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch cached data",
			);
		} finally {
			setLoading(false);
		}
	}, [key]);

	const setCachedData = useCallback(
		async (newData: T) => {
			try {
				const { request } = await import("graphql-request");
				await cacheService.cacheProducts(key, newData);
				setData(newData);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to cache data");
			}
		},
		[key],
	);

	const clearCache = useCallback(async () => {
		try {
			const { request } = await import("graphql-request");
			await cacheService.clearCacheByType(key);
			setData(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to clear cache");
		}
	}, [key]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		data,
		loading,
		error,
		setCachedData,
		clearCache,
		refetch: fetchData,
	};
};

// ============================================================================
// REALTIME HOOKS - Hooks الخاصة بالوقت الحقيقي
// ============================================================================

export const useRealtimeOrders = (callback?: (orderData: any) => void) => {
	const [orders, setOrders] = useState<any[]>([]);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const handleOrderUpdate = (orderData: any) => {
			setOrders((prev) => {
				const existingIndex = prev.findIndex(
					(order) => order.id === orderData.entityId,
				);
				if (existingIndex >= 0) {
					const updated = [...prev];
					updated[existingIndex] = {
						...updated[existingIndex],
						...orderData.data,
					};
					return updated;
				} else {
					return [...prev, orderData.data];
				}
			});

			if (callback) {
				callback(orderData);
			}
		};

		realtimeService.subscribeToOrders(handleOrderUpdate);
		setConnected(true);

		return () => {
			realtimeService.unsubscribe(
				COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.ORDERS,
			);
			setConnected(false);
		};
	}, [callback]);

	return { orders, connected };
};

export const useRealtimeInventory = (
	callback?: (inventoryData: any) => void,
) => {
	const [inventory, setInventory] = useState<any[]>([]);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const handleInventoryUpdate = (inventoryData: any) => {
			setInventory((prev) => {
				const existingIndex = prev.findIndex(
					(item) => item.id === inventoryData.entityId,
				);
				if (existingIndex >= 0) {
					const updated = [...prev];
					updated[existingIndex] = {
						...updated[existingIndex],
						...inventoryData.data,
					};
					return updated;
				} else {
					return [...prev, inventoryData.data];
				}
			});

			if (callback) {
				callback(inventoryData);
			}
		};

		realtimeService.subscribeToInventory(handleInventoryUpdate);
		setConnected(true);

		return () => {
			realtimeService.unsubscribe(
				COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.INVENTORY,
			);
			setConnected(false);
		};
	}, [callback]);

	return { inventory, connected };
};

export const useRealtimeNotifications = (
	callback?: (notificationData: any) => void,
) => {
	const [notifications, setNotifications] = useState<any[]>([]);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const handleNotification = (notificationData: any) => {
			setNotifications((prev) => [notificationData, ...prev]);

			if (callback) {
				callback(notificationData);
			}
		};

		realtimeService.subscribeToNotifications(handleNotification);
		setConnected(true);

		return () => {
			realtimeService.unsubscribe(
				COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.NOTIFICATIONS,
			);
			setConnected(false);
		};
	}, [callback]);

	return { notifications, connected };
};

// ============================================================================
// PRODUCT HOOKS - Hooks الخاصة بالمنتجات
// ============================================================================

const GET_PRODUCTS_QUERY = `
	query GetProducts($limit: Int, $offset: Int, $categoryId: ID) {
		products(limit: $limit, offset: $offset, categoryId: $categoryId) {
			id
			name
			description
			price
			image
			category {
				id
				name
			}
			inStock
			createdAt
			updatedAt
		}
	}
`;

const GET_PRODUCT_QUERY = `
	query GetProduct($id: ID!) {
		product(id: $id) {
			id
			name
			description
			price
			image
			category {
				id
				name
			}
			inStock
			reviews {
				id
				rating
				comment
				user {
					id
					name
				}
				createdAt
			}
			variants {
				id
				name
				price
				inStock
			}
			createdAt
			updatedAt
		}
	}
`;

const GET_CART_QUERY = `
	query GetCart {
		cart {
			id
			items {
				id
				product {
					id
					name
					price
					image
				}
				quantity
				total
			}
			totals {
				subtotal
				tax
				shipping
				total
			}
			updatedAt
		}
	}
`;

const GET_ORDERS_QUERY = `
	query GetOrders($limit: Int, $offset: Int, $status: String) {
		orders(limit: $limit, offset: $offset, status: $status) {
			id
			number
			status
			total
			items {
				id
				product {
					id
					name
					price
				}
				quantity
				total
			}
			createdAt
			updatedAt
		}
	}
`;

const GET_ORDER_QUERY = `
	query GetOrder($id: ID!) {
		order(id: $id) {
			id
			number
			status
			total
			items {
				id
				product {
					id
					name
					price
					image
				}
				quantity
				total
			}
			shipping {
				address
				method
				tracking
			}
			payment {
				method
				status
				transactionId
			}
			createdAt
			updatedAt
		}
	}
`;

export const useProducts = (variables?: any) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { request } = await import("graphql-request");
			const result = await request(
				COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
				GET_PRODUCTS_QUERY,
				variables,
				{
					Authorization: `Bearer ${COFFEE_SELECTION_CONFIG.ODOO.API_KEY}`,
				},
			);
			setData((result as any).products);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch products");
		} finally {
			setLoading(false);
		}
	}, [variables]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return { data, loading, error, refetch: fetchProducts };
};

export const useProduct = (id: string) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProduct = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		try {
			const { request } = await import("graphql-request");
			const result = await request(
				COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
				GET_PRODUCT_QUERY,
				{ id },
				{
					Authorization: `Bearer ${COFFEE_SELECTION_CONFIG.ODOO.API_KEY}`,
				},
			);
			setData((result as any).product);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch product");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchProduct();
	}, [fetchProduct]);

	return { data, loading, error, refetch: fetchProduct };
};

// ============================================================================
// CART HOOKS - Hooks الخاصة بالعربة
// ============================================================================

export const useCart = () => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCart = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { request } = await import("graphql-request");
			const result = await request(
				COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
				GET_CART_QUERY,
				{},
				{
					Authorization: `Bearer ${COFFEE_SELECTION_CONFIG.ODOO.API_KEY}`,
				},
			);
			setData((result as any).cart);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch cart");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCart();
	}, [fetchCart]);

	return { data, loading, error, refetch: fetchCart };
};

// ============================================================================
// ORDER HOOKS - Hooks الخاصة بالطلبات
// ============================================================================

export const useOrders = (variables?: any) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchOrders = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { request } = await import("graphql-request");
			const result = await request(
				COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
				GET_ORDERS_QUERY,
				variables,
				{
					Authorization: `Bearer ${COFFEE_SELECTION_CONFIG.ODOO.API_KEY}`,
				},
			);
			setData((result as any).orders);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	}, [variables]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	return { data, loading, error, refetch: fetchOrders };
};

export const useOrder = (id: string) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchOrder = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		try {
			const { request } = await import("graphql-request");
			const result = await request(
				COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
				GET_ORDER_QUERY,
				{ id },
				{
					Authorization: `Bearer ${COFFEE_SELECTION_CONFIG.ODOO.API_KEY}`,
				},
			);
			setData((result as any).order);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch order");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchOrder();
	}, [fetchOrder]);

	return { data, loading, error, refetch: fetchOrder };
};

// ============================================================================
// AUTH HOOKS - Hooks الخاصة بالمصادقة
// ============================================================================

export const useAuth = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const checkAuth = () => {
		if (typeof window !== "undefined") {
			const token =
				localStorage.getItem("coffee_selection_token") ||
				sessionStorage.getItem("coffee_selection_token");

			if (token) {
				// Decode JWT token (basic implementation)
				try {
					const payload = JSON.parse(atob(token.split(".")[1]));
					setUser(payload);
				} catch (err) {
					setError("Invalid token");
					setUser(null);
				}
			} else {
				setUser(null);
			}
		}
		setLoading(false);
	};

	const login = useCallback(async (email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const { request } = await import("graphql-request");
			const LOGIN_MUTATION = `
				mutation Login($email: String!, $password: String!) {
					login(email: $email, password: $password) {
						token
						user {
							id
							name
							email
							role
						}
					}
				}
			`;

			const result = await request(
				COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
				LOGIN_MUTATION,
				{ email, password },
			);

			const loginResult = result as any;
			if (loginResult.login?.token) {
				localStorage.setItem("coffee_selection_token", loginResult.login.token);
				setUser(loginResult.login.user);
				return { success: true, user: loginResult.login.user };
			} else {
				throw new Error("Login failed");
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Login failed";
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem("coffee_selection_token");
		sessionStorage.removeItem("coffee_selection_token");
		setUser(null);
	}, []);

	useEffect(() => {
		checkAuth();
	}, []);

	return {
		user,
		loading,
		error,
		login,
		logout,
		isAuthenticated: !!user,
	};
};
