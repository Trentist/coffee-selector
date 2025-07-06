import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PrivacyLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: PrivacyLayoutProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("privacy"),
		description: t("privacy"),
	};
}

export default function PrivacyLayout({ children }: PrivacyLayoutProps) {
	return <>{children}</>;
}
