# Complete Lifecycle Tests
# اختبارات دورة الحياة الكاملة

## Overview | نظرة عامة

This directory contains comprehensive lifecycle tests that validate the complete end-to-end functionality of the coffee selection application, from product discovery to invoice generation.

يحتوي هذا المجلد على اختبارات دورة الحياة الشاملة التي تتحقق من الوظائف الكاملة للتطبيق من اكتشاف المنتج إلى إنشاء الفاتورة.

## Test Structure | هيكل الاختبارات

### 1. Complete Order to Invoice Test
**File:** `complete-order-to-invoice.test.js`

**Purpose:** Tests the complete order processing lifecycle from product selection to invoice generation.

**الغرض:** اختبار دورة معالجة الطلب الكاملة من اختيار المنتج إلى إنشاء الفاتورة.

**Test Phases:**
1. **Product Discovery & Selection** - اكتشاف واختيار المنتج
2. **Cart Management** - إدارة السلة
3. **Customer Authentication** - مصادقة العميل
4. **Address Management** - إدارة العناوين
5. **Shipping Method Selection** - اختيار طريقة الشحن
6. **Payment Processing** - معالجة الدفع
7. **Order Creation & Confirmation** - إنشاء وتأكيد الطلب
8. **Invoice Generation** - إنشاء الفاتورة
9. **Order Fulfillment Tracking** - تتبع تنفيذ الطلب
10. **Complete Lifecycle Validation** - التحقق من دورة الحياة الكاملة

### 2. Integration Validation Test
**File:** `integration-validation.test.js`

**Purpose:** Validates the integration between different system components and ensures data consistency.

**الغرض:** التحقق من التكامل بين مكونات النظام المختلفة وضمان اتساق البيانات.

**Test Areas:**
1. **GraphQL Schema Validation** - التحقق من مخطط GraphQL
2. **Data Consistency Validation** - التحقق من اتساق البيانات
3. **Cart Integration Validation** - التحقق من تكامل السلة
4. **Order State Management** - إدارة حالة الطلب
5. **Currency and Pricing Integration** - تكامل العملة والتسعير
6. **Address and Shipping Integration** - تكامل العنوان والشحن
7. **Performance and Response Time** - الأداء وزمن الاستجابة

### 3. Products Lifecycle Test
**File:** `products/products-lifecycle.test.js`

**Purpose:** Tests complete product management lifecycle including discovery, display, filtering, and cart integration.

**الغرض:** اختبار دورة حياة إدارة المنتجات الكاملة بما في ذلك الاكتشاف والعرض والتصفية وتكامل السلة.

## Running Tests | تشغيل الاختبارات

### Individual Tests | الاختبارات الفردية

```bash
# Complete Order to Invoice Test
node tests/lifecycle-tests/complete-order-to-invoice.test.js

# Integration Validation Test
node tests/lifecycle-tests/integration-validation.test.js

# Products Lifecycle Test
node tests/lifecycle-tests/products/products-lifecycle.test.js
```

### All Tests | جميع الاختبارات

```bash
# Run all lifecycle tests
./run-all-lifecycle-tests.sh

# Or run specific test suite
./run-complete-order-lifecycle-test.sh
```

## Test Configuration | تكوين الاختبارات

### Environment Variables | متغيرات البيئة

The tests use the following configuration:

```javascript
const TEST_CONFIG = {
  odoo: {
    baseUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com',
    graphqlUrl: 'https://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf',
    apiKey: 'd22fb86e790ba068c5b3bcfb801109892f3a0b38'
  },
  testUser: {
    email: 'mohamed@coffeeselection.com',
    password: 'Montada@1',
    name: 'Mohamed Test User',
    phone: '+966501234567'
  }
};
```

### Prerequisites | المتطلبات المسبقة

- Node.js (v14 or higher)
- Access to Odoo GraphQL endpoint
- Valid API key and test user credentials
- Internet connection for API calls

## Test Reports | تقارير الاختبارات

### Report Files | ملفات التقارير

