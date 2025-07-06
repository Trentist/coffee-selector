"use client"
/**
 * Sync Manager - Coffee Selection Central System
 * مدير المزامنة - النظام المركزي لكوفي سيليكشن
 */

import { COFFEE_SELECTION_CONFIG, REDIS_SYNC_CONFIG } from "./central-system";
import { apolloClient, ApolloClientUtils } from "./apollo-client";
import { cacheService, realtimeService } from "./redis-client";

// ============================================================================
// SYNC INTERFACES - واجهات المزامنة
// ============================================================================

interface SyncOperation {
	id: string;
	type: "CREATE" | "UPDATE" | "DELETE" | "SYNC";
	entity: "PRODUCT" | "ORDER" | "CUSTOMER" | "CART";
	entityId: string;
	data?: any;
	timestamp: Date;
	status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
	retries: number;
	error?: string;
}

interface SyncStatus {
	isConnected: boolean;
	isSyncing: boolean;
	lastSyncTime: Date;
	queuedOperations: number;
	completedOperations: number;
	failedOperations: number;
	totalOperations: number;
	successRate: number;
	lastError?: string;
}

interface SyncMetrics {
	totalOperations: number;
	successfulOperations: number;
	failedOperations: number;
	averageSyncTime: number;
	lastSyncDuration: number;
	queueSize: number;
	errorRate: number;
}

interface SyncLog {
	id: string;
	timestamp: Date;
	level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
	message: string;
	operationId?: string;
	details?: any;
}

// ============================================================================
// SYNC MANAGER - مدير المزامنة
// ============================================================================

export class SyncManager {
	private isConnected: boolean = false;
	private isSyncing: boolean = false;
	private syncInterval?: NodeJS.Timeout;
	private healthCheckInterval?: NodeJS.Timeout;
	private operationQueue: SyncOperation[] = [];
	private completedOperations: SyncOperation[] = [];
	private logs: SyncLog[] = [];
	private metrics: SyncMetrics;
	private lastSyncTime: Date = new Date();
	private lastError?: string;

	constructor() {
		this.metrics = {
			totalOperations: 0,
			successfulOperations: 0,
			failedOperations: 0,
			averageSyncTime: 0,
			lastSyncDuration: 0,
			queueSize: 0,
			errorRate: 0,
		};
	}

	/**
	 * Initialize sync manager
	 */
	async initialize(): Promise<boolean> {
		try {
			this.log("INFO", "Initializing sync manager...");

			// Test Apollo Client connection
			const apolloHealth = await ApolloClientUtils.healthCheck();
			if (!apolloHealth) {
				this.log("ERROR", "Apollo Client health check failed");
				return false;
			}

			this.isConnected = true;
			this.log("INFO", "Sync manager initialized successfully");

			// Start sync interval
			this.syncInterval = setInterval(() => {
				this.processSyncQueue();
			}, REDIS_SYNC_CONFIG.SYNC_INTERVAL);

			// Start health check interval
			this.healthCheckInterval = setInterval(() => {
				this.performHealthCheck();
			}, REDIS_SYNC_CONFIG.HEALTH_CHECK_INTERVAL);

			return true;
		} catch (error) {
			this.log(
				"ERROR",
				`Initialization failed: ${error instanceof Error ? error.message : String(error)}`,
			);
			return false;
		}
	}

	/**
	 * Add operation to sync queue
	 */
	addOperation(
		operation: Omit<SyncOperation, "id" | "timestamp" | "status" | "retries">,
	): string {
		const syncOperation: SyncOperation = {
			...operation,
			id: this.generateId(),
			timestamp: new Date(),
			status: "PENDING",
			retries: 0,
		};

		this.operationQueue.push(syncOperation);
		this.metrics.queueSize = this.operationQueue.length;
		this.metrics.totalOperations++;

		this.log(
			"INFO",
			`Added operation to queue: ${operation.type} ${operation.entity} ${operation.entityId}`,
		);
		return syncOperation.id;
	}

