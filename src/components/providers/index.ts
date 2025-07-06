/**
 * Providers Index File
 * ملف التصدير الرئيسي للمزودين
 */

// Main app provider
export { default as AppProviderWrapper } from "./app-provider";

// Core providers
export { default as ChakraProviderWrapper } from "./chakra-provider";
export { default as StoreProviderWrapper } from "./store-provider";
export { default as ApolloProviderWrapper } from "./apollo-provider";
export { default as TranslationProviderWrapper } from "./translation-provider";
export { default as ErrorBoundaryProvider } from "./error-boundary-provider";

// Feature providers
export {
	default as CurrencyProviderWrapper,
	useCurrency,
} from "./currency-provider";
export {
	default as LocationProviderWrapper,
	useLocation,
} from "./location-provider";

// Layout providers
export { default as LayoutProviderWrapper } from "./layout-provider";
export { default as NavbarProviderWrapper, useNavbar } from "./navbar-provider";
export { default as MenuProviderWrapper, useMenu } from "./menu-provider";
export { default as FooterProviderWrapper, useFooter } from "./footer-provider";

// Performance provider
export { default as PerformanceProviderWrapper } from "./performance-provider";

// Provider types
export type { AppProviderWrapperProps } from "./app-provider";
