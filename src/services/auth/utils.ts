/**
 * Authentication Utilities - أدوات المصادقة المساعدة
 */

import {
	AuthUser,
	SecurityLog,
	ActiveDevice,
} from "@/odoo-schema-full/mutations/auth-mutations";

export class AuthUtils {
	private rateLimitMap: Map<string, { count: number; resetTime: number }> =
		new Map();

	/**
	 * Store authentication data in localStorage
	 */
	storeAuthData(
		user: AuthUser,
		token: string,
		refreshToken: string,
		expiresAt: string,
	): void {
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_user", JSON.stringify(user));
			localStorage.setItem("auth_token", token);
			localStorage.setItem("auth_refresh_token", refreshToken);
			localStorage.setItem("auth_expires_at", expiresAt);
		}
	}

	/**
	 * Update stored user data
	 */
	updateStoredUserData(user: AuthUser): void {
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_user", JSON.stringify(user));
		}
	}

	/**
	 * Update stored tokens
	 */
	updateStoredTokens(
		token: string,
		refreshToken: string,
		expiresAt: string,
	): void {
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_token", token);
			localStorage.setItem("auth_refresh_token", refreshToken);
			localStorage.setItem("auth_expires_at", expiresAt);
		}
	}

	/**
	 * Clear stored authentication data
	 */
	clearStoredData(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem("auth_user");
			localStorage.removeItem("auth_token");
			localStorage.removeItem("auth_refresh_token");
			localStorage.removeItem("auth_expires_at");
		}
	}

	/**
	 * Get stored token
	 */
	getStoredToken(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem("auth_token");
		}
		return null;
	}

	/**
	 * Get stored refresh token
	 */
	getStoredRefreshToken(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem("auth_refresh_token");
		}
		return null;
	}

	/**
	 * Get stored expires at
	 */
	getStoredExpiresAt(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem("auth_expires_at");
		}
		return null;
	}

	/**
	 * Get stored user data
	 */
	getStoredUserData(): AuthUser | null {
		if (typeof window !== "undefined") {
			const userData = localStorage.getItem("auth_user");
			return userData ? JSON.parse(userData) : null;
		}
		return null;
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		const token = this.getStoredToken();
		const expiresAt = this.getStoredExpiresAt();

		if (!token || !expiresAt) {
			return false;
		}

		const now = new Date();
		const expiryDate = new Date(expiresAt);

		return now < expiryDate;
	}

	/**
	 * Get current user
	 */
	getCurrentUser(): AuthUser | null {
		if (!this.isAuthenticated()) {
			return null;
		}
		return this.getStoredUserData();
	}

	/**
	 * Rate limiting check
	 */
	isRateLimited(action: string, identifier: string): boolean {
		const key = `${action}:${identifier}`;
		const now = Date.now();
		const limit = this.rateLimitMap.get(key);

		if (!limit) {
			this.rateLimitMap.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute
			return false;
		}

		if (now > limit.resetTime) {
			this.rateLimitMap.set(key, { count: 1, resetTime: now + 60000 });
			return false;
		}

		if (limit.count >= 5) {
			// Max 5 attempts per minute
			return true;
		}

		limit.count++;
		return false;
	}

	/**
	 * Validate email format
	 */
	validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Validate password strength
	 */
	validatePassword(password: string): boolean {
		return password.length >= 8;
	}

	/**
	 * Log security events
	 */
	logSecurityEvent(
		action: string,
		success: boolean,
		identifier?: string,
	): void {
		const event = {
			action,
			success,
			identifier,
			timestamp: new Date().toISOString(),
			userAgent:
				typeof window !== "undefined" ? window.navigator.userAgent : "server",
		};

		console.log("Security Event:", event);

		// In production, send to security monitoring service
		// await securityService.logEvent(event);
	}
}
