/**
 * Footer Provider Component
 * مكون مزود الفوتر
 */

"use client";

import { ReactNode, createContext, useContext, useState, useMemo } from "react";

interface FooterContextType {
	isNewsletterOpen: boolean;
	setIsNewsletterOpen: (open: boolean) => void;
	isContactFormOpen: boolean;
	setIsContactFormOpen: (open: boolean) => void;
	activeFooterSection: string;
	setActiveFooterSection: (section: string) => void;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

interface FooterProviderWrapperProps {
	children: ReactNode;
}

export const FooterProviderWrapper = ({
	children,
}: FooterProviderWrapperProps) => {
	const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
	const [isContactFormOpen, setIsContactFormOpen] = useState(false);
	const [activeFooterSection, setActiveFooterSection] = useState("");

	const value = useMemo(
		() => ({
			isNewsletterOpen,
			setIsNewsletterOpen,
			isContactFormOpen,
			setIsContactFormOpen,
			activeFooterSection,
			setActiveFooterSection,
		}),
		[isNewsletterOpen, isContactFormOpen, activeFooterSection]
	);

	return (
		<FooterContext.Provider value={value}>
			{children}
		</FooterContext.Provider>
	);
};

// Custom hook to use footer context
export const useFooter = () => {
	const context = useContext(FooterContext);
	if (context === undefined) {
		throw new Error("useFooter must be used within FooterProvider");
	}
	return context;
};

export default FooterProviderWrapper;
