/**
 * Authentication Translation Constants
 * Centralized translation keys for authentication system
 */

export const AUTH_TRANSLATION_KEYS = {
	// Page titles and descriptions
	WELCOME_TITLE: "auth.welcome_title",
	WELCOME_SUBTITLE: "auth.welcome_subtitle",
	ENTER_YOUR_DETAILS: "auth.enter_your_details",

	// Login
	LOGIN: "auth.login",
	LOGIN_TITLE: "auth.login_title",
	LOGIN_DESC: "auth.login_desc",
	LOGIN_SUBTITLE: "auth.login_subtitle",
	LOGIN_SUCCESSFUL: "auth.login_successful",
	LOGIN_FAILED: "auth.login_failed",
	INVALID_CREDENTIALS: "auth.invalid_credentials",
	WRONG_CREDENTIALS: "auth.wrong_credentials",
	SIGNING_IN: "auth.signing_in",

	// Register
	REGISTER: "auth.register",
	REGISTER_TITLE: "auth.register_title",
	REGISTER_SUBTITLE: "auth.register_subtitle",
	REGISTER_DESC: "auth.register_desc",
	SIGNUP_TITLE: "auth.signup_title",
	SIGNUP_DESC: "auth.signup_desc",
	SIGNUP_SUBTITLE: "auth.signup_subtitle",
	CREATING_ACCOUNT: "auth.creating_account",
	SIGNING_UP: "auth.signing_up",
	ACCOUNT_CREATED_DESC: "auth.account_created_desc",

	// Forgot Password
	FORGOT_PASSWORD: "auth.forgot_password",
	FORGOT_PASSWORD_TITLE: "auth.forgot_password_title",
	FORGOT_PASSWORD_SUBTITLE: "auth.forgot_password_subtitle",
	FORGOT_PASSWORD_DESC: "auth.forgot_password_desc",
	FORGOT_PASSWORD_ERROR: "auth.forgot_password_error",
	RESET_PASSWORD: "auth.reset_password",
	RESET_PASSWORD_TITLE: "auth.reset_password_title",
	RESET_PASSWORD_SUBTITLE: "auth.reset_password_subtitle",
	RESET_PASSWORD_DESC: "auth.reset_password_desc",
	RESET_PASSWORD_ERROR: "auth.reset_password_error",
	SENDING_RESET_LINK: "auth.sending_reset_link",
	SEND_RESET_LINK: "auth.send_reset_link",
	SENDING: "auth.sending",
	RESETTING_PASSWORD: "auth.resetting_password",

	// Form fields
	FULL_NAME: "auth.full_name",
	FULL_NAME_REQUIRED: "auth.full_name_required",
	FULL_NAME_PLACEHOLDER: "auth.full_name_placeholder",
	NAME_PLACEHOLDER: "auth.name_placeholder",
	EMAIL_PLACEHOLDER: "auth.email_placeholder",
	PASSWORD_PLACEHOLDER: "auth.password_placeholder",
	NEW_PASSWORD_PLACEHOLDER: "auth.new_password_placeholder",
	CONFIRM_PASSWORD: "auth.confirm_password",
	CONFIRM_PASSWORD_PLACEHOLDER: "auth.confirm_password_placeholder",
	REMEMBER_ME: "auth.remember_me",
	ACCEPT_TERMS: "auth.accept_terms",

	// Validation messages
	EMAIL_REQUIRED: "auth.email_required",
	PASSWORD_REQUIRED: "auth.password_required",
	PASSWORD_MIN_LENGTH: "auth.password_min_length",
	NAME_REQUIRED: "auth.name_required",
	CONFIRM_PASSWORD_REQUIRED: "auth.confirm_password_required",
	PASSWORDS_NOT_MATCH: "auth.passwords_not_match",
	PASSWORDS_DONT_MATCH: "auth.passwords_dont_match",
	EMAIL_WRONG: "auth.email_wrong",
	PASSWORD_WRONG: "auth.password_wrong",
	TERMS_REQUIRED: "auth.terms_required",

	// Navigation
	ALREADY_HAVE_ACCOUNT: "auth.already_have_account",
	DONT_HAVE_ACCOUNT: "auth.dont_have_account",
	NO_ACCOUNT: "auth.no_account",
	SIGN_IN: "auth.sign_in",
	SIGN_UP: "auth.sign_up",
	BACK_TO_LOGIN: "auth.back_to_login",
	REMEMBER_PASSWORD: "auth.remember_password",

	// Social login
	CONTINUE_WITH_GOOGLE: "auth.continue_with_google",
	SIGNUP_WITH_GOOGLE: "auth.signup_with_google",
	SIGNING_IN_WITH_GOOGLE: "auth.signing_in_with_google",
	OR_CONTINUE_WITH_EMAIL: "auth.or_continue_with_email",
	OR_SIGNUP_WITH_EMAIL: "auth.or_signup_with_email",

	// Success/Error messages
	LOGIN_SUCCESS: "auth.login_success",
	LOGIN_ERROR: "auth.login_error",
	REGISTER_SUCCESS: "auth.register_success",
	REGISTER_ERROR: "auth.register_error",
	SIGNUP_SUCCESS: "auth.signup_success",
	SIGNUP_ERROR: "auth.signup_error",
	UNEXPECTED_ERROR: "auth.unexpected_error",
	NETWORK_ERROR: "auth.network_error",

	// Password reset
	PASSWORD_RESET_REQUEST_SENT: "auth.password_reset_request_sent",
	PASSWORD_RESET_DESCRIPTION: "auth.password_reset_description",
	PASSWORD_RESET_SUCCESS: "auth.password_reset_success",
	PASSWORD_RESET_SUCCESS_DESC: "auth.password_reset_success_desc",
	PASSWORD_RESET_ERROR: "auth.password_reset_error",
	INVALID_TOKEN: "auth.invalid_token",

	// Common
	SUBMIT: "common.submit",
	BACK: "common.back",
	LOADING: "common.loading",
	ERROR: "common.error",
	SUCCESS: "common.success",
	WARNING: "common.warning",
	INFO: "common.info",
	CLOSE: "common.close",
	REQUIRED: "common.required",
	OPTIONAL: "common.optional",
} as const;

