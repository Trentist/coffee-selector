/**
 * Chakra UI Provider Component
 * مكون مزود Chakra UI الأساسي
 */

"use client";

import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import { theme } from "@/theme";

// Create standalone toast for better performance
const { ToastContainer } = createStandaloneToast();

interface ChakraProviderWrapperProps {
	children: ReactNode;
}

export const ChakraProviderWrapper = ({
	children,
}: ChakraProviderWrapperProps) => {
	// Memoize theme to prevent unnecessary re-renders
	const memoizedTheme = useMemo(() => theme, []);

	return (
		<ChakraProvider theme={memoizedTheme}>
			{children}
			<ToastContainer />
		</ChakraProvider>
	);
};

export default ChakraProviderWrapper;
