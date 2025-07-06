/**
 * Terms & Conditions Page Component
 * مكون صفحة الشروط والأحكام
 */

import React from "react";
import {
	Box,
	Container,
	VStack,
	Text,
	Spinner,
	TableOfContents,
} from "@chakra-ui/react";
import TermsSection from "./components/TermsSection";
import { TermsPageProps } from "./types/TermsPage.types";

const TermsPage: React.FC<TermsPageProps> = ({
	data,
	loading = false,
	error,
}) => {
	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="50vh">
				<VStack spacing={4}>
					<Spinner size="xl" color="brand.500" />
					<Text>جاري تحميل الشروط والأحكام...</Text>
				</VStack>
			</Box>
		);
	}

	if (error) {
		return (
			<Container maxW="container.xl" py={20}>
				<VStack spacing={4} textAlign="center">
					<Text fontSize="xl" color="red.500">
						حدث خطأ في تحميل الصفحة
					</Text>
					<Text color="gray.600">{error}</Text>
				</VStack>
			</Container>
		);
	}

	if (!data) {
		return (
			<Container maxW="container.xl" py={20}>
				<VStack spacing={4} textAlign="center">
					<Text fontSize="xl" color="gray.500">
						لا توجد بيانات متاحة
					</Text>
				</VStack>
			</Container>
		);
	}

	return (
		<Box py={16} bg="gray.50">
			<Container maxW="container.xl">
				<VStack spacing={12}>
					{/* Page Header */}
					<VStack spacing={4} textAlign="center">
						<Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
							{data.title}
						</Text>
						<Text fontSize="lg" color="gray.600" maxW="3xl">
							{data.description}
						</Text>
						<Text fontSize="sm" color="gray.500">
							آخر تحديث: {new Date(data.lastUpdated).toLocaleDateString("ar")}
						</Text>
					</VStack>

					{/* Terms Content */}
					<Box
						bg="white"
						borderRadius="lg"
						p={8}
						shadow="md"
						w="full"
						maxW="4xl">
						<VStack spacing={0} align="stretch">
							{data.sections.map((section) => (
								<TermsSection key={section.id} section={section} />
							))}
						</VStack>
					</Box>

					{/* Contact Information */}
					<Box
						bg="white"
						borderRadius="lg"
						p={6}
						shadow="md"
						w="full"
						maxW="4xl"
						textAlign="center">
						<Text fontSize="lg" fontWeight="semibold" mb={2}>
							معلومات الاتصال
						</Text>
						<Text color="gray.600">
							لأي استفسارات بشأن الشروط، يُرجى مراسلتنا على البريد الإلكتروني{" "}
							<Text as="span" color="brand.500">
								info@coffeeselection.com
							</Text>
						</Text>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};

export default TermsPage;
