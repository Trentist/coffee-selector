/**
 * Test Additional Queries
 * اختبار استعلامات إضافية قد تكون متاحة في Odoo
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

// Test additional queries
async function testAdditionalQueries() {
	console.log("🔍 اختبار استعلامات إضافية...\n");

	const queries = [
		{
			name: "Get All Products (for reference)",
			query: `
        query GetProducts {
          products {
            products {
              id
              name
              description
              websiteDescription
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
			name: "Get All News",
			query: `
        query GetNews {
          news {
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
			name: "Get All Events",
			query: `
        query GetEvents {
          events {
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
			name: "Get All Announcements",
			query: `
        query GetAnnouncements {
          announcements {
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
			name: "Get All Notices",
			query: `
        query GetNotices {
          notices {
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
			name: "Get All Policies",
			query: `
        query GetPolicies {
          policies {
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
			name: "Get All Legal Documents",
			query: `
        query GetLegalDocuments {
          legalDocuments {
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
			name: "Get All Terms",
			query: `
        query GetTerms {
          terms {
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
			name: "Get All Privacy",
			query: `
        query GetPrivacy {
          privacy {
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
			name: "Get All Refunds",
			query: `
        query GetRefunds {
          refunds {
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
			name: "Get All About",
			query: `
        query GetAbout {
          about {
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
			name: "Get All Contact",
			query: `
        query GetContact {
          contact {
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
			name: "Get All Static Content",
			query: `
        query GetStaticContent {
          staticContent {
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
			name: "Get All Dynamic Content",
			query: `
        query GetDynamicContent {
          dynamicContent {
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
			name: "Get All CMS Content",
			query: `
        query GetCMSContent {
          cmsContent {
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
			name: "Get All Website Content",
			query: `
        query GetWebsiteContent {
          websiteContent {
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
			name: "Get All Site Content",
			query: `
        query GetSiteContent {
          siteContent {
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
			name: "Get All Web Content",
			query: `
        query GetWebContent {
          webContent {
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
			name: "Get All Legal Content",
			query: `
        query GetLegalContent {
          legalContent {
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
			name: "Get All Legal Pages",
			query: `
        query GetLegalPages {
          legalPages {
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
			name: "Get All Legal Documents",
			query: `
        query GetLegalDocuments {
          legalDocuments {
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
			name: "Get All Legal Information",
			query: `
        query GetLegalInformation {
          legalInformation {
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
			name: "Get All Legal Resources",
			query: `
        query GetLegalResources {
          legalResources {
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
			name: "Get All Legal Files",
			query: `
        query GetLegalFiles {
          legalFiles {
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
			name: "Get All Legal Articles",
			query: `
        query GetLegalArticles {
          legalArticles {
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
			name: "Get All Legal Posts",
			query: `
        query GetLegalPosts {
          legalPosts {
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
			name: "Get All Legal Blog Posts",
			query: `
        query GetLegalBlogPosts {
          legalBlogPosts {
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
			name: "Get All Legal News",
			query: `
        query GetLegalNews {
          legalNews {
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
			name: "Get All Legal Events",
			query: `
        query GetLegalEvents {
          legalEvents {
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
			name: "Get All Legal Announcements",
			query: `
        query GetLegalAnnouncements {
          legalAnnouncements {
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
			name: "Get All Legal Notices",
			query: `
        query GetLegalNotices {
          legalNotices {
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
			name: "Get All Legal Policies",
			query: `
        query GetLegalPolicies {
          legalPolicies {
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
	];

	const results = {};

	for (const queryInfo of queries) {
		try {
			console.log(`🧪 اختبار: ${queryInfo.name}`);
			const result = await makeGraphQLRequest(
				queryInfo.query,
				queryInfo.variables || {},
			);

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
							if (item.tags && item.tags.length > 0) {
								console.log(`         العلامات: ${item.tags.join(", ")}`);
							}
							if (item.content) {
								console.log(
									`         المحتوى: ${item.content.substring(0, 100)}...`,
								);
							}
							if (item.url) {
								console.log(`         الرابط: ${item.url}`);
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

// Main execution
async function main() {
	console.log("🔍 Test Additional Queries");
	console.log("=".repeat(50));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log("=".repeat(50));
	console.log("");

	// Test additional queries
	const results = await testAdditionalQueries();

	console.log("=".repeat(50));

	// Summary
	console.log("📊 ملخص النتائج:");

	const successfulQueries = Object.values(results).filter(
		(r) => r.success,
	).length;
	const totalQueries = Object.keys(results).length;

	console.log(
		`   ✅ الاستعلامات الناجحة: ${successfulQueries}/${totalQueries}`,
	);

	// Find legal content
	let legalContentFound = 0;
	Object.values(results).forEach((result) => {
		if (result.data) {
			Object.values(result.data).forEach((items) => {
				if (Array.isArray(items)) {
					const legal = items.filter(
						(item) =>
							item.title?.toLowerCase().includes("terms") ||
							item.title?.toLowerCase().includes("privacy") ||
							item.title?.toLowerCase().includes("refund") ||
							item.title?.toLowerCase().includes("legal") ||
							item.name?.toLowerCase().includes("terms") ||
							item.name?.toLowerCase().includes("privacy") ||
							item.name?.toLowerCase().includes("refund") ||
							item.name?.toLowerCase().includes("legal") ||
							item.tags?.some(
								(tag) =>
									tag.toLowerCase().includes("legal") ||
									tag.toLowerCase().includes("terms") ||
									tag.toLowerCase().includes("privacy") ||
									tag.toLowerCase().includes("refund"),
							),
					);
					legalContentFound += legal.length;
				}
			});
		}
	});

	console.log(`   📋 المحتوى القانوني: ${legalContentFound} عنصر`);

	if (legalContentFound > 0) {
		console.log("\n🎉 تم العثور على محتوى قانوني!");
	} else {
		console.log("\n❌ لم يتم العثور على محتوى قانوني");
	}

	console.log("\n🎉 اكتمل الاختبار!");
}

// Run the test
main().catch(console.error);
