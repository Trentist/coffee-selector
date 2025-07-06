"use client";

/**
 * Reset Password Form Component
 * نموذج إعادة تعيين كلمة المرور
 */

import React, { useState } from "react";
import { VStack, Alert, AlertIcon, Text, Progress } from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiLock } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AuthInput } from "../ui/AuthInput";
import { AuthButton } from "../ui/AuthButton";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import { useAuthValidation } from "../hooks/useAuthValidation";
import type { AuthFormProps } from "../types";

const MotionVStack = VStack;

interface ResetPasswordFormProps extends AuthFormProps {
	onSwitchToLogin?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
	onSuccess,
	onError,
	onSwitchToLogin,
}) => {
	const t = useTranslations("auth");
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { formData, errors, isLoading, handleInputChange, handleSubmit } =
		useAuthForm("reset-password");
	const {
		getAnimationVariants,
		getTransition,
		getStaggerVariants,
		getFieldVariants,
	} = useAuthAnimation();
	const { getPasswordStrength } = useAuthValidation();

	const animationVariants = getAnimationVariants("reset-password");
	const transition = getTransition("reset-password");
	const staggerVariants = getStaggerVariants();
	const fieldVariants = getFieldVariants();

	const passwordStrength = getPasswordStrength(formData.password);

	const handleFormSubmit = async () => {
		if (!token) {
			onError?.("رمز إعادة التعيين غير صحيح");
			return;
		}

		const result = await handleSubmit();
		if (result.success) {
			onSuccess?.();
		} else {
			onError?.(result.error || "فشل إعادة تعيين كلمة المرور");
		}
	};

	// Check if token is valid
	if (!token) {
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
					<Alert status="error" borderRadius="md">
						<AlertIcon />
						رمز إعادة التعيين غير صحيح أو منتهي الصلاحية
					</Alert>
				</MotionVStack>

				<MotionVStack variants={fieldVariants} textAlign="center">
					<Text fontSize="lg" fontWeight="bold" color="gray.700">
						رمز غير صحيح
					</Text>
					<Text fontSize="sm" color="gray.600">
						رمز إعادة التعيين غير صحيح أو منتهي الصلاحية. يرجى طلب رابط جديد.
					</Text>
				</MotionVStack>

				<MotionVStack variants={fieldVariants} w="100%">
					<AuthButton
						title={t("back_to_login")}
						onClick={onSwitchToLogin}
						variant="primary"
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
					إعادة تعيين كلمة المرور
				</Text>
				<Text fontSize="sm" color="gray.600">
					أدخل كلمة المرور الجديدة
				</Text>
			</MotionVStack>

			{/* Reset Password Form */}
			<MotionVStack
				variants={staggerVariants}
				initial="hidden"
				animate="visible"
				spacing={4}
				w="100%"
				as="form"
				onSubmit={(e) => {
					e.preventDefault();
					handleFormSubmit();
				}}>
				{/* New Password Input */}
				<motion.div variants={fieldVariants} style={{ width: "100%" }}>
					<AuthInput
						name="password"
						label={t("new_password")}
						placeholder={t("new_password_placeholder")}
						type="password"
						required
						error={errors.password}
						value={formData.password}
						onChange={(value) => handleInputChange("password", value)}
						icon={<FiLock />}
						showPasswordToggle
					/>

					{formData.password && (
						<VStack spacing={1} mt={2} align="stretch">
							<Progress
								value={passwordStrength.score * 25}
								size="xs"
								bg="gray.100"
								sx={{
									"& > div": {
										bg: passwordStrength.color,
									},
								}}
							/>
							<Text fontSize="xs" color={passwordStrength.color}>
								قوة كلمة المرور: {passwordStrength.text}
							</Text>
						</VStack>
					)}
				</motion.div>

				{/* Confirm Password Input */}
				<motion.div variants={fieldVariants} style={{ width: "100%" }}>
					<AuthInput
						name="confirmPassword"
						label={t("confirm_new_password")}
						placeholder={t("confirm_password_placeholder")}
						type="password"
						required
						error={errors.confirmPassword}
						value={formData.confirmPassword || ""}
						onChange={(value) => handleInputChange("confirmPassword", value)}
						icon={<FiLock />}
						showPasswordToggle
					/>
				</motion.div>

				{/* Reset Button */}
				<motion.div variants={fieldVariants} style={{ width: "100%" }}>
					<AuthButton
						title={t("reset_password")}
						onClick={handleFormSubmit}
						isLoading={isLoading}
						variant="primary"
						size="lg"
					/>
				</motion.div>
			</MotionVStack>

			{/* Back to Login */}
			<MotionVStack variants={fieldVariants} textAlign="center">
				<AuthButton
					title={t("back_to_login")}
					onClick={onSwitchToLogin}
					variant="ghost"
					size="sm"
				/>
			</MotionVStack>
		</MotionVStack>
	);
};
