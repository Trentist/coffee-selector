/**
 * Services Index - ملف التصدير الرئيسي للخدمات
 * تصدير جميع الخدمات المتاحة في النظام الموحد
 */

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export {
	ProductService,
	productService,
	useProductService,
	apolloClient,
} from "./product-service";

// ============================================================================
// DISPLAY SERVICE
// ============================================================================

export {
	DisplayService,
	displayService,
	useDisplayService,
	displayApolloClient,
} from "./display-service";

// ============================================================================
// LEGAL PAGES SERVICE
// ============================================================================

export {
	LegalPagesService,
	legalPagesService,
	LegalPageData,
	TermsPageData,
	RefundPageData,
} from "./legal-pages.service";

// ============================================================================
// LEGAL PAGES SERVICE
// ============================================================================

export {
	LegalPagesService,
	legalPagesService,
	LegalPageData,
	TermsPageData,
	RefundPageData,
} from "./legal-pages.service";

// ============================================================================
// SERVICE TYPES
// ============================================================================

export type { ProductService as IProductService } from "./product-service";
export type { DisplayService as IDisplayService } from "./display-service";
export type { LegalPagesService as ILegalPagesService } from "./legal-pages.service";

// ============================================================================
// SERVICE CONFIGURATION
// ============================================================================

export const SERVICE_CONFIG = {
	API_TIMEOUT: 30000,
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000,
	CACHE_TTL: 3600,
	BATCH_SIZE: 50,
};

// ============================================================================
// SERVICE UTILITIES
// ============================================================================

/**
 * Create service with custom configuration
 * إنشاء خدمة بإعدادات مخصصة
 */
export const createService = (config?: Partial<typeof SERVICE_CONFIG>) => {
	const serviceConfig = { ...SERVICE_CONFIG, ...config };
	return {
		config: serviceConfig,
		productService: new (require("./product-service").ProductService)(),
		displayService: new (require("./display-service").DisplayService)(),
		legalPagesService:
			new (require("./legal-pages.service").LegalPagesService)(),
	};
};

/**
 * Service error handler
 * معالج أخطاء الخدمات
 */
export const handleServiceError = (error: any, serviceName: string) => {
	console.error(`[${serviceName}] Service Error:`, error);

	if (error.graphQLErrors) {
		return {
			success: false,
			error: error.graphQLErrors[0]?.message || "GraphQL Error",
			details: error.graphQLErrors,
		};
	}

	if (error.networkError) {
		return {
			success: false,
			error: "Network Error",
			details: error.networkError,
		};
	}

	return {
		success: false,
		error: error.message || "Unknown Error",
		details: error,
	};
};

/**
 * Service response wrapper
 * غلاف استجابة الخدمة
 */
export const wrapServiceResponse = <T>(
	data: T,
	success: boolean = true,
	error?: string,
) => {
	return {
		success,
		data: success ? data : undefined,
		error: !success ? error : undefined,
		timestamp: new Date().toISOString(),
	};
};

// ============================================================================
// SERVICE VALIDATION
// ============================================================================

/**
 * Validate service configuration
 * التحقق من صحة إعدادات الخدمة
 */
export const validateServiceConfig = () => {
	const requiredEnvVars = [
		"NEXT_PUBLIC_ODOO_GRAPHQL_URL",
		"NEXT_PUBLIC_ODOO_API_KEY",
	];

	const missingVars = requiredEnvVars.filter(
		(varName) => !process.env[varName],
	);

	if (missingVars.length > 0) {
		console.warn(`Missing environment variables: ${missingVars.join(", ")}`);
		return false;
	}

	return true;
};

/**
 * Service health check
 * فحص صحة الخدمة
 */
export const checkServiceHealth = async () => {
	try {
		const { productService, displayService } = await import(
			"./product-service"
		);
		const { legalPagesService } = await import("./legal-pages.service");

		const result = await productService.getProducts(1, 1);
		const displayResult = await displayService.getAllProducts();
		const legalResult = await legalPagesService.getTermsPage("ar");

		return {
			healthy: result.success && displayResult.success && !!legalResult,
			message:
				result.success && displayResult.success && !!legalResult
					? "All services healthy"
					: "Service issues detected",
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		return {
			healthy: false,
			message: "Service health check failed",
			error: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};
	}
};
