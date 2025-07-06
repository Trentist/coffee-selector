/**
 * Offers Banner Helpers
 * Utility functions for the offers and promotions system
 */

import { OfferItem } from "../types/OffersBanner.types";

/**
 * Get image URL with fallback
 */
export const getOfferImageUrl = (imagePath: string): string => {
	if (!imagePath) return "/placeholder-offer.jpg";
	if (imagePath.startsWith("http")) return imagePath;
	return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
};

/**
 * Check if offer is still valid
 */
export const isOfferValid = (offer: OfferItem): boolean => {
	if (!offer.validUntil) return true;

	const now = new Date();
	const validUntil = new Date(offer.validUntil);

	return now <= validUntil;
};

/**
 * Format discount percentage
 */
export const formatDiscount = (discount: number): string => {
	return `${discount}%`;
};

/**
 * Sort offers by priority
 */
export const sortOffersByPriority = (offers: OfferItem[]): OfferItem[] => {
	return [...offers].sort((a, b) => {
		const priorityA = a.priority || 0;
		const priorityB = b.priority || 0;
		return priorityB - priorityA; // Higher priority first
	});
};

/**
 * Filter valid offers
 */
export const getValidOffers = (offers: OfferItem[]): OfferItem[] => {
	return offers.filter(isOfferValid);
};

/**
 * Get next slide index
 */
export const getNextSlideIndex = (
	currentIndex: number,
	totalSlides: number,
): number => {
	return (currentIndex + 1) % totalSlides;
};

/**
 * Get previous slide index
 */
export const getPrevSlideIndex = (
	currentIndex: number,
	totalSlides: number,
): number => {
	return currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
};

/**
 * Calculate time remaining for offer
 */
export const getTimeRemaining = (validUntil: string): string => {
	const now = new Date();
	const end = new Date(validUntil);
	const diff = end.getTime() - now.getTime();

	if (diff <= 0) return "انتهت الصلاحية";

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

	if (days > 0) return `${days} يوم`;
	if (hours > 0) return `${hours} ساعة`;
	return `${minutes} دقيقة`;
};

/**
 * Generate default offers for demo
 */
export const generateDefaultOffers = (): OfferItem[] => {
	return [
		{
			id: "1",
			title: "عرض خاص على القهوة العربية",
			description: "خصم 20% على جميع أنواع القهوة العربية",
			image: "/slid/1.svg",
			alt: "عرض القهوة العربية",
			discount: 20,
			priority: 1,
		},
		{
			id: "2",
			title: "عرض القهوة التركية",
			description: "خصم 15% على القهوة التركية الأصيلة",
			image: "/slid/2.svg",
			alt: "عرض القهوة التركية",
			discount: 15,
			priority: 2,
		},
		{
			id: "3",
			title: "عرض الإسبريسو",
			description: "خصم 25% على جميع أنواع الإسبريسو",
			image: "/slid/3.svg",
			alt: "عرض الإسبريسو",
			discount: 25,
			priority: 3,
		},
	];
};
