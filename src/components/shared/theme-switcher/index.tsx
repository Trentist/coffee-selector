"use client";

import React from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";

interface ThemeSwitcherProps {
	color?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ color }) => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<IconButton
			aria-label="تبديل المظهر"
			icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
			onClick={toggleColorMode}
			variant="ghost"
			size="sm"
			color={color}
		/>
	);
};

export default ThemeSwitcher;
