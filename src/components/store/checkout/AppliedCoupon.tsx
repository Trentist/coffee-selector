/**
 * AppliedCoupon Component
 * مكون الكوبون المطبق
 */

import React from "react";
import {
	Flex,
	Heading,
	useColorModeValue,
	IconButton,
	Text,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

// Components
import { useLocale } from "@/components/ui/useLocale";
import { useCurrency } from "@/context/currency-context";

// Types
import { AppliedCouponProps } from "./types/AppliedCoupon.types";

const AppliedCoupon = ({
	couponCode,
	discountAmount,
	discountPercentage,
	onRemove,
}: AppliedCouponProps) => {
	const { t } = useLocale();
	const { formatPrice } = useCurrency();
	const textColor = useColorModeValue("#0D1616", "#fff");
	const successColor = useColorModeValue("green.500", "green.300");

	return (
		<>
			<Flex
				w="100%"
				alignItems={"center"}
				justifyContent={"space-between"}
				my=".2rem"
				px=".5rem"
				color={successColor}>
				<Flex direction="column" flex="1">
					<Heading
						fontSize={"12px"}
						fontWeight={"500"}
						lineHeight={"13px"}
						textTransform={"uppercase"}
						color={successColor}>
						{t("checkout.coupon_applied")}
					</Heading>
					<Text fontSize="10px" color={textColor}>
						{couponCode} - {discountPercentage}% {t("checkout.off")}
					</Text>
				</Flex>
				<Flex alignItems="center" gap={2}>
					<Heading
						fontSize={"12px"}
						fontWeight={"500"}
						lineHeight={"13px"}
						textTransform={"uppercase"}
						color={successColor}>
						-{formatPrice(discountAmount)}
					</Heading>
					<IconButton
						aria-label="Remove coupon"
						icon={<FaTimes />}
						size="xs"
						variant="ghost"
						color={textColor}
						onClick={onRemove}
						_hover={{ color: "red.500" }}
					/>
				</Flex>
			</Flex>
		</>
	);
};

export default AppliedCoupon;
