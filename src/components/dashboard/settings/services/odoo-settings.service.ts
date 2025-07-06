/**
 * Odoo Settings Service
 * خدمة إعدادات Odoo
 */

import client from '@/lib/graphql-client';
import { gql } from 'graphql-request';

// GraphQL queries and mutations for Odoo integration
const ODOO_GET_USER_PREFERENCES = gql`
  query OdooGetUserPreferences($userId: ID!) {
    odooUserPreferences(userId: $userId) {
      id
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
      shipping {
        preferredMethod
        autoSelectFastest
        signatureRequired
        weekendDelivery
      }
      communications {
        emailFrequency
        smsEnabled
        pushEnabled
        notificationTiming
      }
    }
  }
`;

const ODOO_UPDATE_USER_PREFERENCES = gql`
  mutation OdooUpdateUserPreferences($userId: ID!, $preferences: OdooPreferencesInput!) {
    odooUpdateUserPreferences(userId: $userId, preferences: $preferences) {
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
        shipping {
          preferredMethod
          autoSelectFastest
          signatureRequired
          weekendDelivery
        }
        communications {
          emailFrequency
          smsEnabled
          pushEnabled
          notificationTiming
        }
      }
    }
  }
`;

const ODOO_GET_USER_ADDRESSES = gql`
  query OdooGetUserAddresses($userId: ID!) {
    odooUserAddresses(userId: $userId) {
      id
      name
      street
      street2
      city
      state
      zip
      country
      phone
      email
      isDefault
      type
      isShipping
      isBilling
    }
  }
`;

const ODOO_CREATE_USER_ADDRESS = gql`
  mutation OdooCreateUserAddress($userId: ID!, $address: OdooAddressInput!) {
    odooCreateUserAddress(userId: $userId, address: $address) {
      success
      message
      address {
        id
        name
        street
        city
        country
        isDefault
        type
      }
    }
  }
`;

const ODOO_UPDATE_USER_ADDRESS = gql`
  mutation OdooUpdateUserAddress($addressId: ID!, $address: OdooAddressInput!) {
    odooUpdateUserAddress(addressId: $addressId, address: $address) {
      success
      message
      address {
        id
        name
        street
        city
        country
        isDefault
        type
      }
    }
  }
`;

const ODOO_DELETE_USER_ADDRESS = gql`
  mutation OdooDeleteUserAddress($addressId: ID!) {
    odooDeleteUserAddress(addressId: $addressId) {
      success
      message
    }
  }
`;

const ODOO_GET_USER_ACTIVITY_LOG = gql`
  query OdooGetUserActivityLog($userId: ID!, $limit: Int, $offset: Int) {
    odooUserActivityLog(userId: $userId, limit: $limit, offset: $offset) {
      id
      action
      description
      timestamp
      ipAddress
      device
      location
      status
      details
    }
  }
`;

const ODOO_GET_USER_SESSIONS = gql`
  query OdooGetUserSessions($userId: ID!) {
    odooUserSessions(userId: $userId) {
      id
      device
      browser
      os
      location
      ipAddress
      lastActive
      current
      trusted
    }
  }
`;

const ODOO_REVOKE_USER_SESSION = gql`
  mutation OdooRevokeUserSession($sessionId: ID!) {
    odooRevokeUserSession(sessionId: $sessionId) {
      success
      message
    }
  }
`;

const ODOO_EXPORT_USER_DATA = gql`
  mutation OdooExportUserData($userId: ID!, $format: String!) {
    odooExportUserData(userId: $userId, format: $format) {
      success
      message
      downloadUrl
      expiresAt
    }
  }
`;

/**
 * Odoo Settings Service Class
 */
export class OdooSettingsService {
  /**
   * Get user preferences from Odoo
   */
  static async getUserPreferences(userId: string) {
    try {
      const response = await client.request(ODOO_GET_USER_PREFERENCES, {
        userId,
      });
      return response.odooUserPreferences;
    } catch (error) {
      console.error('Error fetching Odoo user preferences:', error);
      throw error;
    }
  }

  /**
   * Update user preferences in Odoo
   */
  static async updateUserPreferences(userId: string, preferences: any) {
    try {
      const response = await client.request(ODOO_UPDATE_USER_PREFERENCES, {
        userId,
        preferences,
      });
      return response.odooUpdateUserPreferences;
    } catch (error) {
      console.error('Error updating Odoo user preferences:', error);
      throw error;
    }
  }

