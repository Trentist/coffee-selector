# App Readiness Checker - فاحص جاهزية التطبيق

## نظرة عامة

مجلد يحتوي على سكريبتات وأدوات شاملة للتحقق من جاهزية التطبيق قبل النشر والإنتاج.

## الملفات المتاحة

### 1. `health-check.ts`

- فحص شامل لصحة التطبيق
- التحقق من الاتصالات والخدمات
- فحص قاعدة البيانات والـ API

### 2. `dependency-checker.ts`

- فحص التبعيات المطلوبة
- التحقق من إصدارات المكتبات
- فحص التوافق بين المكونات

### 3. `configuration-validator.ts`

- التحقق من صحة ملفات التكوين
- فحص متغيرات البيئة
- التحقق من إعدادات Odoo

### 4. `build-analyzer.ts`

- تحليل عملية البناء
- فحص حجم الملفات
- تحليل الأداء

### 5. `security-scanner.ts`

- فحص الأمان
- التحقق من الثغرات المعروفة
- فحص إعدادات الأمان

### 6. `performance-tester.ts`

- اختبارات الأداء
- قياس سرعة التحميل
- تحليل استخدام الذاكرة

### 7. `compatibility-checker.ts`

- فحص التوافق مع المتصفحات
- التحقق من التجاوب
- فحص إمكانية الوصول

### 8. `deployment-validator.ts`

- التحقق من جاهزية النشر
- فحص ملفات الإنتاج
- التحقق من الإعدادات النهائية

## الاستخدام

```bash
# تشغيل جميع الفحوصات
npm run check:all

# فحص صحة التطبيق فقط
npm run check:health

# فحص التبعيات
npm run check:dependencies

# فحص التكوين
npm run check:config

# تحليل البناء
npm run check:build

# فحص الأمان
npm run check:security

# اختبار الأداء
npm run check:performance

# فحص التوافق
npm run check:compatibility

# التحقق من النشر
npm run check:deployment
```

## التقارير

جميع الفحوصات تنتج تقارير مفصلة في مجلد `reports/`:

- `health-report.json` - تقرير صحة التطبيق
- `dependencies-report.json` - تقرير التبعيات
- `configuration-report.json` - تقرير التكوين
- `build-report.json` - تقرير البناء
- `security-report.json` - تقرير الأمان
- `performance-report.json` - تقرير الأداء
- `compatibility-report.json` - تقرير التوافق
- `deployment-report.json` - تقرير النشر

## الإعدادات

يمكن تخصيص الفحوصات من خلال ملف `config.json`:

```json
{
	"healthCheck": {
		"timeout": 30000,
		"retries": 3
	},
	"performance": {
		"thresholds": {
			"loadTime": 3000,
			"memoryUsage": 100
		}
	},
	"security": {
		"scanLevel": "high",
		"excludePaths": []
	}
}
```

## المخرجات

- ✅ نجح - كل شيء يعمل بشكل صحيح
- ⚠️ تحذير - مشاكل طفيفة تحتاج انتباه
- ❌ فشل - مشاكل خطيرة تحتاج إصلاح
- 🔍 معلومة - معلومات إضافية مفيدة

## المساهمة

لإضافة فحوصات جديدة:

1. أنشئ ملف جديد في المجلد
2. اتبع نمط التسمية الموجود
3. أضف التصدير إلى `index.ts`
4. حدث هذا الملف README
5. أضف الاختبارات المناسبة
