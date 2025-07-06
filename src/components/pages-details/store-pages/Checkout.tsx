"use client";

import React from "react";
import {
	Box,
	Container,
	VStack,
	Heading,
	Text,
	SimpleGrid,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Button,
	useToast,
} from "@chakra-ui/react";
import { TextH5, TextH6, TextParagraph } from "../../ui/custom-text";
import CustomButton from "../../ui/custom-button";

export const Checkout: React.FC = () => {
	const toast = useToast();

	const handleCheckout = () => {
		toast({
			title: "تم إتمام الطلب",
			description: "سيتم التواصل معك قريباً لتأكيد الطلب",
			status: "success",
			duration: 5000,
			isClosable: true,
		});
	};

	return (
		<Container maxW="6xl" py={8}>
			<Heading as="h1" size="xl" mb={8} textAlign="center">
				إتمام الطلب
			</Heading>

			<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
				{/* تفاصيل الطلب */}
				<VStack spacing={6} align="stretch">
					<Card>
						<CardHeader>
							<TextH6>تفاصيل الطلب</TextH6>
						</CardHeader>
						<CardBody>
							<VStack spacing={4} align="stretch">
								<Box>
									<TextParagraph>عدد المنتجات: 3</TextParagraph>
									<TextParagraph>المجموع الفرعي: 150 ر.س</TextParagraph>
									<TextParagraph>الشحن: 20 ر.س</TextParagraph>
									<Divider my={2} />
									<TextH5>المجموع الكلي: 170 ر.س</TextH5>
								</Box>
							</VStack>
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<TextH6>معلومات الشحن</TextH6>
						</CardHeader>
						<CardBody>
							<VStack spacing={4} align="stretch">
								<TextParagraph>الاسم: أحمد محمد</TextParagraph>
								<TextParagraph>العنوان: الرياض، المملكة العربية السعودية</TextParagraph>
								<TextParagraph>الهاتف: +966 50 123 4567</TextParagraph>
							</VStack>
						</CardBody>
					</Card>
				</VStack>

				{/* طرق الدفع */}
				<VStack spacing={6} align="stretch">
					<Card>
						<CardHeader>
							<TextH6>طرق الدفع</TextH6>
						</CardHeader>
						<CardBody>
							<VStack spacing={4} align="stretch">
								<Button variant="outline" size="lg" justifyContent="flex-start">
									💳 بطاقة ائتمان
								</Button>
								<Button variant="outline" size="lg" justifyContent="flex-start">
									🏦 تحويل بنكي
								</Button>
								<Button variant="outline" size="lg" justifyContent="flex-start">
									💰 الدفع عند الاستلام
								</Button>
							</VStack>
						</CardBody>
					</Card>

					<CustomButton
						title="إتمام الطلب"
						size="lg"
						onClick={handleCheckout}
					/>
				</VStack>
			</SimpleGrid>
		</Container>
	);
};

export default Checkout;