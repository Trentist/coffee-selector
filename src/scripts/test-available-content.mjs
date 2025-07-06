/**
 * Test Available Content Queries
 * اختبار الاستعلامات المتاحة للمحتوى
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

// Test available content queries
async function testAvailableContentQueries() {
	console.log("🔍 اختبار الاستعلامات المتاحة للمحتوى...\n");

	const queries = [
		{
			name: "Get Blog Posts",
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
            metaTitle
            metaDescription
            metaKeywords
            createDate
            writeDate
          }
        }
      `,
		},
		{
			name: "Get Single Blog Post",
			query: `
        query GetBlogPost($id: Int!) {
          blogPost(id: $id) {
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
            metaTitle
            metaDescription
            metaKeywords
            createDate
            writeDate
          }
        }
      `,
			variables: { id: 1 },
		},
		{
			name: "Get Website Homepage",
			query: `
        query GetWebsiteHomepage {
          websiteHomepage {
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
            metaTitle
            metaDescription
            metaKeywords
            createDate
            writeDate
          }
        }
      `,
		},
		{
			name: "Get Mailing Contacts",
			query: `
        query GetMailingContacts {
          mailingContacts {
            id
            name
            email
            phone
            address
            isSubscribed
            createDate
            writeDate
          }
        }
      `,
		},
		{
			name: "Get Blog Posts with Filter",
			query: `
        query GetBlogPostsWithFilter($filter: BlogPostFilterInput) {
          blogPosts(filter: $filter) {
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
            metaTitle
            metaDescription
            metaKeywords
            createDate
            writeDate
          }
        }
      `,
			variables: {
				filter: {
					isPublished: true,
					tags: ["legal", "terms", "privacy", "refund", "about", "contact"],
				},
			},
		},
		{
			name: "Get Blog Posts with Search",
			query: `
        query GetBlogPostsWithSearch($search: String) {
          blogPosts(search: $search) {
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
            metaTitle
            metaDescription
            metaKeywords
            createDate
            writeDate
          }
        }
      `,
			variables: { search: "terms privacy refund about contact" },
		},
		{
			name: "Get Blog Posts by Tag",
			query: `
        query GetBlogPostsByTag($tag: String) {
          blogPosts(tag: $tag) {
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
            metaTitle
            metaDescription
            metaKeywords
            createDate
            writeDate
          }
        }
      `,
			variables: { tag: "legal" },
		},
		{
			name: "Get Blog Posts by Author",
			query: `
        query GetBlogPostsByAuthor($author: String) {
          blogPosts(author: $author) {
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
            metaTitle
            metaDescription
            metaKeywords
            createDate
            writeDate
          }
        }
      `,
			variables: { author: "admin" },
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

// Test introspection for more details
async function testDetailedIntrospection() {
	console.log("🔍 اختبار استعلام الاستكشاف التفصيلي...\n");

	const introspectionQuery = `
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

	try {
		console.log("🧪 اختبار: Detailed Introspection Query");
		const result = await makeGraphQLRequest(introspectionQuery);

		if (result.data?.__schema) {
			const schema = result.data.__schema;

			// Find BlogPost type details
			const blogPostType = schema.types?.find(
				(type) => type.name === "BlogPost",
			);
			if (blogPostType) {
				console.log(`   📄 BlogPost Type Fields:`);
				blogPostType.fields?.forEach((field) => {
					console.log(
						`      - ${field.name}: ${field.type.name || field.type.ofType?.name}`,
					);
					if (field.description) {
						console.log(`        Description: ${field.description}`);
					}
				});
			}

			// Find Homepage type details
			const homepageType = schema.types?.find(
				(type) => type.name === "Homepage",
			);
			if (homepageType) {
				console.log(`   📄 Homepage Type Fields:`);
				homepageType.fields?.forEach((field) => {
					console.log(
						`      - ${field.name}: ${field.type.name || field.type.ofType?.name}`,
					);
					if (field.description) {
						console.log(`        Description: ${field.description}`);
					}
				});
			}

			// Find query arguments
			const blogPostsQuery = schema.queryType?.fields?.find(
				(field) => field.name === "blogPosts",
			);
			if (blogPostsQuery) {
				console.log(`   🔍 BlogPosts Query Arguments:`);
				blogPostsQuery.args?.forEach((arg) => {
					console.log(
						`      - ${arg.name}: ${arg.type.name || arg.type.ofType?.name}`,
					);
					if (arg.description) {
						console.log(`        Description: ${arg.description}`);
					}
				});
			}

			return {
				success: true,
				data: result.data,
				blogPostType,
				homepageType,
				blogPostsQuery,
			};
		} else {
			console.log(`   ❌ فشل - لا توجد بيانات Schema`);
			return { success: false };
		}
	} catch (error) {
		console.log(`   ❌ خطأ: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Main execution
async function main() {
	console.log("🔍 Test Available Content Queries");
	console.log("=".repeat(50));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log("=".repeat(50));
	console.log("");

	// Test detailed introspection first
	const introspectionResult = await testDetailedIntrospection();

	console.log("=".repeat(50));

	// Test available content queries
	const contentResults = await testAvailableContentQueries();

	console.log("=".repeat(50));

	// Summary
	console.log("📊 ملخص النتائج:");

	const allResults = { introspection: introspectionResult, ...contentResults };
	const successfulQueries = Object.values(allResults).filter(
		(r) => r.success,
	).length;
	const totalQueries = Object.keys(allResults).length;

	console.log(
		`   ✅ الاستعلامات الناجحة: ${successfulQueries}/${totalQueries}`,
	);

	// Find legal content in blog posts
	let legalContentFound = 0;
	Object.values(contentResults).forEach((result) => {
		if (result.data?.blogPosts) {
			const legalPosts = result.data.blogPosts.filter(
				(post) =>
					post.title?.toLowerCase().includes("terms") ||
					post.title?.toLowerCase().includes("privacy") ||
					post.title?.toLowerCase().includes("refund") ||
					post.title?.toLowerCase().includes("about") ||
					post.title?.toLowerCase().includes("contact") ||
					post.tags?.some(
						(tag) =>
							tag.toLowerCase().includes("legal") ||
							tag.toLowerCase().includes("terms") ||
							tag.toLowerCase().includes("privacy") ||
							tag.toLowerCase().includes("refund"),
					),
			);
			legalContentFound += legalPosts.length;
		}
	});

	console.log(`   📋 المحتوى القانوني: ${legalContentFound} عنصر`);

	console.log("\n🎉 اكتمل الاختبار!");
}

// Run the test
main().catch(console.error);
