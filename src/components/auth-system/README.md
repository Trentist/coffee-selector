# Authentication System

نظام المصادقة المتكامل للتطبيق

## المكونات الرئيسية

### AuthContainer
المكون الرئيسي الذي يجمع جميع مكونات المصادقة

```tsx
import { AuthContainer } from "@/components/auth-system";

<AuthContainer
  initialFormType="login"
  redirectTo="/dashboard"
  title="Coffee Selection"
  subtitle="اكتشف عالم القهوة المميز"
  image="/assets/images/auth-bg.jpg"
/>
```

### AuthLayout
مكون التخطيط الذي يحتوي على الصورة والنموذج

### AuthForm
مكون النموذج الرئيسي الذي يدير التنقل بين النماذج المختلفة

## النماذج المتاحة

### LoginForm
نموذج تسجيل الدخول مع:
- حقل البريد الإلكتروني
- حقل كلمة المرور
- خيار "تذكرني"
- رابط "نسيت كلمة المرور"
- رابط "إنشاء حساب"
- تسجيل الدخول بـ Google

### RegisterForm
نموذج التسجيل مع:
- حقل الاسم الكامل
- حقل البريد الإلكتروني
- حقل رقم الهاتف (اختياري)
- حقل كلمة المرور
- حقل تأكيد كلمة المرور
- مؤشر قوة كلمة المرور
- الموافقة على الشروط
- التسجيل بـ Google

### ForgotPasswordForm
نموذج نسيان كلمة المرور مع:
- حقل البريد الإلكتروني
- رسالة نجاح
- العودة لتسجيل الدخول

### ResetPasswordForm
نموذج إعادة تعيين كلمة المرور مع:
- حقل كلمة المرور الجديدة
- حقل تأكيد كلمة المرور
- مؤشر قوة كلمة المرور
- التحقق من صحة الرمز

## المكونات المساعدة

### AuthInput
حقل إدخال مخصص مع:
- دعم الأيقونات
- إظهار/إخفاء كلمة المرور
- رسائل الخطأ
- أنماط متجاوبة

### AuthButton
زر مخصص مع:
- أنماط متعددة (primary, secondary, ghost)
- أحجام مختلفة
- حالة التحميل
- الأيقونات

### AuthDivider
فاصل مع نص في المنتصف

### AuthHeader
رأس الصفحة مع العنوان والنص الفرعي

### AuthImage
صورة خلفية مع نص متراكب

## Hooks المتاحة

### useAuthForm
Hook لإدارة حالة النموذج والتحقق من الصحة

### useAuthValidation
Hook للتحقق من صحة البيانات

### useAuthAnimation
Hook للانيميشن

## الاستخدام

### في صفحة المصادقة الرئيسية
```tsx
// src/app/[locale]/auth/page.tsx
import { AuthContainer } from "@/components/auth-system";

export default function AuthPage() {
  return (
    <AuthContainer
      initialFormType="login"
      redirectTo="/dashboard"
    />
  );
}
```

### في مكون مخصص
```tsx
import { AuthForm, AuthLayout } from "@/components/auth-system";

export function CustomAuthPage() {
  const [formType, setFormType] = useState("login");

  return (
    <AuthLayout>
      <AuthForm
        formType={formType}
        onSwitchForm={setFormType}
        onSuccess={() => router.push("/dashboard")}
      />
    </AuthLayout>
  );
}
```

## التخصيص

### الألوان
يستخدم النظام نظام الألوان المخصص من `@/theme/hooks/useThemeColors`

### الترجمة
يستخدم النظام ملفات الترجمة من `messages/[locale]/auth.json`

### الانيميشن
يستخدم النظام Framer Motion للانيميشن

## الأمان

- التحقق من صحة المدخلات
- حماية من CSRF
- Rate limiting
- Security headers
- Content Security Policy

## المتطلبات

- Next.js 14+
- Chakra UI
- Framer Motion
- React Hook Form
- Next Intl