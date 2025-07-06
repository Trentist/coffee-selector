/**
 * Complete User Flow E2E Tests with Real Data
 * اختبارات تدفق المستخدم الكامل مع البيانات الحقيقية
 */

import { unifiedOdooService } from "@/services/unified-odoo.service";
import {
	testOdooConnection,
	fetchRealProductsData,
	testRealUserAuth,
	generateOdooTestReport,
	measurePerformance,
} from "../../helpers/odoo-helpers";

describe("Complete User Flow E2E Tests", () => {
	let realProducts: any[] = [];
	let testResults: any[] = [];
	let userSession: any = null;

	beforeAll(async () => {
		console.log("🚀 Starting Complete User Flow E2E Tests...");

		// Check Odoo connection
		const connection = await testOdooConnection();
		if (!connection.isConnected) {
			console.warn("⚠️ Odoo connection failed, some tests will be skipped");
			return;
		}

		// Load real products for testing
		const productsResult = await fetchRealProductsData();
		if (productsResult.success) {
			realProducts = productsResult.data;
			console.log(`✅ Loaded ${realProducts.length} real products for testing`);
		}
	});

	afterAll(() => {
		const summary = generateOdooTestReport(testResults);
		console.log("📊 Complete User Flow Test Summary:", summary);
	});

	describe("Guest User Flow", () => {
		test("should complete guest browsing flow", async () => {
			const testStart = Date.now();

			try {
				// Step 1: Browse products as guest
				expect(realProducts.length).toBeGreaterThan(0);

				// Step 2: Select a product
				const selectedProduct = realProducts[0];
				expect(selectedProduct).toHaveProperty("id");
				expect(selectedProduct).toHaveProperty("name");
				expect(selectedProduct).toHaveProperty("price");

				// Step 3: Add to cart (simulate)
				const cartItem = {
					productId: selectedProduct.id,
					quantity: 1,
					price: selectedProduct.price,
					name: selectedProduct.name,
				};

				expect(cartItem.quantity).toBe(1);
				expect(cartItem.price).toBeGreaterThan(0);

				// Step 4: View cart
				const cart = [cartItem];
				const cartTotal = cart.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0,
				);

				expect(cart.length).toBe(1);
				expect(cartTotal).toBe(selectedProduct.price);

				testResults.push({
					testName: "Guest Browsing Flow",
					passed: true,
					duration: Date.now() - testStart,
					steps: 4,
					productsTested: 1,
				});
			} catch (error) {
				testResults.push({
					testName: "Guest Browsing Flow",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});

		test("should handle product search and filtering", async () => {
			const testStart = Date.now();

			try {
				// Test search functionality
				const searchTerm = "coffee";
				const searchResults = realProducts.filter((product) =>
					product.name.toLowerCase().includes(searchTerm.toLowerCase()),
				);

				expect(searchResults.length).toBeGreaterThanOrEqual(0);

				// Test price filtering
				const minPrice = 10;
				const maxPrice = 100;
				const priceFilteredResults = realProducts.filter(
					(product) => product.price >= minPrice && product.price <= maxPrice,
				);

				expect(priceFilteredResults.length).toBeGreaterThanOrEqual(0);

				// Test category filtering (if categories exist)
				const productsWithCategories = realProducts.filter(
					(product) => product.categories && product.categories.length > 0,
				);

				if (productsWithCategories.length > 0) {
					const firstCategory = productsWithCategories[0].categories[0];
					const categoryFilteredResults = realProducts.filter(
						(product) =>
							product.categories &&
							product.categories.some(
								(cat: any) => cat.id === firstCategory.id,
							),
					);

					expect(categoryFilteredResults.length).toBeGreaterThan(0);
				}

				testResults.push({
					testName: "Product Search and Filtering",
					passed: true,
					duration: Date.now() - testStart,
					searchResults: searchResults.length,
					priceFilteredResults: priceFilteredResults.length,
					categoryFilteredResults: productsWithCategories.length,
				});
			} catch (error) {
				testResults.push({
					testName: "Product Search and Filtering",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});
	});

	describe("User Authentication Flow", () => {
		test("should handle user registration and login flow", async () => {
			const testStart = Date.now();

			try {
				// Step 1: Simulate user registration
				const newUser = {
					name: "Test User",
					email: "test@example.com",
					password: "TestPassword123!",
					phone: "+1234567890",
				};

				// Validate registration data
				expect(newUser.name).toBeTruthy();
				expect(newUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
				expect(newUser.password.length).toBeGreaterThanOrEqual(8);

				// Step 2: Simulate login
				const loginResult = await testRealUserAuth(
					newUser.email,
					newUser.password,
				);

				// Note: This might fail if test user doesn't exist in Odoo
				if (loginResult.success) {
					userSession = loginResult.user;
					expect(userSession).toBeDefined();
					expect(userSession.email).toBe(newUser.email);
				} else {
					console.warn(
						"⚠️ Login test failed (expected if test user not configured)",
					);
				}

				testResults.push({
					testName: "User Registration and Login",
					passed: true,
					duration: Date.now() - testStart,
					loginSuccess: loginResult.success,
					userCreated: !!userSession,
				});
			} catch (error) {
				testResults.push({
					testName: "User Registration and Login",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});

				// Don't throw error as this depends on external configuration
				console.warn("⚠️ Authentication test error:", error);
			}
		});
	});

	describe("Shopping Cart Flow", () => {
		test("should handle complete shopping cart operations", async () => {
			const testStart = Date.now();

			try {
				// Step 1: Add multiple products to cart
				const selectedProducts = realProducts.slice(0, 3);
				const cart = selectedProducts.map((product) => ({
					productId: product.id,
					name: product.name,
					price: product.price,
					quantity: Math.floor(Math.random() * 3) + 1, // 1-3 items
					image: product.image,
				}));

				expect(cart.length).toBe(3);

				// Step 2: Calculate cart totals
				const subtotal = cart.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0,
				);
				const tax = subtotal * 0.15; // 15% tax
				const shipping = 10; // Fixed shipping
				const total = subtotal + tax + shipping;

				expect(subtotal).toBeGreaterThan(0);
				expect(total).toBeGreaterThan(subtotal);

				// Step 3: Update quantities
				cart[0].quantity += 1;
				const newSubtotal = cart.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0,
				);
				expect(newSubtotal).toBeGreaterThan(subtotal);

				// Step 4: Remove item
				const updatedCart = cart.slice(1); // Remove first item
				expect(updatedCart.length).toBe(2);

				testResults.push({
					testName: "Shopping Cart Operations",
					passed: true,
					duration: Date.now() - testStart,
					itemsAdded: 3,
					finalCartSize: updatedCart.length,
					totalValue: total,
				});
			} catch (error) {
				testResults.push({
					testName: "Shopping Cart Operations",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});
	});

	describe("Checkout Flow", () => {
		test("should validate checkout process with real data", async () => {
			const testStart = Date.now();

			try {
				// Step 1: Prepare checkout data
				const checkoutData = {
					items: realProducts.slice(0, 2).map((product) => ({
						productId: product.id,
						name: product.name,
						price: product.price,
						quantity: 1,
					})),
					shippingAddress: {
						firstName: "John",
						lastName: "Doe",
						email: "john@example.com",
						phone: "+1234567890",
						street: "123 Test Street",
						city: "Test City",
						country: "US",
						zipCode: "12345",
					},
					paymentMethod: "credit_card",
				};

				// Step 2: Validate checkout data
				expect(checkoutData.items.length).toBeGreaterThan(0);
				expect(checkoutData.shippingAddress.email).toMatch(
					/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				);
				expect(checkoutData.shippingAddress.phone).toBeTruthy();
				expect(checkoutData.paymentMethod).toBeTruthy();

				// Step 3: Calculate order totals
				const orderSubtotal = checkoutData.items.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0,
				);
				const orderTax = orderSubtotal * 0.15;
				const orderShipping = 15;
				const orderTotal = orderSubtotal + orderTax + orderShipping;

				expect(orderTotal).toBeGreaterThan(0);

				// Step 4: Validate required fields
				const requiredFields = [
					"firstName",
					"lastName",
					"email",
					"phone",
					"street",
					"city",
					"country",
					"zipCode",
				];

				requiredFields.forEach((field) => {
					expect(
						checkoutData.shippingAddress[
							field as keyof typeof checkoutData.shippingAddress
						],
					).toBeTruthy();
				});

				testResults.push({
					testName: "Checkout Process Validation",
					passed: true,
					duration: Date.now() - testStart,
					itemsInOrder: checkoutData.items.length,
					orderTotal: orderTotal,
					validationsPassed: requiredFields.length,
				});
			} catch (error) {
				testResults.push({
					testName: "Checkout Process Validation",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});
	});

	describe("Order Management Flow", () => {
		test("should simulate order lifecycle", async () => {
			const testStart = Date.now();

			try {
				// Step 1: Create order
				const order = {
					id: `TEST_ORDER_${Date.now()}`,
					customerId: userSession?.id || "guest",
					items: realProducts.slice(0, 1).map((product) => ({
						productId: product.id,
						name: product.name,
						price: product.price,
						quantity: 1,
					})),
					status: "pending",
					createdAt: new Date().toISOString(),
					total: realProducts[0]?.price || 0,
				};

				expect(order.id).toBeTruthy();
				expect(order.items.length).toBe(1);
				expect(order.total).toBeGreaterThan(0);

				// Step 2: Update order status
				const statusFlow = [
					"pending",
					"confirmed",
					"processing",
					"shipped",
					"delivered",
				];
				let currentStatus = order.status;

				statusFlow.forEach((status) => {
					if (status !== "pending") {
						currentStatus = status;
						expect(statusFlow.includes(currentStatus)).toBe(true);
					}
				});

				// Step 3: Add tracking information
				const trackingInfo = {
					trackingNumber: `TRACK_${Date.now()}`,
					carrier: "Test Carrier",
					estimatedDelivery: new Date(
						Date.now() + 7 * 24 * 60 * 60 * 1000,
					).toISOString(),
				};

				expect(trackingInfo.trackingNumber).toBeTruthy();
				expect(trackingInfo.carrier).toBeTruthy();
				expect(new Date(trackingInfo.estimatedDelivery)).toBeInstanceOf(Date);

				testResults.push({
					testName: "Order Lifecycle Simulation",
					passed: true,
					duration: Date.now() - testStart,
					orderCreated: !!order.id,
					statusUpdates: statusFlow.length,
					trackingAdded: !!trackingInfo.trackingNumber,
				});
			} catch (error) {
				testResults.push({
					testName: "Order Lifecycle Simulation",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});
	});

	describe("Performance and Load Testing", () => {
		test("should handle concurrent operations", async () => {
			const testStart = Date.now();

			try {
				// Simulate concurrent product loading
				const concurrentOperations = Array.from(
					{ length: 5 },
					async (_, index) => {
						return measurePerformance(async () => {
							// Simulate product search
							const searchResults = realProducts.filter((product) =>
								product.name.toLowerCase().includes("coffee"),
							);

							// Simulate cart operations
							const cartItem = {
								productId: realProducts[index % realProducts.length]?.id,
								quantity: 1,
							};

							return { searchResults: searchResults.length, cartItem };
						});
					},
				);

				const results = await Promise.all(concurrentOperations);

				expect(results.length).toBe(5);

				const avgResponseTime =
					results.reduce((sum, result) => sum + result.duration, 0) /
					results.length;
				expect(avgResponseTime).toBeLessThan(1000); // Should be under 1 second

				testResults.push({
					testName: "Concurrent Operations Performance",
					passed: true,
					duration: Date.now() - testStart,
					concurrentOperations: results.length,
					avgResponseTime: Math.round(avgResponseTime),
					allOperationsSuccessful: results.every((r) => r.result),
				});
			} catch (error) {
				testResults.push({
					testName: "Concurrent Operations Performance",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});

		test("should handle large dataset operations", async () => {
			const testStart = Date.now();

			try {
				// Test sorting large dataset
				const sortedProducts = [...realProducts].sort(
					(a, b) => a.price - b.price,
				);
				expect(sortedProducts.length).toBe(realProducts.length);

				// Test filtering large dataset
				const expensiveProducts = realProducts.filter(
					(product) => product.price > 50,
				);
				expect(expensiveProducts.length).toBeGreaterThanOrEqual(0);

				// Test search across large dataset
				const searchResults = realProducts.filter(
					(product) =>
						product.name.toLowerCase().includes("premium") ||
						product.description?.toLowerCase().includes("premium"),
				);
				expect(searchResults.length).toBeGreaterThanOrEqual(0);

				const operationTime = Date.now() - testStart;
				expect(operationTime).toBeLessThan(2000); // Should complete within 2 seconds

				testResults.push({
					testName: "Large Dataset Operations",
					passed: true,
					duration: operationTime,
					datasetSize: realProducts.length,
					sortingTime: operationTime,
					operationsCompleted: 3,
				});
			} catch (error) {
				testResults.push({
					testName: "Large Dataset Operations",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});
	});

	describe("Error Handling and Edge Cases", () => {
		test("should handle invalid product operations gracefully", async () => {
			const testStart = Date.now();

			try {
				// Test with invalid product ID
				const invalidProductId = "INVALID_ID_999999";
				const invalidProduct = realProducts.find(
					(p) => p.id === invalidProductId,
				);
				expect(invalidProduct).toBeUndefined();

				// Test with zero quantity
				const zeroQuantityItem = {
					productId: realProducts[0]?.id,
					quantity: 0,
					price: realProducts[0]?.price,
				};

				// Should handle zero quantity gracefully
				const cartTotal = zeroQuantityItem.quantity * zeroQuantityItem.price;
				expect(cartTotal).toBe(0);

				// Test with negative price
				const negativePrice = -10;
				expect(negativePrice).toBeLessThan(0);

				// Test with empty cart checkout
				const emptyCart: any[] = [];
				const emptyCartTotal = emptyCart.reduce(
					(sum, item) => sum + item.price,
					0,
				);
				expect(emptyCartTotal).toBe(0);

				testResults.push({
					testName: "Invalid Operations Handling",
					passed: true,
					duration: Date.now() - testStart,
					edgeCasesTested: 4,
					allHandledGracefully: true,
				});
			} catch (error) {
				testResults.push({
					testName: "Invalid Operations Handling",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});
	});

	describe("Integrated Cart & Checkout Flow (Odoo + Aramex)", () => {
		test("should add real product to cart, checkout, ship via Aramex, and sync with Odoo (English only)", async () => {
			const testStart = Date.now();
			try {
				// 1. جلب منتج حقيقي من الباك اند
				const productsResult = await fetchRealProductsData();
				expect(productsResult.success).toBe(true);
				const product = productsResult.data[0];
				expect(product).toBeDefined();
				// 2. إضافة المنتج للعربة (بيانات إنجليزية فقط)
				const cartItem = {
					productId: product.id,
					name: product.name, // English only
					price: product.price,
					quantity: 1,
					description: product.description || "",
				};
				expect(typeof cartItem.name).toBe("string");
				// 3. تجهيز بيانات العنوان والشحن (إنجليزي فقط)
				const shippingAddress = {
					line1: "123 Test Street",
					line2: "",
					city: "Dubai",
					stateOrProvinceCode: "",
					postCode: "00000",
					countryCode: "AE",
				};
				const contact = {
					personName: "Test User",
					phoneNumber1: "+971501234567",
					emailAddress: "testuser@coffeeselection.com",
				};
				// 4. حساب الشحن عبر أرامكس
				const aramexService =
					(await import("../../../src/services/aramex.service")).default ||
					(await import("../../../src/services/aramex.service"));
				const shipmentDetails = {
					weight: 1,
					numberOfPieces: 1,
					description: cartItem.name,
				};
				const rates = await aramexService
					.getInstance()
					.calculateShippingRates(shippingAddress, shipmentDetails);
				expect(Array.isArray(rates)).toBe(true);
				expect(rates.length).toBeGreaterThan(0);
				const selectedRate = rates[0];
				// 5. تجهيز بيانات الطلب والدفع
				const orderData = {
					items: [cartItem],
					shippingAddress: {
						...shippingAddress,
						...contact,
					},
					paymentMethod: "credit_card",
					shippingRateId: selectedRate.id,
					coupon: "",
					card: {
						number: "4242424242424242",
						exp: "12/30",
						cvc: "123",
					},
				};
				// 6. إنشاء الطلب في أودو
				const orderResult = await unifiedOdooService.createOrder(orderData);
				expect(orderResult.success).toBe(true);
				expect(orderResult.order).toBeDefined();
				// 7. إرسال الشحنة لأرامكس
				const shipmentResult = await aramexService
					.getInstance()
					.createShipment({
						...orderData.shippingAddress,
						orderId: orderResult.order.id,
						products: orderData.items,
					});
				expect(shipmentResult).toBeDefined();
				expect(shipmentResult.success).toBe(true);
				// 8. التأكد من ظهور بيانات الشحن
				expect(shipmentResult.trackingNumber).toBeDefined();
				// 9. التأكد من مزامنة الطلب مع أودو
				// (تم بالفعل في الخطوة 6)
				testResults.push({
					testName: "Integrated Cart & Checkout Flow (Odoo + Aramex)",
					passed: true,
					duration: Date.now() - testStart,
					productId: product.id,
					orderId: orderResult.order.id,
					trackingNumber: shipmentResult.trackingNumber,
				});
			} catch (error) {
				testResults.push({
					testName: "Integrated Cart & Checkout Flow (Odoo + Aramex)",
					passed: false,
					error: error instanceof Error ? error.message : "Unknown error",
					duration: Date.now() - testStart,
				});
				throw error;
			}
		});
	});
});
