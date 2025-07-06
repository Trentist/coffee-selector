/**
 * ShipmentTracker Component Helpers
 * دوال مساعدة لمكون تتبع الشحنات
 */

import { TrackingInfo } from "../types/ShipmentTracker.types";

/**
 * Get status color based on tracking status
 * الحصول على لون الحالة بناءً على حالة التتبع
 */
export const getStatusColor = (status: string): string => {
	switch (status.toLowerCase()) {
		case "delivered":
			return "green";
		case "in_transit":
		case "out_for_delivery":
			return "blue";
		case "pending":
		case "processing":
			return "yellow";
		case "failed":
		case "returned":
			return "red";
		default:
			return "gray";
	}
};

/**
 * Track shipment using API
 * تتبع الشحنة باستخدام API
 */
export const trackShipment = async (
	number: string,
	onSuccess: (data: TrackingInfo) => void,
	onError: (error: string) => void,
	setIsLoading: (loading: boolean) => void,
	t: (key: string) => string,
): Promise<void> => {
	if (!number.trim()) {
		onError(t("tracking.enter_tracking_number"));
		return;
	}

	setIsLoading(true);

	try {
		const response = await fetch(
			`/api/shipping/track?trackingNumber=${encodeURIComponent(number)}`,
		);
		const result = await response.json();

		if (result.success) {
			onSuccess(result.data);
		} else {
			onError(result.error || t("tracking.not_found"));
		}
	} catch (error) {
		console.error("Tracking error:", error);
		onError(t("tracking.system_error"));
	} finally {
		setIsLoading(false);
	}
};
