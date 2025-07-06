"use client";
import React, { useState } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	Button,
	Badge,
	Divider,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useLegalPages } from "@/odoo-schema-full/hooks/useLegalPages";

const LegalTestPage = () => {
	const params = useParams();
	const locale = (params?.locale as string) || "ar";

	const {
		terms,
		privacy,
		refund,
		loading,
		error,
		availableLanguages,
		legalPageTypes,
		loadAllPages,
		refreshAll,
	} = useLegalPages({ lang: locale, autoLoad: true });

	const [activePage, setActivePage] = useState<"terms" | "privacy" | "refund">(
		"terms",
	);

	if (loading) {
		return (
			<Box as="main" minH="100vh" bg="gray.50" py={8} px={4}>
				<Container
					maxW="6xl"
					mx="auto"
					bg="white"
					rounded="lg"
					shadow="md"
					p={8}>
					<Text textAlign="center" fontSize="lg" color="gray.600">
						جاري تحميل الصفحات القانونية...
					</Text>
				</Container>
			</Box>
		);
	}

	if (error) {
		return (
			<Box as="main" minH="100vh" bg="gray.50" py={8} px={4}>
				<Container
					maxW="6xl"
					mx="auto"
					bg="white"
					rounded="lg"
					shadow="md"
					p={8}>
					<Text textAlign="center" fontSize="lg" color="red.600">
						خطأ في تحميل الصفحات القانونية: {error}
					</Text>
				</Container>
			</Box>
		);
	}

	const getPageData = () => {
		switch (activePage) {
			case "terms":
				return terms;
			case "privacy":
				return privacy;
			case "refund":
				return refund;
			default:
				return null;
		}
	};

	const pageData = getPageData();

	return (
		<Box as="main" minH="100vh" bg="gray.50" py={8} px={4}>
			<Container maxW="6xl" mx="auto" bg="white" rounded="lg" shadow="md" p={8}>
				<VStack spacing={6} align="stretch">
					{/* Header */}
					<Box>
						<Heading as="h1" size="xl" color="gray.800" mb={4}>
							اختبار الصفحات القانونية
						</Heading>
						<Text fontSize="lg" color="gray.600" mb={6}>
							صفحة تجريبية لاختبار جميع الصفحات القانونية
						</Text>
					</Box>

					<Divider />

					{/* Navigation */}
					<Box>
						<Heading as="h2" size="md" color="gray.700" mb={4}>
							تنقل الصفحات
						</Heading>
						<HStack spacing={4} wrap="wrap">
							{legalPageTypes.map((type) => (
								<Button
									key={type}
									colorScheme={activePage === type ? "blue" : "gray"}
									variant={activePage === type ? "solid" : "outline"}
									onClick={() =>
										setActivePage(type as "terms" | "privacy" | "refund")
									}>
									{type === "terms" && "شروط الاستخدام"}
									{type === "privacy" && "سياسة الخصوصية"}
									{type === "refund" && "سياسة الاسترجاع"}
								</Button>
							))}
						</HStack>
					</Box>

					<Divider />

					{/* Page Content */}
					{pageData ? (
						<Box>
							<VStack spacing={6} align="stretch">
								{/* Page Header */}
								<Box>
									<Heading as="h2" size="lg" color="gray.800" mb={4}>
										{pageData.title}
									</Heading>
									{pageData.description && (
										<Text fontSize="md" color="gray.600" mb={4}>
											{pageData.description}
										</Text>
									)}
								</Box>

								<Divider />

								{/* Page Content */}
								<Box>
									<div
										className="legal-content"
										dangerouslySetInnerHTML={{ __html: pageData.content }}
										style={{
											fontSize: "16px",
											lineHeight: "1.8",
											color: "#374151",
										}}
									/>
								</Box>

								<Divider />

								{/* Page Meta */}
								<Box bg="gray.50" p={4} rounded="md">
									<VStack spacing={2} align="stretch">
										<HStack justify="space-between" wrap="wrap">
											<Text fontSize="sm" color="gray.600">
												آخر تحديث: {pageData.lastUpdated}
											</Text>
											<Text fontSize="sm" color="gray.600">
												تاريخ السريان: {pageData.effectiveDate}
											</Text>
										</HStack>

										{activePage === "terms" && "governingLaw" in pageData && (
											<HStack>
												<Badge colorScheme="blue" variant="subtle">
													القانون المطبق:
												</Badge>
												<Text fontSize="sm" color="gray.700">
													{String(pageData.governingLaw)}
												</Text>
											</HStack>
										)}

										{activePage === "refund" && "returnPeriod" in pageData && (
											<>
												<HStack>
													<Badge colorScheme="orange" variant="subtle">
														فترة الاسترجاع:
													</Badge>
													<Text fontSize="sm" color="gray.700">
														{String(pageData.returnPeriod)}
													</Text>
												</HStack>
												<HStack>
													<Badge colorScheme="purple" variant="subtle">
														وقت المعالجة:
													</Badge>
													<Text fontSize="sm" color="gray.700">
														{String((pageData as any).processingTime)}
													</Text>
												</HStack>
											</>
										)}
									</VStack>
								</Box>

								{/* Contact Info */}
								{pageData.contactInfo && (
									<Box
										bg="blue.50"
										p={4}
										rounded="md"
										border="1px"
										borderColor="blue.200">
										<Heading as="h3" size="sm" color="blue.800" mb={3}>
											معلومات التواصل
										</Heading>
										<VStack spacing={1} align="stretch">
											<HStack>
												<Text
													fontWeight="medium"
													color="gray.700"
													fontSize="sm">
													البريد الإلكتروني:
												</Text>
												<Text color="blue.600" fontSize="sm">
													{pageData.contactInfo.email}
												</Text>
											</HStack>
											<HStack>
												<Text
													fontWeight="medium"
													color="gray.700"
													fontSize="sm">
													الهاتف:
												</Text>
												<Text color="blue.600" fontSize="sm">
													{pageData.contactInfo.phone}
												</Text>
											</HStack>
											<HStack>
												<Text
													fontWeight="medium"
													color="gray.700"
													fontSize="sm">
													العنوان:
												</Text>
												<Text color="blue.600" fontSize="sm">
													{pageData.contactInfo.address}
												</Text>
											</HStack>
											{pageData.contactInfo.workingHours && (
												<HStack>
													<Text
														fontWeight="medium"
														color="gray.700"
														fontSize="sm">
														ساعات العمل:
													</Text>
													<Text color="blue.600" fontSize="sm">
														{pageData.contactInfo.workingHours}
													</Text>
												</HStack>
											)}
										</VStack>
									</Box>
								)}
							</VStack>
						</Box>
					) : (
						<Box textAlign="center" py={8}>
							<Text color="gray.500">لا توجد بيانات للصفحة المحددة</Text>
						</Box>
					)}

					<Divider />

					{/* System Info */}
					<Box bg="green.50" p={4} rounded="md">
						<Heading as="h3" size="sm" color="green.800" mb={3}>
							معلومات النظام
						</Heading>
						<VStack spacing={2} align="stretch">
							<HStack>
								<Text fontWeight="medium" color="gray.700" fontSize="sm">
									اللغة الحالية:
								</Text>
								<Badge colorScheme="green">{locale}</Badge>
							</HStack>
							<HStack>
								<Text fontWeight="medium" color="gray.700" fontSize="sm">
									اللغات المتاحة:
								</Text>
								<HStack>
									{availableLanguages.map((lang) => (
										<Badge
											key={lang}
											colorScheme={lang === locale ? "green" : "gray"}>
											{lang}
										</Badge>
									))}
								</HStack>
							</HStack>
							<HStack>
								<Text fontWeight="medium" color="gray.700" fontSize="sm">
									أنواع الصفحات:
								</Text>
								<HStack>
									{legalPageTypes.map((type) => (
										<Badge key={type} colorScheme="blue">
											{type}
										</Badge>
									))}
								</HStack>
							</HStack>
						</VStack>
					</Box>

					{/* Actions */}
					<Box>
						<HStack spacing={4} justify="center">
							<Button colorScheme="blue" onClick={() => loadAllPages()}>
								إعادة تحميل جميع الصفحات
							</Button>
							<Button colorScheme="green" onClick={() => refreshAll()}>
								تحديث البيانات
							</Button>
						</HStack>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};

export default LegalTestPage;
