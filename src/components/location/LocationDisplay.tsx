"use client";

import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

interface LocationDisplayProps {
  children?: React.ReactNode;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ children }) => {
  return (
    <Box>
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          عرض الموقع
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

export default LocationDisplay;