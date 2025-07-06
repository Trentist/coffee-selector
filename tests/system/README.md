# System Tests - اختبارات النظام

## نظرة عامة

مجموعة شاملة من الاختبارات للنظام المركزي لاختيار القهوة، تشمل اختبارات الاتصال مع Odoo ومزامنة Redis والتكامل المستمر.

## المفاتيح الموحدة

جميع الاختبارات تستخدم المفاتيح الموحدة من النظام المركزي:

```typescript
import { COFFEE_SELECTION_CONFIG } from "../../src/types/odoo-schema-full/central-system";
```

### المفاتيح المستخدمة:

- **ODOO**: إعدادات Odoo (GraphQL URL, API Key, Database)
- **REDIS**: إعدادات Redis (URL, Prefix, TTL)
- **ARAMEX**: إعدادات Aramex (Username, Password, Account)
- **PAYMENT**: إعدادات الدفع (Stripe Keys)
- **EMAIL**: إعدادات البريد الإلكتروني (SMTP)
- **AUTH**: إعدادات المصادقة (JWT, NextAuth)
- **APP**: إعدادات التطبيق (URL, Environment)

## ملفات الاختبار

### 1. اختبار الاتصال مع Odoo

- **الملف**: `odoo-connection-test.ts`
- **الوصف**: اختبار شامل للاتصال مع Odoo عبر GraphQL و HTTP
- **الاختبارات**:
  - HTTP Connection
  - GraphQL Connection
  - Authentication
  - Product Retrieval

### 2. اختبار مزامنة Redis

- **الملف**: `redis-sync-test.ts`
- **الوصف**: اختبار مزامنة البيانات مع Redis
- **الاختبارات**:
  - Redis Connection
  - Queue Management
  - Data Synchronization
  - Error Handling

### 3. اختبار التكامل المستمر

- **الملف**: `continuous-integration-test.ts`
- **الوصف**: اختبار التكامل المستمر ومراقبة صحة النظام
- **الاختبارات**:
  - Health Monitoring
  - Integration Testing
  - Error Recovery
  - Performance Monitoring

### 4. مشغل الاختبار الرئيسي

- **الملف**: `main-test-runner.ts`
- **الوصف**: مشغل مركزي لجميع الاختبارات
- **الميزات**:
  - تشغيل جميع الاختبارات
  - تقارير مفصلة
  - إدارة الأخطاء

## تشغيل الاختبارات

### تشغيل جميع الاختبارات

```bash
npm run test:system
```

### تشغيل اختبار محدد

```bash
# اختبار الاتصال مع Odoo
npm run test:odoo-connection

# اختبار Redis
npm run test:redis-sync

# اختبار التكامل المستمر
npm run test:ci
```

### تشغيل الاختبارات مع مراقبة

```bash
npm run test:system:watch
```

## إعداد البيئة

### متطلبات البيئة

```bash
# Odoo Configuration
NEXT_PUBLIC_ODOO_GRAPHQL_URL=https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf
NEXT_PUBLIC_ODOO_API_KEY=d22fb86e790ba068c5b3bcfb801109892f3a0b38
NEXT_PUBLIC_ODOO_DATABASE=coffee-selection-staging-20784644

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Aramex Configuration
ARAMEX_USERNAME=mohamed@coffeeselection.com
ARAMEX_PASSWORD=Montada@1
ARAMEX_ACCOUNT_NUMBER=71817909
ARAMEX_ACCOUNT_PIN=508230
```

### إعداد Redis المحلي

```bash
# تثبيت Redis
brew install redis  # macOS
sudo apt-get install redis-server  # Ubuntu

# تشغيل Redis
redis-server

# اختبار الاتصال
redis-cli ping
```

## تقارير الاختبارات

### تقرير مفصل

```bash
npm run test:system:report
```

### تقرير مختصر

```bash
npm run test:system:summary
```

### تقرير الأداء

```bash
npm run test:system:performance
```

## استكشاف الأخطاء

### مشاكل الاتصال مع Odoo

1. تأكد من صحة URL و API Key
2. تحقق من حالة خادم Odoo
3. تأكد من تفعيل GraphQL API

### مشاكل Redis

1. تأكد من تشغيل Redis
2. تحقق من إعدادات الاتصال
3. تأكد من الصلاحيات

### مشاكل Aramex

1. تأكد من صحة بيانات الاعتماد
2. تحقق من حالة API
3. تأكد من إعدادات الحساب

## المراقبة المستمرة

### تشغيل المراقبة

```bash
npm run monitor:system
```

### إعداد التنبيهات

```bash
npm run setup:alerts
```

### عرض الإحصائيات

```bash
npm run stats:system
```

## أفضل الممارسات

1. **تشغيل الاختبارات بانتظام**: تشغيل الاختبارات كل ساعة
2. **مراقبة الأداء**: تتبع أوقات الاستجابة والأخطاء
3. **تحديث البيانات**: تحديث بيانات الاختبار بانتظام
4. **توثيق التغييرات**: توثيق أي تغييرات في النظام
5. **النسخ الاحتياطية**: عمل نسخ احتياطية قبل التحديثات

## الدعم

للاستفسارات والدعم:

- مراجعة السجلات في `logs/`
- فحص تقارير الاختبارات
- التواصل مع فريق التطوير

---

**ملاحظة**: جميع الاختبارات تستخدم المفاتيح الموحدة من النظام المركزي لضمان التناسق والاتساق.
