/**
 * ShippingDetailsView Component Types
 * أنواع البيانات لمكون عرض تفاصيل الشحن
 */

import { AddressType } from "@/types/address.types";

export interface ShippingDetailsViewProps {
	selectedAddress: AddressType | null;
	products: any[];
	shippingMethodId?: string;
	shippingCost?: number;
	onShippingUpdate?: (details: any) => void;
}

export interface ShippingDetails {
	isSupported: boolean;
	estimatedDays: number;
	cost: number;
	currency: string;
	provider: string;
	serviceType: string;
	restrictions?: string[];
	weight: number;
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
}

export interface ShippingDetailsViewState {
	shippingDetails: ShippingDetails | null;
	loading: boolean;
	error: string | null;
	showDetails: boolean;
}

export interface ShippingDetailsViewActions {
	onFetchShippingDetails: () => void;
	onToggleDetails: () => void;
}
