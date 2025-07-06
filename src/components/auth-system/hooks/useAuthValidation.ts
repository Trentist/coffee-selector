/**
 * Authentication Validation Hook
 * Hook للتحقق من صحة بيانات المصادقة
 */

import { useCallback } from "react";
import type { AuthFormData, AuthValidationErrors } from "../types";

export const useAuthValidation = () => {
	// Email validation
	const validateEmail = useCallback((email: string): string | undefined => {
		if (!email) {
			return "البريد الإلكتروني مطلوب";
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return "البريد الإلكتروني غير صحيح";
		}

		return undefined;
	}, []);

	// Password validation
	const validatePassword = useCallback(
		(password: string): string | undefined => {
			if (!password) {
				return "كلمة المرور مطلوبة";
			}

			if (password.length < 6) {
				return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
			}

			// Optional: Add more password strength requirements
			const hasUpperCase = /[A-Z]/.test(password);
			const hasLowerCase = /[a-z]/.test(password);
			const hasNumbers = /\d/.test(password);
			const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

			if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
				return "كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورمز خاص";
			}

			return undefined;
		},
		[],
	);

	// Confirm password validation
	const validateConfirmPassword = useCallback(
		(password: string, confirmPassword: string): string | undefined => {
			if (!confirmPassword) {
				return "تأكيد كلمة المرور مطلوب";
			}

			if (password !== confirmPassword) {
				return "كلمة المرور غير متطابقة";
			}

			return undefined;
		},
		[],
	);

	// Name validation
	const validateName = useCallback((name: string): string | undefined => {
		if (!name?.trim()) {
			return "الاسم مطلوب";
		}

		if (name.trim().length < 2) {
			return "الاسم يجب أن يكون حرفين على الأقل";
		}

		if (name.trim().length > 50) {
			return "الاسم يجب أن يكون أقل من 50 حرف";
		}

		return undefined;
	}, []);

	// Phone validation
	const validatePhone = useCallback((phone: string): string | undefined => {
		if (!phone) {
			return undefined; // Phone is optional
		}

		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
		if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
			return "رقم الهاتف غير صحيح";
		}

		return undefined;
	}, []);

	// Terms agreement validation
	const validateTerms = useCallback(
		(agreeToTerms: boolean): string | undefined => {
			if (!agreeToTerms) {
				return "يجب الموافقة على الشروط والأحكام";
			}

			return undefined;
		},
		[],
	);

	// Validate entire form
	const validateForm = useCallback(
		(
			formData: AuthFormData,
			formType: "login" | "register" | "forgot-password" | "reset-password",
		): AuthValidationErrors => {
			const errors: AuthValidationErrors = {};

			// Email validation (required for all forms)
			const emailError = validateEmail(formData.email);
			if (emailError) {
				errors.email = emailError;
			}

			// Password validation (required for login, register, reset-password)
			if (
				formType === "login" ||
				formType === "register" ||
				formType === "reset-password"
			) {
				const passwordError = validatePassword(formData.password);
				if (passwordError) {
					errors.password = passwordError;
				}
			}

			// Confirm password validation (required for register, reset-password)
			if (formType === "register" || formType === "reset-password") {
				const confirmPasswordError = validateConfirmPassword(
					formData.password,
					formData.confirmPassword || "",
				);
				if (confirmPasswordError) {
					errors.confirmPassword = confirmPasswordError;
				}
			}

			// Name validation (required for register)
			if (formType === "register") {
				const nameError = validateName(formData.name || "");
				if (nameError) {
					errors.name = nameError;
				}
			}

			// Phone validation (optional for register)
			if (formType === "register" && formData.phone) {
				const phoneError = validatePhone(formData.phone);
				if (phoneError) {
					errors.phone = phoneError;
				}
			}

			// Terms agreement validation (required for register)
			if (formType === "register") {
				const termsError = validateTerms(formData.agreeToTerms || false);
				if (termsError) {
					errors.agreeToTerms = termsError;
				}
			}

			return errors;
		},
		[
			validateEmail,
			validatePassword,
			validateConfirmPassword,
			validateName,
			validatePhone,
			validateTerms,
		],
	);

	// Get password strength
	const getPasswordStrength = useCallback(
		(password: string): { score: number; color: string; text: string } => {
			if (password.length === 0) {
				return { score: 0, color: "gray", text: "" };
			}

			let score = 0;
			let feedback = "";

			// Length check
			if (password.length >= 8) score += 1;
			if (password.length >= 12) score += 1;

			// Character variety checks
			if (/[a-z]/.test(password)) score += 1;
			if (/[A-Z]/.test(password)) score += 1;
			if (/\d/.test(password)) score += 1;
			if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

			// Determine strength level
			if (score <= 2) {
				return { score: 1, color: "red", text: "ضعيف" };
			} else if (score <= 4) {
				return { score: 2, color: "orange", text: "متوسط" };
			} else if (score <= 6) {
				return { score: 3, color: "yellow", text: "جيد" };
			} else {
				return { score: 4, color: "green", text: "قوي" };
			}
		},
		[],
	);

	return {
		validateEmail,
		validatePassword,
		validateConfirmPassword,
		validateName,
		validatePhone,
		validateTerms,
		validateForm,
		getPasswordStrength,
	};
};
