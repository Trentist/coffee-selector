/**
 * User Lifecycle Configuration - تكوين دورة حياة المستخدم
 */

export interface UserLifecycleConfig {
	// Registration settings
	requireEmailVerification: boolean;
	requirePhoneVerification: boolean;
	allowGuestCheckout: boolean;
	autoLoginAfterRegistration: boolean;

	// Security settings
	maxLoginAttempts: number;
	lockoutDuration: number; // minutes
	passwordMinLength: number;
	passwordRequireSpecialChars: boolean;
	passwordRequireNumbers: boolean;
	passwordRequireUppercase: boolean;
	passwordRequireLowercase: boolean;

	// Session settings
	sessionTimeout: number; // minutes
	rememberMeDuration: number; // days
	maxConcurrentSessions: number;

	// Notification settings
	sendWelcomeEmail: boolean;
	sendEmailVerification: boolean;
	sendPhoneVerification: boolean;
	sendPasswordResetEmail: boolean;
	sendSecurityAlerts: boolean;

	// Analytics settings
	trackUserActivity: boolean;
	trackUserBehavior: boolean;
	enableCustomerSegmentation: boolean;

	// Integration settings
	enableSocialLogin: boolean;
	enableTwoFactorAuth: boolean;
	enableBiometricAuth: boolean;
}

export interface UserLifecycleValidation {
	validateRegistrationData(userData: any): Promise<{ isValid: boolean; errors: string[] }>;
	validateLoginData(loginData: any): Promise<{ isValid: boolean; errors: string[] }>;
	validateProfileUpdate(updates: any): Promise<{ isValid: boolean; errors: string[] }>;
	validatePassword(password: string): Promise<{ isValid: boolean; errors: string[] }>;
	validateEmail(email: string): Promise<{ isValid: boolean; errors: string[] }>;
	validatePhone(phone: string): Promise<{ isValid: boolean; errors: string[] }>;
	validateAddress(address: any): Promise<{ isValid: boolean; errors: string[] }>;
}