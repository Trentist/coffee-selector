/**
 * أدوات مساعدة للثيم
 */

import { THEME_COLORS } from "../config/colors";

/**
 * تحويل اللون إلى قيمة متوافقة مع الثيم
 */
export const getThemeColor = (
	color: string,
	isDark: boolean = false,
): string => {
	// البحث في ألوان الثيم
	const themeColor = THEME_COLORS[color as keyof typeof THEME_COLORS];
	if (themeColor) {
		return typeof themeColor === "string" ? themeColor : themeColor.primary;
	}

	// إذا كان اللون مباشر، إرجاعه كما هو
	return color;
};

/**
 * الحصول على لون النص المناسب حسب لون الخلفية
 */
export const getContrastTextColor = (backgroundColor: string): string => {
	// تحويل اللون إلى RGB
	const hex = backgroundColor.replace("#", "");
	const r = parseInt(hex.substr(0, 2), 16);
	const g = parseInt(hex.substr(2, 2), 16);
	const b = parseInt(hex.substr(4, 2), 16);

	// حساب السطوع
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	// إرجاع لون النص المناسب
	return brightness > 128 ? "#0D1616" : "#FFFFFF";
};

/**
 * إنشاء تدرج لوني
 */
export const createGradient = (
	startColor: string,
	endColor: string,
	direction: string = "to right",
): string => {
	return `linear-gradient(${direction}, ${startColor}, ${endColor})`;
};

/**
 * تحويل اللون إلى شفاف
 */
export const withOpacity = (color: string, opacity: number): string => {
	// إذا كان اللون hex
	if (color.startsWith("#")) {
		const hex = color.replace("#", "");
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	// إذا كان اللون rgb
	if (color.startsWith("rgb(")) {
		return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
	}

	return color;
};

/**
 * الحصول على ألوان الثيم حسب الوضع
 */
export const getThemeModeColors = (isDark: boolean) => ({
	background: isDark ? THEME_COLORS?.black?.main : THEME_COLORS?.white?.main,
	text: isDark ? THEME_COLORS?.white?.main : THEME_COLORS?.black?.main,
	border: isDark ? THEME_COLORS?.black?.light : THEME_COLORS?.border?.main,
});
