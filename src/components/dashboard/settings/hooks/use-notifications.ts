/**
 * Notifications Hook
 * خطاف إدارة الإشعارات
 */

import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import client from '@/lib/graphql-client';
import { useLocale } from '@/components/ui/useLocale';
import {
  GET_NOTIFICATION_PREFERENCES,
} from '../services/settings-queries';
import {
  UPDATE_NOTIFICATION_PREFERENCES,
} from '../services/settings-mutations';

interface NotificationPreferences {
  email: {
    orders: boolean;
    promotions: boolean;
    security: boolean;
    newsletter: boolean;
    recommendations: boolean;
  };
  sms: {
    orders: boolean;
    delivery: boolean;
    security: boolean;
    promotions: boolean;
  };
  push: {
    orders: boolean;
    promotions: boolean;
    reminders: boolean;
    newProducts: boolean;
  };
  timing: {
    hours: 'anytime' | 'business' | 'custom';
    customStart?: string;
    customEnd?: string;
    weekends: boolean;
    doNotDisturb: boolean;
  };
  sound: {
    enabled: boolean;
    volume: number;
    vibration: boolean;
  };
}

/**
 * Custom hook for managing notification preferences
 */
export const useNotifications = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: session } = useSession();
  const toast = useToast();
  const { t } = useLocale();

  // Fetch notification preferences
  const fetchPreferences = async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      const response = await client.request(GET_NOTIFICATION_PREFERENCES, {
        userId: session.user.id,
      });
      
      setPreferences(response.notificationPreferences);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: t('settings.error_loading_notifications'),
        description: t('settings.error_loading_notifications_desc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update notification preferences
  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!session?.user?.id) return false;

    try {
      setIsUpdating(true);
      const response = await client.request(UPDATE_NOTIFICATION_PREFERENCES, {
        userId: session.user.id,
        preferences: newPreferences,
      });

      if (response.updateNotificationPreferences.success) {
        setPreferences(prev => prev ? { ...prev, ...newPreferences } : null);
        
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
      console.error('Error updating notification preferences:', error);
      toast({
        title: t('settings.notifications_error'),
        description: t('settings.notifications_error_desc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Update email preferences
  const updateEmailPreferences = async (emailPrefs: Partial<NotificationPreferences['email']>) => {
    return await updatePreferences({
      email: {
        ...preferences?.email,
        ...emailPrefs,
      },
    });
  };

  // Update SMS preferences
  const updateSmsPreferences = async (smsPrefs: Partial<NotificationPreferences['sms']>) => {
    return await updatePreferences({
      sms: {
        ...preferences?.sms,
        ...smsPrefs,
      },
    });
  };

  // Update push notification preferences
  const updatePushPreferences = async (pushPrefs: Partial<NotificationPreferences['push']>) => {
    return await updatePreferences({
      push: {
        ...preferences?.push,
        ...pushPrefs,
      },
    });
  };

  // Update timing preferences
  const updateTimingPreferences = async (timingPrefs: Partial<NotificationPreferences['timing']>) => {
    return await updatePreferences({
      timing: {
        ...preferences?.timing,
        ...timingPrefs,
      },
    });
  };

  // Update sound preferences
  const updateSoundPreferences = async (soundPrefs: Partial<NotificationPreferences['sound']>) => {
    return await updatePreferences({
      sound: {
        ...preferences?.sound,
        ...soundPrefs,
      },
    });
  };

  // Test notification
  const testNotification = async (type: 'email' | 'sms' | 'push') => {
    try {
      // This would send a test notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('settings.test_notification_sent'),
        description: t(`settings.test_${type}_sent`),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: t('settings.test_notification_error'),
        description: t('settings.test_notification_error_desc'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  // Request notification permissions (for push notifications)
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: t('settings.notifications_not_supported'),
        description: t('settings.notifications_not_supported_desc'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  useEffect(() => {
    fetchPreferences();
  }, [session?.user?.id]);

  return {
    preferences,
    isLoading,
    isUpdating,
    fetchPreferences,
    updatePreferences,
    updateEmailPreferences,
    updateSmsPreferences,
    updatePushPreferences,
    updateTimingPreferences,
    updateSoundPreferences,
    testNotification,
    requestNotificationPermission,
  };
};