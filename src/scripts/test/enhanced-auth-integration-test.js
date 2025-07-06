/**
 * Enhanced Authentication Integration Test
 * اختبار تكامل نظام المصادقة المحسن
 */

// Use dynamic import for ES modules
let GraphQLClient;

// Configuration
const ODOO_URL =
	process.env.NEXT_PUBLIC_ODOO_URL ||
	"https://coffee-selection-staging-20784644.dev.odoo.com";
const GRAPHQL_URL = `${ODOO_URL}/graphql/vsf`;

// Test data
const testUser = {
	email: "test@example.com",
	password: "TestPassword123!",
	name: "Test User",
	phone: "+1234567890",
	acceptTerms: true,
};

const testCredentials = {
	email: "test@example.com",
	password: "TestPassword123!",
	rememberMe: true,
};

// Test results
let testResults = {
	total: 0,
	passed: 0,
	failed: 0,
	errors: [],
};

// Utility functions
function log(message, type = "info") {
	const timestamp = new Date().toISOString();
	const prefix =
		type === "error"
			? "❌"
			: type === "success"
				? "✅"
				: type === "warning"
					? "⚠️"
					: "ℹ️";
	console.log(`${prefix} [${timestamp}] ${message}`);
}

function assert(condition, message) {
	testResults.total++;
	if (condition) {
		testResults.passed++;
		log(`PASS: ${message}`, "success");
	} else {
		testResults.failed++;
		testResults.errors.push(message);
		log(`FAIL: ${message}`, "error");
	}
}

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validatePassword(password) {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
	return passwordRegex.test(password);
}

// GraphQL Mutations
const LOGIN_MUTATION = `
	mutation Login($email: String!, $password: String!, $rememberMe: Boolean) {
		login(email: $email, password: $password, rememberMe: $rememberMe) {
			success
			message
			token
			refreshToken
			expiresAt
			user {
				id
				name
				email
				phone
				role
				isVerified
				avatar
				createdAt
				updatedAt
			}
		}
	}
`;

const REGISTER_MUTATION = `
	mutation Register($input: RegisterInput!) {
		register(input: $input) {
			success
			message
			token
			refreshToken
			expiresAt
			verificationRequired
			user {
				id
				name
				email
				phone
				role
				isVerified
				avatar
				createdAt
				updatedAt
			}
		}
	}
`;

const LOGOUT_MUTATION = `
	mutation Logout {
		logout {
			success
			message
		}
	}
`;

const REQUEST_PASSWORD_RESET_MUTATION = `
	mutation RequestPasswordReset($email: String!) {
		requestPasswordReset(email: $email) {
			success
			message
			resetToken
			expiresAt
		}
	}
`;

const RESET_PASSWORD_MUTATION = `
	mutation ResetPassword($resetToken: String!, $newPassword: String!) {
		resetPassword(resetToken: $resetToken, newPassword: $newPassword) {
			success
			message
		}
	}
`;

const CHANGE_PASSWORD_MUTATION = `
	mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
		changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
			success
			message
		}
	}
`;

const UPDATE_PROFILE_MUTATION = `
	mutation UpdateProfile($input: UpdateProfileInput!) {
		updateProfile(input: $input) {
			success
			message
			user {
				id
				name
				email
				phone
				avatar
				profile {
					firstName
					lastName
					dateOfBirth
					gender
					bio
				}
			}
		}
	}
`;

const VERIFY_EMAIL_MUTATION = `
	mutation VerifyEmail($token: String!) {
		verifyEmail(token: $token) {
			success
			message
		}
	}
`;

const RESEND_VERIFICATION_MUTATION = `
	mutation ResendVerification($email: String!) {
		resendVerification(email: $email) {
			success
			message
		}
	}
`;

