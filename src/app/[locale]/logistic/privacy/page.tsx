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
	// Badge,
	Divider,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { usePrivacyPage } from "@/odoo-schema-full/hooks/useLegalPages";

const PrivacyPage = () => {
	const params = useParams();
	const locale = (params?.locale as string) || "ar";

	const { data: privacy, loading, error } = usePrivacyPage(locale);

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
						جاري تحميل سياسة الخصوصية...
					</Text>
				</Container>
			</Box>
		);
	}

	if (error || !privacy) {
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
						خطأ في تحميل سياسة الخصوصية
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
							{privacy.title}
						</Heading>
						{privacy.description && (
							<Text fontSize="lg" color="gray.600" mb={6}>
								{privacy.description}
							</Text>
						)}
					</Box>

					<Divider />

					{/* Content */}
					<Box>
						<div
							className="legal-content"
							dangerouslySetInnerHTML={{ __html: privacy.content }}
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
									آخر تحديث: {privacy.lastUpdated}
								</Text>
								<Text fontSize="sm" color="gray.600">
									تاريخ السريان: {privacy.effectiveDate}
								</Text>
							</HStack>
						</VStack>
					</Box>

					{/* Contact Info */}
					{privacy.contactInfo && (
						<Box
							bg="green.50"
							p={6}
							rounded="md"
							border="1px"
							borderColor="green.200">
							<Heading as="h3" size="md" color="green.800" mb={4}>
								معلومات التواصل
							</Heading>
							<VStack spacing={2} align="stretch">
								<HStack>
									<Text fontWeight="medium" color="gray.700">
										البريد الإلكتروني:
									</Text>
									<Text color="green.600">{privacy.contactInfo.email}</Text>
								</HStack>
								<HStack>
									<Text fontWeight="medium" color="gray.700">
										الهاتف:
									</Text>
									<Text color="green.600">{privacy.contactInfo.phone}</Text>
								</HStack>
								<HStack>
									<Text fontWeight="medium" color="gray.700">
										العنوان:
									</Text>
									<Text color="green.600">{privacy.contactInfo.address}</Text>
								</HStack>
							</VStack>
						</Box>
					)}
				</VStack>
			</Container>
		</Box>
	);
};

export default PrivacyPage;
