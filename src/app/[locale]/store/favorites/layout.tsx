import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface FavoritesLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({

}: FavoritesLayoutProps): Promise<Metadata> {
	const t = await getTranslations("shop");

	return {
		title: t("favorites"),
		description: t("favorites_description"),
	};
}

export default function FavoritesLayout({ children }: FavoritesLayoutProps) {
	return <>{children}</>;
}
