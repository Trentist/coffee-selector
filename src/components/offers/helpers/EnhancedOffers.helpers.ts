/**
 * Enhanced Offers Helpers
 * Utility functions for the enhanced offers system
 */

import { Offer, OfferTimerProps } from "../types/EnhancedOffers.types";

/**
 * Format price with currency
 */
export const formatOfferPrice = (
	price: number,
	currency: string = "SAR",
): string => {
	return new Intl.NumberFormat("ar-SA", {
		style: "currency",
		currency: currency,
	}).format(price);
};

/**
 * Calculate time remaining until offer expires
 */
export const calculateTimeRemaining = (
	endDate: Date,
): {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isExpired: boolean;
} => {
	const now = new Date().getTime();
	const end = new Date(endDate).getTime();
	const difference = end - now;

	if (difference <= 0) {
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			isExpired: true,
		};
	}

	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	);
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((difference % (1000 * 60)) / 1000);

	return {
		days,
		hours,
		minutes,
		seconds,
		isExpired: false,
	};
};

/**
 * Check if offer is active
 */
export const isOfferActive = (offer: Offer): boolean => {
	const now = new Date();
	const validUntil = new Date(offer.validUntil);
	return offer.isActive && validUntil > now;
};

/**
 * Get offer priority score
 */
export const getOfferPriority = (offer: Offer): number => {
	let score = 0;

	if (offer.isFeatured) score += 100;
	if (offer.priority) score += offer.priority;
	if (offer.discountPercentage > 50) score += 50;

	const timeRemaining = calculateTimeRemaining(offer.validUntil);
	if (!timeRemaining.isExpired && timeRemaining.days < 7) score += 25;

	return score;
};

/**
 * Sort offers by priority
 */
export const sortOffersByPriority = (offers: Offer[]): Offer[] => {
	return offers
		.filter(isOfferActive)
		.sort((a, b) => getOfferPriority(b) - getOfferPriority(a));
};

/**
 * Filter offers by criteria
 */
export const filterOffers = (
	offers: Offer[],
	filters: {
		categories?: string[];
		brands?: string[];
		priceRange?: [number, number];
		activeOnly?: boolean;
	},
): Offer[] => {
	return offers.filter((offer) => {
		// Filter by active status
		if (filters.activeOnly && !isOfferActive(offer)) {
			return false;
		}

		// Filter by categories
		if (filters.categories && filters.categories.length > 0) {
			if (!filters.categories.includes(offer.category)) {
				return false;
			}
		}

		// Filter by brands
		if (filters.brands && filters.brands.length > 0) {
			if (!offer.brand || !filters.brands.includes(offer.brand)) {
				return false;
			}
		}

		// Filter by price range
		if (filters.priceRange) {
			const [minPrice, maxPrice] = filters.priceRange;
			if (offer.salePrice < minPrice || offer.salePrice > maxPrice) {
				return false;
			}
		}

		return true;
	});
};

/**
 * Get offer image with fallback
 */
export const getOfferImage = (offer: Offer): string => {
	return offer.image || "/images/placeholder-offer.jpg";
};

/**
 * Format time unit for display
 */
export const formatTimeUnit = (value: number, unit: string): string => {
	return `${value.toString().padStart(2, "0")} ${unit}`;
};

/**
 * Get offer status color
 */
export const getOfferStatusColor = (offer: Offer): string => {
	if (!isOfferActive(offer)) return "gray.500";

	const timeRemaining = calculateTimeRemaining(offer.validUntil);
	if (timeRemaining.days < 1) return "red.500";
	if (timeRemaining.days < 3) return "orange.500";
	return "green.500";
};

/**
 * Get offer status text
 */
export const getOfferStatusText = (offer: Offer): string => {
	if (!isOfferActive(offer)) return "انتهت الصلاحية";

	const timeRemaining = calculateTimeRemaining(offer.validUntil);
	if (timeRemaining.days < 1) return "ينتهي قريباً";
	if (timeRemaining.days < 3) return "عرض محدود";
	return "متاح";
};

/**
 * Validate offer data
 */
export const validateOffer = (offer: Offer): boolean => {
	return !!(
		offer.id &&
		offer.title &&
		offer.description &&
		offer.image &&
		offer.discountPercentage &&
		offer.originalPrice &&
		offer.salePrice &&
		offer.currency &&
		offer.category &&
		offer.validUntil
	);
};

/**
 * Get animation variants for offers
 */
export const getOfferAnimationVariants = () => ({
	fadeIn: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.5 },
	},
	slideUp: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
		transition: { duration: 0.5 },
	},
	scaleIn: {
		initial: { opacity: 0, scale: 0.8 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.8 },
		transition: { duration: 0.3 },
	},
	bounce: {
		initial: { opacity: 0, y: 50 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 50 },
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 20,
		},
	},
});
