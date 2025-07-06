"use client";
/**
 * Enhanced Offers Banner Component
 * Auto-playing offers banner with navigation and indicators
 */

import React, { useState, useEffect, useCallback } from "react";
import {
	Box,
	Image,
	Text,
	Button,
	Flex,
	IconButton,
	useColorModeValue,
	HStack,
	VStack,
	Badge,
	Progress,
} from "@chakra-ui/react";
// import { motion, React.Fragment } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { OffersBannerProps, Offer } from "./types/EnhancedOffers.types";
import {
	formatOfferPrice,
	calculateTimeRemaining,
	isOfferActive,
	getOfferImage,
	getOfferStatusColor,
	getOfferStatusText,
} from "./helpers/EnhancedOffers.helpers";

const MotionBox = Box;

const EnhancedOffersBanner: React.FC<OffersBannerProps> = ({
	offers,
	autoPlay = true,
	autoPlaySpeed = 5000,
	showNavigation = true,
	showIndicators = true,
	maxHeight = "400px",
	onOfferClick,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);

	const bg = useColorModeValue("#fff", "#0D1616");
	const textColor = useColorModeValue("#0D1616", "#fff");
	const borderColor = useColorModeValue("#E2E8F0", "#2D3748");

	// Filter active offers only
	const activeOffers = offers.filter(isOfferActive);

	// Auto-play functionality
	useEffect(() => {
		if (!autoPlay || activeOffers.length <= 1) return;

		const interval = setInterval(() => {
			if (isPlaying) {
				setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
			}
		}, autoPlaySpeed);

		return () => clearInterval(interval);
	}, [autoPlay, autoPlaySpeed, isPlaying, activeOffers.length]);

	// Pause auto-play on hover
	const handleMouseEnter = useCallback(() => {
		if (autoPlay) setIsPlaying(false);
	}, [autoPlay]);

	const handleMouseLeave = useCallback(() => {
		if (autoPlay) setIsPlaying(true);
	}, [autoPlay]);

	// Navigation functions
	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
	}, [activeOffers.length]);

	const goToPrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
	}, [activeOffers.length]);

	const goToSlide = useCallback((index: number) => {
		setCurrentIndex(index);
	}, []);

	// Handle offer click
	const handleOfferClick = useCallback((offer: Offer) => {
		if (onOfferClick) {
			onOfferClick(offer);
		}
	}, [onOfferClick]);

	if (!activeOffers.length) {
		return null;
	}

	const currentOffer = activeOffers[currentIndex];
	const timeRemaining = calculateTimeRemaining(currentOffer.validUntil);

	return (
		<Box
			position="relative"
			maxH={maxHeight}
			overflow="hidden"
			borderRadius="0"
			border="1px solid"
			borderColor={borderColor}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>

			{/* Main Banner Content */}
			<React.Fragment mode="wait">
				<MotionBox
					key={currentOffer.id}
					initial={{ opacity: 0, x: 100 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -100 }}
					transition={{ duration: 0.5 }}
					position="relative"
					cursor="pointer"
					onClick={() => handleOfferClick(currentOffer)}>

					{/* Background Image */}
					<Image
						src={getOfferImage(currentOffer)}
						alt={currentOffer.title}
						w="100%"
						h={maxHeight}
						objectFit="cover"
					/>

					{/* Overlay */}
					<Box
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={0}
						bg="rgba(0,0,0,0.4)"
					/>

					{/* Content */}
					<Flex
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={0}
						direction="column"
						justify="center"
						align="center"
						p={8}
						textAlign="center">

						{/* Status Badge */}
						<Badge
							bg={getOfferStatusColor(currentOffer)}
							color="white"
							borderRadius="0"
							px={3}
							py={1}
							mb={4}
							fontSize="sm">
							{getOfferStatusText(currentOffer)}
						</Badge>

						{/* Title */}
						<Text
							fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
							fontWeight="bold"
							color="white"
							mb={4}
							textShadow="2px 2px 4px rgba(0,0,0,0.8)">
							{currentOffer.title}
						</Text>

						{/* Description */}
						<Text
							fontSize={{ base: "md", md: "lg" }}
							color="white"
							mb={6}
							maxW="600px"
							textShadow="1px 1px 2px rgba(0,0,0,0.8)">
							{currentOffer.description}
						</Text>

						{/* Price Information */}
						<HStack spacing={4} mb={6}>
							<Text
								fontSize="2xl"
								fontWeight="bold"
								color="white"
								textDecoration="line-through">
								{formatOfferPrice(currentOffer.originalPrice, currentOffer.currency)}
							</Text>
							<Text
								fontSize="3xl"
								fontWeight="bold"
								color="yellow.400">
								{formatOfferPrice(currentOffer.salePrice, currentOffer.currency)}
							</Text>
							<Badge
								bg="red.500"
								color="white"
								borderRadius="0"
								px={3}
								py={1}
								fontSize="lg">
								-{currentOffer.discountPercentage}%
							</Badge>
						</HStack>

						{/* Timer */}
						{!timeRemaining.isExpired && (
							<VStack spacing={2} mb={6}>
								<HStack spacing={1}>
									<FiClock color="white" />
									<Text color="white" fontSize="sm">
										ينتهي العرض خلال:
									</Text>
								</HStack>
								<HStack spacing={2}>
									{timeRemaining.days > 0 && (
										<Badge bg="white" color="black" borderRadius="0" px={2}>
											{timeRemaining.days} يوم
										</Badge>
									)}
									<Badge bg="white" color="black" borderRadius="0" px={2}>
										{timeRemaining.hours.toString().padStart(2, '0')}:{timeRemaining.minutes.toString().padStart(2, '0')}:{timeRemaining.seconds.toString().padStart(2, '0')}
									</Badge>
								</HStack>
							</VStack>
						)}

						{/* CTA Button */}
						<Button
							size="lg"
							bg="white"
							color="black"
							borderRadius="0"
							px={8}
							py={3}
							fontWeight="bold"
							_hover={{
								bg: "gray.100",
								transform: "scale(1.05)",
							}}
							transition="all 0.3s ease">
							احصل على العرض الآن
						</Button>
					</Flex>
				</MotionBox>
			</React.Fragment>

			{/* Navigation Arrows */}
			{showNavigation && activeOffers.length > 1 && (
				<>
					<IconButton
						aria-label="Previous offer"
						icon={<FiChevronLeft />}
						position="absolute"
						left={4}
						top="50%"
						transform="translateY(-50%)"
						bg="rgba(0,0,0,0.5)"
						color="white"
						borderRadius="0"
						onClick={goToPrevious}
						_hover={{ bg: "rgba(0,0,0,0.7)" }}
					/>
					<IconButton
						aria-label="Next offer"
						icon={<FiChevronRight />}
						position="absolute"
						right={4}
						top="50%"
						transform="translateY(-50%)"
						bg="rgba(0,0,0,0.5)"
						color="white"
						borderRadius="0"
						onClick={goToNext}
						_hover={{ bg: "rgba(0,0,0,0.7)" }}
					/>
				</>
			)}

			{/* Indicators */}
			{showIndicators && activeOffers.length > 1 && (
				<HStack
					position="absolute"
					bottom={4}
					left="50%"
					transform="translateX(-50%)"
					spacing={2}>
					{activeOffers.map((_, index) => (
						<Box
							key={index}
							w={3}
							h={3}
							borderRadius="50%"
							bg={index === currentIndex ? "white" : "rgba(255,255,255,0.5)"}
							cursor="pointer"
							onClick={() => goToSlide(index)}
							transition="all 0.3s ease"
						/>
					))}
				</HStack>
			)}

			{/* Progress Bar */}
			{autoPlay && activeOffers.length > 1 && (
				<Progress
					value={(currentIndex / (activeOffers.length - 1)) * 100}
					size="xs"
					position="absolute"
					bottom={0}
					left={0}
					right={0}
					borderRadius="0"
					bg="rgba(255,255,255,0.2)"
					colorScheme="whiteAlpha"
				/>
			)}
		</Box>
	);
};

export default EnhancedOffersBanner;