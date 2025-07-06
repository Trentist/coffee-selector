# Enhanced Authentication System - نظام المصادقة المحسن

## نظرة عامة - Overview

نظام مصادقة شامل ومحسن مع ميزات أمنية متقدمة للفرونت إند، يدعم جميع عمليات المصادقة الأساسية والمتقدمة مع الحماية من الهجمات الأمنية.

A comprehensive and enhanced authentication system with advanced security features for frontend, supporting all basic and advanced authentication operations with protection against security attacks.

## الميزات الرئيسية - Key Features

### 🔐 المصادقة الأساسية - Core Authentication

- ✅ تسجيل الدخول مع التحقق من المدخلات - Login with input validation
- ✅ التسجيل مع التحقق من البيانات - Registration with data validation
- ✅ تسجيل الخروج مع تنظيف الجلسة - Logout with session cleanup
- ✅ تجديد الرموز المميزة تلقائياً - Automatic token refresh

### 🔒 إدارة كلمات المرور - Password Management

- ✅ طلب إعادة تعيين كلمة المرور - Password reset request
- ✅ إعادة تعيين كلمة المرور - Password reset
- ✅ تغيير كلمة المرور - Password change
- ✅ التحقق من قوة كلمة المرور - Password strength validation

### 👤 إدارة الملف الشخصي - Profile Management

- ✅ تحديث الملف الشخصي - Profile update
- ✅ تحديث التفضيلات - Preferences update
- ✅ إدارة العناوين - Address management
- ✅ إحصائيات المستخدم - User statistics

### 📧 التحقق من البريد الإلكتروني - Email Verification

- ✅ التحقق من البريد الإلكتروني - Email verification
- ✅ إعادة إرسال بريد التحقق - Resend verification email
- ✅ حالة التحقق - Verification status

### 🔐 المصادقة الثنائية - Two-Factor Authentication

- ✅ تفعيل المصادقة الثنائية - Enable 2FA
- ✅ التحقق من رمز المصادقة الثنائية - Verify 2FA code
- ✅ إلغاء المصادقة الثنائية - Disable 2FA
- ✅ رموز النسخ الاحتياطي - Backup codes

### 🛡️ الأمان والمراقبة - Security & Monitoring

- ✅ تسجيل الأحداث الأمنية - Security event logging
- ✅ إدارة الأجهزة النشطة - Active device management
- ✅ إلغاء الرموز المميزة - Token revocation
- ✅ حماية من هجمات Brute Force - Brute force protection

### ⚡ React Hooks - React Hooks

- ✅ `useAuthentication` - Hook المصادقة الرئيسي
- ✅ `useProtectedRoute` - Hook المسار المحمي
- ✅ `useGuestRoute` - Hook المسار للزوار
- ✅ `useRoleRoute` - Hook المسار حسب الدور
- ✅ `useAuthForm` - Hook نموذج المصادقة
- ✅ `usePasswordStrength` - Hook قوة كلمة المرور

## البنية - Architecture

```
src/services/auth/
├── enhanced-auth.service.ts    # خدمة المصادقة المحسنة الرئيسية
├── auth.service.ts             # خدمة المصادقة الأساسية
├── operations.ts               # عمليات المصادقة للفرونت إند
├── react-hooks.ts              # React Hooks للمصادقة
├── index.ts                    # ملف التصدير الرئيسي
└── README.md                   # هذا الملف
```

## التثبيت والاستخدام - Installation & Usage

### 1. استيراد الخدمة - Import the Service

```typescript
import { enhancedAuthService } from "@/services/auth";
```

### 2. استخدام React Hook - Using React Hook

```typescript
import { useAuthentication } from '@/services/auth';

function LoginComponent() {
  const { login, isLoading, error } = useAuthentication();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'Password123!',
      rememberMe: true,
    });

    if (result.success) {
      // تم تسجيل الدخول بنجاح
      console.log('Login successful');
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
    </button>
  );
}
```

### 3. حماية المسارات - Route Protection

```typescript
import { useProtectedRoute } from '@/services/auth';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useProtectedRoute('/auth/login');

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  if (!isAuthenticated) {
    return null; // سيتم التوجيه تلقائياً
  }

  return <div>محتوى الصفحة المحمية</div>;
}
```

