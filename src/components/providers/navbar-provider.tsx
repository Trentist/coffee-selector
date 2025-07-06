/**
 * Navbar Provider Component
 * مكون مزود النافبار
 */

"use client";

import { ReactNode, createContext, useContext, useState, useMemo } from "react";

interface NavbarContextType {
	isMenuOpen: boolean;
	setIsMenuOpen: (open: boolean) => void;
	isScrolled: boolean;
	setIsScrolled: (scrolled: boolean) => void;
	activeSection: string;
	setActiveSection: (section: string) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

interface NavbarProviderWrapperProps {
	children: ReactNode;
}

export const NavbarProviderWrapper = ({
	children,
}: NavbarProviderWrapperProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState("home");

	const value = useMemo(
		() => ({
			isMenuOpen,
			setIsMenuOpen,
			isScrolled,
			setIsScrolled,
			activeSection,
			setActiveSection,
		}),
		[isMenuOpen, isScrolled, activeSection],
	);

	return (
		<NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
	);
};

// Custom hook to use navbar context
export const useNavbar = () => {
	const context = useContext(NavbarContext);
	if (context === undefined) {
		throw new Error("useNavbar must be used within NavbarProvider");
	}
	return context;
};

export default NavbarProviderWrapper;
