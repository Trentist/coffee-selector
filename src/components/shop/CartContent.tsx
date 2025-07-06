"use client";

import React from "react";
import {
	Box,
	Flex,
	Text,
	Button,
	VStack,
	HStack,
	Icon,
	useColorModeValue,
	Divider,
} from "@chakra-ui/react";
import { MdShoppingCart } from "react-icons/md";

interface CartContentProps {
	onNavigateToShop: () => void;
	onNavigateToFavorites: () => void;
}

const CartContent: React.FC<CartContentProps> = ({
	onNavigateToShop,
	onNavigateToFavorites,
}) => {
	const textColor = useColorModeValue("gray.600", "gray.400");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	return (
		<Box>
			{/* Header - الترويسة */}
			<Flex
				justifyContent="space-between"
				alignItems="center"
				mb={6}
				pb={4}
				borderBottom="1px"
				borderColor={borderColor}>
				<Box>
					<Text fontSize="2xl" fontWeight="bold" mb={2}>
						عربة التسوق
					</Text>
					<Text color={textColor}>مراجعة المنتجات المختارة</Text>
				</Box>

				{/* Navigation Buttons - أزرار التنقل */}
				<HStack spacing={3}>
					<Button
						leftIcon={<ArrowLeftIcon />}
						variant="outline"
						size="sm"
						onClick={onNavigateToShop}>
						العودة للمتجر
					</Button>
				</HStack>
			</Flex>

			{/* Cart Content - محتوى العربة */}
			<VStack spacing={6} align="stretch">
				{/* Empty Cart State - حالة العربة الفارغة */}
				<Box textAlign="center" py={12} color={textColor}>
					<Icon as={MdShoppingCart} w={16} h={16} color={textColor} mb={4} />
					<Text fontSize="lg" mb={2}>
						عربة التسوق فارغة
					</Text>
					<Text fontSize="sm" mb={6}>
						لم تقم بإضافة أي منتجات إلى العربة بعد
					</Text>
					<HStack spacing={4} justify="center">
						<Button colorScheme="blue" onClick={onNavigateToShop}>
							تسوق الآن
						</Button>
						<Button variant="outline" onClick={onNavigateToFavorites}>
							عرض المفضلة
						</Button>
					</HStack>
				</Box>

				{/* Cart Features - ميزات العربة */}
				<Box
					bg={useColorModeValue("gray.50", "gray.700")}
					p={6}
					borderRadius="md">
					<Text fontSize="lg" fontWeight="semibold" mb={4}>
						ميزات العربة
					</Text>
					<VStack spacing={3} align="start">
						<HStack>
							<Box w={2} h={2} bg="green.500" borderRadius="full" />
							<Text fontSize="sm">حفظ المنتجات للشراء لاحقاً</Text>
						</HStack>
						<HStack>
							<Box w={2} h={2} bg="green.500" borderRadius="full" />
							<Text fontSize="sm">تحديث الكميات بسهولة</Text>
						</HStack>
						<HStack>
							<Box w={2} h={2} bg="green.500" borderRadius="full" />
							<Text fontSize="sm">حساب الشحن والضرائب</Text>
						</HStack>
						<HStack>
							<Box w={2} h={2} bg="green.500" borderRadius="full" />
							<Text fontSize="sm">تطبيق كوبونات الخصم</Text>
						</HStack>
					</VStack>
				</Box>
			</VStack>
		</Box>
	);
};

export default CartContent;
