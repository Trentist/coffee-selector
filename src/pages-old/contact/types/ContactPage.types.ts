/**
 * Contact Page Types
 * أنواع صفحة التواصل
 */

export interface ContactInfo {
	address: string;
	phone: string;
	email: string;
	whatsapp: string;
	socialMedia: {
		facebook: string;
		twitter: string;
		instagram: string;
		linkedin: string;
	};
}

export interface OfficeHours {
	weekdays: string;
	weekdaysHours: string;
	weekend: string;
	weekendHours: string;
}

export interface ContactFormField {
	name: string;
	type: "text" | "email" | "tel" | "textarea" | "select";
	required: boolean;
	placeholder: string;
	options?: string[];
}

export interface ContactForm {
	fields: ContactFormField[];
}

export interface ContactPageData {
	title: string;
	description: string;
	content: string;
	contactInfo: ContactInfo;
	contactForm: ContactForm;
	officeHours: OfficeHours;
	seo: {
		title: string;
		description: string;
		keywords: string;
	};
}

export interface ContactPageProps {
	data?: ContactPageData;
	loading?: boolean;
	error?: string;
}
