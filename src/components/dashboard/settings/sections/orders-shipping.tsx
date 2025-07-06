/**
 * Orders & Shipping Section
 * قسم الطلبات والشحن
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
  Textarea,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { 
  FiPackage, 
  FiTruck,
  FiBell,
  FiMapPin,
  FiRotateCcw,
  FiPlus,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import { SettingSection } from '../components/setting-section';
import { SettingToggle } from '../components/setting-toggle';
import { useSettings } from '../hooks/use-settings';
import { useLocale } from '@/components/ui/useLocale';
import { TextH6, TextParagraph } from '@/components/ui/custom-text';
import CustomButton from '@/components/ui/custom-button';

// Shipping preferences
const SHIPPING_METHODS = [
  { value: 'standard', label: 'Standard Shipping (3-5 days)', price: 'Free' },
  { value: 'express', label: 'Express Shipping (1-2 days)', price: '$15' },
  { value: 'overnight', label: 'Overnight Shipping', price: '$25' },
];

// Return preferences
const RETURN_PERIODS = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
];

/**
 * Orders & Shipping section component
 */
export const OrdersShippingSection: React.FC = () => {
  const { settings, isLoading, isUpdating, updatePreferences } = useSettings();
  const { t } = useLocale();
  
  // Local state
  const [preferredShipping, setPreferredShipping] = useState('standard');
  const [returnPeriod, setReturnPeriod] = useState('14');
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    country: '',
    phone: '',
    type: 'shipping'
  });

  // Modals
  const { isOpen: isAddressOpen, onOpen: onAddressOpen, onClose: onAddressClose } = useDisclosure();

  // Theme colors
  const bg = useColorModeValue('#fff', '#0D1616');
  const color = useColorModeValue('#0D1616', '#fff');

  // Handle shipping preferences
  const handleShippingToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      shipping: {
        ...settings?.preferences.shipping,
        [type]: enabled,
      },
    });
  };

  // Handle order notifications
  const handleOrderNotificationToggle = async (type: string, enabled: boolean) => {
    await updatePreferences({
      notifications: {
        ...settings?.preferences.notifications,
        orders: {
          ...settings?.preferences.notifications.orders,
          [type]: enabled,
        },
      },
    });
  };

  // Handle address save
  const handleSaveAddress = async () => {
    // This would save the address via GraphQL
    console.log('Saving address:', newAddress);
    onAddressClose();
    setNewAddress({
      name: '',
      street: '',
      city: '',
      country: '',
      phone: '',
      type: 'shipping'
    });
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Shipping Preferences */}
      <SettingSection
        title={t('settings.shipping_preferences')}
        description={t('settings.shipping_preferences_desc')}
        icon={FiTruck}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t('settings.preferred_shipping_method')}</FormLabel>
            <Select
              value={preferredShipping}
              onChange={(e) => setPreferredShipping(e.target.value)}
              variant="flushed"
              focusBorderColor={color}
            >
              {SHIPPING_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label} - {method.price}
                </option>
              ))}
            </Select>
          </FormControl>

          <SettingToggle
            label={t('settings.auto_select_fastest')}
            description={t('settings.auto_select_fastest_desc')}
            isEnabled={settings?.preferences.shipping?.autoSelectFastest || false}
            onToggle={(enabled) => handleShippingToggle('autoSelectFastest', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.signature_required')}
            description={t('settings.signature_required_desc')}
            isEnabled={settings?.preferences.shipping?.signatureRequired || false}
            onToggle={(enabled) => handleShippingToggle('signatureRequired', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.weekend_delivery')}
            description={t('settings.weekend_delivery_desc')}
            isEnabled={settings?.preferences.shipping?.weekendDelivery || false}
            onToggle={(enabled) => handleShippingToggle('weekendDelivery', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Order Notifications */}
      <SettingSection
        title={t('settings.order_notifications')}
        description={t('settings.order_notifications_desc')}
        icon={FiBell}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.order_confirmation')}
            description={t('settings.order_confirmation_desc')}
            isEnabled={settings?.preferences.notifications?.orders?.confirmation || true}
            onToggle={(enabled) => handleOrderNotificationToggle('confirmation', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.shipping_updates')}
            description={t('settings.shipping_updates_desc')}
            isEnabled={settings?.preferences.notifications?.orders?.shipping || true}
            onToggle={(enabled) => handleOrderNotificationToggle('shipping', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.delivery_notifications')}
            description={t('settings.delivery_notifications_desc')}
            isEnabled={settings?.preferences.notifications?.orders?.delivery || true}
            onToggle={(enabled) => handleOrderNotificationToggle('delivery', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.delay_notifications')}
            description={t('settings.delay_notifications_desc')}
            isEnabled={settings?.preferences.notifications?.orders?.delays || true}
            onToggle={(enabled) => handleOrderNotificationToggle('delays', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Return Settings */}
      <SettingSection
        title={t('settings.return_settings')}
        description={t('settings.return_settings_desc')}
        icon={FiRotateCcw}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t('settings.return_period')}</FormLabel>
            <Select
              value={returnPeriod}
              onChange={(e) => setReturnPeriod(e.target.value)}
              variant="flushed"
              focusBorderColor={color}
            >
              {RETURN_PERIODS.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <SettingToggle
            label={t('settings.auto_return_approval')}
            description={t('settings.auto_return_approval_desc')}
            isEnabled={settings?.preferences.returns?.autoApproval || false}
            onToggle={(enabled) => handleShippingToggle('autoReturnApproval', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.return_notifications')}
            description={t('settings.return_notifications_desc')}
            isEnabled={settings?.preferences.notifications?.returns || true}
            onToggle={(enabled) => handleOrderNotificationToggle('returns', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Saved Addresses */}
      <SettingSection
        title={t('settings.saved_addresses')}
        description={t('settings.saved_addresses_desc')}
        icon={FiMapPin}
      >
        <VStack spacing={4}>
          {/* Display saved addresses */}
          {settings?.addresses?.map((address, index) => (
            <Box
              key={address.id}
              p={4}
              borderWidth="1px"
              borderRadius="0"
              w="100%"
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <TextH6 title={address.name} />
                  <TextParagraph 
                    title={`${address.street}, ${address.city}, ${address.country}`}
                    fontSize="sm"
                    color="gray.500"
                  />
                  {address.isDefault && (
                    <Box
                      px={2}
                      py={1}
                      bg={color}
                      color={bg}
                      fontSize="xs"
                      borderRadius="0"
                    >
                      {t('settings.default_address')}
                    </Box>
                  )}
                </VStack>
                <HStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiEdit />}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<FiTrash2 />}
                  >
                    {t('common.delete')}
                  </Button>
                </HStack>
              </HStack>
            </Box>
          ))}

          {/* Add new address button */}
          <CustomButton
            title={t('settings.add_new_address')}
            leftIcon={<FiPlus />}
            onClick={onAddressOpen}
            variant="outline"
            w="100%"
          />
        </VStack>
      </SettingSection>

      {/* Add Address Modal */}
      <Modal isOpen={isAddressOpen} onClose={onAddressClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('settings.add_new_address')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                <FormControl>
                  <FormLabel>{t('settings.address_name')}</FormLabel>
                  <Input
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    placeholder={t('settings.address_name_placeholder')}
                    variant="flushed"
                    focusBorderColor={color}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('settings.phone')}</FormLabel>
                  <Input
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    placeholder={t('settings.phone_placeholder')}
                    variant="flushed"
                    focusBorderColor={color}
                  />
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel>{t('settings.street_address')}</FormLabel>
                <Textarea
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  placeholder={t('settings.street_address_placeholder')}
                  variant="flushed"
                  focusBorderColor={color}
                />
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                <FormControl>
                  <FormLabel>{t('settings.city')}</FormLabel>
                  <Input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    placeholder={t('settings.city_placeholder')}
                    variant="flushed"
                    focusBorderColor={color}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('settings.country')}</FormLabel>
                  <Select
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                    variant="flushed"
                    focusBorderColor={color}
                  >
                    <option value="">Select Country</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                  </Select>
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel>{t('settings.address_type')}</FormLabel>
                <Select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                  variant="flushed"
                  focusBorderColor={color}
                >
                  <option value="shipping">{t('settings.shipping_address')}</option>
                  <option value="billing">{t('settings.billing_address')}</option>
                  <option value="both">{t('settings.both_addresses')}</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddressClose}>
              {t('common.cancel')}
            </Button>
            <CustomButton
              title={t('settings.save_address')}
              onClick={handleSaveAddress}
              bg={color}
              color={bg}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};