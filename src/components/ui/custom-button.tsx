"use client";

import React from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
	title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, ...props }) => {
	return (
		<Button colorScheme="brand" variant="solid" {...props}>
			{title}
		</Button>
	);
};

export default CustomButton;
