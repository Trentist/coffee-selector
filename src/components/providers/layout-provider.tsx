/**
 * Layout Provider Component
 * مكون مزود تخطيط التطبيق
 */

"use client";

import { ReactNode, useState, useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { NavbarApp } from "@/components/shared/navbar-app";
import { FooterApp } from "@/components/shared/footer-app";

interface LayoutProviderWrapperProps {
	children: ReactNode;
	showNavbar?: boolean;
	showFooter?: boolean;
}

export const LayoutProviderWrapper = ({
	children,
	showNavbar = true,
	showFooter = true,
}: LayoutProviderWrapperProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Memoize layout components for better performance
	const navbarComponent = useMemo(() => {
		if (!showNavbar) return null;
		return (
			<NavbarApp
				isMenuOpen={isMenuOpen}
				onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
			/>
		);
	}, [showNavbar, isMenuOpen]);

	const footerComponent = useMemo(() => {
		if (!showFooter) return null;
		return <FooterApp />;
	}, [showFooter]);

	return (
		<Flex direction="column" minH="100vh">
			{navbarComponent}
			<Box flex="1" as="main">
				<h1>Layout Provider</h1>
				{children}
			</Box>
			{footerComponent}
		</Flex>
	);
};

export default LayoutProviderWrapper;
