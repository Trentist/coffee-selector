"use client";

import React from "react";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";

export const ChangePassword: React.FC = () => {
	return (
		<Box>
			<Heading as="h3" size="md" mb={4}>
				تغيير كلمة المرور
			</Heading>
			<Text>تغيير كلمة المرور</Text>
		</Box>
	);
};

export default ChangePassword;