/**
 * Job Card Component
 * مكون بطاقة الوظيفة
 */

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMapPin, FiClock, FiDollarSign, FiCalendar } from "react-icons/fi";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  isActive: boolean;
  postedDate: string;
  deadline?: string;
}

interface JobCardProps {
  job: JobPosition;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "green";
      case "part-time":
        return "blue";
      case "contract":
        return "orange";
      case "internship":
        return "purple";
      default:
        return "gray";
    }
  };

  const getJobTypeText = (type: string) => {
    switch (type) {
      case "full-time":
        return "دوام كامل";
      case "part-time":
        return "دوام جزئي";
      case "contract":
        return "عقد مؤقت";
      case "internship":
        return "تدريب";
      default:
        return type;
    }
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      p={6}
      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
      transition="all 0.3s"
    >
      <VStack spacing={4} align="start">
        {/* Header */}
        <VStack spacing={2} align="start" w="full">
          <HStack justify="space-between" w="full">
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              {job.title}
            </Text>
            <Badge colorScheme={getJobTypeColor(job.type)} variant="solid">
              {getJobTypeText(job.type)}
            </Badge>
          </HStack>

          <Text fontSize="lg" color="gray.500" fontWeight="medium">
            {job.department}
          </Text>
        </VStack>

        {/* Job Details */}
        <VStack spacing={3} align="start" w="full">
          <HStack spacing={4}>
            <HStack spacing={1}>
              <FiMapPin color="gray.500" />
              <Text fontSize="sm" color="gray.600">
                {job.location}
              </Text>
            </HStack>

            <HStack spacing={1}>
              <FiClock color="gray.500" />
              <Text fontSize="sm" color="gray.600">
                {job.experience}
              </Text>
            </HStack>
          </HStack>

          <HStack spacing={4}>
            <HStack spacing={1}>
              <FiDollarSign color="gray.500" />
              <Text fontSize="sm" color="gray.600">
                {job.salary}
              </Text>
            </HStack>

            <HStack spacing={1}>
              <FiCalendar color="gray.500" />
              <Text fontSize="sm" color="gray.600">
                نشرت في {new Date(job.postedDate).toLocaleDateString("ar")}
              </Text>
            </HStack>
          </HStack>
        </VStack>

        {/* Description */}
        <Text fontSize="md" color="gray.600" lineHeight="tall" noOfLines={3}>
          {job.description}
        </Text>

        {/* Requirements Preview */}
        {job.requirements.length > 0 && (
          <Box w="full">
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
              المتطلبات الأساسية:
            </Text>
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {job.requirements.slice(0, 2).join(" • ")}
              {job.requirements.length > 2 && "..."}
            </Text>
          </Box>
        )}

        {/* Action */}
        <HStack justify="space-between" w="full" pt={2}>
          <Button
            colorScheme="brand"
            size="md"
            onClick={() => onApply(job.id)}
            isDisabled={!job.isActive}
          >
            {job.isActive ? "تقدم الآن" : "مغلقة"}
          </Button>

          {job.deadline && (
            <Text fontSize="xs" color="red.500">
              ينتهي في {new Date(job.deadline).toLocaleDateString("ar")}
            </Text>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default JobCard;