	/**
	 * Process sync queue
	 */
	private async processSyncQueue(): Promise<void> {
		if (this.isSyncing || this.operationQueue.length === 0) {
			return;
		}

		this.isSyncing = true;
		const startTime = Date.now();

		try {
			this.log(
				"INFO",
				`Processing sync queue (${this.operationQueue.length} operations)`,
			);

			// Process operations in batches
			const batch = this.operationQueue.splice(0, REDIS_SYNC_CONFIG.BATCH_SIZE);

			for (const operation of batch) {
				await this.processOperation(operation);
			}

			this.lastSyncTime = new Date();
			this.metrics.lastSyncDuration = Date.now() - startTime;

			// Update average sync time
			const totalTime =
				this.metrics.averageSyncTime *
					(this.metrics.totalOperations - batch.length) +
				this.metrics.lastSyncDuration;
			this.metrics.averageSyncTime = totalTime / this.metrics.totalOperations;

			this.log(
				"INFO",
				`Sync batch completed (${batch.length} operations, ${this.metrics.lastSyncDuration}ms)`,
			);
		} catch (error) {
			this.lastError = error instanceof Error ? error.message : String(error);
			this.log("ERROR", `Sync queue processing failed: ${this.lastError}`);
		} finally {
			this.isSyncing = false;
			this.metrics.queueSize = this.operationQueue.length;
		}
	}

	/**
	 * Process individual operation
	 */
	private async processOperation(operation: SyncOperation): Promise<void> {
		operation.status = "PROCESSING";

		try {
			switch (operation.type) {
				case "CREATE":
				case "UPDATE":
					await this.syncEntity(operation);
					break;
				case "DELETE":
					await this.deleteEntity(operation);
					break;
				case "SYNC":
					await this.fullSync(operation);
					break;
				default:
					throw new Error(`Unknown operation type: ${operation.type}`);
			}

			operation.status = "COMPLETED";
			this.metrics.successfulOperations++;
			this.completedOperations.push(operation);

			this.log(
				"INFO",
				`Operation completed: ${operation.type} ${operation.entity} ${operation.entityId}`,
			);
		} catch (error) {
			operation.status = "FAILED";
			operation.error = error instanceof Error ? error.message : String(error);
			operation.retries++;

			this.metrics.failedOperations++;

			if (operation.retries < REDIS_SYNC_CONFIG.MAX_RETRIES) {
				// Re-queue for retry
				this.operationQueue.push(operation);
				this.log(
					"WARNING",
					`Operation failed, will retry: ${operation.type} ${operation.entity} ${operation.entityId}`,
				);
			} else {
				this.log(
					"ERROR",
					`Operation failed permanently: ${operation.type} ${operation.entity} ${operation.entityId}`,
				);
			}
		}

		// Update error rate
		this.metrics.errorRate =
			(this.metrics.failedOperations / this.metrics.totalOperations) * 100;
	}

	/**
	 * Sync entity to cache and publish update
	 */
	private async syncEntity(operation: SyncOperation): Promise<void> {
		// Cache the entity data
		const cacheKey = `${operation.entity.toLowerCase()}:${operation.entityId}`;
		await cacheService.cacheProducts(cacheKey, operation.data);

		// Publish real-time update
		await realtimeService.publishOrderUpdate({
			type: operation.type,
			entity: operation.entity,
			entityId: operation.entityId,
			data: operation.data,
			timestamp: operation.timestamp,
		});
	}

	/**
	 * Delete entity from cache
	 */
	private async deleteEntity(operation: SyncOperation): Promise<void> {
		const cacheKey = `${operation.entity.toLowerCase()}:${operation.entityId}`;
		await cacheService.clearCacheByType(cacheKey);
	}

	/**
	 * Perform full sync
	 */
	private async fullSync(operation: SyncOperation): Promise<void> {
		// This would typically sync all entities of a specific type
		// For now, we'll simulate a successful sync
		this.log("INFO", `Full sync initiated for ${operation.entity}`);
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate sync time
	}

