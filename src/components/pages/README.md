# Pages Components System
# نظام مكونات الصفحات

## نظرة عامة
نظام مكونات الصفحات يوفر مكونات React جاهزة للاستخدام لصفحات الموقع المختلفة مع دعم كامل للثيم والترجمة.

## المكونات المتاحة

### 1. ContactPage
مكون صفحة التواصل مع:
- معلومات التواصل (العنوان، الهاتف، البريد الإلكتروني، واتساب)
- ساعات العمل
- وسائل التواصل الاجتماعي
- نموذج التواصل التفاعلي
- تصميم متجاوب

### 2. AboutPage
مكون صفحة من نحن مع:
- محتوى الشركة
- معلومات المتجر
- ساعات العمل
- إحداثيات الموقع
- معرض الصور
- تصميم متجاوب

### 3. JobsPage
مكون صفحة الوظائف مع:
- قائمة الوظائف المتاحة
- تصفية وبحث الوظائف
- تفاصيل كل وظيفة
- نموذج التقديم
- تصميم متجاوب

### 4. WholesalePage
مكون صفحة البيع بالجملة مع:
- مزايا البيع بالجملة
- متطلبات التسجيل
- معلومات التواصل
- نموذج طلب البيع بالجملة
- تصميم متجاوب

## الاستخدام

### استيراد المكونات
```typescript
import { ContactPage, AboutPage, JobsPage, WholesalePage } from '@/components/pages';
```

### استخدام المكونات
```typescript
// صفحة التواصل
<ContactPage data={contactData} lang="ar" />

// صفحة من نحن
<AboutPage data={aboutData} lang="ar" />

// صفحة الوظائف
<JobsPage data={jobsData} lang="ar" />

// صفحة البيع بالجملة
<WholesalePage data={wholesaleData} lang="ar" />
```

## الخصائص (Props)

### ContactPage
```typescript
interface ContactPageProps {
  data: ContactPageData;
  lang?: string;
}
```

### AboutPage
```typescript
interface AboutPageProps {
  data: AboutPageData;
  lang?: string;
}
```

### JobsPage
```typescript
interface JobsPageProps {
  data: JobsPageData;
  lang?: string;
}
```

### WholesalePage
```typescript
interface WholesalePageProps {
  data: WholesalePageData;
  lang?: string;
}
```

## المكونات المستخدمة

### مكونات UI المخصصة
- `CustomButton`: أزرار مخصصة
- `TextH5`, `TextH6`, `TextParagraph`: نصوص مخصصة

### مكونات Chakra UI
- `Box`, `Container`, `VStack`, `HStack`
- `Heading`, `Text`, `SimpleGrid`
- `Input`, `Textarea`, `Button`
- `Badge`, `Divider`, `Icon`
- `Modal`, `Alert`, `Spinner`

### أيقونات React Icons
- `FaPhone`, `FaEnvelope`, `FaMapMarkerAlt`
- `FaClock`, `FaWhatsapp`, `FaIndustry`
- `FaTruck`, `FaUsers`, `FaPercent`, `FaHandshake`
- `FaBriefcase`, `FaMoneyBillWave`, `FaCalendarAlt`

## التصميم والثيم

### الألوان
- `brand.500`: اللون الرئيسي للعلامة التجارية
- `gray.50`: خلفية الصفحة
- `gray.800`: النصوص الرئيسية
- `gray.600`: النصوص الثانوية
- `gray.200`: الحدود

### التخطيط
- تصميم متجاوب مع نقاط توقف مختلفة
- استخدام `SimpleGrid` للتخطيطات المعقدة
- تباعد متناسق باستخدام `VStack` و `HStack`

### التفاعل
- تأثيرات hover على البطاقات
- انتقالات سلسة
- حالات تحميل وأخطاء
- رسائل نجاح

## الترجمة والدعم اللغوي

جميع المكونات تدعم:
- اللغة العربية (ar)
- اللغة الإنجليزية (en)
- نصوص ديناميكية
- اتجاه النص (RTL/LTR)

## الأداء

### تحسينات الأداء
- تحميل كسول للمكونات
- تخزين مؤقت للبيانات
- تحسين الصور
- تقليل إعادة التصيير

### إمكانية الوصول
- دعم قارئات الشاشة
- تنقل بلوحة المفاتيح
- تباين ألوان مناسب
- نصوص بديلة للصور

## التطوير المستقبلي

### ميزات مقترحة
- دعم المزيد من اللغات
- مكونات إضافية للصفحات
- تحسينات الأداء
- ميزات تفاعلية إضافية

### التوسع
- إضافة صفحات جديدة
- تحسين التصميم
- دعم المزيد من أنواع المحتوى
- تكامل مع أنظمة خارجية