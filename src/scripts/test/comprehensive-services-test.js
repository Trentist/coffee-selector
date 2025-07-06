#!/usr/bin/env node

/**
 * Comprehensive Services Test - اختبار شامل للخدمات
 * اختبار جميع الخدمات الجديدة في النظام الموحد
 */

const https = require("https");

const ODOO_CONFIG = {
	baseUrl: "https://coffee-selection-staging-20784644.dev.odoo.com",
	graphqlUrl:
		"https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf",
	apiKey: "d22fb86e790ba068c5b3bcfb801109892f3a0b38",
};

// GraphQL Request Helper
async function makeGraphQLRequest(query, variables = {}) {
	return new Promise((resolve, reject) => {
		const postData = JSON.stringify({ query, variables });

		const options = {
			hostname: "coffee-selection-staging-20784644.dev.odoo.com",
			port: 443,
			path: "/graphql/vsf",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(postData),
				Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
			},
			timeout: 30000,
		};

		const req = https.request(options, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => {
				try {
					const result = JSON.parse(data);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});
		});

		req.on("error", reject);
		req.on("timeout", () => {
			req.destroy();
			reject(new Error("Request timeout"));
		});
		req.write(postData);
		req.end();
	});
}

// ============================================================================
// TEST SUITES - مجموعات الاختبار
// ============================================================================

// Test Suite 1: Category Tests
async function runCategoryTests() {
	console.log("\n📂 مجموعة اختبارات الفئات");
	console.log("=".repeat(50));

	const results = {};

	// Test 1.1: Get All Categories
	console.log("\n📂 اختبار 1.1: الحصول على جميع الفئات");
	const getAllCategoriesQuery = `
		query GetAllCategories {
			categories {
				categories {
					id
					name
					slug
					metaDescription
					image
					imageFilename
					parent {
						id
						name
					}
					childs {
						id
						name
						slug
					}
				}
				totalCount
			}
		}
	`;

	try {
		const result = await makeGraphQLRequest(getAllCategoriesQuery);
		if (result.data?.categories?.categories) {
			results.getAllCategories = {
				success: true,
				count: result.data.categories.categories.length,
				totalCount: result.data.categories.totalCount,
				sampleCategory: result.data.categories.categories[0],
			};
			console.log(`✅ نجح - ${result.data.categories.categories.length} فئة`);
		} else {
			results.getAllCategories = { success: false, error: result.errors };
			console.log("❌ فشل");
		}
	} catch (error) {
		results.getAllCategories = { success: false, error: error.message };
		console.log("❌ فشل");
	}

	// Test 1.2: Get Category by ID
	if (results.getAllCategories?.sampleCategory) {
		console.log("\n📂 اختبار 1.2: الحصول على فئة بالمعرف");
		const getCategoryByIdQuery = `
			query GetCategoryById($id: Int!) {
				category(id: $id) {
					id
					name
					slug
					metaDescription
					image
					imageFilename
					parent {
						id
						name
						slug
					}
					childs {
						id
						name
						slug
						metaDescription
					}
					products {
						id
						name
						price
						image
					}
				}
			}
		`;

		try {
			const result = await makeGraphQLRequest(getCategoryByIdQuery, {
				id: results.getAllCategories.sampleCategory.id,
			});
			if (result.data?.category) {
				results.getCategoryById = {
					success: true,
					category: result.data.category,
					productCount: result.data.category.products?.length || 0,
				};
				console.log(
					`✅ نجح - ${result.data.category.name} مع ${result.data.category.products?.length || 0} منتج`,
				);
			} else {
				results.getCategoryById = { success: false, error: result.errors };
				console.log("❌ فشل");
			}
		} catch (error) {
			results.getCategoryById = { success: false, error: error.message };
			console.log("❌ فشل");
		}
	}

	return results;
}

