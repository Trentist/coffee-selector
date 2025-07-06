/**
 * Offers Banner Types
 * Type definitions for the offers and promotions system
 */

export interface OfferItem {
	id: string;
	title: string;
	description: string;
	image: string;
	alt: string;
	link?: string;
	discount?: number;
	validUntil?: string;
	priority?: number;
}

export interface OffersBannerProps {
	offers?: OfferItem[];
	loading?: boolean;
	error?: string | null;
	autoPlay?: boolean;
	interval?: number;
	showIndicators?: boolean;
	showArrows?: boolean;
}

export interface OffersState {
	offers: OfferItem[];
	loading: boolean;
	error: string | null;
	currentIndex: number;
}

export interface OffersActions {
	setCurrentIndex: (index: number) => void;
	nextSlide: () => void;
	prevSlide: () => void;
	goToSlide: (index: number) => void;
}

export interface ScrollImagesProps {
	images: OfferItem[];
	speed?: number;
	direction?: "left" | "right";
	repeat?: boolean;
}

export interface PromoCardProps {
	offer: OfferItem;
	onClick?: (offer: OfferItem) => void;
}
