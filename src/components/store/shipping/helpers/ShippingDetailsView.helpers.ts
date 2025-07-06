/**
 * ShippingDetailsView Component Helpers
 * دوال مساعدة لمكون عرض تفاصيل الشحن
 */

import { ShippingDetails } from "../types/ShippingDetailsView.types";

/**
 * Calculate total weight of products
 * حساب الوزن الإجمالي للمنتجات
 */
export const calculateTotalWeight = (products: any[]): number => {
	return products.reduce((total, product) => {
		const weight = product.weight || 0.5;
		return total + weight * product.quantity;
	}, 0);
};

/**
 * Calculate estimated dimensions
 * حساب الأبعاد المقدرة
 */
export const calculateEstimatedDimensions = (
	products: any[],
): {
	length: number;
	width: number;
	height: number;
} => {
	const totalItems = products.reduce(
		(sum, product) => sum + product.quantity,
		0,
	);

	// تقدير الأبعاد بناءً على عدد العناصر
	const baseLength = 20; // cm
	const baseWidth = 15; // cm
	const baseHeight = 10; // cm

	return {
		length: Math.min(baseLength * Math.ceil(totalItems / 3), 50),
		width: Math.min(baseWidth * Math.ceil(totalItems / 2), 40),
		height: Math.min(baseHeight * Math.ceil(totalItems / 5), 30),
	};
};

/**
 * Get estimated delivery date
 * الحصول على تاريخ التسليم المقدر
 */
export const getEstimatedDeliveryDate = (estimatedDays: number): string => {
	const deliveryDate = new Date();
	deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
	return deliveryDate.toLocaleDateString();
};

/**
 * Fetch shipping details from API
 * جلب تفاصيل الشحن من API
 */
export const fetchShippingDetails = async (
	selectedAddress: any,
	products: any[],
	shippingCost?: number,
): Promise<ShippingDetails> => {
	const totalWeight = calculateTotalWeight(products);
	const estimatedDimensions = calculateEstimatedDimensions(products);

	const addressForAPI = {
		line1: selectedAddress.addressLine1 || selectedAddress.street || "",
		line2: selectedAddress.addressLine2 || selectedAddress.building || "",
		city: selectedAddress.city || "",
		state: selectedAddress.state || "",
		postalCode: selectedAddress.postalCode || "",
		country: selectedAddress.country || "AE",
	};

	const requestPayload = {
		shippingAddress: addressForAPI,
		products: products.map((product: any) => ({
			name: product.name || "Coffee Product",
			quantity: product.quantity || 1,
			weight: product.weight || 0.5,
			price: product.price || 0,
		})),
		customer: {
			name: "beyin dev web",
			email: selectedAddress.email || "beyin@devweb.com",
			phone: selectedAddress.phone || "+971501234567",
		},
	};

	const response = await fetch("/api/shipping/calculate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestPayload),
	});

	const result = await response.json();

	if (result.success) {
		return {
			...result.data,
			weight: totalWeight,
			dimensions: estimatedDimensions,
		};
	} else {
		throw new Error(result.error || "Failed to calculate shipping");
	}
};
