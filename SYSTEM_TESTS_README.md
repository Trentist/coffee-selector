# System Tests & Monitoring - اختبارات ومراقبة النظام

## نظرة عامة

تم تكوين نظام شامل للاختبارات والمراقبة في التطبيق، يتضمن:

### 1. اختبارات النظام (System Tests)

- **اختبارات Odoo**: الاتصال مع GraphQL و HTTP
- **اختبارات Redis**: مزامنة البيانات والتخزين المؤقت
- **اختبارات CI**: التكامل المستمر ومراقبة الصحة

### 2. مراقبة النظام (System Monitoring)

- **مراقبة الخدمات**: حالة Odoo, Redis, Database, API
- **مقاييس الأداء**: CPU, Memory, Disk Usage
- **التنبيهات**: إشعارات فورية عند حدوث مشاكل

### 3. لوحة التحكم (Dashboard)

- **واجهة تفاعلية**: لمراقبة واختبار النظام
- **تقارير مفصلة**: نتائج الاختبارات والإحصائيات
- **إدارة التكوين**: عرض وتعديل إعدادات النظام

## كيفية الوصول

### لوحة تحكم النظام

```
http://localhost:3003/ar/dashboard/system
http://localhost:3003/en/dashboard/system
```

### تشغيل الاختبارات من Terminal

```bash
# تشغيل جميع الاختبارات
npm run test:system

# اختبارات Odoo فقط
npm run test:odoo

# اختبارات Redis فقط
npm run test:redis

# اختبارات CI فقط
npm run test:ci
```

## المكونات المضافة

### 1. TestRunner Component

```typescript
import { TestRunner } from "@/components/system";

// استخدام المكون
<TestRunner
  onComplete={(results) => console.log(results)}
  autoRun={true}
/>
```

**الميزات:**

- تشغيل اختبارات متعددة بالتوازي
- تقارير مفصلة لكل اختبار
- واجهة تفاعلية مع Progress Bars
- إشعارات فورية عند اكتمال الاختبارات

### 2. SystemMonitor Component

```typescript
import { SystemMonitor } from "@/components/system";

// استخدام المكون
<SystemMonitor />
```

**الميزات:**

- مراقبة حالة الخدمات في الوقت الفعلي
- مقاييس الأداء (CPU, Memory, Disk)
- تنبيهات عند حدوث مشاكل
- تحديث تلقائي كل 5 ثوان

### 3. System Dashboard Page

```typescript
// صفحة لوحة التحكم الكاملة
// /dashboard/system
```

**الميزات:**

- تبويبات منظمة (Monitor, Tests, Configuration)
- إدارة التكوين
- إجراءات سريعة
- تقارير شاملة

## نتائج الاختبارات

### اختبارات Odoo ✅

- **HTTP Connection**: ✅ نجح
- **GraphQL Connection**: ✅ نجح
- **Authentication**: ✅ نجح
- **Product Retrieval**: ✅ نجح

### اختبارات Redis ⚠️

- **Connection**: ✅ نجح
- **Caching**: ✅ نجح
- **Sync Operations**: ⚠️ يحتاج تحسين

### اختبارات CI ⚠️

- **Health Monitoring**: ⚠️ يحتاج تحسين
- **Integration Testing**: ⚠️ يحتاج تحسين
- **Performance Monitoring**: ✅ نجح

## التوصيات

### 1. تحسين Redis

```bash
# تأكد من تشغيل Redis
redis-server

# اختبار الاتصال
redis-cli ping
```

### 2. مراقبة مستمرة

```bash
# تشغيل المراقبة
npm run monitor:system

# عرض الإحصائيات
npm run stats:system
```

### 3. إعداد التنبيهات

```bash
# إعداد التنبيهات
npm run setup:alerts
```

## استكشاف الأخطاء

### مشاكل Redis

1. تأكد من تشغيل Redis: `redis-server`
2. تحقق من الاتصال: `redis-cli ping`
3. راجع الإعدادات في `environment-keys.ts`

### مشاكل Odoo

1. تحقق من صحة URL و API Key
2. تأكد من تفعيل GraphQL API
3. راجع إعدادات المصادقة

### مشاكل CI

1. تحقق من إعدادات المراقبة
2. راجع تكوين التنبيهات
3. تأكد من صحة البيانات

## التطوير المستقبلي

### 1. اختبارات إضافية

- اختبارات الأمان
- اختبارات الأداء
- اختبارات التوافق

### 2. مراقبة متقدمة

- مراقبة قاعدة البيانات
- مراقبة الشبكة
- مراقبة الأمان

### 3. تقارير متقدمة

- تقارير PDF
- تقارير Excel
- تقارير تفاعلية

## الدعم

للاستفسارات والدعم:

- راجع ملفات الاختبار في `tests/system/`
- تحقق من المكونات في `src/components/system/`
- راجع لوحة التحكم في `/dashboard/system`

---

**ملاحظة**: جميع الاختبارات والمراقبة تعمل بشكل متكامل مع النظام المركزي لاختيار القهوة.
