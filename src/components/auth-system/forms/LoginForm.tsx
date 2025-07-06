"use client";

/**
 * Login Form Component
 * نموذج تسجيل الدخول
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
} from "@chakra-ui/react";
// import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { AuthInput } from "../ui/AuthInput";
import { AuthButton } from "../ui/AuthButton";
import { AuthDivider } from "../ui/AuthDivider";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import type { AuthFormProps } from "../types";

const MotionVStack = VStack;

interface LoginFormProps extends AuthFormProps {
	onSwitchToRegister?: () => void;
	onSwitchToForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
	onSuccess,
	onError,
	onSwitchToRegister,
	onSwitchToForgotPassword,
	redirectTo = "/dashboard",
}) => {
	const t = useTranslations("auth");
	const [showPassword, setShowPassword] = useState(false);

	const { formData, errors, isLoading, handleInputChange, handleSubmit } =
		useAuthForm("login");
	const {
		getAnimationVariants,
		getTransition,
		getStaggerVariants,
		getFieldVariants,
	} = useAuthAnimation();

	const animationVariants = getAnimationVariants("login");
	const transition = getTransition("login");
	const staggerVariants = getStaggerVariants();
	const fieldVariants = getFieldVariants();

	const handleFormSubmit = async () => {
		const result = await handleSubmit();
		if (result.success) {
			onSuccess?.();
		} else {
			onError?.(result.error || "فشل تسجيل الدخول");
		}
	};

	const handleGoogleLogin = () => {
		// TODO: Implement Google OAuth
		console.log("Google login clicked");
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

			{/* Google Login Button */}
			<MotionVStack variants={fieldVariants} w="100%">
				<AuthButton
					title={t("continue_with_google")}
					onClick={handleGoogleLogin}
					variant="secondary"
					icon={<FaGoogle />}
					disabled={isLoading}
				/>
			</MotionVStack>

			{/* Divider */}
			<MotionVStack variants={fieldVariants} w="100%">
				<AuthDivider text={t("or_continue_with_email")} />
			</MotionVStack>

			{/* Login Form */}
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
				{/* Email Input */}
				<motion.div variants={fieldVariants} style={{ width: "100%" }}>
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
				</motion.div>

				{/* Password Input */}
				<motion.div variants={fieldVariants} style={{ width: "100%" }}>
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
				</motion.div>

				{/* Remember Me & Forgot Password */}
				<motion.div variants={fieldVariants} style={{ width: "100%" }}>
					<HStack justify="space-between" align="center" w="100%">
						<Checkbox
							isChecked={formData.rememberMe}
							onChange={(e) =>
								handleInputChange("rememberMe", e.target.checked)
							}
							colorScheme="gray"
							size="sm">
							<Text fontSize="sm" color="gray.600">
								{t("remember_me")}
							</Text>
						</Checkbox>

						<Link
							color="blue.500"
							fontSize="sm"
							onClick={onSwitchToForgotPassword}
							cursor="pointer"
							_hover={{ textDecoration: "underline" }}>
							{t("forgot_password")}
						</Link>
					</HStack>
				</motion.div>

				{/* Login Button */}
				<motion.div variants={fieldVariants} style={{ width: "100%" }}>
					<AuthButton
						title={t("login")}
						onClick={handleFormSubmit}
						isLoading={isLoading}
						variant="primary"
						size="lg"
					/>
				</motion.div>
			</MotionVStack>

			{/* Register Link */}
			<motion.div variants={fieldVariants} style={{ width: "100%" }}>
				<HStack justify="center" spacing={1}>
					<Text fontSize="sm" color="gray.600">
						{t("dont_have_account")}
					</Text>
					<Link
						color="blue.500"
						fontSize="sm"
						onClick={onSwitchToRegister}
						cursor="pointer"
						_hover={{ textDecoration: "underline" }}>
						{t("sign_up")}
					</Link>
				</HStack>
			</motion.div>
		</MotionVStack>
	);
};
