# Enhanced Testing Suite for Coffee Selection
# مجموعة الاختبارات المحسنة لموقع Coffee Selection

## Overview / نظرة عامة

This enhanced testing suite provides comprehensive end-to-end testing for the Coffee Selection e-commerce platform, focusing on critical user flows including cart management, payment processing, Aramex shipping integration, and invoice generation.

تقدم مجموعة الاختبارات المحسنة هذه اختبارات شاملة من النهاية إلى النهاية لمنصة Coffee Selection للتجارة الإلكترونية، مع التركيز على تدفقات المستخدم الحرجة بما في ذلك إدارة العربة ومعالجة الدفع وتكامل شحن أرامكس وإنشاء الفواتير.

## Test Suites / مجموعات الاختبارات

### 1. Cart Functionality Tests / اختبارات وظائف العربة
**Location:** `tests/e2e/enhanced-cart-tests/`

- ✅ Add single and multiple products to cart
- ✅ Quantity management and validation
- ✅ Cart persistence across navigation
- ✅ Price calculations and currency handling
- ✅ Cart item removal and clearing
- ✅ Guest cart functionality

**الوظائف المختبرة:**
- إضافة منتج واحد ومنتجات متعددة للعربة
- إدارة الكمية والتحقق من صحتها
- استمرارية العربة عبر التنقل
- حسابات الأسعار والتعامل مع العملات
- إزالة عناصر العربة وتفريغها
- وظائف عربة الضيف

### 2. Payment Processing Tests / اختبارات معالجة الدفع
**Location:** `tests/e2e/enhanced-payment-tests/`

- ✅ Successful payment with valid cards
- ✅ Declined card handling
- ✅ Insufficient funds scenarios
- ✅ 3D Secure authentication
- ✅ Payment form validation
- ✅ Timeout and network error handling
- ✅ Payment method saving
- ✅ Multiple payment attempts

**السيناريوهات المختبرة:**
- الدفع الناجح بالبطاقات الصحيحة
- التعامل مع البطاقات المرفوضة
- سيناريوهات الرصيد غير الكافي
- مصادقة 3D Secure
- التحقق من نموذج الدفع
- التعامل مع انتهاء المهلة وأخطاء الشبكة
- حفظ طرق الدفع
- محاولات الدفع المتعددة

### 3. Aramex Integration Tests / اختبارات تكامل أرامكس
**Location:** `tests/e2e/enhanced-aramex-tests/`

- ✅ Domestic and international shipping rates
- ✅ Shipment creation after payment
- ✅ Tracking status updates
- ✅ Address validation
- ✅ Pickup scheduling
- ✅ Shipment cancellation
- ✅ Return shipment creation
- ✅ Label generation and download
- ✅ Bulk operations

**الميزات المختبرة:**
- أسعار الشحن المحلي والدولي
- إنشاء الشحنة بعد الدفع
- تحديثات حالة التتبع
- التحقق من صحة العنوان
- جدولة الاستلام
- إلغاء الشحنة
- إنشاء شحنة الإرجاع
- إنشاء وتحميل الملصقات
- العمليات المجمعة

### 4. Invoice Management Tests / اختبارات إدارة الفواتير
**Location:** `tests/e2e/enhanced-invoice-tests/`

- ✅ Invoice generation after order completion
- ✅ Correct calculations and VAT handling
- ✅ PDF invoice generation and download
- ✅ Email invoice sending
- ✅ Invoice history and filtering
- ✅ Refunds and credit notes
- ✅ Recurring invoices
- ✅ Multi-currency support
- ✅ Accounting system integration

**الوظائف المختبرة:**
- إنشاء الفاتورة بعد إتمام الطلب
- الحسابات الصحيحة والتعامل مع ضريبة القيمة المضافة
- إنشاء وتحميل فاتورة PDF
- إرسال الفاتورة بالبريد الإلكتروني
- تاريخ الفواتير والتصفية
- المبالغ المستردة والإشعارات الدائنة
- الفواتير المتكررة
- دعم العملات المتعددة
- تكامل أنظمة المحاسبة

### 5. Complete Integration Tests / اختبارات التكامل الشاملة
**Location:** `tests/e2e/enhanced-integration-tests/`

- ✅ Full order flow from cart to invoice
- ✅ Guest checkout flow
- ✅ Orders with coupons and discounts
- ✅ Subscription orders
- ✅ International orders with customs
- ✅ Multi-step validation and error handling

**التدفقات المختبرة:**
- تدفق الطلب الكامل من العربة إلى الفاتورة
- تدفق دفع الضيف
- الطلبات مع الكوبونات والخصومات
- طلبات الاشتراك
- الطلبات الدولية مع الجمارك
- التحقق متعدد الخطوات والتعامل مع الأخطاء

## Running Tests / تشغيل الاختبارات

### Prerequisites / المتطلبات المسبقة

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running All Tests / تشغيل جميع الاختبارات

```bash
# Using the enhanced test runner
node tests/enhanced-test-runner.js

# Or using npm script
npm run test:enhanced
```

### Running Specific Test Suites / تشغيل مجموعات اختبارات محددة

```bash
# Cart tests only
node tests/enhanced-test-runner.js --suite cart

# Payment tests only
node tests/enhanced-test-runner.js --suite payment

# Aramex tests only
node tests/enhanced-test-runner.js --suite aramex

# Invoice tests only
node tests/enhanced-test-runner.js --suite invoice

# Integration tests only
node tests/enhanced-test-runner.js --suite integration
```

### Running Individual Test Files / تشغيل ملفات اختبار فردية

