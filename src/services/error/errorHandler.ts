/**
 * Centralized Error Handler
 * معالج الأخطاء المركزي
 */

import {
	BaseError,
	ErrorSeverity,
	ErrorCategory,
	ValidationError,
	NetworkError,
	ServerError,
	AuthenticationError,
	AuthorizationError,
	BusinessError,
	ErrorHandlingResult,
	ErrorConfig,
} from "./types";

// Default error configuration
const defaultConfig: ErrorConfig = {
	enableLogging: true,
	enableReporting: true,
	enableRetry: true,
	maxRetries: 3,
	retryDelay: 1000,
	criticalErrorThreshold: 10,
	errorSamplingRate: 1.0,
	ignoredErrors: [],
	customErrorHandlers: {},
};

class ErrorHandler {
	private config: ErrorConfig;
	private errorCount: number = 0;
	private errorHistory: BaseError[] = [];

	constructor(config: Partial<ErrorConfig> = {}) {
		this.config = { ...defaultConfig, ...config };
	}

	// Create error instances
	createError(
		message: string,
		code: string,
		category: ErrorCategory,
		severity: ErrorSeverity = "medium",
		metadata?: Record<string, any>,
	): BaseError {
		const error: BaseError = {
			id: this.generateErrorId(),
			message,
			code,
			category,
			severity,
			timestamp: Date.now(),
			source: this.getErrorSource(),
			metadata,
		};

		this.trackError(error);
		return error;
	}

	createValidationError(
		message: string,
		field?: string,
		value?: any,
		constraints?: string[],
	): ValidationError {
		return {
			...this.createError(message, "VALIDATION_ERROR", "validation", "medium"),
			field,
			value,
			constraints,
		};
	}

	createNetworkError(
		message: string,
		url?: string,
		method?: string,
		statusCode?: number,
	): NetworkError {
		return {
			...this.createError(message, "NETWORK_ERROR", "network", "high"),
			url,
			method,
			statusCode,
		};
	}

	createServerError(
		message: string,
		endpoint?: string,
		statusCode?: number,
	): ServerError {
		return {
			...this.createError(message, "SERVER_ERROR", "server", "high"),
			endpoint,
			statusCode,
		};
	}

	createAuthenticationError(
		message: string,
		action?: string,
		tokenExpired?: boolean,
	): AuthenticationError {
		return {
			...this.createError(message, "AUTH_ERROR", "authentication", "high"),
			action,
			tokenExpired,
			invalidCredentials: !tokenExpired,
		};
	}

	createAuthorizationError(
		message: string,
		resource?: string,
		action?: string,
	): AuthorizationError {
		return {
			...this.createError(message, "AUTHZ_ERROR", "authorization", "high"),
			resource,
			action,
		};
	}

	createBusinessError(
		message: string,
		businessRule?: string,
		entityId?: string,
	): BusinessError {
		return {
			...this.createError(message, "BUSINESS_ERROR", "business", "medium"),
			businessRule,
			entityId,
		};
	}

	// Handle errors
	handleError(error: BaseError | Error | string): ErrorHandlingResult {
		const baseError = this.normalizeError(error);

		// Check if error should be ignored
		if (this.shouldIgnoreError(baseError)) {
			return { handled: true, shouldRetry: false };
		}

		// Log error
		if (this.config.enableLogging) {
			this.logError(baseError);
		}

		// Report error
		if (this.config.enableReporting) {
			this.reportError(baseError);
		}

		// Execute custom handler if exists
		if (this.config.customErrorHandlers[baseError.code]) {
			this.config.customErrorHandlers[baseError.code](baseError);
		}

		// Determine handling strategy
		const result = this.determineHandlingStrategy(baseError);

		// Update error count
		this.errorCount++;

		// Check for critical error threshold
		if (this.errorCount >= this.config.criticalErrorThreshold) {
			this.handleCriticalErrorThreshold();
		}

		return result;
	}

	// Handle async errors
	async handleAsyncError<T>(
		promise: Promise<T>,
		fallbackValue?: T,
	): Promise<T | undefined> {
		try {
			return await promise;
		} catch (error) {
			const baseError = this.normalizeError(error);
			const result = this.handleError(baseError);

			if (result.shouldRetry && this.config.enableRetry) {
				return this.retryOperation(promise, fallbackValue);
			}

			return fallbackValue;
		}
	}

