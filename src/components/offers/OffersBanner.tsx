"use client";
/**
 * Offers Banner Component
 * Displays promotional offers and deals with auto-scroll functionality
 */

import React, { useState, useEffect } from "react";
import {
	Box,
	Text,
	HStack,
	VStack,
	IconButton,
	useColorModeValue,
	Badge,
	Tooltip,
} from "@chakra-ui/react";
// import { motion, React.Fragment } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { OffersBannerProps, OfferItem } from "./types/OffersBanner.types";
import {
	getOfferImageUrl,
	isOfferValid,
	formatDiscount,
	getNextSlideIndex,
	getPrevSlideIndex,
	getTimeRemaining,
	generateDefaultOffers,
} from "./helpers/OffersBanner.helpers";

const MotionBox = Box;

const OffersBanner: React.FC<OffersBannerProps> = ({
	offers = [],
	loading = false,
	error = null,
	autoPlay = true,
	interval = 5000,
	showIndicators = true,
	showArrows = true,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

	// Use default offers if none provided
	const displayOffers = offers.length > 0 ? offers : generateDefaultOffers();
	const validOffers = displayOffers.filter(isOfferValid);

	const bgColor = useColorModeValue("gray.50", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const textColor = useColorModeValue("gray.800", "white");

	// Auto-play functionality
	useEffect(() => {
		if (!isAutoPlaying || validOffers.length <= 1) return;

		const timer = setInterval(() => {
			setCurrentIndex(getNextSlideIndex(currentIndex, validOffers.length));
		}, interval);

		return () => clearInterval(timer);
	}, [currentIndex, isAutoPlaying, interval, validOffers.length]);

	// Pause auto-play on hover
	const handleMouseEnter = () => setIsAutoPlaying(false);
	const handleMouseLeave = () => setIsAutoPlaying(autoPlay);

	// Navigation functions
	const nextSlide = () => {
		setCurrentIndex(getNextSlideIndex(currentIndex, validOffers.length));
	};

	const prevSlide = () => {
		setCurrentIndex(getPrevSlideIndex(currentIndex, validOffers.length));
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	if (loading) {
		return (
			<Box
				bg={bgColor}
				border="1px solid"
				borderColor={borderColor}
				borderRadius="md"
				p={4}
				textAlign="center">
				<Text>جاري تحميل العروض...</Text>
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				bg={bgColor}
				border="1px solid"
				borderColor={borderColor}
				borderRadius="md"
				p={4}
				textAlign="center">
				<Text color="red.500">خطأ: {error}</Text>
			</Box>
		);
	}

	if (validOffers.length === 0) {
		return (
			<Box
				bg={bgColor}
				border="1px solid"
				borderColor={borderColor}
				borderRadius="md"
				p={4}
				textAlign="center">
				<Text>لا توجد عروض متاحة حالياً</Text>
			</Box>
		);
	}

	return (
		<Box
			bg={bgColor}
			border="1px solid"
			borderColor={borderColor}
			borderRadius="md"
			overflow="hidden"
			position="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			{/* Main Content */}
			<Box position="relative" h="200px">
				<React.Fragment mode="wait">
					<MotionBox
						key={currentIndex}
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.5 }}
						position="absolute"
						top="0"
						left="0"
						right="0"
						bottom="0"
						display="flex"
						alignItems="center"
						p={6}>
						<HStack spacing={6} w="100%">
							{/* Offer Image */}
							<Box
								flexShrink={0}
								w="120px"
								h="120px"
								borderRadius="md"
								overflow="hidden"
								bg="gray.100">
								<img
									src={getOfferImageUrl(validOffers[currentIndex].image)}
									alt={validOffers[currentIndex].alt}
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
									}}
								/>
							</Box>

							{/* Offer Details */}
							<VStack align="start" flex={1} spacing={2}>
								<HStack spacing={3}>
									<Text fontSize="xl" fontWeight="bold" color={textColor}>
										{validOffers[currentIndex].title}
									</Text>
									{validOffers[currentIndex].discount && (
										<Badge colorScheme="red" variant="solid" fontSize="sm">
											خصم {formatDiscount(validOffers[currentIndex].discount)}
										</Badge>
									)}
								</HStack>

								<Text color="gray.600" fontSize="md" noOfLines={2}>
									{validOffers[currentIndex].description}
								</Text>

								{validOffers[currentIndex].validUntil && (
									<HStack spacing={2} color="gray.500">
										<FiClock size="16px" />
										<Text fontSize="sm">
											ينتهي في:{" "}
											{getTimeRemaining(validOffers[currentIndex].validUntil)}
										</Text>
									</HStack>
								)}
							</VStack>
						</HStack>
					</MotionBox>
				</React.Fragment>
			</Box>

			{/* Navigation Arrows */}
			{showArrows && validOffers.length > 1 && (
				<>
					<Tooltip label="السابق">
						<IconButton
							aria-label="Previous offer"
							icon={<FiChevronLeft />}
							size="sm"
							variant="ghost"
							position="absolute"
							left={2}
							top="50%"
							transform="translateY(-50%)"
							onClick={prevSlide}
							_hover={{ bg: "blackAlpha.100" }}
						/>
					</Tooltip>
					<Tooltip label="التالي">
						<IconButton
							aria-label="Next offer"
							icon={<FiChevronRight />}
							size="sm"
							variant="ghost"
							position="absolute"
							right={2}
							top="50%"
							transform="translateY(-50%)"
							onClick={nextSlide}
							_hover={{ bg: "blackAlpha.100" }}
						/>
					</Tooltip>
				</>
			)}

			{/* Indicators */}
			{showIndicators && validOffers.length > 1 && (
				<HStack
					position="absolute"
					bottom={4}
					left="50%"
					transform="translateX(-50%)"
					spacing={2}>
					{validOffers.map((_, index) => (
						<Box
							key={index}
							w={2}
							h={2}
							borderRadius="full"
							bg={index === currentIndex ? "blue.500" : "gray.300"}
							cursor="pointer"
							onClick={() => goToSlide(index)}
							_hover={{ bg: index === currentIndex ? "blue.600" : "gray.400" }}
							transition="background-color 0.2s"
						/>
					))}
				</HStack>
			)}
		</Box>
	);
};

export default OffersBanner;
