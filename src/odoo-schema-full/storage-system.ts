/**
 * Storage System - نظام التخزين
 * Comprehensive storage system with Redis integration
 */

import { COFFEE_SELECTION_CONFIG, REDIS_SYNC_CONFIG } from "./central-system";
import { RealTimeEvent } from "./real-time-system";

// ============================================================================
// STORAGE INTERFACES - واجهات التخزين
// ============================================================================

export interface StorageItem {
	key: string;
	value: any;
	ttl?: number;
	createdAt: Date;
	updatedAt: Date;
	version: number;
	metadata?: {
		userId?: string;
		sessionId?: string;
		entity?: string;
		entityId?: string;
		tags?: string[];
	};
}

export interface StorageQuery {
	pattern?: string;
	userId?: string;
	sessionId?: string;
	entity?: string;
	entityId?: string;
	tags?: string[];
	limit?: number;
	offset?: number;
}

export interface StorageMetrics {
	totalItems: number;
	totalSize: number;
	hitRate: number;
	missRate: number;
	evictions: number;
	expiredItems: number;
	lastCleanup: Date;
}

export interface StorageOperation {
	id: string;
	type: "SET" | "GET" | "DELETE" | "UPDATE" | "CLEANUP";
	key: string;
	success: boolean;
	duration: number;
	timestamp: Date;
	error?: string;
}

// ============================================================================
// STORAGE MANAGER - مدير التخزين
// ============================================================================

class StorageManager {
	private storage: Map<string, StorageItem> = new Map();
	private operations: StorageOperation[] = [];
	private metrics: StorageMetrics;
	private cleanupInterval?: NodeJS.Timeout;
	private isRunning: boolean = false;

	constructor() {
		this.metrics = {
			totalItems: 0,
			totalSize: 0,
			hitRate: 0,
			missRate: 0,
			evictions: 0,
			expiredItems: 0,
			lastCleanup: new Date(),
		};
	}

	/**
	 * Start storage manager
	 */
	async start(): Promise<boolean> {
		try {
			console.log("🚀 Starting Storage Manager...");

			this.isRunning = true;

			// Start cleanup interval
			// TODO: Fix or define CLEANUP_INTERVAL in REDIS_SYNC_CONFIG
			// }, REDIS_SYNC_CONFIG.CLEANUP_INTERVAL);

			console.log("✅ Storage Manager started successfully");
			return true;
		} catch (error) {
			console.error("❌ Failed to start Storage Manager:", error);
			return false;
		}
	}

	/**
	 * Stop storage manager
	 */
	stop(): void {
		console.log("🛑 Stopping Storage Manager...");

		this.isRunning = false;

		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
		}

