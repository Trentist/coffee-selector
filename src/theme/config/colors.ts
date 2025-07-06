/**
 * نظام الألوان الموحد للتطبيق
 * مبني على اللونين الأساسيين: #0D1616 و #FFFFFF
 */

export const THEME_COLORS = {
	// الألوان الأساسية
	primary: {
		main: "#0D1616",
		light: "#1A2A2A",
		dark: "#000000",
		overlay: "rgba(13, 22, 22, 0.8)",
		transparent: "rgba(13, 22, 22, 0.1)",
	},
	white: {
		main: "#FFFFFF",
		light: "#F8F9FA",
		dark: "#F5F5F5",
		overlay: "rgba(255, 255, 255, 0.8)",
		transparent: "rgba(255, 255, 255, 0.1)",
	},

	// ألوان الإشعارات والحالات
	success: {
		main: "#22C55E",
		light: "#D1FAE5",
		dark: "#10B981",
		border: "#A7F3D0",
	},
	error: {
		main: "#EF4444",
		light: "#FEE2E2",
		dark: "#DC2626",
		border: "#FCA5A5",
	},
	warning: {
		main: "#F59E0B",
		light: "#FEF3C7",
		dark: "#D97706",
		border: "#FDE68A",
	},
	info: {
		main: "#3B82F6",
		light: "#DBEAFE",
		dark: "#2563EB",
		border: "#93C5FD",
	},

	// ألوان الحالات
	disabled: "#9CA3AF",
	border: {
		main: "#E5E7EB",
		light: "#F3F4F6",
		dark: "#D1D5DB",
		focus: "#0D1616",
	},
	background: {
		main: "#FFFFFF",
		secondary: "#F8F9FA",
		card: "#F9FAFB",
		section: "#FAFAFA",
		dark: {
			main: "#0D1616",
			secondary: "#1A2A2A",
			card: "#111827",
			section: "#1F2937",
		},
	},

	// ألوان المنتجات
	product: {
		new: {
			bg: "#3B82F6",
			color: "#FFFFFF",
		},
		hot: {
			bg: "#EF4444",
			color: "#FFFFFF",
		},
		discount: {
			bg: "#22C55E",
			color: "#FFFFFF",
		},
	},

	// ألوان التقييم
	rating: {
		filled: "#FFD700",
		empty: "#D1D5DB",
	},

	// ألوان النصوص
	text: {
		primary: "#0D1616",
		secondary: "#6B7280",
		muted: "#9CA3AF",
		inverse: "#FFFFFF",
		placeholder: "#666666",
		disabled: "#9CA3AF",
	},

	// ألوان الأسعار
	price: {
		main: "#0D1616",
		secondary: "#6B7280",
		discount: "#EF4444",
	},

	// ألوان الأزرار
	button: {
		primary: {
			bg: "#0D1616",
			color: "#FFFFFF",
			border: "#0D1616",
			hover: {
				bg: "#1A2A2A",
				color: "#FFFFFF",
				border: "#1A2A2A",
			},
		},
		secondary: {
			bg: "transparent",
			color: "#0D1616",
			border: "#0D1616",
			hover: {
				bg: "#0D1616",
				color: "#FFFFFF",
				border: "#0D1616",
			},
		},
		ghost: {
			bg: "transparent",
			color: "#0D1616",
			border: "transparent",
			hover: {
				bg: "rgba(13, 22, 22, 0.1)",
				color: "#0D1616",
				border: "transparent",
			},
		},
	},

	// ألوان الحقول
	input: {
		bg: "transparent",
		border: "#0D1616",
		color: "#0D1616",
		placeholder: "#666666",
		focus: {
			border: "#0D1616",
			bg: "transparent",
		},
		hover: {
			border: "#1A2A2A",
			bg: "transparent",
		},
		disabled: {
			bg: "#F3F4F6",
			border: "#D1D5DB",
			color: "#9CA3AF",
		},
	},
} as const;

/**
 * ألوان ثابتة للاستخدام المباشر
 */
export const staticColors = {
	primary: "#0D1616",
	white: "#FFFFFF",
	success: "#22C55E",
	error: "#EF4444",
	warning: "#F59E0B",
	info: "#3B82F6",
	muted: "#6B7280",
	border: "#E5E7EB",
	background: "#F9FAFB",
	text: "#0D1616",
} as const;

export type ThemeColors = typeof THEME_COLORS;
export type StaticColors = typeof staticColors;
