"use client";

import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const ProfileSettings: React.FC = () => {
	return (
		<Box>
			<Heading as="h3" size="md" mb={4}>
				إعدادات الملف الشخصي
			</Heading>
			<Text>إعدادات الملف الشخصي</Text>
		</Box>
	);
};

export default ProfileSettings;