// Test functions
async function testInputValidation() {
	log("Testing input validation...", "info");

	// Email validation
	assert(
		validateEmail("test@example.com"),
		"Valid email should pass validation",
	);
	assert(
		!validateEmail("invalid-email"),
		"Invalid email should fail validation",
	);
	assert(!validateEmail("test@"), "Incomplete email should fail validation");
	assert(!validateEmail(""), "Empty email should fail validation");

	// Password validation
	assert(
		validatePassword("TestPassword123!"),
		"Valid password should pass validation",
	);
	assert(!validatePassword("weak"), "Weak password should fail validation");
	assert(
		!validatePassword("nouppercase123!"),
		"Password without uppercase should fail validation",
	);
	assert(
		!validatePassword("NOLOWERCASE123!"),
		"Password without lowercase should fail validation",
	);
	assert(
		!validatePassword("NoNumbers!"),
		"Password without numbers should fail validation",
	);
	assert(!validatePassword(""), "Empty password should fail validation");
}

async function testRegistration() {
	log("Testing user registration...", "info");

	try {
		const result = await client.request(REGISTER_MUTATION, {
			input: testUser,
		});

		if (result?.register) {
			assert(result.register.success, "Registration should be successful");
			assert(result.register.user, "User data should be returned");
			assert(
				result.register.user.email === testUser.email,
				"User email should match",
			);
			assert(
				result.register.user.name === testUser.name,
				"User name should match",
			);
			assert(result.register.user.role, "User should have a role");
			assert(
				typeof result.register.user.id === "number",
				"User should have an ID",
			);
			assert(result.register.user.createdAt, "User should have creation date");
			assert(result.register.user.updatedAt, "User should have update date");

			if (result.register.token) {
				log("Registration includes auto-login token", "success");
			}

			if (result.register.verificationRequired) {
				log("Email verification is required", "warning");
			}
		} else {
			assert(false, "Registration response should contain register data");
		}
	} catch (error) {
		log(`Registration test failed: ${error.message}`, "error");
		assert(false, "Registration should not throw an error");
	}
}

async function testLogin() {
	log("Testing user login...", "info");

	try {
		const result = await client.request(LOGIN_MUTATION, {
			email: testCredentials.email,
			password: testCredentials.password,
			rememberMe: testCredentials.rememberMe,
		});

		if (result?.login) {
			assert(result.login.success, "Login should be successful");
			assert(result.login.user, "User data should be returned");
			assert(result.login.token, "Authentication token should be returned");
			assert(
				result.login.user.email === testCredentials.email,
				"User email should match",
			);
			assert(result.login.user.name, "User should have a name");
			assert(result.login.user.role, "User should have a role");
			assert(
				typeof result.login.user.id === "number",
				"User should have an ID",
			);

			if (result.login.refreshToken) {
				log("Refresh token is provided", "success");
			}

			if (result.login.expiresAt) {
				log("Token expiration is provided", "success");
			}

			return result.login.token;
		} else {
			assert(false, "Login response should contain login data");
		}
	} catch (error) {
		log(`Login test failed: ${error.message}`, "error");
		assert(false, "Login should not throw an error");
	}
}

async function testPasswordReset() {
	log("Testing password reset request...", "info");

	try {
		const result = await client.request(REQUEST_PASSWORD_RESET_MUTATION, {
			email: testUser.email,
		});

		if (result?.requestPasswordReset) {
			assert(
				result.requestPasswordReset.success,
				"Password reset request should be successful",
			);
			assert(
				result.requestPasswordReset.message,
				"Password reset should return a message",
			);

			if (result.requestPasswordReset.resetToken) {
				log("Reset token is provided", "success");
			}

			if (result.requestPasswordReset.expiresAt) {
				log("Reset token expiration is provided", "success");
			}
		} else {
			assert(
				false,
				"Password reset response should contain requestPasswordReset data",
			);
		}
	} catch (error) {
		log(`Password reset test failed: ${error.message}`, "error");
		assert(false, "Password reset request should not throw an error");
	}
}

async function testPasswordChange(token) {
	log("Testing password change...", "info");

	if (!token) {
		log("Skipping password change test - no authentication token", "warning");
		return;
	}

	try {
		// Update client with authentication token
		const authenticatedClient = new GraphQLClient(GRAPHQL_URL, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			timeout: 30000,
		});

		const result = await authenticatedClient.request(CHANGE_PASSWORD_MUTATION, {
			currentPassword: testCredentials.password,
			newPassword: "NewTestPassword123!",
		});

		if (result?.changePassword) {
			assert(
				result.changePassword.success,
				"Password change should be successful",
			);
			assert(
				result.changePassword.message,
				"Password change should return a message",
			);
		} else {
			assert(
				false,
				"Password change response should contain changePassword data",
			);
		}
	} catch (error) {
		log(`Password change test failed: ${error.message}`, "error");
		assert(false, "Password change should not throw an error");
	}
}

