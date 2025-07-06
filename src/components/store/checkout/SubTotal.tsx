/**
 * SubTotal Component
 * مكون المجموع الفرعي
 */

import React from "react";
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

// Components
import { useLocale } from "@/components/ui/useLocale";
import { useCurrency } from "@/context/currency-context";

// Types
import { SubTotalProps } from "./types/SubTotal.types";

const SubTotal = ({ subTotal }: SubTotalProps) => {
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
					fontSize={"12px"}
					fontWeight={"500"}
					lineHeight={"13px"}
					textTransform={"uppercase"}
					color={textColor}>
					{t("checkout.subtotal")}
				</Heading>
				<Heading
					fontSize={"12px"}
					fontWeight={"500"}
					lineHeight={"13px"}
					textTransform={"uppercase"}
					color={textColor}>
					{formatPrice(subTotal)}
				</Heading>
			</Flex>
		</>
	);
};

export default SubTotal;
