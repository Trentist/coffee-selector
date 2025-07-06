/**
 * Footer Content Component
 * مكون محتوى الفوتر
 */

import React from "react";
import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Link,
	Icon,
	Button,
	useColorModeValue,
	Flex,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useLocale } from '@/components/ui/useLocale';
import { useThemeColors } from '@/theme/hooks/useThemeColors';
import LocationSelector from '../../location/LocationSelector';
import CurrencySelector from '../../currency-system/components/CurrencySelector';

const FooterContent: React.FC = () => {
	const { t } = useLocale();
	const { textPrimary, textSecondary, cardBorder } = useThemeColors();
	const bgColor = useColorModeValue('gray.50', 'gray.900');

	const socialLinks = [
		{ icon: FaFacebook, href: '#', label: 'Facebook' },
		{ icon: FaTwitter, href: '#', label: 'Twitter' },
		{ icon: FaInstagram, href: '#', label: 'Instagram' },
		{ icon: FaLinkedin, href: '#', label: 'LinkedIn' },
	];

	const footerSections = [
		{
			title: t('footer.company'),
			links: [
				{ label: t('footer.about'), href: '/about' },
				{ label: t('footer.contact'), href: '/contact' },
				{ label: t('footer.careers'), href: '/careers' },
			],
		},
		{
			title: t('footer.support'),
			links: [
				{ label: t('footer.help'), href: '/help' },
				{ label: t('footer.faq'), href: '/faq' },
				{ label: t('footer.shipping'), href: '/shipping' },
			],
		},
		{
			title: t('footer.legal'),
			links: [
				{ label: t('footer.privacy'), href: '/privacy' },
				{ label: t('footer.terms'), href: '/terms' },
				{ label: t('footer.cookies'), href: '/cookies' },
			],
		},
	];

	return (
		<Box bg={bgColor} borderTop="1px" borderColor={cardBorder}>
			<Container maxW="container.xl" py={8}>
				<VStack spacing={8} align="stretch">
					{/* Main Footer Content */}
					<Flex
						direction={{ base: 'column', lg: 'row' }}
						justify="space-between"
						align={{ base: 'center', lg: 'flex-start' }}
						spacing={8}
					>
						{/* Company Info */}
						<VStack align={{ base: 'center', lg: 'flex-start' }} spacing={4} flex={1}>
							<Text fontSize="xl" fontWeight="bold" color={textPrimary}>
								Coffee Store
							</Text>
							<Text fontSize="sm" color={textSecondary} textAlign={{ base: 'center', lg: 'left' }}>
								{t('footer.description')}
							</Text>

							{/* Social Links */}
							<HStack spacing={4}>
								{socialLinks.map((social) => (
									<Link
										key={social.label}
										href={social.href}
										isExternal
										aria-label={social.label}
									>
										<Icon
											as={social.icon}
											boxSize={5}
											color={textSecondary}
											_hover={{ color: textPrimary }}
											transition="color 0.2s"
										/>
									</Link>
								))}
							</HStack>
						</VStack>

						{/* Footer Sections */}
						<Flex
							direction={{ base: 'column', md: 'row' }}
							justify="space-between"
							align={{ base: 'center', md: 'flex-start' }}
							spacing={8}
							flex={2}
						>
							{footerSections.map((section) => (
								<VStack
									key={section.title}
									align={{ base: 'center', md: 'flex-start' }}
									spacing={3}
									minW="150px"
								>
									<Text fontWeight="bold" color={textPrimary}>
										{section.title}
									</Text>
									<VStack spacing={2} align={{ base: 'center', md: 'flex-start' }}>
										{section.links.map((link) => (
											<Link
												key={link.label}
												href={link.href}
												color={textSecondary}
												_hover={{ color: textPrimary }}
												transition="color 0.2s"
											>
												{link.label}
											</Link>
										))}
									</VStack>
								</VStack>
							))}
						</Flex>

						{/* Location & Currency Selectors */}
						<VStack align={{ base: 'center', lg: 'flex-end' }} spacing={4} flex={1}>
							<Text fontWeight="bold" color={textPrimary}>
								{t('footer.location_currency')}
							</Text>
							<VStack spacing={3} w="full" maxW="200px">
								<LocationSelector />
								<CurrencySelector />
							</VStack>
						</VStack>
					</Flex>

					{/* Newsletter Subscription */}
					<Box
						bg={useColorModeValue('white', 'gray.800')}
						p={6}
						borderRadius="lg"
						border="1px"
						borderColor={cardBorder}
					>
						<VStack spacing={4}>
							<Text fontSize="lg" fontWeight="bold" color={textPrimary}>
								{t('footer.newsletter_title')}
							</Text>
							<Text fontSize="sm" color={textSecondary} textAlign="center">
								{t('footer.newsletter_description')}
							</Text>
							<HStack spacing={3} w="full" maxW="400px">
								<Input
									placeholder={t('footer.email_placeholder')}
									bg={useColorModeValue('white', 'gray.700')}
									borderColor={cardBorder}
									_focus={{ borderColor: 'blue.500' }}
								/>
								<Button colorScheme="blue" px={6}>
									{t('footer.subscribe')}
								</Button>
							</HStack>
						</VStack>
					</Box>

					{/* Bottom Footer */}
					<Flex
						direction={{ base: 'column', md: 'row' }}
						justify="space-between"
						align={{ base: 'center', md: 'center' }}
						pt={6}
						borderTop="1px"
						borderColor={cardBorder}
					>
						<Text fontSize="sm" color={textSecondary}>
							© {new Date().getFullYear()} Coffee Store. {t('footer.all_rights_reserved')}
						</Text>
						<HStack spacing={4} mt={{ base: 4, md: 0 }}>
							<Link href="/privacy" fontSize="sm" color={textSecondary}>
								{t('footer.privacy')}
							</Link>
							<Link href="/terms" fontSize="sm" color={textSecondary}>
								{t('footer.terms')}
							</Link>
						</HStack>
					</Flex>
				</VStack>
			</Container>
		</Box>
	);
};

export default FooterContent;
