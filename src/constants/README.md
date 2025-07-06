# Constants Directory

هذا المجلد يحتوي على جميع الثوابت المستخدمة في التطبيق، منظمة بشكل منطقي ومُقسمة حسب الوظيفة.

## هيكل الملفات

### `app-constants.ts`

الثوابت العامة للتطبيق:

- إعدادات اللغة والعملة
- مسارات الصفحات المترجمة
- بيانات التطبيق الوصفية
- إعدادات الـ API والثيم
- إعدادات التخزين المؤقت

### `filter-constants.ts`

ثوابت نظام الفلترة والبحث:

- خيارات الترتيب والفلترة
- أنواع الفلاتر المختلفة
- الإعدادات المسبقة للفلاتر
- إعدادات الصفحات والعرض
- مهلات الانتظار والتحديد

### `index.ts`

ملف الفهرسة الرئيسي الذي يُصدّر جميع الثوابت من ملف واحد مركزي.

## الاستخدام

### استيراد الثوابت العامة

```typescript
import {
	DEFAULT_CURRENCY,
	DEFAULT_LANGUAGE,
	SUPPORTED_LOCALES,
	CURRENCY_SETTINGS,
} from "@/constants";
```

### استيراد ثوابت الفلترة

```typescript
import {
	defaultSort,
	FILTER_TYPES,
	PRICE_RANGES,
	FILTER_PRESETS,
} from "@/constants";
```

### استيراد جميع الثوابت

```typescript
import * as Constants from "@/constants";
```

### استيراد ثوابت محددة من ملف واحد

```typescript
import { THEME_CONSTANTS } from "@/constants/app-constants";
import { DEBOUNCE_DELAYS } from "@/constants/filter-constants";
```

## المبادئ التوجيهية

1. **منطقية التنظيم**: كل مجموعة ثوابت في ملف منفصل حسب الوظيفة
2. **الأسماء الواضحة**: استخدام أسماء واضحة ومعبرة لجميع الثوابت
3. **التوثيق**: كتابة تعليقات توضيحية لكل مجموعة ثوابت
4. **الاتساق**: اتباع نمط تسمية موحد (UPPER_CASE للثوابت)
5. **التجميع**: تجميع الثوابت المترابطة في كائنات

## إضافة ثوابت جديدة

عند إضافة ثوابت جديدة:

1. حدد الملف المناسب حسب الوظيفة
2. أضف تعليق توضيحي
3. اتبع نمط التسمية المعتمد
4. قم بتحديث ملف `index.ts` إذا لزم الأمر
5. قم بتحديث هذا الـ README

## أمثلة الاستخدام

### إعدادات العملة

```typescript
import { CURRENCY_SETTINGS, DEFAULT_CURRENCY } from "@/constants";

const currentCurrency = CURRENCY_SETTINGS[DEFAULT_CURRENCY];
console.log(currentCurrency.symbol); // "د.إ"
```

### فلترة المنتجات

```typescript
import { FILTER_PRESETS, PRICE_RANGES } from "@/constants";

const bestSellersFilter = FILTER_PRESETS.BEST_SELLERS;
const priceUnder50 = PRICE_RANGES.find((range) => range.max === 50);
```

### إعدادات الثيم

```typescript
import { THEME_CONSTANTS } from "@/constants";

const breakpoint = THEME_CONSTANTS.breakpoints.md; // "48em"
const animationDuration = THEME_CONSTANTS.animations.duration.normal; // 300
```
