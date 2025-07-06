/**
 * Dashboard Card Component
 * مكون البطاقة المخصص للوحة التحكم
 */

import React from "react";
import { Box, Card, CardHeader, CardBody, Heading, Text } from "@chakra-ui/react";
import { useThemeColors } from '@/theme/hooks/useThemeColors';

interface DashboardCardProps {
	title?: string;
	children: React.ReactNode;
	headerContent?: React.ReactNode;
	onClick?: () => void;
	isClickable?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
	title,
	children,
	headerContent,
	onClick,
	isClickable = false,
}) => {
	const { cardBg, cardBorder, textPrimary, textSecondary } = useThemeColors();

	return (
		<Card
			bg={cardBg}
			border="1px"
			borderColor={cardBorder}
			cursor={isClickable ? "pointer" : "default"}
			onClick={onClick}
			transition="all 0.2s"
			_hover={isClickable ? { transform: "translateY(-2px)", boxShadow: "lg" } : {}}
		>
			{title && (
				<CardHeader>
					<Heading size="md" color={textPrimary}>
						{title}
					</Heading>
				</CardHeader>
			)}
			{headerContent && (
				<CardHeader>
					{headerContent}
				</CardHeader>
			)}
			<CardBody>
				{children}
			</CardBody>
		</Card>
	);
};

export default DashboardCard;