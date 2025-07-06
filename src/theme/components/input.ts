/**
 * أنماط الحقول الموحدة
 * جميع الحقول تكون flushed مع تغييرات في الألوان حسب الحالة
 */

export const inputStyles = {
	baseStyle: {
		borderRadius: "0",
		border: "none",
		borderBottom: "0.2px solid",
		borderColor: "input.border",
		bg: "input.bg",
		color: "input.color",
		transition: "all 0.2s ease-in-out",
		_focus: {
			borderBottomColor: "input.focus.border",
			bg: "input.focus.bg",
			boxShadow: "none",
		},
		_hover: {
			borderBottomColor: "input.hover.border",
			bg: "input.hover.bg",
		},
		_placeholder: {
			color: "input.placeholder",
		},
		_autofill: {
			bg: "white.main !important",
			color: "primary.main !important",
			WebkitBoxShadow: "none",
			WebkitTextFillColor: "primary.main !important",
		},
		_disabled: {
			bg: "input.disabled.bg",
			borderBottomColor: "input.disabled.border",
			color: "input.disabled.color",
			opacity: 0.6,
		},
	},
	variants: {
		// النوع الأساسي: حدود سفلية فقط
		flushed: {
			field: {
				borderBottom: "0.2px solid",
				borderColor: "input.border",
				borderRadius: "0",
				bg: "transparent",
				_hover: {
					borderBottomColor: "input.hover.border",
					bg: "transparent",
				},
				_focus: {
					borderBottomColor: "input.focus.border",
					bg: "transparent",
					boxShadow: "none",
				},
				_placeholder: {
					color: "input.placeholder",
				},
			},
		},
		// النوع البديل: حدود كاملة
		outline: {
			field: {
				border: "0.2px solid",
				borderColor: "input.border",
				borderRadius: "0",
				bg: "transparent",
				_hover: {
					borderColor: "input.hover.border",
					bg: "transparent",
				},
				_focus: {
					borderColor: "input.focus.border",
					bg: "transparent",
					boxShadow: "none",
				},
				_placeholder: {
					color: "input.placeholder",
				},
			},
		},
		// النوع المملوء
		filled: {
			field: {
				bg: "background.secondary",
				borderBottom: "0.2px solid",
				borderColor: "transparent",
				borderRadius: "0",
				_hover: {
					bg: "background.card",
					borderBottomColor: "input.hover.border",
				},
				_focus: {
					bg: "background.card",
					borderBottomColor: "input.focus.border",
				},
				_placeholder: {
					color: "input.placeholder",
				},
			},
		},
	},
	sizes: {
		xs: {
			field: {
				fontSize: "xs",
				px: "2",
				h: "3",
				borderRadius: "0",
			},
		},
		sm: {
			field: {
				fontSize: "sm",
				px: "3",
				h: "5",
				borderRadius: "0",
			},
		},
		md: {
			field: {
				fontSize: "md",
				px: "3",
				h: "7",
				borderRadius: "0",
			},
		},
		lg: {
			field: {
				fontSize: "lg",
				px: "4",
				h: "9",
				borderRadius: "0",
			},
		},
	},
	defaultProps: {
		variant: "flushed",
		size: "md",
		borderRadius: "0",
	},
} as const;