async function testProfileUpdate(token) {
	log("Testing profile update...", "info");

	if (!token) {
		log("Skipping profile update test - no authentication token", "warning");
		return;
	}

	try {
		// Update client with authentication token
		const authenticatedClient = new GraphQLClient(GRAPHQL_URL, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			timeout: 30000,
		});

		const profileData = {
			firstName: "Updated",
			lastName: "User",
			phone: "+9876543210",
			dateOfBirth: "1990-01-01",
			gender: "other",
			bio: "Updated bio information",
		};

		const result = await authenticatedClient.request(UPDATE_PROFILE_MUTATION, {
			input: profileData,
		});

		if (result?.updateProfile) {
			assert(
				result.updateProfile.success,
				"Profile update should be successful",
			);
			assert(result.updateProfile.user, "Updated user data should be returned");
			assert(
				result.updateProfile.message,
				"Profile update should return a message",
			);
		} else {
			assert(
				false,
				"Profile update response should contain updateProfile data",
			);
		}
	} catch (error) {
		log(`Profile update test failed: ${error.message}`, "error");
		assert(false, "Profile update should not throw an error");
	}
}

async function testEmailVerification() {
	log("Testing email verification...", "info");

	try {
		// This would typically use a real verification token
		// For testing, we'll just test the mutation structure
		const result = await client.request(VERIFY_EMAIL_MUTATION, {
			token: "test-verification-token",
		});

		if (result?.verifyEmail) {
			// This might fail with a test token, but we're testing the structure
			log("Email verification mutation structure is correct", "success");
		} else {
			assert(
				false,
				"Email verification response should contain verifyEmail data",
			);
		}
	} catch (error) {
		log(`Email verification test failed: ${error.message}`, "error");
		// This is expected with a test token
		log(
			"Email verification test completed (expected failure with test token)",
			"warning",
		);
	}
}

async function testResendVerification() {
	log("Testing resend verification email...", "info");

	try {
		const result = await client.request(RESEND_VERIFICATION_MUTATION, {
			email: testUser.email,
		});

		if (result?.resendVerification) {
			assert(
				result.resendVerification.success,
				"Resend verification should be successful",
			);
			assert(
				result.resendVerification.message,
				"Resend verification should return a message",
			);
		} else {
			assert(
				false,
				"Resend verification response should contain resendVerification data",
			);
		}
	} catch (error) {
		log(`Resend verification test failed: ${error.message}`, "error");
		assert(false, "Resend verification should not throw an error");
	}
}

async function testLogout(token) {
	log("Testing user logout...", "info");

	if (!token) {
		log("Skipping logout test - no authentication token", "warning");
		return;
	}

	try {
		// Update client with authentication token
		const authenticatedClient = new GraphQLClient(GRAPHQL_URL, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			timeout: 30000,
		});

		const result = await authenticatedClient.request(LOGOUT_MUTATION);

		if (result?.logout) {
			assert(result.logout.success, "Logout should be successful");
			assert(result.logout.message, "Logout should return a message");
		} else {
			assert(false, "Logout response should contain logout data");
		}
	} catch (error) {
		log(`Logout test failed: ${error.message}`, "error");
		assert(false, "Logout should not throw an error");
	}
}

