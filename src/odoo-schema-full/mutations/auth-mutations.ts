/**
 * Authentication GraphQL Mutations - Enhanced Security
 * طلبات GraphQL للمصادقة - مع الحماية الأمنية المحسنة
 */

// ============================================================================
// LOGIN MUTATIONS - طلبات تسجيل الدخول
// ============================================================================

export const LOGIN_MUTATION = `
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
        preferences {
          language
          currency
          timezone
          notifications {
            email
            sms
            push
          }
        }
        profile {
          firstName
          lastName
          dateOfBirth
          gender
          bio
        }
        addresses {
          id
          type
          street
          street2
          city
          state
          country
          zipCode
          isDefault
        }
        stats {
          totalOrders
          totalSpent
          lastOrderDate
          memberSince
        }
      }
    }
  }
`;

export const REGISTER_MUTATION = `
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

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

// ============================================================================
// PASSWORD MANAGEMENT - إدارة كلمات المرور
// ============================================================================

export const REQUEST_PASSWORD_RESET_MUTATION = `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
      resetToken
      expiresAt
    }
  }
`;

export const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = `
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

// ============================================================================
// PROFILE MANAGEMENT - إدارة الملف الشخصي
// ============================================================================

export const UPDATE_PROFILE_MUTATION = `
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
        preferences {
          language
          currency
          timezone
          notifications {
            email
            sms
            push
          }
        }
      }
    }
  }
`;

export const UPDATE_PREFERENCES_MUTATION = `
  mutation UpdatePreferences($input: UpdatePreferencesInput!) {
    updatePreferences(input: $input) {
      success
      message
      preferences {
        language
        currency
        timezone
        notifications {
          email
          sms
          push
        }
      }
    }
  }
`;

// ============================================================================
// EMAIL VERIFICATION - التحقق من البريد الإلكتروني
// ============================================================================

export const VERIFY_EMAIL_MUTATION = `
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

export const RESEND_VERIFICATION_MUTATION = `
  mutation ResendVerification($email: String!) {
    resendVerification(email: $email) {
      success
      message
    }
  }
`;

// ============================================================================
// TWO-FACTOR AUTHENTICATION - المصادقة الثنائية
// ============================================================================

export const ENABLE_2FA_MUTATION = `
  mutation Enable2FA {
    enable2FA {
      success
      message
      qrCode
      backupCodes
    }
  }
`;

export const VERIFY_2FA_MUTATION = `
  mutation Verify2FA($code: String!) {
    verify2FA(code: $code) {
      success
      message
    }
  }
`;

export const DISABLE_2FA_MUTATION = `
  mutation Disable2FA($password: String!) {
    disable2FA(password: $password) {
      success
      message
    }
  }
`;

// ============================================================================
// TOKEN MANAGEMENT - إدارة الرموز المميزة
// ============================================================================

export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      success
      token
      refreshToken
      expiresAt
    }
  }
`;

export const REVOKE_TOKEN_MUTATION = `
  mutation RevokeToken($tokenId: String!) {
    revokeToken(tokenId: $tokenId) {
      success
      message
    }
  }
`;

// ============================================================================
// SOCIAL AUTHENTICATION - المصادقة الاجتماعية
// ============================================================================

export const LINK_SOCIAL_ACCOUNT_MUTATION = `
  mutation LinkSocialAccount($provider: String!, $token: String!) {
    linkSocialAccount(provider: $provider, token: $token) {
      success
      message
    }
  }
`;

export const UNLINK_SOCIAL_ACCOUNT_MUTATION = `
  mutation UnlinkSocialAccount($provider: String!) {
    unlinkSocialAccount(provider: $provider) {
      success
      message
    }
  }
`;

// ============================================================================
// ACCOUNT MANAGEMENT - إدارة الحساب
// ============================================================================

export const DELETE_ACCOUNT_MUTATION = `
  mutation DeleteAccount($password: String!) {
    deleteAccount(password: $password) {
      success
      message
    }
  }
`;

export const DEACTIVATE_ACCOUNT_MUTATION = `
  mutation DeactivateAccount($reason: String) {
    deactivateAccount(reason: $reason) {
      success
      message
    }
  }
`;

// ============================================================================
// SECURITY & MONITORING - الأمان والمراقبة
// ============================================================================

export const GET_SECURITY_LOG_MUTATION = `
  mutation GetSecurityLog($limit: Int) {
    getSecurityLog(limit: $limit) {
      success
      logs {
        id
        action
        timestamp
        ipAddress
        location
        deviceInfo
        success
      }
    }
  }
`;

export const GET_ACTIVE_DEVICES_MUTATION = `
  mutation GetActiveDevices {
    getActiveDevices {
      success
      devices {
        id
        name
        type
        browser
        os
        ipAddress
        location
        lastActive
        isCurrent
      }
    }
  }
`;

// ============================================================================
// TYPE DEFINITIONS - تعريفات الأنواع
// ============================================================================

export interface RegisterInput {
	name: string;
	email: string;
	password: string;
	phone?: string;
	street?: string;
	city?: string;
	state?: string;
	country?: string;
	zipCode?: string;
	acceptTerms: boolean;
	subscribeNewsletter?: boolean;
}

export interface UpdateProfileInput {
	firstName?: string;
	lastName?: string;
	phone?: string;
	dateOfBirth?: string;
	gender?: string;
	bio?: string;
	avatar?: string;
}

export interface UpdatePreferencesInput {
	language?: string;
	currency?: string;
	timezone?: string;
	notifications?: {
		email?: boolean;
		sms?: boolean;
		push?: boolean;
	};
}

export interface LoginCredentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export interface AuthUser {
	id: number;
	name: string;
	email: string;
	phone?: string;
	role: string;
	isVerified: boolean;
	avatar?: string;
	createdAt: string;
	updatedAt: string;
	preferences?: {
		language: string;
		currency: string;
		timezone: string;
		notifications: {
			email: boolean;
			sms: boolean;
			push: boolean;
		};
	};
	profile?: {
		firstName?: string;
		lastName?: string;
		dateOfBirth?: string;
		gender?: string;
		bio?: string;
	};
	addresses?: Array<{
		id: number;
		type: string;
		street: string;
		street2?: string;
		city: string;
		state?: string;
		country: string;
		zipCode?: string;
		isDefault: boolean;
	}>;
	stats?: {
		totalOrders: number;
		totalSpent: number;
		lastOrderDate?: string;
		memberSince: string;
	};
}

export interface AuthResponse {
	success: boolean;
	message?: string;
	token?: string;
	refreshToken?: string;
	expiresAt?: string;
	user?: AuthUser;
	verificationRequired?: boolean;
}

export interface SecurityLog {
	id: string;
	action: string;
	timestamp: string;
	ipAddress: string;
	location?: string;
	deviceInfo?: string;
	success: boolean;
}

export interface ActiveDevice {
	id: string;
	name: string;
	type: string;
	browser: string;
	os: string;
	ipAddress: string;
	location?: string;
	lastActive: string;
	isCurrent: boolean;
}
