"use client";
/**
 * Hook للحصول على الألوان المتوافقة مع الثيم
 */

import { useColorModeValue } from "@chakra-ui/react";
import { THEME_COLORS } from "../config/colors";

export const useThemeColors = () => {
	// الألوان الأساسية
	const bgColor = useColorModeValue(THEME_COLORS.white.main, THEME_COLORS.primary.main);
	const textColor = useColorModeValue(THEME_COLORS.primary.main, THEME_COLORS.white.main);
	const borderColor = useColorModeValue(THEME_COLORS.border.main, THEME_COLORS.primary.light);
	const accentColor = useColorModeValue(THEME_COLORS.primary.main, THEME_COLORS.white.main);

	// ألوان الخلفيات
	const secondaryBgColor = useColorModeValue(
		THEME_COLORS.background.secondary,
		THEME_COLORS.background.dark.secondary,
	);
	const cardBg = useColorModeValue(THEME_COLORS.background.card, THEME_COLORS.background.dark.card);
	const sectionBg = useColorModeValue(
		THEME_COLORS.background.section,
		THEME_COLORS.background.dark.section,
	);

	// ألوان النصوص
	const mutedColor = useColorModeValue(THEME_COLORS.text.secondary, THEME_COLORS.text.muted);
	const placeholderColor = useColorModeValue(THEME_COLORS.text.placeholder, THEME_COLORS.text.disabled);

	// ألوان التفاعل
	const focusBorderColor = useColorModeValue(THEME_COLORS.border.focus, THEME_COLORS.white.main);
	const hoverBg = useColorModeValue(THEME_COLORS.background.secondary, THEME_COLORS.background.dark.secondary);
	const hoverBorder = useColorModeValue(THEME_COLORS.primary.light, THEME_COLORS.white.light);

	// ألوان الأزرار
	const buttonBg = useColorModeValue(THEME_COLORS.button.primary.bg, THEME_COLORS.white.main);
	const buttonColor = useColorModeValue(THEME_COLORS.button.primary.color, THEME_COLORS.primary.main);
	const buttonHoverBg = useColorModeValue(THEME_COLORS.button.primary.hover.bg, THEME_COLORS.primary.light);

	// ألوان الأسعار
	const priceColor = useColorModeValue(THEME_COLORS.price.main, THEME_COLORS.white.main);
	const priceSecondary = useColorModeValue(THEME_COLORS.price.secondary, THEME_COLORS.text.muted);
	const priceDiscount = useColorModeValue(THEME_COLORS.price.discount, THEME_COLORS.error.main);

	return {
		// الألوان الأساسية
		bgColor,
		textColor,
		borderColor,
		accentColor,
		secondaryBgColor,
		mutedColor,
		cardBg,
		focusBorderColor,
		buttonBg,
		buttonColor,
		priceColor,
		sectionBg,
		placeholderColor,
		hoverBg,
		hoverBorder,
		buttonHoverBg,
		priceSecondary,
		priceDiscount,

		// ألوان الحالة
		success: {
			bg: THEME_COLORS.success.main,
			color: THEME_COLORS.white.main,
			border: THEME_COLORS.success.border,
			light: THEME_COLORS.success.light,
		},
		error: {
			bg: THEME_COLORS.error.main,
			color: THEME_COLORS.white.main,
			border: THEME_COLORS.error.border,
			light: THEME_COLORS.error.light,
		},
		warning: {
			bg: THEME_COLORS.warning.main,
			color: THEME_COLORS.white.main,
			border: THEME_COLORS.warning.border,
			light: THEME_COLORS.warning.light,
		},
		info: {
			bg: THEME_COLORS.info.main,
			color: THEME_COLORS.white.main,
			border: THEME_COLORS.info.border,
			light: THEME_COLORS.info.light,
		},

		// ألوان المنتجات
		product: {
			new: {
				bg: THEME_COLORS.product.new.bg,
				color: THEME_COLORS.product.new.color,
			},
			hot: {
				bg: THEME_COLORS.product.hot.bg,
				color: THEME_COLORS.product.hot.color,
			},
			discount: {
				bg: THEME_COLORS.product.discount.bg,
				color: THEME_COLORS.product.discount.color,
			},
		},

		// ألوان التقييم
		rating: {
			filled: THEME_COLORS.rating.filled,
			empty: THEME_COLORS.rating.empty,
		},

		// ألوان الأزرار
		button: {
			primary: {
				bg: THEME_COLORS.button.primary.bg,
				color: THEME_COLORS.button.primary.color,
				border: THEME_COLORS.button.primary.border,
				hover: {
					bg: THEME_COLORS.button.primary.hover.bg,
					color: THEME_COLORS.button.primary.hover.color,
					border: THEME_COLORS.button.primary.hover.border,
				},
			},
			secondary: {
				bg: THEME_COLORS.button.secondary.bg,
				color: THEME_COLORS.button.secondary.color,
				border: THEME_COLORS.button.secondary.border,
				hover: {
					bg: THEME_COLORS.button.secondary.hover.bg,
					color: THEME_COLORS.button.secondary.hover.color,
					border: THEME_COLORS.button.secondary.hover.border,
				},
			},
			ghost: {
				bg: THEME_COLORS.button.ghost.bg,
				color: THEME_COLORS.button.ghost.color,
				border: THEME_COLORS.button.ghost.border,
				hover: {
					bg: THEME_COLORS.button.ghost.hover.bg,
					color: THEME_COLORS.button.ghost.hover.color,
					border: THEME_COLORS.button.ghost.hover.border,
				},
			},
		},

		// ألوان الحقول
		input: {
			bg: THEME_COLORS.input.bg,
			border: THEME_COLORS.input.border,
			color: THEME_COLORS.input.color,
			placeholder: THEME_COLORS.input.placeholder,
			focus: {
				border: THEME_COLORS.input.focus.border,
				bg: THEME_COLORS.input.focus.bg,
			},
			hover: {
				border: THEME_COLORS.input.hover.border,
				bg: THEME_COLORS.input.hover.bg,
			},
			disabled: {
				bg: THEME_COLORS.input.disabled.bg,
				border: THEME_COLORS.input.disabled.border,
				color: THEME_COLORS.input.disabled.color,
			},
		},

		// ألوان إضافية للاستخدام المباشر
		white: THEME_COLORS.white.main,
		black: THEME_COLORS.primary.main,
		disabled: THEME_COLORS.disabled,
	};
};

