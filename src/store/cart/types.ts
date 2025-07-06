/**
 * Cart Types - أنواع بيانات العربة
 */

export interface CartItem {
	id?: string;
	lineId?: string;
	productId: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
	slug?: string;
	description?: string;
	sku?: string;
	category?: string;
	variant?: string;
	attributes?: Record<string, any>;
}

export interface CartState {
	items: CartItem[];
	cartId?: string;
	cartName?: string;
	loading: boolean;
	error: string | null;
	lastUpdated: string | null;
	serverData?: any;
	total: number;
	itemCount: number;
	currency: string;
	tax: number;
	shipping: number;
	discount: number;
}

export interface CartOperation {
	success: boolean;
	message: string;
	cart?: any;
	quotation?: any;
	error?: string;
}

export interface CartProductInput {
	productId: string;
	quantity: number;
	price: number;
	attributes?: Record<string, any>;
}

export interface CartLineInput {
	lineId: string;
	quantity: number;
}

export interface CartQuotationData {
	id: string;
	date: string;
	validUntil: string;
	status: string;
	customer: {
		name: string;
		email: string;
		phone: string;
		company?: string;
	};
	addresses: {
		shipping: {
			name: string;
			street: string;
			street2?: string;
			city: string;
			state: string;
			country: string;
			zipCode: string;
			phone: string;
		};
		billing: {
			name: string;
			street: string;
			street2?: string;
			city: string;
			state: string;
			country: string;
			zipCode: string;
			phone: string;
		};
	};
	items: Array<{
		id: number;
		productName: string;
		productId: string;
		quantity: number;
		unitPrice: number;
		totalPrice: number;
	}>;
	financial: {
		subtotal: number;
		tax: number;
		shipping: number;
		total: number;
		currency: string;
	};
	metadata: {
		source: string;
		generatedAt: string;
		cartId: string;
	};
}

export interface CartStatistics {
	total: number;
	itemCount: number;
	uniqueItems: number;
	averageItemPrice: number;
	isEmpty: boolean;
	isLoading: boolean;
	hasError: boolean;
}

export interface CartValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

export interface CartSyncResult {
	success: boolean;
	synced: boolean;
	localChanges: number;
	serverChanges: number;
	conflicts: any[];
}
