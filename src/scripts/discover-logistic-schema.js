/**
 * Logistic Schema Discovery Script
 * سكريبت استكشاف schema اللوجيستيك من GraphQL API
 */

const {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	gql,
} = require("@apollo/client");
const { setContext } = require("@apollo/client/link/context");

// ============================================================================
// APOLLO CLIENT SETUP
// ============================================================================

const httpLink = createHttpLink({
	uri:
		process.env.NEXT_PUBLIC_ODOO_GRAPHQL_URL ||
		"https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf",
});

const authLink = setContext((_, { headers }) => {
	const token =
		process.env.NEXT_PUBLIC_ODOO_API_KEY ||
		"d22fb86e790ba068c5b3bcfb801109892f3a0b38";
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

// ============================================================================
// SCHEMA INTROSPECTION QUERIES
// ============================================================================

const INTROSPECTION_QUERY = gql`
	query IntrospectionQuery {
		__schema {
			queryType {
				name
				fields {
					name
					description
					type {
						name
						kind
						ofType {
							name
							kind
						}
					}
					args {
						name
						description
						type {
							name
							kind
							ofType {
								name
								kind
							}
						}
					}
				}
			}
			mutationType {
				name
				fields {
					name
					description
					type {
						name
						kind
						ofType {
							name
							kind
						}
					}
					args {
						name
						description
						type {
							name
							kind
							ofType {
								name
								kind
							}
						}
					}
				}
			}
			types {
				name
				description
				kind
				fields {
					name
					description
					type {
						name
						kind
						ofType {
							name
							kind
						}
					}
				}
			}
		}
	}
`;

// ============================================================================
// LOGISTIC SPECIFIC QUERIES
// ============================================================================

const LOGISTIC_QUERIES = {
	// Shipping Methods
	GET_SHIPPING_METHODS: gql`
		query GetShippingMethods {
			shippingMethods {
				id
				name
				description
				price
				currency
				estimatedDays
				isActive
			}
		}
	`,

	// Shipping Tracking
	GET_SHIPPING_TRACKING: gql`
		query GetShippingTracking($trackingNumber: String!) {
			shippingTracking(trackingNumber: $trackingNumber) {
				tracking_number
				carrier
				status
				estimated_delivery
				events {
					date
					status
					location
					description
				}
			}
		}
	`,

	// Order Tracking
	GET_ORDER_TRACKING: gql`
		query GetOrderTracking($orderId: Int!) {
			orderTracking(orderId: $orderId) {
				order_id
				tracking_number
				carrier
				status
				estimated_delivery
				tracking_events {
					date
					status
					location
					description
				}
			}
		}
	`,

	// Shipments
	GET_SHIPMENTS: gql`
		query GetShipments {
			shipments {
				id
				order_id
				tracking_number
				carrier
				state
				created_at
				delivery_date
			}
		}
	`,

	// Aramex Specific
	GET_ARAMEX_RATES: gql`
		query GetAramexRates($input: AramexRateInput!) {
			aramexRates(input: $input) {
				rates {
					id
					name
					price
					currency
					estimatedDays
					serviceType
				}
			}
		}
	`,

	// Delivery Addresses
	GET_DELIVERY_ADDRESSES: gql`
		query GetDeliveryAddresses {
			deliveryAddresses {
				id
				name
				street
				city
				state
				country
				zipCode
				phone
				isDefault
			}
		}
	`,
};

// ============================================================================
// LOGISTIC MUTATIONS
// ============================================================================

const LOGISTIC_MUTATIONS = {
	// Create Shipping Label
	CREATE_SHIPPING_LABEL: gql`
		mutation CreateShippingLabel($orderId: Int!, $input: ShippingInput!) {
			createShippingLabel(orderId: $orderId, input: $input) {
				shipping {
					id
					order_id
					tracking_number
					carrier
					label_url
					state
					created_at
				}
				success
				message
			}
		}
	`,

	// Update Shipping Status
	UPDATE_SHIPPING_STATUS: gql`
		mutation UpdateShippingStatus($shippingId: Int!, $status: String!) {
			updateShippingStatus(shippingId: $shippingId, status: $status) {
				shipping {
					id
					tracking_number
					status
					updated_at
				}
				success
				message
			}
		}
	`,

	// Create Aramex Shipment
	CREATE_ARAMEX_SHIPMENT: gql`
		mutation CreateAramexShipment($input: AramexShipmentInput!) {
			createAramexShipment(input: $input) {
				shipment {
					id
					waybillNumber
					trackingUrl
					labelUrl
					cost
					estimatedDelivery
				}
				success
				message
			}
		}
	`,

	// Add Delivery Address
	ADD_DELIVERY_ADDRESS: gql`
		mutation AddDeliveryAddress($input: DeliveryAddressInput!) {
			addDeliveryAddress(input: $input) {
				address {
					id
					name
					street
					city
					state
					country
					zipCode
					phone
				}
				success
				message
			}
		}
	`,
};

// ============================================================================
// DISCOVERY FUNCTIONS
// ============================================================================

async function discoverSchema() {
	console.log("🔍 Discovering GraphQL Schema...\n");

	try {
		const { data } = await client.query({
			query: INTROSPECTION_QUERY,
			fetchPolicy: "network-only",
		});

		const schema = data.__schema;

		console.log("📋 Schema Overview:");
		console.log(`   Query Type: ${schema.queryType?.name || "None"}`);
		console.log(`   Mutation Type: ${schema.mutationType?.name || "None"}`);
		console.log(`   Total Types: ${schema.types.length}\n`);

		// Find logistic-related types
		const logisticTypes = schema.types.filter(
			(type) =>
				type.name &&
				(type.name.toLowerCase().includes("ship") ||
					type.name.toLowerCase().includes("logistic") ||
					type.name.toLowerCase().includes("delivery") ||
					type.name.toLowerCase().includes("tracking") ||
					type.name.toLowerCase().includes("aramex") ||
					type.name.toLowerCase().includes("carrier")),
		);

		console.log("🚚 Logistic-Related Types:");
		logisticTypes.forEach((type) => {
			console.log(`   📦 ${type.name} (${type.kind})`);
			if (type.description) {
				console.log(`      Description: ${type.description}`);
			}
			if (type.fields && type.fields.length > 0) {
				console.log(
					`      Fields: ${type.fields.map((f) => f.name).join(", ")}`,
				);
			}
			console.log("");
		});

		// Find logistic-related queries
		const logisticQueries =
			schema.queryType?.fields?.filter(
				(field) =>
					field.name.toLowerCase().includes("ship") ||
					field.name.toLowerCase().includes("logistic") ||
					field.name.toLowerCase().includes("delivery") ||
					field.name.toLowerCase().includes("tracking") ||
					field.name.toLowerCase().includes("aramex") ||
					field.name.toLowerCase().includes("carrier"),
			) || [];

		console.log("🔍 Logistic-Related Queries:");
		logisticQueries.forEach((query) => {
			console.log(`   📋 ${query.name}`);
			if (query.description) {
				console.log(`      Description: ${query.description}`);
			}
			if (query.args && query.args.length > 0) {
				console.log(
					`      Arguments: ${query.args.map((a) => `${a.name}: ${a.type.name || a.type.ofType?.name}`).join(", ")}`,
				);
			}
			console.log(
				`      Return Type: ${query.type.name || query.type.ofType?.name}\n`,
			);
		});

		// Find logistic-related mutations
		const logisticMutations =
			schema.mutationType?.fields?.filter(
				(field) =>
					field.name.toLowerCase().includes("ship") ||
					field.name.toLowerCase().includes("logistic") ||
					field.name.toLowerCase().includes("delivery") ||
					field.name.toLowerCase().includes("tracking") ||
					field.name.toLowerCase().includes("aramex") ||
					field.name.toLowerCase().includes("carrier"),
			) || [];

		console.log("⚡ Logistic-Related Mutations:");
		logisticMutations.forEach((mutation) => {
			console.log(`   🔧 ${mutation.name}`);
			if (mutation.description) {
				console.log(`      Description: ${mutation.description}`);
			}
			if (mutation.args && mutation.args.length > 0) {
				console.log(
					`      Arguments: ${mutation.args.map((a) => `${a.name}: ${a.type.name || a.type.ofType?.name}`).join(", ")}`,
				);
			}
			console.log(
				`      Return Type: ${mutation.type.name || mutation.type.ofType?.name}\n`,
			);
		});

		return { schema, logisticTypes, logisticQueries, logisticMutations };
	} catch (error) {
		console.error("❌ Error discovering schema:", error.message);
		return null;
	}
}

async function testLogisticQueries() {
	console.log("🧪 Testing Logistic Queries...\n");

	const results = {};

	for (const [name, query] of Object.entries(LOGISTIC_QUERIES)) {
		try {
			console.log(`   Testing ${name}...`);

			let variables = {};
			if (name === "GET_SHIPPING_TRACKING") {
				variables = { trackingNumber: "TEST123" };
			} else if (name === "GET_ORDER_TRACKING") {
				variables = { orderId: 1 };
			} else if (name === "GET_ARAMEX_RATES") {
				variables = {
					input: {
						origin: { city: "Dubai", country: "AE" },
						destination: { city: "Abu Dhabi", country: "AE" },
						weight: 1.5,
						pieces: 1,
					},
				};
			}

			const { data } = await client.query({
				query,
				variables,
				fetchPolicy: "network-only",
			});

			results[name] = { success: true, data };
			console.log(`   ✅ ${name} - Success`);

			// Log sample data
			const sampleData = JSON.stringify(data, null, 2).substring(0, 200);
			console.log(`   📊 Sample Data: ${sampleData}...\n`);
		} catch (error) {
			results[name] = { success: false, error: error.message };
			console.log(`   ❌ ${name} - Error: ${error.message}\n`);
		}
	}

	return results;
}

async function testLogisticMutations() {
	console.log("🧪 Testing Logistic Mutations...\n");

	const results = {};

	for (const [name, mutation] of Object.entries(LOGISTIC_MUTATIONS)) {
		try {
			console.log(`   Testing ${name}...`);

			let variables = {};
			if (name === "CREATE_SHIPPING_LABEL") {
				variables = {
					orderId: 1,
					input: {
						carrier: "aramex",
						service: "express",
						weight: 1.5,
						dimensions: { length: 10, width: 10, height: 10 },
					},
				};
			} else if (name === "UPDATE_SHIPPING_STATUS") {
				variables = { shippingId: 1, status: "in_transit" };
			} else if (name === "CREATE_ARAMEX_SHIPMENT") {
				variables = {
					input: {
						orderId: 1,
						origin: { city: "Dubai", country: "AE" },
						destination: { city: "Abu Dhabi", country: "AE" },
						weight: 1.5,
						pieces: 1,
					},
				};
			} else if (name === "ADD_DELIVERY_ADDRESS") {
				variables = {
					input: {
						name: "Test Address",
						street: "Test Street",
						city: "Dubai",
						state: "Dubai",
						country: "AE",
						zipCode: "12345",
						phone: "+971501234567",
					},
				};
			}

			const { data } = await client.mutate({
				mutation,
				variables,
			});

			results[name] = { success: true, data };
			console.log(`   ✅ ${name} - Success`);

			// Log sample data
			const sampleData = JSON.stringify(data, null, 2).substring(0, 200);
			console.log(`   📊 Sample Data: ${sampleData}...\n`);
		} catch (error) {
			results[name] = { success: false, error: error.message };
			console.log(`   ❌ ${name} - Error: ${error.message}\n`);
		}
	}

	return results;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
	console.log("🚚 Logistic Schema Discovery Tool\n");
	console.log("=".repeat(50));

	// Step 1: Discover Schema
	const schemaInfo = await discoverSchema();

	if (!schemaInfo) {
		console.log("❌ Failed to discover schema. Exiting...");
		return;
	}

	console.log("=".repeat(50));

	// Step 2: Test Queries
	const queryResults = await testLogisticQueries();

	console.log("=".repeat(50));

	// Step 3: Test Mutations
	const mutationResults = await testLogisticMutations();

	console.log("=".repeat(50));

	// Step 4: Summary
	console.log("📊 Summary:");
	console.log(`   📦 Logistic Types Found: ${schemaInfo.logisticTypes.length}`);
	console.log(
		`   🔍 Logistic Queries Found: ${schemaInfo.logisticQueries.length}`,
	);
	console.log(
		`   ⚡ Logistic Mutations Found: ${schemaInfo.logisticMutations.length}`,
	);

	const successfulQueries = Object.values(queryResults).filter(
		(r) => r.success,
	).length;
	const successfulMutations = Object.values(mutationResults).filter(
		(r) => r.success,
	).length;

	console.log(
		`   ✅ Successful Queries: ${successfulQueries}/${Object.keys(queryResults).length}`,
	);
	console.log(
		`   ✅ Successful Mutations: ${successfulMutations}/${Object.keys(mutationResults).length}`,
	);

	console.log("\n🎉 Discovery Complete!");
}

// Run the discovery
if (require.main === module) {
	main().catch(console.error);
}

module.exports = {
	discoverSchema,
	testLogisticQueries,
	testLogisticMutations,
	LOGISTIC_QUERIES,
	LOGISTIC_MUTATIONS,
};
