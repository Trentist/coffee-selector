/**
 * Legal Pages Discovery Script
 * سكريبت استكشاف الصفحات القانونية من GraphQL API
 */

import https from "https";

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

// Test different queries for legal content
async function testLegalPagesQueries() {
	console.log("🔍 اختبار استعلامات الصفحات القانونية...\n");

	const queries = [
		{
			name: "Get All Pages",
			query: `
        query GetAllPages {
          pages {
            id
            name
            title
            content
            slug
            isPublished
            metaTitle
            metaDescription
          }
        }
      `,
		},
		{
			name: "Get Website Pages",
			query: `
        query GetWebsitePages {
          websitePages {
            id
            name
            title
            content
            slug
            isPublished
            metaTitle
            metaDescription
          }
        }
      `,
		},
		{
			name: "Get Static Pages",
			query: `
        query GetStaticPages {
          staticPages {
            id
            name
            title
            content
            slug
            isPublished
            metaTitle
            metaDescription
          }
        }
      `,
		},
		{
			name: "Get Legal Pages",
			query: `
        query GetLegalPages {
          legalPages {
            id
            name
            title
            content
            slug
            type
            isPublished
            lastUpdated
          }
        }
      `,
		},
		{
			name: "Get Terms and Conditions",
			query: `
        query GetTermsAndConditions {
          termsAndConditions {
            id
            title
            content
            version
            lastUpdated
            isActive
          }
        }
      `,
		},
		{
			name: "Get Privacy Policy",
			query: `
        query GetPrivacyPolicy {
          privacyPolicy {
            id
            title
            content
            version
            lastUpdated
            isActive
          }
        }
      `,
		},
		{
			name: "Get Refund Policy",
			query: `
        query GetRefundPolicy {
          refundPolicy {
            id
            title
            content
            version
            lastUpdated
            isActive
          }
        }
      `,
		},
		{
			name: "Get All Content",
			query: `
        query GetAllContent {
          content {
            id
            name
            title
            content
            type
            slug
            isPublished
          }
        }
      `,
		},
		{
			name: "Get Website Settings",
			query: `
        query GetWebsiteSettings {
          websiteSettings {
            id
            name
            value
            type
          }
        }
      `,
		},
		{
			name: "Get Company Information",
			query: `
        query GetCompanyInfo {
          company {
            id
            name
            email
            phone
            address
            website
            termsUrl
            privacyUrl
            refundUrl
            contactUrl
          }
        }
      `,
		},
		{
			name: "Get All Products (might contain legal info)",
			query: `
        query GetProducts {
          products {
            products {
              id
              name
              description
              websiteDescription
              metaTitle
              metaDescription
            }
          }
        }
      `,
		},
		{
			name: "Get All Categories (might contain legal info)",
			query: `
        query GetCategories {
          categories {
            categories {
              id
              name
              description
              metaDescription
            }
          }
        }
      `,
		},
		{
			name: "Get Website Configuration",
			query: `
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
      `,
		},
		{
			name: "Get All Blog Posts",
			query: `
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
      `,
		},
		{
			name: "Get All Articles",
			query: `
        query GetArticles {
          articles {
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
      `,
		},
		{
			name: "Get All Posts",
			query: `
        query GetPosts {
          posts {
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
      `,
		},
		{
			name: "Get All Documents",
			query: `
        query GetDocuments {
          documents {
            id
            name
            title
            content
            type
            category
            isPublished
          }
        }
      `,
		},
		{
			name: "Get All Files",
			query: `
        query GetFiles {
          files {
            id
            name
            title
            content
            type
            category
            isPublished
          }
        }
      `,
		},
		{
			name: "Get All Resources",
			query: `
        query GetResources {
          resources {
            id
            name
            title
            content
            type
            category
            isPublished
          }
        }
      `,
		},
		{
			name: "Get All Information",
			query: `
        query GetInformation {
          information {
            id
            name
            title
            content
            type
            category
            isPublished
          }
        }
      `,
		},
	];

	const results = {};

	for (const queryInfo of queries) {
		try {
			console.log(`🧪 اختبار: ${queryInfo.name}`);
			const result = await makeGraphQLRequest(queryInfo.query);

			if (result.data) {
				const dataKeys = Object.keys(result.data);
				console.log(`   ✅ نجح - البيانات المتاحة: ${dataKeys.join(", ")}`);

				// Check for legal content
				let legalContent = [];
				for (const key of dataKeys) {
					const items = result.data[key];
					if (Array.isArray(items)) {
						const legal = items.filter(
							(item) =>
								item.title?.toLowerCase().includes("terms") ||
								item.title?.toLowerCase().includes("privacy") ||
								item.title?.toLowerCase().includes("refund") ||
								item.title?.toLowerCase().includes("policy") ||
								item.title?.toLowerCase().includes("legal") ||
								item.name?.toLowerCase().includes("terms") ||
								item.name?.toLowerCase().includes("privacy") ||
								item.name?.toLowerCase().includes("refund") ||
								item.content?.toLowerCase().includes("terms") ||
								item.content?.toLowerCase().includes("privacy"),
						);
						legalContent.push(...legal);
					}
				}

				if (legalContent.length > 0) {
					console.log(`   📋 المحتوى القانوني: ${legalContent.length} عنصر`);
					legalContent.forEach((item, index) => {
						console.log(
							`      ${index + 1}. ${item.title || item.name} (${item.id})`,
						);
					});
				}

				results[queryInfo.name] = {
					success: true,
					data: result.data,
					legalContent: legalContent,
				};
			} else {
				console.log(`   ❌ فشل - لا توجد بيانات`);
				results[queryInfo.name] = { success: false };
			}
		} catch (error) {
			console.log(`   ❌ خطأ: ${error.message}`);
			results[queryInfo.name] = { success: false, error: error.message };
		}
		console.log("");
	}

	return results;
}

