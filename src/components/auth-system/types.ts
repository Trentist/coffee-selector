/**
 * Authentication System Types
 * أنواع نظام المصادقة
 */

export type AuthFormType =
	| "login"
	| "register"
	| "forgot-password"
	| "reset-password";

export interface AuthFormData {
	email: string;
	password: string;
	confirmPassword?: string;
	name?: string;
	phone?: string;
	rememberMe?: boolean;
	agreeToTerms?: boolean;
}

export interface AuthValidationErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
	name?: string;
	phone?: string;
	agreeToTerms?: string;
	general?: string;
}

export interface AuthFormProps {
	formType: AuthFormType;
	onSuccess?: () => void;
	onError?: (error: string) => void;
	onSwitchForm?: (type: AuthFormType) => void;
	redirectTo?: string;
}

export interface AuthLayoutProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	image?: string;
}

export interface AuthInputProps {
	name: string;
	label: string;
	placeholder?: string;
	type?: "text" | "email" | "password" | "tel";
	required?: boolean;
	error?: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	icon?: React.ReactNode;
	showPasswordToggle?: boolean;
}

export interface AuthButtonProps {
	title: string;
	onClick: () => void;
	isLoading?: boolean;
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
	icon?: React.ReactNode;
	disabled?: boolean;
}

export interface AuthAnimationProps {
	children: React.ReactNode;
	animationType: "slideIn" | "fadeIn" | "scaleIn" | "slideUp";
	duration?: number;
	delay?: number;
}
