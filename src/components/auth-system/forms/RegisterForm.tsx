"use client";

/**
 * Register Form Component
 * نموذج التسجيل
 */

import React, { useState } from "react";
import {
	VStack,
	HStack,
	Checkbox,
	Text,
	Link,
	Alert,
	AlertIcon,
	Progress,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { AuthInput } from "../ui/AuthInput";
import { AuthButton } from "../ui/AuthButton";
import { AuthDivider } from "../ui/AuthDivider";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import { useAuthValidation } from "../hooks/useAuthValidation";
import type { AuthFormProps } from "../types";

const MotionVStack = VStack;

interface RegisterFormProps extends AuthFormProps {
	onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
	onSuccess,
	onError,
	onSwitchToLogin,
	redirectTo = "/dashboard",
}) => {
	const t = useTranslations("auth");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { formData, errors, isLoading, handleInputChange, handleSubmit } =
		useAuthForm("register");
	const {
		getAnimationVariants,
		getTransition,
		getStaggerVariants,
		getFieldVariants,
	} = useAuthAnimation();
	const { getPasswordStrength } = useAuthValidation();

	const animationVariants = getAnimationVariants("register");
	const transition = getTransition("register");
	const staggerVariants = getStaggerVariants();
	const fieldVariants = getFieldVariants();

	const passwordStrength = getPasswordStrength(formData.password);

	const handleFormSubmit = async () => {
		const result = await handleSubmit();
		if (result.success) {
			onSuccess?.();
		} else {
			onError?.(result.error || "فشل التسجيل");
		}
	};

	const handleGoogleRegister = () => {
		// TODO: Implement Google OAuth
		console.log("Google register clicked");
	};

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

			{/* Google Register Button */}
			<MotionVStack variants={fieldVariants} w="100%">
				<AuthButton
					title={t("signup_with_google")}
					onClick={handleGoogleRegister}
					variant="secondary"
					icon={<FaGoogle />}
					disabled={isLoading}
				/>
			</MotionVStack>

			{/* Divider */}
			<MotionVStack variants={fieldVariants} w="100%">
				<AuthDivider text={t("or_signup_with_email")} />
			</MotionVStack>

			{/* Register Form */}
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
				{/* Name Input */}
				<div style={{ width: "100%" }}>
					<AuthInput
						name="name"
						label={t("full_name")}
						placeholder={t("full_name_placeholder")}
						type="text"
						required
						error={errors.name}
						value={formData.name || ""}
						onChange={(value) => handleInputChange("name", value)}
						icon={<FiUser />}
					/>
				</div>

				{/* Email Input */}
				<div style={{ width: "100%" }}>
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
				</div>

				{/* Phone Input */}
				<div style={{ width: "100%" }}>
					<AuthInput
						name="phone"
						label={t("phone")}
						placeholder={t("phone_placeholder")}
						type="tel"
						error={errors.phone}
						value={formData.phone || ""}
						onChange={(value) => handleInputChange("phone", value)}
						icon={<FiPhone />}
					/>
				</div>

				{/* Password Input */}
				<div style={{ width: "100%" }}>
					<AuthInput
						name="password"
						label={t("password")}
						placeholder={t("password_placeholder")}
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
				</div>

				{/* Confirm Password Input */}
				<div style={{ width: "100%" }}>
					<AuthInput
						name="confirmPassword"
						label={t("confirm_password")}
						placeholder={t("confirm_password_placeholder")}
						type="text"
						required
						error={errors.confirmPassword}
						value={formData.confirmPassword || ""}
						onChange={(value) => handleInputChange("confirmPassword", value)}
						icon={<FiLock />}
						showPasswordToggle
					/>
				</div>

				{/* Terms Agreement */}
				<div style={{ width: "100%" }}>
					<Checkbox
						isChecked={formData.agreeToTerms}
						onChange={(e) =>
							handleInputChange("agreeToTerms", e.target.checked)
						}
						colorScheme="blue"
						size="sm">
						<Text fontSize="sm" color="gray.600">
							أوافق على{" "}
							<Link color="blue.500" href="/terms" isExternal>
								الشروط والأحكام
							</Link>{" "}
							و{" "}
							<Link color="blue.500" href="/privacy" isExternal>
								سياسة الخصوصية
							</Link>
						</Text>
					</Checkbox>
					{errors.agreeToTerms && (
						<Text fontSize="xs" color="red.500" mt={1}>
							{errors.agreeToTerms}
						</Text>
					)}
				</div>

				{/* Register Button */}
				<div style={{ width: "100%" }}>
					<AuthButton
						title={t("register")}
						onClick={handleFormSubmit}
						isLoading={isLoading}
						variant="primary"
						size="lg"
					/>
				</div>
			</MotionVStack>

			{/* Login Link */}
			<div style={{ width: "100%" }}>
				<HStack justify="center" spacing={1}>
					<Text fontSize="sm" color="gray.600">
						{t("already_have_account")}
					</Text>
					<Link
						color="blue.500"
						fontSize="sm"
						onClick={onSwitchToLogin}
						cursor="pointer"
						_hover={{ textDecoration: "underline" }}>
						{t("sign_in")}
					</Link>
				</HStack>
			</div>
		</MotionVStack>
	);
};
