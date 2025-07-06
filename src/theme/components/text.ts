/**
 * أنماط النصوص الموحدة
 */

export const textStyles = {
	baseStyle: {
		transition: "color 0.2s ease-in-out",
	},
	variants: {
		primary: {
			color: "primary.main",
		},
		secondary: {
			color: "text.secondary",
		},
		muted: {
			color: "text.muted",
		},
		inverse: {
			color: "white.main",
		},
		success: {
			color: "success.main",
		},
		error: {
			color: "error.main",
		},
		warning: {
			color: "warning.main",
		},
		info: {
			color: "info.main",
		},
		disabled: {
			color: "text.disabled",
		},
	},
} as const;

export const headingStyles = {
	baseStyle: {
		transition: "color 0.2s ease-in-out",
	},
	variants: {
		primary: {
			color: "primary.main",
		},
		secondary: {
			color: "text.secondary",
		},
		inverse: {
			color: "white.main",
		},
		success: {
			color: "success.main",
		},
		error: {
			color: "error.main",
		},
		warning: {
			color: "warning.main",
		},
		info: {
			color: "info.main",
		},
	},
} as const;
