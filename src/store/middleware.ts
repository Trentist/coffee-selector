/**
 * Custom Redux Middleware
 * Middleware مخصص لـ Redux
 */

import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "./types";

// Logging middleware
export const loggingMiddleware: Middleware<{}, RootState> =
	(store) => (next) => (action) => {
		const timestamp = new Date().toISOString();
		const prevState = store.getState();

		console.group(`[${timestamp}] ${action.type}`);
		console.log("Previous State:", prevState);
		console.log("Action:", action);

		const result = next(action);

		const nextState = store.getState();
		console.log("Next State:", nextState);
		console.groupEnd();

		return result;
	};

// Error handling middleware
export const errorMiddleware: Middleware<{}, RootState> =
	(store) => (next) => (action) => {
		try {
			return next(action);
		} catch (error) {
			console.error("Redux Error:", error);

			// Dispatch error action
			store.dispatch({
				type: "notifications/addError",
				payload: {
					message: "An error occurred while processing your request",
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});

			throw error;
		}
	};

// Performance monitoring middleware
export const performanceMiddleware: Middleware<{}, RootState> =
	(store) => (next) => (action) => {
		const startTime = performance.now();

		const result = next(action);

		const endTime = performance.now();
		const duration = endTime - startTime;

		// Log slow actions
		if (duration > 100) {
			console.warn(
				`Slow action detected: ${action.type} took ${duration.toFixed(2)}ms`,
			);
		}

		return result;
	};

// Analytics middleware
export const analyticsMiddleware: Middleware<{}, RootState> =
	(store) => (next) => (action) => {
		const result = next(action);

		// Track specific actions
		const trackedActions = [
			"cart/addItem",
			"cart/removeItem",
			"user/login",
			"user/logout",
			"orders/createOrder",
		];

		if (trackedActions.includes(action.type)) {
			// Send analytics event
			if (typeof window !== "undefined" && window.gtag) {
				window.gtag("event", action.type, {
					event_category: "redux_action",
					event_label: action.type,
					value: 1,
				});
			}
		}

		return result;
	};

// Custom middleware array
export const customMiddleware = [
	loggingMiddleware,
	errorMiddleware,
	performanceMiddleware,
	analyticsMiddleware,
];
