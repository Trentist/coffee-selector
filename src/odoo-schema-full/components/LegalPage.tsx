"use client";
"use client";

/**
 * Legal Page Component - مكون الصفحة القانونية
 * مكون React لعرض الصفحات القانونية (شروط الاستخدام، الخصوصية، الاسترجاع)
 */

import React from "react";
import {
	useLegalPages,
	useTermsPage,
	usePrivacyPage,
	useRefundPage,
} from "../hooks/useLegalPages";

// ============================================================================
// LEGAL PAGE COMPONENT - مكون الصفحة القانونية
// ============================================================================

interface LegalPageProps {
	type: "terms" | "privacy" | "refund";
	lang?: string;
	className?: string;
	showTitle?: boolean;
	showLastUpdated?: boolean;
	showContactInfo?: boolean;
}

export const LegalPage: React.FC<LegalPageProps> = ({
	type,
	lang = "ar",
	className = "",
	showTitle = true,
	showLastUpdated = true,
	showContactInfo = true,
}) => {
	const { terms, privacy, refund, loading, error } = useLegalPages({
		lang,
		autoLoad: true,
	});

	if (loading) {
		return (
			<div className={`legal-page-loading ${className}`}>
				<div className="loading-spinner">جاري التحميل...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`legal-page-error ${className}`}>
				<div className="error-message">خطأ في تحميل الصفحة: {error}</div>
			</div>
		);
	}

	let pageData = null;
	let pageTitle = "";

	switch (type) {
		case "terms":
			pageData = terms;
			pageTitle = "شروط وأحكام الاستخدام";
			break;
		case "privacy":
			pageData = privacy;
			pageTitle = "سياسة الخصوصية";
			break;
		case "refund":
			pageData = refund;
			pageTitle = "سياسة الاسترجاع والاستبدال";
			break;
		default:
			return <div className="error-message">نوع صفحة غير معروف</div>;
	}

	if (!pageData) {
		return (
			<div className={`legal-page-not-found ${className}`}>
				<div className="not-found-message">الصفحة غير متوفرة</div>
			</div>
		);
	}

	return (
		<div className={`legal-page ${className}`}>
			{showTitle && (
				<div className="legal-page-header">
					<h1 className="legal-page-title">{pageData.title}</h1>
					{pageData.description && (
						<p className="legal-page-description">{pageData.description}</p>
					)}
				</div>
			)}

			<div className="legal-page-content">
				<div
					className="legal-page-html-content"
					dangerouslySetInnerHTML={{ __html: pageData.content }}
				/>
			</div>

			{showLastUpdated && (
				<div className="legal-page-footer">
					<div className="legal-page-meta">
						<p className="last-updated">آخر تحديث: {pageData.lastUpdated}</p>
						<p className="effective-date">
							تاريخ السريان: {pageData.effectiveDate}
						</p>
						{type === "terms" && "governingLaw" in pageData && (
							<p className="governing-law">
								القانون المطبق: {pageData.governingLaw}
							</p>
						)}
						{type === "refund" && "returnPeriod" in pageData && (
							<div className="refund-info">
								<p className="return-period">
									فترة الاسترجاع: {pageData.returnPeriod}
								</p>
								<p className="processing-time">
									وقت المعالجة: {pageData.processingTime}
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{showContactInfo && pageData.contactInfo && (
				<div className="legal-page-contact">
					<h3 className="contact-title">معلومات التواصل</h3>
					<div className="contact-info">
						<p className="contact-email">
							البريد الإلكتروني: {pageData.contactInfo.email}
						</p>
						<p className="contact-phone">
							الهاتف: {pageData.contactInfo.phone}
						</p>
						<p className="contact-address">
							العنوان: {pageData.contactInfo.address}
						</p>
						{pageData.contactInfo.workingHours && (
							<p className="contact-hours">
								ساعات العمل: {pageData.contactInfo.workingHours}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

// ============================================================================
// TERMS PAGE COMPONENT - مكون صفحة الشروط
// ============================================================================

interface TermsPageProps {
	lang?: string;
	className?: string;
	showTitle?: boolean;
	showLastUpdated?: boolean;
	showContactInfo?: boolean;
}

export const TermsPage: React.FC<TermsPageProps> = (props) => {
	return <LegalPage type="terms" {...props} />;
};

// ============================================================================
// PRIVACY PAGE COMPONENT - مكون صفحة الخصوصية
// ============================================================================

interface PrivacyPageProps {
	lang?: string;
	className?: string;
	showTitle?: boolean;
	showLastUpdated?: boolean;
	showContactInfo?: boolean;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = (props) => {
	return <LegalPage type="privacy" {...props} />;
};

// ============================================================================
// REFUND PAGE COMPONENT - مكون صفحة الاسترجاع
// ============================================================================

interface RefundPageProps {
	lang?: string;
	className?: string;
	showTitle?: boolean;
	showLastUpdated?: boolean;
	showContactInfo?: boolean;
}

export const RefundPage: React.FC<RefundPageProps> = (props) => {
	return <LegalPage type="refund" {...props} />;
};

// ============================================================================
// LEGAL PAGES NAVIGATION - تنقل الصفحات القانونية
// ============================================================================

interface LegalPagesNavigationProps {
	lang?: string;
	className?: string;
	onPageChange?: (type: "terms" | "privacy" | "refund") => void;
	activePage?: "terms" | "privacy" | "refund";
}

export const LegalPagesNavigation: React.FC<LegalPagesNavigationProps> = ({
	lang = "ar",
	className = "",
	onPageChange,
	activePage = "terms",
}) => {
	const { availableLanguages, legalPageTypes } = useLegalPages({
		lang,
		autoLoad: false,
	});

	const pageLabels = {
		terms: "شروط الاستخدام",
		privacy: "سياسة الخصوصية",
		refund: "سياسة الاسترجاع",
	};

	return (
		<div className={`legal-pages-navigation ${className}`}>
			<nav className="legal-nav">
				{legalPageTypes.map((type) => (
					<button
						key={type}
						className={`legal-nav-item ${activePage === type ? "active" : ""}`}
						onClick={() =>
							onPageChange?.(type as "terms" | "privacy" | "refund")
						}>
						{pageLabels[type as keyof typeof pageLabels]}
					</button>
				))}
			</nav>
		</div>
	);
};

// ============================================================================
// LEGAL PAGES CONTAINER - حاوية الصفحات القانونية
// ============================================================================

interface LegalPagesContainerProps {
	lang?: string;
	className?: string;
	showNavigation?: boolean;
	defaultPage?: "terms" | "privacy" | "refund";
}

export const LegalPagesContainer: React.FC<LegalPagesContainerProps> = ({
	lang = "ar",
	className = "",
	showNavigation = true,
	defaultPage = "terms",
}) => {
	const [activePage, setActivePage] = React.useState<
		"terms" | "privacy" | "refund"
	>(defaultPage);

	return (
		<div className={`legal-pages-container ${className}`}>
			{showNavigation && (
				<LegalPagesNavigation
					lang={lang}
					activePage={activePage}
					onPageChange={setActivePage}
				/>
			)}

			<div className="legal-page-content-wrapper">
				<LegalPage
					type={activePage}
					lang={lang}
					showTitle={true}
					showLastUpdated={true}
					showContactInfo={true}
				/>
			</div>
		</div>
	);
};
