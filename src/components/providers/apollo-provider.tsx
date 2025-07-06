/**
 * Apollo Provider Component
 * مكون مزود Apollo
 */

"use client";

import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import { apolloClient, unifiedOdooService } from "@/odoo-schema-full";
import { useEffect, useState } from "react";

interface ApolloProviderWrapperProps {
	children: ReactNode;
}

export const ApolloProviderWrapper = ({
	children,
}: ApolloProviderWrapperProps) => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function initializeSystem() {
			try {
				console.log("🚀 Initializing Coffee Selection Central System...");
				const success = await unifiedOdooService.initialize();

				if (success) {
					console.log("✅ Central System initialized successfully");
					setIsInitialized(true);
				} else {
					console.error("❌ Failed to initialize Central System");
					setError("Failed to initialize system");
				}
			} catch (err) {
				console.error("💥 Error initializing Central System:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
			}
		}

		initializeSystem();

		// Cleanup on unmount
		return () => {
			unifiedOdooService.shutdown();
		};
	}, []);

	if (error) {
		return (
			<div className="error-container">
				<h2>System Initialization Error</h2>
				<p>{error}</p>
				<button onClick={() => window.location.reload()}>Retry</button>
			</div>
		);
	}

	if (!isInitialized) {
		return (
			<div className="loading-container">
				<h2>Initializing System...</h2>
				<p>Please wait while we set up the application.</p>
			</div>
		);
	}

	return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
