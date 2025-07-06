"use client";

import React from "react";
import { Box, Container, VStack, Heading, Text } from "@chakra-ui/react";

interface AboutPageProps {
	data?: any;
}

export const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
	if (!data) {
		return null;
	}

	return (
		<Container maxW="6xl" py={8}>
			<VStack spacing={6} align="stretch">
				<Heading as="h1" size="xl">
					{data.title || "من نحن"}
				</Heading>
				{data.content && (
					<Text dangerouslySetInnerHTML={{ __html: data.content }} />
				)}
			</VStack>
		</Container>
	);
};

export default AboutPage;
