/**
 * Currency Selector Component
 * Displays current currency and allows manual selection
 */

import React from 'react';
import {
	Box,
	Text,
	HStack,
	Icon,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
} from '@chakra-ui/react';
import { FiDollarSign, FiChevronDown } from 'react-icons/fi';

interface CurrencySelectorProps {
	currency: string;
	setCurrency: (currency: string) => void;
	currencies: string[];
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
	currency,
	setCurrency,
	currencies,
}) => {
	const getCurrencySymbol = (curr: string) => {
		const symbols: { [key: string]: string } = {
			USD: '$',
			EUR: '€',
			GBP: '£',
			AED: 'د.إ',
			SAR: 'ر.س',
			KWD: 'د.ك',
			QAR: 'ر.ق',
			OMR: 'ر.ع',
			BHD: 'د.ب',
		};
		return symbols[curr] || curr;
	};

	return (
		<Box>
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<FiChevronDown />}
					variant="ghost"
					size="sm"
					h="auto"
					p={2}
					minW="auto"
				>
					<HStack spacing={2}>
						<Icon as={FiDollarSign} color="green.500" />
						<Text fontSize="xs" fontWeight="medium">
							{getCurrencySymbol(currency)} {currency}
						</Text>
					</HStack>
				</MenuButton>
				<MenuList>
					{currencies.map((curr) => (
						<MenuItem
							key={curr}
							onClick={() => setCurrency(curr)}
							icon={<FiDollarSign />}
						>
							<HStack spacing={2}>
								<Text fontSize="sm">
									{getCurrencySymbol(curr)} {curr}
								</Text>
							</HStack>
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Box>
	);
};