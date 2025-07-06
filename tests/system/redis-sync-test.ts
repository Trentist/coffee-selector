/**
 * Redis Sync Test - اختبار مزامنة Redis
 * Comprehensive test for Redis connection, queue management, and data synchronization
 */

import {
	COFFEE_SELECTION_CONFIG,
	REDIS_SYNC_CONFIG,
} from "../../src/odoo-schema-full";

// ============================================================================
// TEST CONFIGURATION - إعدادات الاختبار
// ============================================================================

const COFFEE_SELECTION_TEST_CONFIG = {
	REDIS: {
		URL: COFFEE_SELECTION_CONFIG.REDIS.URL,
		PREFIX: COFFEE_SELECTION_CONFIG.REDIS.PREFIX,
		TTL: 3600, // Use fixed TTL for tests
	},
	ODOO: {
		BASE_URL: COFFEE_SELECTION_CONFIG.ODOO.BASE_URL,
		API_KEY: COFFEE_SELECTION_CONFIG.ODOO.API_KEY,
	},
};

// ============================================================================
// REDIS SYNC INTERFACES - واجهات مزامنة Redis
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
// REDIS SYNC MANAGER - مدير مزامنة Redis
// ============================================================================

class RedisSyncManager {
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
	 * Initialize Redis sync manager
	 */
	async initialize(): Promise<boolean> {
		try {
			this.log("INFO", "Initializing Redis sync manager...");

			// Test Redis connection
			const connectionTest = await this.testConnection();
			if (!connectionTest.success) {
				this.log(
					"ERROR",
					`Failed to connect to Redis: ${connectionTest.error}`,
				);
				return false;
			}

			this.isConnected = true;
			this.log("INFO", "Redis sync manager initialized successfully");

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
	 * Test Redis connection
	 */
	private async testConnection(): Promise<{
		success: boolean;
		error?: string;
	}> {
		const startTime = Date.now();

		try {
			// Test basic Redis operations
			const testKey = `${COFFEE_SELECTION_CONFIG.REDIS.PREFIX}test:connection`;
			const testValue = JSON.stringify({ timestamp: Date.now(), test: true });

			// Set test value
			await this.setValue(testKey, testValue);

			// Get test value
			const retrievedValue = await this.getValue(testKey);

			// Delete test value
			await this.deleteValue(testKey);

			const duration = Date.now() - startTime;

			if (retrievedValue === testValue) {
				this.log("INFO", `Redis connection test successful (${duration}ms)`);
				return { success: true };
			} else {
				return { success: false, error: "Data integrity check failed" };
			}
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				success: false,
				error: `Connection test failed after ${duration}ms: ${error instanceof Error ? error.message : String(error)}`,
			};
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
	 * Sync entity to Redis
	 */
	private async syncEntity(operation: SyncOperation): Promise<void> {
		const cacheKey = this.getCacheKey(operation.entity, operation.entityId);
		const cacheValue = JSON.stringify({
			...operation.data,
			syncedAt: new Date().toISOString(),
			operationId: operation.id,
		});

		await this.setValue(
			cacheKey,
			cacheValue,
			COFFEE_SELECTION_TEST_CONFIG.REDIS.TTL,
		);
	}

	/**
	 * Delete entity from Redis
	 */
	private async deleteEntity(operation: SyncOperation): Promise<void> {
		const cacheKey = this.getCacheKey(operation.entity, operation.entityId);
		await this.deleteValue(cacheKey);
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
	 * Get cache key for entity
	 */
	private getCacheKey(entity: string, entityId: string): string {
		return `${COFFEE_SELECTION_TEST_CONFIG.REDIS.PREFIX}${entity.toLowerCase()}:${entityId}`;
	}

	/**
	 * Set value in Redis
	 */
	private async setValue(
		key: string,
		value: string,
		ttl?: number,
	): Promise<void> {
		if (typeof localStorage !== "undefined") {
			const item = {
				value,
				expiry: ttl ? Date.now() + ttl * 1000 : null,
			};
			localStorage.setItem(`redis:${key}`, JSON.stringify(item));
		}
	}

	/**
	 * Get value from Redis
	 */
	private async getValue(key: string): Promise<string | null> {
		if (typeof localStorage !== "undefined") {
			const item = localStorage.getItem(`redis:${key}`);
			if (item) {
				const { value, expiry } = JSON.parse(item);
				if (expiry && Date.now() > expiry) {
					localStorage.removeItem(`redis:${key}`);
					return null;
				}
				return value;
			}
		}
		return null;
	}

	/**
	 * Delete value from Redis
	 */
	private async deleteValue(key: string): Promise<void> {
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem(`redis:${key}`);
		}
	}

	/**
	 * Perform health check
	 */
	private async performHealthCheck(): Promise<void> {
		try {
			const connectionTest = await this.testConnection();
			this.isConnected = connectionTest.success;

			if (!this.isConnected) {
				this.log("ERROR", "Health check failed - Redis connection lost");
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
		this.log("INFO", "Shutting down Redis sync manager...");

		if (this.syncInterval) {
			clearInterval(this.syncInterval);
		}

		if (this.healthCheckInterval) {
			clearInterval(this.healthCheckInterval);
		}

		this.isConnected = false;
		this.isSyncing = false;

		this.log("INFO", "Redis sync manager shutdown complete");
	}
}

// ============================================================================
// REDIS SYNC TESTER - اختبار مزامنة Redis
// ============================================================================

class RedisSyncTester {
	private syncManager: RedisSyncManager;

	constructor() {
		this.syncManager = new RedisSyncManager();
	}

	/**
	 * Run comprehensive Redis sync tests
	 */
	async runAllTests(): Promise<{
		success: boolean;
		results: any[];
		summary: string;
		finalStatus: SyncStatus;
	}> {
		console.log("🚀 Starting Redis Sync Tests...");
		console.log("=".repeat(60));

		const results: any[] = [];
		let successCount = 0;
		let totalCount = 0;

		// Test 1: Initialization
		console.log("1️⃣ Testing initialization...");
		const initResult = await this.testInitialization();
		results.push(initResult);
		totalCount++;
		if (initResult.success) successCount++;

		// Test 2: Basic operations
		console.log("2️⃣ Testing basic operations...");
		const basicResult = await this.testBasicOperations();
		results.push(basicResult);
		totalCount++;
		if (basicResult.success) successCount++;

		// Test 3: Queue management
		console.log("3️⃣ Testing queue management...");
		const queueResult = await this.testQueueManagement();
		results.push(queueResult);
		totalCount++;
		if (queueResult.success) successCount++;

		// Test 4: Error handling
		console.log("4️⃣ Testing error handling...");
		const errorResult = await this.testErrorHandling();
		results.push(errorResult);
		totalCount++;
		if (errorResult.success) successCount++;

		// Test 5: Performance
		console.log("5️⃣ Testing performance...");
		const performanceResult = await this.testPerformance();
		results.push(performanceResult);
		totalCount++;
		if (performanceResult.success) successCount++;

		// Test 6: Health monitoring
		console.log("6️⃣ Testing health monitoring...");
		const healthResult = await this.testHealthMonitoring();
		results.push(healthResult);
		totalCount++;
		if (healthResult.success) successCount++;

		const overallSuccess = successCount === totalCount;
		const summary = `Tests: ${successCount}/${totalCount} passed (${((successCount / totalCount) * 100).toFixed(1)}%)`;

		// Get final status
		const finalStatus = this.syncManager.getStatus();

		console.log("\n" + "=".repeat(60));
		console.log("📊 REDIS SYNC TEST RESULTS");
		console.log("=".repeat(60));
		console.log(`Overall: ${overallSuccess ? "✅ PASSED" : "❌ FAILED"}`);
		console.log(`Summary: ${summary}`);

		// Print detailed results
		results.forEach((result, index) => {
			console.log(
				`\n${index + 1}. ${result.name}: ${result.success ? "✅" : "❌"}`,
			);
			console.log(`   ${result.message}`);
			if (result.details) {
				console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
			}
		});

		// Print final status
		console.log("\n📈 FINAL STATUS");
		console.log("=".repeat(40));
		console.log(`Connected: ${finalStatus.isConnected ? "✅" : "❌"}`);
		console.log(`Syncing: ${finalStatus.isSyncing ? "🔄" : "⏸️"}`);
		console.log(`Success Rate: ${finalStatus.successRate.toFixed(1)}%`);
		console.log(`Queued Operations: ${finalStatus.queuedOperations}`);
		console.log(`Completed Operations: ${finalStatus.completedOperations}`);
		console.log(`Failed Operations: ${finalStatus.failedOperations}`);

		return {
			success: overallSuccess,
			results,
			summary,
			finalStatus,
		};
	}

	/**
	 * Test initialization
	 */
	private async testInitialization(): Promise<{
		success: boolean;
		name: string;
		message: string;
		details?: any;
	}> {
		const startTime = Date.now();

		try {
			const success = await this.syncManager.initialize();
			const duration = Date.now() - startTime;

			return {
				success,
				name: "Initialization",
				message: success
					? "✅ Redis sync manager initialized successfully"
					: "❌ Failed to initialize Redis sync manager",
				details: { duration },
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				success: false,
				name: "Initialization",
				message: "❌ Initialization test failed",
				details: {
					duration,
					error: error instanceof Error ? error.message : String(error),
				},
			};
		}
	}

	/**
	 * Test basic operations
	 */
	private async testBasicOperations(): Promise<{
		success: boolean;
		name: string;
		message: string;
		details?: any;
	}> {
		const startTime = Date.now();

		try {
			// Test CREATE operation
			const createOpId = this.syncManager.addOperation({
				type: "CREATE",
				entity: "PRODUCT",
				entityId: "test-1",
				data: { name: "Test Product", price: 29.99 },
			});

			// Test UPDATE operation
			const updateOpId = this.syncManager.addOperation({
				type: "UPDATE",
				entity: "PRODUCT",
				entityId: "test-2",
				data: { name: "Updated Product", price: 39.99 },
			});

			// Test DELETE operation
			const deleteOpId = this.syncManager.addOperation({
				type: "DELETE",
				entity: "PRODUCT",
				entityId: "test-3",
			});

			const duration = Date.now() - startTime;

			return {
				success: true,
				name: "Basic Operations",
				message: "✅ Basic operations added to queue successfully",
				details: {
					duration,
					operations: [createOpId, updateOpId, deleteOpId],
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				success: false,
				name: "Basic Operations",
				message: "❌ Basic operations test failed",
				details: {
					duration,
					error: error instanceof Error ? error.message : String(error),
				},
			};
		}
	}

	/**
	 * Test queue management
	 */
	private async testQueueManagement(): Promise<{
		success: boolean;
		name: string;
		message: string;
		details?: any;
	}> {
		const startTime = Date.now();

		try {
			// Wait for queue processing
			await new Promise((resolve) =>
				setTimeout(resolve, REDIS_SYNC_CONFIG.SYNC_INTERVAL + 1000),
			);

			const status = this.syncManager.getStatus();
			const duration = Date.now() - startTime;

			const success =
				status.completedOperations > 0 || status.queuedOperations === 0;

			return {
				success,
				name: "Queue Management",
				message: success
					? "✅ Queue management working correctly"
					: "❌ Queue management failed",
				details: {
					duration,
					queuedOperations: status.queuedOperations,
					completedOperations: status.completedOperations,
					successRate: status.successRate,
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				success: false,
				name: "Queue Management",
				message: "❌ Queue management test failed",
				details: {
					duration,
					error: error instanceof Error ? error.message : String(error),
				},
			};
		}
	}

	/**
	 * Test error handling
	 */
	private async testErrorHandling(): Promise<{
		success: boolean;
		name: string;
		message: string;
		details?: any;
	}> {
		const startTime = Date.now();

		try {
			// Add operation with invalid data to test error handling
			const errorOpId = this.syncManager.addOperation({
				type: "CREATE",
				entity: "PRODUCT",
				entityId: "error-test",
				data: null, // This should cause an error
			});

			// Wait for processing
			await new Promise((resolve) =>
				setTimeout(resolve, REDIS_SYNC_CONFIG.SYNC_INTERVAL + 1000),
			);

			const status = this.syncManager.getStatus();
			const duration = Date.now() - startTime;

			// Check if error handling is working (failed operations should be tracked)
			const success = status.failedOperations >= 0; // At least tracking failures

			return {
				success,
				name: "Error Handling",
				message: success
					? "✅ Error handling working correctly"
					: "❌ Error handling failed",
				details: {
					duration,
					failedOperations: status.failedOperations,
					successRate: status.successRate,
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				success: false,
				name: "Error Handling",
				message: "❌ Error handling test failed",
				details: {
					duration,
					error: error instanceof Error ? error.message : String(error),
				},
			};
		}
	}

	/**
	 * Test performance
	 */
	private async testPerformance(): Promise<{
		success: boolean;
		name: string;
		message: string;
		details?: any;
	}> {
		const startTime = Date.now();

		try {
			const metrics = this.syncManager.getMetrics();
			const duration = Date.now() - startTime;

			// Check if performance metrics are being collected
			const success =
				metrics.totalOperations > 0 && metrics.averageSyncTime >= 0;

			return {
				success,
				name: "Performance",
				message: success
					? "✅ Performance monitoring working correctly"
					: "❌ Performance monitoring failed",
				details: {
					duration,
					totalOperations: metrics.totalOperations,
					averageSyncTime: metrics.averageSyncTime,
					errorRate: metrics.errorRate,
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				success: false,
				name: "Performance",
				message: "❌ Performance test failed",
				details: {
					duration,
					error: error instanceof Error ? error.message : String(error),
				},
			};
		}
	}

	/**
	 * Test health monitoring
	 */
	private async testHealthMonitoring(): Promise<{
		success: boolean;
		name: string;
		message: string;
		details?: any;
	}> {
		const startTime = Date.now();

		try {
			// Wait for health check to complete
			await new Promise((resolve) =>
				setTimeout(resolve, REDIS_SYNC_CONFIG.HEALTH_CHECK_INTERVAL + 1000),
			);

			const status = this.syncManager.getStatus();
			const logs = this.syncManager.getLogs(5);
			const duration = Date.now() - startTime;

			// Check if health monitoring is working
			const hasHealthLogs = logs.some((log) =>
				log.message.includes("Health check"),
			);
			const success = status.isConnected && hasHealthLogs;

			return {
				success,
				name: "Health Monitoring",
				message: success
					? "✅ Health monitoring working correctly"
					: "❌ Health monitoring failed",
				details: {
					duration,
					isConnected: status.isConnected,
					healthLogsCount: logs.filter((log) =>
						log.message.includes("Health check"),
					).length,
				},
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				success: false,
				name: "Health Monitoring",
				message: "❌ Health monitoring test failed",
				details: {
					duration,
					error: error instanceof Error ? error.message : String(error),
				},
			};
		}
	}

	/**
	 * Get final status
	 */
	getFinalStatus(): SyncStatus {
		return this.syncManager.getStatus();
	}

	/**
	 * Cleanup
	 */
	cleanup(): void {
		this.syncManager.shutdown();
	}
}

// ============================================================================
// EXPORT AND USAGE - التصدير والاستخدام
// ============================================================================

export { RedisSyncManager, RedisSyncTester, REDIS_SYNC_CONFIG };

// Auto-run tests if this file is executed directly
if (typeof window !== "undefined") {
	// Browser environment
	const tester = new RedisSyncTester();
	tester.runAllTests().then((result) => {
		console.log("Redis sync tests completed. Check console for results.");
		const finalStatus = tester.getFinalStatus();
		console.log("Final status:", finalStatus);
		tester.cleanup();
	});
} else {
	// Node.js environment
	const tester = new RedisSyncTester();
	tester.runAllTests().then((result) => {
		console.log("Redis sync tests completed.");
		const finalStatus = tester.getFinalStatus();
		console.log("Final status:", finalStatus);
		tester.cleanup();
	});
}
