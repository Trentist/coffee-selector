"use client";

/**
 * Authentication Input Component
 * مكون حقل الإدخال للمصادقة
 */

import React, { useState } from "react";
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	IconButton,
	Box,
	Text,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useThemeColors } from "@/theme/hooks/useThemeColors";
import type { AuthInputProps } from "../types";

const MotionBox = Box;

export const AuthInput: React.FC<AuthInputProps> = ({
	name,
	label,
	placeholder,
	type = "text",
	required = false,
	error,
	value,
	onChange,
	onBlur,
	icon,
	showPasswordToggle = false,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const { input, error: errorColors } = useThemeColors();

	const inputType = type === "password" && showPassword ? "text" : type;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<MotionBox
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3, ease: "easeOut" }}>
			<FormControl isInvalid={!!error}>
				<FormLabel
					htmlFor={name}
					fontSize="sm"
					fontWeight="medium"
					color={input.color}
					mb={2}>
					{label}
					{required && (
						<Text as="span" color="red.500" ml={1}>
							*
						</Text>
					)}
				</FormLabel>

				<InputGroup>
					{icon && (
						<InputLeftElement pointerEvents="none">
							<Box color={input.color} opacity={0.7}>
								{icon}
							</Box>
						</InputLeftElement>
					)}

					<Input
						id={name}
						name={name}
						type={inputType}
						placeholder={placeholder}
						value={value}
						onChange={handleChange}
						onBlur={onBlur}
						bg={input.bg}
						border="none"
						borderBottom="0.2px solid"
						borderColor={error ? errorColors.bg : input.border}
						borderRadius="0"
						color={input.color}
						_placeholder={{ color: input.placeholder }}
						_focus={{
							borderBottomColor: input.focus.border,
							bg: input.focus.bg,
							boxShadow: "none",
						}}
						_hover={{
							borderBottomColor: input.hover.border,
							bg: input.hover.bg,
						}}
						_disabled={{
							bg: input.disabled.bg,
							borderBottomColor: input.disabled.border,
							color: input.disabled.color,
							opacity: 0.6,
						}}
						transition="all 0.2s ease-in-out"
					/>

					{showPasswordToggle && type === "password" && (
						<InputRightElement>
							<IconButton
								aria-label={
									showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
								}
								icon={showPassword ? <FiEyeOff /> : <FiEye />}
								variant="ghost"
								size="sm"
								onClick={togglePasswordVisibility}
								bg="transparent"
								color={input.color}
								_hover={{ bg: "transparent" }}
								_focus={{ bg: "transparent" }}
							/>
						</InputRightElement>
					)}
				</InputGroup>

				{error && (
					<MotionBox
						initial={{ opacity: 0, x: -10, scale: 0.9 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 20,
						}}>
						<FormErrorMessage color={errorColors.bg} fontSize="xs" mt={1}>
							{error}
						</FormErrorMessage>
					</MotionBox>
				)}
			</FormControl>
		</MotionBox>
	);
};
