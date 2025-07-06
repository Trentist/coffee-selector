# Favorites System - نظام المفضلة

نظام متكامل للمفضلة يدعم المستخدمين المسجلين والزوار مع ميزات العربة ومشاركة المنتجات.

## الميزات الرئيسية

### 🎯 للمستخدمين المسجلين

- ✅ حفظ دائم في الخادم
- ✅ مزامنة عبر الأجهزة
- ✅ نسخ احتياطي تلقائي
- ✅ إحصائيات مفصلة
- ✅ مشاركة على وسائل التواصل الاجتماعي

### 🔓 للزوار

- ✅ حفظ مؤقت محلي
- ✅ سرعة في الوصول
- ✅ لا يحتاج تسجيل دخول
- ✅ إمكانية النقل عند التسجيل
- ✅ مشاركة المنتجات

### 🛒 تكامل مع العربة

- ✅ إضافة من المفضلة للعربة
- ✅ عمليات مجمعة
- ✅ إضافة مع المفضلة في خطوة واحدة

### 📱 مشاركة المنتجات

- ✅ فيسبوك
- ✅ تويتر
- ✅ واتساب
- ✅ تليجرام
- ✅ البريد الإلكتروني
- ✅ نسخ الرابط
- ✅ تحميل بطاقة المنتج

## التثبيت والاستخدام

### 1. إعداد الخدمة

```typescript
import {
	createFavoritesService,
	createFavoritesOperations,
} from "@/store/favorites";
import { ApolloClient } from "@apollo/client";

// إنشاء خدمة المفضلة
const favoritesService = createFavoritesService(apolloClient);
const favoritesOperations = createFavoritesOperations(favoritesService);

// تهيئة الخدمة
await favoritesService.initialize();
```

### 2. إضافة Redux Store

```typescript
// store/index.ts
import { favoritesReducer } from "@/store/favorites";

export const store = configureStore({
	reducer: {
		favorites: favoritesReducer,
		// ... other reducers
	},
});
```

### 3. استخدام React Hooks

```typescript
import { useFavorites, useProductFavorites } from "@/store/favorites";

// Hook رئيسي للمفضلة
const {
	favorites,
	loading,
	error,
	stats,
	addToFavorites,
	removeFromFavorites,
	addToCart,
	shareProduct,
} = useFavorites(favoritesService);

// Hook لمنتج واحد
const { isInFavorites, addToFavorites, removeFromFavorites } =
	useProductFavorites(favoritesService, productId);
```

### 4. استخدام المكونات

```tsx
import { FavoritesButton, FavoritesList, ShareButton } from '@/store/favorites';

// زر المفضلة
<FavoritesButton
  product={product}
  favoritesService={favoritesService}
  variant="full"
  showAddToCart={true}
  onSuccess={(message) => console.log(message)}
/>

// قائمة المفضلة
<FavoritesList
  favoritesService={favoritesService}
  showSearch={true}
  showFilters={true}
  showBulkActions={true}
/>

// زر المشاركة
<ShareButton
  favorite={favorite}
  favoritesService={favoritesService}
  variant="modal"
  platforms={['facebook', 'twitter', 'whatsapp']}
/>
```

## العمليات المتاحة

### إضافة للمفضلة

```typescript
// إضافة عادية
const result = await addToFavorites(product);

// إضافة مع العربة
const result = await addToFavorites(product, true);
```

### حذف من المفضلة

```typescript
const result = await removeFromFavorites(productId);
```

### إضافة للعربة

```typescript
const result = await addToCart(favorite);
```

### مشاركة المنتج

```typescript
const result = shareProduct(favorite, "facebook");
```

### عمليات مجمعة

```typescript
// إضافة مجموعة للعربة
const result = await bulkAddToCart(selectedFavorites);

// حذف مجموعة من المفضلة
const result = await bulkRemoveFromFavorites(productIds);
```

## الإحصائيات والتحليلات

