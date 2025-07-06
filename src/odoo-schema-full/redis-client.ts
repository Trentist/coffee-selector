/**
 * Redis Client - Coffee Selection Central System
 * عميل Redis - النظام المركزي لكوفي سيليكشن
 */

import { COFFEE_SELECTION_CONFIG, REDIS_SYNC_CONFIG } from "./central-system";

// ============================================================================
// REDIS CLIENT INTERFACE - واجهة عميل Redis
// ============================================================================

interface RedisClient {
	get(key: string): Promise<string | null>;
	set(key: string, value: string, ttl?: number): Promise<void>;
	del(key: string): Promise<void>;
	exists(key: string): Promise<boolean>;
	expire(key: string, ttl: number): Promise<void>;
	publish(channel: string, message: string): Promise<void>;
	subscribe(
		channel: string,
		callback: (message: string) => void,
	): Promise<void>;
	unsubscribe(channel: string): Promise<void>;
}

// ============================================================================
// REDIS CLIENT IMPLEMENTATION - تنفيذ عميل Redis
// ============================================================================

class CoffeeSelectionRedisClient implements RedisClient {
	private client: any;
	private subscribers: Map<string, (message: string) => void> = new Map();
	private isConnected: boolean = false;

	constructor() {
		this.initializeClient();
	}

	/**
	 * Initialize Redis client
	 */
	private async initializeClient() {
		try {
			// In development, use local Redis
			// In production, use Redis Cloud or similar
			const redisUrl = COFFEE_SELECTION_CONFIG.REDIS.URL;

			// For now, we'll use a mock implementation
			// In production, replace with actual Redis client
			this.client = {
				get: async (key: string) => {
					const item = localStorage.getItem(`redis:${key}`);
					if (item) {
						const { value, expiry } = JSON.parse(item);
						if (expiry && Date.now() > expiry) {
							localStorage.removeItem(`redis:${key}`);
							return null;
						}
						return value;
					}
					return null;
				},
				set: async (key: string, value: string, ttl?: number) => {
					const item = {
						value,
						expiry: ttl ? Date.now() + ttl * 1000 : null,
					};
					localStorage.setItem(`redis:${key}`, JSON.stringify(item));
				},
				del: async (key: string) => {
					localStorage.removeItem(`redis:${key}`);
				},
				exists: async (key: string) => {
					return localStorage.getItem(`redis:${key}`) !== null;
				},
				expire: async (key: string, ttl: number) => {
					const item = localStorage.getItem(`redis:${key}`);
					if (item) {
						const { value } = JSON.parse(item);
						const newItem = {
							value,
							expiry: Date.now() + ttl * 1000,
						};
						localStorage.setItem(`redis:${key}`, JSON.stringify(newItem));
					}
				},
				publish: async (channel: string, message: string) => {
					// Simulate publishing to channel
					const callback = this.subscribers.get(channel);
					if (callback) {
						callback(message);
					}
				},
				subscribe: async (
					channel: string,
					callback: (message: string) => void,
				) => {
					this.subscribers.set(channel, callback);
				},
				unsubscribe: async (channel: string) => {
					this.subscribers.delete(channel);
				},
			};

			this.isConnected = true;
			console.log("✅ Redis client initialized successfully");
		} catch (error) {
			console.error("❌ Failed to initialize Redis client:", error);
			this.isConnected = false;
		}
	}

	/**
	 * Get value from cache
	 */
	async get(key: string): Promise<string | null> {
		if (!this.isConnected) return null;

		try {
			const fullKey = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${key}`;
			return await this.client.get(fullKey);
		} catch (error) {
			console.error("Redis get error:", error);
			return null;
		}
	}

	/**
	 * Set value in cache
	 */
	async set(key: string, value: string, ttl?: number): Promise<void> {
		if (!this.isConnected) return;

		try {
			const fullKey = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${key}`;
			await this.client.set(fullKey, value, ttl);
		} catch (error) {
			console.error("Redis set error:", error);
		}
	}

