import LayoutMain from "@/components/layout/layout-main";
import AboutPagesDetails from "@/components/pages-details/main-pages/about-page";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import React from "react";

interface AboutPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	// params,
}: AboutPageProps): Promise<Metadata> {
	const t = await getTranslations("common");

	return {
		title: t("about"),
		description: t("about"),
	};
}

export default async function AboutPage({ params }: AboutPageProps) {
	// const t = await getTranslations("common");

	return (
		<LayoutMain>
			<AboutPagesDetails />
		</LayoutMain>
	);
}
