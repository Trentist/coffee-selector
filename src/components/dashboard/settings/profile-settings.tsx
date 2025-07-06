import {
	Box,
	Flex,
	Input,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
	useToast,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { User } from "next-auth";
import { TextH5, TextH6, TextLabel } from "@/components/ui/custom-text";
import CustomButton from "@/components/ui/custom-button";
import Icons from "../ui/icons";
import { useLocale } from "@/components/ui/useLocale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { unifiedOdooService } from "@/odoo-schema-full";

/**
 * ProfileSettings Component (Client Component)
 *
 * This component handles the user profile settings form.
 * It includes input fields for first name, last name, and email.
 * It also handles form submission and updates the user's profile data.
 */

// مخطط التحقق من صحة النموذج
const profileSchema = z.object({
	email: z.string().email("auth.invalid_email"),
	firstName: z.string().min(2, "profile.first_name_required"),
	lastName: z.string().min(2, "profile.last_name_required"),
	phone: z.string().optional(),
	company: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettings({
	RemoveAddress,
	title,
	sub_title,
	user,
}: {
	RemoveAddress?: boolean;
	title?: string;
	sub_title?: string;
	user?: User;
}) {
	const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
	const bg = useColorModeValue("#fff", "#0D1616");
	const color = useColorModeValue("#0D1616", "#fff");
	const { t } = useLocale();
	const toast = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			email: user?.email || "",
			firstName: user?.name?.split(" ")[0] || "",
			lastName: user?.name?.split(" ")[1] || "",
		},
	});

	const onSubmit = async (data: ProfileFormData) => {
		setIsLoading(true);
		try {
			// Profile update functionality - using localStorage as fallback
			const profileData = {
				email: data.email,
				name: `${data.firstName} ${data.lastName}`,
				phone: data.phone,
				company: data.company,
				updatedAt: new Date().toISOString(),
			};

			// Store in localStorage for now
			localStorage.setItem(
				`user_profile_${user?.id || "guest"}`,
				JSON.stringify(profileData),
			);

			// In a real implementation, this would call the appropriate Odoo endpoint
			// const response = await fetch('/api/update-profile', { method: 'POST', body: JSON.stringify(profileData) });

			// Simulate a delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: t("profile.update_success"),
				description: t("profile.changes_saved"),
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			// تحديث البيانات المحلية
			reset(data);
		} catch (error) {
			toast({
				title: t("profile.update_error"),
				description:
					error instanceof Error ? error.message : t("profile.generic_error"),
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box
			// h="100%"
			w="100%"
			// bg={bg}
			// color={color}
			p={{ base: ".4rem", md: "1rem" }}
			py={{ base: ".5rem", md: "1rem" }}>
			<Flex
				alignItems="center"
				justifyContent={"space-between"}
				w="100%"
				h="80px"
				my="1rem">
				<Flex alignItems="center" gap={{ base: ".7rem", md: "2rem" }}>
					<Stack>
						<Icons />
					</Stack>
					<Stack gap="-1rem">
						{/*  */}
						<TextH6 title={user?.name || t("user_name")} />
						{/*  */}
						<TextLabel title={user?.email || ""} />
					</Stack>
				</Flex>
				{RemoveAddress && (
					<Flex
						onClick={() => {}}
						gap="1rem"
						alignItems="center"
						cursor={"pointer"}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="21"
							viewBox="0 0 20 21"
							fill="none">
							<path
								d="M2 6.5H18V19.5C18 19.7652 17.8946 20.0196 17.7071 20.2071C17.5196 20.3946 17.2652 20.5 17 20.5H3C2.73478 20.5 2.48043 20.3946 2.29289 20.2071C2.10536 20.0196 2 19.7652 2 19.5V6.5ZM5 3.5V1.5C5 1.23478 5.10536 0.98043 5.29289 0.792893C5.48043 0.605357 5.73478 0.5 6 0.5H14C14.2652 0.5 14.5196 0.605357 14.7071 0.792893C14.8946 0.98043 15 1.23478 15 1.5V3.5H20V5.5H0V3.5H5ZM7 2.5V3.5H13V2.5H7ZM7 10.5V16.5H9V10.5H7ZM11 10.5V16.5H13V10.5H11Z"
								fill={color}
							/>
						</svg>
						<Text
							textTransform={"capitalize"}
							fontSize="10px"
							fontWeight="400"
							lineHeight={"15px"}
							color={color}
							w="50px">
							{RemoveAddress}
						</Text>
					</Flex>
				)}
			</Flex>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormControl isInvalid={!!errors.email}>
					<FormLabel>{t("email")}</FormLabel>
					<Input
						{...register("email")}
						type="email"
						_placeholder={{
							color: "#949494",
						}}
						variant="flushed"
						placeholder={t("input.email")}
						p="20px 17px 9px 17px"
						color={color}
						my=".4rem"
						focusBorderColor={color}
						_focusVisible={{
							borderColor: color,
						}}
					/>
					<FormErrorMessage>
						{errors.email?.message && t(errors.email.message)}
					</FormErrorMessage>
				</FormControl>

				<Flex
					alignItems={"center"}
					justifyContent={"space-between"}
					w="100%"
					gap="1rem">
					<FormControl isInvalid={!!errors.firstName}>
						<FormLabel>{t("first_name")}</FormLabel>
						<Input
							{...register("firstName")}
							_placeholder={{
								color: "#949494",
							}}
							variant="flushed"
							placeholder={t("input.first_name")}
							p="20px 17px 9px 17px"
							color={color}
							my=".4rem"
							focusBorderColor={color}
							_focusVisible={{
								borderColor: color,
							}}
						/>
						<FormErrorMessage>
							{errors.firstName?.message && t(errors.firstName.message)}
						</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={!!errors.lastName}>
						<FormLabel>{t("last_name")}</FormLabel>
						<Input
							{...register("lastName")}
							_placeholder={{
								color: "#949494",
							}}
							variant="flushed"
							placeholder={t("input.last_name")}
							p="20px 17px 9px 17px"
							color={color}
							my=".4rem"
							focusBorderColor={color}
							_focusVisible={{
								borderColor: color,
							}}
						/>
						<FormErrorMessage>
							{errors.lastName?.message && t(errors.lastName.message)}
						</FormErrorMessage>
					</FormControl>
				</Flex>

				<Flex alignItems="center" justifyContent={"end"} w="100%" mt=".6rem">
					<CustomButton
						onClick={handleSubmit(onSubmit)}
						title={t("done")}
						icon={<FaCheck size="1.5rem" />}
						isLoading={isLoading}
						w="100%"
					/>
				</Flex>
			</form>
		</Box>
	);
}
