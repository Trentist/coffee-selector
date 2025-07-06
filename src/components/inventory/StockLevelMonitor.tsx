"use client";

import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

interface StockLevelMonitorProps {
  children?: React.ReactNode;
}

const StockLevelMonitor: React.FC<StockLevelMonitorProps> = ({ children }) => {
  return (
    <Box>
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          مراقب مستوى المخزون
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

export default StockLevelMonitor;