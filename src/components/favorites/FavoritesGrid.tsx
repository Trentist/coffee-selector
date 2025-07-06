"use client";

import React from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

interface FavoritesGridProps {
  items?: any[];
}

const FavoritesGrid: React.FC<FavoritesGridProps> = ({ items = [] }) => {
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        <Text fontSize="md">شبكة المفضلة</Text>
        {items.length === 0 && (
          <Text fontSize="sm" color="gray.500">
            لا توجد عناصر في المفضلة
          </Text>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default FavoritesGrid;