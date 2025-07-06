/**
 * Menu Provider Component
 * مكون مزود القوائم
 */

"use client";

import { ReactNode, createContext, useContext, useState, useMemo } from "react";

interface MenuContextType {
	isMainMenuOpen: boolean;
	setIsMainMenuOpen: (open: boolean) => void;
	isCartMenuOpen: boolean;
	setIsCartMenuOpen: (open: boolean) => void;
	isFavoritesMenuOpen: boolean;
	setIsFavoritesMenuOpen: (open: boolean) => void;
	activeMenuItem: string;
	setActiveMenuItem: (item: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderWrapperProps {
	children: ReactNode;
}

export const MenuProviderWrapper = ({ children }: MenuProviderWrapperProps) => {
	const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
	const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
	const [isFavoritesMenuOpen, setIsFavoritesMenuOpen] = useState(false);
	const [activeMenuItem, setActiveMenuItem] = useState("");

	const value = useMemo(
		() => ({
			isMainMenuOpen,
			setIsMainMenuOpen,
			isCartMenuOpen,
			setIsCartMenuOpen,
			isFavoritesMenuOpen,
			setIsFavoritesMenuOpen,
			activeMenuItem,
			setActiveMenuItem,
		}),
		[isMainMenuOpen, isCartMenuOpen, isFavoritesMenuOpen, activeMenuItem],
	);

	return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

// Custom hook to use menu context
export const useMenu = () => {
	const context = useContext(MenuContext);
	if (context === undefined) {
		throw new Error("useMenu must be used within MenuProvider");
	}
	return context;
};

export default MenuProviderWrapper;