/**
 * Hook للحصول على ألوان الثيم حسب الوضع
 */
export const getThemeColors = (isDark: boolean) => ({
	// ألوان النصوص
	text: {
		primary: isDark ? THEME_COLORS.white.main : THEME_COLORS.primary.main,
		secondary: isDark ? THEME_COLORS.white.light : THEME_COLORS.primary.light,
		muted: isDark ? THEME_COLORS.text.disabled : THEME_COLORS.text.muted,
		inverse: isDark ? THEME_COLORS.primary.main : THEME_COLORS.white.main,
	},

	// ألوان الخلفيات
	background: {
		primary: isDark ? THEME_COLORS.primary.main : THEME_COLORS.white.main,
		secondary: isDark ? THEME_COLORS.primary.light : THEME_COLORS.white.light,
		overlay: isDark ? THEME_COLORS.primary.overlay : THEME_COLORS.white.overlay,
	},

	// ألوان الحدود
	border: {
		primary: isDark ? THEME_COLORS.primary.light : THEME_COLORS.border.main,
		secondary: isDark ? THEME_COLORS.primary.dark : THEME_COLORS.border.light,
	},

	// ألوان الإشعارات
	notifications: {
		success: THEME_COLORS.success.main,
		error: THEME_COLORS.error.main,
		warning: THEME_COLORS.warning.main,
		info: THEME_COLORS.info.main,
	},
});
