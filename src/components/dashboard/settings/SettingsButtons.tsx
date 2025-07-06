"use client";

import React from "react";
import { Box, HStack, Button } from "@chakra-ui/react";

export const SettingsButtons: React.FC = () => {
	return (
		<Box>
			<HStack spacing={4}>
				<Button variant="outline">إلغاء</Button>
				<Button colorScheme="blue">حفظ</Button>
			</HStack>
		</Box>
	);
};

export default SettingsButtons;