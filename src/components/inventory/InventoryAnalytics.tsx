"use client";

import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

interface InventoryAnalyticsProps {
  children?: React.ReactNode;
}

const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({ children }) => {
  return (
    <Box>
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          تحليلات المخزون
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

export default InventoryAnalytics;