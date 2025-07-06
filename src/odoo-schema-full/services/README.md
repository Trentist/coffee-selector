# خدمات النظام الموحد - Unified System Services

## نظرة عامة - Overview

هذا المجلد يحتوي على جميع الخدمات المتاحة في النظام الموحد لإدارة المنتجات والفئات والبيانات الأخرى.

## الخدمات المتاحة - Available Services

### 1. خدمة العرض - Display Service

خدمة شاملة لعرض المنتجات والفئات مع جميع الاستعلامات العاملة.

#### الميزات الرئيسية - Key Features

- ✅ عرض جميع الفئات مع التسلسل الهرمي
- ✅ عرض فئة واحدة مع منتجاتها
- ✅ عرض جميع المنتجات مع التفاصيل الكاملة
- ✅ عرض منتج واحد بالمعرف
- ✅ عرض منتجات فئة معينة
- ✅ البحث في المنتجات مع التصفية والترتيب
- ✅ دعم التوصيات والمقارنات

#### الاستعلامات المدعومة - Supported Queries

```typescript
// الحصول على جميع الفئات
await displayService.getAllCategories();

// الحصول على فئة بالمعرف
await displayService.getCategoryById(id);

// الحصول على جميع المنتجات
await displayService.getAllProducts();

// الحصول على منتج بالمعرف
await displayService.getProductById(id);

// الحصول على منتجات فئة معينة
await displayService.getProductsByCategory(categoryId);

// البحث في المنتجات
await displayService.searchProducts(searchInput);
```

#### مثال الاستخدام - Usage Example

```typescript
import { displayService } from "@/types/odoo-schema-full/services";

// الحصول على جميع الفئات
const categoriesResult = await displayService.getAllCategories();
if (categoriesResult.success) {
	console.log("الفئات:", categoriesResult.data);
}

// الحصول على منتج بالمعرف
const productResult = await displayService.getProductById(10);
if (productResult.success) {
	console.log("المنتج:", productResult.data);
}
```

### 2. خدمة المنتجات - Product Service

خدمة متقدمة لإدارة المنتجات مع ميزات إضافية.

#### الميزات الإضافية - Additional Features

- 🔍 البحث المتقدم
- 📊 التحليلات والإحصائيات
- 🛒 إدارة المخزون
- ⭐ التوصيات والمراجعات
- 🔄 المقارنات
- 📈 تتبع الأداء

## التكوين - Configuration

### متغيرات البيئة - Environment Variables

```env
NEXT_PUBLIC_ODOO_GRAPHQL_URL=https://your-odoo-instance.com/graphql/vsf
NEXT_PUBLIC_ODOO_API_KEY=your-api-key-here
```

### إعدادات الخدمة - Service Configuration

```typescript
import { SERVICE_CONFIG } from "@/types/odoo-schema-full/services";

const customConfig = {
	...SERVICE_CONFIG,
	API_TIMEOUT: 45000,
	RETRY_ATTEMPTS: 5,
};
```

## أنواع البيانات - Data Types

جميع الخدمات تستخدم الأنواع المعرفة في النظام الموحد:

```typescript
import {
	Product,
	ProductCategory,
	ProductSearchInput,
	ProductSearchResult,
	ApiResponse,
	ProductsApiResponse,
	ProductApiResponse,
} from "@/types/odoo-schema-full/types";
```

## الاستجابة - Response Format

جميع الخدمات تعيد استجابة موحدة:

```typescript
interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	timestamp?: string;
}
```

## معالجة الأخطاء - Error Handling

```typescript
import { handleServiceError } from "@/types/odoo-schema-full/services";

try {
	const result = await displayService.getAllProducts();
	// استخدام النتيجة
} catch (error) {
	const errorInfo = handleServiceError(error, "DisplayService");
	console.error("خطأ في الخدمة:", errorInfo);
}
```

## فحص صحة الخدمة - Health Check

```typescript
import { checkServiceHealth } from "@/types/odoo-schema-full/services";

const health = await checkServiceHealth();
if (health.healthy) {
	console.log("جميع الخدمات تعمل بشكل صحيح");
} else {
	console.log("مشكلة في الخدمات:", health.message);
}
```

