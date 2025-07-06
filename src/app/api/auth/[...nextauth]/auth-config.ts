import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { rateLimiterService } from "@/services/security/rate-limiter.service";
import { inputValidatorService } from "@/services/security/input-validator.service";
import { unifiedOdooService } from "@/odoo-schema-full";

export const authOptions: NextAuthOptions = {
	providers: [
		// Google OAuth Provider
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "openid email profile",
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),

		// Email/Password Provider with enhanced security
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "your@email.com" },
				password: { label: "Password", type: "password" },
				rememberMe: { label: "Remember Me", type: "boolean" },
			},
			async authorize(credentials, req) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("auth.required_fields");
				}

				// Get client identifier for rate limiting
				const clientIP =
					req?.headers?.["x-forwarded-for"] ||
					req?.headers?.["x-real-ip"] ||
					"unknown";
				const identifier = Array.isArray(clientIP) ? clientIP[0] : clientIP;

				// Check rate limiting
				if (!rateLimiterService.isAllowed(identifier, "login")) {
					const timeUntilReset = rateLimiterService.getTimeUntilUnblocked(
						identifier,
						"login",
					);
					throw new Error(
						`Too many login attempts. Try again in ${Math.ceil(timeUntilReset / 60000)} minutes.`,
					);
				}

				// Validate input data
				const validation = inputValidatorService.validateLoginData({
					email: credentials.email,
					password: credentials.password,
				});

				if (!validation.isValid) {
					const errorMessages = Object.values(validation.errors)
						.flat()
						.join(", ");
					throw new Error(errorMessages);
				}

				try {
					// Use the enhanced auth service with sanitized data
					const loginResult = await authService.login(
						validation.sanitizedData!,
					);

					if (!loginResult.success) {
						// Record failed attempt
						rateLimiterService.recordAttempt(identifier, "login", false);
						throw new Error(loginResult.errorMessage || "auth.login_failed");
					}

					// Record successful attempt
					rateLimiterService.recordAttempt(identifier, "login", true);

					return {
						id: loginResult.userId?.toString() || "",
						email: loginResult.email || validation.sanitizedData!.email,
						name: loginResult.displayName || "",
						accessToken: loginResult.sessionId,
						rememberMe: credentials.rememberMe === "true",
					};
				} catch (error: any) {
					console.error("Authentication error:", error);
					// Record failed attempt
					rateLimiterService.recordAttempt(identifier, "login", false);
					throw new Error(error.message || "auth.login_failed");
				}
			},
		}),
	],

	// Security and session configuration
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days for "remember me", 7 days default
		updateAge: 24 * 60 * 60, // Update session every 24 hours
	},

	// Custom pages
	pages: {
		signIn: "/auth/login",
		signUp: "/auth/register",
		error: "/auth/login",
		verifyRequest: "/auth/verify-request",
	},

	// Enhanced callbacks
	callbacks: {
		async signIn({ user, account, profile }) {
			// Handle Google OAuth sign-in
			if (account?.provider === "google" && profile?.email) {
				try {
					// Check if user exists or create new user
					const existingUser = await authService.getCurrentUser();

					if (!existingUser) {
						// Register new user with Google data
						const registerResult = await authService.register({
							name: profile.name || "",
							email: profile.email,
							password: Math.random().toString(36).substring(2, 15), // Random password for OAuth users
						});

						if (!registerResult.success) {
							console.error(
								"Failed to register Google user:",
								registerResult.errorMessage,
							);
							return false;
						}
					}

					return true;
				} catch (error) {
					console.error("Google sign-in error:", error);
					return false;
				}
			}

			return true;
		},

		async jwt({ token, user, account, trigger, session }) {
			// Initial sign in
			if (user) {
				token.id = user.id;
				token.accessToken = user.accessToken;
				token.provider = account?.provider;
				// Set remember me flag if provided
				if (account?.type === "credentials") {
					token.rememberMe = user.rememberMe;
				}
			}

			// Handle session update
			if (trigger === "update" && session) {
				token = { ...token, ...session };
			}

			return token;
		},

		async session({ session, token }) {
			// Send properties to the client
			if (session.user && token) {
				session.user.id = token.id as string;
				session.accessToken = token.accessToken as string;
				session.provider = token.provider as string;
			}

			return session;
		},
	},

	// Enhanced events
	events: {
		async signIn({ user, account, isNewUser }) {
			console.log(`User ${user.email} signed in via ${account?.provider}`);
			if (isNewUser) {
				console.log(`New user registered: ${user.email}`);
			}
		},

		async signOut({ token }) {
			// Invalidate session if exists
			if (token?.id) {
				try {
					await authService.logout(parseInt(token.id as string));
				} catch (error) {
					console.error("Error during logout:", error);
				}
			}
			console.log("User signed out successfully");
		},
	},

	// Enhanced security
	useSecureCookies: process.env.NODE_ENV === "production",
	cookies: {
		sessionToken: {
			name: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
				maxAge: 30 * 24 * 60 * 60, // 30 days for "remember me"
			},
		},
		callbackUrl: {
			name: `next-auth.callback-url`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
		csrfToken: {
			name: `next-auth.csrf-token`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
};