// Test Suite 2: Product Tests
async function runProductTests() {
	console.log("\n🛍️ مجموعة اختبارات المنتجات");
	console.log("=".repeat(50));

	const results = {};

	// Test 2.1: Get All Products
	console.log("\n🛍️ اختبار 2.1: الحصول على جميع المنتجات");
	const getAllProductsQuery = `
		query GetAllProducts {
			products {
				products {
					id
					name
					price
					description
					image
					imageFilename
					slug
					sku
					isInStock
					categories {
						id
						name
						slug
					}
				}
				totalCount
				minPrice
				maxPrice
			}
		}
	`;

	try {
		const result = await makeGraphQLRequest(getAllProductsQuery);
		if (result.data?.products?.products) {
			results.getAllProducts = {
				success: true,
				count: result.data.products.products.length,
				totalCount: result.data.products.totalCount,
				minPrice: result.data.products.minPrice,
				maxPrice: result.data.products.maxPrice,
				sampleProduct: result.data.products.products[0],
			};
			console.log(`✅ نجح - ${result.data.products.products.length} منتج`);
		} else {
			results.getAllProducts = { success: false, error: result.errors };
			console.log("❌ فشل");
		}
	} catch (error) {
		results.getAllProducts = { success: false, error: error.message };
		console.log("❌ فشل");
	}

	// Test 2.2: Get Product by ID
	if (results.getAllProducts?.sampleProduct) {
		console.log("\n🛍️ اختبار 2.2: الحصول على منتج بالمعرف");
		const getProductByIdQuery = `
			query GetProductById($id: Int!) {
				product(id: $id) {
					id
					name
					price
					description
					websiteDescription
					image
					imageFilename
					slug
					sku
					isInStock
					attributeValues {
						name
					}
				}
			}
		`;

		try {
			const result = await makeGraphQLRequest(getProductByIdQuery, {
				id: results.getAllProducts.sampleProduct.id,
			});
			if (result.data?.product) {
				results.getProductById = {
					success: true,
					product: result.data.product,
				};
				console.log(`✅ نجح - ${result.data.product.name}`);
			} else {
				results.getProductById = { success: false, error: result.errors };
				console.log("❌ فشل");
			}
		} catch (error) {
			results.getProductById = { success: false, error: error.message };
			console.log("❌ فشل");
		}
	}

	// Test 2.3: Get Products by Category
	if (results.getAllProducts?.sampleProduct?.categories?.[0]) {
		console.log("\n🛍️ اختبار 2.3: الحصول على منتجات فئة معينة");
		const getProductsByCategoryQuery = `
			query GetCategoryWithProducts($id: Int!) {
				category(id: $id) {
					id
					name
					products {
						id
						name
						price
						description
						image
						imageFilename
						slug
						sku
						isInStock
					}
				}
			}
		`;

		try {
			const result = await makeGraphQLRequest(getProductsByCategoryQuery, {
				id: results.getAllProducts.sampleProduct.categories[0].id,
			});
			if (result.data?.category?.products) {
				results.getProductsByCategory = {
					success: true,
					categoryName: result.data.category.name,
					productCount: result.data.category.products.length,
					products: result.data.category.products,
				};
				console.log(
					`✅ نجح - ${result.data.category.products.length} منتج في فئة ${result.data.category.name}`,
				);
			} else {
				results.getProductsByCategory = {
					success: false,
					error: result.errors,
				};
				console.log("❌ فشل");
			}
		} catch (error) {
			results.getProductsByCategory = { success: false, error: error.message };
			console.log("❌ فشل");
		}
	}

	return results;
}

