/**
 * Setting Toggle Component
 * مكون مفتاح التبديل للإعدادات
 */

import React from 'react';
import {
  Flex,
  Switch,
  VStack,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { TextH6, TextParagraph } from '@/components/ui/custom-text';

interface SettingToggleProps {
  label: string;
  description?: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

/**
 * Unified toggle component for settings with loading state
 */
export const SettingToggle: React.FC<SettingToggleProps> = ({
  label,
  description,
  isEnabled,
  onToggle,
  isLoading = false,
  isDisabled = false,
}) => {
  // Theme colors
  const color = useColorModeValue('#0D1616', '#fff');

  const handleToggle = () => {
    if (!isLoading && !isDisabled) {
      onToggle(!isEnabled);
    }
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      w="100%"
      py={3}
      px={1}
    >
      <VStack align="start" spacing={1} flex={1}>
        <TextH6 title={label} color={color} />
        {description && (
          <TextParagraph 
            title={description} 
            fontSize="sm" 
            color="gray.500" 
          />
        )}
      </VStack>

      <Flex align="center" gap={2}>
        {isLoading && <Spinner size="sm" color={color} />}
        <Switch
          isChecked={isEnabled}
          onChange={handleToggle}
          isDisabled={isLoading || isDisabled}
          colorScheme="blue"
          size="md"
        />
      </Flex>
    </Flex>
  );
};