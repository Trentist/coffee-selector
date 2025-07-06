import React from "react";
import { WholesalePage } from "../../../../components/pages";
import {
	Box,
	Spinner,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LayoutMain from "@/components/layout/layout-main";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("wholesale"),
		description: t("wholesale"),
	};
}

export default function WholesalePageComponent() {
	// بيانات افتراضية لصفحة البيع بالجملة
	const wholesaleData = {
		title: "البيع بالجملة",
		description: "نقدم خدمات البيع بالجملة للقهوة والمنتجات ذات الصلة",
		content:
			"نحن متخصصون في توريد القهوة عالية الجودة للشركات والمطاعم والمقاهي",
		features: [
			{
				title: "جودة عالية",
				description: "قهوة عالية الجودة من أفضل المزارع",
				icon: "☕",
			},
			{
				title: "أسعار تنافسية",
				description: "أسعار مناسبة للكميات الكبيرة",
				icon: "💰",
			},
			{
				title: "توصيل سريع",
				description: "خدمة توصيل سريعة وموثوقة",
				icon: "🚚",
			},
			{
				title: "دعم فني",
				description: "دعم فني متخصص لجميع احتياجاتك",
				icon: "🛠️",
			},
		],
		benefits: [
			{
				id: "1",
				title: "أسعار خاصة للكميات الكبيرة",
				description: "خصومات تصل إلى 25% للكميات الكبيرة",
				icon: "💰",
			},
			{
				id: "2",
				title: "توصيل مجاني للطلبات الكبيرة",
				description: "توصيل مجاني للطلبات فوق 100 كيلو",
				icon: "🚚",
			},
			{
				id: "3",
				title: "ضمان الجودة",
				description: "ضمان جودة المنتجات لمدة 30 يوم",
				icon: "✅",
			},
			{
				id: "4",
				title: "دعم فني متخصص",
				description: "فريق دعم فني متخصص لجميع احتياجاتك",
				icon: "🛠️",
			},
		],
		requirements: [
			{
				id: "1",
				title: "ترخيص تجاري ساري",
				description: "يجب أن يكون لديك ترخيص تجاري ساري",
				required: true,
			},
			{
				id: "2",
				title: "طلب أدنى 50 كيلو",
				description: "الحد الأدنى للطلب هو 50 كيلو",
				required: true,
			},
			{
				id: "3",
				title: "دفع مقدم 50%",
				description: "دفع 50% من قيمة الطلب مقدماً",
				required: true,
			},
			{
				id: "4",
				title: "عقد توريد سنوي",
				description: "توقيع عقد توريد سنوي",
				required: true,
			},
		],
		minimumOrder: "50 كيلو",
		discountRange: "10-25%",
		deliveryInfo: "توصيل مجاني للطلبات فوق 100 كيلو",
		contactInfo: {
			phone: "+971 50 123 4567",
			email: "wholesale@coffee-shop.ae",
			address: "دبي، الإمارات العربية المتحدة",
		},
		form: {
			title: "طلب عرض سعر",
			fields: [
				{ name: "company", label: "اسم الشركة", type: "text", required: true },
				{ name: "contact", label: "اسم المسؤول", type: "text", required: true },
				{
					name: "email",
					label: "البريد الإلكتروني",
					type: "email",
					required: true,
				},
				{ name: "phone", label: "رقم الهاتف", type: "tel", required: true },
				{
					name: "quantity",
					label: "الكمية المطلوبة",
					type: "text",
					required: true,
				},
				{
					name: "message",
					label: "تفاصيل إضافية",
					type: "textarea",
					required: false,
				},
			],
		},
	};

	return (
		<LayoutMain>
			<WholesalePage data={wholesaleData} />
		</LayoutMain>
	);
}
