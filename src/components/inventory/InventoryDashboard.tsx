"use client";

import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

interface InventoryDashboardProps {
  children?: React.ReactNode;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ children }) => {
  return (
    <Box>
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          لوحة تحكم المخزون
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

export default InventoryDashboard;