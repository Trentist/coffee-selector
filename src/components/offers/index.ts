/**
 * Enhanced Offers System Exports
 * Central export file for all enhanced offers components and utilities
 */

// Main Enhanced Offers Banner component
export { default as EnhancedOffersBanner } from "./EnhancedOffersBanner";

// Types
export type {
	Offer,
	OffersBannerProps,
	OfferCardProps,
	OfferTimerProps,
	OffersGridProps,
	OfferFilterProps,
	OfferState,
	OfferAnimationProps,
} from "./types/EnhancedOffers.types";

// Helpers
export {
	formatOfferPrice,
	calculateTimeRemaining,
	isOfferActive,
	getOfferPriority,
	sortOffersByPriority,
	filterOffers,
	getOfferImage,
	formatTimeUnit,
	getOfferStatusColor,
	getOfferStatusText,
	validateOffer,
	getOfferAnimationVariants,
} from "./helpers/EnhancedOffers.helpers";
