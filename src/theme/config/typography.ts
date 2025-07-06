/**
 * نظام الخطوط والأنماط النصية
 */

export const fonts = {
	body: "shaheen arabic IT Regular, sans-serif",
	heading: "shaheen arabic IT Regular, sans-serif",
	mono: "shaheen arabic IT Regular",
} as const;

export const fontSizes = {
	xs: "0.75rem",
	sm: "0.875rem",
	md: "1rem",
	lg: "1.125rem",
	xl: "1.25rem",
	"2xl": "1.5rem",
	"3xl": "1.875rem",
	"4xl": "2.25rem",
	"5xl": "3rem",
	"6xl": "3.75rem",
	"7xl": "4.5rem",
	"8xl": "6rem",
	"9xl": "8rem",
} as const;

export const fontWeights = {
	hairline: 100,
	thin: 200,
	light: 300,
	normal: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
	black: 900,
} as const;

export const lineHeights = {
	normal: "normal",
	none: 1,
	shorter: 1.25,
	short: 1.375,
	base: 1.5,
	tall: 1.625,
	taller: "2",
	"3": ".75rem",
	"4": "1rem",
	"5": "1.25rem",
	"6": "1.5rem",
	"7": "1.75rem",
	"8": "2rem",
	"9": "2.25rem",
	"10": "2.5rem",
} as const;

export const letterSpacings = {
	tighter: "-0.05em",
	tight: "-0.025em",
	normal: "0",
	wide: "0.025em",
	wider: "0.05em",
	widest: "0.1em",
} as const;

/**
 * أنماط النصوص المخصصة
 */
export const textStyles = {
	h1: {
		fontSize: { base: "2xl", md: "3xl", lg: "4xl" },
		fontWeight: "bold",
		lineHeight: { base: "2rem", md: "2.5rem", lg: "3rem" },
		textTransform: "uppercase",
		letterSpacing: "0.02em",
	},
	h2: {
		fontSize: { base: "xl", md: "2xl", lg: "3xl" },
		fontWeight: "semibold",
		lineHeight: { base: "1.5rem", md: "2rem", lg: "2.5rem" },
		textTransform: "uppercase",
		letterSpacing: "0.02em",
	},
	h3: {
		fontSize: { base: "lg", md: "xl", lg: "2xl" },
		fontWeight: "medium",
		lineHeight: { base: "1.25rem", md: "1.5rem", lg: "2rem" },
		textTransform: "uppercase",
		letterSpacing: "0.01em",
	},
	h4: {
		fontSize: { base: "md", md: "lg", lg: "xl" },
		fontWeight: "medium",
		lineHeight: { base: "1.25rem", md: "1.5rem", lg: "1.75rem" },
		textTransform: "uppercase",
		letterSpacing: "0.01em",
	},
	h5: {
		fontSize: { base: "sm", md: "md", lg: "lg" },
		fontWeight: "medium",
		lineHeight: { base: "1rem", md: "1.25rem", lg: "1.5rem" },
		letterSpacing: "0.01em",
	},
	h6: {
		fontSize: { base: "xs", md: "sm", lg: "md" },
		fontWeight: "medium",
		lineHeight: { base: "0.75rem", md: "1rem", lg: "1.25rem" },
		textTransform: "uppercase",
		letterSpacing: "0.01em",
	},
	heading: {
		fontSize: { base: "xl", md: "2xl", lg: "3xl" },
		fontWeight: "600",
		lineHeight: { base: "1.5rem", md: "2rem", lg: "2.5rem" },
		textTransform: "uppercase",
		letterSpacing: "0.01em",
	},
	title: {
		fontSize: { base: "sm", md: "md", lg: "lg" },
		fontWeight: "500",
		lineHeight: { base: "1rem", md: "1.25rem", lg: "1.5rem" },
		textTransform: "uppercase",
		letterSpacing: "0.01em",
	},
	paragraph: {
		fontSize: { base: "sm", md: "md", lg: "lg" },
		fontWeight: "400",
		lineHeight: { base: "1.25rem", md: "1.5rem", lg: "1.75rem" },
	},
	link: {
		fontSize: { base: "sm", md: "md", lg: "lg" },
		fontWeight: "500",
		lineHeight: { base: "1.25rem", md: "1.5rem", lg: "1.75rem" },
		textTransform: "uppercase",
		textDecoration: "underline",
	},
	icon: {
		fontSize: { base: "sm", md: "md", lg: "lg" },
		fontWeight: "400",
		lineHeight: { base: "1.25rem", md: "1.5rem", lg: "1.75rem" },
		textTransform: "uppercase",
	},
	subtext: {
		fontSize: { base: "xs", md: "sm", lg: "md" },
		fontWeight: "400",
		lineHeight: { base: "1rem", md: "1.25rem", lg: "1.5rem" },
	},
	caption: {
		fontSize: { base: "xs", md: "sm", lg: "md" },
		fontWeight: "200",
		fontStyle: "italic",
		lineHeight: { base: "0.75rem", md: "1rem", lg: "1.25rem" },
	},
	label: {
		fontSize: { base: "xs", md: "sm", lg: "md" },
		fontWeight: "500",
		textTransform: "uppercase",
		letterSpacing: "0.01em",
	},
} as const;
