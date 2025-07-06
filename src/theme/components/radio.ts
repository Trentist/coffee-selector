/**
 * أنماط أزرار الراديو
 */

export const radioStyles = {
	baseStyle: {
		control: {
			borderColor: "primary.main",
			_checked: {
				bg: "primary.main",
				borderColor: "primary.main",
				color: "white.main",
			},
			_hover: {
				borderColor: "primary.light",
			},
			_focus: {
				boxShadow: "none",
			},
		},
		label: {
			fontWeight: "normal",
			color: "primary.main",
		},
	},
} as const;
