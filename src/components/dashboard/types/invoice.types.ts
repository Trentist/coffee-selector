/**
 * Invoice Types
 * أنواع الفواتير
 */

export interface Invoice {
	id: string;
	name: string;
	number: string;
	date: string;
	dueDate: string;
	total: number;
	amountDue: number;
	state: "draft" | "posted" | "paid" | "cancelled";
	type: "out_invoice" | "in_invoice" | "out_refund" | "in_refund";
	currency: {
		id: string;
		name: string;
		symbol: string;
	};
	partner: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
	lines: InvoiceLine[];
	taxes: InvoiceTax[];
}

export interface InvoiceLine {
	id: string;
	name: string;
	quantity: number;
	price: number;
	priceSubtotal: number;
	priceTax: number;
	priceTotal: number;
	product: {
		id: string;
		name: string;
	};
	taxes: InvoiceTax[];
}

export interface InvoiceTax {
	id: string;
	name: string;
	amount: number;
	base: number;
}

export interface InvoiceFilters {
	state?: string;
	dateFrom?: string;
	dateTo?: string;
	partnerId?: string;
	amountMin?: number;
	amountMax?: number;
}

export interface InvoicesResult {
	success: boolean;
	invoices?: Invoice[];
	total?: number;
	hasMore?: boolean;
	error?: string;
	message?: string;
}