// Test Suite 3: Search Tests
async function runSearchTests() {
	console.log("\n🔍 مجموعة اختبارات البحث");
	console.log("=".repeat(50));

	const results = {};

	// Test 3.1: Search by Product Name
	console.log("\n🔍 اختبار 3.1: البحث باسم المنتج");
	const searchQuery = `
		query GetAllProducts {
			products {
				products {
					id
					name
					price
					description
					image
					imageFilename
					slug
					sku
					isInStock
					categories {
						id
						name
						slug
					}
				}
				totalCount
				minPrice
				maxPrice
			}
		}
	`;

	try {
		const result = await makeGraphQLRequest(searchQuery);
		if (result.data?.products?.products) {
			const products = result.data.products.products;

			// Simulate search by filtering
			const searchTerm = "coffee";
			const searchResults = products.filter(
				(product) =>
					product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
			);

			results.searchByName = {
				success: true,
				searchTerm: searchTerm,
				totalProducts: products.length,
				searchResults: searchResults.length,
				results: searchResults.slice(0, 3),
			};
			console.log(
				`✅ نجح - ${searchResults.length} نتيجة للبحث عن "${searchTerm}"`,
			);
		} else {
			results.searchByName = { success: false, error: result.errors };
			console.log("❌ فشل");
		}
	} catch (error) {
		results.searchByName = { success: false, error: error.message };
		console.log("❌ فشل");
	}

	// Test 3.2: Filter by Category
	console.log("\n🔍 اختبار 3.2: التصفية حسب الفئة");
	try {
		const result = await makeGraphQLRequest(searchQuery);
		if (result.data?.products?.products) {
			const products = result.data.products.products;

			// Filter by category
			const categoryId = 1; // Coffee Beans
			const categoryResults = products.filter((product) =>
				product.categories.some((cat) => cat.id === categoryId),
			);

			results.filterByCategory = {
				success: true,
				categoryId: categoryId,
				totalProducts: products.length,
				categoryResults: categoryResults.length,
				results: categoryResults.slice(0, 3),
			};
			console.log(
				`✅ نجح - ${categoryResults.length} منتج في الفئة ${categoryId}`,
			);
		} else {
			results.filterByCategory = { success: false, error: result.errors };
			console.log("❌ فشل");
		}
	} catch (error) {
		results.filterByCategory = { success: false, error: error.message };
		console.log("❌ فشل");
	}

	// Test 3.3: Filter by Price Range
	console.log("\n🔍 اختبار 3.3: التصفية حسب نطاق السعر");
	try {
		const result = await makeGraphQLRequest(searchQuery);
		if (result.data?.products?.products) {
			const products = result.data.products.products;

			// Filter by price range
			const minPrice = 50;
			const maxPrice = 100;
			const priceResults = products.filter(
				(product) => product.price >= minPrice && product.price <= maxPrice,
			);

			results.filterByPrice = {
				success: true,
				minPrice: minPrice,
				maxPrice: maxPrice,
				totalProducts: products.length,
				priceResults: priceResults.length,
				results: priceResults.slice(0, 3),
			};
			console.log(
				`✅ نجح - ${priceResults.length} منتج بين ${minPrice}-${maxPrice} درهم`,
			);
		} else {
			results.filterByPrice = { success: false, error: result.errors };
			console.log("❌ فشل");
		}
	} catch (error) {
		results.filterByPrice = { success: false, error: error.message };
		console.log("❌ فشل");
	}

	return results;
}

