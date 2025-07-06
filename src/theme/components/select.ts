/**
 * أنماط القوائم المنسدلة
 * حدود سفلية فقط مع تغييرات في الألوان حسب الحالة
 */

export const selectStyles = {
	baseStyle: {
		field: {
			borderRadius: "0",
			border: "none",
			borderBottom: "0.5px solid",
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
		},
		icon: {
			color: "text.secondary",
		},
	},
	variants: {
		// النوع الأساسي: حدود سفلية فقط
		flushed: {
			field: {
				borderBottom: "0.5px solid",
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
			},
		},
		// النوع البديل: حدود كاملة
		outline: {
			field: {
				border: "0.5px solid",
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
			},
		},
		// النوع المملوء
		filled: {
			field: {
				bg: "background.secondary",
				borderBottom: "0.5px solid",
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
	},
} as const;
