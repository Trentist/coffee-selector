/**
 * Rate Limiter Service
 * خدمة تحديد معدل الطلبات للأمان
 */

interface RateLimitConfig {
	maxAttempts: number;
	windowMs: number;
	blockDurationMs: number;
}

interface AttemptRecord {
	count: number;
	firstAttempt: number;
	lastAttempt: number;
	blockedUntil?: number;
}

class RateLimiterService {
	private attempts: Map<string, AttemptRecord> = new Map();
	private configs: Map<string, RateLimitConfig> = new Map();

	constructor() {
		// Initialize default configurations
		this.configs.set("login", {
			maxAttempts: 5,
			windowMs: 15 * 60 * 1000, // 15 minutes
			blockDurationMs: 30 * 60 * 1000, // 30 minutes
		});

		this.configs.set("register", {
			maxAttempts: 3,
			windowMs: 60 * 60 * 1000, // 1 hour
			blockDurationMs: 60 * 60 * 1000, // 1 hour
		});

		this.configs.set("forgot-password", {
			maxAttempts: 3,
			windowMs: 60 * 60 * 1000, // 1 hour
			blockDurationMs: 60 * 60 * 1000, // 1 hour
		});

		// Clean up old records periodically
		setInterval(() => this.cleanup(), 60 * 60 * 1000); // Every hour
	}

	/**
	 * Check if an action is allowed for a given identifier
	 */
	isAllowed(identifier: string, action: string): boolean {
		const config = this.configs.get(action);
		if (!config) return true; // No limit if no config

		const record = this.attempts.get(`${identifier}:${action}`);
		if (!record) return true;

		const now = Date.now();

		// Check if currently blocked
		if (record.blockedUntil && now < record.blockedUntil) {
			return false;
		}

		// Check if window has expired
		if (now - record.firstAttempt > config.windowMs) {
			this.attempts.delete(`${identifier}:${action}`);
			return true;
		}

		// Check if within limit
		return record.count < config.maxAttempts;
	}

	/**
	 * Record an attempt (success or failure)
	 */
	recordAttempt(identifier: string, action: string, success: boolean): void {
		const config = this.configs.get(action);
		if (!config) return;

		const key = `${identifier}:${action}`;
		const now = Date.now();
		const record = this.attempts.get(key) || {
			count: 0,
			firstAttempt: now,
			lastAttempt: now,
		};

		if (success) {
			// Reset on successful attempt
			this.attempts.delete(key);
		} else {
			// Increment failed attempt
			record.count++;
			record.lastAttempt = now;

			// Block if limit exceeded
			if (record.count >= config.maxAttempts) {
				record.blockedUntil = now + config.blockDurationMs;
			}

			this.attempts.set(key, record);
		}
	}

	/**
	 * Get time until unblocked for a given identifier and action
	 */
	getTimeUntilUnblocked(identifier: string, action: string): number {
		const record = this.attempts.get(`${identifier}:${action}`);
		if (!record || !record.blockedUntil) return 0;

		const now = Date.now();
		return Math.max(0, record.blockedUntil - now);
	}

	/**
	 * Get remaining attempts for a given identifier and action
	 */
	getRemainingAttempts(identifier: string, action: string): number {
		const config = this.configs.get(action);
		if (!config) return Infinity;

		const record = this.attempts.get(`${identifier}:${action}`);
		if (!record) return config.maxAttempts;

		return Math.max(0, config.maxAttempts - record.count);
	}

	/**
	 * Reset attempts for a given identifier and action
	 */
	resetAttempts(identifier: string, action: string): void {
		this.attempts.delete(`${identifier}:${action}`);
	}

	/**
	 * Clean up old records
	 */
	private cleanup(): void {
		const now = Date.now();
		const maxAge = 24 * 60 * 60 * 1000; // 24 hours

		for (const [key, record] of this.attempts.entries()) {
			if (now - record.lastAttempt > maxAge) {
				this.attempts.delete(key);
			}
		}
	}

	/**
	 * Get statistics for monitoring
	 */
	getStats(): Record<string, any> {
		const stats: Record<string, any> = {};

		for (const [action, config] of this.configs.entries()) {
			const actionRecords = Array.from(this.attempts.entries())
				.filter(([key]) => key.endsWith(`:${action}`));

			stats[action] = {
				config,
				totalRecords: actionRecords.length,
				blockedRecords: actionRecords.filter(([, record]) =>
					record.blockedUntil && Date.now() < record.blockedUntil
				).length,
			};
		}

		return stats;
	}
}

export const rateLimiterService = new RateLimiterService();