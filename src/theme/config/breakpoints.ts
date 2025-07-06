/**
 * نقاط التوقف للتصميم المتجاوب
 */

export const breakpoints = {
	sm: "30em",
	md: "48em",
	lg: "62em",
	xl: "80em",
	"2xl": "96em",
} as const;

export const breakpointQueries = {
	sm: "(min-width: 30em)",
	md: "(min-width: 48em)",
	lg: "(min-width: 62em)",
	xl: "(min-width: 80em)",
	"2xl": "(min-width: 96em)",
} as const;
