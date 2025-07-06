# نظام الترجمة (Internationalization System)

## نظرة عامة

نظام الترجمة المتكامل يدعم اللغتين العربية والإنجليزية مع إدارة شاملة للمفاتيح والمسارات والتنقل.

## الملفات الرئيسية

### التكوين

- `config.ts` - تكوين الترجمة الأساسي
- `navigation.ts` - نظام التنقل متعدد اللغات
- `routing.ts` - توجيه المسارات
- `utils.ts` - أدوات مساعدة للترجمة

### المكونات

- `LanguageSwitcher.tsx` - مكون تبديل اللغة
- `LocaleProvider.tsx` - مزود اللغة مع دعم RTL

### الهوكات

- `useTranslation.ts` - Hook مخصص للترجمة
- `useComponentTranslation.ts` - Hook للترجمة حسب المكون
- `useFormTranslation.ts` - Hook لترجمة النماذج

### الثوابت

- `translation-keys.ts` - مفاتيح الترجمة الرئيسية
- `auth-constants.ts` - ثوابت المصادقة
- `shop-constants.ts` - ثوابت المتجر
- `dashboard-constants.ts` - ثوابت لوحة التحكم

## الاستخدام

### استخدام Hook الترجمة الأساسي

```typescript
import { useTranslation } from '@/i18n';

function MyComponent() {
  const { t, common, shop, auth } = useTranslation();

  return (
    <div>
      <h1>{common('HOME')}</h1>
      <p>{shop('PRODUCT_CARD_ADD_TO_CART')}</p>
      <button>{auth('LOGIN_BUTTON')}</button>
    </div>
  );
}
```

### استخدام Hook الترجمة حسب المكون

```typescript
import { useComponentTranslation } from '@/i18n';

function ProductCard() {
  const { t } = useComponentTranslation('product_card');

  return (
    <div>
      <h3>{t('title')}</h3>
      <p>{t('description')}</p>
      <button>{t('add_to_cart')}</button>
    </div>
  );
}
```

### استخدام Hook ترجمة النماذج

```typescript
import { useFormTranslation } from '@/i18n';

function LoginForm() {
  const { getFieldTranslation, getValidationMessage } = useFormTranslation('login');

  return (
    <form>
      <input
        placeholder={getFieldTranslation('email', 'placeholder')}
        aria-label={getFieldTranslation('email', 'label')}
      />
      <span>{getValidationMessage('email', 'required')}</span>
    </form>
  );
}
```

### استخدام مكون تبديل اللغة

```typescript
import { LanguageSwitcher } from '@/i18n';

function Header() {
  return (
    <header>
      <LanguageSwitcher variant="button" size="md" colorScheme="blue" />
    </header>
  );
}
```

### استخدام مزود اللغة

```typescript
import { LocaleProvider } from '@/i18n';

function App() {
  return (
    <LocaleProvider>
      <YourApp />
    </LocaleProvider>
  );
}
```

## إضافة ترجمات جديدة

### 1. إضافة مفاتيح جديدة في الثوابت

```typescript
// في src/constants/translation-keys.ts
export const NEW_KEYS = {
	TITLE: "new.title",
	DESCRIPTION: "new.description",
} as const;
```

### 2. إضافة الترجمات في ملفات JSON

```json
// في messages/ar/new.json
{
  "title": "العنوان الجديد",
  "description": "الوصف الجديد"
}

// في messages/en/new.json
{
  "title": "New Title",
  "description": "New Description"
}
```

### 3. تحديث ملف التكوين

```typescript
// في src/i18n/config.ts
const messages = {
	// ... الترجمات الموجودة
	new: (await import(`../../messages/${locale}/new.json`)).default,
};
```

## دعم RTL

النظام يدعم الاتجاه من اليمين إلى اليسار (RTL) للغة العربية تلقائياً:

```typescript
import { useIsRTL, useDirection } from '@/i18n';

function MyComponent() {
  const isRTL = useIsRTL();
  const direction = useDirection();

  return (
    <div style={{ direction }}>
      {isRTL ? 'النص العربي' : 'English Text'}
    </div>
  );
}
```

## تنسيق العملة والتواريخ

```typescript
import { formatCurrency, formatDate, formatNumber } from '@/i18n';

function PriceDisplay() {
  const locale = useLocale();

  return (
    <div>
      <p>{formatCurrency(100, locale)}</p>
      <p>{formatDate(new Date(), locale)}</p>
      <p>{formatNumber(1000, locale)}</p>
    </div>
  );
}
```

## أفضل الممارسات

1. **استخدام الثوابت**: استخدم مفاتيح الترجمة من ملفات الثوابت
2. **التسمية الواضحة**: استخدم أسماء واضحة للمفاتيح
3. **التنظيم**: نظم المفاتيح حسب الصفحة أو المكون
4. **الاختبار**: اختبر الترجمات في كلا اللغتين
5. **الأداء**: استخدم التحميل الكسول للترجمات الكبيرة

## استكشاف الأخطاء

### مشكلة: مفتاح الترجمة غير موجود

```typescript
// تأكد من وجود المفتاح في ملفات JSON
// تأكد من تحديث ملف التكوين
// استخدم fallback value
const text = t("missing_key", "Fallback Text");
```

### مشكلة: اتجاه RTL لا يعمل

```typescript
// تأكد من استخدام LocaleProvider
// تأكد من أن اللغة العربية محددة بشكل صحيح
// تحقق من إعدادات CSS
```

### مشكلة: المسارات لا تعمل

```typescript
// تأكد من تكوين next.config.js
// تحقق من ملف middleware.ts
// تأكد من صحة المسارات في navigation.ts
```
