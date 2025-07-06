/**
 * Settings GraphQL Queries
 * استعلامات GraphQL للإعدادات
 */

import { gql } from 'graphql-request';

// Get user settings and preferences
export const GET_USER_SETTINGS = gql`
  query GetUserSettings($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      phone
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
      addresses {
        id
        name
        street
        city
        country
        isDefault
        type
      }
      sessions {
        id
        device
        location
        lastActive
        current
      }
    }
  }
`;

// Get user activity log
export const GET_USER_ACTIVITY_LOG = gql`
  query GetUserActivityLog($userId: ID!, $limit: Int, $offset: Int) {
    userActivityLog(userId: $userId, limit: $limit, offset: $offset) {
      id
      action
      description
      timestamp
      ipAddress
      device
      location
      status
    }
  }
`;

// Get user devices
export const GET_USER_DEVICES = gql`
  query GetUserDevices($userId: ID!) {
    userDevices(userId: $userId) {
      id
      name
      type
      browser
      os
      lastActive
      location
      trusted
      current
    }
  }
`;

// Get notification preferences
export const GET_NOTIFICATION_PREFERENCES = gql`
  query GetNotificationPreferences($userId: ID!) {
    notificationPreferences(userId: $userId) {
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
`;