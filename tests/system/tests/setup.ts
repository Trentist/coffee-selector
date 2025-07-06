/**
 * Jest Test Setup Configuration
 * تكوين إعداد اختبارات Jest
 */

import "@testing-library/jest-dom";
import {
	setupTestEnvironment,
	cleanupTestEnvironment,
} from "./helpers/test-utils";
import {
	ODOO_CONFIG,
	REDIS_CONFIG,
	ARAMEX_CONFIG,
} from "../../../src/constants/environment-keys";

// Setup test environment before all tests
beforeAll(() => {
	console.log("🚀 Setting up test environment...");
	setupTestEnvironment();
});

// Cleanup after all tests
afterAll(() => {
	console.log("🧹 Cleaning up test environment...");
	cleanupTestEnvironment();
});

// Global test configuration
global.console = {
	...console,
	// Suppress console.log in tests unless explicitly needed
	log: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
};

// Mock Next.js router
jest.mock("next/router", () => ({
	useRouter() {
		return {
			route: "/",
			pathname: "/",
			query: {},
			asPath: "/",
			push: jest.fn(),
			pop: jest.fn(),
			reload: jest.fn(),
			back: jest.fn(),
			prefetch: jest.fn().mockResolvedValue(undefined),
			beforePopState: jest.fn(),
			events: {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			},
		};
	},
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => {
		const React = require("react");
		return React.createElement("img", { ...props, alt: props.alt || "" });
	},
}));

// Mock environment variables using unified keys
process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL = ODOO_CONFIG.graphqlUrl;
process.env.NEXT_PUBLIC_ODOO_API_KEY = ODOO_CONFIG.apiKey;
process.env.NEXT_PUBLIC_ODOO_DATABASE = ODOO_CONFIG.database;
process.env.NEXT_PUBLIC_ODOO_URL = ODOO_CONFIG.baseUrl;

// Redis configuration
process.env.REDIS_URL = REDIS_CONFIG.url;
process.env.REDIS_HOST = REDIS_CONFIG.host;
process.env.REDIS_PORT = REDIS_CONFIG.port.toString();

// Aramex configuration
process.env.ARAMEX_USERNAME = ARAMEX_CONFIG.username;
process.env.ARAMEX_PASSWORD = ARAMEX_CONFIG.password;
process.env.ARAMEX_ACCOUNT_NUMBER = ARAMEX_CONFIG.accountNumber;
process.env.ARAMEX_ACCOUNT_PIN = ARAMEX_CONFIG.accountPin;

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
	value: sessionStorageMock,
});

// Mock fetch globally
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global error handler for unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Custom matchers for better assertions
expect.extend({
	toBeValidOdooData(received) {
		const pass =
			received &&
			typeof received === "object" &&
			received.hasOwnProperty("id") &&
			received.id !== null &&
			received.id !== undefined;

		if (pass) {
			return {
				message: () => `expected ${received} not to be valid Odoo data`,
				pass: true,
			};
		} else {
			return {
				message: () =>
					`expected ${received} to be valid Odoo data with id property`,
				pass: false,
			};
		}
	},

	toHaveValidPrice(received) {
		const pass =
			typeof received === "number" &&
			received > 0 &&
			!isNaN(received) &&
			isFinite(received);

		if (pass) {
			return {
				message: () => `expected ${received} not to be a valid price`,
				pass: true,
			};
		} else {
			return {
				message: () =>
					`expected ${received} to be a valid price (positive number)`,
				pass: false,
			};
		}
	},

	toBeWithinResponseTime(received, expectedTime) {
		const pass = typeof received === "number" && received <= expectedTime;

		if (pass) {
			return {
				message: () =>
					`expected ${received}ms to be slower than ${expectedTime}ms`,
				pass: true,
			};
		} else {
			return {
				message: () =>
					`expected ${received}ms to be within ${expectedTime}ms response time`,
				pass: false,
			};
		}
	},
});

// Declare custom matchers for TypeScript
declare global {
	namespace jest {
		interface Matchers<R> {
			toBeValidOdooData(): R;
			toHaveValidPrice(): R;
			toBeWithinResponseTime(expectedTime: number): R;
		}
	}
}
