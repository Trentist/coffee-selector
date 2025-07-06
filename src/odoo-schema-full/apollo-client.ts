/**
 * Apollo Client Configuration - Coffee Selection Central System
 * إعدادات Apollo Client - النظام المركزي لكوفي سيليكشن
 */

import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	from,
	gql,
	// gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

import { COFFEE_SELECTION_CONFIG } from "./central-system";

// ============================================================================
// HTTP LINK - رابط HTTP
// ============================================================================

const httpLink = createHttpLink({
	   uri: "/api/odoo-proxy", // Use local proxy endpoint to avoid CORS
	   credentials: "include",
	   fetchOptions: {
			   timeout: COFFEE_SELECTION_CONFIG.ODOO.TIMEOUT,
	   },
});

// ============================================================================
// AUTH LINK - رابط المصادقة
// ============================================================================

const authLink = setContext((_, { headers }) => {
	// Get token from localStorage or sessionStorage
	let token = null;

	if (typeof window !== "undefined") {
		token =
			localStorage.getItem("coffee_selection_token") ||
			sessionStorage.getItem("coffee_selection_token");
	}

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
			"Content-Type": "application/json",
			"X-Client": "CoffeeSelection-Web",
			"X-Version": "1.0.0",
			"X-Database": COFFEE_SELECTION_CONFIG.ODOO.DATABASE,
		},
	};
});

// ============================================================================
// RETRY LINK - رابط إعادة المحاولة
// ============================================================================

const retryLink = new RetryLink({
	delay: {
		initial: 300,
		max: 3000,
		jitter: true,
	},
	attempts: {
		max: COFFEE_SELECTION_CONFIG.ODOO.RETRY_ATTEMPTS,
		retryIf: (error, _operation) => {
			// Retry on network errors or specific GraphQL errors
			return (
				!!error &&
				(error.networkError ||
					(error.graphQLErrors &&
						error.graphQLErrors.some(
							(err: any) => err.extensions?.code === "AUTH_002",
						)))
			);
		},
	},
});

// ============================================================================
// ERROR LINK - رابط معالجة الأخطاء
// ============================================================================

const errorLink = onError(
	({ graphQLErrors, networkError, operation, forward }) => {
		// Handle GraphQL Errors
		if (graphQLErrors) {
			graphQLErrors.forEach(({ message, locations, path, extensions }) => {
				console.error(
					`[GraphQL Error]: ${message}`,
					`Location: ${locations?.map((l) => `${l.line}:${l.column}`).join(", ")}`,
					`Path: ${path?.join(".")}`,
					`Code: ${extensions?.code || "UNKNOWN"}`,
				);

				// Handle specific error codes
				switch (extensions?.code) {
					case "AUTH_002":
						// Clear token and redirect to login
						if (typeof window !== "undefined") {
							localStorage.removeItem("coffee_selection_token");
							sessionStorage.removeItem("coffee_selection_token");
							window.location.href = "/auth/login";
						}
						break;

					case "AUTH_003":
						console.warn(
							"Insufficient permissions for operation:",
							operation.operationName,
						);
						break;

					default:
						// Log unknown errors
						console.error("Unknown GraphQL error:", extensions?.code);
				}
			});
		}

		// Handle Network Errors
		if (networkError) {
			console.error(`[Network Error]: ${networkError.message}`);

			// Retry on network errors for non-critical operations
			if (
				operation.operationName !== "healthCheck" &&
				!operation.operationName.includes("Critical")
			) {
				return forward(operation);
			}
		}
	},
);

// ============================================================================
// CACHE CONFIGURATION - إعدادات التخزين المؤقت
// ============================================================================

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				// Products
				products: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				product: {
					merge(existing, incoming) {
						return incoming;
					},
				},
				searchProducts: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},

				// Cart
				cart: {
					merge(existing, incoming) {
						return incoming;
					},
				},

				// Orders
				orders: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				order: {
					merge(existing, incoming) {
						return incoming;
					},
				},

				// Categories
				categories: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},

				// Shipping
				shippingMethods: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},

				// Payment
				paymentMethods: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
			},
		},

		// Product Type Policies
		Product: {
			keyFields: ["id"],
			fields: {
				reviews: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				variants: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
			},
		},

		// Cart Type Policies
		Cart: {
			keyFields: ["id"],
			fields: {
				items: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				totals: {
					merge(existing, incoming) {
						return incoming;
					},
				},
			},
		},

		// Order Type Policies
		Order: {
			keyFields: ["id"],
			fields: {
				items: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				payments: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				shipments: {
					merge(existing = [], incoming) {
						return incoming;
					},
				},
			},
		},
	},
});

// ============================================================================
// APOLLO CLIENT INSTANCE - مثيل Apollo Client
// ============================================================================

export const apolloClient = new ApolloClient({
	link: from([errorLink, retryLink, authLink, httpLink]),
	cache,
	defaultOptions: {
		watchQuery: {
			errorPolicy: "all",
			fetchPolicy: "cache-and-network",
		},
		query: {
			errorPolicy: "all",
			fetchPolicy: "cache-first",
		},
		mutate: {
			errorPolicy: "all",
		},
	},
	connectToDevTools: process.env.NODE_ENV === "development",
});

// ============================================================================
// APOLLO CLIENT UTILITIES - أدوات Apollo Client
// ============================================================================

export class ApolloClientUtils {
	/**
	 * Clear cache for specific entity
	 */
	static clearCache(entity: string): void {
		cache.evict({ fieldName: entity });
		cache.gc();
	}

	/**
	 * Clear all cache
	 */
	static clearAllCache(): void {
		cache.reset();
	}

	/**
	 * Get cache size
	 */
	static getCacheSize(): number {
		const extracted = cache.extract();
		return typeof extracted.size === "number" ? extracted.size : 0;
	}

	/**
	 * Health check for Apollo Client
	 */
	static async healthCheck(): Promise<boolean> {
		try {
			const result = await apolloClient.query({
				query: gql`
					query HealthCheck {
						__typename
					}
				`,
				fetchPolicy: "network-only",
			});
			return !!result.data;
		} catch (error) {
			console.error("Apollo Client health check failed:", error);
			return false;
		}
	}
}

export default apolloClient;
