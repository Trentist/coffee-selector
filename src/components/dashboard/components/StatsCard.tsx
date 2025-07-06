/**
 * Stats Card Component
 * مكون بطاقة الإحصائيات المخصص
 */

import React from "react";
import { Flex, VStack, HStack, Text, Box, Icon } from "@chakra-ui/react";
import {
	FaShoppingCart,
	FaMoneyBillWave,
	FaHeart,
	FaTruck,
	FaClock,
	FaBoxOpen,
	FaFileInvoice,
} from "react-icons/fa";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import DashboardCard from "./DashboardCard";

interface StatsCardProps {
	label: string;
	value: string | number;
	icon: string;
	color: string;
	change?: string;
	isIncrease?: boolean;
}

const iconMap: Record<string, React.ComponentType> = {
	FaShoppingCart,
	FaMoneyBillWave,
	FaHeart,
	FaTruck,
	FaClock,
	FaBoxOpen,
	FaFileInvoice,
};

const StatsCard: React.FC<StatsCardProps> = ({
	label,
	value,
	icon,
	color,
	change,
	isIncrease,
}) => {
	const { textColor } = useThemeColors();
	const IconComponent = iconMap[icon] || FaShoppingCart;

	return (
		<DashboardCard>
			<Flex justify="space-between" align="center">
				<VStack align="start" spacing={1}>
					<Text fontSize="sm" color="gray.600">
						{label}
					</Text>
					<Text fontSize="2xl" fontWeight="bold" color={textColor}>
						{value}
					</Text>
					{change && (
						<HStack spacing={1}>
							<Text fontSize="xs" color={isIncrease ? "green.500" : "red.500"}>
								{change}
							</Text>
						</HStack>
					)}
				</VStack>
				<Box
					p={3}
					borderRadius="full"
					bg={`${color}.100`}
					color={`${color}.600`}>
					<Icon as={IconComponent} boxSize={6} />
				</Box>
			</Flex>
		</DashboardCard>
	);
};

export default StatsCard;
