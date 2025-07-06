# نظام اختبارات GraphQL الشامل - Coffee Selection

## نظرة عامة

هذا النظام يحتوي على مجموعة شاملة من الاختبارات لنظام GraphQL في موقع Coffee Selection، مع التركيز على:

- **الاستعلامات (Queries)** - اختبار جميع استعلامات البيانات
- **الطفرات (Mutations)** - اختبار جميع عمليات التعديل والإنشاء
- **الخطافات (Hooks)** - اختبار الخطافات المخصصة
- **التحديثات المباشرة (Real-time)** - اختبار الاشتراكات والتحديثات الفورية
- **التكامل (Integration)** - اختبار التكامل بين المكونات
- **الأداء (Performance)** - اختبار الأداء والسرعة
- **دورات الحياة (Lifecycles)** - اختبار دورات حياة البيانات

## هيكل المجلدات

```
tests/graphql-system/
├── queries/                    # اختبارات الاستعلامات
│   ├── product-queries.test.ts
│   ├── aramex-queries.test.ts
│   ├── user-queries.test.ts
│   ├── order-queries.test.ts
│   └── cart-queries.test.ts
├── mutations/                  # اختبارات الطفرات
│   ├── aramex-mutations.test.ts
│   ├── product-mutations.test.ts
│   ├── user-mutations.test.ts
│   └── order-mutations.test.ts
├── hooks/                      # اختبارات الخطافات
│   ├── use-aramex.test.ts
│   ├── use-products.test.ts
│   └── use-orders.test.ts
├── real-time/                  # اختبارات التحديثات المباشرة
│   ├── subscriptions.test.ts
│   └── websocket.test.ts
├── integrations/               # اختبارات التكامل
│   ├── odoo-integration.test.ts
│   └── aramex-integration.test.ts
├── performance/                # اختبارات الأداء
│   ├── query-performance.test.ts
│   └── mutation-performance.test.ts
├── lifecycles/                 # اختبارات دورات الحياة
│   ├── order-lifecycle.test.ts
│   └── product-lifecycle.test.ts
├── run-all-tests.sh           # سكريبت تشغيل جميع الاختبارات
└── README.md                  # هذا الملف
```

## كيفية تشغيل الاختبارات

### تشغيل جميع الاختبارات

```bash
# من المجلد الجذر للمشروع
./tests/graphql-system/run-all-tests.sh
```

### تشغيل مجموعة اختبارات محددة

```bash
# اختبارات الاستعلامات فقط
./tests/graphql-system/run-all-tests.sh queries

# اختبارات الطفرات فقط
./tests/graphql-system/run-all-tests.sh mutations

# اختبارات الخطافات فقط
./tests/graphql-system/run-all-tests.sh hooks

# اختبارات التحديثات المباشرة فقط
./tests/graphql-system/run-all-tests.sh real-time

# اختبارات التكامل فقط
./tests/graphql-system/run-all-tests.sh integrations

# اختبارات الأداء فقط
./tests/graphql-system/run-all-tests.sh performance

# اختبارات دورات الحياة فقط
./tests/graphql-system/run-all-tests.sh lifecycles
```

### تشغيل اختبار محدد

```bash
# تشغيل اختبار محدد باستخدام Jest
npm test tests/graphql-system/queries/product-queries.test.ts

# تشغيل اختبار مع التفاصيل
npm test tests/graphql-system/queries/product-queries.test.ts -- --verbose

# تشغيل اختبار مع تقرير التغطية
npm test tests/graphql-system/queries/product-queries.test.ts -- --coverage
```

## متطلبات التشغيل

### المتطلبات الأساسية

- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- Jest (يتم تثبيته تلقائياً)

### المكتبات المطلوبة

```json
{
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "@apollo/client": "^3.13.8",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@types/jest": "^29.5.12"
  }
}
```

## أنواع الاختبارات

### 1. اختبارات الاستعلامات (Queries)

تختبر جميع استعلامات GraphQL:

- **استعلامات المنتجات**: البحث، الفلترة، التصنيفات
- **استعلامات أرامكس**: التتبع، الأسعار، المناطق المخدومة
- **استعلامات المستخدمين**: الملفات الشخصية، العناوين
- **استعلامات الطلبات**: تاريخ الطلبات، تفاصيل الطلب

### 2. اختبارات الطفرات (Mutations)

تختبر جميع عمليات التعديل:

- **طفرات أرامكس**: إنشاء الشحنات، التتبع، الإلغاء
- **طفرات المنتجات**: إضافة، تعديل، حذف
- **طفرات المستخدمين**: التسجيل، تحديث البيانات
- **طفرات الطلبات**: إنشاء، تحديث، إلغاء

### 3. اختبارات الخطافات (Hooks)

تختبر الخطافات المخصصة:

- **خطافات أرامكس**: إدارة الشحن والتتبع
- **خطافات المنتجات**: إدارة البيانات والحالة
- **خطافات الطلبات**: إدارة دورة حياة الطلب

### 4. اختبارات التحديثات المباشرة (Real-time)

تختبر الاشتراكات والتحديثات الفورية:

- **اشتراكات الطلبات**: تحديثات حالة الطلب
- **اشتراكات المخزون**: تحديثات الكمية
- **اشتراكات أرامكس**: تحديثات التتبع
- **اشتراكات الإشعارات**: الإشعارات الفورية

