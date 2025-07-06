"use client";

import React from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const Lang: React.FC = () => {
	return (
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={<ChevronDownIcon />}
				size="sm"
				variant="ghost">
				العربية
			</MenuButton>
			<MenuList>
				<MenuItem>العربية</MenuItem>
				<MenuItem>English</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default Lang;
