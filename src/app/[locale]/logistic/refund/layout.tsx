import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface RefundLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: RefundLayoutProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("refund"),
		description: t("refund"),
	};
}

export default function RefundLayout({ children }: RefundLayoutProps) {
	return <>{children}</>;
}
