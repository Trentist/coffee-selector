"use client";

import React from "react";
import { Text } from "@chakra-ui/react";

interface HeaderPagesTextProps {
	title: string;
	subtitle?: string;
}

const HeaderPagesText: React.FC<HeaderPagesTextProps> = ({
	title,
	subtitle,
}) => {
	return (
		<div>
			<Text fontSize="2xl" fontWeight="bold" textAlign="center">
				{title}
			</Text>
			{subtitle && (
				<Text fontSize="md" color="gray.600" textAlign="center" mt={2}>
					{subtitle}
				</Text>
			)}
		</div>
	);
};

export default HeaderPagesText;
