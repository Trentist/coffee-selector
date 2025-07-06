# Cart Services - خدمات العربة

## نظرة عامة

خدمات العربة المتكاملة مع نظام الاستور (Redux) والعمليات المتقدمة. يوفر النظام إدارة كاملة للعربة مع التكامل مع GraphQL وOdoo.

## المميزات الرئيسية

### 🛒 إدارة العربة

- إضافة/إزالة/تحديث المنتجات
- إدارة الكميات مع التحقق من الحدود
- حساب الأسعار والضرائب والشحن تلقائياً
- دعم العملات المتعددة

### 🔄 التكامل مع النظام

- تكامل كامل مع Redux Store
- React Hooks جاهزة للاستخدام
- GraphQL mutations للعمليات
- مزامنة مع خادم Odoo

### 📋 الكوتيشن

- إنشاء كوتيشن كامل من العربة
- التحقق من صحة بيانات العميل
- حساب تكاليف الشحن والضرائب
- دعم التعليمات الخاصة

### 🛡️ الأمان والتحقق

- التحقق من صحة البيانات
- حماية من الكميات الزائدة
- التحقق من صحة العناوين
- إدارة الأخطاء الشاملة

## الملفات الرئيسية

```
src/store/cart/
├── cart.service.ts      # الخدمة الأساسية للعربة
├── operations.ts        # العمليات المتقدمة
├── react-hooks.ts       # React Hooks
├── types.ts            # أنواع البيانات
├── cartSlice.ts        # Redux Slice
└── index.ts            # ملف التصدير الرئيسي
```

## الاستخدام السريع

### 1. إعداد الخدمة

```typescript
import { CartService, CartOperations } from "@/store/cart";

// إنشاء خدمة العربة
const cartService = new CartService(apolloClient);
const cartOperations = new CartOperations(cartService);

// تهيئة الخدمة
await cartService.initialize();
```

### 2. استخدام React Hook

```typescript
import { useCart } from '@/store/cart';

function ProductCard({ product }) {
  const { addProduct, isProductInCart, getProductQuantity } = useCart();

  const handleAddToCart = async () => {
    const result = await addProduct({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });

    if (result.success) {
      console.log('تم إضافة المنتج بنجاح');
    }
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price} درهم</p>
      <button onClick={handleAddToCart}>
        {isProductInCart(product.id) ? 'تم الإضافة' : 'أضف للعربة'}
      </button>
    </div>
  );
}
```

### 3. إدارة الكميات

```typescript
import { useCartItem } from '@/store/cart';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCartItem(item.productId);

  const handleQuantityChange = async (newQuantity: number) => {
    await updateQuantity(item.lineId, newQuantity);
  };

  const handleRemove = async () => {
    await removeFromCart(item.lineId);
  };

  return (
    <div>
      <span>{item.name}</span>
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
        min="1"
        max="100"
      />
      <button onClick={handleRemove}>حذف</button>
    </div>
  );
}
```

### 4. إنشاء الكوتيشن

```typescript
import { useCartQuotation } from '@/store/cart';

function CheckoutForm() {
  const { createQuotation, calculateShipping } = useCartQuotation();

  const handleCreateQuotation = async (formData) => {
    const customerData = {
      name: formData.customerName,
      email: formData.customerEmail,
      phone: formData.customerPhone
    };

    const shippingData = {
      name: formData.shippingName,
      street: formData.street,
      city: formData.city,
      country: formData.country,
      phone: formData.shippingPhone
    };

    const result = await createQuotation(
      customerData,
      shippingData,
      formData.specialInstructions
    );

    if (result.success) {
      console.log('تم إنشاء الكوتيشن:', result.quotation);
    }
  };

  return (
    <form onSubmit={handleCreateQuotation}>
      {/* نموذج البيانات */}
    </form>
  );
}
```

## العمليات المتقدمة

### 1. العمليات المجمعة

```typescript
const operations = [
	{
		type: "add",
		data: { productId: "1", name: "Product 1", price: 100, quantity: 2 },
	},
	{
		type: "add",
		data: { productId: "2", name: "Product 2", price: 50, quantity: 1 },
	},
	{ type: "update", data: { lineId: "line1", quantity: 3 } },
];

const result = await cartOperations.bulkCartOperations(operations);
```

### 2. حساب الشحن

```typescript
const shippingResult = await cartOperations.calculateShipping(
	{
		name: "أحمد محمد",
		street: "شارع الشيخ زايد",
		city: "دبي",
		country: "الإمارات العربية المتحدة",
	},
	"express",
);

console.log(`تكلفة الشحن: ${shippingResult.cart.shipping} درهم`);
```

### 3. تطبيق الخصم

```typescript
const discountResult = await cartOperations.applyDiscount("SAVE10", 50);
if (discountResult.success) {
	console.log("تم تطبيق الخصم بنجاح");
}
```

## الثوابت والإعدادات

```typescript
import { CART_CONSTANTS } from "@/store/cart";

console.log(CART_CONSTANTS.MAX_QUANTITY); // 100
console.log(CART_CONSTANTS.FREE_SHIPPING_THRESHOLD); // 500
console.log(CART_CONSTANTS.DEFAULT_SHIPPING_COST); // 28.574
console.log(CART_CONSTANTS.TAX_RATE); // 0.05 (5%)
```

