import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface WholesaleLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: WholesaleLayoutProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("wholesale"),
		description: t("wholesale"),
	};
}

export default function WholesaleLayout({ children }: WholesaleLayoutProps) {
	return <>{children}</>;
}
