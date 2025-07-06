/**
 * Main App Provider Component
 * المزود الرئيسي للتطبيق مع ترتيب محسن للأداء
 */

"use client";

import { ReactNode, Suspense } from "react";
import { Spinner, Center } from "@chakra-ui/react";

// Import providers directly instead of lazy loading
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { ChakraProviderWrapper } from "./chakra-provider";
import { StoreProviderWrapper } from "./store-provider";
import { ApolloProviderWrapper } from "./apollo-provider";
import { TranslationProviderWrapper } from "./translation-provider";
import { CurrencyProviderWrapper } from "./currency-provider";
import { LocationProviderWrapper } from "./location-provider";
import { RealTimeProvider } from "../realtime/RealTimeProvider";
import { NavbarProviderWrapper } from "./navbar-provider";
import { MenuProviderWrapper } from "./menu-provider";
import { FooterProviderWrapper } from "./footer-provider";
import { LayoutProviderWrapper } from "./layout-provider";
import { PerformanceProviderWrapper } from "./performance-provider";

interface AppProviderWrapperProps {
	children: ReactNode;
	locale?: string;
	messages?: any;
}

// Loading component for providers
const ProviderLoader = () => (
	<Center minH="100vh">
		<Spinner size="xl" color="blue.500" />
	</Center>
);

export const AppProviderWrapper = ({
	children,
	locale = "ar",
	messages = {},
}: AppProviderWrapperProps) => {
	return (
		<Suspense fallback={<ProviderLoader />}>
			<ErrorBoundaryProvider>
				<ChakraProviderWrapper>
					<StoreProviderWrapper>
						<ApolloProviderWrapper>
							<TranslationProviderWrapper
								locale={locale}
								messages={messages as any}>
								<CurrencyProviderWrapper>
									<LocationProviderWrapper>
										<RealTimeProvider
											autoConnect={true}
											autoAuthenticate={false}
											channels={["orders", "inventory", "notifications"]}
											onConnect={(connection) => {
												console.log("🔗 Real-time connected:", connection);
											}}
											onEvent={(message) => {
												console.log("📨 Real-time event:", message);
											}}
											onError={(error) => {
												console.error("❌ Real-time error:", error);
											}}>
											<NavbarProviderWrapper>
												<MenuProviderWrapper>
													<FooterProviderWrapper>
														<LayoutProviderWrapper>
															<PerformanceProviderWrapper>
																<h1>App Provider</h1>
																{children}
															</PerformanceProviderWrapper>
														</LayoutProviderWrapper>
													</FooterProviderWrapper>
												</MenuProviderWrapper>
											</NavbarProviderWrapper>
										</RealTimeProvider>
									</LocationProviderWrapper>
								</CurrencyProviderWrapper>
							</TranslationProviderWrapper>
						</ApolloProviderWrapper>
					</StoreProviderWrapper>
				</ChakraProviderWrapper>
			</ErrorBoundaryProvider>
		</Suspense>
	);
};

export default AppProviderWrapper;
