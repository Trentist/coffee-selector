/**
 * أنماط الأزرار الموحدة
 * يدعم نوعين من الحدود: كاملة أو سفلية فقط
 */

export const buttonStyles = {
	baseStyle: {
		borderRadius: "0",
		fontWeight: "500",
		textTransform: "uppercase",
		transition: "all 0.2s ease-in-out",
		_focus: {
			boxShadow: "none",
		},
	},
	variants: {
		// النوع الأول: حدود كاملة
		solid: {
			border: "0.5px solid",
			borderColor: "primary.main",
			bg: "primary.main",
			color: "white.main",
			_hover: {
				bg: "primary.light",
				borderColor: "primary.light",
				transform: "translateY(-1px)",
			},
			_active: {
				bg: "primary.dark",
				borderColor: "primary.dark",
				transform: "translateY(0)",
			},
		},
		outline: {
			border: "0.5px solid",
			borderColor: "primary.main",
			color: "primary.main",
			bg: "transparent",
			_hover: {
				bg: "primary.main",
				color: "white.main",
				borderColor: "primary.main",
			},
			_active: {
				bg: "primary.dark",
				color: "white.main",
				borderColor: "primary.dark",
			},
		},
		ghost: {
			border: "0.5px solid",
			borderColor: "transparent",
			color: "primary.main",
			bg: "transparent",
			_hover: {
				bg: "primary.transparent",
				borderColor: "primary.main",
			},
			_active: {
				bg: "primary.transparent",
				borderColor: "primary.dark",
			},
		},

		// النوع الثاني: حدود سفلية فقط
		bottomBorder: {
			border: "none",
			borderBottom: "0.5px solid",
			borderColor: "primary.main",
			color: "primary.main",
			bg: "transparent",
			_hover: {
				bg: "primary.transparent",
				borderBottomColor: "primary.light",
			},
			_active: {
				bg: "primary.transparent",
				borderBottomColor: "primary.dark",
			},
		},
		bottomBorderFilled: {
			border: "none",
			borderBottom: "0.5px solid",
			borderColor: "primary.main",
			bg: "primary.main",
			color: "white.main",
			_hover: {
				bg: "primary.light",
				borderBottomColor: "primary.light",
			},
			_active: {
				bg: "primary.dark",
				borderBottomColor: "primary.dark",
			},
		},

		// أزرار الحالات
		success: {
			border: "0.5px solid",
			borderColor: "success.main",
			bg: "success.main",
			color: "white.main",
			_hover: {
				bg: "success.dark",
				borderColor: "success.dark",
			},
		},
		error: {
			border: "0.5px solid",
			borderColor: "error.main",
			bg: "error.main",
			color: "white.main",
			_hover: {
				bg: "error.dark",
				borderColor: "error.dark",
			},
		},
		warning: {
			border: "0.5px solid",
			borderColor: "warning.main",
			bg: "warning.main",
			color: "white.main",
			_hover: {
				bg: "warning.dark",
				borderColor: "warning.dark",
			},
		},
		info: {
			border: "0.5px solid",
			borderColor: "info.main",
			bg: "info.main",
			color: "white.main",
			_hover: {
				bg: "info.dark",
				borderColor: "info.dark",
			},
		},
	},
	sizes: {
		xs: {
			h: "5",
			minW: "6",
			fontSize: "xs",
			px: "2",
		},
		sm: {
			h: "7",
			minW: "8",
			fontSize: "sm",
			px: "3",
		},
		md: {
			h: "8",
			minW: "10",
			fontSize: "md",
			px: "4",
		},
		lg: {
			h: "10",
			minW: "12",
			fontSize: "lg",
			px: "6",
		},
		xl: {
			h: "12",
			minW: "14",
			fontSize: "xl",
			px: "8",
		},
	},
	defaultProps: {
		variant: "solid",
		size: "md",
	},
} as const;
