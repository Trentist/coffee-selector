/**
 * Performance Provider Component
 * مكون مزود محسن للأداء
 */

"use client";

import { ReactNode, memo, useMemo, useCallback } from "react";

interface PerformanceProviderWrapperProps {
	children: ReactNode;
}

// Memoized wrapper to prevent unnecessary re-renders
const MemoizedChildren = memo(({ children }: { children: ReactNode }) => {
	return <>{children}</>;
});

MemoizedChildren.displayName = "MemoizedChildren";

export const PerformanceProviderWrapper = ({
	children,
}: PerformanceProviderWrapperProps) => {
	// Memoize children to prevent unnecessary re-renders
	const memoizedChildren = useMemo(() => children, [children]);

	// Memoize callback functions
	const handleError = useCallback((error: Error) => {
		console.error("Performance provider error:", error);
	}, []);

	return (
		<div data-performance-provider="true">
			<MemoizedChildren>{memoizedChildren}</MemoizedChildren>
		</div>
	);
};

export default PerformanceProviderWrapper;
