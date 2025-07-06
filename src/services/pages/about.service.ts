import { AboutPageData } from "../../odoo-schema-full/services/pages.service";

// Mock data for about page
const aboutPageData: AboutPageData = {
	title: "من نحن",
	description: "تعرف على قصة Coffee Selection ورحلتنا في عالم القهوة المميزة",
	content: `
		<p>تأسست Coffee Selection في عام 2010 بهدف تقديم أفضل أنواع القهوة العربية والعالمية لعشاق القهوة في المملكة العربية السعودية.</p>

		<p>نحن نؤمن بأن القهوة ليست مجرد مشروب، بل هي تجربة كاملة تبدأ من اختيار الحبوب المميزة وصولاً إلى طريقة التحميص والتحضير المثالية.</p>

		<p>في Coffee Selection، نختار بعناية فائقة أفضل أنواع حبوب القهوة من مختلف أنحاء العالم، ونحرص على تحميصها بطرق تقليدية وعصرية تضمن الحفاظ على النكهة الأصلية والرائحة المميزة.</p>

		<p>فريقنا من الخبراء في مجال القهوة يعمل بجد لتطوير منتجات جديدة ومبتكرة تلبي احتياجات عملائنا المتنوعة، من القهوة العربية التقليدية إلى الإسبريسو الإيطالي والقهوة الأمريكية.</p>

		<p>نحن نفخر بكوننا الشريك الموثوق للعديد من المقاهي والمطاعم والفنادق في المملكة، ونواصل تطوير خدماتنا لتقديم تجربة استثنائية لعملائنا.</p>
	`,
	storeInfo: {
		name: "Coffee Selection",
		address: "شارع الملك فهد، حي النزهة، الرياض، المملكة العربية السعودية",
		phone: "+966 11 234 5678",
		email: "info@coffee-selection.com",
		workingHours: {
			weekdays: "الأحد - الخميس",
			weekdaysHours: "8:00 ص - 10:00 م",
			weekend: "الجمعة - السبت",
			weekendHours: "9:00 ص - 11:00 م",
		},
		location: {
			latitude: 24.7136,
			longitude: 46.6753,
		},
	},
	images: [
		{
			url: "/assets/images/store-front.jpg",
			alt: "واجهة المتجر",
			caption: "واجهة متجر Coffee Selection الرئيسي في الرياض",
		},
		{
			url: "/assets/images/coffee-roasting.jpg",
			alt: "تحميص القهوة",
			caption: "عملية تحميص القهوة في مصنعنا",
		},
		{
			url: "/assets/images/coffee-tasting.jpg",
			alt: "تذوق القهوة",
			caption: "جلسة تذوق القهوة مع خبرائنا",
		},
		{
			url: "/assets/images/team.jpg",
			alt: "فريق العمل",
			caption: "فريق Coffee Selection المحترف",
		},
	],
};

export const getAboutPageData = async (
	lang: string = "ar",
): Promise<AboutPageData> => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	// In a real implementation, this would fetch from the API
	return aboutPageData;
};
