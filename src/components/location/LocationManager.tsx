"use client";

import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

interface LocationManagerProps {
  children?: React.ReactNode;
}

const LocationManager: React.FC<LocationManagerProps> = ({ children }) => {
  return (
    <Box>
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          مدير الموقع
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

export default LocationManager;