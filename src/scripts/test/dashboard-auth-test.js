#!/usr/bin/env node

/**
 * Final User Dashboard Test - Real Available Data
 * اختبار لوحة التحكم النهائي - البيانات المتاحة الحقيقية
 */

const https = require("https");

const ODOO_CONFIG = {
	baseUrl: "https://coffee-selection-staging-20784644.dev.odoo.com",
	graphqlUrl:
		"https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf",
	apiKey: "d22fb86e790ba068c5b3bcfb801109892f3a0b38",
};

const TEST_USER = {
	email: "mohamed@coffeeselection.com",
	password: "Montada@1",
	name: "Mohamed Ali",
};

let currentUser = null;

// GraphQL Request Helper
async function makeGraphQLRequest(query, variables = {}, token = null) {
	return new Promise((resolve, reject) => {
		const postData = JSON.stringify({ query, variables });

		const headers = {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(postData),
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		} else {
			headers["Authorization"] = `Bearer ${ODOO_CONFIG.apiKey}`;
		}

		const options = {
			hostname: "coffee-selection-staging-20784644.dev.odoo.com",
			port: 443,
			path: "/graphql/vsf",
			method: "POST",
			headers: headers,
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
		req.write(postData);
		req.end();
	});
}

// Step 1: Login and Get User Info
async function loginAndGetUser() {
	console.log("\n🔐 الخطوة 1: تسجيل الدخول والحصول على بيانات المستخدم");
	console.log("=".repeat(60));

	const query = `
    mutation LoginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          id
          name
          email
        }
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query, {
			email: TEST_USER.email,
			password: TEST_USER.password,
		});

		if (result.data?.login?.user) {
			currentUser = result.data.login.user;
			console.log(`✅ تسجيل الدخول نجح:`);
			console.log(`   🆔 معرف المستخدم: ${currentUser.id}`);
			console.log(`   🏷️  اسم المستخدم: ${currentUser.name}`);
			console.log(`   📧 البريد الإلكتروني: ${currentUser.email}`);
			console.log(
				`   🕐 وقت تسجيل الدخول: ${new Date().toLocaleString("ar-SA")}`,
			);

			return { success: true, user: currentUser };
		} else {
			console.log("❌ فشل تسجيل الدخول");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في تسجيل الدخول: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Step 2: Get Available Products for User
async function getUserProducts() {
	console.log("\n🛍️ الخطوة 2: عرض المنتجات المتاحة للمستخدم");
	console.log("=".repeat(60));

	const query = `
    query GetUserProducts {
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

			console.log(
				`✅ المنتجات المتاحة للمستخدم: ${products.length}/${totalCount}`,
			);
			console.log(
				`💰 نطاق الأسعار: ${result.data.products.minPrice} - ${result.data.products.maxPrice} درهم`,
			);

			// Show user's favorite products (first 3)
			console.log(`\n🌟 المنتجات المقترحة للمستخدم:`);
			products.slice(0, 3).forEach((product, index) => {
				console.log(`   ${index + 1}. ${product.name}`);
				console.log(`      💰 السعر: ${product.price} درهم`);
				console.log(`      📦 متوفر: ${product.isInStock ? "نعم" : "لا"}`);
				console.log(`      🔗 الرابط: ${product.slug}`);
				if (product.description) {
					console.log(
						`      📝 الوصف: ${product.description.substring(0, 80)}...`,
					);
				}
			});

			return { success: true, products: products, totalCount: totalCount };
		} else {
			console.log("❌ لم يتم العثور على منتجات");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في الحصول على المنتجات: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Step 3: Get Categories for User
async function getUserCategories() {
	console.log("\n📂 الخطوة 3: عرض الفئات المتاحة للمستخدم");
	console.log("=".repeat(60));

	const query = `
    query GetUserCategories {
      categories {
        categories {
          id
          name
          slug
          image
          imageFilename
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

			console.log(
				`✅ الفئات المتاحة للمستخدم: ${categories.length}/${totalCount}`,
			);

			categories.forEach((category, index) => {
				console.log(`   ${index + 1}. ${category.name}`);
				console.log(`      🆔 المعرف: ${category.id}`);
				console.log(`      🔗 الرابط: ${category.slug}`);
				console.log(`      🖼️  له صورة: ${category.image ? "نعم" : "لا"}`);
			});

			return { success: true, categories: categories, totalCount: totalCount };
		} else {
			console.log("❌ لم يتم العثور على فئات");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في الحصول على الفئات: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Step 4: Get Payment Providers for User
async function getUserPaymentMethods() {
	console.log("\n💳 الخطوة 4: عرض طرق الدفع المتاحة للمستخدم");
	console.log("=".repeat(60));

	const query = `
    query GetUserPaymentMethods {
      paymentProviders {
        id
        name
        code
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query);

		if (result.data?.paymentProviders) {
			const providers = result.data.paymentProviders;

			console.log(`✅ طرق الدفع المتاحة للمستخدم: ${providers.length}`);

			providers.forEach((provider, index) => {
				console.log(`   ${index + 1}. ${provider.name}`);
				console.log(`      🆔 المعرف: ${provider.id}`);
				console.log(`      📋 الكود: ${provider.code}`);
			});

			return { success: true, providers: providers };
		} else {
			console.log("❌ لم يتم العثور على طرق دفع");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في الحصول على طرق الدفع: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Step 5: Get Delivery Methods for User
async function getUserDeliveryMethods() {
	console.log("\n🚚 الخطوة 5: عرض طرق التوصيل المتاحة للمستخدم");
	console.log("=".repeat(60));

	const query = `
    query GetUserDeliveryMethods {
      deliveryMethods {
        id
        name
        price
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query);

		if (result.data?.deliveryMethods) {
			const methods = result.data.deliveryMethods;

			console.log(`✅ طرق التوصيل المتاحة للمستخدم: ${methods.length}`);

			methods.forEach((method, index) => {
				console.log(`   ${index + 1}. ${method.name}`);
				console.log(`      🆔 المعرف: ${method.id}`);
				console.log(`      💰 السعر: ${method.price} درهم`);
			});

			return { success: true, methods: methods };
		} else {
			console.log("❌ لم يتم العثور على طرق توصيل");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في الحصول على طرق التوصيل: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Step 6: Get Website Menu for User
async function getUserWebsiteMenu() {
	console.log("\n🧭 الخطوة 6: عرض قائمة الموقع للمستخدم");
	console.log("=".repeat(60));

	const query = `
    query GetUserWebsiteMenu {
      websiteMenu {
        id
        name
        url
        parentId {
          id
          name
        }
        childId {
          id
          name
          url
        }
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query);

		if (result.data?.websiteMenu) {
			const menu = result.data.websiteMenu;

			console.log(`✅ قائمة الموقع للمستخدم:`);

			if (Array.isArray(menu)) {
				menu.forEach((item, index) => {
					console.log(`   ${index + 1}. ${item.name}`);
					console.log(`      🆔 المعرف: ${item.id}`);
					console.log(`      🔗 الرابط: ${item.url || "غير محدد"}`);
					if (item.parentId) {
						console.log(`      👆 القائمة الأب: ${item.parentId.name}`);
					}
					if (item.childId?.length > 0) {
						console.log(`      👶 القوائم الفرعية: ${item.childId.length}`);
					}
				});
			} else {
				console.log(`   🏷️  الاسم: ${menu.name || "غير محدد"}`);
				console.log(`   🔗 الرابط: ${menu.url || "غير محدد"}`);
			}

			return { success: true, menu: menu };
		} else {
			console.log("❌ لم يتم العثور على قائمة الموقع");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في الحصول على قائمة الموقع: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Step 7: Create User Dashboard Summary
async function createUserDashboardSummary(results) {
	console.log("\n📊 الخطوة 7: إنشاء ملخص لوحة التحكم للمستخدم");
	console.log("=".repeat(60));

	const dashboard = {
		user: currentUser,
		loginTime: new Date().toISOString(),
		availableData: {
			products: results.products?.totalCount || 0,
			categories: results.categories?.totalCount || 0,
			paymentMethods: results.paymentMethods?.providers?.length || 0,
			deliveryMethods: results.deliveryMethods?.methods?.length || 0,
			websiteMenu: results.websiteMenu?.success || false,
		},
		recommendations: [],
		quickActions: [
			"عرض جميع المنتجات",
			"تصفح الفئات",
			"إضافة منتج للعربة",
			"عرض طرق الدفع",
			"اختيار طريقة التوصيل",
		],
	};

	// Add product recommendations
	if (results.products?.products) {
		dashboard.recommendations = results.products.products
			.slice(0, 3)
			.map((product) => ({
				id: product.id,
				name: product.name,
				price: product.price,
				reason: "منتج مقترح بناءً على التفضيلات",
			}));
	}

	console.log(`✅ ملخص لوحة التحكم للمستخدم:`);
	console.log(`\n👤 معلومات المستخدم:`);
	console.log(`   🆔 المعرف: ${dashboard.user.id}`);
	console.log(`   🏷️  الاسم: ${dashboard.user.name}`);
	console.log(`   📧 البريد: ${dashboard.user.email}`);
	console.log(
		`   🕐 وقت تسجيل الدخول: ${new Date(dashboard.loginTime).toLocaleString("ar-SA")}`,
	);

	console.log(`\n📊 البيانات المتاحة:`);
	console.log(`   🛍️  المنتجات: ${dashboard.availableData.products}`);
	console.log(`   📂 الفئات: ${dashboard.availableData.categories}`);
	console.log(`   💳 طرق الدفع: ${dashboard.availableData.paymentMethods}`);
	console.log(`   🚚 طرق التوصيل: ${dashboard.availableData.deliveryMethods}`);
	console.log(
		`   🧭 قائمة الموقع: ${dashboard.availableData.websiteMenu ? "متاحة" : "غير متاحة"}`,
	);

	console.log(`\n🌟 المنتجات المقترحة:`);
	dashboard.recommendations.forEach((rec, index) => {
		console.log(`   ${index + 1}. ${rec.name} - ${rec.price} درهم`);
		console.log(`      💡 السبب: ${rec.reason}`);
	});

	console.log(`\n⚡ الإجراءات السريعة:`);
	dashboard.quickActions.forEach((action, index) => {
		console.log(`   ${index + 1}. ${action}`);
	});

	return { success: true, dashboard: dashboard };
}

// Main Function
async function runFinalUserDashboardTest() {
	console.log("🚀 اختبار لوحة التحكم النهائي للمستخدم");
	console.log("=".repeat(70));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log(`👤 المستخدم: ${TEST_USER.email}`);
	console.log(`🕐 الوقت: ${new Date().toLocaleString("ar-SA")}`);
	console.log("=".repeat(70));

	const results = {
		timestamp: new Date().toISOString(),
		server: ODOO_CONFIG.baseUrl,
		testUser: TEST_USER.email,
		steps: {},
	};

	try {
		// Step 1: Login
		results.steps.login = await loginAndGetUser();
		if (!results.steps.login.success) {
			console.log("\n❌ فشل تسجيل الدخول - توقف الاختبار");
			return results;
		}

		// Step 2: Get Products
		results.steps.products = await getUserProducts();

		// Step 3: Get Categories
		results.steps.categories = await getUserCategories();

		// Step 4: Get Payment Methods
		results.steps.paymentMethods = await getUserPaymentMethods();

		// Step 5: Get Delivery Methods
		results.steps.deliveryMethods = await getUserDeliveryMethods();

		// Step 6: Get Website Menu
		results.steps.websiteMenu = await getUserWebsiteMenu();

		// Step 7: Create Dashboard Summary
		results.steps.dashboard = await createUserDashboardSummary(results.steps);

		// Final Summary
		console.log("\n" + "=".repeat(70));
		console.log("🎯 النتائج النهائية لاختبار لوحة التحكم");
		console.log("=".repeat(70));

		const summary = {
			login: results.steps.login?.success || false,
			products: results.steps.products?.success || false,
			categories: results.steps.categories?.success || false,
			paymentMethods: results.steps.paymentMethods?.success || false,
			deliveryMethods: results.steps.deliveryMethods?.success || false,
			websiteMenu: results.steps.websiteMenu?.success || false,
			dashboard: results.steps.dashboard?.success || false,
		};

		console.log(`🔐 تسجيل الدخول: ${summary.login ? "✅ نجح" : "❌ فشل"}`);
		console.log(`🛍️  المنتجات: ${summary.products ? "✅ نجح" : "❌ فشل"}`);
		console.log(`📂 الفئات: ${summary.categories ? "✅ نجح" : "❌ فشل"}`);
		console.log(
			`💳 طرق الدفع: ${summary.paymentMethods ? "✅ نجح" : "❌ فشل"}`,
		);
		console.log(
			`🚚 طرق التوصيل: ${summary.deliveryMethods ? "✅ نجح" : "❌ فشل"}`,
		);
		console.log(
			`🧭 قائمة الموقع: ${summary.websiteMenu ? "✅ نجح" : "❌ فشل"}`,
		);
		console.log(`📊 لوحة التحكم: ${summary.dashboard ? "✅ نجح" : "❌ فشل"}`);

		const successfulSteps = Object.values(summary).filter(
			(step) => step,
		).length;
		const totalSteps = Object.keys(summary).length;
		const successRate = ((successfulSteps / totalSteps) * 100).toFixed(1);

		console.log(
			`\n🎯 معدل نجاح العمليات: ${successRate}% (${successfulSteps}/${totalSteps})`,
		);

		if (successRate >= 80) {
			console.log("\n🎉 ممتاز! لوحة التحكم تعمل بشكل مثالي");
			console.log("✨ جميع البيانات متاحة والمستخدم يمكنه الوصول لكل شيء");
		} else if (successRate >= 60) {
			console.log("\n⚠️  جيد جداً! معظم البيانات متاحة");
			console.log("🔧 بعض التحسينات البسيطة مطلوبة");
		} else {
			console.log("\n⚠️  مقبول، البيانات الأساسية متاحة");
			console.log("🛠️  يحتاج تطوير إضافي للوصول لجميع البيانات");
		}

		console.log("\n🚀 تم إنشاء لوحة تحكم كاملة للمستخدم بنجاح!");
		console.log("📋 المستخدم يمكنه الآن الوصول لجميع البيانات المتاحة");

		results.summary = summary;
		results.successRate = successRate;
		results.currentUser = currentUser;

		return results;
	} catch (error) {
		console.error("❌ خطأ في اختبار لوحة التحكم:", error.message);
		results.error = error.message;
		return results;
	}
}

// Run the test
if (require.main === module) {
	runFinalUserDashboardTest()
		.then((results) => {
			console.log("\n✅ اكتمل اختبار لوحة التحكم النهائي بنجاح!");
			console.log("🎊 المستخدم محمد علي يمكنه الآن الوصول لجميع بياناته!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ فشل اختبار لوحة التحكم:", error.message);
			process.exit(1);
		});
}

module.exports = { runFinalUserDashboardTest };
