import { WholesalePageData } from "../../odoo-schema-full/services/pages.service";

// Mock data for wholesale page
const wholesalePageData: WholesalePageData = {
	title: "البيع بالجملة",
	description:
		"شركاء موثوقون في عالم القهوة. نقدم أفضل الأسعار والخدمات للعملاء التجاريين",
	content: `
		<p>نحن في Coffee Selection نفخر بكوننا الشريك الموثوق للعديد من المقاهي والمطاعم والفنادق في المملكة العربية السعودية.</p>
		<p>نقدم خدمات البيع بالجملة مع ضمان الجودة العالية والأسعار التنافسية والتوصيل السريع.</p>
		<p>فريقنا من الخبراء متاح دائماً لتقديم الاستشارات ومساعدتك في اختيار أفضل المنتجات لاحتياجاتك التجارية.</p>
	`,
	benefits: [
		{
			id: "1",
			title: "أسعار تنافسية",
			description:
				"نقدم أفضل الأسعار للعملاء التجاريين مع خصومات خاصة على الطلبات الكبيرة",
			icon: "percent",
		},
		{
			id: "2",
			title: "جودة مضمونة",
			description:
				"جميع منتجاتنا تخضع لمراقبة الجودة الصارمة لضمان أفضل النتائج",
			icon: "handshake",
		},
		{
			id: "3",
			title: "توصيل سريع",
			description:
				"خدمة توصيل سريعة وموثوقة لجميع أنحاء المملكة مع تتبع الشحنات",
			icon: "truck",
		},
		{
			id: "4",
			title: "دعم فني",
			description: "فريق دعم فني متخصص لمساعدتك في اختيار المنتجات المناسبة",
			icon: "users",
		},
		{
			id: "5",
			title: "مرونة في الطلبات",
			description: "نوفر مرونة في أحجام الطلبات والتعبئة حسب احتياجاتك",
			icon: "industry",
		},
		{
			id: "6",
			title: "برامج الولاء",
			description: "برامج ولاء خاصة للعملاء التجاريين مع مزايا إضافية",
			icon: "handshake",
		},
	],
	requirements: [
		{
			id: "1",
			title: "سجل تجاري ساري",
			description:
				"يجب أن يكون لديك سجل تجاري ساري المفعول في المملكة العربية السعودية",
			required: true,
		},
		{
			id: "2",
			title: "حد أدنى للطلب",
			description: "الحد الأدنى للطلب هو 50 كيلو جرام من أي منتج",
			required: true,
		},
		{
			id: "3",
			title: "دفع مقدم",
			description: "مطلوب دفع 50% من قيمة الطلب مقدماً والباقي عند الاستلام",
			required: true,
		},
		{
			id: "4",
			title: "عقد توريد",
			description: "توقيع عقد توريد سنوي للطلبات المنتظمة",
			required: false,
		},
		{
			id: "5",
			title: "شهادة صحية",
			description: "شهادة صحية سارية للمؤسسة الغذائية",
			required: true,
		},
		{
			id: "6",
			title: "تأمين على البضاعة",
			description: "إمكانية توفير تأمين على البضاعة أثناء النقل",
			required: false,
		},
	],
	contactInfo: {
		email: "wholesale@coffee-selection.com",
		phone: "+966 11 234 5679",
		whatsapp: "+966 50 123 4568",
	},
	minimumOrder: "50 كيلو جرام",
	discountRange: "10% - 25% حسب حجم الطلب",
	deliveryInfo: "توصيل مجاني للطلبات فوق 200 كيلو جرام",
};

export const getWholesalePageData = async (
	lang: string = "ar",
): Promise<WholesalePageData> => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	// In a real implementation, this would fetch from the API
	return wholesalePageData;
};
