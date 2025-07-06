"use client";

import React from "react";
import { LoginForm } from "./forms/LoginForm";
import { RegisterForm } from "./forms/RegisterForm";
import { ForgotPasswordForm } from "./forms/ForgotPasswordForm";
import { ResetPasswordForm } from "./forms/ResetPasswordForm";
import type { AuthFormType } from "./types";

interface AuthFormProps {
	formType: AuthFormType;
	onSuccess?: () => void;
	onError?: (error: string) => void;
	onSwitchForm?: (formType: AuthFormType) => void;
	redirectTo?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
	formType,
	onSuccess,
	onError,
	onSwitchForm,
	redirectTo = "/dashboard",
}) => {
	switch (formType) {
		case "login":
			return (
				<LoginForm
					onSuccess={onSuccess}
					onError={onError}
					onSwitchToRegister={() => onSwitchForm?.("register")}
					onSwitchToForgotPassword={() => onSwitchForm?.("forgot-password")}
					redirectTo={redirectTo}
				/>
			);

		case "register":
			return (
				<RegisterForm
					onSuccess={onSuccess}
					onError={onError}
					onSwitchToLogin={() => onSwitchForm?.("login")}
					redirectTo={redirectTo}
				/>
			);

		case "forgot-password":
			return (
				<ForgotPasswordForm
					onSuccess={onSuccess}
					onError={onError}
					onSwitchToLogin={() => onSwitchForm?.("login")}
					redirectTo={redirectTo}
				/>
			);

		case "reset-password":
			return (
				<ResetPasswordForm
					onSuccess={onSuccess}
					onError={onError}
					onSwitchToLogin={() => onSwitchForm?.("login")}
					redirectTo={redirectTo}
				/>
			);

		default:
			return (
				<LoginForm
					onSuccess={onSuccess}
					onError={onError}
					onSwitchToRegister={() => onSwitchForm?.("register")}
					onSwitchToForgotPassword={() => onSwitchForm?.("forgot-password")}
					redirectTo={redirectTo}
				/>
			);
	}
};