### 4. حماية حسب الدور - Role-Based Protection

```typescript
import { useRoleRoute } from '@/services/auth';

function AdminPage() {
  const { isAuthenticated, isLoading, hasAccess } = useRoleRoute(['admin']);

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  if (!hasAccess) {
    return <div>غير مصرح لك بالوصول</div>;
  }

  return <div>صفحة المدير</div>;
}
```

## العمليات المتاحة - Available Operations

### تسجيل الدخول - Login

```typescript
const result = await enhancedAuthService.login({
	email: "user@example.com",
	password: "Password123!",
	rememberMe: true,
});

if (result.success) {
	console.log("User ID:", result.userId);
	console.log("Token:", result.token);
	console.log("User:", result.user);
}
```

### التسجيل - Registration

```typescript
const result = await enhancedAuthService.register({
	name: "John Doe",
	email: "john@example.com",
	password: "Password123!",
	phone: "+1234567890",
	acceptTerms: true,
	subscribeNewsletter: true,
});

if (result.success) {
	console.log("Registration successful");
	console.log("Verification required:", result.verificationRequired);
}
```

### إعادة تعيين كلمة المرور - Password Reset

```typescript
// طلب إعادة التعيين
const resetRequest =
	await enhancedAuthService.requestPasswordReset("user@example.com");

if (resetRequest.success) {
	console.log("Reset token:", resetRequest.resetToken);
	console.log("Expires at:", resetRequest.expiresAt);
}

// إعادة تعيين كلمة المرور
const resetResult = await enhancedAuthService.resetPassword(
	resetRequest.resetToken,
	"NewPassword123!",
);
```

### تحديث الملف الشخصي - Profile Update

```typescript
const result = await enhancedAuthService.updateProfile({
	firstName: "John",
	lastName: "Doe",
	phone: "+1234567890",
	dateOfBirth: "1990-01-01",
	gender: "male",
	bio: "Software Developer",
});

if (result.success) {
	console.log("Profile updated:", result.user);
}
```

### المصادقة الثنائية - Two-Factor Authentication

```typescript
// تفعيل المصادقة الثنائية
const enableResult = await enhancedAuthService.enable2FA();

if (enableResult.success) {
	console.log("QR Code:", enableResult.qrCode);
	console.log("Backup codes:", enableResult.backupCodes);
}

// التحقق من الرمز
const verifyResult = await enhancedAuthService.verify2FA("123456");

if (verifyResult.success) {
	console.log("2FA verified successfully");
}
```

## React Hooks - React Hooks

### useAuthentication

```typescript
const {
	user,
	isAuthenticated,
	isLoading,
	error,
	login,
	register,
	logout,
	requestPasswordReset,
	resetPassword,
	changePassword,
	updateProfile,
	verifyEmail,
	resendVerification,
	clearError,
	isAdmin,
	isVerified,
	hasRole,
	hasAnyRole,
} = useAuthentication();
```

### useAuthForm

```typescript
const {
	formData,
	errors,
	isSubmitting,
	updateField,
	validateForm,
	resetForm,
	setIsSubmitting,
} = useAuthForm();
```

### usePasswordStrength

```typescript
const { score, strength, feedback } = usePasswordStrength(password);

// strength: 'weak' | 'medium' | 'strong' | 'very-strong'
// score: 0-5
// feedback: string[]
```

## الأمان - Security Features

### حماية من هجمات Brute Force

```typescript
// Rate limiting: 5 attempts per 15 minutes per email
if (isRateLimited("login", email)) {
	return { success: false, error: "Too many attempts" };
}
```

### التحقق من المدخلات

```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
```

### تنظيف المدخلات

```typescript
function sanitizeInput(input: string): string {
	return input
		.trim()
		.replace(/[<>]/g, "") // Remove HTML tags
		.replace(/javascript:/gi, "") // Remove javascript: protocol
		.replace(/on\w+=/gi, ""); // Remove event handlers
}
```

### تسجيل الأحداث الأمنية