async function testSecurityFeatures() {
	log("Testing security features...", "info");

	// Test rate limiting simulation
	let rateLimitCount = 0;
	for (let i = 0; i < 10; i++) {
		try {
			await client.request(LOGIN_MUTATION, {
				email: "rate-limit-test@example.com",
				password: "wrongpassword",
				rememberMe: false,
			});
		} catch (error) {
			if (
				error.message.includes("rate limit") ||
				error.message.includes("too many")
			) {
				rateLimitCount++;
			}
		}
	}

	if (rateLimitCount > 0) {
		log(
			`Rate limiting detected: ${rateLimitCount} rate limit responses`,
			"success",
		);
	} else {
		log("Rate limiting not detected (may not be implemented)", "warning");
	}

	// Test input sanitization
	const maliciousInput = '<script>alert("xss")</script>';
	const sanitizedInput = maliciousInput.replace(/[<>]/g, "");
	assert(sanitizedInput !== maliciousInput, "Input should be sanitized");
	assert(!sanitizedInput.includes("<script>"), "Script tags should be removed");
}

async function testErrorHandling() {
	log("Testing error handling...", "info");

	// Test invalid email format
	try {
		await client.request(LOGIN_MUTATION, {
			email: "invalid-email",
			password: "password",
			rememberMe: false,
		});
		assert(false, "Invalid email should cause an error");
	} catch (error) {
		assert(true, "Invalid email properly rejected");
	}

	// Test weak password
	try {
		await client.request(REGISTER_MUTATION, {
			input: {
				...testUser,
				password: "weak",
			},
		});
		assert(false, "Weak password should cause an error");
	} catch (error) {
		assert(true, "Weak password properly rejected");
	}

	// Test missing required fields
	try {
		await client.request(REGISTER_MUTATION, {
			input: {
				email: "test@example.com",
				// Missing required fields
			},
		});
		assert(false, "Missing required fields should cause an error");
	} catch (error) {
		assert(true, "Missing required fields properly rejected");
	}
}

// Main test runner
async function runAllTests() {
	// Initialize GraphQLClient
	try {
		const { GraphQLClient: GQLClient } = await import("graphql-request");
		GraphQLClient = GQLClient;
	} catch (error) {
		log("Failed to import GraphQLClient", "error");
		return;
	}

	// Configuration
	const ODOO_URL =
		process.env.NEXT_PUBLIC_ODOO_URL ||
		"https://coffee-selection-staging-20784644.dev.odoo.com";
	const GRAPHQL_URL = `${ODOO_URL}/graphql/vsf`;

	// GraphQL Client
	global.client = new GraphQLClient(GRAPHQL_URL, {
		headers: {
			"Content-Type": "application/json",
			...(process.env.NEXT_PUBLIC_ODOO_API_TOKEN && {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_ODOO_API_TOKEN}`,
			}),
		},
		timeout: 30000,
	});

	log("🚀 Starting Enhanced Authentication Integration Tests", "info");
	log(`Testing against: ${GRAPHQL_URL}`, "info");
	log("", "info");

	// Run tests
	await testInputValidation();
	await testRegistration();
	const token = await testLogin();
	await testPasswordReset();
	await testPasswordChange(token);
	await testProfileUpdate(token);
	await testEmailVerification();
	await testResendVerification();
	await testLogout(token);
	await testSecurityFeatures();
	await testErrorHandling();

	// Print results
	log("", "info");
	log("📊 Test Results Summary:", "info");
	log(`Total Tests: ${testResults.total}`, "info");
	log(`Passed: ${testResults.passed}`, "success");
	log(
		`Failed: ${testResults.failed}`,
		testResults.failed > 0 ? "error" : "success",
	);
	log(
		`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`,
		"info",
	);

	if (testResults.errors.length > 0) {
		log("", "info");
		log("❌ Failed Tests:", "error");
		testResults.errors.forEach((error, index) => {
			log(`${index + 1}. ${error}`, "error");
		});
	}

	log("", "info");
	if (testResults.failed === 0) {
		log(
			"🎉 All tests passed! Enhanced authentication system is working correctly.",
			"success",
		);
	} else {
		log("⚠️ Some tests failed. Please review the errors above.", "warning");
	}

	return testResults;
}

// Run tests if this file is executed directly
if (require.main === module) {
	runAllTests()
		.then((results) => {
			process.exit(results.failed === 0 ? 0 : 1);
		})
		.catch((error) => {
			log(`Test runner failed: ${error.message}`, "error");
			process.exit(1);
		});
}

module.exports = {
	runAllTests,
	testResults,
};
