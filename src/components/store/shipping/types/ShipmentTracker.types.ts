/**
 * ShipmentTracker Component Types
 * أنواع البيانات لمكون تتبع الشحنات
 */

export interface ShipmentTrackerProps {
	trackingNumber?: string;
	onTrackingFound?: (trackingInfo: TrackingInfo) => void;
}

export interface TrackingInfo {
	id: string;
	status: string;
	updates: TrackingUpdate[];
	estimatedDelivery: string;
	currentLocation: string;
}

export interface TrackingUpdate {
	date: string;
	status: string;
	location: string;
	description: string;
}

export interface ShipmentTrackerState {
	trackingNumber: string;
	isLoading: boolean;
	trackingInfo: TrackingInfo | null;
	error: string | null;
}

export interface ShipmentTrackerActions {
	onTrack: (number: string) => void;
	onKeyPress: (e: React.KeyboardEvent) => void;
}
