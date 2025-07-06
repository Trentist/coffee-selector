/**
 * Privacy Settings Hook
 * خطاف إعدادات الخصوصية
 */

import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import client from '@/lib/graphql-client';
import { useLocale } from '@/components/ui/useLocale';
import {
  UPDATE_NOTIFICATION_PREFERENCES,
  EXPORT_USER_DATA,
  DELETE_USER_ACCOUNT,
} from '../services/settings-mutations';

interface PrivacySettings {
  dataSharing: boolean;
  marketing: boolean;
  analytics: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
}

interface NotificationSettings {
  email: {
    orders: boolean;
    promotions: boolean;
    security: boolean;
    newsletter: boolean;
  };
  sms: {
    orders: boolean;
    security: boolean;
    promotions: boolean;
  };
  push: {
    orders: boolean;
    promotions: boolean;
    reminders: boolean;
  };
}

/**
 * Custom hook for managing privacy and notification settings
 */
export const usePrivacy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const toast = useToast();
  const { t } = useLocale();

  // Update privacy settings
  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    if (!session?.user?.id) return false;

    try {
      setIsLoading(true);
      // This would be implemented with actual GraphQL mutation
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: t('settings.privacy_updated'),
        description: t('settings.privacy_updated_desc'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: t('settings.privacy_error'),
        description: t('settings.privacy_error_desc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update notification preferences
  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    if (!session?.user?.id) return false;

    try {
      setIsLoading(true);
      const response = await client.request(UPDATE_NOTIFICATION_PREFERENCES, {
        userId: session.user.id,
        preferences: settings,
      });

      if (response.updateNotificationPreferences.success) {
        toast({
          title: t('settings.notifications_updated'),
          description: t('settings.notifications_updated_desc'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: t('settings.notifications_error'),
        description: t('settings.notifications_error_desc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Export user data
  const exportUserData = async (format: 'json' | 'csv' = 'json') => {
    if (!session?.user?.id) return null;

    try {
      setIsExporting(true);
      const response = await client.request(EXPORT_USER_DATA, {
        userId: session.user.id,
        format,
      });

      if (response.exportUserData.success) {
        toast({
          title: t('settings.export_started'),
          description: t('settings.export_started_desc'),
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        
        return {
          downloadUrl: response.exportUserData.downloadUrl,
          expiresAt: response.exportUserData.expiresAt,
        };
      }
      return null;
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast({
        title: t('settings.export_error'),
        description: t('settings.export_error_desc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  // Delete user account
  const deleteUserAccount = async (password: string) => {
    if (!session?.user?.id) return false;

    try {
      setIsDeleting(true);
      const response = await client.request(DELETE_USER_ACCOUNT, {
        userId: session.user.id,
        password,
      });

      if (response.deleteUserAccount.success) {
        toast({
          title: t('settings.account_deletion_scheduled'),
          description: t('settings.account_deletion_scheduled_desc'),
          status: 'warning',
          duration: 10000,
          isClosable: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user account:', error);
      toast({
        title: t('settings.deletion_error'),
        description: t('settings.deletion_error_desc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isLoading,
    isExporting,
    isDeleting,
    updatePrivacySettings,
    updateNotificationSettings,
    exportUserData,
    deleteUserAccount,
  };
};