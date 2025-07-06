/**
 * Error Boundary Provider Component
 * مكون مزود معالجة الأخطاء
 */

"use client";

import { ReactNode, Component, ErrorInfo } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProviderProps {
	children: ReactNode;
}

class ErrorBoundary extends Component<
	ErrorBoundaryProviderProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProviderProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
		// Here you can log to error reporting service
	}

	render() {
		if (this.state.hasError) {
			return (
				<Box
					p={8}
					textAlign="center"
					minH="100vh"
					display="flex"
					alignItems="center"
					justifyContent="center">
					<VStack spacing={4}>
						<Text fontSize="xl" fontWeight="bold">
							حدث خطأ غير متوقع
						</Text>
						<Text color="gray.600">يرجى تحديث الصفحة أو المحاولة مرة أخرى</Text>
						<Button colorScheme="blue" onClick={() => window.location.reload()}>
							تحديث الصفحة
						</Button>
					</VStack>
				</Box>
			);
		}

		return this.props.children;
	}
}

export const ErrorBoundaryProvider = ({
	children,
}: ErrorBoundaryProviderProps) => {
	return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default ErrorBoundaryProvider;
