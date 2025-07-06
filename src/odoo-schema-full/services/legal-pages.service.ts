/**
 * Legal Pages Service - خدمة الصفحات القانونية
 * خدمة لإدارة الصفحات القانونية (شروط الاستخدام، الخصوصية، الاسترجاع)
 */

// ============================================================================
// LEGAL PAGES DATA - بيانات الصفحات القانونية
// ============================================================================

const LEGAL_PAGES_DATA = {
	ar: {
		terms: {
			id: "terms-ar",
			title: "شروط وأحكام الاستخدام",
			description: "شروط وأحكام استخدام موقع Coffee Selection",
			content: `
        <h1>شروط وأحكام الاستخدام</h1>

        <h2>1. مقدمة</h2>
        <p>مرحباً بكم في موقع Coffee Selection. باستخدام هذا الموقع، فإنكم توافقون على الالتزام بهذه الشروط والأحكام.</p>

        <h2>2. استخدام الموقع</h2>
        <p>يجب استخدام الموقع لأغراض قانونية ومشروعة فقط. يحظر أي استخدام يضر بالموقع أو مستخدميه.</p>

        <h2>3. الطلبات والدفع</h2>
        <p>جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة. الدفع يتم عبر البطاقات الائتمانية أو المحافظ الإلكترونية.</p>

        <h2>4. الشحن والتوصيل</h2>
        <p>نقدم خدمة التوصيل لجميع مناطق المملكة العربية السعودية. مدة التوصيل 1-3 أيام عمل.</p>

        <h2>5. الاسترجاع والاستبدال</h2>
        <p>يمكن استرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام بشرط أن تكون بحالتها الأصلية.</p>

        <h2>6. الخصوصية</h2>
        <p>نلتزم بحماية خصوصية بياناتكم وفقاً لسياسة الخصوصية الخاصة بنا.</p>

        <h2>7. المسؤولية القانونية</h2>
        <p>لا نتحمل المسؤولية عن أي أضرار غير مباشرة أو عرضية.</p>

        <h2>8. التعديلات</h2>
        <p>نحتفظ بحق تعديل هذه الشروط في أي وقت. التعديلات سارية من تاريخ نشرها.</p>

        <h2>9. التواصل</h2>
        <p>للاستفسارات حول هذه الشروط، يمكنكم التواصل معنا عبر:</p>
        <ul>
          <li>البريد الإلكتروني: info@coffee-selection.com</li>
          <li>الهاتف: +966-11-123-4567</li>
          <li>العنوان: الرياض، المملكة العربية السعودية</li>
        </ul>
      `,
			lastUpdated: "2024-01-15",
			effectiveDate: "2024-01-01",
			governingLaw: "قوانين المملكة العربية السعودية",
			contactInfo: {
				email: "info@coffee-selection.com",
				phone: "+966-11-123-4567",
				address: "الرياض، المملكة العربية السعودية",
			},
			seo: {
				title: "شروط وأحكام الاستخدام - Coffee Selection",
				description:
					"اقرأ شروط وأحكام استخدام موقع Coffee Selection للقهوة والمنتجات المرتبطة",
				keywords: "شروط الاستخدام, أحكام, قهوة, Coffee Selection",
			},
		},

		privacy: {
			id: "privacy-ar",
			title: "سياسة الخصوصية",
			description: "سياسة الخصوصية لحماية بياناتكم الشخصية",
			content: `
        <h1>سياسة الخصوصية</h1>

        <h2>1. مقدمة</h2>
        <p>نحن في Coffee Selection نلتزم بحماية خصوصية بياناتكم الشخصية. هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتكم.</p>

        <h2>2. المعلومات التي نجمعها</h2>
        <p>نجمع المعلومات التالية:</p>
        <ul>
          <li>الاسم والعنوان ورقم الهاتف</li>
          <li>عنوان البريد الإلكتروني</li>
          <li>معلومات الدفع</li>
          <li>تاريخ الطلبات والتفضيلات</li>
        </ul>

        <h2>3. كيفية استخدام المعلومات</h2>
        <p>نستخدم معلوماتكم لـ:</p>
        <ul>
          <li>معالجة الطلبات والشحن</li>
          <li>التواصل معكم حول الطلبات</li>
          <li>تحسين خدماتنا</li>
          <li>إرسال العروض والمنتجات الجديدة</li>
        </ul>

        <h2>4. مشاركة المعلومات</h2>
        <p>لا نشارك معلوماتكم مع أي طرف ثالث إلا في الحالات التالية:</p>
        <ul>
          <li>شركات الشحن لتنفيذ التوصيل</li>
          <li>شركات الدفع لمعالجة المدفوعات</li>
          <li>الجهات الحكومية عند الحاجة القانونية</li>
        </ul>

        <h2>5. حماية المعلومات</h2>
        <p>نستخدم تقنيات تشفير متقدمة لحماية بياناتكم من الوصول غير المصرح به.</p>

        <h2>6. ملفات تعريف الارتباط (Cookies)</h2>
        <p>نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكر تفضيلاتكم.</p>

        <h2>7. حقوقكم</h2>
        <p>لديكم الحق في:</p>
        <ul>
          <li>الوصول إلى بياناتكم الشخصية</li>
          <li>تصحيح أي معلومات غير دقيقة</li>
          <li>حذف بياناتكم</li>
          <li>إلغاء الاشتراك في الرسائل التسويقية</li>
        </ul>

        <h2>8. التعديلات</h2>
        <p>نحتفظ بحق تعديل هذه السياسة. سنعلمكم بأي تغييرات جوهرية.</p>

        <h2>9. التواصل</h2>
        <p>للاستفسارات حول سياسة الخصوصية:</p>
        <ul>
          <li>البريد الإلكتروني: privacy@coffee-selection.com</li>
          <li>الهاتف: +966-11-123-4567</li>
          <li>العنوان: الرياض، المملكة العربية السعودية</li>
        </ul>
      `,
			lastUpdated: "2024-01-15",
			effectiveDate: "2024-01-01",
			contactInfo: {
				email: "privacy@coffee-selection.com",
				phone: "+966-11-123-4567",
				address: "الرياض، المملكة العربية السعودية",
			},
			seo: {
				title: "سياسة الخصوصية - Coffee Selection",
				description: "تعرف على كيفية حماية Coffee Selection لبياناتكم الشخصية",
				keywords: "سياسة الخصوصية, حماية البيانات, Coffee Selection",
			},
		},

		refund: {
			id: "refund-ar",
			title: "سياسة الاسترجاع والاستبدال",
			description: "سياسة الاسترجاع والاستبدال للمنتجات",
			content: `
        <h1>سياسة الاسترجاع والاستبدال</h1>

        <h2>1. فترة الاسترجاع</h2>
        <p>يمكنكم استرجاع المنتجات خلال 14 يوماً من تاريخ استلام الطلب.</p>

        <h2>2. شروط الاسترجاع</h2>
        <p>يجب أن تكون المنتجات:</p>
        <ul>
          <li>في حالتها الأصلية</li>
          <li>غير مستخدمة</li>
          <li>في العبوة الأصلية</li>
          <li>مع جميع الملحقات</li>
        </ul>

        <h2>3. المنتجات غير القابلة للاسترجاع</h2>
        <p>لا يمكن استرجاع:</p>
        <ul>
          <li>المنتجات المخصصة</li>
          <li>المنتجات التالفة بسبب سوء الاستخدام</li>
          <li>المنتجات المفتوحة من البضائع الاستهلاكية</li>
        </ul>

        <h2>4. إجراءات الاسترجاع</h2>
        <p>لطلب الاسترجاع:</p>
        <ol>
          <li>تواصلوا مع خدمة العملاء</li>
          <li>قدمي رقم الطلب وسبب الاسترجاع</li>
          <li>سنرسل لكم تعليمات الشحن</li>
          <li>أرسلوا المنتج إلينا</li>
          <li>سنعالج الاسترجاع خلال 5-7 أيام عمل</li>
        </ol>

        <h2>5. المبالغ المستردة</h2>
        <p>سيتم رد المبلغ كاملاً ناقص:</p>
        <ul>
          <li>تكاليف الشحن الأصلية</li>
          <li>تكاليف الشحن للاسترجاع</li>
          <li>أي رسوم إضافية</li>
        </ul>

        <h2>6. طرق رد المبلغ</h2>
        <p>سيتم رد المبلغ بنفس طريقة الدفع الأصلية خلال 5-7 أيام عمل.</p>

        <h2>7. الاستبدال</h2>
        <p>يمكن استبدال المنتج بمنتج آخر من نفس القيمة أو أقل مع دفع الفرق.</p>

        <h2>8. الضمان</h2>
        <p>جميع المنتجات مضمونة ضد عيوب التصنيع لمدة سنة واحدة.</p>

        <h2>9. التواصل</h2>
        <p>للاستفسارات حول الاسترجاع:</p>
        <ul>
          <li>البريد الإلكتروني: returns@coffee-selection.com</li>
          <li>الهاتف: +966-11-123-4567</li>
          <li>ساعات العمل: الأحد - الخميس 9 ص - 6 م</li>
        </ul>
      `,
			returnPeriod: "14 يوم",
			processingTime: "5-7 أيام عمل",
			contactInfo: {
				email: "returns@coffee-selection.com",
				phone: "+966-11-123-4567",
				address: "الرياض، المملكة العربية السعودية",
				workingHours: "الأحد - الخميس 9 ص - 6 م",
			},
			lastUpdated: "2024-01-15",
			effectiveDate: "2024-01-01",
			seo: {
				title: "سياسة الاسترجاع والاستبدال - Coffee Selection",
				description: "تعرف على سياسة الاسترجاع والاستبدال في Coffee Selection",
				keywords: "استرجاع, استبدال, ضمان, Coffee Selection",
			},
		},
	},

	en: {
		terms: {
			id: "terms-en",
			title: "Terms and Conditions",
			description: "Terms and conditions for using Coffee Selection website",
			content: `
        <h1>Terms and Conditions</h1>

        <h2>1. Introduction</h2>
        <p>Welcome to Coffee Selection website. By using this website, you agree to comply with these terms and conditions.</p>

        <h2>2. Website Usage</h2>
        <p>The website must be used for legal and legitimate purposes only. Any use that harms the website or its users is prohibited.</p>

        <h2>3. Orders and Payment</h2>
        <p>All prices are in Saudi Riyals and include VAT. Payment is made through credit cards or electronic wallets.</p>

        <h2>4. Shipping and Delivery</h2>
        <p>We provide delivery service to all regions of Saudi Arabia. Delivery time is 1-3 business days.</p>

        <h2>5. Returns and Exchanges</h2>
        <p>Products can be returned within 14 days of receipt date, provided they are in their original condition.</p>

        <h2>6. Privacy</h2>
        <p>We are committed to protecting your data privacy according to our privacy policy.</p>

        <h2>7. Legal Liability</h2>
        <p>We are not responsible for any indirect or incidental damages.</p>

        <h2>8. Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Modifications are effective from the date of publication.</p>

        <h2>9. Contact</h2>
        <p>For inquiries about these terms, you can contact us via:</p>
        <ul>
          <li>Email: info@coffee-selection.com</li>
          <li>Phone: +966-11-123-4567</li>
          <li>Address: Riyadh, Saudi Arabia</li>
        </ul>
      `,
			lastUpdated: "2024-01-15",
			effectiveDate: "2024-01-01",
			governingLaw: "Laws of the Kingdom of Saudi Arabia",
			contactInfo: {
				email: "info@coffee-selection.com",
				phone: "+966-11-123-4567",
				address: "Riyadh, Saudi Arabia",
			},
			seo: {
				title: "Terms and Conditions - Coffee Selection",
				description:
					"Read the terms and conditions for using Coffee Selection website for coffee and related products",
				keywords: "terms, conditions, coffee, Coffee Selection",
			},
		},

		privacy: {
			id: "privacy-en",
			title: "Privacy Policy",
			description: "Privacy policy for protecting your personal data",
			content: `
        <h1>Privacy Policy</h1>

        <h2>1. Introduction</h2>
        <p>At Coffee Selection, we are committed to protecting your personal data privacy. This policy explains how we collect, use, and protect your information.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following information:</p>
        <ul>
          <li>Name, address, and phone number</li>
          <li>Email address</li>
          <li>Payment information</li>
          <li>Order history and preferences</li>
        </ul>

        <h2>3. How We Use Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Process orders and shipping</li>
          <li>Communicate with you about orders</li>
          <li>Improve our services</li>
          <li>Send offers and new products</li>
        </ul>

        <h2>4. Information Sharing</h2>
        <p>We do not share your information with any third party except in the following cases:</p>
        <ul>
          <li>Shipping companies for delivery</li>
          <li>Payment companies for payment processing</li>
          <li>Government agencies when legally required</li>
        </ul>

        <h2>5. Information Protection</h2>
        <p>We use advanced encryption technologies to protect your data from unauthorized access.</p>

        <h2>6. Cookies</h2>
        <p>We use cookies to improve browsing experience and remember your preferences.</p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct any inaccurate information</li>
          <li>Delete your data</li>
          <li>Unsubscribe from marketing messages</li>
        </ul>

        <h2>8. Modifications</h2>
        <p>We reserve the right to modify this policy. We will notify you of any significant changes.</p>

        <h2>9. Contact</h2>
        <p>For inquiries about privacy policy:</p>
        <ul>
          <li>Email: privacy@coffee-selection.com</li>
          <li>Phone: +966-11-123-4567</li>
          <li>Address: Riyadh, Saudi Arabia</li>
        </ul>
      `,
			lastUpdated: "2024-01-15",
			effectiveDate: "2024-01-01",
			contactInfo: {
				email: "privacy@coffee-selection.com",
				phone: "+966-11-123-4567",
				address: "Riyadh, Saudi Arabia",
			},
			seo: {
				title: "Privacy Policy - Coffee Selection",
				description: "Learn how Coffee Selection protects your personal data",
				keywords: "privacy policy, data protection, Coffee Selection",
			},
		},

		refund: {
			id: "refund-en",
			title: "Return and Exchange Policy",
			description: "Return and exchange policy for products",
			content: `
        <h1>Return and Exchange Policy</h1>

        <h2>1. Return Period</h2>
        <p>You can return products within 14 days of the order receipt date.</p>

        <h2>2. Return Conditions</h2>
        <p>Products must be:</p>
        <ul>
          <li>In their original condition</li>
          <li>Unused</li>
          <li>In original packaging</li>
          <li>With all accessories</li>
        </ul>

        <h2>3. Non-Returnable Products</h2>
        <p>Cannot be returned:</p>
        <ul>
          <li>Custom products</li>
          <li>Products damaged due to misuse</li>
          <li>Opened consumable goods</li>
        </ul>

        <h2>4. Return Procedures</h2>
        <p>To request a return:</p>
        <ol>
          <li>Contact customer service</li>
          <li>Provide order number and return reason</li>
          <li>We will send you shipping instructions</li>
          <li>Send the product back to us</li>
          <li>We will process the return within 5-7 business days</li>
        </ol>

        <h2>5. Refund Amounts</h2>
        <p>The full amount will be refunded minus:</p>
        <ul>
          <li>Original shipping costs</li>
          <li>Return shipping costs</li>
          <li>Any additional fees</li>
        </ul>

        <h2>6. Refund Methods</h2>
        <p>The amount will be refunded using the same original payment method within 5-7 business days.</p>

        <h2>7. Exchange</h2>
        <p>Products can be exchanged for another product of the same or lower value with payment of the difference.</p>

        <h2>8. Warranty</h2>
        <p>All products are warranted against manufacturing defects for one year.</p>

        <h2>9. Contact</h2>
        <p>For return inquiries:</p>
        <ul>
          <li>Email: returns@coffee-selection.com</li>
          <li>Phone: +966-11-123-4567</li>
          <li>Working Hours: Sunday - Thursday 9 AM - 6 PM</li>
        </ul>
      `,
			returnPeriod: "14 days",
			processingTime: "5-7 business days",
			contactInfo: {
				email: "returns@coffee-selection.com",
				phone: "+966-11-123-4567",
				address: "Riyadh, Saudi Arabia",
				workingHours: "Sunday - Thursday 9 AM - 6 PM",
			},
			lastUpdated: "2024-01-15",
			effectiveDate: "2024-01-01",
			seo: {
				title: "Return and Exchange Policy - Coffee Selection",
				description:
					"Learn about return and exchange policy at Coffee Selection",
				keywords: "return, exchange, warranty, Coffee Selection",
			},
		},
	},
};

