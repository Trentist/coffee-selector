/**
 * User Lifecycle Types - الأنواع الأساسية للمستخدم
 * Basic user types and interfaces
 */

// User roles for e-commerce application
export enum UserRole {
	GUEST = "guest", // Anonymous visitor
	CUSTOMER = "customer", // Registered customer
}

export interface UserLifecycleState {
	// User identification
	userId?: string;
	sessionId: string;
	userType: UserRole;
	isAuthenticated: boolean;

	// User profile
	email?: string;
	firstName?: string;
	lastName?: string;
	phone?: string;

	// Preferences
	language: "en" | "ar";
	currency: string;
	timezone: string;

	// Session data
	cartId?: string;
	wishlistId?: string;
	lastActivity: Date;

	// Registration status
	isEmailVerified: boolean;
	isPhoneVerified: boolean;
	registrationDate?: Date;

	// Security
	loginAttempts: number;
	isLocked: boolean;
	lastLoginDate?: Date;
}

export interface UserRegistrationData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone?: string;
	language: "en" | "ar";
	currency: string;
	timezone: string;
	marketingConsent: boolean;
	termsAccepted: boolean;
}

export interface UserLoginData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export interface UserProfileUpdate {
	firstName?: string;
	lastName?: string;
	phone?: string;
	language?: "en" | "ar";
	currency?: string;
	timezone?: string;
	marketingConsent?: boolean;
}

export interface UserPasswordReset {
	email: string;
	resetToken?: string;
	newPassword?: string;
}

export interface UserVerification {
	email?: string;
	phone?: string;
	verificationCode: string;
	verificationType: "email" | "phone";
}

export interface UserSession {
	sessionId: string;
	userId?: string;
	userType: UserRole;
	isAuthenticated: boolean;
	lastActivity: Date;
	expiresAt: Date;
	ipAddress: string;
	userAgent: string;
}

export interface UserActivity {
	activityId: string;
	userId?: string;
	sessionId: string;
	activityType:
		| "login"
		| "logout"
		| "register"
		| "profile_update"
		| "password_reset"
		| "email_verification"
		| "phone_verification"
		| "cart_add"
		| "cart_remove"
		| "wishlist_add"
		| "wishlist_remove"
		| "order_placed"
		| "order_viewed"
		| "product_viewed"
		| "search_performed";
	activityData: Record<string, any>;
	timestamp: Date;
	ipAddress: string;
	userAgent: string;
}
