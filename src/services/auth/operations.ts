/**
 * Authentication Operations - عمليات المصادقة
 * React hooks and operations for frontend authentication
 */

import { createContext, useContext, ReactNode } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { enhancedAuthService, type AuthUser, type LoginCredentials, type RegisterInput, type AuthState } from './enhanced-auth.service';
import { AuthCoreService } from "./core";
import { AuthUtils } from "./utils";
import {
	LoginResult,
	PasswordResetRequest,
	ProfileUpdateResult,
	AuthState as AuthStateType
} from "./types";
import {
	UpdateProfileInput,
	UpdatePreferencesInput
} from "@/odoo-schema-full/mutations/auth-mutations";

// ============================================================================
// AUTHENTICATION HOOK - Hook المصادقة
// ============================================================================

export function useAuth() {
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
	const login = useCallback(async (credentials: LoginCredentials) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

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
					title: 'تم تسجيل الدخول بنجاح',
					description: `مرحباً ${result.displayName}`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				});

				return { success: true };
			} else {
				setAuthState(prev => ({
					...prev,
					isLoading: false,
					error: result.errorMessage || 'فشل تسجيل الدخول',
				}));

				toast({
					title: 'فشل تسجيل الدخول',
					description: result.errorMessage || 'يرجى التحقق من البيانات المدخلة',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.errorMessage };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [toast]);

	// Register operation
	const register = useCallback(async (data: RegisterInput) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

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
						title: 'تم التسجيل بنجاح',
						description: 'تم إنشاء حسابك وتسجيل دخولك تلقائياً',
						status: 'success',
						duration: 3000,
						isClosable: true,
					});
				} else {
					setAuthState(prev => ({
						...prev,
						isLoading: false,
					}));

					toast({
						title: 'تم التسجيل بنجاح',
						description: result.verificationRequired
							? 'يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل'
							: 'يمكنك الآن تسجيل الدخول',
						status: 'success',
						duration: 5000,
						isClosable: true,
					});
				}

				return { success: true, verificationRequired: result.verificationRequired };
			} else {
				setAuthState(prev => ({
					...prev,
					isLoading: false,
					error: result.error || 'فشل التسجيل',
				}));

				toast({
					title: 'فشل التسجيل',
					description: result.error || 'يرجى التحقق من البيانات المدخلة',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.error };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [toast]);

	// Logout operation
	const logout = useCallback(async () => {
		setAuthState(prev => ({ ...prev, isLoading: true }));

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
				title: 'تم تسجيل الخروج',
				description: 'تم تسجيل خروجك بنجاح',
				status: 'info',
				duration: 3000,
				isClosable: true,
			});

			// Redirect to home page
			router.push('/');

			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الخروج';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في تسجيل الخروج',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [router, toast]);

	// Password reset request
	const requestPasswordReset = useCallback(async (email: string) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

		try {
			const result = await enhancedAuthService.requestPasswordReset(email);

			setAuthState(prev => ({ ...prev, isLoading: false }));

			if (result.success) {
				toast({
					title: 'تم إرسال رابط إعادة التعيين',
					description: 'يرجى التحقق من بريدك الإلكتروني',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});

				return { success: true };
			} else {
				toast({
					title: 'فشل إرسال رابط إعادة التعيين',
					description: result.error || 'يرجى المحاولة مرة أخرى',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.error };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [toast]);

	// Reset password
	const resetPassword = useCallback(async (resetToken: string, newPassword: string) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

		try {
			const result = await enhancedAuthService.resetPassword(resetToken, newPassword);

			setAuthState(prev => ({ ...prev, isLoading: false }));

			if (result.success) {
				toast({
					title: 'تم إعادة تعيين كلمة المرور',
					description: 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});

				// Redirect to login page
				router.push('/auth/login');

				return { success: true };
			} else {
				toast({
					title: 'فشل إعادة تعيين كلمة المرور',
					description: result.error || 'يرجى المحاولة مرة أخرى',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.error };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [router, toast]);

	// Change password
	const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

		try {
			const result = await enhancedAuthService.changePassword(currentPassword, newPassword);

			setAuthState(prev => ({ ...prev, isLoading: false }));

			if (result.success) {
				toast({
					title: 'تم تغيير كلمة المرور',
					description: 'تم تغيير كلمة المرور بنجاح',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});

				return { success: true };
			} else {
				toast({
					title: 'فشل تغيير كلمة المرور',
					description: result.error || 'يرجى التحقق من كلمة المرور الحالية',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.error };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [toast]);

	// Update profile
	const updateProfile = useCallback(async (profileData: UpdateProfileInput) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

		try {
			const result = await enhancedAuthService.updateProfile(profileData);

			if (result.success && result.user) {
				setAuthState(prev => ({
					...prev,
					user: result.user,
					isLoading: false,
				}));

				toast({
					title: 'تم تحديث الملف الشخصي',
					description: 'تم حفظ التغييرات بنجاح',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});

				return { success: true };
			} else {
				setAuthState(prev => ({
					...prev,
					isLoading: false,
					error: result.error || 'فشل تحديث الملف الشخصي',
				}));

				toast({
					title: 'فشل تحديث الملف الشخصي',
					description: result.error || 'يرجى المحاولة مرة أخرى',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.error };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [toast]);

	// Verify email
	const verifyEmail = useCallback(async (token: string) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

		try {
			const result = await enhancedAuthService.verifyEmail(token);

			if (result.success) {
				// Update user verification status
				const currentUser = authState.user;
				if (currentUser) {
					setAuthState(prev => ({
						...prev,
						user: { ...currentUser, isVerified: true },
						isLoading: false,
					}));
				}

				toast({
					title: 'تم التحقق من البريد الإلكتروني',
					description: 'تم تأكيد بريدك الإلكتروني بنجاح',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});

				return { success: true };
			} else {
				setAuthState(prev => ({
					...prev,
					isLoading: false,
					error: result.error || 'فشل التحقق من البريد الإلكتروني',
				}));

				toast({
					title: 'فشل التحقق من البريد الإلكتروني',
					description: result.error || 'يرجى المحاولة مرة أخرى',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.error };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [authState.user, toast]);

	// Resend verification email
	const resendVerification = useCallback(async (email: string) => {
		setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

		try {
			const result = await enhancedAuthService.resendVerification(email);

			setAuthState(prev => ({ ...prev, isLoading: false }));

			if (result.success) {
				toast({
					title: 'تم إرسال بريد التحقق',
					description: 'يرجى التحقق من بريدك الإلكتروني',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});

				return { success: true };
			} else {
				toast({
					title: 'فشل إرسال بريد التحقق',
					description: result.error || 'يرجى المحاولة مرة أخرى',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});

				return { success: false, error: result.error };
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';

			setAuthState(prev => ({
				...prev,
				isLoading: false,
				error: errorMessage,
			}));

			toast({
				title: 'خطأ في النظام',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});

			return { success: false, error: errorMessage };
		}
	}, [toast]);

	// Clear error
	const clearError = useCallback(() => {
		setAuthState(prev => ({ ...prev, error: null }));
	}, []);

	return {
		// State
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		error: authState.error,
		token: authState.token,
		refreshToken: authState.refreshToken,
		expiresAt: authState.expiresAt,

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

export function useProtectedRoute(redirectTo: string = '/auth/login') {
	const { isAuthenticated, isLoading } = useAuth();
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

export function useGuestRoute(redirectTo: string = '/dashboard') {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, isLoading, router, redirectTo]);

	return { isAuthenticated, isLoading };
}

// ============================================================================
// AUTHENTICATION CONTEXT - سياق المصادقة
// ============================================================================

interface AuthContextType {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
	register: (data: RegisterInput) => Promise<{ success: boolean; error?: string; verificationRequired?: boolean }>;
	logout: () => Promise<{ success: boolean; error?: string }>;
	requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
	resetPassword: (resetToken: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
	changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
	updateProfile: (profileData: UpdateProfileInput) => Promise<{ success: boolean; error?: string }>;
	verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
	resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const auth = useAuth();

	return (
		<AuthContext.Provider value={auth}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}

// ============================================================================
// EXPORTS - التصدير
// ============================================================================

export {
	enhancedAuthService,
	type AuthUser,
	type LoginCredentials,
	type RegisterInput,
	type AuthState,
} from './enhanced-auth.service';

export class AuthOperations {
	private coreService: AuthCoreService;
	private utils: AuthUtils;

	constructor() {
		this.coreService = AuthCoreService.getInstance();
		this.utils = new AuthUtils();
	}

	/**
	 * Login operation
	 */
	async login(credentials: LoginCredentials): Promise<LoginResult> {
		return await this.coreService.login(credentials);
	}

	/**
	 * Register operation
	 */
	async register(data: RegisterInput): Promise<{ success: boolean; message?: string; error?: string }> {
		const result = await this.coreService.register(data);
		return {
			success: result.success,
			message: result.message,
			error: result.error
		};
	}

	/**
	 * Logout operation
	 */
	async logout(): Promise<boolean> {
		return await this.coreService.logout();
	}

	/**
	 * Request password reset
	 */
	async requestPasswordReset(email: string): Promise<PasswordResetRequest> {
		// Implementation would go here
		return {
			success: true,
			message: "Password reset email sent",
			resetToken: "temp-token",
			expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
		};
	}

	/**
	 * Reset password
	 */
	async resetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
		// Implementation would go here
		return {
			success: true,
			message: "Password reset successfully"
		};
	}

	/**
	 * Change password
	 */
	async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
		// Implementation would go here
		return {
			success: true,
			message: "Password changed successfully"
		};
	}

	/**
	 * Update profile
	 */
	async updateProfile(input: UpdateProfileInput): Promise<ProfileUpdateResult> {
		// Implementation would go here
		return {
			success: true,
			message: "Profile updated successfully"
		};
	}

	/**
	 * Update preferences
	 */
	async updatePreferences(input: UpdatePreferencesInput): Promise<ProfileUpdateResult> {
		// Implementation would go here
		return {
			success: true,
			message: "Preferences updated successfully"
		};
	}

	/**
	 * Get authentication state
	 */
	getAuthState(): AuthStateType {
		const user = this.utils.getCurrentUser();
		const token = this.utils.getStoredToken();
		const refreshToken = this.utils.getStoredRefreshToken();
		const expiresAt = this.utils.getStoredExpiresAt();

		return {
			user,
			isAuthenticated: this.utils.isAuthenticated(),
			isLoading: false,
			error: null,
			token,
			refreshToken,
			expiresAt
		};
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		return this.utils.isAuthenticated();
	}

	/**
	 * Get current user
	 */
	getCurrentUser() {
		return this.utils.getCurrentUser();
	}
}