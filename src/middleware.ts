import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";

// Protected routes that require authentication
const protectedRoutes = [
	"/dashboard",
	"/profile",
	"/orders",
	"/favorites",
	"/settings",
];

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

// Public routes that don't require authentication
const publicRoutes = [
	"/",
	"/shop",
	"/products",
	"/categories",
	"/about",
	"/contact",
	"/terms",
	"/privacy",
];

// Create next-intl middleware
const intlMiddleware = createMiddleware({
	locales,
	defaultLocale: "ar",
	localePrefix: "as-needed",
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)",
	],
};

// Export the combined middleware
export default function middleware(request: NextRequest) {
	// Handle internationalization first
	const intlResponse = intlMiddleware(request);
	if (intlResponse) return intlResponse;

	// Then handle our custom middleware logic
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("auth_token")?.value;
	const isAuthenticated = !!token;

	// Check if the route is protected
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	// Check if the route is an auth route
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// If accessing a protected route without authentication
	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// If accessing an auth route while already authenticated
	if (isAuthRoute && isAuthenticated) {
		const dashboardUrl = new URL("/dashboard", request.url);
		return NextResponse.redirect(dashboardUrl);
	}

	// Rate limiting for auth routes
	if (isAuthRoute) {
		const ip = request.headers.get("x-forwarded-for") || "unknown";
		const rateLimitKey = `auth_${ip}`;

		// Simple rate limiting (in production, use Redis or similar)
		const rateLimit = request.cookies.get(rateLimitKey)?.value;
		const currentTime = Date.now();

		if (rateLimit) {
			const { count, timestamp } = JSON.parse(rateLimit);
			const timeWindow = 15 * 60 * 1000; // 15 minutes

			if (currentTime - timestamp < timeWindow && count >= 5) {
				return new NextResponse(
					JSON.stringify({
						error: "Too many requests. Please try again later.",
					}),
					{
						status: 429,
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
			}
		}

		// Update rate limit
		const newCount = rateLimit ? JSON.parse(rateLimit).count + 1 : 1;
		const response = NextResponse.next();
		response.cookies.set(
			rateLimitKey,
			JSON.stringify({
				count: newCount,
				timestamp: currentTime,
			}),
			{
				maxAge: 15 * 60, // 15 minutes
				httpOnly: true,
			},
		);

		return response;
	}

	// Security headers
	const response = NextResponse.next();

	// Add security headers
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("X-XSS-Protection", "1; mode=block");

	// Content Security Policy
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com",
		"img-src 'self' data: https: blob:",
		"connect-src 'self' https://api.coffee-selection.com https://www.google-analytics.com",
		"frame-src 'none'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"upgrade-insecure-requests",
	].join("; ");

	response.headers.set("Content-Security-Policy", csp);

	return response;
}
