// EnhancedProductCard Helpers

import { keyframes } from "@emotion/react";

// تأثيرات جمالية للمنتجات
export const cardHoverAnimation = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.02); }
  100% { transform: translateY(-3px) scale(1.02); }
`;

export const heartBeatAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

export const shimmerEffect = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 68, 68, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 68, 68, 0.6), 0 0 30px rgba(255, 68, 68, 0.3); }
`;

/**
 * دالة تكوين رابط الصورة من خادم Odoo
 */
export const getImageUrl = (imagePath: string): string => {
	const odooUrl = "https://coffee-selection-staging-20784644.dev.odoo.com/";
	if (!imagePath) return `${odooUrl}/web/image/placeholder.png`;
	// التأكد من تنسيق مسار الصورة بشكل صحيح
	if (imagePath.startsWith("/")) {
		imagePath = imagePath.substring(1); // إزالة الشرطة المائلة الأولى إذا وجدت
	}
	return `${odooUrl}${imagePath}`;
};

/**
 * دالة معالجة إضافة المنتج للسلة
 */
export const handleAddToCart = async (
	product: any,
	onAddToCart?: (product: any) => void,
	setIsLoading?: (loading: boolean) => void,
): Promise<void> => {
	if (setIsLoading) setIsLoading(true);
	try {
		await onAddToCart?.(product);
	} finally {
		if (setIsLoading) {
			setTimeout(() => setIsLoading(false), 500);
		}
	}
};