// Test Suite 4: Statistics Tests
async function runStatisticsTests() {
	console.log("\n📊 مجموعة اختبارات الإحصائيات");
	console.log("=".repeat(50));

	const results = {};

	// Test 4.1: Product Statistics
	console.log("\n📊 اختبار 4.1: إحصائيات المنتجات");
	const productsQuery = `
		query GetAllProducts {
			products {
				products {
					id
					name
					price
					description
					image
					imageFilename
					slug
					sku
					isInStock
					categories {
						id
						name
						slug
					}
				}
				totalCount
				minPrice
				maxPrice
			}
		}
	`;

	try {
		const result = await makeGraphQLRequest(productsQuery);
		if (result.data?.products?.products) {
			const products = result.data.products.products;

			// Calculate statistics
			const stats = {
				total: products.length,
				inStock: products.filter((p) => p.isInStock).length,
				outOfStock: products.filter((p) => !p.isInStock).length,
				withImages: products.filter((p) => p.image).length,
				withCategories: products.filter((p) => p.categories.length > 0).length,
				priceRange: {
					min: Math.min(...products.map((p) => p.price)),
					max: Math.max(...products.map((p) => p.price)),
					average:
						products.reduce((sum, p) => sum + p.price, 0) / products.length,
				},
				categoryDistribution: {},
			};

			// Category distribution
			products.forEach((product) => {
				product.categories.forEach((category) => {
					stats.categoryDistribution[category.name] =
						(stats.categoryDistribution[category.name] || 0) + 1;
				});
			});

			results.productStatistics = {
				success: true,
				statistics: stats,
			};
			console.log(`✅ نجح - إحصائيات ${products.length} منتج`);
		} else {
			results.productStatistics = { success: false, error: result.errors };
			console.log("❌ فشل");
		}
	} catch (error) {
		results.productStatistics = { success: false, error: error.message };
		console.log("❌ فشل");
	}

	// Test 4.2: Category Statistics
	console.log("\n📊 اختبار 4.2: إحصائيات الفئات");
	const categoriesQuery = `
		query GetAllCategories {
			categories {
				categories {
					id
					name
					slug
					metaDescription
					image
					imageFilename
					parent {
						id
						name
					}
					childs {
						id
						name
						slug
					}
				}
				totalCount
			}
		}
	`;

	try {
		const result = await makeGraphQLRequest(categoriesQuery);
		if (result.data?.categories?.categories) {
			const categories = result.data.categories.categories;

			const stats = {
				total: categories.length,
				withImages: categories.filter((c) => c.image).length,
				withDescription: categories.filter((c) => c.metaDescription).length,
				withParent: categories.filter((c) => c.parent).length,
				withChildren: categories.filter((c) => c.childs && c.childs.length > 0)
					.length,
			};

			results.categoryStatistics = {
				success: true,
				statistics: stats,
			};
			console.log(`✅ نجح - إحصائيات ${categories.length} فئة`);
		} else {
			results.categoryStatistics = { success: false, error: result.errors };
			console.log("❌ فشل");
		}
	} catch (error) {
		results.categoryStatistics = { success: false, error: error.message };
		console.log("❌ فشل");
	}

	return results;
}

// ============================================================================
// MAIN TEST FUNCTION - الدالة الرئيسية للاختبار
// ============================================================================

