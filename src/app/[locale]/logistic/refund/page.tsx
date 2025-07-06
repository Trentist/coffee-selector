"use client";
"use client";

import React from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	Badge,
	Divider,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useRefundPage } from "@/odoo-schema-full/hooks/useLegalPages";

const RefundPage = () => {
	const params = useParams();
	const locale = (params?.locale as string) || "ar";

	const { data: refund, loading, error } = useRefundPage(locale);

	if (loading) {
		return (
			<Box as="main" minH="100vh" bg="gray.50" py={8} px={4}>
				<Container
					maxW="4xl"
					mx="auto"
					bg="white"
					rounded="lg"
					shadow="md"
					p={8}>
					<Text textAlign="center" fontSize="lg" color="gray.600">
						جاري تحميل سياسة الاسترجاع...
					</Text>
				</Container>
			</Box>
		);
	}

	if (error || !refund) {
		return (
			<Box as="main" minH="100vh" bg="gray.50" py={8} px={4}>
				<Container
					maxW="4xl"
					mx="auto"
					bg="white"
					rounded="lg"
					shadow="md"
					p={8}>
					<Text textAlign="center" fontSize="lg" color="red.600">
						خطأ في تحميل سياسة الاسترجاع
					</Text>
				</Container>
			</Box>
		);
	}

	return (
		<Box as="main" minH="100vh" bg="gray.50" py={8} px={4}>
			<Container maxW="4xl" mx="auto" bg="white" rounded="lg" shadow="md" p={8}>
				<VStack spacing={6} align="stretch">
					{/* Header */}
					<Box>
						<Heading as="h1" size="xl" color="gray.800" mb={4}>
							{refund.title}
						</Heading>
						{refund.description && (
							<Text fontSize="lg" color="gray.600" mb={6}>
								{refund.description}
							</Text>
						)}
					</Box>

					<Divider />

					{/* Content */}
					<Box>
						<div
							className="legal-content"
							dangerouslySetInnerHTML={{ __html: refund.content }}
							style={{
								fontSize: "16px",
								lineHeight: "1.8",
								color: "#374151",
							}}
						/>
					</Box>

					<Divider />

					{/* Footer */}
					<Box bg="gray.50" p={6} rounded="md">
						<VStack spacing={3} align="stretch">
							<HStack justify="space-between" wrap="wrap">
								<Text fontSize="sm" color="gray.600">
									آخر تحديث: {refund.lastUpdated}
								</Text>
								<Text fontSize="sm" color="gray.600">
									تاريخ السريان: {refund.effectiveDate}
								</Text>
							</HStack>

							{refund.returnPeriod && (
								<HStack>
									<Badge colorScheme="orange" variant="subtle">
										فترة الاسترجاع:
									</Badge>
									<Text fontSize="sm" color="gray.700">
										{refund.returnPeriod}
									</Text>
								</HStack>
							)}

							{refund.processingTime && (
								<HStack>
									<Badge colorScheme="purple" variant="subtle">
										وقت المعالجة:
									</Badge>
									<Text fontSize="sm" color="gray.700">
										{refund.processingTime}
									</Text>
								</HStack>
							)}
						</VStack>
					</Box>

					{/* Contact Info */}
					{refund.contactInfo && (
						<Box
							bg="orange.50"
							p={6}
							rounded="md"
							border="1px"
							borderColor="orange.200">
							<Heading as="h3" size="md" color="orange.800" mb={4}>
								معلومات التواصل
							</Heading>
							<VStack spacing={2} align="stretch">
								<HStack>
									<Text fontWeight="medium" color="gray.700">
										البريد الإلكتروني:
									</Text>
									<Text color="orange.600">{refund.contactInfo.email}</Text>
								</HStack>
								<HStack>
									<Text fontWeight="medium" color="gray.700">
										الهاتف:
									</Text>
									<Text color="orange.600">{refund.contactInfo.phone}</Text>
								</HStack>
								<HStack>
									<Text fontWeight="medium" color="gray.700">
										العنوان:
									</Text>
									<Text color="orange.600">{refund.contactInfo.address}</Text>
								</HStack>
								{refund.contactInfo.workingHours && (
									<HStack>
										<Text fontWeight="medium" color="gray.700">
											ساعات العمل:
										</Text>
										<Text color="orange.600">
											{refund.contactInfo.workingHours}
										</Text>
									</HStack>
								)}
							</VStack>
						</Box>
					)}
				</VStack>
			</Container>
		</Box>
	);
};

export default RefundPage;
