/**
 * Setting Input Component
 * مكون حقل الإدخال للإعدادات
 */

import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { TextParagraph } from '@/components/ui/custom-text';

interface SettingInputProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'time' | 'textarea';
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: string;
  rows?: number;
}

/**
 * Unified input component for settings
 */
export const SettingInput: React.FC<SettingInputProps> = ({
  label,
  description,
  value,
  onChange,
  type = 'text',
  placeholder,
  isDisabled = false,
  isRequired = false,
  error,
  rows = 3,
}) => {
  // Theme colors
  const color = useColorModeValue('#0D1616', '#fff');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormControl isDisabled={isDisabled} isRequired={isRequired} isInvalid={!!error}>
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
        
        {type === 'textarea' ? (
          <Textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            variant="flushed"
            focusBorderColor={color}
            rows={rows}
            resize="vertical"
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            variant="flushed"
            focusBorderColor={color}
          />
        )}
        
        {error && (
          <FormErrorMessage>
            {error}
          </FormErrorMessage>
        )}
      </VStack>
    </FormControl>
  );
};