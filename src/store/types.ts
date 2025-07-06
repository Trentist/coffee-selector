/**
 * Redux Store Types
 * أنواع متجر Redux
 */

import { store } from "./index";

// Root state types
export type RootState = ReturnType<typeof store.getState>;

// App dispatch types
export type AppDispatch = typeof store.dispatch;

// Common interfaces
export interface LoadingState {
	isLoading: boolean;
	error: string | null;
	lastUpdated?: number;
}

export interface PaginationState {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	totalCount: number;
}

export interface FilterState {
	search: string;
	category: string;
	priceRange: {
		min: number;
		max: number;
	};
	sortBy: string;
	sortDirection: "asc" | "desc";
}

// Action types
export interface BaseAction {
	type: string;
	payload?: any;
	meta?: {
		timestamp: number;
		source?: string;
	};
}

export interface AsyncAction extends BaseAction {
	meta: {
		timestamp: number;
		source?: string;
		requestId?: string;
	};
}

// API response types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	pagination?: PaginationState;
}

export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, any>;
	timestamp: number;
}

// Common state interfaces
export interface EntityState<T> {
	entities: Record<string, T>;
	ids: string[];
	loading: LoadingState;
	pagination: PaginationState;
	filters: FilterState;
}

export interface SingleEntityState<T> {
	data: T | null;
	loading: LoadingState;
	error: string | null;
}
