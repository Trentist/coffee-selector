"use client";

/**
 * Authentication Container Component
 * المكون الرئيسي للمصادقة
 */

import React, { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import { AuthForm } from "./AuthForm";
import type { AuthFormType } from "./types";

interface AuthContainerProps {
	initialFormType?: AuthFormType;
	onSuccess?: () => void;
	onError?: (error: string) => void;
	redirectTo?: string;
	title?: string;
	subtitle?: string;
	image?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
	initialFormType = "login",
	onSuccess,
	onError,
	redirectTo = "/dashboard",
	title = "Coffee Selection",
	subtitle = "اكتشف عالم القهوة المميز",
	image = "/assets/images/auth-bg.jpg",
}) => {
	const [currentFormType, setCurrentFormType] =
		useState<AuthFormType>(initialFormType);

	const handleSwitchForm = (newFormType: AuthFormType) => {
		setCurrentFormType(newFormType);
	};

	const handleSuccess = () => {
		onSuccess?.();
	};

	const handleError = (error: string) => {
		onError?.(error);
	};

	return (
		<AuthLayout title={title} subtitle={subtitle} image={image}>
			<AuthForm
				formType={currentFormType}
				onSuccess={handleSuccess}
				onError={handleError}
				onSwitchForm={handleSwitchForm}
				redirectTo={redirectTo}
			/>
		</AuthLayout>
	);
};
