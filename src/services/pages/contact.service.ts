import { ContactPageData } from "../../odoo-schema-full/services/pages.service";

// Mock data for contact page
const contactPageData: ContactPageData = {
	title: "تواصل معنا",
	description: "نحن هنا لمساعدتك. تواصل معنا بأي طريقة تفضلها",
	content: `
		<p>نحن في Coffee Selection نفتخر بخدمة العملاء المتميزة. فريقنا متاح دائماً للإجابة على استفساراتك ومساعدتك في اختيار أفضل المنتجات.</p>
		<p>يمكنك التواصل معنا عبر الهاتف أو البريد الإلكتروني أو زيارة متجرنا مباشرة.</p>
	`,
	contactInfo: {
		address: "شارع الملك فهد، حي النزهة، الرياض، المملكة العربية السعودية",
		phone: "+966 11 234 5678",
		email: "info@coffee-selection.com",
		whatsapp: "+966 50 123 4567",
		workingHours: {
			weekdays: "الأحد - الخميس",
			weekdaysHours: "8:00 ص - 10:00 م",
			weekend: "الجمعة - السبت",
			weekendHours: "9:00 ص - 11:00 م",
		},
		socialMedia: {
			facebook: "https://facebook.com/coffee-selection",
			twitter: "https://twitter.com/coffee-selection",
			instagram: "https://instagram.com/coffee-selection",
			linkedin: "https://linkedin.com/company/coffee-selection",
		},
	},
	contactForm: {
		fields: [
			{
				name: "name",
				type: "text",
				required: true,
				placeholder: "الاسم الكامل",
			},
			{
				name: "email",
				type: "email",
				required: true,
				placeholder: "البريد الإلكتروني",
			},
			{
				name: "phone",
				type: "tel",
				required: false,
				placeholder: "رقم الهاتف",
			},
			{
				name: "subject",
				type: "select",
				required: true,
				placeholder: "اختر الموضوع",
				options: [
					"استفسار عام",
					"طلب منتج",
					"شكوى",
					"اقتراح",
					"طلب البيع بالجملة",
					"أخرى",
				],
			},
			{
				name: "message",
				type: "textarea",
				required: true,
				placeholder: "رسالتك",
			},
		],
	},
};

export const getContactPageData = async (
	lang: string = "ar",
): Promise<ContactPageData> => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	// In a real implementation, this would fetch from the API
	return contactPageData;
};
