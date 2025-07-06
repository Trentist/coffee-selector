import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface ShopLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({

}: ShopLayoutProps): Promise<Metadata> {
	const t = await getTranslations("shop");

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default function ShopLayout({ children }: ShopLayoutProps) {
	return <>{children}</>;
}
