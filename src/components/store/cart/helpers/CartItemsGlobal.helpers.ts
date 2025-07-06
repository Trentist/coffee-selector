/**
 * CartItemsGlobal Component Helpers
 * دوال مساعدة لمكون السلة العامة
 */

import { CartProduct } from "../types/CartItemsGlobal.types";

/**
 * Get image URL from Odoo server
 * الحصول على رابط الصورة من خادم Odoo
 */
export const getImageUrl = (imagePath: string): string => {
	const odooUrl = "https://coffee-selection-staging-20784644.dev.odoo.com/";
	if (!imagePath) return `${odooUrl}/web/image/placeholder.png`;

	// Ensure the image path is correctly formatted
	if (imagePath.startsWith("/")) {
		imagePath = imagePath.substring(1); // Remove leading slash if present
	}
	return `${odooUrl}${imagePath}`;
};

/**
 * Share product via Web Share API or Twitter fallback
 * مشاركة المنتج عبر Web Share API أو Twitter كبديل
 */
export const handleShareProduct = (item: CartProduct): void => {
	const productUrl = `${window.location.origin}/store/product/${item.id}`;
	const shareText = `Check out this product: ${item.title} - ${productUrl}`;

	if (navigator.share) {
		// Use Web Share API if supported
		navigator
			.share({
				title: item.title,
				text: shareText,
				url: productUrl,
			})
			.then(() => console.log("Product shared successfully"))
			.catch((error) => console.log("Error sharing product", error));
	} else {
		// Fallback to Twitter if Web Share API is not supported
		console.log("Web Share API not supported, using fallback");
		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
			"_blank",
		);
	}
};

/**
 * Check if product is in favorites
 * التحقق من أن المنتج في المفضلة
 */
export const isFavorite = (id: string, favorites: any[]): boolean => {
	return favorites?.some((favItem) => favItem.id === id) || false;
};