// ============================================================================
// TYPES - الأنواع
// ============================================================================

export interface LegalPageData {
	id: string;
	title: string;
	description: string;
	content: string;
	lastUpdated: string;
	effectiveDate: string;
	contactInfo: {
		email: string;
		phone: string;
		address: string;
		workingHours?: string;
	};
	seo: {
		title: string;
		description: string;
		keywords: string;
	};
}

export interface TermsPageData extends LegalPageData {
	governingLaw: string;
}

export interface RefundPageData extends LegalPageData {
	returnPeriod: string;
	processingTime: string;
}

// ============================================================================
// LEGAL PAGES SERVICE - خدمة الصفحات القانونية
// ============================================================================

export class LegalPagesService {
	private static instance: LegalPagesService;

	public static getInstance(): LegalPagesService {
		if (!LegalPagesService.instance) {
			LegalPagesService.instance = new LegalPagesService();
		}
		return LegalPagesService.instance;
	}

	/**
	 * Get Terms and Conditions page
	 * الحصول على صفحة شروط الاستخدام
	 */
	async getTermsPage(lang: string = "ar"): Promise<TermsPageData> {
		const data = LEGAL_PAGES_DATA[lang as keyof typeof LEGAL_PAGES_DATA]?.terms;
		if (!data) {
			throw new Error(`Terms page not found for language: ${lang}`);
		}
		return data as TermsPageData;
	}

