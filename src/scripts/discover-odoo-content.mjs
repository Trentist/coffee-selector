/**
 * Odoo Content Discovery Script
 * سكريبت استكشاف محتوى Odoo باستخدام استعلامات مختلفة
 */

import https from 'https';

const ODOO_CONFIG = {
  baseUrl: "https://coffee-selection-staging-20784644.dev.odoo.com",
  graphqlUrl: "https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf",
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

// Test different Odoo content queries
async function testOdooContentQueries() {
  console.log('🔍 اختبار استعلامات محتوى Odoo...\n');

  const queries = [
    {
      name: 'Get All Products (for reference)',
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
      `
    },
    {
      name: 'Get All Categories (for reference)',
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
      `
    },
    {
      name: 'Get Website Configuration',
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
      `
    },
    {
      name: 'Get Company Information',
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
      `
    },
    {
      name: 'Get All Pages',
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
      `
    },
    {
      name: 'Get Website Pages',
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
      `
    },
    {
      name: 'Get All Content',
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
      `
    },
    {
      name: 'Get All Documents',
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
      `
    },
    {
      name: 'Get All Files',
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
      `
    },
    {
      name: 'Get All Resources',
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
      `
    },
    {
      name: 'Get All Information',
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
      `
    },
    {
      name: 'Get All Articles',
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
      `
    },
    {
      name: 'Get All Posts',
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
      `
    },
    {
      name: 'Get All Blog Posts',
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
      `
    },
    {
      name: 'Get All News',
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
      `
    },
    {
      name: 'Get All Events',
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
      `
    },
    {
      name: 'Get All Announcements',
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
      `
    },
    {
      name: 'Get All Notices',
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
      `
    },
    {
      name: 'Get All Policies',
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
      `
    },
    {
      name: 'Get All Legal Documents',
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
      `
    },
    {
      name: 'Get All Terms',
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
      `
    },
    {
      name: 'Get All Privacy',
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
      `
    },
    {
      name: 'Get All Refunds',
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
      `
    },
    {
      name: 'Get All About',
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
      `
    },
    {
      name: 'Get All Contact',
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
      `
    },
    {
      name: 'Get All Static Content',
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
      `
    },
    {
      name: 'Get All Dynamic Content',
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
      `
    },
    {
      name: 'Get All CMS Content',
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
      `
    },
    {
      name: 'Get All Website Content',
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
      `
    },
    {
      name: 'Get All Site Content',
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
      `
    },
    {
      name: 'Get All Web Content',
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
      `
    }
  ];

  const results = {};

  for (const queryInfo of queries) {
    try {
      console.log(`🧪 اختبار: ${queryInfo.name}`);
      const result = await makeGraphQLRequest(queryInfo.query);

      if (result.data) {
        const dataKeys = Object.keys(result.data);
        console.log(`   ✅ نجح - البيانات المتاحة: ${dataKeys.join(', ')}`);

        // Show sample data
        for (const key of dataKeys) {
          const items = result.data[key];
          if (Array.isArray(items) && items.length > 0) {
            console.log(`   📊 عدد العناصر: ${items.length}`);
            items.slice(0, 3).forEach((item, index) => {
              console.log(`      ${index + 1}. ${item.title || item.name} (${item.id})`);
              if (item.content) {
                console.log(`         المحتوى: ${item.content.substring(0, 100)}...`);
              }
            });
          } else if (items && typeof items === 'object') {
            console.log(`   📊 بيانات: ${JSON.stringify(items, null, 2).substring(0, 200)}...`);
          }
        }

        results[queryInfo.name] = {
          success: true,
          data: result.data
        };
      } else {
        console.log(`   ❌ فشل - لا توجد بيانات`);
        results[queryInfo.name] = { success: false };
      }
    } catch (error) {
      console.log(`   ❌ خطأ: ${error.message}`);
      results[queryInfo.name] = { success: false, error: error.message };
    }
    console.log('');
  }

  return results;
}

// Test introspection query
async function testIntrospection() {
  console.log('🔍 اختبار استعلام الاستكشاف (Introspection)...\n');

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
    console.log('🧪 اختبار: Introspection Query');
    const result = await makeGraphQLRequest(introspectionQuery);

    if (result.data?.__schema) {
      const schema = result.data.__schema;
      console.log(`   ✅ نجح - تم العثور على Schema`);
      console.log(`   📋 Query Type: ${schema.queryType?.name || 'None'}`);
      console.log(`   📊 Total Types: ${schema.types?.length || 0}`);

      // Find content-related types
      const contentTypes = schema.types?.filter(type =>
        type.name && (
          type.name.toLowerCase().includes('page') ||
          type.name.toLowerCase().includes('content') ||
          type.name.toLowerCase().includes('article') ||
          type.name.toLowerCase().includes('post') ||
          type.name.toLowerCase().includes('document') ||
          type.name.toLowerCase().includes('file') ||
          type.name.toLowerCase().includes('resource') ||
          type.name.toLowerCase().includes('information') ||
          type.name.toLowerCase().includes('legal') ||
          type.name.toLowerCase().includes('terms') ||
          type.name.toLowerCase().includes('privacy') ||
          type.name.toLowerCase().includes('refund') ||
          type.name.toLowerCase().includes('about') ||
          type.name.toLowerCase().includes('contact')
        )
      ) || [];

      console.log(`   📄 Content Types: ${contentTypes.length}`);
      contentTypes.forEach(type => {
        console.log(`      - ${type.name} (${type.kind})`);
        if (type.description) {
          console.log(`        Description: ${type.description}`);
        }
      });

      // Find content-related queries
      const contentQueries = schema.queryType?.fields?.filter(field =>
        field.name.toLowerCase().includes('page') ||
        field.name.toLowerCase().includes('content') ||
        field.name.toLowerCase().includes('article') ||
        field.name.toLowerCase().includes('post') ||
        field.name.toLowerCase().includes('document') ||
        field.name.toLowerCase().includes('file') ||
        field.name.toLowerCase().includes('resource') ||
        field.name.toLowerCase().includes('information') ||
        field.name.toLowerCase().includes('legal') ||
        field.name.toLowerCase().includes('terms') ||
        field.name.toLowerCase().includes('privacy') ||
        field.name.toLowerCase().includes('refund') ||
        field.name.toLowerCase().includes('about') ||
        field.name.toLowerCase().includes('contact')
      ) || [];

      console.log(`   🔍 Content Queries: ${contentQueries.length}`);
      contentQueries.forEach(query => {
        console.log(`      - ${query.name}`);
        if (query.description) {
          console.log(`        Description: ${query.description}`);
        }
      });

      return {
        success: true,
        data: result.data,
        contentTypes,
        contentQueries
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
  console.log('🔍 Odoo Content Discovery Tool');
  console.log('=' .repeat(50));
  console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
  console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
  console.log('=' .repeat(50));
  console.log('');

  // Test introspection first
  const introspectionResult = await testIntrospection();

  console.log('=' .repeat(50));

  // Test content queries
  const contentResults = await testOdooContentQueries();

  console.log('=' .repeat(50));

  // Summary
  console.log('📊 ملخص النتائج:');

  const allResults = { introspection: introspectionResult, ...contentResults };
  const successfulQueries = Object.values(allResults).filter(r => r.success).length;
  const totalQueries = Object.keys(allResults).length;

  console.log(`   ✅ الاستعلامات الناجحة: ${successfulQueries}/${totalQueries}`);

  if (introspectionResult.success) {
    console.log(`   📄 أنواع المحتوى: ${introspectionResult.contentTypes?.length || 0}`);
    console.log(`   🔍 استعلامات المحتوى: ${introspectionResult.contentQueries?.length || 0}`);
  }

  console.log('\n🎉 اكتمل الاستكشاف!');
}

// Run the discovery
main().catch(console.error);