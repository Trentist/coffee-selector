"use client";

import React, { useState } from "react";
import {
	Box,
	Container,
	VStack,
	HStack,
	Heading,
	Text,
	SimpleGrid,
	Badge,
	Input,
	Textarea,
	Button,
	Divider,
	useToast,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import {
	FaIndustry,
	FaTruck,
	FaUsers,
	FaPercent,
	FaHandshake,
} from "react-icons/fa";
import CustomButton from "../ui/custom-button";
import { TextH5, TextH6, TextParagraph } from "../ui/custom-text";

interface WholesaleBenefit {
	id: string;
	title: string;
	description: string;
	icon: string;
}

interface WholesaleRequirement {
	id: string;
	title: string;
	description: string;
	required: boolean;
}

interface WholesalePageData {
	title: string;
	description?: string;
	content: string;
	benefits: WholesaleBenefit[];
	requirements: WholesaleRequirement[];
	contactInfo: {
		email: string;
		phone: string;
		whatsapp?: string;
	};
	minimumOrder: string;
	discountRange: string;
	deliveryInfo: string;
}

interface WholesalePageProps {
	data: WholesalePageData;
	lang?: string;
}

const WholesalePage: React.FC<WholesalePageProps> = ({ data, lang = "ar" }) => {
	const [formData, setFormData] = useState({
		companyName: "",
		contactPerson: "",
		email: "",
		phone: "",
		businessType: "",
		expectedVolume: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast({
				title: "تم إرسال طلبك بنجاح",
				description: "سنقوم بالتواصل معك في أقرب وقت ممكن",
				status: "success",
				duration: 5000,
				isClosable: true,
			});

			// Reset form
			setFormData({
				companyName: "",
				contactPerson: "",
				email: "",
				phone: "",
				businessType: "",
				expectedVolume: "",
				message: "",
			});
		} catch (error) {
			toast({
				title: "حدث خطأ",
				description: "يرجى المحاولة مرة أخرى",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "industry":
				return FaIndustry;
			case "truck":
				return FaTruck;
			case "users":
				return FaUsers;
			case "percent":
				return FaPercent;
			case "handshake":
				return FaHandshake;
			default:
				return FaIndustry;
		}
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

					{/* Content */}
					{data.content && (
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
					)}

					<Divider />

					{/* Key Information */}
					<SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
						<Box
							bg="white"
							p={6}
							rounded="lg"
							shadow="sm"
							border="1px"
							borderColor="gray.200"
							textAlign="center">
							<Icon as={FaPercent} color="brand.500" boxSize={8} mb={4} />
							<TextH6 color="gray.800" mb={2}>
								خصومات خاصة
							</TextH6>
							<TextParagraph color="gray.600">
								{data.discountRange}
							</TextParagraph>
						</Box>

						<Box
							bg="white"
							p={6}
							rounded="lg"
							shadow="sm"
							border="1px"
							borderColor="gray.200"
							textAlign="center">
							<Icon as={FaTruck} color="brand.500" boxSize={8} mb={4} />
							<TextH6 color="gray.800" mb={2}>
								الحد الأدنى للطلب
							</TextH6>
							<TextParagraph color="gray.600">
								{data.minimumOrder}
							</TextParagraph>
						</Box>

						<Box
							bg="white"
							p={6}
							rounded="lg"
							shadow="sm"
							border="1px"
							borderColor="gray.200"
							textAlign="center">
							<Icon as={FaHandshake} color="brand.500" boxSize={8} mb={4} />
							<TextH6 color="gray.800" mb={2}>
								خدمة التوصيل
							</TextH6>
							<TextParagraph color="gray.600">
								{data.deliveryInfo}
							</TextParagraph>
						</Box>
					</SimpleGrid>

					{/* Benefits */}
					<VStack spacing={6} align="stretch">
						<Heading as="h2" size="lg" color="gray.800" textAlign="center">
							مزايا البيع بالجملة
						</Heading>
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
							{data.benefits.map((benefit) => {
								const IconComponent = getIcon(benefit.icon);
								return (
									<Box
										key={benefit.id}
										bg="white"
										p={6}
										rounded="lg"
										shadow="sm"
										border="1px"
										borderColor="gray.200"
										textAlign="center"
										_hover={{ shadow: "md", transform: "translateY(-2px)" }}
										transition="all 0.2s">
										<Icon
											as={IconComponent}
											color="brand.500"
											boxSize={8}
											mb={4}
										/>
										<TextH6 color="gray.800" mb={2}>
											{benefit.title}
										</TextH6>
										<TextParagraph color="gray.600">
											{benefit.description}
										</TextParagraph>
									</Box>
								);
							})}
						</SimpleGrid>
					</VStack>

					<Divider />

					{/* Requirements */}
					<VStack spacing={6} align="stretch">
						<Heading as="h2" size="lg" color="gray.800" textAlign="center">
							متطلبات البيع بالجملة
						</Heading>
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
							{data.requirements.map((requirement) => (
								<Box
									key={requirement.id}
									bg="white"
									p={6}
									rounded="lg"
									shadow="sm"
									border="1px"
									borderColor="gray.200">
									<HStack spacing={3} mb={3}>
										<Badge
											colorScheme={requirement.required ? "red" : "green"}
											variant="subtle">
											{requirement.required ? "مطلوب" : "اختياري"}
										</Badge>
									</HStack>
									<TextH6 color="gray.800" mb={2}>
										{requirement.title}
									</TextH6>
									<TextParagraph color="gray.600">
										{requirement.description}
									</TextParagraph>
								</Box>
							))}
						</SimpleGrid>
					</VStack>

					<Divider />

					{/* Contact Form */}
					<VStack spacing={6} align="stretch">
						<Heading as="h2" size="lg" color="gray.800" textAlign="center">
							طلب البيع بالجملة
						</Heading>

						<Alert status="info" rounded="lg">
							<AlertIcon />
							<Box>
								<AlertTitle>معلومات مهمة!</AlertTitle>
								<AlertDescription>
									يرجى ملء النموذج أدناه وسنقوم بالتواصل معك لتحديد التفاصيل
									والاتفاق على الشروط.
								</AlertDescription>
							</Box>
						</Alert>

						<Box
							bg="white"
							p={8}
							rounded="lg"
							shadow="sm"
							border="1px"
							borderColor="gray.200">
							<form onSubmit={handleSubmit}>
								<VStack spacing={6}>
									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
										<Box>
											<TextH6 color="gray.800" mb={2}>
												اسم الشركة *
											</TextH6>
											<Input
												value={formData.companyName}
												onChange={(e) =>
													handleInputChange("companyName", e.target.value)
												}
												placeholder="اسم الشركة أو المؤسسة"
												size="lg"
												required
											/>
										</Box>
										<Box>
											<TextH6 color="gray.800" mb={2}>
												الشخص المسؤول *
											</TextH6>
											<Input
												value={formData.contactPerson}
												onChange={(e) =>
													handleInputChange("contactPerson", e.target.value)
												}
												placeholder="اسم الشخص المسؤول"
												size="lg"
												required
											/>
										</Box>
									</SimpleGrid>

									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
										<Box>
											<TextH6 color="gray.800" mb={2}>
												البريد الإلكتروني *
											</TextH6>
											<Input
												type="email"
												value={formData.email}
												onChange={(e) =>
													handleInputChange("email", e.target.value)
												}
												placeholder="example@company.com"
												size="lg"
												required
											/>
										</Box>
										<Box>
											<TextH6 color="gray.800" mb={2}>
												رقم الهاتف *
											</TextH6>
											<Input
												type="tel"
												value={formData.phone}
												onChange={(e) =>
													handleInputChange("phone", e.target.value)
												}
												placeholder="+966 50 123 4567"
												size="lg"
												required
											/>
										</Box>
									</SimpleGrid>

									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
										<Box>
											<TextH6 color="gray.800" mb={2}>
												نوع النشاط التجاري *
											</TextH6>
											<Select
												value={formData.businessType}
												onChange={(e) =>
													handleInputChange("businessType", e.target.value)
												}
												placeholder="اختر نوع النشاط"
												size="lg"
												required>
												<option value="cafe">مقهى</option>
												<option value="restaurant">مطعم</option>
												<option value="hotel">فندق</option>
												<option value="retail">بيع تجزئة</option>
												<option value="wholesale">بيع بالجملة</option>
												<option value="online">متجر إلكتروني</option>
												<option value="other">أخرى</option>
											</Select>
										</Box>
										<Box>
											<TextH6 color="gray.800" mb={2}>
												الحجم المتوقع للطلبات
											</TextH6>
											<Select
												value={formData.expectedVolume}
												onChange={(e) =>
													handleInputChange("expectedVolume", e.target.value)
												}
												placeholder="اختر الحجم المتوقع"
												size="lg">
												<option value="small">صغير (1-5 كيلو شهرياً)</option>
												<option value="medium">متوسط (5-20 كيلو شهرياً)</option>
												<option value="large">كبير (20+ كيلو شهرياً)</option>
											</Select>
										</Box>
									</SimpleGrid>

									<Box w="full">
										<TextH6 color="gray.800" mb={2}>
											رسالة إضافية
										</TextH6>
										<Textarea
											value={formData.message}
											onChange={(e) =>
												handleInputChange("message", e.target.value)
											}
											placeholder="أخبرنا المزيد عن احتياجاتك ومتطلباتك الخاصة..."
											size="lg"
											rows={4}
										/>
									</Box>

									<CustomButton
										title={isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
										type="submit"
										size="lg"
										w="full"
										isLoading={isSubmitting}
										loadingText="جاري الإرسال..."
									/>
								</VStack>
							</form>
						</Box>
					</VStack>

					{/* Contact Information */}
					<Box
						bg="white"
						p={8}
						rounded="lg"
						shadow="sm"
						border="1px"
						borderColor="gray.200">
						<Heading
							as="h2"
							size="lg"
							color="gray.800"
							mb={6}
							textAlign="center">
							معلومات التواصل للبيع بالجملة
						</Heading>
						<SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
							<Box textAlign="center">
								<TextH6 color="gray.800" mb={2}>
									البريد الإلكتروني
								</TextH6>
								<TextParagraph color="gray.600">
									{data.contactInfo.email}
								</TextParagraph>
							</Box>
							<Box textAlign="center">
								<TextH6 color="gray.800" mb={2}>
									الهاتف
								</TextH6>
								<TextParagraph color="gray.600">
									{data.contactInfo.phone}
								</TextParagraph>
							</Box>
							{data.contactInfo.whatsapp && (
								<Box textAlign="center">
									<TextH6 color="gray.800" mb={2}>
										واتساب
									</TextH6>
									<TextParagraph color="gray.600">
										{data.contactInfo.whatsapp}
									</TextParagraph>
								</Box>
							)}
						</SimpleGrid>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};

export default WholesalePage;
