"use client";

import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

interface LocationSelectorProps {
  children?: React.ReactNode;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ children }) => {
  return (
    <Box>
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          محدد الموقع
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

export default LocationSelector;