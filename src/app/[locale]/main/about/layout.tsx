import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface AboutLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: AboutLayoutProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("about"),
		description: t("about"),
	};
}

export default function AboutLayout({ children }: AboutLayoutProps) {
	return <>{children}</>;
}
