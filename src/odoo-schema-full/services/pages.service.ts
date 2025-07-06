import { DocumentNode } from "graphql";
import { apolloClient } from "../apollo-client";
import {
	GET_ABOUT_PAGE,
	GET_CONTACT_PAGE,
	GET_JOBS_PAGE,
	GET_PRIVACY_PAGE,
	GET_TERMS_PAGE,
	GET_REFUND_PAGE,
	GET_BLOG_PAGE,
	GET_BLOG_POST,
	GET_STATIC_PAGES,
	GET_STATIC_PAGE,
	GET_NAVIGATION_MENU,
	GET_SITE_SETTINGS,
	SEARCH_CONTENT,
} from "../queries/pages";

// Types for page data
export interface PageData {
	id: string;
	title: string;
	description?: string;
	content: string;
	seo?: {
		title: string;
		description: string;
		keywords: string;
	};
}

export interface AboutPageData extends PageData {
	storeInfo: {
		name: string;
		address: string;
		phone: string;
		email: string;
		workingHours: {
			weekdays: string;
			weekdaysHours: string;
			weekend: string;
			weekendHours: string;
		};
		location?: {
			latitude: number;
			longitude: number;
		};
	};
	images: Array<{
		url: string;
		alt: string;
		caption?: string;
	}>;
}

export interface ContactPageData extends PageData {
	contactInfo: {
		address: string;
		phone: string;
		email: string;
		whatsapp?: string;
		socialMedia?: {
			facebook?: string;
			twitter?: string;
			instagram?: string;
			linkedin?: string;
		};
	};
	contactForm: {
		fields: Array<{
			name: string;
			type: string;
			required: boolean;
			placeholder: string;
			options?: string[];
		}>;
	};
	officeHours: {
		weekdays: string;
		weekdaysHours: string;
		weekend: string;
		weekendHours: string;
	};
}

export interface JobData {
	id: string;
	title: string;
	description: string;
	department: string;
	location: string;
	type: string;
	requirements: string[];
	responsibilities: string[];
	benefits: string[];
	salaryRange?: string;
	applicationDeadline?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	applicationUrl?: string;
	contactEmail?: string;
}

export interface JobsPageData extends PageData {
	jobs: JobData[];
}

export interface BlogPost {
	id: string;
	title: string;
	excerpt: string;
	content: string;
	slug: string;
	featuredImage?: {
		url: string;
		alt: string;
		caption?: string;
	};
	author: {
		id: string;
		name: string;
		avatar?: string;
		bio?: string;
	};
	category: {
		id: string;
		name: string;
		slug: string;
		color?: string;
	};
	tags: Array<{
		id: string;
		name: string;
		slug: string;
	}>;
	publishedAt: string;
	updatedAt: string;
	readingTime: number;
	isPublished: boolean;
}

export interface BlogPageData extends PageData {
	posts: BlogPost[];
	categories: Array<{
		id: string;
		name: string;
		slug: string;
		description?: string;
		color?: string;
		postCount: number;
	}>;
}

export interface RefundPageData extends PageData {
	sections: Array<{
		id: string;
		title: string;
		content: string;
		order: number;
		items?: Array<{
			id: string;
			title: string;
			description: string;
			order: number;
		}>;
	}>;
	returnPeriod: string;
	processingTime: string;
	contactInfo: {
		email: string;
		phone: string;
		address: string;
		workingHours: string;
	};
	lastUpdated: string;
	effectiveDate: string;
}

export interface NavigationMenuItem {
	id: string;
	title: string;
	url: string;
	type: string;
	target: string;
	order: number;
	parentId?: string;
	children?: NavigationMenuItem[];
	icon?: string;
	description?: string;
	isActive: boolean;
}

export interface NavigationMenu {
	id: string;
	name: string;
	location: string;
	items: NavigationMenuItem[];
}

