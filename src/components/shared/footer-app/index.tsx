/**
 * Enhanced Footer Component
 * مكون الفوتر المحسن
 */

"use client";

import {
	Box,
	Container,
	Grid,
	Text,
	Link,
	VStack,
	HStack,
} from "@chakra-ui/react";
import { useFooter } from "@/components/providers";
import { useCurrency } from "@/components/providers";

export const FooterApp = () => {
	const { isNewsletterOpen, setIsNewsletterOpen } = useFooter();
	const { currency } = useCurrency();

	return (
		<Box as="footer" bg="gray.50" py={8} mt="auto">
			<Container maxW="1200px">
				<Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={8}>
					{/* Company Info */}
					<VStack align="start" spacing={4}>
						<Text fontSize="lg" fontWeight="bold" color="brand.600">
							Coffee Selection
						</Text>
						<Text fontSize="sm" color="gray.600" lineHeight="tall">
							متجر القهوة الإلكتروني الأفضل في المملكة العربية السعودية
						</Text>
					</VStack>

					{/* Quick Links */}
					<VStack align="start" spacing={4}>
						<Text fontWeight="bold" color="gray.800">
							روابط سريعة
						</Text>
						<VStack align="start" spacing={2}>
							<Link
								href="/products"
								color="gray.600"
								_hover={{ color: "brand.500" }}>
								المنتجات
							</Link>
							<Link
								href="/about"
								color="gray.600"
								_hover={{ color: "brand.500" }}>
								من نحن
							</Link>
							<Link
								href="/contact"
								color="gray.600"
								_hover={{ color: "brand.500" }}>
								اتصل بنا
							</Link>
						</VStack>
					</VStack>

					{/* Support */}
					<VStack align="start" spacing={4}>
						<Text fontWeight="bold" color="gray.800">
							الدعم
						</Text>
						<VStack align="start" spacing={2}>
							<Link
								href="/help"
								color="gray.600"
								_hover={{ color: "brand.500" }}>
								مركز المساعدة
							</Link>
							<Link
								href="/shipping"
								color="gray.600"
								_hover={{ color: "brand.500" }}>
								سياسة الشحن
							</Link>
							<Link
								href="/returns"
								color="gray.600"
								_hover={{ color: "brand.500" }}>
								سياسة الإرجاع
							</Link>
						</VStack>
					</VStack>

					{/* Contact Info */}
					<VStack align="start" spacing={4}>
						<Text fontWeight="bold" color="gray.800">
							معلومات الاتصال
						</Text>
						<VStack align="start" spacing={2}>
							<Text fontSize="sm" color="gray.600">
								العملة: {currency}
							</Text>
							<Text fontSize="sm" color="gray.600">
								الرياض، المملكة العربية السعودية
							</Text>
						</VStack>
					</VStack>
				</Grid>

				{/* Copyright */}
				<Box borderTop="1px" borderColor="gray.200" mt={8} pt={4}>
					<Text textAlign="center" fontSize="sm" color="gray.500">
						© 2024 Coffee Selection. جميع الحقوق محفوظة
					</Text>
				</Box>
			</Container>
		</Box>
	);
};

export default FooterApp;
