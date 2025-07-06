/**
 * Contact Info Component
 * مكون معلومات التواصل
 */

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface ContactInfoProps {
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    socialMedia: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    };
  };
  officeHours: {
    weekdays: string;
    weekdaysHours: string;
    weekend: string;
    weekendHours: string;
  };
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contactInfo, officeHours }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("brand.500", "brand.300");

  return (
    <Box
      bg="white"
      p={8}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      shadow="md"
    >
      <VStack spacing={8} align="start">
        {/* Company Info */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>
            كوفي سيليكشن
          </Text>
        </Box>

        {/* Contact Details */}
        <VStack spacing={4} align="start" w="full">
          <HStack spacing={3}>
            <Icon as={FiMapPin} color={accentColor} boxSize={5} />
            <Text color={textColor}>{contactInfo.address}</Text>
          </HStack>

          <HStack spacing={3}>
            <Icon as={FiPhone} color={accentColor} boxSize={5} />
            <Link href={`tel:${contactInfo.phone}`} color={textColor}>
              {contactInfo.phone}
            </Link>
          </HStack>

          <HStack spacing={3}>
            <Icon as={FiMail} color={accentColor} boxSize={5} />
            <Link href={`mailto:${contactInfo.email}`} color={textColor}>
              {contactInfo.email}
            </Link>
          </HStack>

          <HStack spacing={3}>
            <Icon as={FaWhatsapp} color={accentColor} boxSize={5} />
            <Link href={`https://wa.me/${contactInfo.whatsapp}`} color={textColor}>
              {contactInfo.whatsapp}
            </Link>
          </HStack>
        </VStack>

        {/* Office Hours */}
        <Box w="full">
          <HStack spacing={3} mb={3}>
            <Icon as={FiClock} color={accentColor} boxSize={5} />
            <Text fontWeight="semibold" color={textColor}>
              ساعات العمل
            </Text>
          </HStack>

          <VStack spacing={2} align="start" pl={8}>
            <Text color={textColor}>
              {officeHours.weekdays}: {officeHours.weekdaysHours}
            </Text>
            <Text color={textColor}>
              {officeHours.weekend}: {officeHours.weekendHours}
            </Text>
          </VStack>
        </Box>

        {/* Social Media */}
        <Box w="full">
          <Text fontWeight="semibold" color={textColor} mb={3}>
            تابعنا على وسائل التواصل
          </Text>

          <HStack spacing={4}>
            <Link href={contactInfo.socialMedia.facebook} isExternal>
              <Icon as={FiFacebook} boxSize={6} color={accentColor} />
            </Link>
            <Link href={contactInfo.socialMedia.twitter} isExternal>
              <Icon as={FiTwitter} boxSize={6} color={accentColor} />
            </Link>
            <Link href={contactInfo.socialMedia.instagram} isExternal>
              <Icon as={FiInstagram} boxSize={6} color={accentColor} />
            </Link>
            <Link href={contactInfo.socialMedia.linkedin} isExternal>
              <Icon as={FiLinkedin} boxSize={6} color={accentColor} />
            </Link>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ContactInfo;