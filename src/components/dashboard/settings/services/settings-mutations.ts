/**
 * Settings GraphQL Mutations
 * طفرات GraphQL للإعدادات
 */

import { gql } from 'graphql-request';

// Update user preferences
export const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($userId: ID!, $preferences: PreferencesInput!) {
    updateUserPreferences(userId: $userId, preferences: $preferences) {
      success
      message
      user {
        preferences {
          language
          currency
          timezone
          notifications {
            email
            sms
            push
            marketing
          }
          privacy {
            dataSharing
            marketing
            analytics
            profileVisibility
          }
          security {
            twoFactorEnabled
            sessionTimeout
            deviceManagement
            loginNotifications
          }
          display {
            theme
            density
            animations
          }
        }
      }
    }
  }
`;

// Enable/Disable Two Factor Authentication
export const TOGGLE_TWO_FACTOR_AUTH = gql`
  mutation ToggleTwoFactorAuth($userId: ID!, $enabled: Boolean!, $secret: String) {
    toggleTwoFactorAuth(userId: $userId, enabled: $enabled, secret: $secret) {
      success
      message
      qrCode
      backupCodes
    }
  }
`;

// Update notification preferences
export const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences($userId: ID!, $preferences: NotificationPreferencesInput!) {
    updateNotificationPreferences(userId: $userId, preferences: $preferences) {
      success
      message
      preferences {
        email {
          orders
          promotions
          security
          newsletter
        }
        sms {
          orders
          security
          promotions
        }
        push {
          orders
          promotions
          reminders
        }
      }
    }
  }
`;

// Revoke user session
export const REVOKE_USER_SESSION = gql`
  mutation RevokeUserSession($userId: ID!, $sessionId: ID!) {
    revokeUserSession(userId: $userId, sessionId: $sessionId) {
      success
      message
    }
  }
`;

// Revoke all sessions except current
export const REVOKE_ALL_SESSIONS = gql`
  mutation RevokeAllSessions($userId: ID!) {
    revokeAllSessions(userId: $userId) {
      success
      message
      revokedCount
    }
  }
`;

// Delete user account
export const DELETE_USER_ACCOUNT = gql`
  mutation DeleteUserAccount($userId: ID!, $password: String!) {
    deleteUserAccount(userId: $userId, password: $password) {
      success
      message
      scheduledDeletion
    }
  }
`;

// Export user data
export const EXPORT_USER_DATA = gql`
  mutation ExportUserData($userId: ID!, $format: String!) {
    exportUserData(userId: $userId, format: $format) {
      success
      message
      downloadUrl
      expiresAt
    }
  }
`;