export interface SiteSettings {
	id: string;
	siteName: string;
	siteDescription: string;
	siteUrl: string;
	logo?: {
		url: string;
		alt: string;
	};
	favicon?: {
		url: string;
	};
	contactInfo: {
		email: string;
		phone: string;
		whatsapp?: string;
		address: string;
		socialMedia?: {
			facebook?: string;
			twitter?: string;
			instagram?: string;
			linkedin?: string;
			youtube?: string;
			tiktok?: string;
		};
	};
	businessHours: {
		weekdays: string;
		weekdaysHours: string;
		weekend: string;
		weekendHours: string;
		timezone: string;
	};
	seo: {
		defaultTitle: string;
		defaultDescription: string;
		defaultKeywords: string;
		ogImage?: string;
		twitterCard?: string;
	};
	analytics: {
		googleAnalyticsId?: string;
		facebookPixelId?: string;
		tiktokPixelId?: string;
	};
	features: {
		enableBlog: boolean;
		enableJobs: boolean;
		enableNewsletter: boolean;
		enableComments: boolean;
		enableRatings: boolean;
	};
}

export interface SearchResult {
	id: string;
	title: string;
	excerpt: string;
	url: string;
	type: string;
	image?: {
		url: string;
		alt: string;
	};
	publishedAt: string;
	relevanceScore: number;
}

export interface SearchContentResponse {
	results: SearchResult[];
	totalCount: number;
	suggestions: string[];
	filters: Array<{
		type: string;
		count: number;
	}>;
}

// Service class for managing pages
export class PagesService {
	private static instance: PagesService;
	private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
	private cacheTimeout = 5 * 60 * 1000; // 5 minutes

	public static getInstance(): PagesService {
		if (!PagesService.instance) {
			PagesService.instance = new PagesService();
		}
		return PagesService.instance;
	}

	private getCacheKey(
		query: string,
		variables: Record<string, unknown>,
	): string {
		return `${query}_${JSON.stringify(variables)}`;
	}

	private isValidCache(timestamp: number): boolean {
		return Date.now() - timestamp < this.cacheTimeout;
	}

	private async executeQuery<T>(
		query: DocumentNode,
		variables: Record<string, unknown> = {},
		useCache: boolean = true,
	): Promise<T> {
		const cacheKey = this.getCacheKey(query.loc?.source.body || "", variables);

		if (useCache && this.cache.has(cacheKey)) {
			const cached = this.cache.get(cacheKey);
			if (cached && this.isValidCache(cached.timestamp)) {
				return cached.data as T;
			}
		}

		try {
			const { data } = await apolloClient.query<T>({
				query,
				variables,
			});

			if (useCache) {
				this.cache.set(cacheKey, {
					data,
					timestamp: Date.now(),
				});
			}

			return data;
		} catch (error) {
			console.error("GraphQL query error:", error);
			throw new Error(`Failed to fetch data: ${error}`);
		}
	}

	// Get About page data
	async getAboutPage(lang: string = "ar"): Promise<AboutPageData> {
		const data = await this.executeQuery<{ aboutPage: AboutPageData }>(
			GET_ABOUT_PAGE,
			{ lang },
		);
		return data.aboutPage;
	}

	// Get Contact page data
	async getContactPage(lang: string = "ar"): Promise<ContactPageData> {
		const data = await this.executeQuery<{ contactPage: ContactPageData }>(
			GET_CONTACT_PAGE,
			{ lang },
		);
		return data.contactPage;
	}

	// Get Jobs page data
	async getJobsPage(
		lang: string = "ar",
		limit: number = 10,
		offset: number = 0,
	): Promise<{ page: PageData; jobs: JobData[] }> {
		const data = await this.executeQuery<{
			jobsPage: PageData;
			jobs: JobData[];
		}>(GET_JOBS_PAGE, { lang, limit, offset });

		return {
			page: data.jobsPage,
			jobs: data.jobs,
		};
	}

	// Get Privacy Policy page data
	async getPrivacyPage(lang: string = "ar"): Promise<PageData> {
		const data = await this.executeQuery<{ privacyPage: PageData }>(
			GET_PRIVACY_PAGE,
			{ lang },
		);
		return data.privacyPage;
	}

