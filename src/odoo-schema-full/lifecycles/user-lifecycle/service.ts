/**
 * User Lifecycle Service Interfaces - واجهات خدمة دورة حياة المستخدم
 */

import {
	UserRegistrationData,
	UserLoginData,
	UserProfileUpdate,
	UserPasswordReset,
	UserAddress,
	UserPaymentMethod,
	UserOrderHistory,
	UserWishlist,
	UserReview,
	UserSupportTicket,
	UserNotification,
	UserPreferences,
	UserAnalytics,
} from "./user-data";

export interface UserLifecycleEvents {
	// Registration events
	onUserRegistered: (userData: UserRegistrationData) => void;
	onEmailVerified: (userId: string) => void;
	onPhoneVerified: (userId: string) => void;

	// Authentication events
	onUserLogin: (loginData: UserLoginData) => void;
	onUserLogout: (userId: string) => void;
	onPasswordReset: (resetData: UserPasswordReset) => void;

	// Profile events
	onProfileUpdated: (userId: string, updates: UserProfileUpdate) => void;
	onAddressAdded: (address: UserAddress) => void;
	onAddressUpdated: (addressId: string, updates: Partial<UserAddress>) => void;
	onAddressDeleted: (addressId: string) => void;

	// Payment events
	onPaymentMethodAdded: (paymentMethod: UserPaymentMethod) => void;
	onPaymentMethodUpdated: (
		paymentMethodId: string,
		updates: Partial<UserPaymentMethod>,
	) => void;
	onPaymentMethodDeleted: (paymentMethodId: string) => void;

	// Order events
	onOrderPlaced: (order: UserOrderHistory) => void;
	onOrderStatusChanged: (orderId: string, newStatus: string) => void;

	// Wishlist events
	onWishlistItemAdded: (wishlistItem: UserWishlist) => void;
	onWishlistItemRemoved: (wishlistId: string) => void;

	// Review events
	onReviewSubmitted: (review: UserReview) => void;
	onReviewUpdated: (reviewId: string, updates: Partial<UserReview>) => void;

	// Support events
	onSupportTicketCreated: (ticket: UserSupportTicket) => void;
	onSupportTicketUpdated: (
		ticketId: string,
		updates: Partial<UserSupportTicket>,
	) => void;

	// Notification events
	onNotificationSent: (notification: UserNotification) => void;
	onNotificationRead: (notificationId: string) => void;
}

export interface UserLifecycleService {
	// User management
	registerUser(userData: UserRegistrationData): Promise<string>;
	loginUser(loginData: UserLoginData): Promise<any>;
	logoutUser(sessionId: string): Promise<void>;
	updateProfile(userId: string, updates: UserProfileUpdate): Promise<void>;
	deleteUser(userId: string): Promise<void>;

	// Address management
	addAddress(
		userId: string,
		address: Omit<
			UserAddress,
			"addressId" | "userId" | "createdAt" | "updatedAt"
		>,
	): Promise<string>;
	updateAddress(
		addressId: string,
		updates: Partial<UserAddress>,
	): Promise<void>;
	deleteAddress(addressId: string): Promise<void>;
	getAddresses(userId: string): Promise<UserAddress[]>;

	// Payment method management
	addPaymentMethod(
		userId: string,
		paymentMethod: Omit<
			UserPaymentMethod,
			"paymentMethodId" | "userId" | "createdAt" | "updatedAt"
		>,
	): Promise<string>;
	updatePaymentMethod(
		paymentMethodId: string,
		updates: Partial<UserPaymentMethod>,
	): Promise<void>;
	deletePaymentMethod(paymentMethodId: string): Promise<void>;
	getPaymentMethods(userId: string): Promise<UserPaymentMethod[]>;

	// Order history
	getOrderHistory(
		userId: string,
		page?: number,
		limit?: number,
	): Promise<{ orders: UserOrderHistory[]; total: number }>;
	getOrderDetails(orderId: string): Promise<UserOrderHistory | null>;

	// Wishlist management
	addToWishlist(
		userId: string,
		productId: string,
		notes?: string,
	): Promise<string>;
	removeFromWishlist(wishlistId: string): Promise<void>;
	getWishlist(userId: string): Promise<UserWishlist[]>;

	// Review management
	submitReview(
		review: Omit<UserReview, "reviewId" | "createdAt" | "updatedAt">,
	): Promise<string>;
	updateReview(reviewId: string, updates: Partial<UserReview>): Promise<void>;
	deleteReview(reviewId: string): Promise<void>;
	getUserReviews(userId: string): Promise<UserReview[]>;

	// Support ticket management
	createSupportTicket(
		ticket: Omit<UserSupportTicket, "ticketId" | "createdAt" | "updatedAt">,
	): Promise<string>;
	updateSupportTicket(
		ticketId: string,
		updates: Partial<UserSupportTicket>,
	): Promise<void>;
	getUserTickets(userId: string): Promise<UserSupportTicket[]>;

	// Notification management
	sendNotification(
		notification: Omit<UserNotification, "notificationId" | "createdAt">,
	): Promise<string>;
	markNotificationAsRead(notificationId: string): Promise<void>;
	getUserNotifications(
		userId: string,
		unreadOnly?: boolean,
	): Promise<UserNotification[]>;

	// Analytics
	getUserAnalytics(userId: string): Promise<UserAnalytics>;

	// Preferences
	updatePreferences(
		userId: string,
		preferences: Partial<UserPreferences>,
	): Promise<void>;
	getPreferences(userId: string): Promise<UserPreferences>;
}