	/**
	 * Delete value from cache
	 */
	async del(key: string): Promise<void> {
		if (!this.isConnected) return;

		try {
			const fullKey = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${key}`;
			await this.client.del(fullKey);
		} catch (error) {
			console.error("Redis del error:", error);
		}
	}

	/**
	 * Check if key exists
	 */
	async exists(key: string): Promise<boolean> {
		if (!this.isConnected) return false;

		try {
			const fullKey = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${key}`;
			return await this.client.exists(fullKey);
		} catch (error) {
			console.error("Redis exists error:", error);
			return false;
		}
	}

	/**
	 * Set expiration for key
	 */
	async expire(key: string, ttl: number): Promise<void> {
		if (!this.isConnected) return;

		try {
			const fullKey = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${key}`;
			await this.client.expire(fullKey, ttl);
		} catch (error) {
			console.error("Redis expire error:", error);
		}
	}

	/**
	 * Publish message to channel
	 */
	async publish(channel: string, message: string): Promise<void> {
		if (!this.isConnected) return;

		try {
			const fullChannel = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${channel}`;
			await this.client.publish(fullChannel, message);
		} catch (error) {
			console.error("Redis publish error:", error);
		}
	}

	/**
	 * Subscribe to channel
	 */
	async subscribe(
		channel: string,
		callback: (message: string) => void,
	): Promise<void> {
		if (!this.isConnected) return;

		try {
			const fullChannel = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${channel}`;
			await this.client.subscribe(fullChannel, callback);
		} catch (error) {
			console.error("Redis subscribe error:", error);
		}
	}

	/**
	 * Unsubscribe from channel
	 */
	async unsubscribe(channel: string): Promise<void> {
		if (!this.isConnected) return;

		try {
			const fullChannel = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${channel}`;
			await this.client.unsubscribe(fullChannel);
		} catch (error) {
			console.error("Redis unsubscribe error:", error);
		}
	}

	/**
	 * Get connection status
	 */
	isClientConnected(): boolean {
		return this.isConnected;
	}

	/**
	 * Clear all cache
	 */
	async clearAllCache(): Promise<void> {
		if (!this.isConnected) return;

		try {
			// Clear all localStorage items with redis prefix
			const keys = Object.keys(localStorage);
			keys.forEach((key) => {
				if (key.startsWith("redis:")) {
					localStorage.removeItem(key);
				}
			});
		} catch (error) {
			console.error("Redis clearAllCache error:", error);
		}
	}
}

// ============================================================================
// CACHE SERVICE - خدمة التخزين المؤقت
// ============================================================================

export class CacheService {
	private redisClient: CoffeeSelectionRedisClient;

	constructor() {
		this.redisClient = new CoffeeSelectionRedisClient();
	}

	/**
	 * Cache products data
	 */
	async cacheProducts(key: string, data: any): Promise<void> {
		const cacheKey = `products:${key}`;
		const cacheValue = JSON.stringify({
			data,
			timestamp: Date.now(),
		});
		await this.redisClient.set(
			cacheKey,
			cacheValue,
			COFFEE_SELECTION_CONFIG.REDIS.TTL.CACHE,
		);
	}

	/**
	 * Get cached products data
	 */
	async getCachedProducts(key: string): Promise<any | null> {
		const cacheKey = `products:${key}`;
		const cached = await this.redisClient.get(cacheKey);
		if (cached) {
			const { data } = JSON.parse(cached);
			return data;
		}
		return null;
	}

	/**
	 * Cache cart data
	 */
	async cacheCart(userId: string, cartData: any): Promise<void> {
		const cacheKey = `cart:${userId}`;
		const cacheValue = JSON.stringify({
			data: cartData,
			timestamp: Date.now(),
		});
		await this.redisClient.set(
			cacheKey,
			cacheValue,
			COFFEE_SELECTION_CONFIG.REDIS.TTL.CART,
		);
	}

	/**
	 * Get cached cart data
	 */
	async getCachedCart(userId: string): Promise<any | null> {
		const cacheKey = `cart:${userId}`;
		const cached = await this.redisClient.get(cacheKey);
		if (cached) {
			const { data } = JSON.parse(cached);
			return data;
		}
		return null;
	}

