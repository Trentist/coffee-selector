"use client";

import React from "react";
import { Text } from "@chakra-ui/react";
import Link from "next/link";

interface CustomLinkProps {
	title: string;
	href: string;
}

export const CustomLink: React.FC<CustomLinkProps> = ({ title, href }) => {
	return (
		<Link href={href}>
			<Text
				_hover={{ color: "brand.500" }}
				transition="color 0.2s"
				cursor="pointer">
				{title}
			</Text>
		</Link>
	);
};

export default CustomLink;
