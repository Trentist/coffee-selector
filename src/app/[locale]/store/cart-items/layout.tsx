import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface CartItemsLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({}: CartItemsLayoutProps): Promise<Metadata> {
	const t = await getTranslations("shop");

	return {
		title: t("cart"),
		description: t("cart_description"),
	};
}

export default function CartItemsLayout({ children }: CartItemsLayoutProps) {
	return <>{children}</>;
}
