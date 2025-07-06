/**
 * Advanced User Lifecycle Features - ميزات دورة حياة المستخدم المتقدمة
 */

export interface UserLifecycleError {
	code: string;
	message: string;
	details?: Record<string, any>;
	timestamp: Date;
	userId?: string;
	sessionId?: string;
}

export interface UserLifecycleMetrics {
	totalUsers: number;
	activeUsers: number;
	newRegistrations: number;
	loginSuccessRate: number;
	averageSessionDuration: number;
	userRetentionRate: number;
	customerSatisfactionScore: number;
	supportTicketResolutionTime: number;
	emailOpenRate: number;
	smsDeliveryRate: number;
	pushNotificationOpenRate: number;
}

export interface UserLifecycleReport {
	reportId: string;
	reportType: "user_activity" | "registration_analytics" | "login_analytics" | "customer_satisfaction" | "support_analytics" | "notification_analytics";
	dateRange: {
		startDate: Date;
		endDate: Date;
	};
	filters: Record<string, any>;
	metrics: UserLifecycleMetrics;
	data: Record<string, any>[];
	generatedAt: Date;
	generatedBy: string;
}

export interface UserLifecycleExport {
	exportId: string;
	exportType: "user_data" | "order_history" | "activity_log" | "support_tickets" | "notifications";
	userId: string;
	format: "csv" | "json" | "xml" | "pdf";
	status: "pending" | "processing" | "completed" | "failed";
	fileUrl?: string;
	expiresAt: Date;
	createdAt: Date;
	completedAt?: Date;
}

export interface UserLifecycleBackup {
	backupId: string;
	userId: string;
	backupType: "full" | "partial";
	data: {
		profile: any;
		addresses: any[];
		paymentMethods: any[];
		preferences: any;
		orderHistory: any[];
		wishlist: any[];
		reviews: any[];
		supportTickets: any[];
		notifications: any[];
	};
	createdAt: Date;
	expiresAt: Date;
}

export interface UserLifecycleRestore {
	restoreId: string;
	userId: string;
	backupId: string;
	restoreType: "full" | "partial";
	status: "pending" | "processing" | "completed" | "failed";
	restoredData: Record<string, any>;
	createdAt: Date;
	completedAt?: Date;
	errorMessage?: string;
}

export interface UserLifecycleAudit {
	auditId: string;
	userId: string;
	action: string;
	resource: string;
	resourceId: string;
	oldValue?: any;
	newValue?: any;
	performedBy: string;
	performedAt: Date;
	ipAddress: string;
	userAgent: string;
	sessionId: string;
	metadata: Record<string, any>;
}

export interface UserLifecycleCompliance {
	gdprConsent: {
		marketing: boolean;
		analytics: boolean;
		thirdParty: boolean;
		updatedAt: Date;
	};
	dataRetention: {
		personalData: Date;
		orderHistory: Date;
		activityLog: Date;
		supportTickets: Date;
	};
	dataPortability: {
		lastExport: Date;
		exportFormat: string;
		exportStatus: string;
	};
	dataDeletion: {
		requestedAt?: Date;
		scheduledAt?: Date;
		completedAt?: Date;
		status: "not_requested" | "pending" | "completed";
	};
}