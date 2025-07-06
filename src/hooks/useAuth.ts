/**
 * Authentication Hook
 * Hook المصادقة المتكامل
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

export interface AuthState {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	token: string | null;
}

export const useAuth = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const toast = useToast();

	const [state, setState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
		error: null,
		token: null,
	});

	// Initialize auth state
	useEffect(() => {
		const initializeAuth = () => {
			if (status === "loading") {
				setState((prev) => ({ ...prev, isLoading: true }));
				return;
			}

			if (status === "authenticated" && session?.user) {
				const user: AuthUser = {
					id: parseInt(session.user.id || "0"),
					name: session.user.name || "",
					email: session.user.email || "",
					login: session.user.email || "",
					partner_id: 0,
					active: true,
					sessionId: session.accessToken || "",
				};

				setState({
					user,
					isAuthenticated: true,
					isLoading: false,
					error: null,
					token: session.accessToken || null,
				});
			} else {
				setState({
					user: null,
					isAuthenticated: false,
					isLoading: false,
					error: null,
					token: null,
				});
			}
		};

		initializeAuth();
	}, [session, status]);

	/**
	 * Login function
	 */
	const login = useCallback(
		async (credentials: LoginCredentials) => {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await signIn("credentials", {
					email: credentials.email,
					password: credentials.password,
					rememberMe: credentials.rememberMe,
					redirect: false,
				});

				if (result?.error) {
					setState((prev) => ({
						...prev,
						isLoading: false,
						error: result.error,
					}));

					toast({
						title: "فشل تسجيل الدخول",
						description: result.error,
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return { success: false, error: result.error };
				}

				if (result?.ok) {
					toast({
						title: "نجح تسجيل الدخول",
						description: "تم تسجيل الدخول بنجاح",
						status: "success",
						duration: 3000,
						isClosable: true,
					});

					// Redirect to intended page or home
					const searchParams = useSearchParams();
					const callbackUrl = searchParams.get('callbackUrl') || "/";
					router.push(callbackUrl);

					return { success: true };
				}

				return { success: false, error: "Login failed" };
			} catch {
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: "فشل في تسجيل الدخول",
				}));

				toast({
					title: "خطأ",
					description: "فشل في تسجيل الدخول",
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: "فشل في تسجيل الدخول" };
			}
		},
		[router, toast],
	);

	/**
	 * Register function
	 */
	const register = useCallback(
		async (data: RegisterData) => {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				const result = await authService.register(data);

				if (result.success) {
					setState((prev) => ({ ...prev, isLoading: false, error: null }));

					toast({
						title: "نجح إنشاء الحساب",
						description: result.message || "تم إنشاء الحساب بنجاح",
						status: "success",
						duration: 5000,
						isClosable: true,
					});

					// Auto-login after successful registration
					setTimeout(() => {
						login({ email: data.email, password: data.password });
					}, 2000);

					return result;
				} else {
					setState((prev) => ({
						...prev,
						isLoading: false,
						error: result.error || null,
					}));

					toast({
						title: "فشل إنشاء الحساب",
						description: result.error || "حدث خطأ أثناء إنشاء الحساب",
						status: "error",
						duration: 5000,
						isClosable: true,
					});

					return result;
				}
			} catch (error) {
				const errorMessage = "حدث خطأ غير متوقع";
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[login, toast],
	);

	/**
	 * Logout function
	 */
	const logout = useCallback(async () => {
		setState((prev) => ({ ...prev, isLoading: true }));

		try {
			await signOut({ redirect: false });

			setState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
				token: null,
			});

			toast({
				title: "تم تسجيل الخروج",
				description: "تم تسجيل الخروج بنجاح",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			router.push("/");
		} catch (error) {
			setState((prev) => ({ ...prev, isLoading: false }));

			toast({
				title: "خطأ",
				description: "حدث خطأ أثناء تسجيل الخروج",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	}, [router, toast]);

	/**
	 * Forgot password function
	 */
	const forgotPassword = useCallback(
		async (email: string) => {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				// Implement forgot password logic
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

				toast({
					title: "تم إرسال رابط إعادة التعيين",
					description:
						"تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
					status: "success",
					duration: 5000,
					isClosable: true,
				});

				setState((prev) => ({ ...prev, isLoading: false }));
				return { success: true };
			} catch (error) {
				const errorMessage = "حدث خطأ أثناء إرسال رابط إعادة التعيين";
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ",
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

	/**
	 * Reset password function
	 */
	const resetPassword = useCallback(
		async (token: string, newPassword: string) => {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				// Implement reset password logic
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

				toast({
					title: "تم إعادة تعيين كلمة المرور",
					description: "تم إعادة تعيين كلمة المرور بنجاح",
					status: "success",
					duration: 5000,
					isClosable: true,
				});

				setState((prev) => ({ ...prev, isLoading: false }));
				router.push("/auth/login");
				return { success: true };
			} catch (error) {
				const errorMessage = "حدث خطأ أثناء إعادة تعيين كلمة المرور";
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ",
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

	/**
	 * Update profile function
	 */
	const updateProfile = useCallback(
		async (profileData: Partial<AuthUser>) => {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				// Implement update profile logic
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

				if (state.user) {
					const updatedUser = { ...state.user, ...profileData };
					setState((prev) => ({
						...prev,
						user: updatedUser,
						isLoading: false,
					}));
				}

				toast({
					title: "تم تحديث الملف الشخصي",
					description: "تم تحديث الملف الشخصي بنجاح",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				return { success: true };
			} catch (error) {
				const errorMessage = "حدث خطأ أثناء تحديث الملف الشخصي";
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: errorMessage };
			}
		},
		[state.user, toast],
	);

	/**
	 * Change password function
	 */
	const changePassword = useCallback(
		async (currentPassword: string, newPassword: string) => {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			try {
				// Implement change password logic
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

				toast({
					title: "تم تغيير كلمة المرور",
					description: "تم تغيير كلمة المرور بنجاح",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				setState((prev) => ({ ...prev, isLoading: false }));
				return { success: true };
			} catch (error) {
				const errorMessage = "حدث خطأ أثناء تغيير كلمة المرور";
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));

				toast({
					title: "خطأ",
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

	return {
		// State
		...state,

		// Actions
		login,
		register,
		logout,
		forgotPassword,
		resetPassword,
		updateProfile,
		changePassword,

		// Session info
		session,
		status,
	};
};
