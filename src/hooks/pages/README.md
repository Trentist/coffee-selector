# Pages Hooks System

# نظام Hooks الصفحات

## نظرة عامة

نظام Hooks الصفحات يوفر React hooks جاهزة للاستخدام لإدارة حالة البيانات في صفحات الموقع المختلفة.

## Hooks المتاحة

### 1. useContactPage

Hook لإدارة بيانات صفحة التواصل

- **الملف**: `useContactPage.ts`
- **الحالة**: loading, error, data
- **المعاملات**: lang (string)

### 2. useAboutPage

Hook لإدارة بيانات صفحة من نحن

- **الملف**: `useAboutPage.ts`
- **الحالة**: loading, error, data
- **المعاملات**: lang (string)

### 3. useJobsPage

Hook لإدارة بيانات صفحة الوظائف

- **الملف**: `useJobsPage.ts`
- **الحالة**: loading, error, data
- **المعاملات**: lang (string), limit (number), offset (number)

### 4. useWholesalePage

Hook لإدارة بيانات صفحة البيع بالجملة

- **الملف**: `useWholesalePage.ts`
- **الحالة**: loading, error, data
- **المعاملات**: lang (string)

## الاستخدام

### استيراد Hooks

```typescript
import {
	useContactPage,
	useAboutPage,
	useJobsPage,
	useWholesalePage,
} from "@/hooks/pages";
```

### استخدام Hooks

```typescript
// Hook صفحة التواصل
const { data, loading, error } = useContactPage("ar");

// Hook صفحة من نحن
const { data, loading, error } = useAboutPage("ar");

// Hook صفحة الوظائف
const { data, loading, error } = useJobsPage("ar", 10, 0);

// Hook صفحة البيع بالجملة
const { data, loading, error } = useWholesalePage("ar");
```

## حالات Hook

### الحالات المتاحة

```typescript
interface HookState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}
```

### معالجة الحالات

```typescript
const { data, loading, error } = useContactPage('ar');

if (loading) {
  return <Spinner />;
}

if (error) {
  return <Alert status="error">{error}</Alert>;
}

if (!data) {
  return <Alert status="warning">لا توجد بيانات</Alert>;
}

return <ContactPage data={data} />;
```

## أمثلة الاستخدام

### صفحة التواصل

```typescript
import React from 'react';
import { useContactPage } from '@/hooks/pages';
import { ContactPage } from '@/components/pages';
import { Box, Spinner, Alert } from '@chakra-ui/react';

export default function ContactPageComponent() {
  const { data, loading, error } = useContactPage();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          خطأ في التحميل: {error}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={8}>
        <Alert status="warning">
          <AlertIcon />
          لا توجد بيانات
        </Alert>
      </Box>
    );
  }

  return <ContactPage data={data} />;
}
```

### صفحة الوظائف مع تصفية

```typescript
import React, { useState } from 'react';
import { useJobsPage } from '@/hooks/pages';
import { JobsPage } from '@/components/pages';
import { Box, Spinner, Alert, Select } from '@chakra-ui/react';

export default function JobsPageComponent() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, loading, error } = useJobsPage('ar', limit, offset);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0); // إعادة تعيين الإزاحة
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          خطأ في التحميل: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Select
        value={limit}
        onChange={(e) => handleLimitChange(Number(e.target.value))}
        mb={4}
      >
        <option value={5}>5 وظائف</option>
        <option value={10}>10 وظائف</option>
        <option value={20}>20 وظيفة</option>
      </Select>

      {data && <JobsPage data={data} />}
    </Box>
  );
}
```

## إدارة الحالة

### إعادة التحميل

```typescript
const { data, loading, error } = useContactPage("ar");

const handleRefresh = () => {
	// إعادة تحميل البيانات
	window.location.reload();
};
```

### تغيير اللغة

```typescript
const [lang, setLang] = useState("ar");
const { data, loading, error } = useContactPage(lang);

const handleLanguageChange = (newLang: string) => {
	setLang(newLang);
};
```

## تحسينات الأداء

### التخزين المؤقت

- البيانات محفوظة في الذاكرة
- إعادة استخدام البيانات المحملة
- تحميل ذكي للبيانات

### تحسين التصيير

```typescript
import React, { memo } from 'react';

const ContactPageComponent = memo(() => {
  const { data, loading, error } = useContactPage();

  // مكون محسن
  return <ContactPage data={data} />;
});
```

## معالجة الأخطاء

### أنواع الأخطاء

- أخطاء الشبكة
- أخطاء البيانات
- أخطاء التحقق من الصحة
- أخطاء التخزين المؤقت

### معالجة الأخطاء المتقدمة

```typescript
const { data, loading, error } = useContactPage("ar");

useEffect(() => {
	if (error) {
		// تسجيل الخطأ
		console.error("خطأ في صفحة التواصل:", error);

		// إرسال تقرير الخطأ
		// reportError(error);
	}
}, [error]);
```

## التطوير المستقبلي

### ميزات مقترحة

- دعم React Query
- إدارة حالة متقدمة
- تحسينات الأداء
- دعم المزيد من اللغات

### التوسع

- إضافة hooks جديدة
- تحسين معالجة الأخطاء
- دعم المزيد من أنواع البيانات
- تكامل مع أنظمة خارجية