// Test specific legal content queries
async function testSpecificLegalQueries() {
	console.log("🔍 اختبار استعلامات محددة للمحتوى القانوني...\n");

	const specificQueries = [
		{
			name: "Search Terms Content",
			query: `
        query SearchTermsContent {
          searchContent(query: "terms conditions") {
            id
            title
            content
            type
            slug
          }
        }
      `,
		},
		{
			name: "Search Privacy Content",
			query: `
        query SearchPrivacyContent {
          searchContent(query: "privacy policy") {
            id
            title
            content
            type
            slug
          }
        }
      `,
		},
		{
			name: "Search Refund Content",
			query: `
        query SearchRefundContent {
          searchContent(query: "refund return") {
            id
            title
            content
            type
            slug
          }
        }
      `,
		},
		{
			name: "Get All Documents",
			query: `
        query GetAllDocuments {
          documents {
            id
            name
            title
            content
            type
            category
            isPublished
          }
        }
      `,
		},
		{
			name: "Get Legal Documents",
			query: `
        query GetLegalDocuments {
          legalDocuments {
            id
            name
            title
            content
            type
            category
            version
            lastUpdated
          }
        }
      `,
		},
	];

	const results = {};

	for (const queryInfo of specificQueries) {
		try {
			console.log(`🧪 اختبار: ${queryInfo.name}`);
			const result = await makeGraphQLRequest(queryInfo.query);

			if (result.data) {
				const dataKeys = Object.keys(result.data);
				console.log(`   ✅ نجح - البيانات المتاحة: ${dataKeys.join(", ")}`);

				// Show sample data
				for (const key of dataKeys) {
					const items = result.data[key];
					if (Array.isArray(items) && items.length > 0) {
						console.log(`   📊 عدد العناصر: ${items.length}`);
						items.slice(0, 3).forEach((item, index) => {
							console.log(
								`      ${index + 1}. ${item.title || item.name} (${item.id})`,
							);
							if (item.content) {
								console.log(
									`         المحتوى: ${item.content.substring(0, 100)}...`,
								);
							}
						});
					}
				}

				results[queryInfo.name] = {
					success: true,
					data: result.data,
				};
			} else {
				console.log(`   ❌ فشل - لا توجد بيانات`);
				results[queryInfo.name] = { success: false };
			}
		} catch (error) {
			console.log(`   ❌ خطأ: ${error.message}`);
			results[queryInfo.name] = { success: false, error: error.message };
		}
		console.log("");
	}

	return results;
}

// Main execution
async function main() {
	console.log("📋 Legal Pages Discovery Tool");
	console.log("=".repeat(50));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log("=".repeat(50));
	console.log("");

	// Test general queries
	const generalResults = await testLegalPagesQueries();

	console.log("=".repeat(50));

	// Test specific queries
	const specificResults = await testSpecificLegalQueries();

	console.log("=".repeat(50));

	// Summary
	console.log("📊 ملخص النتائج:");

	const allResults = { ...generalResults, ...specificResults };
	const successfulQueries = Object.values(allResults).filter(
		(r) => r.success,
	).length;
	const totalQueries = Object.keys(allResults).length;

	console.log(
		`   ✅ الاستعلامات الناجحة: ${successfulQueries}/${totalQueries}`,
	);

	// Find legal content
	let totalLegalContent = 0;
	Object.values(allResults).forEach((result) => {
		if (result.legalContent) {
			totalLegalContent += result.legalContent.length;
		}
	});

	console.log(`   📋 المحتوى القانوني: ${totalLegalContent} عنصر`);

	console.log("\n🎉 اكتمل الاستكشاف!");
}

// Run the discovery
main().catch(console.error);
