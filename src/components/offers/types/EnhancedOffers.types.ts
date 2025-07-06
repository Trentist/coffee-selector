/**
 * Enhanced Offers Types
 * Type definitions for the enhanced offers system
 */

export interface Offer {
	id: string;
	title: string;
	description: string;
	image: string;
	discountPercentage: number;
	originalPrice: number;
	salePrice: number;
	currency: string;
	category: string;
	brand?: string;
	validUntil: Date;
	isActive: boolean;
	isFeatured?: boolean;
	priority?: number;
	tags?: string[];
	conditions?: string[];
}

export interface OffersBannerProps {
	offers: Offer[];
	autoPlay?: boolean;
	autoPlaySpeed?: number;
	showNavigation?: boolean;
	showIndicators?: boolean;
	maxHeight?: string;
	onOfferClick?: (offer: Offer) => void;
}

export interface OfferCardProps {
	offer: Offer;
	variant?: "default" | "compact" | "detailed" | "featured";
	size?: "sm" | "md" | "lg";
	showTimer?: boolean;
	showConditions?: boolean;
	onClick?: (offer: Offer) => void;
}

export interface OfferTimerProps {
	endDate: Date;
	onExpire?: () => void;
	showDays?: boolean;
	showHours?: boolean;
	showMinutes?: boolean;
	showSeconds?: boolean;
}

export interface OffersGridProps {
	offers: Offer[];
	columns?: number;
	gap?: number;
	variant?: "default" | "compact" | "detailed";
	showFilters?: boolean;
	onOfferClick?: (offer: Offer) => void;
}

export interface OfferFilterProps {
	categories: string[];
	brands: string[];
	selectedCategories: string[];
	selectedBrands: string[];
	onCategoryChange: (categories: string[]) => void;
	onBrandChange: (brands: string[]) => void;
	onClearFilters: () => void;
}

export interface OfferState {
	isLoading: boolean;
	error: string | null;
	selectedOffer: Offer | null;
	filteredOffers: Offer[];
	activeFilters: {
		categories: string[];
		brands: string[];
		priceRange: [number, number];
	};
}

export interface OfferAnimationProps {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	variant?: "fadeIn" | "slideUp" | "scaleIn" | "bounce";
}
