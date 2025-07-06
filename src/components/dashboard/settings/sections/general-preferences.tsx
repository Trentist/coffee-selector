/**
 * General Preferences Section
 * قسم التفضيلات العامة
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
} from '@chakra-ui/react';
import { 
  FiGlobe, 
  FiDollarSign, 
  FiMonitor,
  FiSettings,
  FiClock,
  FiEye
} from 'react-icons/fi';
import { SettingSection } from '../components/setting-section';
import { SettingToggle } from '../components/setting-toggle';
import { useSettings } from '../hooks/use-settings';
import { useLocale } from '@/components/ui/useLocale';
import { useAppContext } from '@/context/app-context';
import { TextH6, TextParagraph } from '@/components/ui/custom-text';
import CustomButton from '@/components/ui/custom-button';

// Available languages
const LANGUAGES = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

// Available currencies
const CURRENCIES = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

// Available timezones
const TIMEZONES = [
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (GMT+3)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
];

// Display themes
const THEMES = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'auto', label: 'Auto (System)' },
];

// Display density options
const DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
  { value: 'spacious', label: 'Spacious' },
];

/**
 * General Preferences section component
 */
export const GeneralPreferencesSection: React.FC = () => {
  const { settings, isLoading, isUpdating, updatePreferences } = useSettings();
  const { currency, setCurrency, language, setLanguage } = useAppContext();
  const { t } = useLocale();

  // Local state for form values
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'ar');
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'AED');
  const [selectedTimezone, setSelectedTimezone] = useState(
    settings?.preferences.timezone || 'Asia/Dubai'
  );
  const [selectedTheme, setSelectedTheme] = useState(
    settings?.preferences.display.theme || 'light'
  );
  const [selectedDensity, setSelectedDensity] = useState(
    settings?.preferences.display.density || 'comfortable'
  );

  // Theme colors
  const bg = useColorModeValue('#fff', '#0D1616');
  const color = useColorModeValue('#0D1616', '#fff');

  // Handle language change
  const handleLanguageChange = async (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    setLanguage(newLanguage as any);
    
    await updatePreferences({
      language: newLanguage,
    });
  };

  // Handle currency change
  const handleCurrencyChange = async (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    setCurrency(newCurrency as any);
    
    await updatePreferences({
      currency: newCurrency,
    });
  };

  // Handle timezone change
  const handleTimezoneChange = async (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    
    await updatePreferences({
      timezone: newTimezone,
    });
  };

  // Handle display preferences
  const handleDisplayToggle = async (type: string, value: boolean | string) => {
    await updatePreferences({
      display: {
        ...settings?.preferences.display,
        [type]: value,
      },
    });
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Language & Region */}
      <SettingSection
        title={t('settings.language_region')}
        description={t('settings.language_region_desc')}
        icon={FiGlobe}
      >
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <FormControl>
            <FormLabel>{t('settings.language')}</FormLabel>
            <Select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              variant="flushed"
              focusBorderColor={color}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t('settings.timezone')}</FormLabel>
            <Select
              value={selectedTimezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              variant="flushed"
              focusBorderColor={color}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </SettingSection>

      {/* Currency Preferences */}
      <SettingSection
        title={t('settings.currency_preferences')}
        description={t('settings.currency_preferences_desc')}
        icon={FiDollarSign}
      >
        <FormControl>
          <FormLabel>{t('settings.preferred_currency')}</FormLabel>
          <Select
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            variant="flushed"
            focusBorderColor={color}
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name} ({curr.symbol})
              </option>
            ))}
          </Select>
        </FormControl>
      </SettingSection>

      {/* Display Settings */}
      <SettingSection
        title={t('settings.display_settings')}
        description={t('settings.display_settings_desc')}
        icon={FiMonitor}
      >
        <VStack spacing={4}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} w="100%">
            <FormControl>
              <FormLabel>{t('settings.theme')}</FormLabel>
              <Select
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  handleDisplayToggle('theme', e.target.value);
                }}
                variant="flushed"
                focusBorderColor={color}
              >
                {THEMES.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {t(`settings.${theme.value}_theme`)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('settings.density')}</FormLabel>
              <Select
                value={selectedDensity}
                onChange={(e) => {
                  setSelectedDensity(e.target.value);
                  handleDisplayToggle('density', e.target.value);
                }}
                variant="flushed"
                focusBorderColor={color}
              >
                {DENSITY_OPTIONS.map((density) => (
                  <option key={density.value} value={density.value}>
                    {t(`settings.${density.value}_density`)}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <SettingToggle
            label={t('settings.animations')}
            description={t('settings.animations_desc')}
            isEnabled={settings?.preferences.display.animations || true}
            onToggle={(enabled) => handleDisplayToggle('animations', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Interface Preferences */}
      <SettingSection
        title={t('settings.interface_preferences')}
        description={t('settings.interface_preferences_desc')}
        icon={FiSettings}
      >
        <VStack spacing={4}>
          <SettingToggle
            label={t('settings.compact_mode')}
            description={t('settings.compact_mode_desc')}
            isEnabled={selectedDensity === 'compact'}
            onToggle={(enabled) => {
              const newDensity = enabled ? 'compact' : 'comfortable';
              setSelectedDensity(newDensity);
              handleDisplayToggle('density', newDensity);
            }}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.auto_save')}
            description={t('settings.auto_save_desc')}
            isEnabled={true} // This would come from settings
            onToggle={(enabled) => handleDisplayToggle('autoSave', enabled)}
            isLoading={isUpdating}
          />

          <SettingToggle
            label={t('settings.keyboard_shortcuts')}
            description={t('settings.keyboard_shortcuts_desc')}
            isEnabled={true} // This would come from settings
            onToggle={(enabled) => handleDisplayToggle('keyboardShortcuts', enabled)}
            isLoading={isUpdating}
          />
        </VStack>
      </SettingSection>

      {/* Save Changes */}
      <HStack justify="end" w="100%">
        <CustomButton
          title={t('settings.save_all_changes')}
          isLoading={isUpdating}
          bg={color}
          color={bg}
          onClick={() => {
            // This would trigger a comprehensive save
            console.log('Saving all preferences...');
          }}
        />
      </HStack>
    </VStack>
  );
};