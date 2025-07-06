/**
 * Legal Pages Hooks - React Hooks للصفحات القانونية
 * Hooks لإدارة الصفحات القانونية في React components
 */

import { useState, useEffect, useCallback } from "react";
import {
	legalPagesService,
	LegalPageData,
	TermsPageData,
	RefundPageData,
} from "../services/legal-pages.service";

// ============================================================================
// USE LEGAL PAGES HOOK - Hook للصفحات القانونية
// ============================================================================

export interface UseLegalPagesOptions {
	lang?: string;
	autoLoad?: boolean;
}

export interface UseLegalPagesReturn {
	// Data
	terms: TermsPageData | null;
	privacy: LegalPageData | null;
	refund: RefundPageData | null;

	// Loading states
	loading: boolean;
	termsLoading: boolean;
	privacyLoading: boolean;
	refundLoading: boolean;

	// Error states
	error: string | null;
	termsError: string | null;
	privacyError: string | null;
	refundError: string | null;

	// Actions
	loadTerms: (lang?: string) => Promise<void>;
	loadPrivacy: (lang?: string) => Promise<void>;
	loadRefund: (lang?: string) => Promise<void>;
	loadAllPages: (lang?: string) => Promise<void>;
	refreshAll: () => Promise<void>;

	// Utilities
	availableLanguages: string[];
	legalPageTypes: string[];
}

