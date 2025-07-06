/**
 * Discount Component
 * مكون الخصم
 */

import React from "react";
import { Flex, Heading, useColorModeValue, Text } from "@chakra-ui/react";

// Components
import { useLocale } from "@/components/ui/useLocale";
import { useCurrency } from "@/context/currency-context";

// Types
import { DiscountProps } from "./types/Discount.types";

const Discount = ({
	discountAmount,
	discountPercentage,
	couponCode,
}: DiscountProps) => {
	const { t } = useLocale();
	const { formatPrice } = useCurrency();
	const textColor = useColorModeValue("#0D1616", "#fff");
	const discountColor = useColorModeValue("green.500", "green.300");

	if (discountAmount <= 0) {
		return null;
	}

	return (
		<>
			<Flex
				w="100%"
				alignItems={"center"}
				justifyContent={"space-between"}
				my=".2rem"
				px=".5rem"
				color={discountColor}>
				<Flex direction="column">
					<Heading
						fontSize={"12px"}
						fontWeight={"500"}
						lineHeight={"13px"}
						textTransform={"uppercase"}
						color={discountColor}>
						{t("checkout.discount")}
					</Heading>
					{couponCode && (
						<Text fontSize="10px" color={textColor}>
							({couponCode})
						</Text>
					)}
				</Flex>
				<Heading
					fontSize={"12px"}
					fontWeight={"500"}
					lineHeight={"13px"}
					textTransform={"uppercase"}
					color={discountColor}>
					-{formatPrice(discountAmount)}
				</Heading>
			</Flex>
		</>
	);
};

export default Discount;