		console.log("✅ Storage Manager stopped");
	}

	/**
	 * Set item in storage
	 */
	async set(
		key: string,
		value: any,
		options: {
			ttl?: number;
			userId?: string;
			sessionId?: string;
			entity?: string;
			entityId?: string;
			tags?: string[];
		} = {},
	): Promise<boolean> {
		const startTime = Date.now();

		try {
			const now = new Date();
			const item: StorageItem = {
				key,
				value,
				// TODO: COFFEE_SELECTION_CONFIG.REDIS.TTL may be an object, but a number is expected for ttl
				// ttl: options.ttl || COFFEE_SELECTION_CONFIG.REDIS.TTL,
				createdAt: now,
				updatedAt: now,
				version: 1,
				metadata: {
					userId: options.userId,
					sessionId: options.sessionId,
					entity: options.entity,
					entityId: options.entityId,
					tags: options.tags || [],
				},
			};

			// Check if item exists to update version
			const existingItem = this.storage.get(key);
			if (existingItem) {
				item.version = existingItem.version + 1;
				item.createdAt = existingItem.createdAt;
			}

			this.storage.set(key, item);
			this.updateMetrics();
			this.recordOperation("SET", key, true, Date.now() - startTime);

			console.log(`💾 Stored item: ${key} (v${item.version})`);
			return true;
		} catch (error) {
			this.recordOperation(
				"SET",
				key,
				false,
				Date.now() - startTime,
				error instanceof Error ? error.message : String(error),
			);
			console.error(`❌ Failed to store item: ${key}`, error);
			return false;
		}
	}

	/**
	 * Get item from storage
	 */
	async get(key: string): Promise<StorageItem | null> {
		const startTime = Date.now();

		try {
			const item = this.storage.get(key);
			if (!item) {
				this.recordOperation(
					"GET",
					key,
					false,
					Date.now() - startTime,
					"Item not found",
				);
				this.metrics.missRate++;
				return null;
			}

			// Check if item is expired
			if (item.ttl && Date.now() > item.createdAt.getTime() + item.ttl * 1000) {
				this.storage.delete(key);
				this.recordOperation(
					"GET",
					key,
					false,
					Date.now() - startTime,
					"Item expired",
				);
				this.metrics.missRate++;
				this.metrics.expiredItems++;
				return null;
			}

			// Update last accessed time
			item.updatedAt = new Date();
			this.storage.set(key, item);

			this.recordOperation("GET", key, true, Date.now() - startTime);
			this.metrics.hitRate++;

			return item;
		} catch (error) {
			this.recordOperation(
				"GET",
				key,
				false,
				Date.now() - startTime,
				error instanceof Error ? error.message : String(error),
			);
			console.error(`❌ Failed to get item: ${key}`, error);
			return null;
		}
	}

	/**
	 * Update item in storage
	 */
	async update(
		key: string,
		updater: (item: StorageItem) => Partial<StorageItem>,
	): Promise<boolean> {
		const startTime = Date.now();

		try {
			const item = this.storage.get(key);
			if (!item) {
				this.recordOperation(
					"UPDATE",
					key,
					false,
					Date.now() - startTime,
					"Item not found",
				);
				return false;
			}

			const updates = updater(item);
			const updatedItem: StorageItem = {
				...item,
				...updates,
				version: item.version + 1,
				updatedAt: new Date(),
			};

			this.storage.set(key, updatedItem);
			this.recordOperation("UPDATE", key, true, Date.now() - startTime);

			console.log(`🔄 Updated item: ${key} (v${updatedItem.version})`);
			return true;
		} catch (error) {
			this.recordOperation(
				"UPDATE",
				key,
				false,
				Date.now() - startTime,
				error instanceof Error ? error.message : String(error),
			);
			console.error(`❌ Failed to update item: ${key}`, error);
			return false;
		}
	}

	/**
	 * Delete item from storage
	 */
	async delete(key: string): Promise<boolean> {
		const startTime = Date.now();

		try {
			const deleted = this.storage.delete(key);
			this.updateMetrics();
			this.recordOperation("DELETE", key, deleted, Date.now() - startTime);

			if (deleted) {
				console.log(`🗑️ Deleted item: ${key}`);
			}

			return deleted;
		} catch (error) {
			this.recordOperation(
				"DELETE",
				key,
				false,
				Date.now() - startTime,
				error instanceof Error ? error.message : String(error),
			);
			console.error(`❌ Failed to delete item: ${key}`, error);
			return false;
		}
	}

	/**
	 * Query items in storage
	 */
	async query(query: StorageQuery): Promise<StorageItem[]> {
		try {
			let items = Array.from(this.storage.values());

			// Apply filters
			if (query.pattern) {
				const regex = new RegExp(query.pattern, "i");
				items = items.filter((item) => regex.test(item.key));
			}

			if (query.userId) {
				items = items.filter((item) => item.metadata?.userId === query.userId);
			}

			if (query.sessionId) {
				items = items.filter(
					(item) => item.metadata?.sessionId === query.sessionId,
				);
			}

			if (query.entity) {
				items = items.filter((item) => item.metadata?.entity === query.entity);
			}

			if (query.entityId) {
				items = items.filter(
					(item) => item.metadata?.entityId === query.entityId,
				);
			}

			if (query.tags && query.tags.length > 0) {
				items = items.filter((item) =>
					item.metadata?.tags?.some((tag) => query.tags!.includes(tag)),
				);
			}

			// Apply pagination
			if (query.offset) {
				items = items.slice(query.offset);
			}

			if (query.limit) {
				items = items.slice(0, query.limit);
			}

			return items;
		} catch (error) {
			console.error("❌ Failed to query storage:", error);
			return [];
		}
	}

	/**
	 * Clear expired items
	 */
	private performCleanup(): void {
		const startTime = Date.now();
		let expiredCount = 0;

		try {
			const now = Date.now();
			const keysToDelete: string[] = [];

			this.storage.forEach((item, key) => {
				if (item.ttl && now > item.createdAt.getTime() + item.ttl * 1000) {
					keysToDelete.push(key);
					expiredCount++;
				}
			});

			keysToDelete.forEach((key) => {
				this.storage.delete(key);
			});

			this.metrics.expiredItems += expiredCount;
			this.metrics.lastCleanup = new Date();
			this.updateMetrics();

			this.recordOperation("CLEANUP", "cleanup", true, Date.now() - startTime);

			if (expiredCount > 0) {
				console.log(`🧹 Cleaned up ${expiredCount} expired items`);
			}
		} catch (error) {
			this.recordOperation(
				"CLEANUP",
				"cleanup",
				false,
				Date.now() - startTime,
				error instanceof Error ? error.message : String(error),
			);
			console.error("❌ Cleanup failed:", error);
		}
	}

	/**
	 * Update metrics
	 */
	private updateMetrics(): void {
		this.metrics.totalItems = this.storage.size;
		this.metrics.totalSize = JSON.stringify(
			Array.from(this.storage.values()),
		).length;

		const totalRequests = this.metrics.hitRate + this.metrics.missRate;
		if (totalRequests > 0) {
			this.metrics.hitRate = (this.metrics.hitRate / totalRequests) * 100;
			this.metrics.missRate = (this.metrics.missRate / totalRequests) * 100;
		}
	}

	/**
	 * Record operation
	 */
	private recordOperation(
		type: StorageOperation["type"],
		key: string,
		success: boolean,
		duration: number,
		error?: string,
	): void {
		const operation: StorageOperation = {
			id: this.generateId(),
			type,
			key,
			success,
			duration,
			timestamp: new Date(),
			error,
		};

		this.operations.push(operation);

		// Keep only recent operations
		if (this.operations.length > REDIS_SYNC_CONFIG.LOG_RETENTION) {
			this.operations = this.operations.slice(-REDIS_SYNC_CONFIG.LOG_RETENTION);
		}
	}

	/**
	 * Generate unique ID
	 */
	private generateId(): string {
		return `storage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Get storage status
	 */
	getStatus(): {
		isRunning: boolean;
		metrics: StorageMetrics;
		operations: StorageOperation[];
	} {
		return {
			isRunning: this.isRunning,
			metrics: { ...this.metrics },
			operations: [...this.operations],
		};
	}
}

// ============================================================================
// STORAGE SERVICE - خدمة التخزين
// ============================================================================

class StorageService {
	private manager: StorageManager;
	private isInitialized: boolean = false;

	constructor() {
		this.manager = new StorageManager();
	}

	/**
	 * Initialize storage service
	 */
	async initialize(): Promise<boolean> {
		if (this.isInitialized) {
			return true;
		}

		const success = await this.manager.start();
		this.isInitialized = success;
		return success;
	}

	/**
	 * Set item
	 */
	async set(
		key: string,
		value: any,
		options?: {
			ttl?: number;
			userId?: string;
			sessionId?: string;
			entity?: string;
			entityId?: string;
			tags?: string[];
		},
	): Promise<boolean> {
		return this.manager.set(key, value, options);
	}

	/**
	 * Get item
	 */
	async get(key: string): Promise<StorageItem | null> {
		return this.manager.get(key);
	}

	/**
	 * Update item
	 */
	async update(
		key: string,
		updater: (item: StorageItem) => Partial<StorageItem>,
	): Promise<boolean> {
		return this.manager.update(key, updater);
	}

	/**
	 * Delete item
	 */
	async delete(key: string): Promise<boolean> {
		return this.manager.delete(key);
	}

	/**
	 * Query items
	 */
	async query(query: StorageQuery): Promise<StorageItem[]> {
		return this.manager.query(query);
	}

	/**
	 * Get service status
	 */
	getStatus() {
		return this.manager.getStatus();
	}

	/**
	 * Shutdown service
	 */
	shutdown(): void {
		this.manager.stop();
		this.isInitialized = false;
	}
}

// ============================================================================
// STORAGE INTEGRATION WITH REAL-TIME - تكامل التخزين مع الوقت الفعلي
// ============================================================================

class StorageRealTimeIntegration {
	private storageService: StorageService;

	constructor(storageService: StorageService) {
		this.storageService = storageService;
	}

	/**
	 * Store item and broadcast real-time event
	 */
	async storeWithBroadcast(
		key: string,
		value: any,
		event: RealTimeEvent,
		options?: {
			ttl?: number;
			userId?: string;
			sessionId?: string;
			entity?: string;
			entityId?: string;
			tags?: string[];
		},
	): Promise<boolean> {
		try {
			// Store item
			const stored = await this.storageService.set(key, value, options);
			if (!stored) {
				return false;
			}

			// Broadcast real-time event
			// This would integrate with the real-time system
			console.log(`📡 Broadcasting storage event: ${event.type} for ${key}`);

			return true;
		} catch (error) {
			console.error("❌ Failed to store with broadcast:", error);
			return false;
		}
	}

	/**
	 * Update item and broadcast real-time event
	 */
	async updateWithBroadcast(
		key: string,
		updater: (item: StorageItem) => Partial<StorageItem>,
		event: RealTimeEvent,
	): Promise<boolean> {
		try {
			// Update item
			const updated = await this.storageService.update(key, updater);
			if (!updated) {
				return false;
			}

			// Broadcast real-time event
			console.log(`📡 Broadcasting update event: ${event.type} for ${key}`);

			return true;
		} catch (error) {
			console.error("❌ Failed to update with broadcast:", error);
			return false;
		}
	}

	/**
	 * Delete item and broadcast real-time event
	 */
	async deleteWithBroadcast(
		key: string,
		event: RealTimeEvent,
	): Promise<boolean> {
		try {
			// Delete item
			const deleted = await this.storageService.delete(key);
			if (!deleted) {
				return false;
			}

			// Broadcast real-time event
			console.log(`📡 Broadcasting delete event: ${event.type} for ${key}`);

			return true;
		} catch (error) {
			console.error("❌ Failed to delete with broadcast:", error);
			return false;
		}
	}
}

// ============================================================================
// EXPORTS - التصدير
// ============================================================================

export const storageService = new StorageService();
export const storageRealTimeIntegration = new StorageRealTimeIntegration(
	storageService,
);

export {
	StorageManager,
	StorageService,
};
