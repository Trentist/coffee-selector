/**
 * Communications Section
 * قسم الاتصالات
 */

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Select,
  FormControl,
  FormLabel,
  useColorModeValue,
  Grid,
  Input,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { 
  FiMail, 
  FiMessageSquare,
  FiSmartphone,
  FiBell,
  FiClock,
  FiVolume2,
  FiVolumeX
} from 'react-icons/fi';
import { SettingSection } from '../components/setting-section';
import { SettingToggle } from '../components/setting-toggle';
import { useSettings } from '../hooks/use-settings';
import { useLocale } from '@/components/ui/useLocale';
import { TextH6, TextParagraph } from '@/components/ui/custom-text';
import CustomButton from '@/components/ui/custom-button';

// Email frequency options
const EMAIL_FREQUENCIES = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Summary' },
  { value: 'never', label: 'Never' },
];

// Notification times
const NOTIFICATION_TIMES = [
  { value: 'anytime', label: 'Anytime' },
  { value: 'business', label: 'Business Hours (9 AM - 6 PM)' },
  { value: 'custom', label: 'Custom Hours' },
];

/**
 * Communications section component
 */
export const CommunicationsSection: React.FC = () => {
  const { settings, isLoading, isUpdating, updatePreferences } = useSettings();
  const { t } = useLocale();
  
  // Local state
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('business');
  const [customStartTime, setCustomStartTime] = useState('09:00');
  const [customEndTime, setCustomEndTime] = useState('18:00');
  const [soundVolume, setSoundVolume] = useState(75);

  // Theme colors
  const bg = useColorModeValue('#fff', '#0D1616');
  const color = useColorModeValue('#0D1616', '#fff');

  // Handle email preferences
  const handleEmailToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      notifications: {
        ...settings?.preferences.notifications,
        email: {
          ...settings?.preferences.notifications.email,
          [type]: enabled,
        },
      },
    });
  };

  // Handle SMS preferences
  const handleSmsToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      notifications: {
        ...settings?.preferences.notifications,
        sms: {
          ...settings?.preferences.notifications.sms,
          [type]: enabled,
        },
      },
    });
  };

  // Handle push notification preferences
  const handlePushToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      notifications: {
        ...settings?.preferences.notifications,
        push: {
          ...settings?.preferences.notifications.push,
          [type]: enabled,
        },
      },
    });
  };

  // Handle communication preferences
  const handleCommunicationToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      communications: {
        ...settings?.preferences.communications,
        [type]: enabled,
      },
    });
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Email Preferences */}
      <SettingSection
        title={t('settings.email_preferences')}
        description={t('settings.email_preferences_desc')}
        icon={FiMail}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t('settings.email_frequency')}</FormLabel>
            <Select
              value={emailFrequency}
              onChange={(e) => setEmailFrequency(e.target.value)}
              variant="flushed"
              focusBorderColor={color}
            >
              {EMAIL_FREQUENCIES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {t(`settings.${freq.value}_frequency`)}
                </option>
              ))}
            </Select>
          </FormControl>

          <Divider />

          <Box w="100%">
            <TextH6 title={t('settings.email_categories')} mb={3} />
            <VStack spacing={3}>
              <SettingToggle
                label={t('settings.order_updates')}
                description={t('settings.order_updates_desc')}
                isEnabled={settings?.preferences.notifications?.email?.orders || true}
                onToggle={(enabled) => handleEmailToggle('orders', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.promotional_emails')}
                description={t('settings.promotional_emails_desc')}
                isEnabled={settings?.preferences.notifications?.email?.promotions || false}
                onToggle={(enabled) => handleEmailToggle('promotions', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.newsletter')}
                description={t('settings.newsletter_desc')}
                isEnabled={settings?.preferences.notifications?.email?.newsletter || false}
                onToggle={(enabled) => handleEmailToggle('newsletter', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.security_alerts')}
                description={t('settings.security_alerts_desc')}
                isEnabled={settings?.preferences.notifications?.email?.security || true}
                onToggle={(enabled) => handleEmailToggle('security', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.product_recommendations')}
                description={t('settings.product_recommendations_desc')}
                isEnabled={settings?.preferences.notifications?.email?.recommendations || false}
                onToggle={(enabled) => handleEmailToggle('recommendations', enabled)}
                isLoading={isUpdating}
              />
            </VStack>
          </Box>
        </VStack>
      </SettingSection>

      {/* SMS Notifications */}
      <SettingSection
        title={t('settings.sms_notifications')}
        description={t('settings.sms_notifications_desc')}
        icon={FiMessageSquare}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.enable_sms')}
            description={t('settings.enable_sms_desc')}
            isEnabled={smsEnabled}
            onToggle={setSmsEnabled}
            isLoading={isUpdating}
          />

          {smsEnabled && (
            <VStack spacing={3} w="100%" pl={4}>
              <SettingToggle
                label={t('settings.sms_order_updates')}
                description={t('settings.sms_order_updates_desc')}
                isEnabled={settings?.preferences.notifications?.sms?.orders || true}
                onToggle={(enabled) => handleSmsToggle('orders', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.sms_delivery_alerts')}
                description={t('settings.sms_delivery_alerts_desc')}
                isEnabled={settings?.preferences.notifications?.sms?.delivery || true}
                onToggle={(enabled) => handleSmsToggle('delivery', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.sms_security_alerts')}
                description={t('settings.sms_security_alerts_desc')}
                isEnabled={settings?.preferences.notifications?.sms?.security || true}
                onToggle={(enabled) => handleSmsToggle('security', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.sms_promotions')}
                description={t('settings.sms_promotions_desc')}
                isEnabled={settings?.preferences.notifications?.sms?.promotions || false}
                onToggle={(enabled) => handleSmsToggle('promotions', enabled)}
                isLoading={isUpdating}
              />
            </VStack>
          )}
        </VStack>
      </SettingSection>

      {/* Push Notifications */}
      <SettingSection
        title={t('settings.push_notifications')}
        description={t('settings.push_notifications_desc')}
        icon={FiSmartphone}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.enable_push')}
            description={t('settings.enable_push_desc')}
            isEnabled={pushEnabled}
            onToggle={setPushEnabled}
            isLoading={isUpdating}
          />

          {pushEnabled && (
            <VStack spacing={3} w="100%" pl={4}>
              <SettingToggle
                label={t('settings.push_orders')}
                description={t('settings.push_orders_desc')}
                isEnabled={settings?.preferences.notifications?.push?.orders || true}
                onToggle={(enabled) => handlePushToggle('orders', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.push_promotions')}
                description={t('settings.push_promotions_desc')}
                isEnabled={settings?.preferences.notifications?.push?.promotions || false}
                onToggle={(enabled) => handlePushToggle('promotions', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.push_reminders')}
                description={t('settings.push_reminders_desc')}
                isEnabled={settings?.preferences.notifications?.push?.reminders || true}
                onToggle={(enabled) => handlePushToggle('reminders', enabled)}
                isLoading={isUpdating}
              />

              <SettingToggle
                label={t('settings.push_new_products')}
                description={t('settings.push_new_products_desc')}
                isEnabled={settings?.preferences.notifications?.push?.newProducts || false}
                onToggle={(enabled) => handlePushToggle('newProducts', enabled)}
                isLoading={isUpdating}
              />
            </VStack>
          )}
        </VStack>
      </SettingSection>

      {/* Notification Timing */}
      <SettingSection
        title={t('settings.notification_timing')}
        description={t('settings.notification_timing_desc')}
        icon={FiClock}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t('settings.notification_hours')}</FormLabel>
            <Select
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              variant="flushed"
              focusBorderColor={color}
            >
              {NOTIFICATION_TIMES.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {notificationTime === 'custom' && (
            <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
              <FormControl>
                <FormLabel>{t('settings.start_time')}</FormLabel>
                <Input
                  type="time"
                  value={customStartTime}
                  onChange={(e) => setCustomStartTime(e.target.value)}
                  variant="flushed"
                  focusBorderColor={color}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('settings.end_time')}</FormLabel>
                <Input
                  type="time"
                  value={customEndTime}
                  onChange={(e) => setCustomEndTime(e.target.value)}
                  variant="flushed"
                  focusBorderColor={color}
                />
              </FormControl>
            </Grid>
          )}

          <SettingToggle
            label={t('settings.weekend_notifications')}
            description={t('settings.weekend_notifications_desc')}
            isEnabled={settings?.preferences.notifications?.weekends || false}
            onToggle={(enabled) => handleCommunicationToggle('weekendNotifications', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.do_not_disturb')}
            description={t('settings.do_not_disturb_desc')}
            isEnabled={settings?.preferences.notifications?.doNotDisturb || false}
            onToggle={(enabled) => handleCommunicationToggle('doNotDisturb', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Sound & Vibration */}
      <SettingSection
        title={t('settings.sound_vibration')}
        description={t('settings.sound_vibration_desc')}
        icon={FiVolume2}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.notification_sounds')}
            description={t('settings.notification_sounds_desc')}
            isEnabled={settings?.preferences.notifications?.sounds || true}
            onToggle={(enabled) => handleCommunicationToggle('notificationSounds', enabled)}
            isLoading={isUpdating}
          />

          <Box w="100%">
            <HStack justify="space-between" mb={2}>
              <TextH6 title={t('settings.sound_volume')} />
              <Badge colorScheme="blue">{soundVolume}%</Badge>
            </HStack>
            <HStack spacing={4}>
              <FiVolumeX />
              <Slider
                value={soundVolume}
                onChange={setSoundVolume}
                min={0}
                max={100}
                step={5}
                flex={1}
              >
                <SliderTrack>
                  <SliderFilledTrack bg={color} />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <FiVolume2 />
            </HStack>
          </Box>

          <SettingToggle
            label={t('settings.vibration')}
            description={t('settings.vibration_desc')}
            isEnabled={settings?.preferences.notifications?.vibration || true}
            onToggle={(enabled) => handleCommunicationToggle('vibration', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Marketing Preferences */}
      <SettingSection
        title={t('settings.marketing_preferences')}
        description={t('settings.marketing_preferences_desc')}
        icon={FiBell}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.personalized_offers')}
            description={t('settings.personalized_offers_desc')}
            isEnabled={settings?.preferences.marketing?.personalizedOffers || false}
            onToggle={(enabled) => handleCommunicationToggle('personalizedOffers', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.seasonal_campaigns')}
            description={t('settings.seasonal_campaigns_desc')}
            isEnabled={settings?.preferences.marketing?.seasonalCampaigns || false}
            onToggle={(enabled) => handleCommunicationToggle('seasonalCampaigns', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.product_launches')}
            description={t('settings.product_launches_desc')}
            isEnabled={settings?.preferences.marketing?.productLaunches || false}
            onToggle={(enabled) => handleCommunicationToggle('productLaunches', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.survey_invitations')}
            description={t('settings.survey_invitations_desc')}
            isEnabled={settings?.preferences.marketing?.surveys || false}
            onToggle={(enabled) => handleCommunicationToggle('surveys', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Save Changes */}
      <HStack justify="end" w="100%">
        <CustomButton
          title={t('settings.save_communication_preferences')}
          isLoading={isUpdating}
          bg={color}
          color={bg}
          onClick={() => {
            console.log('Saving communication preferences...');
          }}
        />
      </HStack>
    </VStack>
  );
};