## الاختبارات - Testing

### تشغيل الاختبارات - Running Tests

```bash
# اختبار خدمة العرض
node src/scripts/test/display-service-test.js

# اختبار شامل للبيانات
node src/scripts/test/comprehensive-data-test.js
```

### نتائج الاختبارات - Test Results

الاختبارات الأخيرة أظهرت:

- ✅ معدل نجاح 100% لجميع الاستعلامات
- 📊 2 فئة متاحة
- 🛍️ 12 منتج متاح
- 💰 نطاق أسعار: 0 - 24000 درهم

## الاستخدام في React - React Usage

### استخدام Hook - Hook Usage

```typescript
import { useDisplayService } from '@/types/odoo-schema-full/services';

function ProductList() {
  const displayService = useDisplayService();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await displayService.getAllProducts();
      if (result.success) {
        setProducts(result.data);
      }
    };
    loadProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### استخدام Apollo Client - Apollo Client Usage

```typescript
import { displayApolloClient } from '@/types/odoo-schema-full/services';

// في _app.tsx أو layout
<ApolloProvider client={displayApolloClient}>
  <Component {...pageProps} />
</ApolloProvider>
```

## الميزات المتقدمة - Advanced Features

### البحث والتصفية - Search & Filtering

```typescript
const searchInput: ProductSearchInput = {
	query: "قهوة",
	filters: {
		category_id: 1,
		price_range: { min: 50, max: 100 },
		in_stock: true,
	},
	sort_by: "price",
	sort_direction: "ASC",
	current_page: 1,
	page_size: 20,
};

const searchResult = await displayService.searchProducts(searchInput);
```

### التوصيات - Recommendations

```typescript
const recommendations = await displayService.getProductRecommendations(
	productId,
	"RELATED",
	5,
);
```

### المقارنات - Comparisons

```typescript
const comparison = await displayService.displayProductComparison([
	productId1,
	productId2,
	productId3,
]);
```

## الأداء والتحسين - Performance & Optimization

### التخزين المؤقت - Caching

```typescript
// Apollo Client configured with InMemoryCache
const client = new ApolloClient({
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			errorPolicy: "all",
		},
		query: {
			errorPolicy: "all",
		},
	},
});
```

### إعادة المحاولة - Retry Logic

```typescript
const config = {
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000,
	API_TIMEOUT: 30000,
};
```

## الأمان - Security

- 🔐 استخدام Bearer Token للمصادقة
- 🛡️ التحقق من صحة المدخلات
- 🔒 حماية من هجمات GraphQL
- 📝 تسجيل الأخطاء والأنشطة

## الدعم - Support

### الأخطاء الشائعة - Common Issues

1. **خطأ في الاتصال**

   - تحقق من صحة URL
   - تحقق من API Key
   - تحقق من اتصال الإنترنت

2. **خطأ في الاستعلام**

   - تحقق من صحة الحقول المطلوبة
   - تحقق من أنواع البيانات
   - راجع توثيق GraphQL

3. **خطأ في التخزين المؤقت**
   - امسح التخزين المؤقت
   - أعد تشغيل التطبيق
   - تحقق من إعدادات Apollo Client

### الحصول على المساعدة - Getting Help

- 📖 راجع هذا التوثيق
- 🧪 شغل الاختبارات للتشخيص
- 🔍 تحقق من سجلات الأخطاء
- 💬 تواصل مع فريق التطوير

## التطوير المستقبلي - Future Development

### الميزات المخططة - Planned Features

- 🎯 البحث الذكي
- 📊 لوحة تحكم التحليلات
- 🔔 إشعارات المخزون
- 🌐 دعم متعدد اللغات
- 📱 تحسين الأداء للجوال

### المساهمة - Contributing

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة
3. أضف الاختبارات
4. ارفع Pull Request

---

**آخر تحديث:** يناير 2025
**الإصدار:** 1.0.0
**الحالة:** جاهز للإنتاج ✅