```bash
# Specific test file
npx playwright test tests/e2e/enhanced-cart-tests/cart-functionality.test.ts

# With specific browser
npx playwright test tests/e2e/enhanced-payment-tests/ --project=chromium

# With debugging
npx playwright test tests/e2e/enhanced-aramex-tests/ --debug
```

## Test Configuration / تكوين الاختبارات

### Environment Variables / متغيرات البيئة

Create a `.env.test` file with the following variables:

```env
# Test Environment Configuration
TEST_BASE_URL=http://localhost:3000
TEST_TIMEOUT=30000
TEST_RETRIES=2

# Payment Test Cards
TEST_CARD_VALID=4242424242424242
TEST_CARD_DECLINED=4000000000000002
TEST_CARD_INSUFFICIENT=4000000000009995

# Aramex Test Configuration
ARAMEX_TEST_MODE=true
ARAMEX_TEST_USERNAME=testuser
ARAMEX_TEST_PASSWORD=testpass

# Database Test Configuration
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/coffee_test
```

### Playwright Configuration / تكوين Playwright

The tests use a custom Playwright configuration optimized for e-commerce testing:

```javascript
// playwright.config.ts
export default {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } }
  ]
};
```

## Test Data Management / إدارة بيانات الاختبار

### Test Users / مستخدمو الاختبار

```javascript
const testUsers = {
  customer: {
    email: 'customer@coffeeselection.com',
    password: 'testpassword123',
    firstName: 'أحمد',
    lastName: 'محمد'
  },
  admin: {
    email: 'admin@coffeeselection.com',
    password: 'adminpassword123'
  }
};
```

### Test Products / منتجات الاختبار

```javascript
const testProducts = {
  arabicCoffee: {
    name: 'قهوة عربية مختصة',
    price: 85.00,
    sku: 'ARAB-001'
  },
  colombianCoffee: {
    name: 'قهوة كولومبية',
    price: 95.00,
    sku: 'COL-001'
  }
};
```

## Reporting / التقارير

### Test Reports / تقارير الاختبارات

The enhanced test runner generates comprehensive reports:

- **JSON Report:** `tests/test-reports/enhanced-test-report.json`
- **HTML Report:** `tests/test-reports/html-report/index.html`
- **Console Output:** Real-time progress and results

### Report Contents / محتويات التقرير

- Overall test statistics / إحصائيات الاختبارات الإجمالية
- Suite-by-suite breakdown / تفصيل حسب المجموعة
- Performance metrics / مقاييس الأداء
- Failure analysis / تحليل الفشل
- Recommendations / التوصيات

## Continuous Integration / التكامل المستمر

### GitHub Actions / إجراءات GitHub

```yaml
name: Enhanced E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run enhanced tests
        run: node tests/enhanced-test-runner.js
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: tests/test-reports/
```

## Best Practices / أفضل الممارسات

### Test Writing Guidelines / إرشادات كتابة الاختبارات

1. **Use descriptive test names** / استخدم أسماء اختبارات وصفية
2. **Follow the AAA pattern** (Arrange, Act, Assert) / اتبع نمط AAA
3. **Use data-testid attributes** / استخدم خصائص data-testid
4. **Handle async operations properly** / تعامل مع العمليات غير المتزامنة بشكل صحيح
5. **Clean up test data** / نظف بيانات الاختبار
6. **Use page object model** / استخدم نموذج كائن الصفحة

### Performance Optimization / تحسين الأداء

- **Parallel execution** / التنفيذ المتوازي
- **Smart waiting strategies** / استراتيجيات انتظار ذكية
- **Resource cleanup** / تنظيف الموارد
- **Test data isolation** / عزل بيانات الاختبار

## Troubleshooting / استكشاف الأخطاء وإصلاحها

### Common Issues / المشاكل الشائعة

1. **Timeout errors** / أخطاء انتهاء المهلة
   - Increase timeout values
   - Check network connectivity
   - Verify server response times

2. **Element not found** / العنصر غير موجود
   - Verify data-testid attributes
   - Check element visibility
   - Wait for proper loading

3. **Payment failures** / فشل الدفع
   - Verify test card numbers
   - Check Stripe test mode
   - Validate payment form

4. **Aramex integration issues** / مشاكل تكامل أرامكس
   - Verify API credentials
   - Check service availability
   - Validate address formats

### Debug Mode / وضع التصحيح

```bash
# Run tests in debug mode
npx playwright test --debug

# Run with headed browser
npx playwright test --headed

# Generate trace files
npx playwright test --trace on
```

## Contributing / المساهمة

### Adding New Tests / إضافة اختبارات جديدة

1. Create test file in appropriate directory
2. Follow naming convention: `*.test.ts`
3. Use existing helper functions
4. Add test to enhanced test runner
5. Update documentation

### Test Review Process / عملية مراجعة الاختبارات

1. Code review for test logic
2. Verify test coverage
3. Check performance impact
4. Validate error handling
5. Ensure documentation updates

## Support / الدعم

For questions or issues with the enhanced testing suite:

- **Documentation:** Check this README and inline comments
- **Issues:** Create GitHub issue with detailed description
- **Discussions:** Use GitHub Discussions for questions

للأسئلة أو المشاكل المتعلقة بمجموعة الاختبارات المحسنة:

- **التوثيق:** راجع هذا الملف والتعليقات المضمنة
- **المشاكل:** أنشئ مشكلة GitHub مع وصف مفصل
- **المناقشات:** استخدم GitHub Discussions للأسئلة

---

**Last Updated:** January 2024  
**آخر تحديث:** يناير 2024

**Version:** 1.0.0  
**الإصدار:** 1.0.0