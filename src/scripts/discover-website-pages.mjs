/**
 * Website Pages Discovery Script
 * سكريبت استكشاف صفحات الموقع الأساسية من Odoo API
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

// Test Website Pages Queries
async function testWebsitePagesQueries() {
	console.log("🔍 اختبار استعلامات صفحات الموقع...\n");

	const queries = [
		{
			name: "Get Website Pages",
			query: `
        query GetWebsitePages {
          websitePages {
            id
            name
            url
            websitePublished
            isPublished
            active
            websiteMetaTitle
            websiteMetaDescription
            websiteMetaKeywords
            arch
            type
            key
            priority
            createDate
            writeDate
          }
        }
      `,
		},
		{
			name: "Get Website Menu",
			query: `
        query GetWebsiteMenu {
          websiteMenu {
            id
            name
            url
            sequence
            parentId
            children {
              id
              name
              url
              sequence
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
              website
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
            type
            category
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
            type
            category
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
			name: "Get About Page",
			query: `
        query GetAboutPage {
          aboutPage {
            id
            title
            content
            metaTitle
            metaDescription
            isPublished
          }
        }
      `,
		},
		{
			name: "Get Contact Page",
			query: `
        query GetContactPage {
          contactPage {
            id
            title
            content
            metaTitle
            metaDescription
            isPublished
            contactInfo {
              email
              phone
              address
              workingHours
            }
          }
        }
      `,
		},
		{
			name: "Get Terms Page",
			query: `
        query GetTermsPage {
          termsPage {
            id
            title
            content
            metaTitle
            metaDescription
            isPublished
            version
            lastUpdated
          }
        }
      `,
		},
		{
			name: "Get Privacy Page",
			query: `
        query GetPrivacyPage {
          privacyPage {
            id
            title
            content
            metaTitle
            metaDescription
            isPublished
            version
            lastUpdated
          }
        }
      `,
		},
		{
			name: "Get Refund Page",
			query: `
        query GetRefundPage {
          refundPage {
            id
            title
            content
            metaTitle
            metaDescription
            isPublished
            version
            lastUpdated
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
            category
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
            key
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
            url
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
            url
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
            url
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
            url
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
            url
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
            url
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
            url
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

				// Show sample data
				for (const key of dataKeys) {
					const items = result.data[key];
					if (Array.isArray(items) && items.length > 0) {
						console.log(`   📊 عدد العناصر: ${items.length}`);
						items.slice(0, 3).forEach((item, index) => {
							console.log(
								`      ${index + 1}. ${item.title || item.name} (${item.id})`,
							);
							if (item.url) {
								console.log(`         الرابط: ${item.url}`);
							}
							if (item.content) {
								console.log(
									`         المحتوى: ${item.content.substring(0, 100)}...`,
								);
							}
						});
					} else if (items && typeof items === "object") {
						console.log(
							`   📊 بيانات: ${JSON.stringify(items, null, 2).substring(0, 200)}...`,
						);
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

// Test specific page queries
async function testSpecificPageQueries() {
	console.log("🔍 اختبار استعلامات صفحات محددة...\n");

	const specificQueries = [
		{
			name: "Search About Content",
			query: `
        query SearchAboutContent {
          searchContent(query: "about us") {
            id
            title
            content
            type
            slug
            url
          }
        }
      `,
		},
		{
			name: "Search Contact Content",
			query: `
        query SearchContactContent {
          searchContent(query: "contact") {
            id
            title
            content
            type
            slug
            url
          }
        }
      `,
		},
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
            url
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
            url
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
            url
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
							if (item.url) {
								console.log(`         الرابط: ${item.url}`);
							}
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
	console.log("🌐 Website Pages Discovery Tool");
	console.log("=".repeat(50));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log("=".repeat(50));
	console.log("");

	// Test general queries
	const generalResults = await testWebsitePagesQueries();

	console.log("=".repeat(50));

	// Test specific queries
	const specificResults = await testSpecificPageQueries();

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

	// Find website content
	let totalWebsiteContent = 0;
	Object.values(allResults).forEach((result) => {
		if (result.data) {
			Object.values(result.data).forEach((items) => {
				if (Array.isArray(items)) {
					totalWebsiteContent += items.length;
				}
			});
		}
	});

	console.log(`   📄 محتوى الموقع: ${totalWebsiteContent} عنصر`);

	console.log("\n🎉 اكتمل الاستكشاف!");
}

// Run the discovery
main().catch(console.error);