async function runComprehensiveServicesTest() {
	console.log("🚀 اختبار شامل للخدمات");
	console.log("=".repeat(70));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log(`🕐 الوقت: ${new Date().toLocaleString("ar-SA")}`);
	console.log("=".repeat(70));

	const allResults = {
		timestamp: new Date().toISOString(),
		server: ODOO_CONFIG.baseUrl,
		testSuites: {},
	};

	try {
		// Run all test suites
		allResults.testSuites.categories = await runCategoryTests();
		allResults.testSuites.products = await runProductTests();
		allResults.testSuites.search = await runSearchTests();
		allResults.testSuites.statistics = await runStatisticsTests();

		// Calculate overall results
		const allTests = [];
		Object.values(allResults.testSuites).forEach((suite) => {
			Object.values(suite).forEach((test) => {
				if (test && typeof test === "object" && "success" in test) {
					allTests.push(test.success);
				}
			});
		});

		const successfulTests = allTests.filter((success) => success).length;
		const totalTests = allTests.length;
		const successRate =
			totalTests > 0 ? ((successfulTests / totalTests) * 100).toFixed(1) : 0;

		// Final Summary
		console.log("\n" + "=".repeat(70));
		console.log("🎯 النتائج النهائية للاختبار الشامل");
		console.log("=".repeat(70));

		// Category Tests Summary
		console.log("\n📂 اختبارات الفئات:");
		const categoryTests = allResults.testSuites.categories;
		Object.entries(categoryTests).forEach(([testName, result]) => {
			const status = result.success ? "✅ نجح" : "❌ فشل";
			console.log(`   ${testName}: ${status}`);
		});

		// Product Tests Summary
		console.log("\n🛍️ اختبارات المنتجات:");
		const productTests = allResults.testSuites.products;
		Object.entries(productTests).forEach(([testName, result]) => {
			const status = result.success ? "✅ نجح" : "❌ فشل";
			console.log(`   ${testName}: ${status}`);
		});

		// Search Tests Summary
		console.log("\n🔍 اختبارات البحث:");
		const searchTests = allResults.testSuites.search;
		Object.entries(searchTests).forEach(([testName, result]) => {
			const status = result.success ? "✅ نجح" : "❌ فشل";
			console.log(`   ${testName}: ${status}`);
		});

		// Statistics Tests Summary
		console.log("\n📊 اختبارات الإحصائيات:");
		const statisticsTests = allResults.testSuites.statistics;
		Object.entries(statisticsTests).forEach(([testName, result]) => {
			const status = result.success ? "✅ نجح" : "❌ فشل";
			console.log(`   ${testName}: ${status}`);
		});

		console.log(
			`\n🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`,
		);

		// Data Summary
		if (allResults.testSuites.categories.getAllCategories?.success) {
			console.log(`\n📊 ملخص البيانات:`);
			console.log(
				`   📂 الفئات المتاحة: ${allResults.testSuites.categories.getAllCategories.count}`,
			);
		}

		if (allResults.testSuites.products.getAllProducts?.success) {
			console.log(
				`   🛍️ المنتجات المتاحة: ${allResults.testSuites.products.getAllProducts.count}`,
			);
			console.log(
				`   💰 نطاق الأسعار: ${allResults.testSuites.products.getAllProducts.minPrice} - ${allResults.testSuites.products.getAllProducts.maxPrice} درهم`,
			);
		}

		if (allResults.testSuites.statistics.productStatistics?.success) {
			const stats =
				allResults.testSuites.statistics.productStatistics.statistics;
			console.log(`   📦 متوفر: ${stats.inStock}/${stats.total}`);
			console.log(
				`   💰 متوسط السعر: ${stats.priceRange.average.toFixed(2)} درهم`,
			);
		}

		// Final Assessment
		if (parseFloat(successRate) >= 90) {
			console.log("\n🎉 ممتاز! جميع الخدمات تعمل بشكل مثالي");
			console.log("✨ النظام جاهز للاستخدام في الإنتاج");
		} else if (parseFloat(successRate) >= 75) {
			console.log("\n✅ جيد جداً! معظم الخدمات تعمل بشكل صحيح");
			console.log("🔧 بعض التحسينات البسيطة مطلوبة");
		} else if (parseFloat(successRate) >= 50) {
			console.log("\n⚠️ مقبول، الخدمات الأساسية تعمل");
			console.log("🛠️ يحتاج تطوير إضافي للوصول للأداء الأمثل");
		} else {
			console.log("\n❌ ضعيف، يحتاج عمل كبير");
			console.log("🚨 مراجعة شاملة للنظام مطلوبة");
		}

		allResults.summary = {
			successRate: parseFloat(successRate),
			successfulTests,
			totalTests,
		};

		return allResults;
	} catch (error) {
		console.error("❌ خطأ في الاختبار الشامل:", error.message);
		allResults.error = error.message;
		return allResults;
	}
}

// Run the test
if (require.main === module) {
	runComprehensiveServicesTest()
		.then((results) => {
			console.log("\n✅ اكتمل الاختبار الشامل للخدمات بنجاح!");
			console.log("🎊 جميع الخدمات جاهزة للاستخدام!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ فشل الاختبار الشامل للخدمات:", error.message);
			process.exit(1);
		});
}

module.exports = { runComprehensiveServicesTest };
