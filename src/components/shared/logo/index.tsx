"use client";

import React from "react";
import { Box, Image } from "@chakra-ui/react";

export const LogoNav: React.FC = () => {
	return (
		<Box>
			<Image
				src="/assets/branding/logo.svg"
				alt="Coffee Selection Logo"
				h="40px"
				w="auto"
			/>
		</Box>
	);
};

export default LogoNav;
