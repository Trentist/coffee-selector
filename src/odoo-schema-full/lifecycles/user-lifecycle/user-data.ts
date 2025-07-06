/**
 * User Data Interfaces - واجهات بيانات المستخدم
 * User profile, preferences, and related data structures
 */

import { UserRole } from "./types";

export interface UserPreferences {
	userId: string;
	language: "en" | "ar";
	currency: string;
	timezone: string;
	emailNotifications: {
		orderUpdates: boolean;
		promotions: boolean;
		newsletters: boolean;
		securityAlerts: boolean;
	};
	smsNotifications: {
		orderUpdates: boolean;
		promotions: boolean;
		securityAlerts: boolean;
	};
	pushNotifications: {
		orderUpdates: boolean;
		promotions: boolean;
		securityAlerts: boolean;
	};
}

export interface UserSecurity {
	userId: string;
	passwordHash: string;
	passwordSalt: string;
	passwordLastChanged: Date;
	loginAttempts: number;
	isLocked: boolean;
	lockExpiresAt?: Date;
	lastLoginDate?: Date;
	lastLoginIp: string;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	emailVerificationToken?: string;
	phoneVerificationCode?: string;
	passwordResetToken?: string;
	passwordResetExpiresAt?: Date;
}

export interface UserAddress {
	addressId: string;
	userId: string;
	addressType: "billing" | "shipping" | "both";
	isDefault: boolean;
	firstName: string;
	lastName: string;
	company?: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	phone: string;
	email: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserPaymentMethod {
	paymentMethodId: string;
	userId: string;
	paymentType:
		| "credit_card"
		| "debit_card"
		| "bank_transfer"
		| "digital_wallet";
	isDefault: boolean;
	cardLastFour?: string;
	cardBrand?: string;
	cardExpiryMonth?: number;
	cardExpiryYear?: number;
	bankName?: string;
	accountLastFour?: string;
	walletType?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserOrderHistory {
	orderId: string;
	userId: string;
	orderNumber: string;
	orderDate: Date;
	orderStatus:
		| "pending"
		| "confirmed"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled"
		| "refunded";
	totalAmount: number;
	currency: string;
	paymentStatus: "pending" | "paid" | "failed" | "refunded";
	shippingStatus: "pending" | "shipped" | "delivered" | "returned";
	itemsCount: number;
	lastUpdated: Date;
}

export interface UserWishlist {
	wishlistId: string;
	userId: string;
	productId: string;
	addedAt: Date;
	notes?: string;
}

export interface UserReview {
	reviewId: string;
	userId: string;
	productId: string;
	orderId: string;
	rating: number;
	title: string;
	comment: string;
	isVerified: boolean;
	isApproved: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserSupportTicket {
	ticketId: string;
	userId: string;
	subject: string;
	description: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in_progress" | "resolved" | "closed";
	category:
		| "order"
		| "payment"
		| "shipping"
		| "product"
		| "technical"
		| "general";
	assignedTo?: string;
	createdAt: Date;
	updatedAt: Date;
	resolvedAt?: Date;
}

export interface UserNotification {
	notificationId: string;
	userId: string;
	type: "email" | "sms" | "push" | "in_app";
	title: string;
	message: string;
	category:
		| "order"
		| "payment"
		| "shipping"
		| "promotion"
		| "security"
		| "general";
	isRead: boolean;
	isSent: boolean;
	sentAt?: Date;
	readAt?: Date;
	createdAt: Date;
	expiresAt?: Date;
	actionUrl?: string;
	actionData?: Record<string, any>;
}

export interface UserAnalytics {
	userId: string;
	totalOrders: number;
	totalSpent: number;
	averageOrderValue: number;
	lastOrderDate?: Date;
	favoriteCategories: string[];
	favoriteBrands: string[];
	totalReviews: number;
	averageRating: number;
	totalWishlistItems: number;
	totalSupportTickets: number;
	registrationDate: Date;
	lastLoginDate: Date;
	totalLoginCount: number;
	isActive: boolean;
	customerSegment: "new" | "returning" | "loyal" | "vip";
	lifetimeValue: number;
	churnRisk: "low" | "medium" | "high";
}