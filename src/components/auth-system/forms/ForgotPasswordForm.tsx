"use client";

/**
 * Forgot Password Form Component
 * نموذج نسيان كلمة المرور
 */

import React, { useState } from "react";
import { VStack, Alert, AlertIcon, Text } from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { AuthInput } from "../ui/AuthInput";
import { AuthButton } from "../ui/AuthButton";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import type { AuthFormProps } from "../types";

const MotionVStack = VStack;

interface ForgotPasswordFormProps extends AuthFormProps {
	onSwitchToLogin?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
	onSuccess,
	onError,
	onSwitchToLogin,
}) => {
	const t = useTranslations("auth");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { formData, errors, isLoading, handleInputChange, handleSubmit } =
		useAuthForm("forgot-password");
	const { getAnimationVariants, getTransition, getFieldVariants } =
		useAuthAnimation();

	const animationVariants = getAnimationVariants("forgot-password");
	const transition = getTransition("forgot-password");
	const fieldVariants = getFieldVariants();

	const handleFormSubmit = async () => {
		const result = await handleSubmit();
		if (result.success) {
			setIsSubmitted(true);
			onSuccess?.();
		} else {
			onError?.(result.error || "فشل إرسال رابط إعادة التعيين");
		}
	};

	// Success state
	if (isSubmitted) {
		return (
			<MotionVStack
				variants={animationVariants}
				initial="hidden"
				animate="visible"
				transition={transition}
				spacing={6}
				w="100%"
				maxW="400px">
				<MotionVStack variants={fieldVariants} w="100%">
					<Alert status="success" borderRadius="md">
						<AlertIcon />
						تم إرسال رابط إعادة التعيين
					</Alert>
				</MotionVStack>

				<MotionVStack variants={fieldVariants} spacing={4} textAlign="center">
					<Text fontSize="lg" fontWeight="bold" color="gray.700">
						تحقق من بريدك الإلكتروني
					</Text>
					<Text fontSize="sm" color="gray.600">
						تم إرسال رابط إعادة تعيين كلمة المرور إلى:
					</Text>
					<Text fontSize="sm" fontWeight="medium" color="blue.500">
						{formData.email}
					</Text>
					<Text fontSize="sm" color="gray.600">
						إذا لم تجد الرسالة، تحقق من مجلد الرسائل غير المرغوب فيها
					</Text>
				</MotionVStack>

				<MotionVStack variants={fieldVariants} w="100%">
					<AuthButton
						title={t("back_to_login")}
						onClick={onSwitchToLogin}
						variant="secondary"
						icon={<FiArrowLeft />}
					/>
				</MotionVStack>
			</MotionVStack>
		);
	}

	return (
		<MotionVStack
			variants={animationVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			transition={transition}
			spacing={6}
			w="100%"
			maxW="400px">
			{/* Error Alert */}
			{errors.general && (
				<MotionVStack variants={fieldVariants} w="100%">
					<Alert status="error" borderRadius="md">
						<AlertIcon />
						{errors.general}
					</Alert>
				</MotionVStack>
			)}

			{/* Header */}
			<MotionVStack variants={fieldVariants} spacing={2} textAlign="center">
				<Text fontSize="2xl" fontWeight="bold" color="gray.700">
					نسيت كلمة المرور؟
				</Text>
				<Text fontSize="sm" color="gray.600">
					أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
				</Text>
			</MotionVStack>

			{/* Forgot Password Form */}
			<MotionVStack
				variants={fieldVariants}
				spacing={4}
				w="100%"
				as="form"
				onSubmit={(e) => {
					e.preventDefault();
					handleFormSubmit();
				}}>
				{/* Email Input */}
				<AuthInput
					name="email"
					label={t("email")}
					placeholder={t("email_placeholder")}
					type="email"
					required
					error={errors.email}
					value={formData.email}
					onChange={(value) => handleInputChange("email", value)}
					icon={<FiMail />}
				/>

				{/* Submit Button */}
				<AuthButton
					title={t("send_reset_link")}
					onClick={handleFormSubmit}
					isLoading={isLoading}
					variant="primary"
					size="lg"
				/>
			</MotionVStack>

			{/* Back to Login */}
			<MotionVStack variants={fieldVariants} spacing={2} textAlign="center">
				<Text fontSize="sm" color="gray.600">
					تذكرت كلمة المرور؟
				</Text>
				<AuthButton
					title={t("back_to_login")}
					onClick={onSwitchToLogin}
					variant="ghost"
					size="sm"
					icon={<FiArrowLeft />}
				/>
			</MotionVStack>
		</MotionVStack>
	);
};
