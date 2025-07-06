"use client";

import React from "react";
import { JobsPage } from "../../../../components/pages";
import { useJobsPage } from "../../../../hooks/pages";
import {
	Box,
	Spinner,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";

export default function JobsPageComponent() {
	const { data, loading, error } = useJobsPage();

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="50vh">
				<Spinner size="xl" color="brand.500" />
			</Box>
		);
	}

	if (error) {
		return (
			<Box p={8}>
				<Alert status="error">
					<AlertIcon />
					<AlertTitle>خطأ في التحميل!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</Box>
		);
	}

	if (!data) {
		return (
			<Box p={8}>
				<Alert status="warning">
					<AlertIcon />
					<AlertTitle>لا توجد بيانات!</AlertTitle>
					<AlertDescription>
						لم يتم العثور على بيانات صفحة الوظائف.
					</AlertDescription>
				</Alert>
			</Box>
		);
	}

	// دمج البيانات لتتوافق مع JobsPageData
	const jobsData = {
		...data.page,
		jobs: data.jobs,
	};

	return <JobsPage data={jobsData} />;
}