```typescript
const stats = getFavoritesStats();
console.log({
	totalFavorites: stats.totalFavorites,
	localFavorites: stats.localFavorites,
	serverFavorites: stats.serverFavorites,
	categories: stats.categories,
	totalValue: stats.totalValue,
});
```

## التصدير والاستيراد

```typescript
// تصدير المفضلة
const exportData = exportFavorites();

// استيراد المفضلة
const result = importFavorites(exportData);
```

## النقل من الزائر للمستخدم

```typescript
// عند تسجيل دخول الزائر
const result = await migrateGuestFavorites();
if (result.success) {
	console.log(`تم نقل ${result.migratedCount} منتج`);
}
```

## البحث والتصفية

```typescript
// البحث
const results = searchFavorites("قهوة");

// التصفية حسب الفئة
const filtered = filterFavoritesByCategory("قهوة عربية");

// الترتيب
const sorted = sortFavorites(favorites, "price"); // 'name', 'price', 'date', 'category'
```

## التخصيص

### إعدادات المفضلة

```typescript
const CUSTOM_CONFIG = {
	maxLocalFavorites: 100,
	maxServerFavorites: 500,
	autoSync: false,
	syncInterval: 60000,
	enableSharing: true,
	enableExport: true,
	enableImport: true,
	socialPlatforms: ["facebook", "twitter"],
};
```

### تخصيص المكونات

```tsx
<FavoritesButton
  variant="icon" // 'icon', 'text', 'full'
  size="lg" // 'sm', 'md', 'lg'
  showAddToCart={true}
  className="custom-favorites-button"
  onSuccess={(message) => showNotification(message)}
  onError={(error) => showError(error)}
/>

<ShareButton
  variant="dropdown" // 'icon', 'dropdown', 'modal'
  platforms={['facebook', 'whatsapp']}
  className="custom-share-button"
  onSuccess={(platform) => trackShare(platform)}
  onError={(error) => logError(error)}
/>
```

## الأمان والخصوصية

### حماية البيانات

- ✅ تشفير البيانات المحلية
- ✅ التحقق من صحة المدخلات
- ✅ حماية من XSS
- ✅ حماية من CSRF

### إدارة الجلسات

- ✅ جلسات آمنة للمستخدمين
- ✅ جلسات مؤقتة للزوار
- ✅ تنظيف تلقائي للبيانات القديمة

## الأداء والتحسين

### التخزين المؤقت

- ✅ تخزين مؤقت للبيانات المحلية
- ✅ مزامنة ذكية مع الخادم
- ✅ تحميل تدريجي للقوائم الكبيرة

### التحسين

- ✅ تحميل كسول للمكونات
- ✅ تحسين الصور
- ✅ ضغط البيانات

## الاختبار

### تشغيل الاختبارات

```bash
# اختبار المفضلة الكامل
node favorites-operations-test.js

# اختبار التكامل مع العربة
node cart-services-integration-test.js
```

### نتائج الاختبار

```
✅ جلب المنتجات: 3 منتج
✅ عمليات المستخدم: 4 عملية
✅ عمليات الزائر: 6 عملية
✅ المقارنة: تمت
✅ التكامل مع العربة: 100%
✅ مشاركة المنتجات: متاحة
```

## الدعم والمساعدة

### المشاكل الشائعة

1. **المفضلة لا تحفظ**

   - تحقق من صلاحيات التخزين المحلي
   - تأكد من تهيئة الخدمة

2. **المشاركة لا تعمل**

   - تحقق من إعدادات المتصفح
   - تأكد من وجود اتصال بالإنترنت

3. **النقل من الزائر للمستخدم فشل**
   - تحقق من تسجيل الدخول
   - تأكد من صحة البيانات

### التطوير المستقبلي

- [ ] دعم المفضلة المشتركة
- [ ] إشعارات المفضلة
- [ ] تحليلات متقدمة
- [ ] دعم المفضلة المؤقتة
- [ ] تكامل مع أنظمة خارجية

## الترخيص

هذا النظام جزء من مشروع Coffee Selection ويخضع لشروط الترخيص المحددة في المشروع.