	/**
	 * Get Privacy Policy page
	 * الحصول على صفحة سياسة الخصوصية
	 */
	async getPrivacyPage(lang: string = "ar"): Promise<LegalPageData> {
		const data =
			LEGAL_PAGES_DATA[lang as keyof typeof LEGAL_PAGES_DATA]?.privacy;
		if (!data) {
			throw new Error(`Privacy page not found for language: ${lang}`);
		}
		return data;
	}

	/**
	 * Get Refund Policy page
	 * الحصول على صفحة سياسة الاسترجاع
	 */
	async getRefundPage(lang: string = "ar"): Promise<RefundPageData> {
		const data =
			LEGAL_PAGES_DATA[lang as keyof typeof LEGAL_PAGES_DATA]?.refund;
		if (!data) {
			throw new Error(`Refund page not found for language: ${lang}`);
		}
		return data as RefundPageData;
	}

	/**
	 * Get all legal pages
	 * الحصول على جميع الصفحات القانونية
	 */
	async getAllLegalPages(lang: string = "ar"): Promise<{
		terms: TermsPageData;
		privacy: LegalPageData;
		refund: RefundPageData;
	}> {
		const [terms, privacy, refund] = await Promise.all([
			this.getTermsPage(lang),
			this.getPrivacyPage(lang),
			this.getRefundPage(lang),
		]);

		return { terms, privacy, refund };
	}

