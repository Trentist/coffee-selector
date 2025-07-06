/**
 * Authentication Constants
 * ثوابت المصادقة
 */

import { AUTH_KEYS } from "./translation-keys";

// Auth form validation rules
export const AUTH_VALIDATION = {
	EMAIL_MIN_LENGTH: 3,
	EMAIL_MAX_LENGTH: 254,
	PASSWORD_MIN_LENGTH: 8,
	PASSWORD_MAX_LENGTH: 128,
	FIRST_NAME_MIN_LENGTH: 2,
	FIRST_NAME_MAX_LENGTH: 50,
	LAST_NAME_MIN_LENGTH: 2,
	LAST_NAME_MAX_LENGTH: 50,
	PHONE_MIN_LENGTH: 10,
	PHONE_MAX_LENGTH: 15,
} as const;

// Auth error messages
export const AUTH_ERROR_MESSAGES = {
	INVALID_EMAIL: AUTH_KEYS.INVALID_EMAIL,
	EMAIL_REQUIRED: AUTH_KEYS.EMAIL_REQUIRED,
	PASSWORD_REQUIRED: AUTH_KEYS.PASSWORD_REQUIRED,
	PASSWORD_MIN_LENGTH: AUTH_KEYS.PASSWORD_MIN_LENGTH,
	PASSWORDS_NOT_MATCH: AUTH_KEYS.PASSWORDS_NOT_MATCH,
	INVALID_CREDENTIALS: AUTH_KEYS.INVALID_CREDENTIALS,
} as const;

// Auth success messages
export const AUTH_SUCCESS_MESSAGES = {
	LOGIN_SUCCESS: AUTH_KEYS.LOGIN_SUCCESS,
	REGISTER_SUCCESS: AUTH_KEYS.REGISTER_SUCCESS,
	LOGOUT_SUCCESS: AUTH_KEYS.LOGOUT_SUCCESS,
} as const;

// Auth form fields
export const AUTH_FORM_FIELDS = {
	EMAIL: {
		name: "email",
		type: "email",
		placeholder: AUTH_KEYS.EMAIL_PLACEHOLDER,
		required: true,
		validation: {
			minLength: AUTH_VALIDATION.EMAIL_MIN_LENGTH,
			maxLength: AUTH_VALIDATION.EMAIL_MAX_LENGTH,
		},
	},
	PASSWORD: {
		name: "password",
		type: "password",
		placeholder: AUTH_KEYS.PASSWORD_PLACEHOLDER,
		required: true,
		validation: {
			minLength: AUTH_VALIDATION.PASSWORD_MIN_LENGTH,
			maxLength: AUTH_VALIDATION.PASSWORD_MAX_LENGTH,
		},
	},
	CONFIRM_PASSWORD: {
		name: "confirmPassword",
		type: "password",
		placeholder: AUTH_KEYS.CONFIRM_PASSWORD_PLACEHOLDER,
		required: true,
	},
	FIRST_NAME: {
		name: "firstName",
		type: "text",
		placeholder: "First Name",
		required: true,
		validation: {
			minLength: AUTH_VALIDATION.FIRST_NAME_MIN_LENGTH,
			maxLength: AUTH_VALIDATION.FIRST_NAME_MAX_LENGTH,
		},
	},
	LAST_NAME: {
		name: "lastName",
		type: "text",
		placeholder: "Last Name",
		required: true,
		validation: {
			minLength: AUTH_VALIDATION.LAST_NAME_MIN_LENGTH,
			maxLength: AUTH_VALIDATION.LAST_NAME_MAX_LENGTH,
		},
	},
	PHONE: {
		name: "phone",
		type: "tel",
		placeholder: "Phone Number",
		required: false,
		validation: {
			minLength: AUTH_VALIDATION.PHONE_MIN_LENGTH,
			maxLength: AUTH_VALIDATION.PHONE_MAX_LENGTH,
		},
	},
} as const;

// Auth routes
export const AUTH_ROUTES = {
	LOGIN: "/auth/login",
	REGISTER: "/auth/register",
	FORGOT_PASSWORD: "/auth/forgot-password",
	RESET_PASSWORD: "/auth/reset-password",
	VERIFY_EMAIL: "/auth/verify-email",
} as const;

// Auth session
export const AUTH_SESSION = {
	TOKEN_KEY: "auth_token",
	REFRESH_TOKEN_KEY: "refresh_token",
	USER_KEY: "user_data",
	EXPIRY_KEY: "token_expiry",
	SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
	REFRESH_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
