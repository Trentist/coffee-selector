/**
 * Dashboard Content Component
 * مكون محتوى لوحة التحكم
 */

"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
// import { motion, React.Fragment } from "framer-motion";
import { User } from "./types/dashboard.types";
import DashboardOverview from "./sections/DashboardOverview";
import OrdersSection from "./sections/OrdersSection";
import InvoicesSection from "./sections/InvoicesSection";
import OrderTrackingSection from "./sections/OrderTrackingSection";
import WishlistSection from "./sections/WishlistSection";
import AddressesSection from "./sections/AddressesSection";
import ProfileSection from "./sections/ProfileSection";
import SettingsSection from "./sections/SettingsSection";

const MotionBox = Box;

interface DashboardContentProps {
	activeSection: string;
	user: User | null;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
	activeSection,
	user,
}) => {
	const renderSection = () => {
		switch (activeSection) {
			case "overview":
				return <DashboardOverview />;
			case "orders":
				return <OrdersSection />;
			case "invoices":
				return <InvoicesSection />;
			case "tracking":
				return <OrderTrackingSection />;
			case "wishlist":
				return <WishlistSection />;
			case "addresses":
				return <AddressesSection />;
			case "profile":
				return <ProfileSection user={user} />;
			case "settings":
				return <SettingsSection />;
			default:
				return <DashboardOverview />;
		}
	};

	return (
		<React.Fragment mode="wait">
			<MotionBox
				key={activeSection}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				w="100%">
				{renderSection()}
			</MotionBox>
		</React.Fragment>
	);
};

export default DashboardContent;