// Type for translation keys
export type AuthTranslationKey =
	(typeof AUTH_TRANSLATION_KEYS)[keyof typeof AUTH_TRANSLATION_KEYS];

// Helper function to get translation key
export const getAuthTranslationKey = (
	key: keyof typeof AUTH_TRANSLATION_KEYS,
): string => {
	return AUTH_TRANSLATION_KEYS[key];
};

// Form field translation keys
export const FORM_FIELD_KEYS = {
	EMAIL: AUTH_TRANSLATION_KEYS.EMAIL_PLACEHOLDER,
	PASSWORD: AUTH_TRANSLATION_KEYS.PASSWORD_PLACEHOLDER,
	CONFIRM_PASSWORD: AUTH_TRANSLATION_KEYS.CONFIRM_PASSWORD,
	FULL_NAME: AUTH_TRANSLATION_KEYS.FULL_NAME_PLACEHOLDER,
	REMEMBER_ME: AUTH_TRANSLATION_KEYS.REMEMBER_ME,
} as const;

// Validation message keys
export const VALIDATION_KEYS = {
	EMAIL_REQUIRED: AUTH_TRANSLATION_KEYS.EMAIL_REQUIRED,
	PASSWORD_REQUIRED: AUTH_TRANSLATION_KEYS.PASSWORD_REQUIRED,
	PASSWORD_MIN_LENGTH: AUTH_TRANSLATION_KEYS.PASSWORD_MIN_LENGTH,
	FULL_NAME_REQUIRED: AUTH_TRANSLATION_KEYS.FULL_NAME_REQUIRED,
	NAME_REQUIRED: AUTH_TRANSLATION_KEYS.NAME_REQUIRED,
	CONFIRM_PASSWORD_REQUIRED: AUTH_TRANSLATION_KEYS.CONFIRM_PASSWORD_REQUIRED,
	PASSWORDS_NOT_MATCH: AUTH_TRANSLATION_KEYS.PASSWORDS_NOT_MATCH,
	PASSWORDS_DONT_MATCH: AUTH_TRANSLATION_KEYS.PASSWORDS_DONT_MATCH,
	EMAIL_WRONG: AUTH_TRANSLATION_KEYS.EMAIL_WRONG,
	PASSWORD_WRONG: AUTH_TRANSLATION_KEYS.PASSWORD_WRONG,
	TERMS_REQUIRED: AUTH_TRANSLATION_KEYS.TERMS_REQUIRED,
} as const;

// Button text keys
export const BUTTON_KEYS = {
	LOGIN: AUTH_TRANSLATION_KEYS.LOGIN,
	REGISTER: AUTH_TRANSLATION_KEYS.REGISTER,
	FORGOT_PASSWORD: AUTH_TRANSLATION_KEYS.FORGOT_PASSWORD,
	RESET_PASSWORD: AUTH_TRANSLATION_KEYS.RESET_PASSWORD,
	CONTINUE_WITH_GOOGLE: AUTH_TRANSLATION_KEYS.CONTINUE_WITH_GOOGLE,
	SIGNUP_WITH_GOOGLE: AUTH_TRANSLATION_KEYS.SIGNUP_WITH_GOOGLE,
	SUBMIT: AUTH_TRANSLATION_KEYS.SUBMIT,
	BACK: AUTH_TRANSLATION_KEYS.BACK,
} as const;
