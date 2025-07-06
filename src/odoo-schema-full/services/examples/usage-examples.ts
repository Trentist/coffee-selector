/**
 * أمثلة الاستخدام العملي للخدمات
 * Practical Usage Examples for Services
 */

import {
	displayService,
	productService,
	handleServiceError,
	wrapServiceResponse,
} from "../index";

import {
	ProductSearchInput,
	ProductFilterInput,
	SortField,
	SortDirection,
	RecommendationType,
} from "../../types";

// ============================================================================
// أمثلة خدمة العرض - Display Service Examples
// ============================================================================

/**
 * مثال 1: عرض جميع الفئات
 * Example 1: Display All Categories
 */
export async function displayAllCategoriesExample() {
	console.log("📂 عرض جميع الفئات...");

	try {
		const result = await displayService.getAllCategories();

		if (result.success && result.data) {
			console.log(`✅ تم العثور على ${result.data.length} فئة:`);

			result.data.forEach((category, index) => {
				console.log(`   ${index + 1}. ${category.name}`);
				console.log(`      🔗 الرابط: ${category.url_path}`);
				console.log(
					`      📝 الوصف: ${category.description?.substring(0, 50)}...`,
				);

				if (category.children && category.children.length > 0) {
					console.log(`      👶 الفئات الفرعية: ${category.children.length}`);
				}
			});

			return result;
		} else {
			console.log("❌ فشل في الحصول على الفئات:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في خدمة العرض:", errorInfo);
		return errorInfo;
	}
}

/**
 * مثال 2: عرض فئة مع منتجاتها
 * Example 2: Display Category with Products
 */
export async function displayCategoryWithProductsExample(categoryId: number) {
	console.log(`📂 عرض الفئة ${categoryId} مع منتجاتها...`);

	try {
		const result = await displayService.getCategoryById(categoryId);

		if (result.success && result.data) {
			const category = result.data;
			console.log(`✅ الفئة: ${category.name}`);
			console.log(`📝 الوصف: ${category.description}`);
			console.log(`🖼️ الصورة: ${category.image ? "متوفرة" : "غير متوفرة"}`);

			// الحصول على منتجات الفئة
			const productsResult =
				await displayService.getProductsByCategory(categoryId);

			if (productsResult.success && productsResult.data) {
				console.log(`🛍️ المنتجات في الفئة: ${productsResult.data.length}`);

				productsResult.data.slice(0, 3).forEach((product, index) => {
					console.log(`   ${index + 1}. ${product.name}`);
					console.log(
						`      💰 السعر: ${product.price.regularPrice.value} ${product.price.regularPrice.currency}`,
					);
					console.log(`      📦 متوفر: ${product.is_in_stock ? "نعم" : "لا"}`);
				});
			}

			return {
				category: result,
				products: productsResult,
			};
		} else {
			console.log("❌ فشل في الحصول على الفئة:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في خدمة العرض:", errorInfo);
		return errorInfo;
	}
}

/**
 * مثال 3: عرض جميع المنتجات
 * Example 3: Display All Products
 */
export async function displayAllProductsExample() {
	console.log("🛍️ عرض جميع المنتجات...");

	try {
		const result = await displayService.getAllProducts();

		if (result.success && result.data) {
			console.log(`✅ تم العثور على ${result.data.length} منتج:`);

			// تجميع المنتجات حسب الفئة
			const productsByCategory: Record<string, any[]> = {};

			result.data.forEach((product) => {
				product.categories.forEach((category) => {
					if (!productsByCategory[category.name]) {
						productsByCategory[category.name] = [];
					}
					productsByCategory[category.name].push(product);
				});
			});

			// عرض المنتجات مجمعة
			Object.entries(productsByCategory).forEach(([categoryName, products]) => {
				console.log(`\n📂 ${categoryName} (${products.length} منتج):`);
				products.slice(0, 3).forEach((product, index) => {
					console.log(`   ${index + 1}. ${product.name}`);
					console.log(
						`      💰 السعر: ${product.price.regularPrice.value} ${product.price.regularPrice.currency}`,
					);
					console.log(`      📦 متوفر: ${product.is_in_stock ? "نعم" : "لا"}`);
				});
			});

			return result;
		} else {
			console.log("❌ فشل في الحصول على المنتجات:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في خدمة العرض:", errorInfo);
		return errorInfo;
	}
}

/**
 * مثال 4: عرض منتج واحد
 * Example 4: Display Single Product
 */
export async function displaySingleProductExample(productId: number) {
	console.log(`🛍️ عرض المنتج ${productId}...`);

	try {
		const result = await displayService.getProductById(productId);

		if (result.success && result.data) {
			const product = result.data;
			console.log(`✅ المنتج: ${product.name}`);
			console.log(
				`💰 السعر: ${product.price.regularPrice.value} ${product.price.regularPrice.currency}`,
			);
			console.log(`📦 متوفر: ${product.is_in_stock ? "نعم" : "لا"}`);
			console.log(`🔗 الرابط: ${product.url_key}`);
			console.log(
				`📝 الوصف: ${product.description?.html?.substring(0, 100)}...`,
			);

			if (product.categories.length > 0) {
				console.log(
					`📂 الفئات: ${product.categories.map((c) => c.name).join(", ")}`,
				);
			}

			if (product.attributes.length > 0) {
				console.log(`🔧 الخصائص:`);
				product.attributes.slice(0, 3).forEach((attr) => {
					console.log(`   - ${attr.attribute_label}: ${attr.attribute_value}`);
				});
			}

			return result;
		} else {
			console.log("❌ فشل في الحصول على المنتج:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في خدمة العرض:", errorInfo);
		return errorInfo;
	}
}

// ============================================================================
// أمثلة البحث والتصفية - Search & Filter Examples
// ============================================================================

/**
 * مثال 5: البحث في المنتجات
 * Example 5: Search Products
 */
export async function searchProductsExample() {
	console.log("🔍 البحث في المنتجات...");

	const searchInput: ProductSearchInput = {
		query: "قهوة",
		filters: {
			category_id: 1, // Coffee Beans
			price_range: {
				min: 50,
				max: 100,
			},
			in_stock: false, // نبحث في جميع المنتجات
		},
		sort_by: "price" as SortField,
		sort_direction: "ASC" as SortDirection,
		current_page: 1,
		page_size: 10,
	};

	try {
		const result = await displayService.searchProducts(searchInput);

		if (result.success && result.data) {
			const searchResult = result.data;
			console.log(`✅ تم العثور على ${searchResult.total_count} منتج:`);
			console.log(
				`📄 الصفحة: ${searchResult.page_info.current_page} من ${searchResult.page_info.total_pages}`,
			);

			searchResult.products.forEach((product, index) => {
				console.log(`   ${index + 1}. ${product.name}`);
				console.log(
					`      💰 السعر: ${product.price.regularPrice.value} ${product.price.regularPrice.currency}`,
				);
				console.log(`      📦 متوفر: ${product.is_in_stock ? "نعم" : "لا"}`);
			});

			return result;
		} else {
			console.log("❌ فشل في البحث:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في البحث:", errorInfo);
		return errorInfo;
	}
}

/**
 * مثال 6: البحث المتقدم
 * Example 6: Advanced Search
 */
export async function advancedSearchExample() {
	console.log("🔍 البحث المتقدم...");

	// البحث في منتجات محددة السعر
	const priceSearch: ProductSearchInput = {
		query: "",
		filters: {
			price_range: {
				min: 100,
				max: 500,
			},
		},
		sort_by: "name" as SortField,
		sort_direction: "ASC" as SortDirection,
		current_page: 1,
		page_size: 20,
	};

	try {
		const result = await displayService.searchProducts(priceSearch);

		if (result.success && result.data) {
			console.log(`✅ المنتجات بين 100-500 درهم: ${result.data.total_count}`);

			// تجميع حسب الفئة
			const categoryStats: Record<string, number> = {};
			result.data.products.forEach((product) => {
				product.categories.forEach((category) => {
					categoryStats[category.name] =
						(categoryStats[category.name] || 0) + 1;
				});
			});

			console.log("📊 التوزيع حسب الفئة:");
			Object.entries(categoryStats).forEach(([category, count]) => {
				console.log(`   ${category}: ${count} منتج`);
			});

			return result;
		} else {
			console.log("❌ فشل في البحث المتقدم:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في البحث المتقدم:", errorInfo);
		return errorInfo;
	}
}

// ============================================================================
// أمثلة التوصيات - Recommendation Examples
// ============================================================================

/**
 * مثال 7: الحصول على توصيات المنتجات
 * Example 7: Get Product Recommendations
 */
export async function getProductRecommendationsExample(productId: number) {
	console.log(`⭐ الحصول على توصيات للمنتج ${productId}...`);

	try {
		const result = await displayService.getProductRecommendations(
			productId,
			"RELATED" as RecommendationType,
			5,
		);

		if (result.success && result.data) {
			console.log(`✅ تم العثور على ${result.data.length} توصية:`);

			result.data.forEach((recommendation, index) => {
				console.log(`   ${index + 1}. ${recommendation.name}`);
				console.log(
					`      💰 السعر: ${recommendation.price.regularPrice.value} ${recommendation.price.regularPrice.currency}`,
				);
				console.log(
					`      ⭐ الثقة: ${(recommendation.confidence_score * 100).toFixed(1)}%`,
				);
				console.log(`      🎯 السبب: ${recommendation.recommendation_reason}`);
			});

			return result;
		} else {
			console.log("❌ فشل في الحصول على التوصيات:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في التوصيات:", errorInfo);
		return errorInfo;
	}
}

// ============================================================================
// أمثلة المقارنة - Comparison Examples
// ============================================================================

/**
 * مثال 8: مقارنة المنتجات
 * Example 8: Compare Products
 */
export async function compareProductsExample(productIds: number[]) {
	console.log(`🔄 مقارنة المنتجات: ${productIds.join(", ")}...`);

	try {
		const result = await displayService.displayProductComparison(productIds);

		if (result.success && result.data) {
			const comparison = result.data;
			console.log(`✅ تم إنشاء مقارنة لـ ${comparison.products.length} منتج:`);

			// عرض الخصائص الأساسية
			console.log("\n📊 الخصائص الأساسية:");
			comparison.attributes.slice(0, 3).forEach((attr) => {
				console.log(`\n${attr.label}:`);
				attr.values.forEach((value) => {
					console.log(`   ${value.product_id}: ${value.value}`);
				});
			});

			// عرض الاختلافات
			if (comparison.differences.length > 0) {
				console.log("\n🔍 الاختلافات الرئيسية:");
				comparison.differences.forEach((diff) => {
					console.log(`\n${diff.attribute_label}:`);
					diff.differences.forEach((item) => {
						const status = item.is_better
							? "✅ أفضل"
							: item.is_worse
								? "❌ أسوأ"
								: "➖ عادي";
						console.log(`   ${item.product_id}: ${item.value} ${status}`);
					});
				});
			}

			return result;
		} else {
			console.log("❌ فشل في إنشاء المقارنة:", result.error);
			return result;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في المقارنة:", errorInfo);
		return errorInfo;
	}
}

// ============================================================================
// أمثلة الإحصائيات - Statistics Examples
// ============================================================================

/**
 * مثال 9: إحصائيات المنتجات
 * Example 9: Product Statistics
 */
export async function productStatisticsExample() {
	console.log("📊 إحصائيات المنتجات...");

	try {
		// الحصول على جميع المنتجات
		const productsResult = await displayService.getAllProducts();

		if (productsResult.success && productsResult.data) {
			const products = productsResult.data;

			// حساب الإحصائيات
			const stats = {
				total: products.length,
				inStock: products.filter((p) => p.is_in_stock).length,
				outOfStock: products.filter((p) => !p.is_in_stock).length,
				withImages: products.filter((p) => p.image?.url).length,
				withCategories: products.filter((p) => p.categories.length > 0).length,
				priceRange: {
					min: Math.min(...products.map((p) => p.price.regularPrice.value)),
					max: Math.max(...products.map((p) => p.price.regularPrice.value)),
					average:
						products.reduce((sum, p) => sum + p.price.regularPrice.value, 0) /
						products.length,
				},
				categoryDistribution: {} as Record<string, number>,
			};

			// توزيع الفئات
			products.forEach((product) => {
				product.categories.forEach((category) => {
					stats.categoryDistribution[category.name] =
						(stats.categoryDistribution[category.name] || 0) + 1;
				});
			});

			// عرض الإحصائيات
			console.log("📈 الإحصائيات العامة:");
			console.log(`   📦 إجمالي المنتجات: ${stats.total}`);
			console.log(`   ✅ متوفر: ${stats.inStock}`);
			console.log(`   ❌ غير متوفر: ${stats.outOfStock}`);
			console.log(`   🖼️ له صورة: ${stats.withImages}`);
			console.log(`   📂 له فئات: ${stats.withCategories}`);

			console.log("\n💰 إحصائيات الأسعار:");
			console.log(`   💵 أقل سعر: ${stats.priceRange.min} درهم`);
			console.log(`   💵 أعلى سعر: ${stats.priceRange.max} درهم`);
			console.log(
				`   💵 متوسط السعر: ${stats.priceRange.average.toFixed(2)} درهم`,
			);

			console.log("\n📂 توزيع الفئات:");
			Object.entries(stats.categoryDistribution).forEach(
				([category, count]) => {
					const percentage = ((count / stats.total) * 100).toFixed(1);
					console.log(`   ${category}: ${count} منتج (${percentage}%)`);
				},
			);

			return wrapServiceResponse(stats);
		} else {
			console.log(
				"❌ فشل في الحصول على إحصائيات المنتجات:",
				productsResult.error,
			);
			return productsResult;
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في إحصائيات المنتجات:", errorInfo);
		return errorInfo;
	}
}

// ============================================================================
// أمثلة الاستخدام المتقدم - Advanced Usage Examples
// ============================================================================

/**
 * مثال 10: عرض شامل للمتجر
 * Example 10: Complete Store Display
 */
export async function completeStoreDisplayExample() {
	console.log("🏪 عرض شامل للمتجر...");

	try {
		// 1. الحصول على الفئات
		const categoriesResult = await displayService.getAllCategories();

		// 2. الحصول على المنتجات
		const productsResult = await displayService.getAllProducts();

		// 3. الحصول على الإحصائيات
		const statsResult = await productStatisticsExample();

		if (categoriesResult.success && productsResult.success) {
			console.log("\n🎉 عرض شامل للمتجر:");
			console.log("=".repeat(50));

			console.log(`📂 الفئات: ${categoriesResult.data?.length || 0}`);
			console.log(`🛍️ المنتجات: ${productsResult.data?.length || 0}`);

			if (statsResult.success && statsResult.data) {
				const stats = statsResult.data;
				console.log(
					`💰 نطاق الأسعار: ${stats.priceRange.min} - ${stats.priceRange.max} درهم`,
				);
				console.log(`📦 متوفر: ${stats.inStock}/${stats.total}`);
			}

			// عرض أفضل المنتجات
			if (productsResult.data) {
				const topProducts = productsResult.data
					.filter((p) => p.is_in_stock)
					.sort(
						(a, b) => b.price.regularPrice.value - a.price.regularPrice.value,
					)
					.slice(0, 3);

				console.log("\n🏆 أفضل المنتجات:");
				topProducts.forEach((product, index) => {
					console.log(
						`   ${index + 1}. ${product.name} - ${product.price.regularPrice.value} درهم`,
					);
				});
			}

			return {
				categories: categoriesResult,
				products: productsResult,
				statistics: statsResult,
			};
		} else {
			console.log("❌ فشل في عرض المتجر الشامل");
			return {
				categories: categoriesResult,
				products: productsResult,
			};
		}
	} catch (error) {
		const errorInfo = handleServiceError(error, "DisplayService");
		console.log("❌ خطأ في عرض المتجر الشامل:", errorInfo);
		return errorInfo;
	}
}

// ============================================================================
// تصدير الأمثلة - Export Examples
// ============================================================================

export const examples = {
	displayAllCategories: displayAllCategoriesExample,
	displayCategoryWithProducts: displayCategoryWithProductsExample,
	displayAllProducts: displayAllProductsExample,
	displaySingleProduct: displaySingleProductExample,
	searchProducts: searchProductsExample,
	advancedSearch: advancedSearchExample,
	getProductRecommendations: getProductRecommendationsExample,
	compareProducts: compareProductsExample,
	productStatistics: productStatisticsExample,
	completeStoreDisplay: completeStoreDisplayExample,
};

export default examples;