	// Retry operation
	private async retryOperation<T>(
		operation: () => Promise<T>,
		fallbackValue?: T,
		attempt: number = 1,
	): Promise<T | undefined> {
		try {
			return await operation();
		} catch (error) {
			if (attempt >= this.config.maxRetries) {
				const baseError = this.normalizeError(error);
				this.handleError(baseError);
				return fallbackValue;
			}

			// Wait before retry
			await this.delay(this.config.retryDelay * attempt);

			return this.retryOperation(operation, fallbackValue, attempt + 1);
		}
	}

	// Utility methods
	private generateErrorId(): string {
		return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private getErrorSource(): string {
		if (typeof window !== "undefined") {
			return "client";
		}
		return "server";
	}

	private normalizeError(error: BaseError | Error | string): BaseError {
		if (typeof error === "string") {
			return this.createError(error, "UNKNOWN_ERROR", "unknown", "medium");
		}

		if (error instanceof Error) {
			return this.createError(
				error.message,
				error.name.toUpperCase(),
				"unknown",
				"medium",
				{ stack: error.stack },
			);
		}

		return error;
	}

	private shouldIgnoreError(error: BaseError): boolean {
		return this.config.ignoredErrors.includes(error.code);
	}

	private logError(error: BaseError): void {
		const logLevel = this.getLogLevel(error.severity);
		console[logLevel]("Error:", {
			id: error.id,
			message: error.message,
			code: error.code,
			category: error.category,
			severity: error.severity,
			timestamp: new Date(error.timestamp).toISOString(),
			source: error.source,
			metadata: error.metadata,
		});
	}

	private getLogLevel(severity: ErrorSeverity): "log" | "warn" | "error" {
		switch (severity) {
			case "low":
				return "log";
			case "medium":
				return "warn";
			case "high":
			case "critical":
				return "error";
			default:
				return "error";
		}
	}

	private reportError(error: BaseError): void {
		// Send error to external service (e.g., Sentry, LogRocket)
		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("event", "error", {
				error_id: error.id,
				error_code: error.code,
				error_category: error.category,
				error_severity: error.severity,
				error_message: error.message,
			});
		}
	}

	private determineHandlingStrategy(error: BaseError): ErrorHandlingResult {
		switch (error.category) {
			case "network":
				return {
					handled: true,
					shouldRetry: true,
					retryAfter: 2000,
					userMessage:
						"Network error. Please check your connection and try again.",
				};

			case "authentication":
				return {
					handled: true,
					shouldRetry: false,
					userMessage: "Authentication failed. Please log in again.",
					fallbackAction: "redirect_to_login",
				};

			case "authorization":
				return {
					handled: true,
					shouldRetry: false,
					userMessage: "You do not have permission to perform this action.",
					fallbackAction: "show_unauthorized_message",
				};

			case "validation":
				return {
					handled: true,
					shouldRetry: false,
					userMessage: "Please check your input and try again.",
				};

			case "server":
				return {
					handled: true,
					shouldRetry: true,
					retryAfter: 5000,
					userMessage: "Server error. Please try again later.",
				};

			default:
				return {
					handled: true,
					shouldRetry: false,
					userMessage: "An unexpected error occurred. Please try again.",
				};
		}
	}

	private handleCriticalErrorThreshold(): void {
		console.error("Critical error threshold reached. System may be unstable.");
		// Implement critical error handling (e.g., show maintenance page)
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private trackError(error: BaseError): void {
		this.errorHistory.push(error);

		// Keep only last 100 errors
		if (this.errorHistory.length > 100) {
			this.errorHistory = this.errorHistory.slice(-100);
		}
	}

	// Public methods for error analysis
	getErrorHistory(): BaseError[] {
		return [...this.errorHistory];
	}

	getErrorCount(): number {
		return this.errorCount;
	}

	clearErrorHistory(): void {
		this.errorHistory = [];
		this.errorCount = 0;
	}

	updateConfig(newConfig: Partial<ErrorConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Export convenience functions
export const createError = errorHandler.createError.bind(errorHandler);
export const handleError = errorHandler.handleError.bind(errorHandler);
export const handleAsyncError =
	errorHandler.handleAsyncError.bind(errorHandler);
