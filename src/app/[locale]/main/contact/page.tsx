// pages/index.tsx
import React from "react";
import { ContactPage } from "../../../../components/pages";
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
		title: t("contact"),
		description: t("contact"),
	};
}

export default function ContactPageComponent() {
	// بيانات افتراضية لصفحة الاتصال
	const contactData = {
		title: "تواصل معنا",
		description: "نحن هنا لمساعدتك. تواصل معنا عبر أي من الطرق التالية:",
		contactInfo: {
			phone: "+971 50 123 4567",
			email: "info@coffee-shop.ae",
			address: "دبي، الإمارات العربية المتحدة",
			workingHours: {
				weekdays: "الأحد - الخميس",
				weekdaysHours: "9:00 ص - 6:00 م",
				weekend: "الجمعة - السبت",
				weekendHours: "10:00 ص - 4:00 م",
			},
		},
		socialMedia: {
			facebook: "https://facebook.com/coffeeshop",
			instagram: "https://instagram.com/coffeeshop",
			twitter: "https://twitter.com/coffeeshop",
		},
		form: {
			title: "أرسل لنا رسالة",
			fields: [
				{ name: "name", label: "الاسم", type: "text", required: true },
				{
					name: "email",
					label: "البريد الإلكتروني",
					type: "email",
					required: true,
				},
				{ name: "subject", label: "الموضوع", type: "text", required: true },
				{ name: "message", label: "الرسالة", type: "textarea", required: true },
			],
		},
	};

	return <ContactPage data={contactData} />;
}
