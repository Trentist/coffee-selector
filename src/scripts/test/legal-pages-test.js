#!/usr/bin/env node

/**
 * Legal Pages & Website Data Test - اختبار الصفحات القانونية وبيانات الموقع
 * Comprehensive test for legal pages, terms, privacy, and website content
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
				Authorization: `Bearer ${ODOO_CONFIG.apiKey}`,
				"Content-Length": Buffer.byteLength(postData),
			},
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

// Test Blog Posts (might contain legal content)
async function testBlogPosts() {
	console.log("\n📝 اختبار مقالات المدونة (قد تحتوي على محتوى قانوني)");
	console.log("=".repeat(50));

	const query = `
    query GetBlogPosts {
      blogPosts {
        id
        name
        title
        content
        excerpt
        author
        publishedDate
        tags
        isPublished
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query);

		if (result.data?.blogPosts) {
			const posts = result.data.blogPosts;
			console.log(`✅ تم العثور على ${posts.length} مقال`);

			// Filter for legal content
			const legalPosts = posts.filter(
				(post) =>
					post.title?.toLowerCase().includes("terms") ||
					post.title?.toLowerCase().includes("privacy") ||
					post.title?.toLowerCase().includes("policy") ||
					post.title?.toLowerCase().includes("legal") ||
					post.content?.toLowerCase().includes("terms") ||
					post.content?.toLowerCase().includes("privacy"),
			);

			console.log(`📚 المقالات القانونية: ${legalPosts.length}`);

			posts.forEach((post, index) => {
				console.log(`\n📝 المقال ${index + 1}:`);
				console.log(`   🆔 المعرف: ${post.id}`);
				console.log(`   🏷️  العنوان: ${post.title || "غير محدد"}`);
				console.log(`   👤 المؤلف: ${post.author || "غير محدد"}`);
				console.log(`   📅 تاريخ النشر: ${post.publishedDate || "غير محدد"}`);
				console.log(`   📄 منشور: ${post.isPublished ? "نعم" : "لا"}`);

				if (post.content) {
					console.log(`   📝 المحتوى: ${post.content.substring(0, 100)}...`);
				}

				if (post.tags && post.tags.length > 0) {
					console.log(`   🏷️  العلامات: ${post.tags.join(", ")}`);
				}
			});

			return {
				success: true,
				count: posts.length,
				legalCount: legalPosts.length,
				data: posts,
			};
		} else {
			console.log("❌ لم يتم العثور على مقالات");
			return { success: false, count: 0 };
		}
	} catch (error) {
		console.log(`❌ خطأ في جلب المقالات: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Test Website Configuration
async function testWebsiteConfig() {
	console.log("\n⚙️ اختبار إعدادات الموقع");
	console.log("=".repeat(50));

	const query = `
    query GetWebsiteConfig {
      website {
        id
        name
        domain
        company {
          id
          name
          email
          phone
          address
        }
        settings {
          termsUrl
          privacyUrl
          contactUrl
          aboutUrl
        }
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query);

		if (result.data?.website) {
			const website = result.data.website;
			console.log(`✅ تم العثور على إعدادات الموقع`);
			console.log(`\n🏢 معلومات الشركة:`);
			console.log(`   🏷️  الاسم: ${website.company?.name || "غير محدد"}`);
			console.log(`   📧 البريد: ${website.company?.email || "غير محدد"}`);
			console.log(`   📱 الهاتف: ${website.company?.phone || "غير محدد"}`);
			console.log(`   📍 العنوان: ${website.company?.address || "غير محدد"}`);

			if (website.settings) {
				console.log(`\n🔗 روابط الصفحات القانونية:`);
				console.log(
					`   📋 شروط وأحكام: ${website.settings.termsUrl || "غير محدد"}`,
				);
				console.log(
					`   🔒 سياسة الخصوصية: ${website.settings.privacyUrl || "غير محدد"}`,
				);
				console.log(
					`   📞 اتصل بنا: ${website.settings.contactUrl || "غير محدد"}`,
				);
				console.log(
					`   ℹ️  من نحن: ${website.settings.aboutUrl || "غير محدد"}`,
				);
			}

			return {
				success: true,
				data: website,
			};
		} else {
			console.log("❌ لم يتم العثور على إعدادات الموقع");
			return { success: false };
		}
	} catch (error) {
		console.log(`❌ خطأ في جلب إعدادات الموقع: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Run comprehensive legal pages test
async function runLegalPagesTest() {
	console.log("🚀 اختبار الصفحات القانونية وبيانات الموقع");
	console.log("🚀 Legal Pages & Website Data Test");
	console.log("=".repeat(70));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log("=".repeat(70));

	const startTime = Date.now();
	const results = [];

	// Run all tests
	console.log("\n🔍 بدء الاختبارات...");

	const blogPostsTest = await testBlogPosts();
	results.push({ name: "Blog Posts", ...blogPostsTest });

	const websiteConfigTest = await testWebsiteConfig();
	results.push({ name: "Website Config", ...websiteConfigTest });

	const endTime = Date.now();
	const duration = ((endTime - startTime) / 1000).toFixed(2);

	// Generate summary
	console.log("\n" + "=".repeat(70));
	console.log("📊 ملخص نتائج اختبار الصفحات القانونية");
	console.log("=".repeat(70));

	const successfulTests = results.filter((r) => r.success).length;
	const totalTests = results.length;
	const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

	console.log(`📝 مقالات المدونة: ${blogPostsTest.count || 0}`);
	console.log(`📚 مقالات قانونية: ${blogPostsTest.legalCount || 0}`);
	console.log(
		`⚙️  إعدادات الموقع: ${websiteConfigTest.success ? "متوفرة" : "غير متوفرة"}`,
	);
	console.log(`⏱️  وقت الاختبار: ${duration} ثانية`);
	console.log(
		`🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`,
	);

	// Detailed results
	console.log("\n📋 النتائج المفصلة:");
	results.forEach((result, index) => {
		const status = result.success ? "✅" : "❌";
		const count = result.count || result.legalCount || (result.success ? 1 : 0);
		console.log(`   ${index + 1}. ${status} ${result.name}: ${count}`);
	});

	// Recommendations
	console.log("\n💡 التوصيات:");
	if (blogPostsTest.legalCount === 0) {
		console.log("   📚 إنشاء مقالات قانونية (شروط وأحكام، سياسة خصوصية)");
	}
	if (!websiteConfigTest.success) {
		console.log("   ⚙️  إعداد إعدادات الموقع");
	}
	if (successRate < 50) {
		console.log("   🔧 فحص إعدادات GraphQL والصلاحيات");
	}

	console.log("\n✅ اكتمل اختبار الصفحات القانونية بنجاح!");
	console.log("✅ Legal pages test completed successfully!");
}

// Run the test
runLegalPagesTest().catch(console.error);
