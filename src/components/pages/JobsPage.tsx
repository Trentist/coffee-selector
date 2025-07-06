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
	Button,
	Input,
	Select,
	Divider,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import {
	FaBriefcase,
	FaMapMarkerAlt,
	FaClock,
	FaMoneyBillWave,
	FaCalendarAlt,
} from "react-icons/fa";
import CustomButton from "../ui/custom-button";
import { TextH5, TextH6, TextParagraph } from "../ui/custom-text";

interface JobData {
	id: string;
	title: string;
	description: string;
	department: string;
	location: string;
	type: string;
	requirements: string[];
	responsibilities: string[];
	benefits: string[];
	salaryRange?: string;
	applicationDeadline?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	applicationUrl?: string;
	contactEmail?: string;
}

interface JobsPageData {
	title: string;
	description?: string;
	content: string;
	jobs: JobData[];
}

interface JobsPageProps {
	data: JobsPageData;
	lang?: string;
}

const JobsPage: React.FC<JobsPageProps> = ({ data, lang = "ar" }) => {
	const [filteredJobs, setFilteredJobs] = useState<JobData[]>(data.jobs);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Get unique departments and types
	const departments = [...new Set(data.jobs.map((job) => job.department))];
	const types = [...new Set(data.jobs.map((job) => job.type))];

	// Filter jobs
	const filterJobs = () => {
		let filtered = data.jobs.filter((job) => job.isActive);

		if (searchTerm) {
			filtered = filtered.filter(
				(job) =>
					job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					job.department.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		if (selectedDepartment) {
			filtered = filtered.filter(
				(job) => job.department === selectedDepartment,
			);
		}

		if (selectedType) {
			filtered = filtered.filter((job) => job.type === selectedType);
		}

		setFilteredJobs(filtered);
	};

	// Apply filters when search or filters change
	React.useEffect(() => {
		filterJobs();
	}, [searchTerm, selectedDepartment, selectedType]);

	const handleApplyJob = (job: JobData) => {
		if (job.applicationUrl) {
			window.open(job.applicationUrl, "_blank");
		} else if (job.contactEmail) {
			window.open(
				`mailto:${job.contactEmail}?subject=طلب توظيف - ${job.title}`,
				"_blank",
			);
		} else {
			toast({
				title: "لا يمكن التقديم حالياً",
				description: "يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف",
				status: "info",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const openJobDetails = (job: JobData) => {
		setSelectedJob(job);
		onOpen();
	};

	const getJobTypeColor = (type: string) => {
		switch (type.toLowerCase()) {
			case "دوام كامل":
				return "green";
			case "دوام جزئي":
				return "blue";
			case "عقد مؤقت":
				return "orange";
			case "عمل عن بعد":
				return "purple";
			default:
				return "gray";
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

					{/* Filters */}
					<Box
						bg="white"
						p={6}
						rounded="lg"
						shadow="sm"
						border="1px"
						borderColor="gray.200">
						<VStack spacing={4}>
							<Heading as="h2" size="md" color="gray.800">
								البحث والتصفية
							</Heading>
							<SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
								<Input
									placeholder="البحث في الوظائف..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									size="lg"
								/>
								<Select
									placeholder="جميع الأقسام"
									value={selectedDepartment}
									onChange={(e) => setSelectedDepartment(e.target.value)}
									size="lg">
									{departments.map((dept) => (
										<option key={dept} value={dept}>
											{dept}
										</option>
									))}
								</Select>
								<Select
									placeholder="جميع الأنواع"
									value={selectedType}
									onChange={(e) => setSelectedType(e.target.value)}
									size="lg">
									{types.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</Select>
							</SimpleGrid>
						</VStack>
					</Box>

					{/* Jobs List */}
					<VStack spacing={6} align="stretch">
						<Heading as="h2" size="lg" color="gray.800">
							الوظائف المتاحة ({filteredJobs.length})
						</Heading>

						{filteredJobs.length === 0 ? (
							<Box
								bg="white"
								p={8}
								rounded="lg"
								shadow="sm"
								border="1px"
								borderColor="gray.200"
								textAlign="center">
								<TextH5 color="gray.500">لا توجد وظائف متاحة حالياً</TextH5>
							</Box>
						) : (
							<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
								{filteredJobs.map((job) => (
									<Box
										key={job.id}
										bg="white"
										p={6}
										rounded="lg"
										shadow="sm"
										border="1px"
										borderColor="gray.200"
										_hover={{ shadow: "md", transform: "translateY(-2px)" }}
										transition="all 0.2s">
										<VStack spacing={4} align="stretch">
											<HStack justify="space-between" align="start">
												<VStack align="start" spacing={2} flex={1}>
													<Heading as="h3" size="md" color="gray.800">
														{job.title}
													</Heading>
													<HStack spacing={2} wrap="wrap">
														<Badge colorScheme="brand" variant="subtle">
															{job.department}
														</Badge>
														<Badge
															colorScheme={getJobTypeColor(job.type)}
															variant="subtle">
															{job.type}
														</Badge>
													</HStack>
												</VStack>
											</HStack>

											<TextParagraph color="gray.600" noOfLines={3}>
												{job.description}
											</TextParagraph>

											<HStack spacing={4} wrap="wrap">
												<HStack spacing={2}>
													<Icon
														as={FaMapMarkerAlt}
														color="gray.400"
														boxSize={4}
													/>
													<TextParagraph color="gray.500" fontSize="sm">
														{job.location}
													</TextParagraph>
												</HStack>
												{job.salaryRange && (
													<HStack spacing={2}>
														<Icon
															as={FaMoneyBillWave}
															color="gray.400"
															boxSize={4}
														/>
														<TextParagraph color="gray.500" fontSize="sm">
															{job.salaryRange}
														</TextParagraph>
													</HStack>
												)}
												{job.applicationDeadline && (
													<HStack spacing={2}>
														<Icon
															as={FaCalendarAlt}
															color="gray.400"
															boxSize={4}
														/>
														<TextParagraph color="gray.500" fontSize="sm">
															آخر موعد:{" "}
															{new Date(
																job.applicationDeadline,
															).toLocaleDateString("ar-SA")}
														</TextParagraph>
													</HStack>
												)}
											</HStack>

											<HStack spacing={3}>
												<CustomButton
													title="عرض التفاصيل"
													variant="outline"
													size="sm"
													onClick={() => openJobDetails(job)}
												/>
												<CustomButton
													title="تقدم الآن"
													size="sm"
													onClick={() => handleApplyJob(job)}
												/>
											</HStack>
										</VStack>
									</Box>
								))}
							</SimpleGrid>
						)}
					</VStack>
				</VStack>
			</Container>

			{/* Job Details Modal */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="xl"
				scrollBehavior="inside">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{selectedJob?.title}</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						{selectedJob && (
							<VStack spacing={6} align="stretch">
								<HStack spacing={4} wrap="wrap">
									<Badge colorScheme="brand" variant="subtle">
										{selectedJob.department}
									</Badge>
									<Badge
										colorScheme={getJobTypeColor(selectedJob.type)}
										variant="subtle">
										{selectedJob.type}
									</Badge>
									<Badge colorScheme="green" variant="subtle">
										{selectedJob.location}
									</Badge>
								</HStack>

								<Box>
									<TextH6 color="gray.800" mb={2}>
										الوصف
									</TextH6>
									<TextParagraph color="gray.600">
										{selectedJob.description}
									</TextParagraph>
								</Box>

								{selectedJob.requirements.length > 0 && (
									<Box>
										<TextH6 color="gray.800" mb={2}>
											المتطلبات
										</TextH6>
										<VStack align="start" spacing={1}>
											{selectedJob.requirements.map((req, index) => (
												<HStack key={index} spacing={2}>
													<Box w={2} h={2} bg="brand.500" rounded="full" />
													<TextParagraph color="gray.600">{req}</TextParagraph>
												</HStack>
											))}
										</VStack>
									</Box>
								)}

								{selectedJob.responsibilities.length > 0 && (
									<Box>
										<TextH6 color="gray.800" mb={2}>
											المسؤوليات
										</TextH6>
										<VStack align="start" spacing={1}>
											{selectedJob.responsibilities.map((resp, index) => (
												<HStack key={index} spacing={2}>
													<Box w={2} h={2} bg="brand.500" rounded="full" />
													<TextParagraph color="gray.600">{resp}</TextParagraph>
												</HStack>
											))}
										</VStack>
									</Box>
								)}

								{selectedJob.benefits.length > 0 && (
									<Box>
										<TextH6 color="gray.800" mb={2}>
											المزايا
										</TextH6>
										<VStack align="start" spacing={1}>
											{selectedJob.benefits.map((benefit, index) => (
												<HStack key={index} spacing={2}>
													<Box w={2} h={2} bg="green.500" rounded="full" />
													<TextParagraph color="gray.600">
														{benefit}
													</TextParagraph>
												</HStack>
											))}
										</VStack>
									</Box>
								)}

								{selectedJob.salaryRange && (
									<Box>
										<TextH6 color="gray.800" mb={2}>
											الراتب
										</TextH6>
										<TextParagraph color="gray.600">
											{selectedJob.salaryRange}
										</TextParagraph>
									</Box>
								)}

								{selectedJob.applicationDeadline && (
									<Box>
										<TextH6 color="gray.800" mb={2}>
											آخر موعد للتقديم
										</TextH6>
										<TextParagraph color="gray.600">
											{new Date(
												selectedJob.applicationDeadline,
											).toLocaleDateString("ar-SA")}
										</TextParagraph>
									</Box>
								)}

								<CustomButton
									title="تقدم الآن"
									w="full"
									onClick={() => handleApplyJob(selectedJob)}
								/>
							</VStack>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default JobsPage;
