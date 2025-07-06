/**
 * Redux Store Provider Component
 * مكون مزود Redux Store
 */

"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode } from "react";
import { store, persistor } from "@/store";

interface StoreProviderWrapperProps {
	children: ReactNode;
}

export const StoreProviderWrapper = ({
	children,
}: StoreProviderWrapperProps) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	);
};

export default StoreProviderWrapper;