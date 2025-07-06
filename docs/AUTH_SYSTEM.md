# نظام المصادقة المتكامل

## نظرة عامة

نظام المصادقة المتكامل والشامل الذي يوفر جميع ميزات الأمان والمرونة المطلوبة للتطبيق.

## الميزات

### 🔐 المصادقة الأساسية
- تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- إنشاء حساب جديد
- نسيان كلمة المرور وإعادة التعيين
- تسجيل الخروج

### 🔑 المصادقة المتقدمة
- تسجيل الدخول بـ Google OAuth
- المصادقة الثنائية (2FA)
- ربط الحسابات الاجتماعية
- إدارة الجلسات

### 🛡️ الأمان
- تحديد معدل الطلبات (Rate Limiting)
- التحقق من المدخلات (Input Validation)
- تشفير كلمات المرور
- حماية من هجمات CSRF
- جلسات آمنة

### 📧 إدارة الحساب
- تحديث الملف الشخصي
- تغيير كلمة المرور
- حذف الحساب
- الاشتراك في النشرة الإخبارية

## الملفات الرئيسية

### المكونات
```
src/components/auth/
├── LoginForm.tsx          # نموذج تسجيل الدخول
├── RegisterForm.tsx       # نموذج التسجيل
├── ForgotPasswordForm.tsx # نموذج نسيان كلمة المرور
└── index.ts              # ملف التصدير
```

### الخدمات
```
src/services/
├── auth/
│   └── auth.service.ts    # خدمة المصادقة الرئيسية
└── security/
    ├── rate-limiter.service.ts    # تحديد معدل الطلبات
    └── input-validator.service.ts # التحقق من المدخلات
```

### API Routes
```
src/app/api/auth/
└── [...nextauth]/
    ├── route.ts           # NextAuth API route
    └── auth-config.ts     # إعدادات NextAuth
```

### GraphQL
```
src/graphql/mutations/
└── auth.ts               # طلبات GraphQL للمصادقة
```

## الاستخدام

### 1. إعداد NextAuth

```typescript
// src/app/api/auth/[...nextauth]/auth-config.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // إعدادات المصادقة المحلية
    }),
  ],
  // إعدادات إضافية...
};
```

### 2. استخدام Hook المصادقة

```typescript
import { useAuth } from "@/hooks/useAuth";

const MyComponent = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: "user@example.com",
      password: "password123",
      rememberMe: true,
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>تسجيل الخروج</button>
      ) : (
        <button onClick={handleLogin}>تسجيل الدخول</button>
      )}
    </div>
  );
};
```

### 3. استخدام مكونات المصادقة

```typescript
import { LoginForm, RegisterForm, ForgotPasswordForm } from "@/components/auth";

const AuthPage = () => {
  const [mode, setMode] = useState("login");

  return (
    <div>
      {mode === "login" && (
        <LoginForm
          onSuccess={() => console.log("تم تسجيل الدخول")}
          onSwitchToRegister={() => setMode("register")}
          onSwitchToForgotPassword={() => setMode("forgot")}
        />
      )}
      {mode === "register" && (
        <RegisterForm
          onSuccess={() => console.log("تم التسجيل")}
          onSwitchToLogin={() => setMode("login")}
        />
      )}
      {mode === "forgot" && (
        <ForgotPasswordForm
          onSuccess={() => console.log("تم إرسال رابط إعادة التعيين")}
          onSwitchToLogin={() => setMode("login")}
        />
      )}
    </div>
  );
};
```

## المتغيرات البيئية المطلوبة

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Odoo Integration
NEXT_PUBLIC_ODOO_URL=https://your-odoo-instance.com
NEXT_PUBLIC_ODOO_API_TOKEN=your-odoo-api-token
```

## الأمان

### تحديد معدل الطلبات
- 5 محاولات تسجيل دخول كل 15 دقيقة
- 3 محاولات تسجيل كل ساعة
- 3 محاولات نسيان كلمة المرور كل ساعة

### التحقق من المدخلات
- تنظيف وتطهير جميع المدخلات
- التحقق من صحة البريد الإلكتروني
- التحقق من قوة كلمة المرور
- منع حقن HTML

### الجلسات الآمنة
- JWT tokens مشفرة
- HttpOnly cookies
- SameSite protection
- Secure cookies في الإنتاج

## التكامل مع الأنظمة الأخرى

### Redux Store
```typescript
// تحديث حالة المستخدم في Redux
const { user } = useAuth();
useEffect(() => {
  if (user) {
    dispatch(setUser(user));
  }
}, [user, dispatch]);
```

### Router Protection
```typescript
// حماية الصفحات
const ProtectedPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return <div>محتوى محمي</div>;
};
```

## الاختبار

```typescript
// اختبار تسجيل الدخول
test("should login successfully", async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.login({
      email: "test@example.com",
      password: "password123",
    });
  });

  expect(result.current.isAuthenticated).toBe(true);
});
```

## الدعم والمساهمة

للمساهمة في تطوير نظام المصادقة:

1. اتبع قواعد الترميز المحددة
2. اكتب اختبارات شاملة
3. وثق التغييرات
4. تأكد من الأمان

## الترخيص

هذا النظام جزء من مشروع Coffee Selection ويخضع لنفس شروط الترخيص.