"use client";

/**
 * Authentication Form Hook
 * Hook لإدارة نموذج المصادقة
 */

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import type {
	AuthFormData,
	AuthFormType,
	AuthValidationErrors,
} from "../types";

export const useAuthForm = (formType: AuthFormType) => {
	const { login, register, forgotPassword, resetPassword } = useAuth();
	const toast = useToast();
	const router = useRouter();

	const [formData, setFormData] = useState<AuthFormData>({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		phone: "",
		rememberMe: false,
		agreeToTerms: false,
	});

	const [errors, setErrors] = useState<AuthValidationErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	// Handle input changes
	const handleInputChange = useCallback(
		(field: keyof AuthFormData, value: string | boolean) => {
			setFormData((prev) => ({ ...prev, [field]: value }));

			// Clear error when user starts typing
			if (errors[field as keyof AuthValidationErrors]) {
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		},
		[errors],
	);

	// Validate form
	const validateForm = useCallback((): boolean => {
		const newErrors: AuthValidationErrors = {};

		// Email validation
		if (!formData.email) {
			newErrors.email = "البريد الإلكتروني مطلوب";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "البريد الإلكتروني غير صحيح";
		}

		// Password validation for login and register
		if (
			formType === "login" ||
			formType === "register" ||
			formType === "reset-password"
		) {
			if (!formData.password) {
				newErrors.password = "كلمة المرور مطلوبة";
			} else if (formData.password.length < 6) {
				newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
			}
		}

		// Confirm password validation for register and reset-password
		if (formType === "register" || formType === "reset-password") {
			if (!formData.confirmPassword) {
				newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
			} else if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "كلمة المرور غير متطابقة";
			}
		}

		// Name validation for register
		if (formType === "register") {
			if (!formData.name?.trim()) {
				newErrors.name = "الاسم مطلوب";
			} else if (formData.name.trim().length < 2) {
				newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
			}
		}

		// Terms agreement validation for register
		if (formType === "register" && !formData.agreeToTerms) {
			newErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData, formType]);

	// Handle form submission
	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return { success: false, error: "يرجى تصحيح الأخطاء" };
		}

		setIsLoading(true);
		setErrors({});

		try {
			let result;

			switch (formType) {
				case "login":
					result = await login({
						email: formData.email,
						password: formData.password,
						rememberMe: formData.rememberMe || false,
					});
					break;

				case "register":
					result = await register({
						name: formData.name || "",
						email: formData.email,
						password: formData.password,
						phone: formData.phone || "",
					});
					break;

				case "forgot-password":
					result = await forgotPassword(formData.email);
					break;

				case "reset-password":
					// This would need a token from URL params
					result = await resetPassword(formData.password);
					break;

				default:
					throw new Error("نوع النموذج غير معروف");
			}

			if (result.success) {
				toast({
					title: "نجح",
					description: getSuccessMessage(formType),
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				// Redirect based on form type
				if (formType === "login" || formType === "register") {
					router.push("/dashboard");
				} else if (formType === "reset-password") {
					router.push("/auth/login");
				}

				return { success: true };
			} else {
				setErrors({ general: result.error || "حدث خطأ غير متوقع" });
				return { success: false, error: result.error };
			}
		} catch (error: any) {
			const errorMessage = error.message || "حدث خطأ غير متوقع";
			setErrors({ general: errorMessage });

			toast({
				title: "خطأ",
				description: errorMessage,
				status: "error",
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	}, [
		formData,
		formType,
		validateForm,
		login,
		register,
		forgotPassword,
		resetPassword,
		toast,
		router,
	]);

	// Get success message based on form type
	const getSuccessMessage = (type: AuthFormType): string => {
		switch (type) {
			case "login":
				return "تم تسجيل الدخول بنجاح";
			case "register":
				return "تم إنشاء الحساب بنجاح";
			case "forgot-password":
				return "تم إرسال رابط إعادة التعيين";
			case "reset-password":
				return "تم تغيير كلمة المرور بنجاح";
			default:
				return "تمت العملية بنجاح";
		}
	};

	// Reset form
	const resetForm = useCallback(() => {
		setFormData({
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
			phone: "",
			rememberMe: false,
			agreeToTerms: false,
		});
		setErrors({});
	}, []);

	return {
		formData,
		errors,
		isLoading,
		handleInputChange,
		handleSubmit,
		resetForm,
	};
};
