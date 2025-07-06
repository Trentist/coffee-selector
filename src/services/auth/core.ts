/**
 * Core Authentication Service - الخدمة الأساسية للمصادقة
 */

import { GraphQLClient } from "graphql-request";
import {
	LOGIN_MUTATION,
	REGISTER_MUTATION,
	LOGOUT_MUTATION,
	type LoginCredentials,
	type RegisterInput,
	type AuthResponse,
} from "@/odoo-schema-full/mutations/auth-mutations";
import { LoginResult, PasswordResetRequest } from "./types";
import { AuthUtils } from "./utils";

export class AuthCoreService {
	private static instance: AuthCoreService;
	private client: GraphQLClient;
	private utils: AuthUtils;

	private constructor() {
		const odooUrl =
			process.env.NEXT_PUBLIC_ODOO_URL ||
			"https://coffee-selection-staging-20784644.dev.odoo.com";
		const graphqlUrl = `${odooUrl}/graphql/vsf`;

		this.client = new GraphQLClient(graphqlUrl, {
			headers: {
				"Content-Type": "application/json",
				...(process.env.NEXT_PUBLIC_ODOO_API_TOKEN && {
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_ODOO_API_TOKEN}`,
				}),
			},
			timeout: 30000,
		});

		this.utils = new AuthUtils();
	}

	public static getInstance(): AuthCoreService {
		if (!AuthCoreService.instance) {
			AuthCoreService.instance = new AuthCoreService();
		}
		return AuthCoreService.instance;
	}

	/**
	 * Login user with enhanced security
	 */
	async login(credentials: LoginCredentials): Promise<LoginResult> {
		try {
			// Rate limiting check
			if (this.utils.isRateLimited("login", credentials.email)) {
				return {
					success: false,
					errorMessage: "Too many login attempts. Please try again later.",
				};
			}

			// Input validation
			if (
				!this.utils.validateEmail(credentials.email) ||
				!this.utils.validatePassword(credentials.password)
			) {
				return {
					success: false,
					errorMessage: "Invalid email or password format.",
				};
			}

			const variables = {
				email: credentials.email.toLowerCase().trim(),
				password: credentials.password,
				rememberMe: credentials.rememberMe || false,
			};

			const result = await this.client.request(LOGIN_MUTATION, variables);

			if (
				result?.login?.success &&
				result?.login?.user &&
				result?.login?.token
			) {
				const user = result.login.user;
				const token = result.login.token;
				const refreshToken = result.login.refreshToken;
				const expiresAt = result.login.expiresAt;

				// Store authentication data
				this.utils.storeAuthData(user, token, refreshToken, expiresAt);

				// Log successful login
				this.utils.logSecurityEvent("login", true, credentials.email);

				return {
					success: true,
					userId: user.id,
					email: user.email,
					displayName: user.name,
					sessionId: token,
					token,
					refreshToken,
					expiresAt,
					user,
				};
			} else {
				// Log failed login
				this.utils.logSecurityEvent("login", false, credentials.email);

				return {
					success: false,
					errorMessage: result?.login?.message || "Invalid credentials",
				};
			}
		} catch (error: any) {
			console.error("Login error:", error);
			this.utils.logSecurityEvent("login", false, credentials.email);

			return {
				success: false,
				errorMessage: error.message || "Login failed",
			};
		}
	}

	/**
	 * Register new user
	 */
	async register(data: RegisterInput): Promise<AuthResponse> {
		try {
			// Input validation
			if (
				!this.utils.validateEmail(data.email) ||
				!this.utils.validatePassword(data.password)
			) {
				return {
					success: false,
					message: "Invalid email or password format.",
				};
			}

			const variables = {
				...data,
				email: data.email.toLowerCase().trim(),
			};

			const result = await this.client.request(REGISTER_MUTATION, variables);

			if (result?.register?.success) {
				this.utils.logSecurityEvent("register", true, data.email);
				return result.register;
			} else {
				this.utils.logSecurityEvent("register", false, data.email);
				return {
					success: false,
					message: result?.register?.message || "Registration failed",
				};
			}
		} catch (error: any) {
			console.error("Registration error:", error);
			this.utils.logSecurityEvent("register", false, data.email);

			return {
				success: false,
				message: error.message || "Registration failed",
			};
		}
	}

	/**
	 * Logout user
	 */
	async logout(): Promise<boolean> {
		try {
			const token = this.utils.getStoredToken();
			if (!token) {
				return true; // Already logged out
			}

			const result = await this.client.request(
				LOGOUT_MUTATION,
				{},
				{
					Authorization: `Bearer ${token}`,
				},
			);

			// Clear stored data regardless of result
			this.utils.clearStoredData();
			this.utils.logSecurityEvent("logout", true);

			return result?.logout?.success || true;
		} catch (error: any) {
			console.error("Logout error:", error);
			// Clear stored data even if logout fails
			this.utils.clearStoredData();
			this.utils.logSecurityEvent("logout", false);

			return true;
		}
	}
}
