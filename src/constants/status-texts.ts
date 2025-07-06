/**
 * Status Text Constants
 * ثوابت نصوص الحالة والتنبيهات
 */

// ============================================================================
// STATUS TYPES - أنواع الحالة
// ============================================================================

export const STATUS_TYPES = {
	SUCCESS: "success",
	ERROR: "error",
	WARNING: "warning",
	INFO: "info",
	LOADING: "loading",
	PROCESSING: "processing",
} as const;

// ============================================================================
// STATUS TITLES - عناوين الحالة
// ============================================================================

export const STATUS_TITLES = {
	SUCCESS: "STATUS_SUCCESS_TITLE",
	ERROR: "STATUS_ERROR_TITLE",
	WARNING: "STATUS_WARNING_TITLE",
	INFO: "STATUS_INFO_TITLE",
	STATUS: "STATUS_GENERAL_TITLE",
	PROCESSING: "STATUS_PROCESSING_TITLE",
} as const;

// ============================================================================
// STATUS DESCRIPTIONS - أوصاف الحالة
// ============================================================================

export const STATUS_DESCRIPTIONS = {
	SUCCESS: "STATUS_SUCCESS_DESCRIPTION",
	ERROR: "STATUS_ERROR_DESCRIPTION",
	WARNING: "STATUS_WARNING_DESCRIPTION",
	INFO: "STATUS_INFO_DESCRIPTION",
	STATUS: "STATUS_GENERAL_DESCRIPTION",
} as const;

// ============================================================================
// STATUS BUTTONS - أزرار الحالة
// ============================================================================

export const STATUS_BUTTONS = {
	CONTINUE: "STATUS_BUTTON_CONTINUE",
	TRY_AGAIN: "STATUS_BUTTON_TRY_AGAIN",
	REVIEW: "STATUS_BUTTON_REVIEW",
	GOT_IT: "STATUS_BUTTON_GOT_IT",
	OK: "STATUS_BUTTON_OK",
	RETRY: "STATUS_BUTTON_RETRY",
	CLOSE: "STATUS_BUTTON_CLOSE",
	BACK: "STATUS_BUTTON_BACK",
	NEXT: "STATUS_BUTTON_NEXT",
	PREVIOUS: "STATUS_BUTTON_PREVIOUS",
	FINISH: "STATUS_BUTTON_FINISH",
	SUBMIT: "STATUS_BUTTON_SUBMIT",
	CONFIRM: "STATUS_BUTTON_CONFIRM",
	CANCEL: "STATUS_BUTTON_CANCEL",
	SAVE: "STATUS_BUTTON_SAVE",
	DELETE: "STATUS_BUTTON_DELETE",
	EDIT: "STATUS_BUTTON_EDIT",
	ADD: "STATUS_BUTTON_ADD",
	REMOVE: "STATUS_BUTTON_REMOVE",
	UPDATE: "STATUS_BUTTON_UPDATE",
	VIEW: "STATUS_BUTTON_VIEW",
	SHOW: "STATUS_BUTTON_SHOW",
	HIDE: "STATUS_BUTTON_HIDE",
	OPEN: "STATUS_BUTTON_OPEN",
	DOWNLOAD: "STATUS_BUTTON_DOWNLOAD",
	UPLOAD: "STATUS_BUTTON_UPLOAD",
	EXPORT: "STATUS_BUTTON_EXPORT",
	IMPORT: "STATUS_BUTTON_IMPORT",
	PRINT: "STATUS_BUTTON_PRINT",
	SEARCH: "STATUS_BUTTON_SEARCH",
	FILTER: "STATUS_BUTTON_FILTER",
	SORT: "STATUS_BUTTON_SORT",
	REFRESH: "STATUS_BUTTON_REFRESH",
	RELOAD: "STATUS_BUTTON_RELOAD",
	SELECT: "STATUS_BUTTON_SELECT",
	DESELECT: "STATUS_BUTTON_DESELECT",
	CLEAR: "STATUS_BUTTON_CLEAR",
	RESET: "STATUS_BUTTON_RESET",
	APPROVE: "STATUS_BUTTON_APPROVE",
	REJECT: "STATUS_BUTTON_REJECT",
	ACTIVATE: "STATUS_BUTTON_ACTIVATE",
	DEACTIVATE: "STATUS_BUTTON_DEACTIVATE",
	ENABLE: "STATUS_BUTTON_ENABLE",
	DISABLE: "STATUS_BUTTON_DISABLE",
	LOCK: "STATUS_BUTTON_LOCK",
	UNLOCK: "STATUS_BUTTON_UNLOCK",
	ARCHIVE: "STATUS_BUTTON_ARCHIVE",
	RESTORE: "STATUS_BUTTON_RESTORE",
	DUPLICATE: "STATUS_BUTTON_DUPLICATE",
	CLONE: "STATUS_BUTTON_CLONE",
	MERGE: "STATUS_BUTTON_MERGE",
	SPLIT: "STATUS_BUTTON_SPLIT",
	MOVE: "STATUS_BUTTON_MOVE",
	RENAME: "STATUS_BUTTON_RENAME",
	GROUP: "STATUS_BUTTON_GROUP",
	UNGROUP: "STATUS_BUTTON_UNGROUP",
	EXPAND: "STATUS_BUTTON_EXPAND",
	COLLAPSE: "STATUS_BUTTON_COLLAPSE",
	SHARE: "STATUS_BUTTON_SHARE",
	COPY: "STATUS_BUTTON_COPY",
	PASTE: "STATUS_BUTTON_PASTE",
	CUT: "STATUS_BUTTON_CUT",
} as const;

// ============================================================================
// STATUS MESSAGES - رسائل الحالة
// ============================================================================

export const STATUS_MESSAGES = {
	OPERATION_SUCCESS: "STATUS_MESSAGE_OPERATION_SUCCESS",
	SOMETHING_WENT_WRONG: "STATUS_MESSAGE_SOMETHING_WENT_WRONG",
	PLEASE_REVIEW_INFO: "STATUS_MESSAGE_PLEASE_REVIEW_INFO",
	HERE_IS_INFO: "STATUS_MESSAGE_HERE_IS_INFO",
	STATUS_INFO: "STATUS_MESSAGE_STATUS_INFO",
	LOADING_MESSAGE: "STATUS_MESSAGE_LOADING",
	PROCESSING_MESSAGE: "STATUS_MESSAGE_PROCESSING",
} as const;

// ============================================================================
// STATUS ACTIONS - إجراءات الحالة
// ============================================================================

export const STATUS_ACTIONS = {
	DELETE_METHOD: "STATUS_ACTION_DELETE_METHOD",
	LOADING_STATUS: "STATUS_ACTION_LOADING_STATUS",
} as const;

// ============================================================================
// EXPORT ALL - تصدير الكل
// ============================================================================

export default {
	STATUS_TYPES,
	STATUS_TITLES,
	STATUS_DESCRIPTIONS,
	STATUS_BUTTONS,
	STATUS_MESSAGES,
	STATUS_ACTIONS,
};