export const useLegalPages = (
	options: UseLegalPagesOptions = {},
): UseLegalPagesReturn => {
	const { lang = "ar", autoLoad = true } = options;

	// State
	const [terms, setTerms] = useState<TermsPageData | null>(null);
	const [privacy, setPrivacy] = useState<LegalPageData | null>(null);
	const [refund, setRefund] = useState<RefundPageData | null>(null);

	const [loading, setLoading] = useState(false);
	const [termsLoading, setTermsLoading] = useState(false);
	const [privacyLoading, setPrivacyLoading] = useState(false);
	const [refundLoading, setRefundLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [termsError, setTermsError] = useState<string | null>(null);
	const [privacyError, setPrivacyError] = useState<string | null>(null);
	const [refundError, setRefundError] = useState<string | null>(null);

	// Load Terms and Conditions
	const loadTerms = useCallback(
		async (pageLang?: string) => {
			const targetLang = pageLang || lang;
			setTermsLoading(true);
			setTermsError(null);

			try {
				const data = await legalPagesService.getTermsPage(targetLang);
				setTerms(data);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load terms page";
				setTermsError(errorMessage);
				setError(errorMessage);
			} finally {
				setTermsLoading(false);
			}
		},
		[lang],
	);

	// Load Privacy Policy
	const loadPrivacy = useCallback(
		async (pageLang?: string) => {
			const targetLang = pageLang || lang;
			setPrivacyLoading(true);
			setPrivacyError(null);

			try {
				const data = await legalPagesService.getPrivacyPage(targetLang);
				setPrivacy(data);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load privacy page";
				setPrivacyError(errorMessage);
				setError(errorMessage);
			} finally {
				setPrivacyLoading(false);
			}
		},
		[lang],
	);

	// Load Refund Policy
	const loadRefund = useCallback(
		async (pageLang?: string) => {
			const targetLang = pageLang || lang;
			setRefundLoading(true);
			setRefundError(null);

			try {
				const data = await legalPagesService.getRefundPage(targetLang);
				setRefund(data);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load refund page";
				setRefundError(errorMessage);
				setError(errorMessage);
			} finally {
				setRefundLoading(false);
			}
		},
		[lang],
	);

	// Load all pages
	const loadAllPages = useCallback(
		async (pageLang?: string) => {
			const targetLang = pageLang || lang;
			setLoading(true);
			setError(null);

			try {
				const [termsData, privacyData, refundData] = await Promise.all([
					legalPagesService.getTermsPage(targetLang),
					legalPagesService.getPrivacyPage(targetLang),
					legalPagesService.getRefundPage(targetLang),
				]);

				setTerms(termsData);
				setPrivacy(privacyData);
				setRefund(refundData);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load legal pages";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[lang],
	);

	// Refresh all pages
	const refreshAll = useCallback(async () => {
		await loadAllPages();
	}, [loadAllPages]);

	// Auto-load on mount
	useEffect(() => {
		if (autoLoad) {
			loadAllPages();
		}
	}, [autoLoad, loadAllPages]);

	return {
		// Data
		terms,
		privacy,
		refund,

		// Loading states
		loading,
		termsLoading,
		privacyLoading,
		refundLoading,

		// Error states
		error,
		termsError,
		privacyError,
		refundError,

		// Actions
		loadTerms,
		loadPrivacy,
		loadRefund,
		loadAllPages,
		refreshAll,

		// Utilities
		availableLanguages: legalPagesService.getAvailableLanguages(),
		legalPageTypes: legalPagesService.getLegalPageTypes(),
	};
};

// ============================================================================
// USE TERMS PAGE HOOK - Hook لصفحة الشروط
// ============================================================================

export interface UseTermsPageReturn {
	data: TermsPageData | null;
	loading: boolean;
	error: string | null;
	loadTerms: (lang?: string) => Promise<void>;
	refresh: () => Promise<void>;
}

export const useTermsPage = (lang: string = "ar"): UseTermsPageReturn => {
	const [data, setData] = useState<TermsPageData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadTerms = useCallback(
		async (pageLang?: string) => {
			const targetLang = pageLang || lang;
			setLoading(true);
			setError(null);

			try {
				const termsData = await legalPagesService.getTermsPage(targetLang);
				setData(termsData);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load terms page";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[lang],
	);

	const refresh = useCallback(async () => {
		await loadTerms();
	}, [loadTerms]);

	useEffect(() => {
		loadTerms();
	}, [loadTerms]);

	return {
		data,
		loading,
		error,
		loadTerms,
		refresh,
	};
};

// ============================================================================
// USE PRIVACY PAGE HOOK - Hook لصفحة الخصوصية
// ============================================================================

export interface UsePrivacyPageReturn {
	data: LegalPageData | null;
	loading: boolean;
	error: string | null;
	loadPrivacy: (lang?: string) => Promise<void>;
	refresh: () => Promise<void>;
}

export const usePrivacyPage = (lang: string = "ar"): UsePrivacyPageReturn => {
	const [data, setData] = useState<LegalPageData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadPrivacy = useCallback(
		async (pageLang?: string) => {
			const targetLang = pageLang || lang;
			setLoading(true);
			setError(null);

			try {
				const privacyData = await legalPagesService.getPrivacyPage(targetLang);
				setData(privacyData);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load privacy page";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[lang],
	);

	const refresh = useCallback(async () => {
		await loadPrivacy();
	}, [loadPrivacy]);

	useEffect(() => {
		loadPrivacy();
	}, [loadPrivacy]);

	return {
		data,
		loading,
		error,
		loadPrivacy,
		refresh,
	};
};

// ============================================================================
// USE REFUND PAGE HOOK - Hook لصفحة الاسترجاع
// ============================================================================

export interface UseRefundPageReturn {
	data: RefundPageData | null;
	loading: boolean;
	error: string | null;
	loadRefund: (lang?: string) => Promise<void>;
	refresh: () => Promise<void>;
}

export const useRefundPage = (lang: string = "ar"): UseRefundPageReturn => {
	const [data, setData] = useState<RefundPageData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadRefund = useCallback(
		async (pageLang?: string) => {
			const targetLang = pageLang || lang;
			setLoading(true);
			setError(null);

			try {
				const refundData = await legalPagesService.getRefundPage(targetLang);
				setData(refundData);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load refund page";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[lang],
	);

	const refresh = useCallback(async () => {
		await loadRefund();
	}, [loadRefund]);

	useEffect(() => {
		loadRefund();
	}, [loadRefund]);

	return {
		data,
		loading,
		error,
		loadRefund,
		refresh,
	};
};
