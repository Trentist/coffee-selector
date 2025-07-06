/**
 * React Authentication Hooks - React Hooks للمصادقة
 * Custom hooks for authentication in React components
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import {
	enhancedAuthService,
	type AuthUser,
	type LoginCredentials,
	type RegisterInput,
	type AuthState,
} from "./enhanced-auth.service";
import { AuthOperations } from "./operations";
import {
	AuthState as AuthStateType,
	LoginResult,
	ProfileUpdateResult,
} from "./types";
import {
	UpdateProfileInput,
	UpdatePreferencesInput,
} from "@/odoo-schema-full/mutations/auth-mutations";

// ============================================================================
// USE AUTHENTICATION HOOK - Hook المصادقة الرئيسي
// ============================================================================

export function useAuthentication() {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
		error: null,
		token: null,
		refreshToken: null,
		expiresAt: null,
	});

	const router = useRouter();
	const toast = useToast();

	// Initialize auth state on mount
	useEffect(() => {
		const initializeAuth = () => {
			const state = enhancedAuthService.getAuthState();
			setAuthState({
				...state,
				isLoading: false,
			});
		};

		initializeAuth();
	}, []);

	// Login operation
	const login = useCallback(
		async (credentials: LoginCredentials) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.login(credentials);

				if (result.success) {
					setAuthState({
						user: result.user || null,
						isAuthenticated: true,
						isLoading: false,
						error: null,
						token: result.token || null,
						refreshToken: result.refreshToken || null,
						expiresAt: result.expiresAt || null,
					});

					toast({
						title: "تم تسجيل الدخول بنجاح",
						description: `مرحباً ${result.displayName}`,
						status: "success",
						duration: 3000,
						isClosable: true,
					});

					return { success: true };
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: result.errorMessage || "فشل تسجيل الدخول",
					}));

					toast({
						title: "فشل تسجيل الدخول",
						description:
							result.errorMessage || "يرجى التحقق من البيانات المدخلة",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.errorMessage };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[toast],
	);

	// Register operation
	const register = useCallback(
		async (data: RegisterInput) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.register(data);

				if (result.success) {
					// Auto-login if token is provided
					if (result.token && result.user) {
						setAuthState({
							user: result.user,
							isAuthenticated: true,
							isLoading: false,
							error: null,
							token: result.token,
							refreshToken: result.refreshToken || null,
							expiresAt: result.expiresAt || null,
						});

						toast({
							title: "تم التسجيل بنجاح",
							description: "تم إنشاء حسابك وتسجيل دخولك تلقائياً",
							status: "success",
							duration: 3000,
							isClosable: true,
						});
					} else {
						setAuthState((prev) => ({
							...prev,
							isLoading: false,
						}));

						toast({
							title: "تم التسجيل بنجاح",
							description: result.verificationRequired
								? "يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل"
								: "يمكنك الآن تسجيل الدخول",
							status: "success",
							duration: 5000,
							isClosable: true,
						});
					}

					return {
						success: true,
						verificationRequired: result.verificationRequired,
					};
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: result.error || "فشل التسجيل",
					}));

					toast({
						title: "فشل التسجيل",
						description: result.error || "يرجى التحقق من البيانات المدخلة",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[toast],
	);

	// Logout operation
	const logout = useCallback(async () => {
		setAuthState((prev) => ({ ...prev, isLoading: true }));

		try {
			const success = await enhancedAuthService.logout();

			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
				token: null,
				refreshToken: null,
				expiresAt: null,
			});

			toast({
				title: "تم تسجيل الخروج",
				description: "تم تسجيل خروجك بنجاح",
				status: "info",
				duration: 3000,
				isClosable: true,
			});

			// Redirect to home page
			router.push("/");

			return { success: true };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الخروج";

			setAuthState((prev) => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: "خطأ في تسجيل الخروج",
				description: errorMessage,
				status: "error",
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [router, toast]);

	// Password reset request
	const requestPasswordReset = useCallback(
		async (email: string) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.requestPasswordReset(email);

				setAuthState((prev) => ({ ...prev, isLoading: false }));

				if (result.success) {
					toast({
						title: "تم إرسال رابط إعادة التعيين",
						description: "يرجى التحقق من بريدك الإلكتروني",
						status: "success",
						duration: 5000,
						isClosable: true,
					});

					return { success: true };
				} else {
					toast({
						title: "فشل إرسال رابط إعادة التعيين",
						description: result.error || "يرجى المحاولة مرة أخرى",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[toast],
	);

	// Reset password
	const resetPassword = useCallback(
		async (resetToken: string, newPassword: string) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.resetPassword(
					resetToken,
					newPassword,
				);

				setAuthState((prev) => ({ ...prev, isLoading: false }));

				if (result.success) {
					toast({
						title: "تم إعادة تعيين كلمة المرور",
						description: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة",
						status: "success",
						duration: 5000,
						isClosable: true,
					});

					// Redirect to login page
					router.push("/auth/login");

					return { success: true };
				} else {
					toast({
						title: "فشل إعادة تعيين كلمة المرور",
						description: result.error || "يرجى المحاولة مرة أخرى",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[router, toast],
	);

	// Change password
	const changePassword = useCallback(
		async (currentPassword: string, newPassword: string) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.changePassword(
					currentPassword,
					newPassword,
				);

				setAuthState((prev) => ({ ...prev, isLoading: false }));

				if (result.success) {
					toast({
						title: "تم تغيير كلمة المرور",
						description: "تم تغيير كلمة المرور بنجاح",
						status: "success",
						duration: 3000,
						isClosable: true,
					});

					return { success: true };
				} else {
					toast({
						title: "فشل تغيير كلمة المرور",
						description: result.error || "يرجى التحقق من كلمة المرور الحالية",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[toast],
	);

	// Update profile
	const updateProfile = useCallback(
		async (profileData: any) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.updateProfile(profileData);

				if (result.success && result.user) {
					setAuthState((prev) => ({
						...prev,
						user: result.user,
						isLoading: false,
					}));

					toast({
						title: "تم تحديث الملف الشخصي",
						description: "تم حفظ التغييرات بنجاح",
						status: "success",
						duration: 3000,
						isClosable: true,
					});

					return { success: true };
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: result.error || "فشل تحديث الملف الشخصي",
					}));

					toast({
						title: "فشل تحديث الملف الشخصي",
						description: result.error || "يرجى المحاولة مرة أخرى",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[toast],
	);

	// Verify email
	const verifyEmail = useCallback(
		async (token: string) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.verifyEmail(token);

				if (result.success) {
					// Update user verification status
					const currentUser = authState.user;
					if (currentUser) {
						setAuthState((prev) => ({
							...prev,
							user: { ...currentUser, isVerified: true },
							isLoading: false,
						}));
					}

					toast({
						title: "تم التحقق من البريد الإلكتروني",
						description: "تم تأكيد بريدك الإلكتروني بنجاح",
						status: "success",
						duration: 5000,
						isClosable: true,
					});

					return { success: true };
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: result.error || "فشل التحقق من البريد الإلكتروني",
					}));

					toast({
						title: "فشل التحقق من البريد الإلكتروني",
						description: result.error || "يرجى المحاولة مرة أخرى",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[authState.user, toast],
	);

	// Resend verification email
	const resendVerification = useCallback(
		async (email: string) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await enhancedAuthService.resendVerification(email);

				setAuthState((prev) => ({ ...prev, isLoading: false }));

				if (result.success) {
					toast({
						title: "تم إرسال بريد التحقق",
						description: "يرجى التحقق من بريدك الإلكتروني",
						status: "success",
						duration: 5000,
						isClosable: true,
					});

					return { success: true };
				} else {
					toast({
						title: "فشل إرسال بريد التحقق",
						description: result.error || "يرجى المحاولة مرة أخرى",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "حدث خطأ غير متوقع";

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ في النظام",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[toast],
	);

	// Clear error
	const clearError = useCallback(() => {
		setAuthState((prev) => ({ ...prev, error: null }));
	}, []);

	// Memoized values
	const isAdmin = useMemo(() => {
		return authState.user?.role === "admin";
	}, [authState.user?.role]);

	const isVerified = useMemo(() => {
		return authState.user?.isVerified || false;
	}, [authState.user?.isVerified]);

	const hasRole = useCallback(
		(role: string) => {
			return authState.user?.role === role;
		},
		[authState.user?.role],
	);

	const hasAnyRole = useCallback(
		(roles: string[]) => {
			return authState.user ? roles.includes(authState.user.role) : false;
		},
		[authState.user],
	);

	return {
		// State
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		error: authState.error,
		token: authState.token,
		refreshToken: authState.refreshToken,
		expiresAt: authState.expiresAt,

		// Computed values
		isAdmin,
		isVerified,
		hasRole,
		hasAnyRole,

		// Operations
		login,
		register,
		logout,
		requestPasswordReset,
		resetPassword,
		changePassword,
		updateProfile,
		verifyEmail,
		resendVerification,
		clearError,
	};
}

// ============================================================================
// PROTECTED ROUTE HOOK - Hook المسار المحمي
// ============================================================================

export function useProtectedRoute(redirectTo: string = "/auth/login") {
	const { isAuthenticated, isLoading } = useAuthentication();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, isLoading, router, redirectTo]);

	return { isAuthenticated, isLoading };
}

// ============================================================================
// GUEST ROUTE HOOK - Hook المسار للزوار
// ============================================================================

export function useGuestRoute(redirectTo: string = "/dashboard") {
	const { isAuthenticated, isLoading } = useAuthentication();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, isLoading, router, redirectTo]);

	return { isAuthenticated, isLoading };
}

// ============================================================================
// ROLE-BASED ROUTE HOOK - Hook المسار حسب الدور
// ============================================================================

export function useRoleRoute(
	allowedRoles: string[],
	redirectTo: string = "/unauthorized",
) {
	const { isAuthenticated, isLoading, hasAnyRole } = useAuthentication();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				router.push("/auth/login");
			} else if (!hasAnyRole(allowedRoles)) {
				router.push(redirectTo);
			}
		}
	}, [
		isAuthenticated,
		isLoading,
		hasAnyRole,
		allowedRoles,
		router,
		redirectTo,
	]);

	return { isAuthenticated, isLoading, hasAccess: hasAnyRole(allowedRoles) };
}

// ============================================================================
// AUTHENTICATION FORM HOOK - Hook نموذج المصادقة
// ============================================================================

export function useAuthForm() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		phone: "",
		acceptTerms: false,
		rememberMe: false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateField = useCallback(
		(field: string, value: any) => {
			setFormData((prev) => ({ ...prev, [field]: value }));

			// Clear error for this field
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: "" }));
			}
		},
		[errors],
	);

	const validateForm = useCallback(() => {
		const newErrors: Record<string, string> = {};

		// Email validation
		if (!formData.email) {
			newErrors.email = "البريد الإلكتروني مطلوب";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "البريد الإلكتروني غير صحيح";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "كلمة المرور مطلوبة";
		} else if (formData.password.length < 8) {
			newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
		} else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password =
				"كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم";
		}

		// Confirm password validation
		if (
			formData.confirmPassword &&
			formData.password !== formData.confirmPassword
		) {
			newErrors.confirmPassword = "كلمات المرور غير متطابقة";
		}

		// Name validation
		if (!formData.name) {
			newErrors.name = "الاسم مطلوب";
		}

		// Terms validation
		if (!formData.acceptTerms) {
			newErrors.acceptTerms = "يجب الموافقة على الشروط والأحكام";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const resetForm = useCallback(() => {
		setFormData({
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
			phone: "",
			acceptTerms: false,
			rememberMe: false,
		});
		setErrors({});
		setIsSubmitting(false);
	}, []);

	return {
		formData,
		errors,
		isSubmitting,
		updateField,
		validateForm,
		resetForm,
		setIsSubmitting,
	};
}

// ============================================================================
// PASSWORD STRENGTH HOOK - Hook قوة كلمة المرور
// ============================================================================

export function usePasswordStrength(password: string) {
	const strength = useMemo(() => {
		if (!password) return { score: 0, strength: "weak", feedback: [] };

		let score = 0;
		const feedback: string[] = [];

		// Length check
		if (password.length >= 8) {
			score += 1;
		} else {
			feedback.push("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
		}

		// Uppercase check
		if (/[A-Z]/.test(password)) {
			score += 1;
		} else {
			feedback.push("يجب أن تحتوي على حرف كبير واحد على الأقل");
		}

		// Lowercase check
		if (/[a-z]/.test(password)) {
			score += 1;
		} else {
			feedback.push("يجب أن تحتوي على حرف صغير واحد على الأقل");
		}

		// Number check
		if (/\d/.test(password)) {
			score += 1;
		} else {
			feedback.push("يجب أن تحتوي على رقم واحد على الأقل");
		}

		// Special character check
		if (/[@$!%*?&]/.test(password)) {
			score += 1;
		} else {
			feedback.push("يجب أن تحتوي على رمز خاص واحد على الأقل (@$!%*?&)");
		}

		// Determine strength
		let strengthLevel: "weak" | "medium" | "strong" | "very-strong";
		if (score <= 2) {
			strengthLevel = "weak";
		} else if (score <= 3) {
			strengthLevel = "medium";
		} else if (score <= 4) {
			strengthLevel = "strong";
		} else {
			strengthLevel = "very-strong";
		}

		return { score, strength: strengthLevel, feedback };
	}, [password]);

	return strength;
}

export const useAuth = () => {
	const [authState, setAuthState] = useState<AuthStateType>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
		error: null,
		token: null,
		refreshToken: null,
		expiresAt: null,
	});

	const authOperations = new AuthOperations();

	// Initialize auth state
	useEffect(() => {
		const state = authOperations.getAuthState();
		setAuthState((prev) => ({ ...prev, ...state, isLoading: false }));
	}, []);

	// Login hook
	const login = useCallback(
		async (credentials: LoginCredentials): Promise<LoginResult> => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await authOperations.login(credentials);

				if (result.success) {
					const newState = authOperations.getAuthState();
					setAuthState((prev) => ({ ...prev, ...newState, isLoading: false }));
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: result.errorMessage || "Login failed",
					}));
				}

				return result;
			} catch (error: any) {
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: error.message || "Login failed",
				}));
				return { success: false, errorMessage: error.message };
			}
		},
		[authOperations],
	);

	// Register hook
	const register = useCallback(
		async (data: RegisterInput) => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await authOperations.register(data);

				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: result.error || null,
				}));

				return result;
			} catch (error: any) {
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: error.message || "Registration failed",
				}));
				return { success: false, error: error.message };
			}
		},
		[authOperations],
	);

	// Logout hook
	const logout = useCallback(async () => {
		setAuthState((prev) => ({ ...prev, isLoading: true }));

		try {
			await authOperations.logout();
			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
				token: null,
				refreshToken: null,
				expiresAt: null,
			});
		} catch (error: any) {
			setAuthState((prev) => ({
				...prev,
				isLoading: false,
				error: error.message || "Logout failed",
			}));
		}
	}, [authOperations]);

	// Update profile hook
	const updateProfile = useCallback(
		async (input: UpdateProfileInput): Promise<ProfileUpdateResult> => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await authOperations.updateProfile(input);

				if (result.success) {
					const newState = authOperations.getAuthState();
					setAuthState((prev) => ({ ...prev, ...newState, isLoading: false }));
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: result.error || "Profile update failed",
					}));
				}

				return result;
			} catch (error: any) {
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: error.message || "Profile update failed",
				}));
				return { success: false, error: error.message };
			}
		},
		[authOperations],
	);

	// Update preferences hook
	const updatePreferences = useCallback(
		async (input: UpdatePreferencesInput): Promise<ProfileUpdateResult> => {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await authOperations.updatePreferences(input);

				if (result.success) {
					const newState = authOperations.getAuthState();
					setAuthState((prev) => ({ ...prev, ...newState, isLoading: false }));
				} else {
					setAuthState((prev) => ({
						...prev,
						isLoading: false,
						error: result.error || "Preferences update failed",
					}));
				}

				return result;
			} catch (error: any) {
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: error.message || "Preferences update failed",
				}));
				return { success: false, error: error.message };
			}
		},
		[authOperations],
	);

	// Clear error hook
	const clearError = useCallback(() => {
		setAuthState((prev) => ({ ...prev, error: null }));
	}, []);

	return {
		// State
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		error: authState.error,
		token: authState.token,

		// Actions
		login,
		register,
		logout,
		updateProfile,
		updatePreferences,
		clearError,

		// Utilities
		getCurrentUser: authOperations.getCurrentUser.bind(authOperations),
		isAuthenticated: authOperations.isAuthenticated.bind(authOperations),
	};
};
