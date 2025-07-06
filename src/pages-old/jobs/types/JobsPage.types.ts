/**
 * Jobs Page Types
 * أنواع صفحة الوظائف
 */

export interface JobPosition {
	id: string;
	title: string;
	department: string;
	location: string;
	type: "full-time" | "part-time" | "contract" | "internship";
	experience: string;
	salary: string;
	description: string;
	requirements: string[];
	responsibilities: string[];
	benefits: string[];
	isActive: boolean;
	postedDate: string;
	deadline?: string;
}

export interface JobsPageData {
	title: string;
	description: string;
	positions: JobPosition[];
	departments: string[];
	locations: string[];
	seo: {
		title: string;
		description: string;
		keywords: string;
	};
}

export interface JobsPageProps {
	data?: JobsPageData;
	loading?: boolean;
	error?: string;
}
