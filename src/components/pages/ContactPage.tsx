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
	Icon,
	Input,
	Textarea,
	Button,
	Badge,
	Divider,
	useToast,
} from "@chakra-ui/react";
import {
	FaPhone,
	FaEnvelope,
	FaMapMarkerAlt,
	FaClock,
	FaWhatsapp,
} from "react-icons/fa";
import CustomButton from "../ui/custom-button";
import { TextH5, TextH6, TextParagraph } from "../ui/custom-text";

interface ContactInfo {
	address: string;
	phone: string;
	email: string;
	whatsapp?: string;
	workingHours: {
		weekdays: string;
		weekdaysHours: string;
		weekend: string;
		weekendHours: string;
	};
	socialMedia?: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
}

interface ContactForm {
	fields: Array<{
		name: string;
		type: string;
		required: boolean;
		placeholder: string;
		options?: string[];
	}>;
}

interface ContactPageData {
	title: string;
	description?: string;
	content: string;
	contactInfo: ContactInfo;
	contactForm: ContactForm;
}

interface ContactPageProps {
	data: ContactPageData;
	lang?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ data, lang = "ar" }) => {
	const toast = useToast();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		toast({
			title: "تم إرسال الرسالة",
			description: "سنقوم بالرد عليك في أقرب وقت ممكن",
			status: "success",
			duration: 5000,
			isClosable: true,
		});
	};

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

					{/* Content Grid */}
					<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
						{/* Contact Information */}
						<VStack spacing={6} align="stretch">
							<Heading as="h2" size="lg" color="gray.800">
								معلومات التواصل
							</Heading>

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
											{data.contactInfo.address}
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
											{data.contactInfo.phone}
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
											{data.contactInfo.email}
										</TextParagraph>
									</VStack>
								</HStack>
							</Box>

							{/* WhatsApp */}
							{data.contactInfo.whatsapp && (
								<Box
									bg="white"
									p={6}
									rounded="lg"
									shadow="sm"
									border="1px"
									borderColor="gray.200">
									<HStack spacing={4}>
										<Icon as={FaWhatsapp} color="green.500" boxSize={5} />
										<VStack align="start" spacing={1}>
											<TextH6 color="gray.800">واتساب</TextH6>
											<TextParagraph color="gray.600">
												{data.contactInfo.whatsapp}
											</TextParagraph>
										</VStack>
									</HStack>
								</Box>
							)}

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
													{data.contactInfo.workingHours.weekdays}:
												</Badge>
												<TextParagraph color="gray.600">
													{data.contactInfo.workingHours.weekdaysHours}
												</TextParagraph>
											</HStack>
											<HStack>
												<Badge colorScheme="brand" variant="subtle">
													{data.contactInfo.workingHours.weekend}:
												</Badge>
												<TextParagraph color="gray.600">
													{data.contactInfo.workingHours.weekendHours}
												</TextParagraph>
											</HStack>
										</VStack>
									</VStack>
								</HStack>
							</Box>

							{/* Social Media */}
							{data.contactInfo.socialMedia && (
								<Box
									bg="white"
									p={6}
									rounded="lg"
									shadow="sm"
									border="1px"
									borderColor="gray.200">
									<TextH6 color="gray.800" mb={4}>
										تابعنا على وسائل التواصل الاجتماعي
									</TextH6>
									<HStack spacing={4} wrap="wrap">
										{data.contactInfo.socialMedia.facebook && (
											<Badge
												colorScheme="blue"
												variant="solid"
												cursor="pointer">
												فيسبوك
											</Badge>
										)}
										{data.contactInfo.socialMedia.twitter && (
											<Badge
												colorScheme="blue"
												variant="solid"
												cursor="pointer">
												تويتر
											</Badge>
										)}
										{data.contactInfo.socialMedia.instagram && (
											<Badge
												colorScheme="pink"
												variant="solid"
												cursor="pointer">
												إنستغرام
											</Badge>
										)}
										{data.contactInfo.socialMedia.linkedin && (
											<Badge
												colorScheme="blue"
												variant="solid"
												cursor="pointer">
												لينكد إن
											</Badge>
										)}
									</HStack>
								</Box>
							)}
						</VStack>

						{/* Contact Form */}
						<VStack spacing={6} align="stretch">
							<Heading as="h2" size="lg" color="gray.800">
								راسلنا
							</Heading>

							<Box
								bg="white"
								p={8}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200">
								<form onSubmit={handleSubmit}>
									<VStack spacing={6}>
										{data.contactForm.fields.map((field) => (
											<Box key={field.name} w="full">
												{field.type === "textarea" ? (
													<Textarea
														placeholder={field.placeholder}
														required={field.required}
														size="lg"
														rows={4}
													/>
												) : field.type === "select" ? (
													<select
														required={field.required}
														style={{
															width: "100%",
															padding: "12px",
															borderRadius: "8px",
															border: "1px solid #e2e8f0",
															fontSize: "16px",
														}}>
														<option value="">{field.placeholder}</option>
														{field.options?.map((option) => (
															<option key={option} value={option}>
																{option}
															</option>
														))}
													</select>
												) : (
													<Input
														type={field.type}
														placeholder={field.placeholder}
														required={field.required}
														size="lg"
													/>
												)}
											</Box>
										))}

										<CustomButton
											title="إرسال الرسالة"
											type="submit"
											size="lg"
											w="full"
										/>
									</VStack>
								</form>
							</Box>
						</VStack>
					</SimpleGrid>
				</VStack>
			</Container>
		</Box>
	);
};

export default ContactPage;
