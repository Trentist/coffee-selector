/**
 * StatusCard Types
 * Type definitions for the status card system
 */

export type StatusType =
	| "empty"
	| "success"
	| "error"
	| "warning"
	| "payment"
	| "loading";

export interface StatusCardProps {
	statusType: StatusType;
	title: string;
	description: string;
	imageUrl?: string;
	icon?: React.ReactNode;
	buttonText?: string;
	buttonLink?: string;
	colorScheme?: string;
	onButtonClick?: () => void;
}

export interface StatusPageProps {
	statusType: StatusType;
	title?: string;
	description?: string;
	buttonText?: string;
	buttonLink?: string;
	icon?: React.ReactNode;
}

export interface StatusConfig {
	color: string;
	bg: string;
	icon: React.ReactNode;
}

export interface StatusState {
	isVisible: boolean;
	isLoading: boolean;
	error: string | null;
}
