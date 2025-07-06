/**
 * Terms & Conditions Page Types
 * أنواع صفحة الشروط والأحكام
 */

export interface TermsSection {
	id: string;
	title: string;
	content: string;
	items?: string[];
}

export interface TermsPageData {
	title: string;
	description: string;
	sections: TermsSection[];
	lastUpdated: string;
	seo: {
		title: string;
		description: string;
		keywords: string;
	};
}

export interface TermsPageProps {
	data?: TermsPageData;
	loading?: boolean;
	error?: string;
}
