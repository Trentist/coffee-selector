/**
 * أنماط التنبيهات
 */

export const alertStyles = {
	baseStyle: {
		container: {
			borderRadius: "0",
			border: "0.5px solid",
		},
		title: {
			fontWeight: "semibold",
		},
		description: {
			opacity: 0.8,
		},
		icon: {
			flexShrink: 0,
		},
	},
	variants: {
		solid: {
			container: {
				borderRadius: "0",
				border: "0.5px solid",
			},
		},
		left: {
			container: {
				borderRadius: "0",
				border: "0.5px solid",
			},
		},
		subtle: {
			container: {
				borderRadius: "0",
				border: "0.5px solid",
			},
		},
		top: {
			container: {
				borderRadius: "0",
				border: "0.5px solid",
			},
		},
	},
	defaultProps: {
		variant: "subtle",
	},
} as const;
