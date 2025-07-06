"use client";

import React from "react";
import { Box } from "@chakra-ui/react";

interface LayoutMainProps {
	children: React.ReactNode;
}

const LayoutMain: React.FC<LayoutMainProps> = ({ children }) => {
	return (
		<Box minH="100vh" bg="gray.50">
			{children}
		</Box>
	);
};

export default LayoutMain;
