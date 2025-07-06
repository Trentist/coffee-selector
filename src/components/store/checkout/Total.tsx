/**
 * Total Component
 * مكون المجموع الكلي
 */

import React from "react";
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

// Components
import { useLocale } from "@/components/ui/useLocale";
import { useCurrency } from "@/context/currency-context";

// Types
import { TotalProps } from "./types/Total.types";

const Total = ({
	total,
	subTotal,
	shippingCost,
	taxAmount = 0,
	discountAmount = 0,
}: TotalProps) => {
	const { t } = useLocale();
	const { formatPrice } = useCurrency();
	const textColor = useColorModeValue("#0D1616", "#fff");

	return (
		<>
			<Flex
				w="100%"
				alignItems={"center"}
				justifyContent={"space-between"}
				my=".2rem"
				px=".5rem"
				color={textColor}>
				<Heading
					fontSize={"14px"}
					fontWeight={"bold"}
					lineHeight={"16px"}
					textTransform={"uppercase"}
					color={textColor}>
					{t("checkout.total")}
				</Heading>
				<Heading
					fontSize={"14px"}
					fontWeight={"bold"}
					lineHeight={"16px"}
					textTransform={"uppercase"}
					color={textColor}>
					{formatPrice(total)}
				</Heading>
			</Flex>
		</>
	);
};

export default Total;
