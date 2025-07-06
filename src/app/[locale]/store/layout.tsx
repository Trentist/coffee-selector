import React from "react";
import { Box } from "@chakra-ui/react";

export default function StoreLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Box>{children}</Box>;
}
