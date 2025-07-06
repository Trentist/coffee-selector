#!/usr/bin/env node

/**
 * Enhanced Product Variants Test - اختبار متغيرات المنتج المحسن
 * اختبار شامل لجميع البيانات الجديدة والمتغيرات والخصائص
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

// Test 1: Enhanced Products Query with All Fields
async function testEnhancedProducts() {
	console.log("\n🛍️ اختبار 1: المنتجات المحسنة مع جميع الحقول");
	console.log("=".repeat(60));

	const query = `
    query GetEnhancedProducts {
      products {
        products {
          id
          name
          displayName
          price
          listPrice
          standardPrice
          defaultCode
          barcode
          weight
          volume
          description
          descriptionSale
          image
          imageFilename
          image1920
          imageSmall
          imageMedium
          slug
          sku
          isInStock
          websitePublished
          isPublished
          active
          saleOk
          purchaseOk
          categories {
            id
            name
            slug
          }
          categId {
            id
            name
            displayName
          }
          # Variant Information
          combinationInfoVariant
          variantPrice
          variantPriceAfterDiscount
          variantHasDiscountedPrice
          isVariantPossible
          variantAttributeValues {
            id
            name
            displayName
            attribute {
              id
              name
              displayName
            }
          }
          attributeValues {
            id
            name
            displayName
            attribute {
              id
              name
              displayName
            }
          }
          productVariants {
            id
            displayName
            listPrice
            standardPrice
            defaultCode
            attributeValues {
              id
              name
              displayName
            }
          }
          productVariantIds {
            id
            displayName
            listPrice
            standardPrice
            defaultCode
          }
          attributeLineIds {
            id
            attributeId {
              id
              name
              displayName
            }
            valueIds {
              id
              name
              displayName
            }
          }
          firstVariant {
            id
            name
            displayName
            price
            listPrice
            standardPrice
            defaultCode
          }
          # Inventory Information
          qtyAvailable
          virtualAvailable
          incomingQty
          outgoingQty
          createDate
          writeDate
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
			console.log(`✅ تم العثور على ${products.length} منتج محسن`);

			let productsWithVariants = 0;
			let productsWithAttributes = 0;
			let productsWithInventory = 0;

			products.forEach((product, index) => {
				console.log(
					`\n📦 المنتج ${index + 1}: ${product.name || product.displayName}`,
				);
				console.log(`   🆔 المعرف: ${product.id}`);
				console.log(
					`   💰 السعر الأساسي: ${product.price || product.listPrice} درهم`,
				);
				console.log(`   💰 سعر القائمة: ${product.listPrice} درهم`);
				console.log(`   💰 السعر القياسي: ${product.standardPrice} درهم`);
				console.log(`   📋 الكود: ${product.defaultCode || product.sku}`);
				console.log(`   📊 متوفر: ${product.isInStock ? "نعم" : "لا"}`);

				// Check variants
				if (product.productVariants && product.productVariants.length > 0) {
					console.log(`   🎨 المتغيرات: ${product.productVariants.length}`);
					productsWithVariants++;
				}

				if (product.productVariantIds && product.productVariantIds.length > 0) {
					console.log(
						`   🎨 معرفات المتغيرات: ${product.productVariantIds.length}`,
					);
				}

				// Check attributes
				if (product.attributeValues && product.attributeValues.length > 0) {
					console.log(`   🏷️  الخصائص: ${product.attributeValues.length}`);
					productsWithAttributes++;
				}

				if (product.attributeLineIds && product.attributeLineIds.length > 0) {
					console.log(
						`   🏷️  خطوط الخصائص: ${product.attributeLineIds.length}`,
					);
				}

				// Check inventory
				if (
					product.qtyAvailable !== undefined ||
					product.virtualAvailable !== undefined
				) {
					console.log(`   📦 المخزون المتاح: ${product.qtyAvailable || 0}`);
					console.log(
						`   📦 المخزون الافتراضي: ${product.virtualAvailable || 0}`,
					);
					productsWithInventory++;
				}

				// Check variant pricing
				if (product.variantPrice || product.variantPriceAfterDiscount) {
					console.log(
						`   💰 سعر المتغير: ${product.variantPrice || "غير محدد"}`,
					);
					console.log(
						`   💰 سعر المتغير بعد الخصم: ${product.variantPriceAfterDiscount || "غير محدد"}`,
					);
					console.log(
						`   🎯 متغير ممكن: ${product.isVariantPossible ? "نعم" : "لا"}`,
					);
				}
			});

			console.log(`\n📊 إحصائيات المنتجات المحسنة:`);
			console.log(`   📦 إجمالي المنتجات: ${products.length}`);
			console.log(`   🎨 منتجات مع متغيرات: ${productsWithVariants}`);
			console.log(`   🏷️  منتجات مع خصائص: ${productsWithAttributes}`);
			console.log(`   📦 منتجات مع معلومات مخزون: ${productsWithInventory}`);

			return {
				success: true,
				totalProducts: products.length,
				productsWithVariants,
				productsWithAttributes,
				productsWithInventory,
				data: products,
			};
		} else {
			console.log("❌ لم يتم العثور على منتجات محسنة");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في اختبار المنتجات المحسنة: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Test 2: Single Product with All Variant Data
async function testSingleProductWithVariants(productId = 1) {
	console.log(
		`\n🔍 اختبار 2: منتج واحد مع جميع بيانات المتغيرات (ID: ${productId})`,
	);
	console.log("=".repeat(60));

	const query = `
    query GetSingleProductWithVariants($id: Int!) {
      product(id: $id) {
        id
        name
        displayName
        price
        listPrice
        standardPrice
        defaultCode
        barcode
        weight
        volume
        description
        descriptionSale
        websiteDescription
        image
        imageFilename
        image1920
        imageSmall
        imageMedium
        slug
        sku
        isInStock
        websitePublished
        isPublished
        active
        saleOk
        purchaseOk
        categories {
          id
          name
          slug
        }
        categId {
          id
          name
          displayName
        }
        # Variant Information
        combinationInfoVariant
        variantPrice
        variantPriceAfterDiscount
        variantHasDiscountedPrice
        isVariantPossible
        variantAttributeValues {
          id
          name
          displayName
          attribute {
            id
            name
            displayName
          }
        }
        attributeValues {
          id
          name
          displayName
          attribute {
            id
            name
            displayName
          }
        }
        productVariants {
          id
          displayName
          listPrice
          standardPrice
          defaultCode
          attributeValues {
            id
            name
            displayName
          }
        }
        productVariantIds {
          id
          displayName
          listPrice
          standardPrice
          defaultCode
        }
        attributeLineIds {
          id
          attributeId {
            id
            name
            displayName
          }
          valueIds {
            id
            name
            displayName
          }
        }
        firstVariant {
          id
          name
          displayName
          price
          listPrice
          standardPrice
          defaultCode
        }
        # Inventory Information
        qtyAvailable
        virtualAvailable
        incomingQty
        outgoingQty
        createDate
        writeDate
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query, { id: productId });

		if (result.data?.product) {
			const product = result.data.product;

			console.log(`✅ تم العثور على المنتج بنجاح:`);
			console.log(`   🏷️  الاسم: ${product.name || product.displayName}`);
			console.log(`   🆔 المعرف: ${product.id}`);
			console.log(
				`   💰 السعر الأساسي: ${product.price || product.listPrice} درهم`,
			);
			console.log(`   💰 سعر القائمة: ${product.listPrice} درهم`);
			console.log(`   💰 السعر القياسي: ${product.standardPrice} درهم}`);
			console.log(`   📋 الكود: ${product.defaultCode || product.sku}`);
			console.log(`   📊 متوفر: ${product.isInStock ? "نعم" : "لا"}`);

			// Variant Information
			console.log(`\n🎨 معلومات المتغيرات:`);
			console.log(
				`   🎯 متغير ممكن: ${product.isVariantPossible ? "نعم" : "لا"}`,
			);
			console.log(`   💰 سعر المتغير: ${product.variantPrice || "غير محدد"}`);
			console.log(
				`   💰 سعر المتغير بعد الخصم: ${product.variantPriceAfterDiscount || "غير محدد"}`,
			);
			console.log(
				`   🎯 له خصم: ${product.variantHasDiscountedPrice ? "نعم" : "لا"}`,
			);

			if (product.productVariants && product.productVariants.length > 0) {
				console.log(`   🎨 عدد المتغيرات: ${product.productVariants.length}`);
				product.productVariants.forEach((variant, index) => {
					console.log(
						`      ${index + 1}. ${variant.displayName} - ${variant.listPrice} درهم`,
					);
				});
			}

			if (product.productVariantIds && product.productVariantIds.length > 0) {
				console.log(
					`   🎨 معرفات المتغيرات: ${product.productVariantIds.length}`,
				);
			}

			// Attribute Information
			console.log(`\n🏷️  معلومات الخصائص:`);
			if (product.attributeValues && product.attributeValues.length > 0) {
				console.log(`   🏷️  عدد الخصائص: ${product.attributeValues.length}`);
				product.attributeValues.forEach((attr, index) => {
					console.log(
						`      ${index + 1}. ${attr.attribute?.name || attr.name}: ${attr.displayName}`,
					);
				});
			}

			if (product.attributeLineIds && product.attributeLineIds.length > 0) {
				console.log(`   🏷️  خطوط الخصائص: ${product.attributeLineIds.length}`);
				product.attributeLineIds.forEach((line, index) => {
					console.log(
						`      ${index + 1}. ${line.attributeId.name}: ${line.valueIds.length} قيمة`,
					);
				});
			}

			// Inventory Information
			console.log(`\n📦 معلومات المخزون:`);
			console.log(`   📦 المتاح: ${product.qtyAvailable || 0}`);
			console.log(`   📦 الافتراضي: ${product.virtualAvailable || 0}`);
			console.log(`   📦 الوارد: ${product.incomingQty || 0}`);
			console.log(`   📦 الصادر: ${product.outgoingQty || 0}`);

			return { success: true, product: product };
		} else {
			console.log(`❌ لم يتم العثور على المنتج بالمعرف: ${productId}`);
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في اختبار المنتج الواحد: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Test 3: Categories with Enhanced Products
async function testCategoriesWithEnhancedProducts() {
	console.log("\n📂 اختبار 3: الفئات مع المنتجات المحسنة");
	console.log("=".repeat(60));

	const query = `
    query GetCategoriesWithEnhancedProducts {
      categories {
        categories {
          id
          name
          displayName
          slug
          metaDescription
          image
          imageFilename
          parent {
            id
            name
            displayName
          }
          childs {
            id
            name
            displayName
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
			console.log(`✅ تم العثور على ${categories.length} فئة`);

			const mainCategories = categories.filter((cat) => !cat.parent);
			console.log(`📁 الفئات الرئيسية: ${mainCategories.length}`);

			mainCategories.forEach((category, index) => {
				console.log(
					`\n📂 الفئة ${index + 1}: ${category.name || category.displayName}`,
				);
				console.log(`   🆔 المعرف: ${category.id}`);
				console.log(`   🔗 الرابط: ${category.slug || "غير محدد"}`);
				console.log(`   📝 الوصف: ${category.metaDescription || "غير محدد"}`);

				const subCategories = categories.filter(
					(cat) => cat.parent?.id === category.id,
				);
				if (subCategories.length > 0) {
					console.log(`   📁 الفئات الفرعية: ${subCategories.length}`);
					subCategories.forEach((sub) => {
						console.log(
							`      - ${sub.name || sub.displayName} (${sub.slug || "بدون رابط"})`,
						);
					});
				}
			});

			return {
				success: true,
				categories: categories,
				mainCount: mainCategories.length,
			};
		} else {
			console.log("❌ لم يتم العثور على فئات");
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في اختبار الفئات: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Test 4: Products by Category with All Variant Data
async function testProductsByCategoryWithVariants(categoryId = 1) {
	console.log(
		`\n🛍️ اختبار 4: منتجات الفئة مع جميع بيانات المتغيرات (Category ID: ${categoryId})`,
	);
	console.log("=".repeat(60));

	const query = `
    query GetCategoryWithEnhancedProducts($id: Int!) {
      category(id: $id) {
        id
        name
        displayName
        products {
          id
          name
          displayName
          price
          listPrice
          standardPrice
          defaultCode
          barcode
          weight
          volume
          description
          descriptionSale
          image
          imageFilename
          image1920
          imageSmall
          imageMedium
          slug
          sku
          isInStock
          websitePublished
          isPublished
          active
          saleOk
          purchaseOk
          # Variant Information
          combinationInfoVariant
          variantPrice
          variantPriceAfterDiscount
          variantHasDiscountedPrice
          isVariantPossible
          variantAttributeValues {
            id
            name
            displayName
            attribute {
              id
              name
              displayName
            }
          }
          attributeValues {
            id
            name
            displayName
            attribute {
              id
              name
              displayName
            }
          }
          productVariants {
            id
            displayName
            listPrice
            standardPrice
            defaultCode
            attributeValues {
              id
              name
              displayName
            }
          }
          productVariantIds {
            id
            displayName
            listPrice
            standardPrice
            defaultCode
          }
          attributeLineIds {
            id
            attributeId {
              id
              name
              displayName
            }
            valueIds {
              id
              name
              displayName
            }
          }
          firstVariant {
            id
            name
            displayName
            price
            listPrice
            standardPrice
            defaultCode
          }
          # Inventory Information
          qtyAvailable
          virtualAvailable
          incomingQty
          outgoingQty
          createDate
          writeDate
        }
      }
    }
  `;

	try {
		const result = await makeGraphQLRequest(query, { id: categoryId });

		if (result.data?.category) {
			const category = result.data.category;
			const products = category.products || [];

			console.log(
				`✅ تم العثور على فئة: ${category.name || category.displayName}`,
			);
			console.log(`📦 المنتجات في الفئة: ${products.length}`);

			let productsWithVariants = 0;
			let productsWithAttributes = 0;
			let productsWithInventory = 0;

			products.forEach((product, index) => {
				console.log(
					`\n📦 المنتج ${index + 1}: ${product.name || product.displayName}`,
				);
				console.log(`   💰 السعر: ${product.price || product.listPrice} درهم`);
				console.log(`   📋 الكود: ${product.defaultCode || product.sku}`);
				console.log(`   📊 متوفر: ${product.isInStock ? "نعم" : "لا"}`);

				if (product.productVariants && product.productVariants.length > 0) {
					console.log(`   🎨 المتغيرات: ${product.productVariants.length}`);
					productsWithVariants++;
				}

				if (product.attributeValues && product.attributeValues.length > 0) {
					console.log(`   🏷️  الخصائص: ${product.attributeValues.length}`);
					productsWithAttributes++;
				}

				if (product.qtyAvailable !== undefined) {
					console.log(`   📦 المخزون: ${product.qtyAvailable}`);
					productsWithInventory++;
				}
			});

			console.log(`\n📊 إحصائيات فئة ${category.name}:`);
			console.log(`   📦 إجمالي المنتجات: ${products.length}`);
			console.log(`   🎨 منتجات مع متغيرات: ${productsWithVariants}`);
			console.log(`   🏷️  منتجات مع خصائص: ${productsWithAttributes}`);
			console.log(`   📦 منتجات مع مخزون: ${productsWithInventory}`);

			return {
				success: true,
				category: category,
				totalProducts: products.length,
				productsWithVariants,
				productsWithAttributes,
				productsWithInventory,
			};
		} else {
			console.log(`❌ لم يتم العثور على الفئة بالمعرف: ${categoryId}`);
			if (result.errors) {
				console.log("🔍 الأخطاء:", result.errors);
			}
			return { success: false, errors: result.errors };
		}
	} catch (error) {
		console.log(`❌ خطأ في اختبار منتجات الفئة: ${error.message}`);
		return { success: false, error: error.message };
	}
}

// Main Test Function
async function runEnhancedProductVariantsTest() {
	console.log("🚀 اختبار متغيرات المنتج المحسن - جميع البيانات الجديدة");
	console.log("=".repeat(80));
	console.log(`🔗 الخادم: ${ODOO_CONFIG.baseUrl}`);
	console.log(`📡 GraphQL: ${ODOO_CONFIG.graphqlUrl}`);
	console.log(`🕐 الوقت: ${new Date().toLocaleString("ar-SA")}`);
	console.log("=".repeat(80));

	const results = {
		timestamp: new Date().toISOString(),
		server: ODOO_CONFIG.baseUrl,
		tests: {},
	};

	try {
		// Test 1: Enhanced Products
		results.tests.enhancedProducts = await testEnhancedProducts();

		// Test 2: Single Product with Variants
		results.tests.singleProduct = await testSingleProductWithVariants(1);

		// Test 3: Categories
		results.tests.categories = await testCategoriesWithEnhancedProducts();

		// Test 4: Products by Category
		if (
			results.tests.categories.success &&
			results.tests.categories.categories.length > 0
		) {
			const firstCategoryId = results.tests.categories.categories[0].id;
			results.tests.productsByCategory =
				await testProductsByCategoryWithVariants(firstCategoryId);
		} else {
			results.tests.productsByCategory = {
				success: false,
				error: "No categories available",
			};
		}

		// Final Summary
		console.log("\n" + "=".repeat(80));
		console.log("📊 ملخص نتائج اختبار متغيرات المنتج المحسن");
		console.log("=".repeat(80));

		const summary = {
			enhancedProducts: results.tests.enhancedProducts?.success || false,
			singleProduct: results.tests.singleProduct?.success || false,
			categories: results.tests.categories?.success || false,
			productsByCategory: results.tests.productsByCategory?.success || false,
		};

		console.log(
			`🛍️  المنتجات المحسنة: ${summary.enhancedProducts ? "✅ نجح" : "❌ فشل"}`,
		);
		console.log(`🔍 منتج واحد: ${summary.singleProduct ? "✅ نجح" : "❌ فشل"}`);
		console.log(`📂 الفئات: ${summary.categories ? "✅ نجح" : "❌ فشل"}`);
		console.log(
			`🛍️  منتجات الفئة: ${summary.productsByCategory ? "✅ نجح" : "❌ فشل"}`,
		);

		// Detailed Results
		if (results.tests.enhancedProducts?.success) {
			console.log(`\n📦 تفاصيل المنتجات المحسنة:`);
			console.log(
				`   إجمالي المنتجات: ${results.tests.enhancedProducts.totalProducts}`,
			);
			console.log(
				`   منتجات مع متغيرات: ${results.tests.enhancedProducts.productsWithVariants}`,
			);
			console.log(
				`   منتجات مع خصائص: ${results.tests.enhancedProducts.productsWithAttributes}`,
			);
			console.log(
				`   منتجات مع مخزون: ${results.tests.enhancedProducts.productsWithInventory}`,
			);
		}

		if (results.tests.categories?.success) {
			console.log(`\n📂 تفاصيل الفئات:`);
			console.log(
				`   إجمالي الفئات: ${results.tests.categories.categories.length}`,
			);
			console.log(`   الفئات الرئيسية: ${results.tests.categories.mainCount}`);
		}

		const successfulTests = Object.values(summary).filter(
			(test) => test,
		).length;
		const totalTests = Object.keys(summary).length;
		const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

		console.log(
			`\n🎯 معدل نجاح الاختبارات: ${successRate}% (${successfulTests}/${totalTests})`,
		);

		// Final Conclusion
		console.log("\n🔍 الخلاصة النهائية:");
		if (successRate >= 80) {
			console.log("✅ ممتاز! جميع البيانات الجديدة تعمل بشكل مثالي");
			console.log("🎨 متغيرات المنتج والخصائص متاحة ومفعلة");
			console.log("📦 معلومات المخزون متاحة");
			console.log("🏷️  جميع الحقول الجديدة تعمل");
		} else if (successRate >= 60) {
			console.log("⚠️  جيد، معظم البيانات تعمل");
			console.log("🔧 بعض التحسينات مطلوبة");
		} else {
			console.log("❌ يحتاج إصلاحات عاجلة");
			console.log("🔧 البيانات الجديدة غير متاحة أو تحتاج تفعيل");
		}

		results.summary = summary;
		results.successRate = successRate;

		return results;
	} catch (error) {
		console.error("❌ خطأ في الاختبار المحسن:", error.message);
		results.error = error.message;
		return results;
	}
}

// Run the test
if (require.main === module) {
	runEnhancedProductVariantsTest()
		.then((results) => {
			console.log("\n✅ اكتمل اختبار متغيرات المنتج المحسن!");
			console.log("🎊 تم فحص جميع البيانات الجديدة والمتغيرات!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ فشل الاختبار المحسن:", error.message);
			process.exit(1);
		});
}

module.exports = { runEnhancedProductVariantsTest };
