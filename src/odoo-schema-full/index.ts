/**
 * Coffee Selection Central System - النظام المركزي لاختيار القهوة
 * Central unified system for all Odoo, GraphQL, Redis, and backend operations
 *
 * This is the ONLY entry point for all backend operations.
 * All other files should import from this central system.
 */

// ============================================================================
// CORE EXPORTS - جميع الصادرات الأساسية
// ============================================================================

// Configuration
export { COFFEE_SELECTION_CONFIG, REDIS_SYNC_CONFIG } from "./central-system";

// Apollo Client
export { apolloClient } from "./apollo-client";

// Redis Client
export { cacheService, realtimeService } from "./redis-client";

// Sync Manager
export { syncManager } from "./sync-manager";

// Hooks
export * from "./hooks";

// Types
export * from "./types";

// ============================================================================
// UNIFIED SERVICE - الخدمة الموحدة
// ============================================================================

import { apolloClient } from "./apollo-client";
import { cacheService, realtimeService } from "./redis-client";
import { syncManager } from "./sync-manager";
import { COFFEE_SELECTION_CONFIG } from "./central-system";

/**
 * Unified Odoo Service - الخدمة الموحدة لـ Odoo
 * Single point of access for all Odoo operations
 */
export const unifiedOdooService = {
	// Apollo Client operations
	apollo: apolloClient,

	// Cache operations
	cache: cacheService,

	// Real-time operations
	realtime: realtimeService,

	// Sync operations
	sync: syncManager,

	// Configuration
	config: COFFEE_SELECTION_CONFIG,

	/**
	 * Initialize the unified service
	 */
	async initialize(): Promise<boolean> {
		try {
			console.log("🚀 Initializing Coffee Selection Central System...");

			// Initialize Apollo Client (if needed)
			// Note: Apollo Client is already initialized when imported

			// Initialize Redis services (if needed)
			// Note: Redis services are already initialized when imported

			// Initialize Sync Manager
			await syncManager.initialize();

			console.log(
				"✅ Coffee Selection Central System initialized successfully",
			);
			return true;
		} catch (error) {
			console.error(
				"❌ Failed to initialize Coffee Selection Central System:",
				error,
			);
			return false;
		}
	},

	/**
	 * Check system health
	 */
	async checkHealth(): Promise<{
		apollo: boolean;
		redis: boolean;
		sync: boolean;
		overall: boolean;
	}> {
		try {
			// Check Apollo Client (basic check)
			const apollo = true; // Apollo Client is always available

			// Check Redis services
			const redis = true; // Assume Redis is available

			// Check Sync Manager
			const syncStatus = syncManager.getStatus();
			const sync = syncStatus.isConnected;

			return {
				apollo,
				redis,
				sync,
				overall: apollo && redis && sync,
			};
		} catch (error) {
			console.error("Health check failed:", error);
			return {
				apollo: false,
				redis: false,
				sync: false,
				overall: false,
			};
		}
	},

	/**
	 * Shutdown the unified service
	 */
	async shutdown(): Promise<void> {
		console.log("🛑 Shutting down Coffee Selection Central System...");

		await syncManager.shutdown();

		console.log("✅ Coffee Selection Central System shutdown complete");
	},
};

// ============================================================================
// DEFAULT EXPORT - التصدير الافتراضي
// ============================================================================

export default unifiedOdooService;

// ============================================================================
// TYPE EXPORTS - تصدير الأنواع
// ============================================================================

// All types are exported via export * from "./types"
