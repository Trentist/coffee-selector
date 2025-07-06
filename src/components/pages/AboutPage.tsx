"use client";

import React from "react";
import {
	Box,
	Container,
	VStack,
	HStack,
	Heading,
	Text,
	SimpleGrid,
	Image,
	Badge,
	Divider,
	Icon,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { TextH5, TextH6, TextParagraph } from "../ui/custom-text";

interface StoreInfo {
	name: string;
	address: string;
	phone: string;
	email: string;
	workingHours: {
		weekdays: string;
		weekdaysHours: string;
		weekend: string;
		weekendHours: string;
	};
	location?: {
		latitude: number;
		longitude: number;
	};
}

interface AboutPageData {
	title: string;
	description?: string;
	content: string;
	storeInfo: StoreInfo;
	images: Array<{
		url: string;
		alt: string;
		caption?: string;
	}>;
}

interface AboutPageProps {
	data: AboutPageData;
	lang?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ data, lang = "ar" }) => {
	return (
		<Box as="main" minH="100vh" bg="gray.50" py={8} px={4}>
			<Container maxW="6xl" mx="auto">
				<VStack spacing={8} align="stretch">
					{/* Header */}
					<Box textAlign="center">
						<Heading as="h1" size="2xl" color="gray.800" mb={4}>
							{data.title}
						</Heading>
						{data.description && (
							<TextH5 color="gray.600" maxW="2xl" mx="auto">
								{data.description}
							</TextH5>
						)}
					</Box>

					<Divider />

					{/* Main Content */}
					<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
						{/* Content */}
						<VStack spacing={6} align="stretch">
							<Box
								bg="white"
								p={8}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200">
								<TextParagraph
									color="gray.700"
									lineHeight="1.8"
									dangerouslySetInnerHTML={{ __html: data.content }}
								/>
							</Box>
						</VStack>

						{/* Store Information */}
						<VStack spacing={6} align="stretch">
							<Heading as="h2" size="lg" color="gray.800">
								معلومات المتجر
							</Heading>

							{/* Store Name */}
							<Box
								bg="white"
								p={6}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200">
								<TextH6 color="gray.800" mb={2}>
									اسم المتجر
								</TextH6>
								<TextParagraph color="gray.600">
									{data.storeInfo.name}
								</TextParagraph>
							</Box>

							{/* Address */}
							<Box
								bg="white"
								p={6}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200">
								<HStack spacing={4}>
									<Icon as={FaMapMarkerAlt} color="brand.500" boxSize={5} />
									<VStack align="start" spacing={1}>
										<TextH6 color="gray.800">العنوان</TextH6>
										<TextParagraph color="gray.600">
											{data.storeInfo.address}
										</TextParagraph>
									</VStack>
								</HStack>
							</Box>

							{/* Phone */}
							<Box
								bg="white"
								p={6}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200">
								<HStack spacing={4}>
									<Icon as={FaPhone} color="brand.500" boxSize={5} />
									<VStack align="start" spacing={1}>
										<TextH6 color="gray.800">الهاتف</TextH6>
										<TextParagraph color="gray.600">
											{data.storeInfo.phone}
										</TextParagraph>
									</VStack>
								</HStack>
							</Box>

							{/* Email */}
							<Box
								bg="white"
								p={6}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200">
								<HStack spacing={4}>
									<Icon as={FaEnvelope} color="brand.500" boxSize={5} />
									<VStack align="start" spacing={1}>
										<TextH6 color="gray.800">البريد الإلكتروني</TextH6>
										<TextParagraph color="gray.600">
											{data.storeInfo.email}
										</TextParagraph>
									</VStack>
								</HStack>
							</Box>

							{/* Working Hours */}
							<Box
								bg="white"
								p={6}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200">
								<HStack spacing={4}>
									<Icon as={FaClock} color="brand.500" boxSize={5} />
									<VStack align="start" spacing={2}>
										<TextH6 color="gray.800">ساعات العمل</TextH6>
										<VStack align="start" spacing={1}>
											<HStack>
												<Badge colorScheme="brand" variant="subtle">
													{data.storeInfo.workingHours.weekdays}:
												</Badge>
												<TextParagraph color="gray.600">
													{data.storeInfo.workingHours.weekdaysHours}
												</TextParagraph>
											</HStack>
											<HStack>
												<Badge colorScheme="brand" variant="subtle">
													{data.storeInfo.workingHours.weekend}:
												</Badge>
												<TextParagraph color="gray.600">
													{data.storeInfo.workingHours.weekendHours}
												</TextParagraph>
											</HStack>
										</VStack>
									</VStack>
								</HStack>
							</Box>

							{/* Location */}
							{data.storeInfo.location && (
								<Box
									bg="white"
									p={6}
									rounded="lg"
									shadow="sm"
									border="1px"
									borderColor="gray.200">
									<TextH6 color="gray.800" mb={2}>
										إحداثيات الموقع
									</TextH6>
									<HStack spacing={4}>
										<Badge colorScheme="green" variant="subtle">
											خط العرض: {data.storeInfo.location.latitude}
										</Badge>
										<Badge colorScheme="blue" variant="subtle">
											خط الطول: {data.storeInfo.location.longitude}
										</Badge>
									</HStack>
								</Box>
							)}
						</VStack>
					</SimpleGrid>

					{/* Images Gallery */}
					{data.images.length > 0 && (
						<>
							<Divider />
							<VStack spacing={6} align="stretch">
								<Heading as="h2" size="lg" color="gray.800" textAlign="center">
									معرض الصور
								</Heading>
								<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
									{data.images.map((image, index) => (
										<Box
											key={index}
											bg="white"
											rounded="lg"
											shadow="sm"
											border="1px"
											borderColor="gray.200"
											overflow="hidden">
											<Image
												src={image.url}
												alt={image.alt}
												w="full"
												h="48"
												objectFit="cover"
											/>
											{image.caption && (
												<Box p={4}>
													<TextParagraph color="gray.600" textAlign="center">
														{image.caption}
													</TextParagraph>
												</Box>
											)}
										</Box>
									))}
								</SimpleGrid>
							</VStack>
						</>
					)}
				</VStack>
			</Container>
		</Box>
	);
};

export default AboutPage;
