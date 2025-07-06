/**
 * CartItems Component Helpers
 * دوال مساعدة لمكون عناصر السلة
 */

import { useRouter } from "next/navigation";

/**
 * Navigate to product page
 * الانتقال لصفحة المنتج
 */
export const navigateToProduct = (router: any, link?: string) => {
	if (link) {
		router.push(link);
	}
};

/**
 * Navigate to category page
 * الانتقال لصفحة الفئة
 */
export const navigateToCategory = (router: any, categoryLink?: string) => {
	if (categoryLink) {
		router.push(categoryLink);
	}
};

/**
 * Check if current page is order page
 * التحقق من أن الصفحة الحالية هي صفحة الطلب
 */
export const isOrderPage = (pathname: string): boolean => {
	return pathname === "/ecommerce/order";
};

/**
 * Check if current page is dashboard purchases page
 * التحقق من أن الصفحة الحالية هي صفحة المشتريات في لوحة التحكم
 */
export const isDashboardPurchasesPage = (pathname: string): boolean => {
	return pathname === "/dashboard/purchases";
};

/**
 * Format price with currency
 * تنسيق السعر مع العملة
 */
export const formatPrice = (price: number): string => {
	return `${price.toFixed(2)} AED`;
};
