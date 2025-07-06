"use client";

import React from "react";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";

export const AccountSecuritySection: React.FC = () => {
	return (
		<Box>
			<Heading as="h3" size="md" mb={4}>
				أمان الحساب
			</Heading>
			<Text>قسم أمان الحساب</Text>
		</Box>
	);
};

export default AccountSecuritySection;
