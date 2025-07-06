/**
 * Setting Select Component
 * مكون قائمة الاختيار للإعدادات
 */

import React from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { TextParagraph } from '@/components/ui/custom-text';

interface SettingSelectProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  isDisabled?: boolean;
  placeholder?: string;
}

/**
 * Unified select component for settings
 */
export const SettingSelect: React.FC<SettingSelectProps> = ({
  label,
  description,
  value,
  onChange,
  options,
  isDisabled = false,
  placeholder,
}) => {
  // Theme colors
  const color = useColorModeValue('#0D1616', '#fff');

  return (
    <FormControl isDisabled={isDisabled}>
      <VStack align="start" spacing={1} w="100%">
        <FormLabel mb={1}>{label}</FormLabel>
        {description && (
          <TextParagraph 
            title={description} 
            fontSize="sm" 
            color="gray.500" 
            mb={2}
          />
        )}
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          variant="flushed"
          focusBorderColor={color}
          placeholder={placeholder}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </VStack>
    </FormControl>
  );
};