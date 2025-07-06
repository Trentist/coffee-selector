import React, { useRef } from "react";
import { VStack, useDisclosure } from "@chakra-ui/react";
import { FiShield, FiLogOut, FiTrash2, FiGlobe } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "@/components/ui/useLocale";
import CustomButton from "@/components/ui/custom-button";
import { SettingItem } from "@/components/ui/setting-item";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";

/**
 * Settings buttons component for managing user settings
 * @component
 * @returns {JSX.Element} Settings buttons component
 */
const SettingsButtons: React.FC = () => {
	const router = useRouter();
	const { t, isRTL } = useLocale();
	const {
		isLoading,
		is2FAEnabled,
		handle2FA,
		handleRevokeSessions,
		handleDeleteAccount,
	} = useSecuritySettings();

	const {
		isOpen: isRevokeOpen,
		onOpen: onRevokeOpen,
		onClose: onRevokeClose,
	} = useDisclosure();

	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();

	const cancelRef = useRef<HTMLButtonElement>(null);

	const pathname = usePathname();
	const handleLanguageChange = (newLocale: string) => {
		// Extract the current path without locale
		const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
		router.push(`/${newLocale}${pathWithoutLocale}`);
	};

	return (
		<>
			<VStack spacing={6} align="stretch" p={6}>
				<SettingItem
					icon={FiShield}
					title={t("security.2fa_title")}
					description={
						is2FAEnabled
							? t("security.2fa_enabled_desc")
							: t("security.2fa_disabled_desc")
					}
					action={
						<CustomButton
							onClick={handle2FA}
							title={
								is2FAEnabled
									? t("security.disable_2fa")
									: t("security.enable_2fa")
							}
							isLoading={isLoading}
						/>
					}
				/>

				<SettingItem
					icon={FiGlobe}
					title={t("language.title")}
					description={t("language.description")}
					action={
						<CustomButton
							onClick={() => handleLanguageChange(isRTL ? "en" : "ar")}
							title={isRTL ? "English" : "العربية"}
						/>
					}
				/>

				<SettingItem
					icon={FiLogOut}
					title={t("security.sessions_title")}
					description={t("security.sessions_desc")}
					action={
						<CustomButton
							onClick={onRevokeOpen}
							title={t("security.revoke_sessions")}
							isLoading={isLoading}
						/>
					}
				/>

				<SettingItem
					icon={FiTrash2}
					title={t("security.delete_account")}
					description={t("security.delete_account_desc")}
					action={
						<CustomButton
							onClick={onDeleteOpen}
							title={t("security.delete_account")}
							isLoading={isLoading}
							bg="transparent"
							color="red"
							border="1px solid red"
							borderRadius="0"
							_hover={{
								bg: "red",
								color: "white",
								transition: "all 0.3s ease-in-out",
							}}
							transition="all 0.3s ease-in-out"
						/>
					}
					isDanger
				/>
			</VStack>

			<ConfirmationDialog
				isOpen={isRevokeOpen}
				onClose={onRevokeClose}
				title={t("security.revoke_sessions_confirm")}
				message={t("security.revoke_sessions_warning")}
				confirmText={t("security.revoke_sessions")}
				onConfirm={handleRevokeSessions}
				isLoading={isLoading}
				cancelRef={cancelRef as React.RefObject<HTMLButtonElement>}
			/>

			<ConfirmationDialog
				isOpen={isDeleteOpen}
				onClose={onDeleteClose}
				title={t("security.delete_account_confirm")}
				message={t("security.delete_account_warning")}
				confirmText={t("security.delete_account")}
				onConfirm={handleDeleteAccount}
				isLoading={isLoading}
				cancelRef={cancelRef as React.RefObject<HTMLButtonElement>}
			/>
		</>
	);
};

export default SettingsButtons;