All test reports are saved in the `tests/reports/` directory:

- `complete-order-to-invoice-results.json` - Complete order lifecycle results
- `integration-validation-results.json` - Integration validation results
- `products-lifecycle-results.json` - Products lifecycle results
- `master-lifecycle-report-[timestamp].json` - Master report combining all tests

### Report Structure | هيكل التقرير

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "testType": "Complete Order to Invoice Lifecycle",
  "summary": {
    "passed": 25,
    "failed": 2,
    "total": 27,
    "successRate": "92.6"
  },
  "testData": {
    "selectedProduct": { ... },
    "cartOrder": { ... },
    "confirmedOrder": { ... },
    "invoice": { ... }
  },
  "details": [ ... ]
}
```

## Test Data | بيانات الاختبار

### Real Data Testing | اختبار البيانات الحقيقية

These tests use **real data** from the Odoo system:
- Real products from the catalog
- Actual cart operations
- Live order creation
- Real invoice generation
- Authentic user authentication

### Mock Data Fallbacks | البيانات الوهمية الاحتياطية

When real data is not available, tests fall back to mock data to ensure test continuity:
- Mock addresses for guest users
- Fallback shipping methods
- Default payment methods
- Sample product data

## Validation Criteria | معايير التحقق

### Success Criteria | معايير النجاح

A test is considered successful when:
- All API calls return valid responses
- Data consistency is maintained across operations
- Order totals match invoice amounts
- All required fields are populated
- Response times are within acceptable limits (< 5 seconds)

### Failure Handling | التعامل مع الفشل

Tests handle failures gracefully:
- Detailed error logging
- Fallback to mock data when appropriate
- Partial success reporting
- Clear failure reasons in reports

## Integration with CI/CD | التكامل مع CI/CD

### Automated Testing | الاختبار الآلي

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Lifecycle Tests
  run: |
    chmod +x run-all-lifecycle-tests.sh
    ./run-all-lifecycle-tests.sh
```

### Test Scheduling | جدولة الاختبارات

Recommended test schedule:
- **Daily:** Integration validation tests
- **Weekly:** Complete order lifecycle tests
- **Before deployment:** All lifecycle tests
- **After major changes:** Full test suite

## Troubleshooting | استكشاف الأخطاء

### Common Issues | المشاكل الشائعة

1. **API Connection Issues**
   - Check network connectivity
   - Verify API key validity
   - Confirm Odoo server status

2. **Authentication Failures**
   - Verify test user credentials
   - Check user permissions in Odoo
   - Ensure user account is active

3. **Data Inconsistencies**
   - Review Odoo data integrity
   - Check for missing required fields
   - Verify currency and pricing setup

### Debug Mode | وضع التصحيح

Enable detailed logging by setting environment variable:
```bash
export DEBUG_TESTS=true
./run-all-lifecycle-tests.sh
```

## Performance Benchmarks | معايير الأداء

### Expected Response Times | أزمنة الاستجابة المتوقعة

- Product queries: < 2 seconds
- Cart operations: < 1 second
- Order creation: < 3 seconds
- Invoice generation: < 2 seconds

### Load Testing | اختبار الحمولة

For load testing, run multiple instances:
```bash
# Run 5 parallel test instances
for i in {1..5}; do
  ./run-complete-order-lifecycle-test.sh &
done
wait
```

## Contributing | المساهمة

### Adding New Tests | إضافة اختبارات جديدة

1. Create test file in appropriate subdirectory
2. Follow existing test structure and naming conventions
3. Include both English and Arabic documentation
4. Add test to main test runner script
5. Update this README with test description

### Test Standards | معايير الاختبارات

- Use descriptive test names
- Include detailed error messages
- Provide fallback mechanisms
- Generate comprehensive reports
- Follow existing code style

## Support | الدعم

For issues or questions regarding these tests:
1. Check the test logs in `tests/reports/`
2. Review the Odoo backend for data verification
3. Consult the main application documentation
4. Contact the development team

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Maintainer:** Development Team