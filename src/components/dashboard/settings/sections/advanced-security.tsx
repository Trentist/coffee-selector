/**
 * Advanced Security Section
 * قسم الأمان المتقدم
 */

import React, { useState } from "react";
import {
	VStack,
	HStack,
	Box,
	Button,
	Input,
	FormControl,
	FormLabel,
	useColorModeValue,
	Grid,
	Badge,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Select,
	Textarea,
	IconButton,
	Tooltip,
} from "@chakra-ui/react";
import {
	FiLock,
	FiShield,
	FiSmartphone,
	FiActivity,
	FiAlertTriangle,
	FiTrash2,
	FiEye,
	FiRefreshCw,
	FiDownload,
	FiX,
} from "react-icons/fi";
import { SettingSection } from "../components/setting-section";
import { SettingToggle } from "../components/setting-toggle";
import { useSettings } from "../hooks/use-settings";
import { useLocale } from "@/components/ui/useLocale";
import { TextH6, TextParagraph } from "@/components/ui/custom-text";
import CustomButton from "@/components/ui/custom-button";

// TODO: Replace with real device and session management service
// const devices = await securityService.getUserDevices();
// const sessions = await securityService.getActiveSessions();

// Mock devices data - replace with real data from security service
const mockDevices = [
	{
		id: "device_1",
		name: "iPhone 14 Pro",
		browser: "Safari",
		os: "iOS 16.1",
		location: "Dubai, UAE",
		lastActive: "2024-01-15T10:30:00Z",
		current: true,
		trusted: true,
	},
	{
		id: "device_2",
		name: "MacBook Pro",
		browser: "Chrome",
		os: "macOS 13.1",
		location: "Abu Dhabi, UAE",
		lastActive: "2024-01-14T15:45:00Z",
		current: false,
		trusted: true,
	},
	{
		id: "device_3",
		name: "iPad Air",
		browser: "Safari",
		os: "iPadOS 16.1",
		location: "Sharjah, UAE",
		lastActive: "2024-01-12T09:15:00Z",
		current: false,
		trusted: false,
	},
];

