/**
 * Settings Hook
 * خطاف إدارة الإعدادات
 */

import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import client from "@/lib/graphql-client";
import { useLocale } from "@/components/ui/useLocale";
import {
	GET_USER_SETTINGS,
	GET_USER_ACTIVITY_LOG,
	GET_USER_DEVICES,
} from "../services/settings-queries";
import {
	UPDATE_USER_PREFERENCES,
	TOGGLE_TWO_FACTOR_AUTH,
	REVOKE_USER_SESSION,
	REVOKE_ALL_SESSIONS,
} from "../services/settings-mutations";

interface UserSettings {
	id: string;
	name: string;
	email: string;
	phone?: string;
	preferences: {
		language: string;
		currency: string;
		timezone: string;
		notifications: {
			email: boolean;
			sms: boolean;
			push: boolean;
			marketing: boolean;
		};
		privacy: {
			dataSharing: boolean;
			marketing: boolean;
			analytics: boolean;
			profileVisibility: string;
		};
		security: {
			twoFactorEnabled: boolean;
			sessionTimeout: number;
			deviceManagement: boolean;
			loginNotifications: boolean;
			// Additional security settings
			trustedDevicesOnly: boolean;
			deviceNotifications: boolean;
			suspiciousActivityAlerts: boolean;
			newDeviceAlerts: boolean;
			locationBasedAlerts: boolean;
			failedLoginAlerts: boolean;
			autoLockAccount: boolean;
			requirePasswordConfirmation: boolean;
			emergencyBypass: boolean;
		};
		display: {
			theme: string;
			density: string;
			animations: boolean;
		};
	};
	addresses: Array<{
		id: string;
		name: string;
		street: string;
		city: string;
		country: string;
		isDefault: boolean;
		type: string;
	}>;
	sessions: Array<{
		id: string;
		device: string;
		location: string;
		lastActive: string;
		current: boolean;
	}>;
}

/**
 * Custom hook for managing user settings
 */
export const useSettings = () => {
	const [settings, setSettings] = useState<UserSettings | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const { data: session } = useSession();
	const toast = useToast();
	const { t } = useLocale();

	// Fetch user settings
	const fetchSettings = async () => {
		if (!session?.user?.id) return;

		try {
			setIsLoading(true);
			const response = (await client.request(GET_USER_SETTINGS, {
				userId: session.user.id,
			})) as { user: UserSettings };

			setSettings(response.user);
		} catch (error) {
			console.error("Error fetching settings:", error);
			toast({
				title: t("settings.error_loading"),
				description: t("settings.error_loading_desc"),
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Update user preferences
	const updatePreferences = async (
		preferences: Partial<UserSettings["preferences"]>,
	) => {
		if (!session?.user?.id) return false;

		try {
			setIsUpdating(true);
			const response = (await client.request(UPDATE_USER_PREFERENCES, {
				userId: session.user.id,
				preferences,
			})) as { updateUserPreferences: { success: boolean } };

			if (response.updateUserPreferences.success) {
				setSettings((prev) =>
					prev
						? {
								...prev,
								preferences: { ...prev.preferences, ...preferences },
							}
						: null,
				);

				toast({
					title: t("settings.update_success"),
					description: t("settings.update_success_desc"),
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error updating preferences:", error);
			toast({
				title: t("settings.update_error"),
				description: t("settings.update_error_desc"),
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return false;
		} finally {
			setIsUpdating(false);
		}
	};

	// Toggle two-factor authentication
	const toggleTwoFactorAuth = async (enabled: boolean, secret?: string) => {
		if (!session?.user?.id) return false;

		try {
			setIsUpdating(true);
			const response = (await client.request(TOGGLE_TWO_FACTOR_AUTH, {
				userId: session.user.id,
				enabled,
				secret,
			})) as {
				toggleTwoFactorAuth: {
					success: boolean;
					qrCode?: string;
					backupCodes?: string[];
				};
			};

			if (response.toggleTwoFactorAuth.success) {
				await fetchSettings(); // Refresh settings
				return {
					success: true,
					qrCode: response.toggleTwoFactorAuth.qrCode,
					backupCodes: response.toggleTwoFactorAuth.backupCodes,
				};
			}
			return { success: false };
		} catch (error) {
			console.error("Error toggling 2FA:", error);
			return { success: false };
		} finally {
			setIsUpdating(false);
		}
	};

	// Revoke user session
	const revokeSession = async (sessionId: string) => {
		if (!session?.user?.id) return false;

		try {
			const response = (await client.request(REVOKE_USER_SESSION, {
				userId: session.user.id,
				sessionId,
			})) as { revokeUserSession: { success: boolean } };

			if (response.revokeUserSession.success) {
				await fetchSettings(); // Refresh settings
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error revoking session:", error);
			return false;
		}
	};

	// Revoke all sessions except current
	const revokeAllSessions = async () => {
		if (!session?.user?.id) return false;

		try {
			const response = (await client.request(REVOKE_ALL_SESSIONS, {
				userId: session.user.id,
			})) as { revokeAllSessions: { success: boolean } };

			if (response.revokeAllSessions.success) {
				await fetchSettings(); // Refresh settings
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error revoking all sessions:", error);
			return false;
		}
	};

	useEffect(() => {
		fetchSettings();
	}, [session?.user?.id]);

	return {
		settings,
		isLoading,
		isUpdating,
		fetchSettings,
		updatePreferences,
		toggleTwoFactorAuth,
		revokeSession,
		revokeAllSessions,
	};
};
