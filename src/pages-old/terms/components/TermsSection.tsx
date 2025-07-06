/**
 * Terms Section Component
 * مكون قسم الشروط
 */

import React from "react";
import {
	Box,
	VStack,
	Text,
	UnorderedList,
	ListItem,
	useColorModeValue,
} from "@chakra-ui/react";

interface TermsSectionProps {
	section: {
		id: string;
		title: string;
		content: string;
		items?: string[];
	};
}

const TermsSection: React.FC<TermsSectionProps> = ({ section }) => {
	const textColor = useColorModeValue("gray.800", "white");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	return (
		<Box
			py={6}
			borderBottom="1px"
			borderColor={borderColor}
			_last={{ borderBottom: "none" }}>
			<VStack align="start" spacing={4}>
				<Text fontSize="xl" fontWeight="bold" color={textColor} id={section.id}>
					{section.title}
				</Text>

				<Text
					fontSize="md"
					color={useColorModeValue("gray.600", "gray.300")}
					lineHeight="tall">
					{section.content}
				</Text>

				{section.items && section.items.length > 0 && (
					<UnorderedList spacing={2} pl={6}>
						{section.items.map((item, index) => (
							<ListItem
								key={index}
								fontSize="md"
								color={useColorModeValue("gray.600", "gray.300")}
								lineHeight="tall">
								{item}
							</ListItem>
						))}
					</UnorderedList>
				)}
			</VStack>
		</Box>
	);
};

export default TermsSection;
