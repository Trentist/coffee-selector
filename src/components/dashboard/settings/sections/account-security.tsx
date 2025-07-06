/**
 * Account Security Section
 * قسم الحساب والأمان
 */

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiShield, FiKey, FiUser, FiActivity } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SettingSection } from '../components/setting-section';
import { SettingToggle } from '../components/setting-toggle';
import { useSettings } from '../hooks/use-settings';
import { useLocale } from '@/components/ui/useLocale';
import { TextH6, TextParagraph } from '@/components/ui/custom-text';
import CustomButton from '@/components/ui/custom-button';

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Account Security section component
 */
export const AccountSecuritySection: React.FC = () => {
  const { settings, isLoading, isUpdating, updatePreferences, toggleTwoFactorAuth } = useSettings();
  const { t } = useLocale();
  const { isOpen: is2FAOpen, onOpen: on2FAOpen, onClose: on2FAClose } = useDisclosure();
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Theme colors
  const bg = useColorModeValue('#fff', '#0D1616');
  const color = useColorModeValue('#0D1616', '#fff');

  // Profile form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: settings?.name || '',
      email: settings?.email || '',
      phone: settings?.phone || '',
    },
  });

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormData) => {
    const success = await updatePreferences({
      // Note: This would typically update user profile, not just preferences
      // The actual implementation would depend on your GraphQL schema
    });
    
    if (success) {
      reset(data);
    }
  };

  // Handle 2FA toggle
  const handle2FAToggle = async (enabled: boolean) => {
    if (enabled) {
      const result = await toggleTwoFactorAuth(true);
      if (result.success && result.qrCode) {
        setQrCode(result.qrCode);
        on2FAOpen();
      }
    } else {
      await toggleTwoFactorAuth(false);
    }
  };

  // Handle notification preferences
  const handleNotificationToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      notifications: {
        ...settings?.preferences.notifications,
        [type]: enabled,
      },
    });
  };

  // Handle security preferences
  const handleSecurityToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      security: {
        ...settings?.preferences.security,
        [type]: enabled,
      },
    });
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Profile Settings */}
      <SettingSection
        title={t('settings.profile_settings')}
        description={t('settings.profile_settings_desc')}
        icon={FiUser}
      >
        <form onSubmit={handleSubmit(onProfileSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>{t('settings.name')}</FormLabel>
              <Input
                {...register('name')}
                placeholder={t('settings.name_placeholder')}
                variant="flushed"
                focusBorderColor={color}
              />
              <FormErrorMessage>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>{t('settings.email')}</FormLabel>
              <Input
                {...register('email')}
                type="email"
                placeholder={t('settings.email_placeholder')}
                variant="flushed"
                focusBorderColor={color}
              />
              <FormErrorMessage>
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phone}>
              <FormLabel>{t('settings.phone')}</FormLabel>
              <Input
                {...register('phone')}
                placeholder={t('settings.phone_placeholder')}
                variant="flushed"
                focusBorderColor={color}
              />
              <FormErrorMessage>
                {errors.phone?.message}
              </FormErrorMessage>
            </FormControl>

            <HStack justify="end" w="100%">
              <CustomButton
                title={t('settings.save_changes')}
                type="submit"
                isLoading={isUpdating}
                bg={color}
                color={bg}
              />
            </HStack>
          </VStack>
        </form>
      </SettingSection>

      {/* Security Settings */}
      <SettingSection
        title={t('settings.security_settings')}
        description={t('settings.security_settings_desc')}
        icon={FiShield}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.two_factor_auth')}
            description={t('settings.two_factor_auth_desc')}
            isEnabled={settings?.preferences.security.twoFactorEnabled || false}
            onToggle={handle2FAToggle}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.login_notifications')}
            description={t('settings.login_notifications_desc')}
            isEnabled={settings?.preferences.security.loginNotifications || false}
            onToggle={(enabled) => handleSecurityToggle('loginNotifications', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.device_management')}
            description={t('settings.device_management_desc')}
            isEnabled={settings?.preferences.security.deviceManagement || false}
            onToggle={(enabled) => handleSecurityToggle('deviceManagement', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* 2FA Setup Modal */}
      <Modal isOpen={is2FAOpen} onClose={on2FAClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('settings.setup_2fa')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <TextParagraph title={t('settings.scan_qr_code')} />
              {qrCode && (
                <Box
                  dangerouslySetInnerHTML={{ __html: qrCode }}
                  textAlign="center"
                />
              )}
              <TextParagraph title={t('settings.enter_verification_code')} />
              <Input placeholder={t('settings.verification_code')} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={on2FAClose}>
              {t('common.cancel')}
            </Button>
            <CustomButton title={t('settings.verify_and_enable')} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};