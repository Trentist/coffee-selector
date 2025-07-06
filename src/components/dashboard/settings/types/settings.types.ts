export interface Settings {
	id: string;
	userId: string;
	notifications: NotificationSettings;
	privacy: PrivacySettings;
	security: SecuritySettings;
	preferences: PreferenceSettings;
	createdAt: string;
	updatedAt: string;
}

export interface NotificationSettings {
	email: boolean;
	sms: boolean;
	push: boolean;
	marketing: boolean;
	orders: boolean;
	newsletter: boolean;
}

export interface PrivacySettings {
	profileVisibility: "public" | "private" | "friends";
	dataSharing: boolean;
	analytics: boolean;
	cookies: boolean;
}

export interface SecuritySettings {
	twoFactorAuth: boolean;
	loginAlerts: boolean;
	deviceManagement: boolean;
	passwordExpiry: number;
}

export interface PreferenceSettings {
	language: string;
	currency: string;
	timezone: string;
	dateFormat: string;
	theme: "light" | "dark" | "auto";
}