	// Get Terms & Conditions page data
	async getTermsPage(lang: string = "ar"): Promise<PageData> {
		const data = await this.executeQuery<{ termsPage: PageData }>(
			GET_TERMS_PAGE,
			{ lang },
		);
		return data.termsPage;
	}

	// Get Refund Policy page data
	async getRefundPage(lang: string = "ar"): Promise<RefundPageData> {
		const data = await this.executeQuery<{ refundPage: RefundPageData }>(
			GET_REFUND_PAGE,
			{ lang },
		);
		return data.refundPage;
	}

	// Get Blog page data
	async getBlogPage(
		lang: string = "ar",
		limit: number = 10,
		offset: number = 0,
		categoryId?: string,
	): Promise<BlogPageData> {
		const data = await this.executeQuery<{
			blogPage: PageData;
			blogPosts: BlogPost[];
			blogCategories: Array<{
				id: string;
				name: string;
				slug: string;
				description?: string;
				color?: string;
				postCount: number;
			}>;
		}>(GET_BLOG_PAGE, { lang, limit, offset, categoryId });

		return {
			...data.blogPage,
			posts: data.blogPosts,
			categories: data.blogCategories,
		};
	}

	// Get single blog post
	async getBlogPost(slug: string, lang: string = "ar"): Promise<BlogPost> {
		const data = await this.executeQuery<{ blogPost: BlogPost }>(
			GET_BLOG_POST,
			{ slug, lang },
		);
		return data.blogPost;
	}

	// Get all static pages
	async getStaticPages(lang: string = "ar"): Promise<PageData[]> {
		const data = await this.executeQuery<{ staticPages: PageData[] }>(
			GET_STATIC_PAGES,
			{ lang },
		);
		return data.staticPages;
	}

	// Get single static page
	async getStaticPage(slug: string, lang: string = "ar"): Promise<PageData> {
		const data = await this.executeQuery<{ staticPage: PageData }>(
			GET_STATIC_PAGE,
			{ slug, lang },
		);
		return data.staticPage;
	}

	// Get navigation menu
	async getNavigationMenu(
		location: string = "main",
		lang: string = "ar",
	): Promise<NavigationMenu> {
		const data = await this.executeQuery<{ navigationMenu: NavigationMenu }>(
			GET_NAVIGATION_MENU,
			{ location, lang },
		);
		return data.navigationMenu;
	}

	// Get site settings
	async getSiteSettings(lang: string = "ar"): Promise<SiteSettings> {
		const data = await this.executeQuery<{ siteSettings: SiteSettings }>(
			GET_SITE_SETTINGS,
			{ lang },
		);
		return data.siteSettings;
	}

	// Search content
	async searchContent(
		query: string,
		type?: string,
		lang: string = "ar",
		limit: number = 20,
	): Promise<SearchContentResponse> {
		const data = await this.executeQuery<{
			searchContent: SearchContentResponse;
		}>(
			SEARCH_CONTENT,
			{ query, type, lang, limit },
			false, // Don't cache search results
		);
		return data.searchContent;
	}

	// Clear cache
	clearCache(): void {
		this.cache.clear();
	}

	// Clear expired cache entries
	clearExpiredCache(): void {
		for (const [key, value] of this.cache.entries()) {
			if (!this.isValidCache(value.timestamp)) {
				this.cache.delete(key);
			}
		}
	}

	// Get cache statistics
	getCacheStats(): {
		totalEntries: number;
		validEntries: number;
		expiredEntries: number;
	} {
		let validEntries = 0;
		let expiredEntries = 0;

		for (const [, value] of this.cache.entries()) {
			if (this.isValidCache(value.timestamp)) {
				validEntries++;
			} else {
				expiredEntries++;
			}
		}

		return {
			totalEntries: this.cache.size,
			validEntries,
			expiredEntries,
		};
	}
}

// Export singleton instance
export const pagesService = PagesService.getInstance();
