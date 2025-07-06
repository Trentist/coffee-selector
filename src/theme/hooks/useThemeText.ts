"use client";

/**
 * Hook للنصوص المتوافقة مع الثيم
 */

import { useColorModeValue } from "@chakra-ui/react";

export const useThemeText = () => {
	const textColor = useColorModeValue("primary.main", "white.main");
	const mutedColor = useColorModeValue("text.secondary", "text.muted");
	const inverseColor = useColorModeValue("white.main", "primary.main");

	return {
		textColor,
		mutedColor,
		inverseColor,
		// أنماط النصوص
		styles: {
			h1: {
				color: textColor,
				fontSize: { base: "2xl", md: "3xl", lg: "4xl" },
				fontWeight: "bold",
				lineHeight: { base: "2rem", md: "2.5rem", lg: "3rem" },
				textTransform: "uppercase",
				letterSpacing: "0.02em",
			},
			h2: {
				color: textColor,
				fontSize: { base: "xl", md: "2xl", lg: "3xl" },
				fontWeight: "semibold",
				lineHeight: { base: "1.5rem", md: "2rem", lg: "2.5rem" },
				textTransform: "uppercase",
				letterSpacing: "0.02em",
			},
			h3: {
				color: textColor,
				fontSize: { base: "lg", md: "xl", lg: "2xl" },
				fontWeight: "medium",
				lineHeight: { base: "1.25rem", md: "1.5rem", lg: "2rem" },
				textTransform: "uppercase",
				letterSpacing: "0.01em",
			},
			h4: {
				color: textColor,
				fontSize: { base: "md", md: "lg", lg: "xl" },
				fontWeight: "medium",
				lineHeight: { base: "1.25rem", md: "1.5rem", lg: "1.75rem" },
				textTransform: "uppercase",
				letterSpacing: "0.01em",
			},
			h5: {
				color: textColor,
				fontSize: { base: "sm", md: "md", lg: "lg" },
				fontWeight: "medium",
				lineHeight: { base: "1rem", md: "1.25rem", lg: "1.5rem" },
				letterSpacing: "0.01em",
			},
			h6: {
				color: textColor,
				fontSize: { base: "xs", md: "sm", lg: "md" },
				fontWeight: "medium",
				lineHeight: { base: "0.75rem", md: "1rem", lg: "1.25rem" },
				textTransform: "uppercase",
				letterSpacing: "0.01em",
			},
			paragraph: {
				color: textColor,
				fontSize: { base: "sm", md: "md", lg: "lg" },
				fontWeight: "400",
				lineHeight: { base: "1.25rem", md: "1.5rem", lg: "1.75rem" },
			},
			caption: {
				color: mutedColor,
				fontSize: { base: "xs", md: "sm", lg: "md" },
				fontWeight: "200",
				fontStyle: "italic",
				lineHeight: { base: "0.75rem", md: "1rem", lg: "1.25rem" },
			},
			label: {
				color: textColor,
				fontSize: { base: "xs", md: "sm", lg: "md" },
				fontWeight: "500",
				textTransform: "uppercase",
				letterSpacing: "0.01em",
			},
		},
	};
};
