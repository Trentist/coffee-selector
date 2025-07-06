/**
 * Dashboard Types
 * أنواع نظام لوحة التحكم
 */

export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	phone?: string;
	createdAt: string;
	updatedAt: string;
}

export interface DashboardTab {
	id: string;
	label: string;
	icon: any;
	content: React.ReactNode;
}

export interface Order {
	id: string;
	orderNumber: string;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	total: number;
	currency: string;
	createdAt: string;
	items: OrderItem[];
}

export interface OrderItem {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
	price: number;
	image?: string;
}

export interface WishlistItem {
	id: string;
	productId: string;
	productName: string;
	price: number;
	currency: string;
	image?: string;
	addedAt: string;
}

export interface Address {
	id: string;
	type: 'billing' | 'shipping';
	firstName: string;
	lastName: string;
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	phone: string;
	isDefault: boolean;
}

export interface DashboardStats {
	totalOrders: number;
	totalSpent: number;
	wishlistItems: number;
	recentOrders: Order[];
}

export interface RecentActivity {
	id: string;
	type: "order" | "login" | "profile_update" | "password_change";
	description: string;
	timestamp: string;
	status: string;
}

export interface ProfileData {
	user: User;
	addresses: Address[];
	preferences: {
		language: string;
		currency: string;
		notifications: boolean;
	};
}

export interface StatsCardData {
	label: string;
	value: string | number;
	icon: string;
	color: string;
	change?: string;
	isIncrease?: boolean;
}
