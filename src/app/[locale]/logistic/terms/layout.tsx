import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface TermsLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: TermsLayoutProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("terms"),
		description: t("terms"),
	};
}

export default function TermsLayout({ children }: TermsLayoutProps) {
	return <>{children}</>;
}
