/**
 * User Lifecycle Templates - قوالب دورة حياة المستخدم
 */

export interface UserLifecycleEmailTemplates {
	welcomeEmail: {
		subject: string;
		template: string;
		variables: string[];
	};
	emailVerification: {
		subject: string;
		template: string;
		variables: string[];
	};
	phoneVerification: {
		subject: string;
		template: string;
		variables: string[];
	};
	passwordReset: {
		subject: string;
		template: string;
		variables: string[];
	};
	securityAlert: {
		subject: string;
		template: string;
		variables: string[];
	};
	accountLocked: {
		subject: string;
		template: string;
		variables: string[];
	};
	accountUnlocked: {
		subject: string;
		template: string;
		variables: string[];
	};
}

export interface UserLifecycleSMSTemplates {
	phoneVerification: {
		template: string;
		variables: string[];
	};
	securityAlert: {
		template: string;
		variables: string[];
	};
	orderUpdate: {
		template: string;
		variables: string[];
	};
}

export interface UserLifecyclePushTemplates {
	orderUpdate: {
		title: string;
		body: string;
		variables: string[];
	};
	promotion: {
		title: string;
		body: string;
		variables: string[];
	};
	securityAlert: {
		title: string;
		body: string;
		variables: string[];
	};
}