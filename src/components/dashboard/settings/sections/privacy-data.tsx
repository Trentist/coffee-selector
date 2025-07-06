/**
 * Privacy Data Section
 * قسم الخصوصية والبيانات
 */

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Button,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { 
  FiShield, 
  FiDownload, 
  FiTrash2, 
  FiBell,
  FiEye,
  FiShare2 
} from 'react-icons/fi';
import { SettingSection } from '../components/setting-section';
import { SettingToggle } from '../components/setting-toggle';
import { usePrivacy } from '../hooks/use-privacy';
import { useSettings } from '../hooks/use-settings';
import { useLocale } from '@/components/ui/useLocale';
import { TextH6, TextParagraph } from '@/components/ui/custom-text';
import CustomButton from '@/components/ui/custom-button';

/**
 * Privacy and Data section component
 */
export const PrivacyDataSection: React.FC = () => {
  const { settings, isLoading } = useSettings();
  const {
    isLoading: isPrivacyLoading,
    isExporting,
    isDeleting,
    updatePrivacySettings,
    updateNotificationSettings,
    exportUserData,
    deleteUserAccount,
  } = usePrivacy();

  const { t } = useLocale();
  const [deletePassword, setDeletePassword] = useState('');
  const [profileVisibility, setProfileVisibility] = useState('private');

  // Modals
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Theme colors
  const bg = useColorModeValue('#fff', '#0D1616');
  const color = useColorModeValue('#0D1616', '#fff');

  // Handle privacy toggles
  const handlePrivacyToggle = async (type: string, enabled: boolean) => {
    await updatePrivacySettings({
      [type]: enabled,
    });
  };

  // Handle notification toggles
  const handleNotificationToggle = async (category: string, type: string, enabled: boolean) => {
    await updateNotificationSettings({
      [category]: {
        ...settings?.preferences.notifications[category],
        [type]: enabled,
      },
    });
  };

  // Handle data export
  const handleExportData = async (format: 'json' | 'csv') => {
    const result = await exportUserData(format);
    if (result?.downloadUrl) {
      window.open(result.downloadUrl, '_blank');
    }
    onExportClose();
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    
    const success = await deleteUserAccount(deletePassword);
    if (success) {
      onDeleteClose();
      setDeletePassword('');
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Privacy Controls */}
      <SettingSection
        title={t('settings.privacy_controls')}
        description={t('settings.privacy_controls_desc')}
        icon={FiShield}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.data_sharing')}
            description={t('settings.data_sharing_desc')}
            isEnabled={settings?.preferences.privacy.dataSharing || false}
            onToggle={(enabled) => handlePrivacyToggle('dataSharing', enabled)}
            isLoading={isPrivacyLoading}
          />

          <SettingToggle
            label={t('settings.marketing_data')}
            description={t('settings.marketing_data_desc')}
            isEnabled={settings?.preferences.privacy.marketing || false}
            onToggle={(enabled) => handlePrivacyToggle('marketing', enabled)}
            isLoading={isPrivacyLoading}
          />

          <SettingToggle
            label={t('settings.analytics_data')}
            description={t('settings.analytics_data_desc')}
            isEnabled={settings?.preferences.privacy.analytics || false}
            onToggle={(enabled) => handlePrivacyToggle('analytics', enabled)}
            isLoading={isPrivacyLoading}
          />

          <FormControl>
            <FormLabel>{t('settings.profile_visibility')}</FormLabel>
            <Select
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
              variant="flushed"
              focusBorderColor={color}
            >
              <option value="private">{t('settings.visibility_private')}</option>
              <option value="friends">{t('settings.visibility_friends')}</option>
              <option value="public">{t('settings.visibility_public')}</option>
            </Select>
          </FormControl>
        </VStack>
      </SettingSection>

      {/* Notification Preferences */}
      <SettingSection
        title={t('settings.notification_preferences')}
        description={t('settings.notification_preferences_desc')}
        icon={FiBell}
      >
        <VStack spacing={4}>
          <Box w="100%">
            <TextH6 title={t('settings.email_notifications')} mb={2} />
            <VStack spacing={2}>
              <SettingToggle
                label={t('settings.order_notifications')}
                description={t('settings.order_notifications_desc')}
                isEnabled={settings?.preferences.notifications.email || false}
                onToggle={(enabled) => handleNotificationToggle('email', 'orders', enabled)}
                isLoading={isPrivacyLoading}
              />
              
              <SettingToggle
                label={t('settings.promotion_notifications')}
                description={t('settings.promotion_notifications_desc')}
                isEnabled={settings?.preferences.notifications.email || false}
                onToggle={(enabled) => handleNotificationToggle('email', 'promotions', enabled)}
                isLoading={isPrivacyLoading}
              />
            </VStack>
          </Box>

          <Box w="100%">
            <TextH6 title={t('settings.sms_notifications')} mb={2} />
            <VStack spacing={2}>
              <SettingToggle
                label={t('settings.sms_orders')}
                description={t('settings.sms_orders_desc')}
                isEnabled={settings?.preferences.notifications.sms || false}
                onToggle={(enabled) => handleNotificationToggle('sms', 'orders', enabled)}
                isLoading={isPrivacyLoading}
              />
            </VStack>
          </Box>
        </VStack>
      </SettingSection>

      {/* Data Management */}
      <SettingSection
        title={t('settings.data_management')}
        description={t('settings.data_management_desc')}
        icon={FiDownload}
      >
        <VStack spacing={4}>
          <HStack justify="space-between" w="100%">
            <Box>
              <TextH6 title={t('settings.export_data')} />
              <TextParagraph 
                title={t('settings.export_data_desc')} 
                fontSize="sm" 
                color="gray.500" 
              />
            </Box>
            <CustomButton
              title={t('settings.export')}
              onClick={onExportOpen}
              isLoading={isExporting}
              leftIcon={<FiDownload />}
            />
          </HStack>

          <Alert status="warning" borderRadius="0">
            <AlertIcon />
            <Box>
              <AlertTitle>{t('settings.danger_zone')}</AlertTitle>
              <AlertDescription>
                {t('settings.danger_zone_desc')}
              </AlertDescription>
            </Box>
          </Alert>

          <HStack justify="space-between" w="100%">
            <Box>
              <TextH6 title={t('settings.delete_account')} color="red.500" />
              <TextParagraph 
                title={t('settings.delete_account_desc')} 
                fontSize="sm" 
                color="gray.500" 
              />
            </Box>
            <CustomButton
              title={t('settings.delete')}
              onClick={onDeleteOpen}
              isLoading={isDeleting}
              bg="red.500"
              color="white"
              _hover={{ bg: 'red.600' }}
              leftIcon={<FiTrash2 />}
            />
          </HStack>
        </VStack>
      </SettingSection>

      {/* Export Data Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('settings.export_data')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <TextParagraph title={t('settings.export_format_desc')} />
              <HStack spacing={4} w="100%">
                <CustomButton
                  title="JSON"
                  onClick={() => handleExportData('json')}
                  isLoading={isExporting}
                  flex={1}
                />
                <CustomButton
                  title="CSV"
                  onClick={() => handleExportData('csv')}
                  isLoading={isExporting}
                  flex={1}
                />
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onExportClose}>
              {t('common.cancel')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red.500">{t('settings.delete_account')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="error" borderRadius="0">
                <AlertIcon />
                <AlertDescription>
                  {t('settings.delete_warning')}
                </AlertDescription>
              </Alert>
              
              <FormControl>
                <FormLabel>{t('settings.confirm_password')}</FormLabel>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder={t('settings.enter_password')}
                  variant="flushed"
                  focusBorderColor="red.500"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              {t('common.cancel')}
            </Button>
            <CustomButton
              title={t('settings.delete_permanently')}
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              isDisabled={!deletePassword}
              bg="red.500"
              color="white"
              _hover={{ bg: 'red.600' }}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};