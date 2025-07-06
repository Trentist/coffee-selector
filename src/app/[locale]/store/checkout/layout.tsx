import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface CheckoutLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: CheckoutLayoutProps): Promise<Metadata> {
	const t = await getTranslations("shop");

	return {
		title: t("checkout"),
		description: t("checkout_description"),
	};
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
	return <>{children}</>;
}