### 5. اختبارات التكامل (Integration)

تختبر التكامل بين الأنظمة:

- **تكامل Odoo**: الاتصال وتبادل البيانات
- **تكامل أرامكس**: الشحن والتتبع
- **تكامل المدفوعات**: معالجة الدفع

### 6. اختبارات الأداء (Performance)

تختبر أداء النظام:

- **سرعة الاستعلامات**: قياس أوقات الاستجابة
- **كفاءة الطفرات**: قياس أداء العمليات
- **إدارة الذاكرة**: مراقبة استهلاك الموارد

### 7. اختبارات دورات الحياة (Lifecycles)

تختبر دورات حياة البيانات:

- **دورة حياة الطلب**: من الإنشاء إلى التسليم
- **دورة حياة المنتج**: من الإضافة إلى البيع
- **دورة حياة الشحنة**: من الإنشاء إلى التسليم

## البيانات التجريبية

### بيانات أرامكس التجريبية

```javascript
const mockAramexShipment = {
  id: '1',
  orderId: 'ORDER-001',
  awbNumber: '1234567890',
  status: 'IN_TRANSIT',
  cost: { amount: 25.50, currency: 'SAR' },
  trackingUrl: 'https://www.aramex.com/track/1234567890'
};
```

### بيانات المنتجات التجريبية

```javascript
const mockProduct = {
  id: '1',
  name: 'قهوة عربية مختصة',
  price: 45.99,
  salePrice: 39.99,
  sku: 'COFFEE-001',
  isActive: true,
  stock: { isInStock: true, quantity: 100 }
};
```

## معالجة الأخطاء

### أنواع الأخطاء المختبرة

1. **أخطاء الشبكة**: انقطاع الاتصال، بطء الاستجابة
2. **أخطاء GraphQL**: استعلامات خاطئة، بيانات مفقودة
3. **أخطاء المصادقة**: رموز منتهية الصلاحية
4. **أخطاء التحقق**: بيانات غير صحيحة

### مثال على اختبار معالجة الأخطاء

```javascript
it('should handle network errors gracefully', async () => {
  try {
    await apolloClient.query({
      query: GET_PRODUCTS,
      fetchPolicy: 'network-only'
    });
  } catch (error) {
    expect(error).toBeDefined();
    expect(error.networkError || error.graphQLErrors).toBeDefined();
  }
});
```

## تقارير الاختبارات

### تقرير التغطية

يتم إنشاء تقرير التغطية في:
```
reports/graphql-system/coverage/
├── index.html          # تقرير HTML التفاعلي
├── lcov.info          # تقرير LCOV
└── coverage-summary.json  # ملخص التغطية
```

### تقرير النتائج

يتم إنشاء تقرير النتائج في:
```
reports/graphql-system/
├── test-results.json   # نتائج مفصلة بصيغة JSON
└── test-summary.txt    # ملخص النتائج
```

## أفضل الممارسات

### كتابة الاختبارات

1. **وصف واضح**: استخدم أوصاف واضحة للاختبارات
2. **بيانات تجريبية**: استخدم بيانات واقعية ومتنوعة
3. **تنظيف البيانات**: نظف البيانات بعد كل اختبار
4. **اختبار الحالات الحدية**: اختبر الحالات الاستثنائية

### تنظيم الاختبارات

1. **تجميع منطقي**: جمع الاختبارات المترابطة
2. **ترتيب الأولوية**: ابدأ بالاختبارات الأساسية
3. **توثيق شامل**: وثق الغرض من كل اختبار
4. **صيانة دورية**: حدث الاختبارات مع تطور النظام

## استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. فشل الاتصال بـ GraphQL

```bash
# تحقق من تشغيل الخادم
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { queryType { name } } }"}'
```

#### 2. مشاكل المصادقة

```javascript
// تحقق من صحة الرمز المميز
const token = process.env.NEXT_PUBLIC_ODOO_API_TOKEN;
console.log('Token:', token ? 'موجود' : 'مفقود');
```

#### 3. مشاكل البيانات التجريبية

```javascript
// تحقق من تحميل البيانات التجريبية
beforeEach(async () => {
  await setupTestData();
});

afterEach(async () => {
  await cleanupTestData();
});
```

## المساهمة

### إضافة اختبارات جديدة

1. أنشئ ملف اختبار في المجلد المناسب
2. اتبع نمط التسمية: `*.test.ts`
3. استخدم البيانات التجريبية المعيارية
4. أضف توثيق للاختبار الجديد

### تحديث الاختبارات الموجودة

1. حافظ على التوافق مع الاختبارات الأخرى
2. حدث البيانات التجريبية عند الحاجة
3. اختبر التغييرات قبل الدمج
4. حدث التوثيق المرتبط

## الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:

1. راجع هذا التوثيق أولاً
2. تحقق من سجلات الأخطاء
3. اتصل بفريق التطوير
4. أنشئ تقرير مشكلة مفصل

---

**ملاحظة**: هذا النظام مصمم للعمل مع بيانات حقيقية من Odoo وأرامكس. تأكد من إعداد البيئة بشكل صحيح قبل تشغيل الاختبارات.