## الأدوات المساعدة

```typescript
import { cartUtils } from "@/store/cart";

// تنسيق السعر
const formattedPrice = cartUtils.formatPrice(150.5); // "150.50 درهم"

// حساب الإجمالي
const total = cartUtils.calculateTotal(100, 5, 28.574, 10); // 123.574

// التحقق من صحة المنتج
const isValid = cartUtils.validateCartItem(product);

// التحقق من الشحن المجاني
const isFreeShipping = cartUtils.isEligibleForFreeShipping(600); // true
```

## إدارة الأخطاء

```typescript
const { error, loading } = useCart();

if (loading) {
  return <div>جاري التحميل...</div>;
}

if (error) {
  return <div>خطأ: {error}</div>;
}
```

## المزامنة والتخزين

```typescript
import { useCartPersistence } from '@/store/cart';

function CartManager() {
  const { saveCart, loadCart, clearStoredCart } = useCartPersistence();

  const handleSaveCart = () => {
    const result = saveCart();
    if (result.success) {
      console.log('تم حفظ العربة');
    }
  };

  const handleLoadCart = async () => {
    const result = await loadCart();
    if (result.success) {
      console.log('تم تحميل العربة');
    }
  };

  return (
    <div>
      <button onClick={handleSaveCart}>حفظ العربة</button>
      <button onClick={handleLoadCart}>تحميل العربة</button>
      <button onClick={clearStoredCart}>مسح المحفوظ</button>
    </div>
  );
}
```

## التحليلات والإحصائيات

```typescript
import { useCartAnalytics } from '@/store/cart';

function CartAnalytics() {
  const { getStatistics, exportData } = useCartAnalytics();

  const stats = getStatistics();
  console.log('إحصائيات العربة:', stats);

  const cartData = exportData();
  console.log('بيانات العربة:', cartData);

  return (
    <div>
      <p>عدد العناصر: {stats.itemCount}</p>
      <p>الإجمالي: {stats.total}</p>
      <p>متوسط السعر: {stats.averageItemPrice}</p>
    </div>
  );
}
```

## GraphQL Mutations

النظام يستخدم الطفرات التالية:

```graphql
# إضافة منتجات للعربة
mutation CartAddMultipleItems($products: [CartProductInput!]!) {
  cartAddMultipleItems(products: $products) {
    success
    message
    cart { ... }
  }
}

# تحديث منتجات العربة
mutation CartUpdateMultipleItems($lines: [CartLineInput!]!) {
  cartUpdateMultipleItems(lines: $lines) {
    success
    message
    cart { ... }
  }
}

# إزالة منتجات من العربة
mutation CartRemoveMultipleItems($lineIds: [ID!]!) {
  cartRemoveMultipleItems(lineIds: $lineIds) {
    success
    message
    cart { ... }
  }
}

# مسح العربة
mutation CartClear {
  cartClear {
    success
    message
    cart { ... }
  }
}
```

## أفضل الممارسات

### 1. إدارة الحالة

- استخدم React Hooks للوصول لحالة العربة
- تجنب التحديث المباشر للحالة
- استخدم العمليات المجمعة للعمليات المتعددة

### 2. التحقق من البيانات

- تحقق من صحة البيانات قبل الإرسال
- استخدم الثوابت للحدود
- تعامل مع الأخطاء بشكل مناسب

### 3. الأداء

- استخدم `useMemo` للحسابات المعقدة
- تجنب إعادة الحسابات غير الضرورية
- استخدم المزامنة الذكية

### 4. تجربة المستخدم

- اعرض حالة التحميل
- قدم رسائل خطأ واضحة
- استخدم التحديثات الفورية

## استكشاف الأخطاء

### مشاكل شائعة

1. **العربة لا تتحدث**

   - تحقق من اتصال GraphQL
   - تأكد من صحة البيانات
   - راجع سجلات الأخطاء

2. **الكميات غير صحيحة**

   - تحقق من حدود الكمية
   - تأكد من صحة البيانات المدخلة
   - راجع عمليات التحديث

3. **مشاكل في الكوتيشن**
   - تحقق من صحة بيانات العميل
   - تأكد من صحة العنوان
   - راجع حساب الضرائب والشحن

### أدوات التشخيص

```typescript
// فحص حالة العربة
const cartState = cartService.getCartState();
console.log("حالة العربة:", cartState);

// فحص الإحصائيات
const stats = cartService.getCartStatistics();
console.log("الإحصائيات:", stats);

// تصدير البيانات للتشخيص
const exportData = cartService.exportCartData();
console.log("بيانات التصدير:", exportData);
```

## التطوير المستقبلي

- [ ] دعم المفضلة
- [ ] قوائم التسوق
- [ ] الخصومات المتقدمة
- [ ] الشحن الدولي
- [ ] الدفع بالتقسيط
- [ ] نظام النقاط
- [ ] التوصيات الذكية

## الدعم والمساهمة

للأسئلة أو المساهمة، يرجى التواصل مع فريق التطوير.
