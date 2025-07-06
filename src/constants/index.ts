/**
 * Constants Index
 * Central export file for all application constants
 */

// Application constants
export * from "./app-constants";

// Filter system constants
export * from "./filter-constants";

// Filter text constants
export * from "./filter-text-constants";

// Re-export commonly used constants with clearer names
export {
	DEFAULT_CURRENCY,
	DEFAULT_LANGUAGE,
	SUPPORTED_LOCALES,
	LOCALIZED_ROUTES,
	CURRENCY_SETTINGS,
	LANGUAGE_SETTINGS,
	APP_METADATA,
	API_CONFIG,
	THEME_CONSTANTS,
	CACHE_CONSTANTS,
} from "./app-constants";

export {
	defaultSort,
	sorting,
	EXTENDED_SORTING,
	TAGS,
	FILTER_TYPES,
	FILTER_PRESETS,
	DEFAULT_FILTER_VALUES,
	VIEW_MODES,
	PRICE_RANGES,
	RATING_OPTIONS,
	FILTER_ANIMATIONS,
	DEBOUNCE_DELAYS,
	LIMIT,
	DEFAULT_PAGE_SIZE,
	TOKEN,
	SAVED_LOCAL_STORAGE,
	FILTER_STORAGE_KEY,
	SORT_STORAGE_KEY,
	VIEW_MODE_STORAGE_KEY,
} from "./filter-constants";

// Type exports
export type { SortFilterItem } from "./filter-constants";

// Auth translation constants
export {
	AUTH_TRANSLATION_KEYS,
	FORM_FIELD_KEYS,
	VALIDATION_KEYS,
	BUTTON_KEYS,
	getAuthTranslationKey,
	type AuthTranslationKey,
} from "./auth-translation-constants";
