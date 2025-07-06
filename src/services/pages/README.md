# Pages Services System
# نظام خدمات الصفحات

## نظرة عامة
نظام خدمات الصفحات يوفر واجهات برمجة التطبيقات (APIs) لجلب بيانات الصفحات المختلفة مع دعم التخزين المؤقت والتحسينات.

## الخدمات المتاحة

### 1. Contact Service
خدمة صفحة التواصل
- **الملف**: `contact.service.ts`
- **الدالة**: `getContactPageData(lang: string)`
- **البيانات**: معلومات التواصل، نموذج التواصل، ساعات العمل

### 2. About Service
خدمة صفحة من نحن
- **الملف**: `about.service.ts`
- **الدالة**: `getAboutPageData(lang: string)`
- **البيانات**: معلومات الشركة، معلومات المتجر، معرض الصور

### 3. Jobs Service
خدمة صفحة الوظائف
- **الملف**: `jobs.service.ts`
- **الدالة**: `getJobsPageData(lang: string, limit: number, offset: number)`
- **البيانات**: قائمة الوظائف، تفاصيل الوظائف، تصفية وبحث

### 4. Wholesale Service
خدمة صفحة البيع بالجملة
- **الملف**: `wholesale.service.ts`
- **الدالة**: `getWholesalePageData(lang: string)`
- **البيانات**: مزايا البيع بالجملة، متطلبات التسجيل، معلومات التواصل

## الاستخدام

### استيراد الخدمات
```typescript
import {
  getContactPageData,
  getAboutPageData,
  getJobsPageData,
  getWholesalePageData
} from '@/services/pages';
```

### استخدام الخدمات
```typescript
// جلب بيانات صفحة التواصل
const contactData = await getContactPageData('ar');

// جلب بيانات صفحة من نحن
const aboutData = await getAboutPageData('ar');

// جلب بيانات صفحة الوظائف
const jobsData = await getJobsPageData('ar', 10, 0);

// جلب بيانات صفحة البيع بالجملة
const wholesaleData = await getWholesalePageData('ar');
```

## أنواع البيانات

### ContactPageData
```typescript
interface ContactPageData {
  title: string;
  description?: string;
  content: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    whatsapp?: string;
    workingHours: {
      weekdays: string;
      weekdaysHours: string;
      weekend: string;
      weekendHours: string;
    };
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  contactForm: {
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      placeholder: string;
      options?: string[];
    }>;
  };
}
```

### AboutPageData
```typescript
interface AboutPageData {
  title: string;
  description?: string;
  content: string;
  storeInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    workingHours: {
      weekdays: string;
      weekdaysHours: string;
      weekend: string;
      weekendHours: string;
    };
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
}
```

### JobsPageData
```typescript
interface JobsPageData {
  title: string;
  description?: string;
  content: string;
  jobs: JobData[];
}

interface JobData {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  type: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryRange?: string;
  applicationDeadline?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applicationUrl?: string;
  contactEmail?: string;
}
```

### WholesalePageData
```typescript
interface WholesalePageData {
  title: string;
  description?: string;
  content: string;
  benefits: WholesaleBenefit[];
  requirements: WholesaleRequirement[];
  contactInfo: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
  minimumOrder: string;
  discountRange: string;
  deliveryInfo: string;
}
```

## التخزين المؤقت

### استراتيجية التخزين المؤقت
- تخزين مؤقت لمدة 5 دقائق
- تخزين مؤقت حسب اللغة
- تنظيف تلقائي للبيانات المنتهية الصلاحية

### إدارة التخزين المؤقت
```typescript
// مسح التخزين المؤقت
pagesService.clearCache();

// مسح البيانات المنتهية الصلاحية
pagesService.clearExpiredCache();

// إحصائيات التخزين المؤقت
const stats = pagesService.getCacheStats();
```

## معالجة الأخطاء

### أنواع الأخطاء
- أخطاء الشبكة
- أخطاء البيانات
- أخطاء التخزين المؤقت
- أخطاء التحقق من الصحة

### معالجة الأخطاء
```typescript
try {
  const data = await getContactPageData('ar');
  // استخدام البيانات
} catch (error) {
  console.error('خطأ في جلب البيانات:', error);
  // معالجة الخطأ
}
```

## الأداء والتحسينات

### تحسينات الأداء
- طلبات متوازية
- تخزين مؤقت ذكي
- ضغط البيانات
- تحميل كسول

### مراقبة الأداء
```typescript
// قياس وقت الاستجابة
const startTime = Date.now();
const data = await getContactPageData('ar');
const responseTime = Date.now() - startTime;
console.log(`وقت الاستجابة: ${responseTime}ms`);
```

## التطوير المستقبلي

### ميزات مقترحة
- دعم GraphQL
- تخزين مؤقت متقدم
- تحسينات الأداء
- دعم المزيد من اللغات

### التوسع
- إضافة خدمات جديدة
- تحسين معالجة الأخطاء
- دعم المزيد من أنواع البيانات
- تكامل مع أنظمة خارجية