"use client";

/**
 * Enhanced Filter Panel Component
 * Advanced filtering system with multiple filter types and responsive design
 */

import React, { useState } from "react";
import {
	Box,
	VStack,
	HStack,
	Text,
	Button,
	Checkbox,
	RangeSlider,
	RangeSliderTrack,
	RangeSliderFilledTrack,
	RangeSliderThumb,
	Badge,
	Input,
	Divider,
	useColorModeValue,
	Flex,
	Tag,
	TagLabel,
	TagCloseButton,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	SimpleGrid,
	Circle,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
// import { motion, React.Fragment } from "framer-motion";
import {
	EnhancedFilterPanelProps,
	FilterSection,
	ActiveFilter,
} from "./types/EnhancedFilterPanel.types";
import {
	getActiveFiltersArray,
	filterOptionsBySearch,
	getDefaultRangeValues,
	isOptionSelected,
	toggleFilterOption,
	removeSpecificFilter,
	generateRandomCount,
} from "./helpers/EnhancedFilterPanel.helpers";

const MotionBox = Box;

// Minimal mock data for sections
const defaultSections: FilterSection[] = [
	{
		id: "category",
		title: "الفئة",
		type: "checkbox",
		options: [
			{ id: "coffee", label: "قهوة", count: 25 },
			{ id: "tea", label: "شاي", count: 15 },
			{ id: "accessories", label: "إكسسوارات", count: 10 },
		],
	},
	{
		id: "price",
		title: "السعر",
		type: "range",
		min: 0,
		max: 500,
		step: 10,
	},
	{
		id: "rating",
		title: "التقييم",
		type: "rating",
	},
];

const EnhancedFilterPanel: React.FC<EnhancedFilterPanelProps> = ({
	sections = defaultSections,
	onFiltersChange,
	activeFilters,
	productCount,
	isLoading = false,
}) => {
	const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const textColor = useColorModeValue("gray.800", "white");

	const handleFilterChange = (sectionId: string, value: any) => {
		const newFilters = { ...activeFilters, [sectionId]: value };
		onFiltersChange(newFilters);
	};

	const removeFilter = (sectionId: string) => {
		const newFilters = { ...activeFilters };
		delete newFilters[sectionId];
		onFiltersChange(newFilters);
	};

	const clearAllFilters = () => {
		onFiltersChange({});
	};

	const renderFilterSection = (section: FilterSection) => {
		const searchTerm = searchTerms[section.id] || "";
		const filteredOptions = filterOptionsBySearch(
			section.options || [],
			searchTerm,
		);

		return (
			<AccordionItem key={section.id} border="none">
				<AccordionButton px={0} py={4} _hover={{ bg: "transparent" }}>
					<Box flex="1" textAlign="left">
						<HStack>
							<Text fontWeight="semibold" fontSize="md" color={textColor}>
								{section.title}
							</Text>
							{activeFilters[section.id] && (
								<Badge colorScheme="brand" size="sm">
									{Array.isArray(activeFilters[section.id])
										? activeFilters[section.id].length
										: 1}
								</Badge>
							)}
						</HStack>
					</Box>
					<AccordionIcon />
				</AccordionButton>

				<AccordionPanel px={0} pb={6}>
					{section.type === "checkbox" && (
						<VStack align="stretch" spacing={3}>
							<SimpleGrid columns={1} spacing={2} maxH="200px" overflowY="auto">
								{filteredOptions.map((option) => (
									<HStack
										key={option.id}
										justify="space-between"
										p={2}
										borderRadius="0"
										_hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
										cursor="pointer"
										onClick={() => {
											const newFilters = toggleFilterOption(
												option.id,
												section.id,
												activeFilters,
											);
											onFiltersChange(newFilters);
										}}>
										<HStack>
											<Checkbox
												isChecked={isOptionSelected(
													option.id,
													section.id,
													activeFilters,
												)}
												colorScheme="brand"
											/>
											{option.color && (
												<Circle
													size="16px"
													bg={option.color}
													border="1px solid"
													borderColor={borderColor}
												/>
											)}
											<Text fontSize="sm">{option.label}</Text>
										</HStack>
										<Badge variant="subtle" colorScheme="gray" fontSize="xs">
											{option.count}
										</Badge>
									</HStack>
								))}
							</SimpleGrid>
						</VStack>
					)}

					{section.type === "range" && (
						<VStack spacing={4}>
							<HStack justify="space-between" w="full">
								<Text fontSize="sm" color="gray.500">
									{section.min} ر.س
								</Text>
								<Text fontSize="sm" color="gray.500">
									{section.max} ر.س
								</Text>
							</HStack>

							<RangeSlider
								value={
									activeFilters[section.id] || getDefaultRangeValues(section)
								}
								min={section.min || 0}
								max={section.max || 1000}
								step={section.step || 10}
								onChange={(value) => handleFilterChange(section.id, value)}
								colorScheme="brand">
								<RangeSliderTrack>
									<RangeSliderFilledTrack />
								</RangeSliderTrack>
								<RangeSliderThumb index={0} />
								<RangeSliderThumb index={1} />
							</RangeSlider>

							<HStack>
								<Input
									size="sm"
									value={activeFilters[section.id]?.[0] || section.min || 0}
									type="number"
									readOnly
								/>
								<Text>-</Text>
								<Input
									size="sm"
									value={activeFilters[section.id]?.[1] || section.max || 1000}
									type="number"
									readOnly
								/>
							</HStack>
						</VStack>
					)}

					{section.type === "rating" && (
						<VStack spacing={2}>
							{[5, 4, 3, 2, 1].map((rating) => (
								<HStack
									key={rating}
									w="full"
									justify="space-between"
									p={2}
									borderRadius="0"
									cursor="pointer"
									_hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
									onClick={() => handleFilterChange(section.id, rating)}>
									<HStack>
										<Checkbox
											isChecked={activeFilters[section.id] === rating}
											colorScheme="brand"
										/>
										<HStack>
											{Array.from({ length: 5 }, (_, i) => (
												<Box
													key={i}
													as="span"
													color={i < rating ? "yellow.400" : "gray.300"}
													fontSize="sm">
													★
												</Box>
											))}
											<Text fontSize="sm">فأكثر</Text>
										</HStack>
									</HStack>
									<Badge variant="subtle" colorScheme="gray" fontSize="xs">
										{generateRandomCount()}
									</Badge>
								</HStack>
							))}
						</VStack>
					)}
				</AccordionPanel>
			</AccordionItem>
		);
	};

	const activeFiltersArray = getActiveFiltersArray(activeFilters, sections);

	return (
		<Box
			bg={bgColor}
			border="1px solid"
			borderColor={borderColor}
			borderRadius="0"
			p={6}
			position="sticky"
			top="20px"
			maxH="calc(100vh - 40px)"
			overflowY="auto">
			<HStack justify="space-between" mb={6}>
				<VStack align="start" spacing={1}>
					<Text fontSize="lg" fontWeight="bold" color={textColor}>
						تصفية المنتجات
					</Text>
					<Text fontSize="sm" color="gray.500">
						{productCount} منتج متاح
					</Text>
				</VStack>

				{activeFiltersArray.length > 0 && (
					<Button
						size="sm"
						variant="ghost"
						colorScheme="red"
						onClick={clearAllFilters}
						leftIcon={<CloseIcon />}>
						مسح الكل
					</Button>
				)}
			</HStack>

			{activeFiltersArray.length > 0 && (
				<Box mb={6}>
					<Text fontSize="sm" fontWeight="semibold" mb={3} color={textColor}>
						الفلاتر المطبقة
					</Text>
					<Flex wrap="wrap" gap={2}>
						{activeFiltersArray.map((filter, index) => (
							<Tag
								key={`${filter.sectionId}-${filter.value}-${index}`}
								size="sm"
								colorScheme="brand"
								borderRadius="full">
								<TagLabel>{filter.label}</TagLabel>
								<TagCloseButton
									onClick={() => {
										const newFilters = removeSpecificFilter(
											filter.sectionId,
											filter.value,
											activeFilters,
										);
										onFiltersChange(newFilters);
									}}
								/>
							</Tag>
						))}
					</Flex>
					<Divider mt={4} />
				</Box>
			)}

			<Accordion allowMultiple defaultIndex={sections.map((_, index) => index)}>
				{sections.map(renderFilterSection)}
			</Accordion>

			<Box mt={6} pt={4} borderTop="1px solid" borderColor={borderColor}>
				<Button
					w="full"
					colorScheme="brand"
					size="lg"
					isLoading={isLoading}
					loadingText="جاري التطبيق...">
					عرض {productCount} منتج
				</Button>
			</Box>
		</Box>
	);
};

export default EnhancedFilterPanel;
