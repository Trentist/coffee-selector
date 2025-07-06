import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface ContactLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: ContactLayoutProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("contact"),
		description: t("contact"),
	};
}

export default function ContactLayout({ children }: ContactLayoutProps) {
	return <>{children}</>;
}
