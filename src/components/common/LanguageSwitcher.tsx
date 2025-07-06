"use client";

/**
 * Language Switcher Component
 * مكون تبديل اللغة
 */

import React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
} from "@chakra-ui/react";
import { FiGlobe, FiCheck } from "react-icons/fi";
import { locales } from "../../i18n/config";

interface LanguageSwitcherProps {
	variant?: "button" | "menu";
	size?: "sm" | "md" | "lg";
	colorScheme?: string;
}

export default function LanguageSwitcher({
	variant = "menu",
	size = "md",
	colorScheme = "blue",
}: LanguageSwitcherProps) {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	/**
	 * Switch to a new language
	 */
	const switchLanguage = (newLocale: string) => {
		// Remove current locale from pathname
		const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

		// Navigate to new locale path
		const newPath = `/${newLocale}${pathWithoutLocale}`;
		router.push(newPath);
	};

	/**
	 * Get language display name
	 */
	const getLanguageName = (code: string): string => {
		const languageNames: Record<string, string> = {
			ar: "العربية",
			en: "English",
		};
		return languageNames[code] || code;
	};

	/**
	 * Get language flag emoji
	 */
	const getLanguageFlag = (code: string): string => {
		const flags: Record<string, string> = {
			ar: "🇦🇪",
			en: "🇺🇸",
		};
		return flags[code] || "🌐";
	};

	// Button variant
	if (variant === "button") {
		return (
			<Menu>
				<MenuButton
					as={Button}
					size={size}
					colorScheme={colorScheme}
					variant="outline"
					leftIcon={<Icon as={FiGlobe} />}>
					{getLanguageFlag(locale)} {getLanguageName(locale)}
				</MenuButton>
				<MenuList>
					{locales.map((lang) => (
						<MenuItem
							key={lang}
							onClick={() => switchLanguage(lang)}
							icon={locale === lang ? <Icon as={FiCheck} /> : undefined}
							iconSpacing={2}>
							{getLanguageFlag(lang)} {getLanguageName(lang)}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		);
	}

	// Menu variant (default)
	return (
		<Menu>
			<MenuButton
				as={Button}
				size={size}
				variant="ghost"
				colorScheme={colorScheme}
				aria-label="Switch language">
				<Icon as={FiGlobe} boxSize={5} />
			</MenuButton>
			<MenuList>
				{locales.map((lang) => (
					<MenuItem
						key={lang}
						onClick={() => switchLanguage(lang)}
						icon={locale === lang ? <Icon as={FiCheck} /> : undefined}
						iconSpacing={2}>
						{getLanguageFlag(lang)} {getLanguageName(lang)}
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
}
