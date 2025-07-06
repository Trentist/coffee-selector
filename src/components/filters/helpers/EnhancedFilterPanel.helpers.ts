/**
 * Enhanced Filter Panel Helpers
 * Utility functions for the advanced filtering system
 */

import {
	FilterSection,
	ActiveFilter,
} from "../types/EnhancedFilterPanel.types";

/**
 * Get active filters as array for display
 */
export const getActiveFiltersArray = (
	activeFilters: Record<string, any>,
	sections: FilterSection[],
): ActiveFilter[] => {
	const activeFiltersArray: ActiveFilter[] = [];

	Object.entries(activeFilters).forEach(([sectionId, value]) => {
		const section = sections.find((s) => s.id === sectionId);
		if (!section) return;

		if (Array.isArray(value) && value.length > 0) {
			value.forEach((v) => {
				const option = section.options?.find((opt) => opt.id === v);
				if (option) {
					activeFiltersArray.push({
						sectionId,
						sectionTitle: section.title,
						value: v,
						label: option.label,
					});
				}
			});
		} else if (value && !Array.isArray(value)) {
			activeFiltersArray.push({
				sectionId,
				sectionTitle: section.title,
				value,
				label:
					typeof value === "object"
						? `${value.min} - ${value.max}`
						: String(value),
			});
		}
	});

	return activeFiltersArray;
};

/**
 * Filter options based on search term
 */
export const filterOptionsBySearch = (
	options: any[],
	searchTerm: string,
): any[] => {
	if (!searchTerm) return options;

	return options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);
};

/**
 * Get default range values for a section
 */
export const getDefaultRangeValues = (
	section: FilterSection,
): [number, number] => {
	return [section.min || 0, section.max || 1000];
};

/**
 * Check if a filter option is selected
 */
export const isOptionSelected = (
	optionId: string,
	sectionId: string,
	activeFilters: Record<string, any>,
): boolean => {
	const sectionFilters = activeFilters[sectionId];
	if (!sectionFilters) return false;

	return Array.isArray(sectionFilters)
		? sectionFilters.includes(optionId)
		: sectionFilters === optionId;
};

/**
 * Toggle filter option selection
 */
export const toggleFilterOption = (
	optionId: string,
	sectionId: string,
	activeFilters: Record<string, any>,
): Record<string, any> => {
	const currentValues = activeFilters[sectionId] || [];
	const newValues = currentValues.includes(optionId)
		? currentValues.filter((v: string) => v !== optionId)
		: [...currentValues, optionId];

	return {
		...activeFilters,
		[sectionId]: newValues,
	};
};

/**
 * Remove a specific filter
 */
export const removeSpecificFilter = (
	sectionId: string,
	value: any,
	activeFilters: Record<string, any>,
): Record<string, any> => {
	const newFilters = { ...activeFilters };

	if (Array.isArray(newFilters[sectionId])) {
		const newValues = newFilters[sectionId].filter((v: any) => v !== value);
		if (newValues.length === 0) {
			delete newFilters[sectionId];
		} else {
			newFilters[sectionId] = newValues;
		}
	} else {
		delete newFilters[sectionId];
	}

	return newFilters;
};

/**
 * Generate random count for demo purposes
 */
export const generateRandomCount = (): number => {
	return Math.floor(Math.random() * 50) + 10;
};
