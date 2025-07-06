/**
 * Location Provider Component
 * مكون مزود نظام تحديد الموقع
 */

"use client";

import { ReactNode, createContext, useContext, useMemo, useState } from "react";

interface LocationContextType {
	location: {
		country: string;
		city: string;
		region: string;
		timezone: string;
	};
	setLocation: (location: any) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
	undefined,
);

interface LocationProviderWrapperProps {
	children: ReactNode;
}

export const LocationProviderWrapper = ({
	children,
}: LocationProviderWrapperProps) => {
	const [location, setLocation] = useState({
		country: "SA",
		city: "Riyadh",
		region: "Riyadh",
		timezone: "Asia/Riyadh",
	});
	const [isLoading, setIsLoading] = useState(false);

	const value = useMemo(
		() => ({
			location,
			setLocation,
			isLoading,
			setIsLoading,
		}),
		[location, isLoading],
	);

	return (
		<LocationContext.Provider value={value}>
			{children}
		</LocationContext.Provider>
	);
};

// Custom hook to use location context
export const useLocation = () => {
	const context = useContext(LocationContext);
	if (context === undefined) {
		throw new Error("useLocation must be used within LocationProvider");
	}
	return context;
};

export default LocationProviderWrapper;
