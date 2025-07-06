/**
 * Privacy Policy Page Types
 * أنواع صفحة سياسة الخصوصية
 */

export interface PrivacySection {
	id: string;
	title: string;
	content: string;
	items?: string[];
}

export interface PrivacyPageData {
	title: string;
	description: string;
	sections: PrivacySection[];
	lastUpdated: string;
	seo: {
		title: string;
		description: string;
		keywords: string;
	};
}

export interface PrivacyPageProps {
	data?: PrivacyPageData;
	loading?: boolean;
	error?: string;
}
