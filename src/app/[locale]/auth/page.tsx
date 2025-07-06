"use client";
import { AuthContainer } from "@/components/auth-system";
import { getTranslations } from "next-intl/server";

interface AuthPageProps {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ form?: string; redirect?: string }>;
}

export default async function AuthPage({ params, searchParams }: AuthPageProps) {
	const { locale } = await params;
	const { form, redirect } = await searchParams;
	const t = await getTranslations("auth");

	// Determine initial form type based on search params
	const initialFormType = form as "login" | "register" | "forgot-password" | "reset-password" || "login";

	return (
		<AuthContainer
			initialFormType={initialFormType}
			redirectTo={redirect || "/dashboard"}
			title={t("welcome_title")}
			subtitle={t("welcome_subtitle")}
			image="/assets/images/auth-bg.jpg"
		/>
	);
}
