/**
 * StatusCard Component
 * Highly customizable status card component for displaying various states
 */

import React from "react";
import {
	Box,
	Flex,
	Text,
	Button,
	Image,
	useColorModeValue,
} from "@chakra-ui/react";
// // import { motion } from "framer-motion";
import { StatusCardProps } from "./types/StatusCard.types";
import {
	getStatusConfig,
	getAnimationVariants,
} from "./helpers/StatusCard.helpers";

const MotionBox = Box;

const StatusCard: React.FC<StatusCardProps> = ({
	statusType,
	title,
	description,
	imageUrl,
	icon,
	buttonText,
	buttonLink,
	colorScheme = "blue",
	onButtonClick,
}) => {
	const bg = useColorModeValue("#fff", "#0D1616");
	const color = useColorModeValue("#0D1616", "#fff");

	const statusConfig = getStatusConfig(statusType, color);
	const animationVariants = getAnimationVariants();

	const handleButtonClick = () => {
		if (onButtonClick) {
			onButtonClick();
		} else if (buttonLink) {
			window.location.href = buttonLink;
		}
	};

	return (
		<MotionBox
			variants={animationVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			p={8}
			borderRadius="0"
			bg="transparent"
			textAlign="center"
			maxW={{ base: "100%", md: "100%" }}
			w="100%"
			h="100%"
			mx="auto"
			display="flex"
			justifyContent="center"
			my={8}
			boxShadow="0">
			<Flex gap="1rem" direction="column" align="center" justify="center">
				{/* Display custom icon or default icon for the status type */}
				{icon || statusConfig.icon}

				{/* Optional image display */}
				{imageUrl && (
					<Image src={imageUrl} alt={title} maxH="200px" loading="lazy" />
				)}

				{/* Main title */}
				<Text fontSize="2xl" fontWeight="bold" color={color} mb={2}>
					{title}
				</Text>

				{/* Description text */}
				<Text fontSize="lg" color={color} mb={4}>
					{description}
				</Text>

				{/* Optional action button */}
				{buttonText && (
					<Button
						size="lg"
						borderRadius="0"
						px={8}
						bg={bg}
						color={color}
						border=".2px solid"
						borderColor={color}
						onClick={handleButtonClick}
						_hover={{
							bg: color,
							color: bg,
							borderColor: bg,
							transition: "all 0.3s ease-in-out",
						}}
						sx={{ transition: "all 0.3s ease-in-out" }}
						aria-label={`Action: ${buttonText}`}>
						{buttonText}
					</Button>
				)}
			</Flex>
		</MotionBox>
	);
};

export default StatusCard;
