/**
 * Favorites Page Helpers
 * Utility functions for the favorites/wishlist system
 */

import { FavoriteItem } from "../types/FavoritesPage.types";

/**
 * Get image URL with fallback
 */
export const getImageUrl = (imagePath: string): string => {
	if (!imagePath) return "/placeholder-image.jpg";
	if (imagePath.startsWith("http")) return imagePath;
	return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
};

/**
 * Format price with currency
 */
export const formatPrice = (
	price: number,
	currency: string = "SAR",
): string => {
	return `${price} ${currency}`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

/**
 * Get grid template columns based on view mode
 */
export const getGridTemplateColumns = (viewMode: "grid" | "list") => {
	if (viewMode === "list") return "1fr";

	return {
		base: "1fr",
		md: "repeat(2, 1fr)",
		lg: "repeat(3, 1fr)",
		xl: "repeat(4, 1fr)",
	};
};

/**
 * Validate favorite item
 */
export const validateFavoriteItem = (item: any): FavoriteItem | null => {
	if (!item || !item.id) return null;

	return {
		id: item.id,
		name: item.name || item.title || "",
		title: item.title || item.name || "",
		category: item.category || "general",
		image: item.image || item.image_profile || "",
		image_profile: item.image_profile || item.image || "",
		price: item.price || 0,
		description: item.description || item.text || "",
		text: item.text || item.description || "",
		size: item.size || "medium",
		slug: item.slug || item.id.toString(),
	};
};

/**
 * Sort favorites by different criteria
 */
export const sortFavorites = (
	items: FavoriteItem[],
	sortBy: "name" | "price" | "category" | "date" = "name",
	sortOrder: "asc" | "desc" = "asc",
): FavoriteItem[] => {
	const sortedItems = [...items];

	sortedItems.sort((a, b) => {
		let comparison = 0;

		switch (sortBy) {
			case "name":
				comparison = a.name.localeCompare(b.name);
				break;
			case "price":
				comparison = a.price - b.price;
				break;
			case "category":
				comparison = a.category.localeCompare(b.category);
				break;
			case "date":
				// Assuming items have a date property, fallback to name
				comparison = a.name.localeCompare(b.name);
				break;
		}

		return sortOrder === "asc" ? comparison : -comparison;
	});

	return sortedItems;
};

/**
 * Filter favorites by category
 */
export const filterFavoritesByCategory = (
	items: FavoriteItem[],
	category: string,
): FavoriteItem[] => {
	if (!category || category === "all") return items;
	return items.filter((item) => item.category === category);
};

/**
 * Get unique categories from favorites
 */
export const getUniqueCategories = (items: FavoriteItem[]): string[] => {
	const categories = items.map((item) => item.category);
	return [...new Set(categories)];
};

/**
 * Calculate total value of favorites
 */
export const calculateFavoritesTotal = (items: FavoriteItem[]): number => {
	return items.reduce((total, item) => total + item.price, 0);
};
