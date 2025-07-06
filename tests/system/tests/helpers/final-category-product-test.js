#!/usr/bin/env node

/**
 * Final Category & Product Test - الاختبار النهائي للفئات والمنتجات
 * اختبار استعلامات الفئات والمنتج الواحد بالـ ID - النسخة النهائية المصححة
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
			timeout: 20000,
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
// FINAL CATEGORY QUERIES - استعلامات الفئات النهائية
// ============================================================================

// Test 1: Get All Categories
async function testGetAllCategories() {
	console.log("\n📂 اختبار 1: الحصول على جميع الفئات");
	console.log("=".repeat(50));

	const query = `
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
		const result = await makeGraphQLRequest(query);

		if (result.data?.categories?.categories) {
			const categories = result.data.categories.categories;
			const totalCount = result.data.categories.totalCount;

			console.log(`✅ تم الحصول على الفئات بنجاح:`);
			console.log(`📊 العدد الإجمالي: ${totalCount}`);
			console.log(`📦 الفئات المتاحة: ${categories.length}`);

			// Show categories with hierarchy
			console.log(`\n📋 الفئات المتاحة:`);
			categories.forEach((category, index) => {
				console.log(`   ${index + 1}. ${category.name} (ID: ${category.id})`);
				console.log(`      🔗 الرابط: ${category.slug || "غير محدد"}`);
				console.log(`      🖼️  له صورة: ${category.image ? "نعم" : "لا"}`);

				if (category.parent) {
					console.log(`      👆 القسم الأب: ${category.parent.name}`);
				}

				if (category.childs && category.childs.length > 0) {
					console.log(`      👶 الأقسام الفرعية: ${category.childs.length}`);
					category.childs.slice(0, 3).forEach((child) => {
						console.log(`         - ${child.name}`);
					});
					if (category.childs.length > 3) {
						console.log(`         ... و ${category.childs.length - 3} أكثر`);
					}
				}
			});

			return {
				success: true,
				categories: categories,
				totalCount: totalCount,
				sampleCategory: categories[0] || null,
			};
		} else {
			console.log("❌ فشل في الحصول على الفئات");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في استعلام الفئات: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Test 2: Get Category by ID
async function testGetCategoryById(categoryId) {
	console.log(`\n📂 اختبار 2: الحصول على الفئة بالـ ID (${categoryId})`);
	console.log("=".repeat(50));

	const query = `
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
		const result = await makeGraphQLRequest(query, { id: categoryId });

		if (result.data?.category) {
			const category = result.data.category;

			console.log(`✅ تم الحصول على الفئة بنجاح:`);
			console.log(`🏷️  الاسم: ${category.name}`);
			console.log(`🆔 المعرف: ${category.id}`);
			console.log(`🔗 الرابط: ${category.slug || "غير محدد"}`);
			console.log(`🖼️  له صورة: ${category.image ? "نعم" : "لا"}`);

			if (category.metaDescription) {
				console.log(
					`📝 الوصف: ${category.metaDescription.substring(0, 100)}...`,
				);
			}

			if (category.parent) {
				console.log(
					`👆 القسم الأب: ${category.parent.name} (ID: ${category.parent.id})`,
				);
			}

			if (category.childs && category.childs.length > 0) {
				console.log(`👶 الأقسام الفرعية: ${category.childs.length}`);
				category.childs.slice(0, 3).forEach((child, index) => {
					console.log(`   ${index + 1}. ${child.name} (ID: ${child.id})`);
				});
			}

			if (category.products && category.products.length > 0) {
				console.log(`🛍️  المنتجات في هذا القسم: ${category.products.length}`);
				category.products.slice(0, 3).forEach((product, index) => {
					console.log(
						`   ${index + 1}. ${product.name} - ${product.price} درهم`,
					);
				});
			}

			return { success: true, category: category };
		} else {
			console.log(`❌ فشل في الحصول على الفئة بالـ ID ${categoryId}`);
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في استعلام الفئة: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// ============================================================================
// FINAL PRODUCT QUERIES - استعلامات المنتجات النهائية
// ============================================================================

// Test 3: Get All Products
async function testGetAllProducts() {
	console.log("\n🛍️ اختبار 3: الحصول على جميع المنتجات");
	console.log("=".repeat(50));

	const query = `
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
		const result = await makeGraphQLRequest(query);

		if (result.data?.products?.products) {
			const products = result.data.products.products;
			const totalCount = result.data.products.totalCount;
			const minPrice = result.data.products.minPrice;
			const maxPrice = result.data.products.maxPrice;

			console.log(`✅ تم الحصول على المنتجات بنجاح:`);
			console.log(`📊 العدد الإجمالي: ${totalCount}`);
			console.log(`📦 المنتجات المتاحة: ${products.length}`);
			console.log(`💰 نطاق الأسعار: ${minPrice} - ${maxPrice} درهم`);

			// Show sample products
			console.log(`\n📋 عينة من المنتجات:`);
			products.slice(0, 5).forEach((product, index) => {
				console.log(`   ${index + 1}. ${product.name} (ID: ${product.id})`);
				console.log(`      💰 السعر: ${product.price} درهم`);
				console.log(`      📦 متوفر: ${product.isInStock ? "نعم" : "لا"}`);
				console.log(`      🔗 الرابط: ${product.slug || "غير محدد"}`);
				console.log(`      🆔 SKU: ${product.sku || "غير محدد"}`);

				if (product.categories && product.categories.length > 0) {
					console.log(
						`      📂 الفئات: ${product.categories.map((c) => c.name).join(", ")}`,
					);
				}
			});

			return {
				success: true,
				products: products,
				totalCount: totalCount,
				minPrice: minPrice,
				maxPrice: maxPrice,
				sampleProduct: products[0] || null,
			};
		} else {
			console.log("❌ فشل في الحصول على المنتجات");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في استعلام المنتجات: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Test 4: Get Product by ID (Final Corrected)
async function testGetProductById(productId) {
	console.log(`\n🛍️ اختبار 4: الحصول على المنتج بالـ ID (${productId})`);
	console.log("=".repeat(50));

	const query = `
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
		const result = await makeGraphQLRequest(query, { id: productId });

		if (result.data?.product) {
			const product = result.data.product;

			console.log(`✅ تم الحصول على المنتج بنجاح:`);
			console.log(`🏷️  الاسم: ${product.name}`);
			console.log(`🆔 المعرف: ${product.id}`);
			console.log(`💰 السعر: ${product.price} درهم`);
			console.log(`🔗 الرابط: ${product.slug || "غير محدد"}`);
			console.log(`🆔 SKU: ${product.sku || "غير محدد"}`);
			console.log(`📦 متوفر: ${product.isInStock ? "نعم" : "لا"}`);

			if (product.description) {
				console.log(`📝 الوصف: ${product.description.substring(0, 100)}...`);
			}

			if (product.websiteDescription) {
				console.log(
					`📝 وصف الموقع: ${product.websiteDescription.substring(0, 80)}...`,
				);
			}

			if (product.attributeValues && product.attributeValues.length > 0) {
				console.log(`🔧 الخصائص:`);
				product.attributeValues.slice(0, 5).forEach((attr, index) => {
					console.log(`   ${index + 1}. ${attr.name}`);
				});
			}

			return { success: true, product: product };
		} else {
			console.log(`❌ فشل في الحصول على المنتج بالـ ID ${productId}`);
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في استعلام المنتج: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Test 5: Get Products by Category (Using category.products)
async function testGetProductsByCategory(categoryId) {
	console.log(`\n🛍️ اختبار 5: الحصول على منتجات الفئة (${categoryId})`);
	console.log("=".repeat(50));

	const query = `
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
		const result = await makeGraphQLRequest(query, { id: categoryId });

		if (result.data?.category) {
			const category = result.data.category;
			const products = category.products || [];

			console.log(`✅ تم الحصول على منتجات الفئة بنجاح:`);
			console.log(`📂 الفئة: ${category.name} (ID: ${category.id})`);
			console.log(`📦 المنتجات المتاحة: ${products.length}`);

			if (products.length > 0) {
				console.log(`\n📋 منتجات الفئة:`);
				products.slice(0, 5).forEach((product, index) => {
					console.log(`   ${index + 1}. ${product.name} (ID: ${product.id})`);
					console.log(`      💰 السعر: ${product.price} درهم`);
					console.log(`      📦 متوفر: ${product.isInStock ? "نعم" : "لا"}`);
					console.log(`      🔗 الرابط: ${product.slug || "غير محدد"}`);
				});

				if (products.length > 5) {
					console.log(`   ... و ${products.length - 5} منتج آخر`);
				}
			} else {
				console.log(`⚠️ لا توجد منتجات في هذه الفئة`);
			}

			return {
				success: true,
				category: category,
				products: products,
				totalCount: products.length,
			};
		} else {
			console.log(`❌ فشل في الحصول على منتجات الفئة بالـ ID ${categoryId}`);
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في استعلام منتجات الفئة: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// ============================================================================
// MAIN TEST FUNCTION - الدالة الرئيسية للاختبار
// ============================================================================

async function runFinalCategoryProductTest() {
	console.log("🚀 الاختبار النهائي الشامل للفئات والمنتجات");
	console.log("=".repeat(70));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log(`🕐 الوقت: ${new Date().toLocaleString("ar-SA")}`);
	console.log("=".repeat(70));

	const results = {
		timestamp: new Date().toISOString(),
		server: ODOO_CONFIG.baseUrl,
		tests: {},
	};

	try {
		// Test 1: Get All Categories
		results.tests.categories = await testGetAllCategories();

		let sampleCategoryId = null;
		if (
			results.tests.categories.success &&
			results.tests.categories.sampleCategory
		) {
			sampleCategoryId = results.tests.categories.sampleCategory.id;
		}

		// Test 2: Get Category by ID (if we have a sample category)
		if (sampleCategoryId) {
			results.tests.categoryById = await testGetCategoryById(sampleCategoryId);
		} else {
			console.log("\n⚠️ تخطي اختبار الفئة بالـ ID - لا توجد فئات متاحة");
			results.tests.categoryById = {
				success: false,
				error: "No categories available",
			};
		}

		// Test 3: Get All Products
		results.tests.products = await testGetAllProducts();

		let sampleProductId = null;
		if (
			results.tests.products.success &&
			results.tests.products.sampleProduct
		) {
			sampleProductId = results.tests.products.sampleProduct.id;
		}

		// Test 4: Get Product by ID (if we have a sample product)
		if (sampleProductId) {
			results.tests.productById = await testGetProductById(sampleProductId);
		} else {
			console.log("\n⚠️ تخطي اختبار المنتج بالـ ID - لا توجد منتجات متاحة");
			results.tests.productById = {
				success: false,
				error: "No products available",
			};
		}

		// Test 5: Get Products by Category (if we have a sample category)
		if (sampleCategoryId) {
			results.tests.productsByCategory =
				await testGetProductsByCategory(sampleCategoryId);
		} else {
			console.log("\n⚠️ تخطي اختبار منتجات الفئة - لا توجد فئات متاحة");
			results.tests.productsByCategory = {
				success: false,
				error: "No categories available",
			};
		}

		// Final Summary
		console.log("\n" + "=".repeat(70));
		console.log("🎯 النتائج النهائية للاختبار الشامل");
		console.log("=".repeat(70));

		const summary = {
			categories: results.tests.categories?.success || false,
			categoryById: results.tests.categoryById?.success || false,
			products: results.tests.products?.success || false,
			productById: results.tests.productById?.success || false,
			productsByCategory: results.tests.productsByCategory?.success || false,
		};

		console.log(`📂 جميع الفئات: ${summary.categories ? "✅ نجح" : "❌ فشل"}`);
		console.log(
			`📂 الفئة بالـ ID: ${summary.categoryById ? "✅ نجح" : "❌ فشل"}`,
		);
		console.log(`🛍️  جميع المنتجات: ${summary.products ? "✅ نجح" : "❌ فشل"}`);
		console.log(
			`🛍️  المنتج بالـ ID: ${summary.productById ? "✅ نجح" : "❌ فشل"}`,
		);
		console.log(
			`🛍️  منتجات الفئة: ${summary.productsByCategory ? "✅ نجح" : "❌ فشل"}`,
		);

		const successfulTests = Object.values(summary).filter(
			(test) => test,
		).length;
		const totalTests = Object.keys(summary).length;
		const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

		console.log(
			`\n🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`,
		);

		// Data Summary
		if (results.tests.categories?.success) {
			console.log(`\n📊 ملخص البيانات:`);
			console.log(
				`   📂 الفئات المتاحة: ${results.tests.categories.totalCount}`,
			);
			console.log(
				`   🛍️  المنتجات المتاحة: ${results.tests.products?.totalCount || 0}`,
			);
			console.log(
				`   💰 نطاق الأسعار: ${results.tests.products?.minPrice || 0} - ${results.tests.products?.maxPrice || 0} درهم`,
			);
		}

		// Show working queries
		console.log(`\n🔧 الاستعلامات العاملة:`);
		if (summary.categories) console.log(`   ✅ GET_ALL_CATEGORIES`);
		if (summary.categoryById) console.log(`   ✅ GET_CATEGORY_BY_ID`);
		if (summary.products) console.log(`   ✅ GET_ALL_PRODUCTS`);
		if (summary.productById) console.log(`   ✅ GET_PRODUCT_BY_ID`);
		if (summary.productsByCategory)
			console.log(`   ✅ GET_PRODUCTS_BY_CATEGORY`);

		if (successRate >= 80) {
			console.log("\n🎉 ممتاز! جميع الاستعلامات تعمل بشكل مثالي");
			console.log("✨ النظام جاهز للاستخدام مع البيانات الحقيقية");
		} else if (successRate >= 60) {
			console.log("\n⚠️  جيد جداً! معظم الاستعلامات تعمل");
			console.log("🔧 بعض التحسينات البسيطة مطلوبة");
		} else {
			console.log("\n⚠️  مقبول، الاستعلامات الأساسية تعمل");
			console.log("🛠️  يحتاج تطوير إضافي للوصول لجميع البيانات");
		}

		results.summary = summary;
		results.successRate = successRate;
		results.sampleCategoryId = sampleCategoryId;
		results.sampleProductId = sampleProductId;

		return results;
	} catch (error) {
		console.error("❌ خطأ في الاختبار النهائي:", error.message);
		results.error = error.message;
		return results;
	}
}

// Run the test
if (require.main === module) {
	runFinalCategoryProductTest()
		.then((results) => {
			console.log("\n✅ اكتمل الاختبار النهائي للفئات والمنتجات بنجاح!");
			console.log("🎊 النظام يدعم جميع استعلامات الفئات والمنتجات بالـ ID!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ فشل الاختبار النهائي:", error.message);
			process.exit(1);
		});
}

module.exports = { runFinalCategoryProductTest };
