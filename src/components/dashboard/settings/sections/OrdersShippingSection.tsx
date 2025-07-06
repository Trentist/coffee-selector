"use client";

import React from "react";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";

export const OrdersShippingSection: React.FC = () => {
	return (
		<Box>
			<Heading as="h3" size="md" mb={4}>
				الطلبات والشحن
			</Heading>
			<Text>قسم الطلبات والشحن</Text>
		</Box>
	);
};

export default OrdersShippingSection;