// Helper function to format date
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("ar-AE", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

/**
 * Advanced Security section component
 */
export const AdvancedSecuritySection: React.FC = () => {
	const {
		settings,
		isLoading,
		isUpdating,
		updatePreferences,
		revokeSession,
		revokeAllSessions,
	} = useSettings();
	const { t } = useLocale();

	// Local state
	const [sessionTimeout, setSessionTimeout] = useState(30);
	const [emergencyContact, setEmergencyContact] = useState("");
	const [selectedDevice, setSelectedDevice] = useState<any>(null);

	// Modals
	const {
		isOpen: isDeviceOpen,
		onOpen: onDeviceOpen,
		onClose: onDeviceClose,
	} = useDisclosure();
	const {
		isOpen: isActivityOpen,
		onOpen: onActivityOpen,
		onClose: onActivityClose,
	} = useDisclosure();
	const {
		isOpen: isEmergencyOpen,
		onOpen: onEmergencyOpen,
		onClose: onEmergencyClose,
	} = useDisclosure();

	// Theme colors
	const bg = useColorModeValue("#fff", "#0D1616");
	const color = useColorModeValue("#0D1616", "#fff");

	// Handle security toggles
	const handleSecurityToggle = async (type: string, enabled: boolean) => {
		const currentSecurity = settings?.preferences.security || ({} as any);
		await updatePreferences({
			security: {
				twoFactorEnabled: currentSecurity.twoFactorEnabled ?? false,
				sessionTimeout: currentSecurity.sessionTimeout ?? 30,
				deviceManagement: currentSecurity.deviceManagement ?? false,
				loginNotifications: currentSecurity.loginNotifications ?? false,
				trustedDevicesOnly: currentSecurity.trustedDevicesOnly ?? false,
				deviceNotifications: currentSecurity.deviceNotifications ?? true,
				suspiciousActivityAlerts:
					currentSecurity.suspiciousActivityAlerts ?? true,
				newDeviceAlerts: currentSecurity.newDeviceAlerts ?? true,
				locationBasedAlerts: currentSecurity.locationBasedAlerts ?? false,
				failedLoginAlerts: currentSecurity.failedLoginAlerts ?? true,
				autoLockAccount: currentSecurity.autoLockAccount ?? false,
				requirePasswordConfirmation:
					currentSecurity.requirePasswordConfirmation ?? false,
				emergencyBypass: currentSecurity.emergencyBypass ?? false,
				[type]: enabled,
			},
		});
	};

	// Handle device actions
	const handleRevokeDevice = async (deviceId: string) => {
		try {
			// This would call the actual service to revoke device
			console.log(`Revoking device: ${deviceId}`);
			// await revokeSession(deviceId);
		} catch (error) {
			console.error("Error revoking device:", error);
		}
	};

	const handleTrustDevice = async (deviceId: string) => {
		try {
			// This would call the actual service to trust device
			console.log(`Trusting device: ${deviceId}`);
		} catch (error) {
			console.error("Error trusting device:", error);
		}
	};

	const handleViewDeviceDetails = (device: any) => {
		setSelectedDevice(device);
		// Could open a detailed modal here
	};

	// Handle revoke all sessions
	const handleRevokeAllSessions = async () => {
		const success = await revokeAllSessions();
		if (success) {
			console.log("All sessions revoked successfully");
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	// Get status color
	const getStatusColor = (status: string) => {
		switch (status) {
			case "success":
				return "green";
			case "failed":
				return "red";
			case "warning":
				return "yellow";
			default:
				return "gray";
		}
	};

	if (isLoading) {
		return <Box>Loading...</Box>;
	}

	return (
		<VStack spacing={6} align="stretch">
			{/* Device Management */}
			<SettingSection
				title={t("settings.device_management")}
				description={t("settings.device_management_desc")}
				icon={FiSmartphone}>
				<VStack spacing={4}>
					<SettingToggle
						label={t("settings.trusted_devices_only")}
						description={t("settings.trusted_devices_only_desc")}
						isEnabled={
							settings?.preferences.security?.trustedDevicesOnly || false
						}
						onToggle={(enabled) =>
							handleSecurityToggle("trustedDevicesOnly", enabled)
						}
						isLoading={isUpdating}
					/>

					<SettingToggle
						label={t("settings.device_notifications")}
						description={t("settings.device_notifications_desc")}
						isEnabled={
							settings?.preferences.security?.deviceNotifications || true
						}
						onToggle={(enabled) =>
							handleSecurityToggle("deviceNotifications", enabled)
						}
						isLoading={isUpdating}
					/>

					<Box w="100%">
						<HStack justify="space-between" mb={4}>
							<TextH6 title={t("settings.active_devices")} />
							<CustomButton
								title={t("settings.view_all_devices")}
								size="sm"
								variant="outline"
								onClick={onDeviceOpen}
							/>
						</HStack>

						<TableContainer>
							<Table size="sm" variant="simple">
								<Thead>
									<Tr>
										<Th>{t("settings.device")}</Th>
										<Th>{t("settings.location")}</Th>
										<Th>{t("settings.last_active")}</Th>
										<Th>{t("settings.status")}</Th>
										<Th>{t("settings.actions")}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{/* {mockDevices.slice(0, 3).map((device) => (
										<Tr key={device.id}>
											<Td>
												<VStack align="start" spacing={0}>
													<TextParagraph title={device.name} fontSize="sm" />
													<TextParagraph
														title={`${device.browser} on ${device.os}`}
														fontSize="xs"
														color="gray.500"
													/>
												</VStack>
											</Td>
											<Td>
												<TextParagraph title={device.location} fontSize="sm" />
											</Td>
											<Td>
												<TextParagraph
													title={formatDate(device.lastActive)}
													fontSize="sm"
												/>
											</Td>
											<Td>
												<HStack>
													{device.current && (
														<Badge colorScheme="blue" size="sm">
															{t("settings.current")}
														</Badge>
													)}
													{device.trusted && (
														<Badge colorScheme="green" size="sm">
															{t("settings.trusted")}
														</Badge>
													)}
												</HStack>
											</Td>
											<Td>
												{!device.current && (
													<IconButton
														aria-label="Revoke device"
														icon={<FiX />}
														size="sm"
														variant="ghost"
														colorScheme="red"
														onClick={() => handleRevokeDevice(device.id)}
													/>
												)}
											</Td>
										</Tr>
									))} */}
								</Tbody>
							</Table>
						</TableContainer>

						<HStack justify="end" mt={4}>
							<CustomButton
								title={t("settings.revoke_all_sessions")}
								size="sm"
								colorScheme="red"
								variant="outline"
								onClick={handleRevokeAllSessions}
								leftIcon={<FiRefreshCw />}
							/>
						</HStack>
					</Box>
				</VStack>
			</SettingSection>

			{/* Security Alerts */}
			<SettingSection
				title={t("settings.security_alerts")}
				description={t("settings.security_alerts_desc")}
				icon={FiAlertTriangle}>
				<VStack spacing={4}>
					<SettingToggle
						label={t("settings.suspicious_activity_alerts")}
						description={t("settings.suspicious_activity_alerts_desc")}
						isEnabled={
							settings?.preferences.security?.suspiciousActivityAlerts || true
						}
						onToggle={(enabled) =>
							handleSecurityToggle("suspiciousActivityAlerts", enabled)
						}
						isLoading={isUpdating}
					/>

					<SettingToggle
						label={t("settings.new_device_alerts")}
						description={t("settings.new_device_alerts_desc")}
						isEnabled={settings?.preferences.security?.newDeviceAlerts || true}
						onToggle={(enabled) =>
							handleSecurityToggle("newDeviceAlerts", enabled)
						}
						isLoading={isUpdating}
					/>

					<SettingToggle
						label={t("settings.location_based_alerts")}
						description={t("settings.location_based_alerts_desc")}
						isEnabled={
							settings?.preferences.security?.locationBasedAlerts || false
						}
						onToggle={(enabled) =>
							handleSecurityToggle("locationBasedAlerts", enabled)
						}
						isLoading={isUpdating}
					/>

					<SettingToggle
						label={t("settings.failed_login_alerts")}
						description={t("settings.failed_login_alerts_desc")}
						isEnabled={
							settings?.preferences.security?.failedLoginAlerts || true
						}
						onToggle={(enabled) =>
							handleSecurityToggle("failedLoginAlerts", enabled)
						}
						isLoading={isUpdating}
					/>
				</VStack>
			</SettingSection>

			{/* Account Lock Settings */}
			<SettingSection
				title={t("settings.account_lock_settings")}
				description={t("settings.account_lock_settings_desc")}
				icon={FiLock}>
				<VStack spacing={4}>
					<FormControl>
						<FormLabel>{t("settings.session_timeout")}</FormLabel>
						<HStack>
							<Select
								value={sessionTimeout}
								onChange={(e) => setSessionTimeout(Number(e.target.value))}
								variant="flushed"
								focusBorderColor={color}
								maxW="200px">
								<option value={15}>15 minutes</option>
								<option value={30}>30 minutes</option>
								<option value={60}>1 hour</option>
								<option value={120}>2 hours</option>
								<option value={480}>8 hours</option>
								<option value={0}>Never</option>
							</Select>
							<TextParagraph
								title={t("settings.session_timeout_desc")}
								fontSize="sm"
								color="gray.500"
							/>
						</HStack>
					</FormControl>

					<SettingToggle
						label={t("settings.auto_lock_account")}
						description={t("settings.auto_lock_account_desc")}
						isEnabled={settings?.preferences.security?.autoLockAccount || false}
						onToggle={(enabled) =>
							handleSecurityToggle("autoLockAccount", enabled)
						}
						isLoading={isUpdating}
					/>

					<SettingToggle
						label={t("settings.require_password_confirmation")}
						description={t("settings.require_password_confirmation_desc")}
						isEnabled={
							settings?.preferences.security?.requirePasswordConfirmation ||
							true
						}
						onToggle={(enabled) =>
							handleSecurityToggle("requirePasswordConfirmation", enabled)
						}
						isLoading={isUpdating}
					/>
				</VStack>
			</SettingSection>

			{/* Activity Log */}
			<SettingSection
				title={t("settings.activity_log")}
				description={t("settings.activity_log_desc")}
				icon={FiActivity}>
				<VStack spacing={4}>
					<HStack justify="space-between" w="100%">
						<TextH6 title={t("settings.recent_activity")} />
						<HStack>
							<CustomButton
								title={t("settings.download_log")}
								size="sm"
								variant="outline"
								leftIcon={<FiDownload />}
							/>
							<CustomButton
								title={t("settings.view_full_log")}
								size="sm"
								variant="outline"
								onClick={onActivityOpen}
								leftIcon={<FiEye />}
							/>
						</HStack>
					</HStack>

					<TableContainer>
						<Table size="sm" variant="simple">
							<Thead>
								<Tr>
									<Th>{t("settings.activity")}</Th>
									<Th>{t("settings.timestamp")}</Th>
									<Th>{t("settings.location")}</Th>
									<Th>{t("settings.status")}</Th>
								</Tr>
							</Thead>
							<Tbody>
								{/* {mockActivityLog.slice(0, 5).map((activity) => (
									<Tr key={activity.id}>
										<Td>
											<TextParagraph
												title={activity.description}
												fontSize="sm"
											/>
										</Td>
										<Td>
											<TextParagraph
												title={formatDate(activity.timestamp)}
												fontSize="sm"
											/>
										</Td>
										<Td>
											<TextParagraph title={activity.location} fontSize="sm" />
										</Td>
										<Td>
											<Badge
												colorScheme={getStatusColor(activity.status)}
												size="sm">
												{t(`settings.${activity.status}`)}
											</Badge>
										</Td>
									</Tr>
								))} */}
							</Tbody>
						</Table>
					</TableContainer>
				</VStack>
			</SettingSection>

			{/* Emergency Settings */}
			<SettingSection
				title={t("settings.emergency_settings")}
				description={t("settings.emergency_settings_desc")}
				icon={FiShield}>
				<VStack spacing={4}>
					<Alert status="info" borderRadius="0">
						<AlertIcon />
						<Box>
							<AlertTitle>{t("settings.emergency_access")}</AlertTitle>
							<AlertDescription>
								{t("settings.emergency_access_desc")}
							</AlertDescription>
						</Box>
					</Alert>

					<FormControl>
						<FormLabel>{t("settings.emergency_contact")}</FormLabel>
						<Input
							value={emergencyContact}
							onChange={(e) => setEmergencyContact(e.target.value)}
							placeholder={t("settings.emergency_contact_placeholder")}
							variant="flushed"
							focusBorderColor={color}
						/>
					</FormControl>

					<SettingToggle
						label={t("settings.emergency_bypass")}
						description={t("settings.emergency_bypass_desc")}
						isEnabled={settings?.preferences.security?.emergencyBypass || false}
						onToggle={(enabled) =>
							handleSecurityToggle("emergencyBypass", enabled)
						}
						isLoading={isUpdating}
					/>

					<CustomButton
						title={t("settings.setup_emergency_access")}
						onClick={onEmergencyOpen}
						variant="outline"
						w="100%"
					/>
				</VStack>
			</SettingSection>

			{/* Device Management Modal */}
			<Modal isOpen={isDeviceOpen} onClose={onDeviceClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{t("settings.device_management")}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TableContainer>
							<Table size="sm">
								<Thead>
									<Tr>
										<Th>{t("settings.device")}</Th>
										<Th>{t("settings.location")}</Th>
										<Th>{t("settings.last_active")}</Th>
										<Th>{t("settings.actions")}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{mockDevices.map((device) => (
										<Tr key={device.id}>
											<Td>
												<VStack align="start" spacing={1}>
													<TextParagraph title={device.name} fontSize="sm" />
													<TextParagraph
														title={`${device.browser} on ${device.os}`}
														fontSize="xs"
														color="gray.500"
													/>
													<HStack>
														{device.current && (
															<Badge colorScheme="blue" size="sm">
																{t("settings.current")}
															</Badge>
														)}
														{device.trusted && (
															<Badge colorScheme="green" size="sm">
																{t("settings.trusted")}
															</Badge>
														)}
													</HStack>
												</VStack>
											</Td>
											<Td>
												<TextParagraph title={device.location} fontSize="sm" />
											</Td>
											<Td>
												<TextParagraph
													title={formatDate(device.lastActive)}
													fontSize="sm"
												/>
											</Td>
											<Td>
												<HStack>
													{!device.current && (
														<Tooltip label={t("settings.revoke_device")}>
															<IconButton
																aria-label="Revoke device"
																icon={<FiTrash2 />}
																size="sm"
																variant="ghost"
																colorScheme="red"
																onClick={() => handleRevokeDevice(device.id)}
															/>
														</Tooltip>
													)}
												</HStack>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" onClick={onDeviceClose}>
							{t("common.close")}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Activity Log Modal */}
			<Modal isOpen={isActivityOpen} onClose={onActivityClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{t("settings.activity_log")}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TableContainer>
							<Table size="sm">
								<Thead>
									<Tr>
										<Th>{t("settings.activity")}</Th>
										<Th>{t("settings.timestamp")}</Th>
										<Th>{t("settings.ip_address")}</Th>
										<Th>{t("settings.location")}</Th>
										<Th>{t("settings.status")}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{/* {mockActivityLog.map((activity) => (
										<Tr key={activity.id}>
											<Td>
												<TextParagraph
													title={activity.description}
													fontSize="sm"
												/>
											</Td>
											<Td>
												<TextParagraph
													title={formatDate(activity.timestamp)}
													fontSize="sm"
												/>
											</Td>
											<Td>
												<TextParagraph
													title={activity.ipAddress}
													fontSize="sm"
												/>
											</Td>
											<Td>
												<TextParagraph
													title={activity.location}
													fontSize="sm"
												/>
											</Td>
											<Td>
												<Badge
													colorScheme={getStatusColor(activity.status)}
													size="sm">
													{t(`settings.${activity.status}`)}
												</Badge>
											</Td>
										</Tr>
									))} */}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" onClick={onActivityClose}>
							{t("common.close")}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Emergency Access Modal */}
			<Modal isOpen={isEmergencyOpen} onClose={onEmergencyClose} size="md">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{t("settings.emergency_access_setup")}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<Alert status="warning" borderRadius="0">
								<AlertIcon />
								<AlertDescription>
									{t("settings.emergency_setup_warning")}
								</AlertDescription>
							</Alert>

							<FormControl>
								<FormLabel>{t("settings.emergency_contact_email")}</FormLabel>
								<Input
									type="email"
									placeholder={t("settings.emergency_email_placeholder")}
									variant="flushed"
									focusBorderColor={color}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>{t("settings.emergency_instructions")}</FormLabel>
								<Textarea
									placeholder={t("settings.emergency_instructions_placeholder")}
									variant="flushed"
									focusBorderColor={color}
								/>
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onEmergencyClose}>
							{t("common.cancel")}
						</Button>
						<CustomButton
							title={t("settings.setup_emergency")}
							bg={color}
							color={bg}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</VStack>
	);
};