```typescript
// Automatic security event logging
this.logSecurityEvent("login", true, email);
this.logSecurityEvent("login", false, email);
this.logSecurityEvent("password_change", true);
```

## التكوين - Configuration

### متغيرات البيئة - Environment Variables

```env
NEXT_PUBLIC_ODOO_URL=https://your-odoo-instance.com
NEXT_PUBLIC_ODOO_API_TOKEN=your-api-token
```

### إعدادات الأمان - Security Settings

```typescript
const AUTH_CONSTANTS = {
	RATE_LIMIT_ATTEMPTS: 5,
	RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
	TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes
	MIN_PASSWORD_LENGTH: 8,
};
```

## الاختبار - Testing

### تشغيل الاختبارات - Running Tests

```bash
# اختبار شامل لنظام المصادقة
node src/scripts/test/enhanced-auth-integration-test.js

# اختبار الأمان المحسن
node src/scripts/test/enhanced-auth-security-test.js
```

### أمثلة الاختبار - Test Examples

```typescript
// Test login
const loginResult = await enhancedAuthService.login({
	email: "test@example.com",
	password: "TestPassword123!",
});

assert(loginResult.success, "Login should be successful");
assert(loginResult.user, "User data should be returned");
assert(loginResult.token, "Token should be returned");

// Test input validation
assert(validateEmail("test@example.com"), "Valid email should pass");
assert(!validateEmail("invalid-email"), "Invalid email should fail");
```

## الأخطاء والاستكشاف - Troubleshooting

### أخطاء شائعة - Common Errors

1. **خطأ في الاتصال - Network Error**

   ```typescript
   // تأكد من صحة URL
   const GRAPHQL_URL = `${ODOO_URL}/graphql/vsf`;
   ```

2. **خطأ في الرمز المميز - Token Error**

   ```typescript
   // تأكد من صحة API Token
   Authorization: `Bearer ${process.env.NEXT_PUBLIC_ODOO_API_TOKEN}`;
   ```

3. **خطأ في التحقق من المدخلات - Validation Error**
   ```typescript
   // تأكد من صحة تنسيق البريد الإلكتروني
   if (!validateEmail(email)) {
   	throw new Error("Invalid email format");
   }
   ```

### رسائل الخطأ - Error Messages

```typescript
const AUTH_ERROR_MESSAGES = {
	INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
	ACCOUNT_LOCKED: "تم قفل الحساب مؤقتاً",
	EMAIL_NOT_VERIFIED: "يرجى التحقق من بريدك الإلكتروني",
	WEAK_PASSWORD: "كلمة المرور ضعيفة جداً",
	RATE_LIMIT_EXCEEDED: "تم تجاوز الحد المسموح",
};
```

## الأداء - Performance

### تحسينات الأداء - Performance Optimizations

1. **تخزين مؤقت للبيانات - Data Caching**

   ```typescript
   // Local storage caching
   localStorage.setItem("user_data", JSON.stringify(user));
   ```

2. **تجديد تلقائي للرموز - Automatic Token Refresh**

   ```typescript
   // Refresh 5 minutes before expiry
   const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
   ```

3. **تحميل تدريجي - Lazy Loading**
   ```typescript
   // Load user data only when needed
   const user = useMemo(() => getStoredUserData(), []);
   ```

## الدعم والمساهمة - Support & Contribution

### الإبلاغ عن الأخطاء - Bug Reports

إذا وجدت خطأ، يرجى إنشاء issue مع:

- وصف الخطأ
- خطوات إعادة الإنتاج
- معلومات النظام
- رسائل الخطأ

### المساهمة - Contributing

1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التغييرات
4. إضافة اختبارات
5. إنشاء Pull Request

## الترخيص - License

هذا المشروع مرخص تحت MIT License.

## التحديثات المستقبلية - Future Updates

- [ ] دعم المصادقة الاجتماعية - Social Authentication
- [ ] دعم المصادقة البيومترية - Biometric Authentication
- [ ] تحسين واجهة المستخدم - UI Improvements
- [ ] دعم المزيد من اللغات - Multi-language Support
- [ ] تحسين الأداء - Performance Improvements
