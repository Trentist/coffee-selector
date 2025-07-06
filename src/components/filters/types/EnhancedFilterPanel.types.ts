/**
 * Enhanced Filter Panel Types
 * Type definitions for the advanced filtering system
 */

export interface FilterOption {
	id: string;
	label: string;
	count: number;
	color?: string;
	image?: string;
}

export interface FilterSection {
	id: string;
	title: string;
	type: "checkbox" | "range" | "color" | "rating";
	options?: FilterOption[];
	min?: number;
	max?: number;
	step?: number;
}

export interface ActiveFilter {
	sectionId: string;
	sectionTitle: string;
	value: any;
	label: string;
}

export interface EnhancedFilterPanelProps {
	sections: FilterSection[];
	onFiltersChange: (filters: Record<string, any>) => void;
	activeFilters: Record<string, any>;
	productCount: number;
	isLoading?: boolean;
}

export interface FilterState {
	activeFilters: Record<string, any>;
	productCount: number;
	isLoading: boolean;
}

export interface FilterActions {
	setActiveFilters: (filters: Record<string, any>) => void;
	clearAllFilters: () => void;
	removeFilter: (sectionId: string) => void;
	addFilter: (sectionId: string, value: any) => void;
}