	/**
	 * Get legal page by type
	 * الحصول على صفحة قانونية حسب النوع
	 */
	async getLegalPageByType(
		type: "terms" | "privacy" | "refund",
		lang: string = "ar",
	): Promise<LegalPageData | TermsPageData | RefundPageData> {
		switch (type) {
			case "terms":
				return this.getTermsPage(lang);
			case "privacy":
				return this.getPrivacyPage(lang);
			case "refund":
				return this.getRefundPage(lang);
			default:
				throw new Error(`Unknown legal page type: ${type}`);
		}
	}

	/**
	 * Check if legal page exists
	 * التحقق من وجود صفحة قانونية
	 */
	async legalPageExists(
		type: "terms" | "privacy" | "refund",
		lang: string = "ar",
	): Promise<boolean> {
		try {
			await this.getLegalPageByType(type, lang);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get available languages for legal pages
	 * الحصول على اللغات المتاحة للصفحات القانونية
	 */
	getAvailableLanguages(): string[] {
		return Object.keys(LEGAL_PAGES_DATA);
	}

	/**
	 * Get legal page types
	 * الحصول على أنواع الصفحات القانونية
	 */
	getLegalPageTypes(): string[] {
		return ["terms", "privacy", "refund"];
	}
}

// Export singleton instance
export const legalPagesService = LegalPagesService.getInstance();
