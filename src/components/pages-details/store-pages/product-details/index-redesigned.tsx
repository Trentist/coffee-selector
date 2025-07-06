"use client";

import React from "react";
import {
	Box,
	Container,
	VStack,
	HStack,
	Heading,
	Text,
	Image,
	Button,
	Badge,
	Divider,
	SimpleGrid,
	useToast,
} from "@chakra-ui/react";
import { TextH5, TextH6, TextParagraph } from "../../../ui/custom-text";
import CustomButton from "../../../ui/custom-button";

interface ProductDetailsProps {
	product?: any;
}

export const ProductDetailsRedesigned: React.FC<ProductDetailsProps> = ({
	product,
}) => {
	const toast = useToast();

	const handleAddToCart = () => {
		toast({
			title: "تم الإضافة للسلة",
			description: "تم إضافة المنتج إلى سلة التسوق",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<Container maxW="6xl" py={8}>
			<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
				{/* صورة المنتج */}
				<Box>
					<Image
						src="/assets/images/products/coffee-1.jpg"
						alt="صورة المنتج"
						borderRadius="lg"
						w="full"
						h="400px"
						objectFit="cover"
					/>
				</Box>

				{/* تفاصيل المنتج */}
				<VStack spacing={6} align="stretch">
					<Box>
						<Heading as="h1" size="xl" mb={2}>
							قهوة عربية مميزة
						</Heading>
						<HStack spacing={2} mb={4}>
							<Badge colorScheme="green">متوفر</Badge>
							<Badge colorScheme="blue">الأكثر مبيعاً</Badge>
						</HStack>
						<TextH5 color="gray.600">
							قهوة عربية مميزة محمصة بطريقة تقليدية مع الحفاظ على النكهة الأصلية
						</TextH5>
					</Box>

					<Divider />

					<Box>
						<TextH6 mb={2}>السعر</TextH6>
						<Text fontSize="2xl" fontWeight="bold" color="brand.500">
							45 ر.س
						</Text>
					</Box>

					<Box>
						<TextH6 mb={2}>الكمية</TextH6>
						<HStack spacing={4}>
							<Button size="sm">-</Button>
							<Text>1</Text>
							<Button size="sm">+</Button>
						</HStack>
					</Box>

					<CustomButton
						title="إضافة للسلة"
						size="lg"
						onClick={handleAddToCart}
					/>
				</VStack>
			</SimpleGrid>
		</Container>
	);
};

export default ProductDetailsRedesigned;
