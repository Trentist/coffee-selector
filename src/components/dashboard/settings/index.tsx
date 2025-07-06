/**
 * Settings Details Main Page
 * الصفحة الرئيسية لتفاصيل الإعدادات
 */

import React, { useState } from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  useColorModeValue,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  FiUser,
  FiShield,
  FiGlobe,
  FiPackage,
  FiMail,
  FiLock,
} from 'react-icons/fi';
// import { motion, React.Fragment } from 'framer-motion';
import { useLocale } from '@/components/ui/useLocale';
import { TextH5 } from '@/components/ui/custom-text';
import { AccountSecuritySection } from './sections/account-security';
import { PrivacyDataSection } from './sections/privacy-data';
import { GeneralPreferencesSection } from './sections/general-preferences';
import { OrdersShippingSection } from './sections/orders-shipping';
import { CommunicationsSection } from './sections/communications';
import { AdvancedSecuritySection } from './sections/advanced-security';

const MotionBox = Box;

// Settings sections configuration
const settingsSections = [
  {
    id: 'account-security',
    title: 'settings.account_security',
    description: 'settings.account_security_desc',
    icon: FiUser,
    component: AccountSecuritySection,
  },
  {
    id: 'privacy-data',
    title: 'settings.privacy_data',
    description: 'settings.privacy_data_desc',
    icon: FiShield,
    component: PrivacyDataSection,
  },
  {
    id: 'general-preferences',
    title: 'settings.general_preferences',
    description: 'settings.general_preferences_desc',
    icon: FiGlobe,
    component: GeneralPreferencesSection,
  },
  {
    id: 'orders-shipping',
    title: 'settings.orders_shipping',
    description: 'settings.orders_shipping_desc',
    icon: FiPackage,
    component: OrdersShippingSection,
  },
  {
    id: 'communications',
    title: 'settings.communications',
    description: 'settings.communications_desc',
    icon: FiMail,
    component: CommunicationsSection,
  },
  {
    id: 'advanced-security',
    title: 'settings.advanced_security',
    description: 'settings.advanced_security_desc',
    icon: FiLock,
    component: AdvancedSecuritySection,
  },
];

/**
 * Enhanced Settings Details Page with responsive design
 */
const EnhancedSettingsDetails: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const { t, isRTL } = useLocale();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Theme colors
  const bg = useColorModeValue('#fff', '#0D1616');
  const color = useColorModeValue('#0D1616', '#fff');
  const borderColor = useColorModeValue('#E2E8F0', '#2D3748');

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, x: isRTL ? 50 : -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? -50 : 50 },
  };

  const ActiveComponent = settingsSections[activeSection]?.component;

  if (isMobile) {
    // Mobile layout with tabs
    return (
      <Box w="100%" bg={bg} minH="100vh" p={4}>
        <VStack spacing={6} align="stretch">
          <TextH5 title={t('settings.title')} color={color} />

          <Tabs
            index={activeSection}
            onChange={setActiveSection}
            variant="soft-rounded"
            colorScheme="blue"
            orientation="horizontal"
          >
            <TabList flexWrap="wrap" gap={2}>
              {settingsSections.map((section, index) => (
                <Tab
                  key={section.id}
                  fontSize="sm"
                  px={3}
                  py={2}
                  borderRadius="0"
                  _selected={{
                    bg: color,
                    color: bg,
                  }}
                >
                  {t(section.title)}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {settingsSections.map((section, index) => (
                <TabPanel key={section.id} px={0}>
                  <React.Fragment mode="wait">
                    <MotionBox
                      key={index}
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <section.component />
                    </MotionBox>
                  </React.Fragment>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    );
  }

  // Desktop layout with sidebar
  return (
    <Box w="100%" bg={bg} minH="100vh">
      <Grid templateColumns="300px 1fr" gap={0} h="100vh">
        {/* Sidebar */}
        <Box
          bg={bg}
          borderRightWidth="1px"
          borderRightColor={borderColor}
          p={6}
          overflowY="auto"
        >
          <VStack spacing={6} align="stretch">
            <TextH5 title={t('settings.title')} color={color} />

            <VStack spacing={2} align="stretch">
              {settingsSections.map((section, index) => (
                <Box
                  key={section.id}
                  as="button"
                  p={4}
                  borderRadius="0"
                  borderWidth="1px"
                  borderColor={activeSection === index ? color : borderColor}
                  bg={activeSection === index ? color : 'transparent'}
                  color={activeSection === index ? bg : color}
                  onClick={() => setActiveSection(index)}
                  transition="all 0.2s"
                  _hover={{
                    borderColor: color,
                    bg: activeSection === index ? color : 'transparent',
                  }}
                  textAlign="start"
                >
                  <HStack spacing={3}>
                    <section.icon size={20} />
                    <VStack align="start" spacing={0}>
                      <TextH5 title={t(section.title)} fontSize="sm" />
                      <Box fontSize="xs" opacity={0.7}>
                        {t(section.description)}
                      </Box>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box p={8} overflowY="auto">
          <React.Fragment mode="wait">
            <MotionBox
              key={activeSection}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {ActiveComponent && <ActiveComponent />}
            </MotionBox>
          </React.Fragment>
        </Box>
      </Grid>
    </Box>
  );
};

export default EnhancedSettingsDetails;