  /**
   * Get user addresses from Odoo
   */
  static async getUserAddresses(userId: string) {
    try {
      const response = await client.request(ODOO_GET_USER_ADDRESSES, {
        userId,
      });
      return response.odooUserAddresses;
    } catch (error) {
      console.error('Error fetching Odoo user addresses:', error);
      throw error;
    }
  }

  /**
   * Create new user address in Odoo
   */
  static async createUserAddress(userId: string, address: any) {
    try {
      const response = await client.request(ODOO_CREATE_USER_ADDRESS, {
        userId,
        address,
      });
      return response.odooCreateUserAddress;
    } catch (error) {
      console.error('Error creating Odoo user address:', error);
      throw error;
    }
  }

  /**
   * Update user address in Odoo
   */
  static async updateUserAddress(addressId: string, address: any) {
    try {
      const response = await client.request(ODOO_UPDATE_USER_ADDRESS, {
        addressId,
        address,
      });
      return response.odooUpdateUserAddress;
    } catch (error) {
      console.error('Error updating Odoo user address:', error);
      throw error;
    }
  }

  /**
   * Delete user address in Odoo
   */
  static async deleteUserAddress(addressId: string) {
    try {
      const response = await client.request(ODOO_DELETE_USER_ADDRESS, {
        addressId,
      });
      return response.odooDeleteUserAddress;
    } catch (error) {
      console.error('Error deleting Odoo user address:', error);
      throw error;
    }
  }

  /**
   * Get user activity log from Odoo
   */
  static async getUserActivityLog(userId: string, limit = 50, offset = 0) {
    try {
      const response = await client.request(ODOO_GET_USER_ACTIVITY_LOG, {
        userId,
        limit,
        offset,
      });
      return response.odooUserActivityLog;
    } catch (error) {
      console.error('Error fetching Odoo user activity log:', error);
      throw error;
    }
  }

  /**
   * Get user sessions from Odoo
   */
  static async getUserSessions(userId: string) {
    try {
      const response = await client.request(ODOO_GET_USER_SESSIONS, {
        userId,
      });
      return response.odooUserSessions;
    } catch (error) {
      console.error('Error fetching Odoo user sessions:', error);
      throw error;
    }
  }

  /**
   * Revoke user session in Odoo
   */
  static async revokeUserSession(sessionId: string) {
    try {
      const response = await client.request(ODOO_REVOKE_USER_SESSION, {
        sessionId,
      });
      return response.odooRevokeUserSession;
    } catch (error) {
      console.error('Error revoking Odoo user session:', error);
      throw error;
    }
  }

  /**
   * Export user data from Odoo
   */
  static async exportUserData(userId: string, format: 'json' | 'csv' = 'json') {
    try {
      const response = await client.request(ODOO_EXPORT_USER_DATA, {
        userId,
        format,
      });
      return response.odooExportUserData;
    } catch (error) {
      console.error('Error exporting Odoo user data:', error);
      throw error;
    }
  }

  /**
   * Sync user preferences with Odoo
   */
  static async syncUserPreferences(userId: string, localPreferences: any) {
    try {
      // First, get current Odoo preferences
      const odooPreferences = await this.getUserPreferences(userId);
      
      // Merge local preferences with Odoo preferences
      const mergedPreferences = {
        ...odooPreferences,
        ...localPreferences,
      };

      // Update Odoo with merged preferences
      const result = await this.updateUserPreferences(userId, mergedPreferences);
      
      return {
        success: result.success,
        preferences: result.preferences,
        synced: true,
      };
    } catch (error) {
      console.error('Error syncing user preferences with Odoo:', error);
      return {
        success: false,
        preferences: localPreferences,
        synced: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate user preferences before saving to Odoo
   */
  static validatePreferences(preferences: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate language
    if (preferences.language && !['ar', 'en'].includes(preferences.language)) {
      errors.push('Invalid language code');
    }

    // Validate currency
    if (preferences.currency && !['AED', 'SAR', 'USD', 'EUR', 'GBP'].includes(preferences.currency)) {
      errors.push('Invalid currency code');
    }

    // Validate timezone
    if (preferences.timezone && typeof preferences.timezone !== 'string') {
      errors.push('Invalid timezone format');
    }

    // Validate session timeout
    if (preferences.security?.sessionTimeout && 
        (typeof preferences.security.sessionTimeout !== 'number' || 
         preferences.security.sessionTimeout < 0)) {
      errors.push('Invalid session timeout value');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}