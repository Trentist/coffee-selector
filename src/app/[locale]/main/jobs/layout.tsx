import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface JobsLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: JobsLayoutProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("jobs"),
		description: t("jobs"),
	};
}

export default function JobsLayout({ children }: JobsLayoutProps) {
	return <>{children}</>;
}