	/**
	 * Perform health check
	 */
	private async performHealthCheck(): Promise<void> {
		try {
			const apolloHealth = await ApolloClientUtils.healthCheck();
			this.isConnected = apolloHealth;

			if (!this.isConnected) {
				this.log(
					"ERROR",
					"Health check failed - Apollo Client connection lost",
				);
			} else {
				this.log("DEBUG", "Health check passed");
			}
		} catch (error) {
			this.log(
				"ERROR",
				`Health check failed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	/**
	 * Generate unique ID
	 */
	private generateId(): string {
		return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Add log entry
	 */
	private log(
		level: SyncLog["level"],
		message: string,
		operationId?: string,
		details?: any,
	): void {
		const logEntry: SyncLog = {
			id: this.generateId(),
			timestamp: new Date(),
			level,
			message,
			operationId,
			details,
		};

		this.logs.push(logEntry);

		// Keep only recent logs
		if (this.logs.length > REDIS_SYNC_CONFIG.LOG_RETENTION) {
			this.logs = this.logs.slice(-REDIS_SYNC_CONFIG.LOG_RETENTION);
		}

		// Console output
		const timestamp = logEntry.timestamp.toISOString();
		console.log(`[${timestamp}] [${level}] ${message}`);
		if (details) {
			console.log(`[${timestamp}] [${level}] Details:`, details);
		}
	}

	/**
	 * Get sync status
	 */
	getStatus(): SyncStatus {
		return {
			isConnected: this.isConnected,
			isSyncing: this.isSyncing,
			lastSyncTime: this.lastSyncTime,
			queuedOperations: this.operationQueue.length,
			completedOperations: this.completedOperations.length,
			failedOperations: this.metrics.failedOperations,
			totalOperations: this.metrics.totalOperations,
			successRate:
				this.metrics.totalOperations > 0
					? (this.metrics.successfulOperations / this.metrics.totalOperations) *
						100
					: 100,
			lastError: this.lastError,
		};
	}

	/**
	 * Get sync metrics
	 */
	getMetrics(): SyncMetrics {
		return { ...this.metrics };
	}

	/**
	 * Get recent logs
	 */
	getLogs(limit: number = 10): SyncLog[] {
		return this.logs.slice(-limit);
	}

	/**
	 * Shutdown sync manager
	 */
	shutdown(): void {
		this.log("INFO", "Shutting down sync manager...");

		if (this.syncInterval) {
			clearInterval(this.syncInterval);
		}

		if (this.healthCheckInterval) {
			clearInterval(this.healthCheckInterval);
		}

		this.isConnected = false;
		this.isSyncing = false;

		this.log("INFO", "Sync manager shutdown complete");
	}
}

// ============================================================================
// SYNC HOOKS - React Hooks للمزامنة
// ============================================================================

import { useState, useEffect, useCallback } from "react";

export const useSyncManager = () => {
	const [syncManager] = useState(() => new SyncManager());
	const [status, setStatus] = useState<SyncStatus>(syncManager.getStatus());
	const [metrics, setMetrics] = useState<SyncMetrics>(syncManager.getMetrics());

	useEffect(() => {
		// Initialize sync manager
		syncManager.initialize();

		// Update status and metrics periodically
		const interval = setInterval(() => {
			setStatus(syncManager.getStatus());
			setMetrics(syncManager.getMetrics());
		}, 1000);

		return () => {
			clearInterval(interval);
			syncManager.shutdown();
		};
	}, [syncManager]);

	const addOperation = useCallback(
		(
			operation: Omit<SyncOperation, "id" | "timestamp" | "status" | "retries">,
		) => {
			return syncManager.addOperation(operation);
		},
		[syncManager],
	);

	const getLogs = useCallback(
		(limit?: number) => {
			return syncManager.getLogs(limit);
		},
		[syncManager],
	);

	return {
		status,
		metrics,
		addOperation,
		getLogs,
	};
};

// ============================================================================
// EXPORTS - التصدير
// ============================================================================

export const syncManager = new SyncManager();

export default syncManager;
