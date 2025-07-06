/**
 * Jobs Page Component
 * مكون صفحة الوظائف
 */

import React, { useState } from "react";
import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Spinner,
	SimpleGrid,
	Select,
	Input,
	InputGroup,
	InputLeftElement,
	useToast,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import JobCard from "./components/JobCard";
import { JobsPageProps } from "./types/JobsPage.types";

const JobsPage: React.FC<JobsPageProps> = ({
	data,
	loading = false,
	error,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [selectedLocation, setSelectedLocation] = useState("");
	const toast = useToast();

	const handleApply = (jobId: string) => {
		toast({
			title: "تم التقديم بنجاح",
			description: "سنقوم بمراجعة طلبك والتواصل معك قريباً",
			status: "success",
			duration: 5000,
			isClosable: true,
		});
	};

	const filteredJobs = data.positions.filter((job) => {
		const matchesSearch =
			job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			job.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesDepartment =
			!selectedDepartment || job.department === selectedDepartment;
		const matchesLocation =
			!selectedLocation || job.location.includes(selectedLocation);

		return matchesSearch && matchesDepartment && matchesLocation;
	});

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="50vh">
				<VStack spacing={4}>
					<Spinner size="xl" color="brand.500" />
					<Text>جاري تحميل الوظائف...</Text>
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

	return (
		<Box py={16} bg="gray.50">
			<Container maxW="container.xl">
				<VStack spacing={12}>
					{/* Page Header */}
					<VStack spacing={4} textAlign="center">
						<Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
							{data.title}
						</Text>
						<Text fontSize="lg" color="gray.600" maxW="2xl">
							{data.description}
						</Text>
					</VStack>

					{/* Filters */}
					<Box w="full" maxW="4xl">
						<HStack spacing={4} wrap="wrap">
							<InputGroup maxW="300px">
								<InputLeftElement>
									<FiSearch color="gray.500" />
								</InputLeftElement>
								<Input
									placeholder="البحث في الوظائف..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</InputGroup>

							<Select
								placeholder="جميع الأقسام"
								value={selectedDepartment}
								onChange={(e) => setSelectedDepartment(e.target.value)}
								maxW="200px">
								{data.departments.map((dept) => (
									<option key={dept} value={dept}>
										{dept}
									</option>
								))}
							</Select>

							<Select
								placeholder="جميع المواقع"
								value={selectedLocation}
								onChange={(e) => setSelectedLocation(e.target.value)}
								maxW="200px">
								{data.locations.map((location) => (
									<option key={location} value={location}>
										{location}
									</option>
								))}
							</Select>
						</HStack>
					</Box>

					{/* Jobs Grid */}
					<Box w="full">
						{filteredJobs.length > 0 ? (
							<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
								{filteredJobs.map((job) => (
									<JobCard key={job.id} job={job} onApply={handleApply} />
								))}
							</SimpleGrid>
						) : (
							<Box textAlign="center" py={12}>
								<Text fontSize="lg" color="gray.500">
									لا توجد وظائف متاحة حالياً
								</Text>
							</Box>
						)}
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
							لا تجد الوظيفة المناسبة؟
						</Text>
						<Text color="gray.600">
							أرسل سيرتك الذاتية إلى{" "}
							<Text as="span" color="brand.500">
								careers@coffeeselection.com
							</Text>{" "}
							وسنقوم بالتواصل معك عند توفر فرص مناسبة
						</Text>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};

export default JobsPage;
