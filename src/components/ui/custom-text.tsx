/**
 * Custom Text Components
 * مكونات النصوص المخصصة
 */

import React from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TextStyleProps extends TextProps {
	title?: string;
	t?: (key: string) => string;
}

export const TextH5: React.FC<TextStyleProps> = ({
	title,
	t,
	children,
	...props
}) => (
	<Text fontSize="lg" fontWeight="semibold" lineHeight="1.4" {...props}>
		{title ? (t ? t(title) : title) : children}
	</Text>
);

export const TextH6: React.FC<TextStyleProps> = ({
	title,
	t,
	children,
	...props
}) => (
	<Text fontSize="md" fontWeight="medium" lineHeight="1.4" {...props}>
		{title ? (t ? t(title) : title) : children}
	</Text>
);

export const TextLabel: React.FC<TextStyleProps> = ({
	title,
	t,
	children,
	...props
}) => (
	<Text fontSize="sm" fontWeight="medium" lineHeight="1.4" {...props}>
		{title ? (t ? t(title) : title) : children}
	</Text>
);

export const TextParagraph: React.FC<TextStyleProps> = ({
	title,
	t,
	children,
	...props
}) => (
	<Text fontSize="sm" lineHeight="1.6" {...props}>
		{title ? (t ? t(title) : title) : children}
	</Text>
);