	/**
	 * Cache user profile data
	 */
	async cacheUserProfile(userId: string, profileData: any): Promise<void> {
		const cacheKey = `user:${userId}`;
		const cacheValue = JSON.stringify({
			data: profileData,
			timestamp: Date.now(),
		});
		await this.redisClient.set(
			cacheKey,
			cacheValue,
			COFFEE_SELECTION_CONFIG.REDIS.TTL.SESSION,
		);
	}

	/**
	 * Get cached user profile data
	 */
	async getCachedUserProfile(userId: string): Promise<any | null> {
		const cacheKey = `user:${userId}`;
		const cached = await this.redisClient.get(cacheKey);
		if (cached) {
			const { data } = JSON.parse(cached);
			return data;
		}
		return null;
	}

	/**
	 * Clear cache by type
	 */
	async clearCacheByType(type: string): Promise<void> {
		const keys = Object.keys(localStorage);
		keys.forEach((key) => {
			if (
				key.startsWith(`redis:${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}:${type}`)
			) {
				localStorage.removeItem(key);
			}
		});
	}

	/**
	 * Clear all cache
	 */
	async clearAllCache(): Promise<void> {
		await this.redisClient.clearAllCache();
	}
}

// ============================================================================
// REALTIME SERVICE - خدمة الوقت الحقيقي
// ============================================================================

export class RealtimeService {
	private redisClient: CoffeeSelectionRedisClient;

	constructor() {
		this.redisClient = new CoffeeSelectionRedisClient();
	}

	/**
	 * Subscribe to orders updates
	 */
	async subscribeToOrders(callback: (orderData: any) => void): Promise<void> {
		await this.redisClient.subscribe(
			COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.ORDERS,
			(message) => {
				try {
					const orderData = JSON.parse(message);
					callback(orderData);
				} catch (error) {
					console.error("Error parsing order message:", error);
				}
			},
		);
	}

	/**
	 * Subscribe to inventory updates
	 */
	async subscribeToInventory(
		callback: (inventoryData: any) => void,
	): Promise<void> {
		await this.redisClient.subscribe(
			COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.INVENTORY,
			(message) => {
				try {
					const inventoryData = JSON.parse(message);
					callback(inventoryData);
				} catch (error) {
					console.error("Error parsing inventory message:", error);
				}
			},
		);
	}

	/**
	 * Subscribe to notifications
	 */
	async subscribeToNotifications(
		callback: (notificationData: any) => void,
	): Promise<void> {
		await this.redisClient.subscribe(
			COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.NOTIFICATIONS,
			(message) => {
				try {
					const notificationData = JSON.parse(message);
					callback(notificationData);
				} catch (error) {
					console.error("Error parsing notification message:", error);
				}
			},
		);
	}

	/**
	 * Publish order update
	 */
	async publishOrderUpdate(orderData: any): Promise<void> {
		const message = JSON.stringify(orderData);
		await this.redisClient.publish(
			COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.ORDERS,
			message,
		);
	}

	/**
	 * Publish inventory update
	 */
	async publishInventoryUpdate(inventoryData: any): Promise<void> {
		const message = JSON.stringify(inventoryData);
		await this.redisClient.publish(
			COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.INVENTORY,
			message,
		);
	}

	/**
	 * Publish notification
	 */
	async publishNotification(notificationData: any): Promise<void> {
		const message = JSON.stringify(notificationData);
		await this.redisClient.publish(
			COFFEE_SELECTION_CONFIG.REALTIME.CHANNELS.NOTIFICATIONS,
			message,
		);
	}

	/**
	 * Unsubscribe from a channel (public method)
	 */
	async unsubscribe(channel: string): Promise<void> {
		await this.redisClient.unsubscribe(channel);
	}
}

// ============================================================================
// EXPORTS - التصدير
// ============================================================================

export const redisClient = new CoffeeSelectionRedisClient();
export const cacheService = new CacheService();
export const realtimeService = new RealtimeService();

export default redisClient;
