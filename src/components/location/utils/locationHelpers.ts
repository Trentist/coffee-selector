/**
 * أدوات مساعدة لإدارة الموقع
 * Location Management Helpers
 */

export interface Coordinates {
	lat: number;
	lng: number;
}

/**
 * حساب المسافة بين نقطتين
 * Calculate distance between two points
 */
export const calculateDistance = (
	coord1: Coordinates,
	coord2: Coordinates,
): number => {
	const R = 6371; // نصف قطر الأرض بالكيلومترات
	const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
	const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((coord1.lat * Math.PI) / 180) *
			Math.cos((coord2.lat * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

/**
 * تنسيق العنوان
 * Format address
 */
export const formatAddress = (
	address: string,
	city: string,
	country: string,
): string => {
	return `${address}, ${city}, ${country}`;
};

/**
 * التحقق من صحة الإحداثيات
 * Validate coordinates
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
	return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * تحويل الدرجات إلى راديان
 * Convert degrees to radians
 */
export const degreesToRadians = (degrees: number): number => {
	return degrees * (Math.PI / 180);
};
