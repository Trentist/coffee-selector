/**
 * Enhanced IP Detection Service with multiple fallback options
 * Provides comprehensive geographic information for improved user experience
 */

export interface EnhancedIPData {
	// Basic location
	ip: string;
	country_code: string;
	country_name: string;
	region: string;
	region_code: string;
	city: string;
	postal: string;
	latitude: number;
	longitude: number;

	// Network details
	timezone: string;
	utc_offset: string;
	country_calling_code: string;
	currency: string;
	currency_name: string;
	languages: string;

	// Additional info
	asn: string;
	org: string;

	// Advanced (for shipping)
	is_eu: boolean;
	country_tld: string;
	continent_code: string;

	// Security and reliability
	threat: {
		is_tor: boolean;
		is_proxy: boolean;
		is_anonymous: boolean;
		is_known_attacker: boolean;
		is_known_abuser: boolean;
		is_threat: boolean;
		is_bogon: boolean;
	};
}

export interface IPServiceResponse {
	success: boolean;
	data?: EnhancedIPData;
	error?: string;
	source: "cache" | "primary" | "fallback1" | "fallback2" | "fallback3";
}

/**
 * Enhanced geographic location detection service with multiple fallback APIs
 */
class EnhancedIPService {
	private static instance: EnhancedIPService;
	private cache = new Map<
		string,
		{ data: EnhancedIPData; timestamp: number }
	>();
	private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

	// Multiple API endpoints for redundancy
	private readonly API_ENDPOINTS = [
		"https://api.ipify.org?format=json",
		"https://api.myip.com",
		"https://api.ip.sb/ip",
		"https://icanhazip.com",
	];

	private readonly GEOLOCATION_APIS = [
		"https://ipapi.co/json/",
		"https://ip-api.com/json/",
		"https://freegeoip.app/json/",
	];

	private constructor() {}

	public static getInstance(): EnhancedIPService {
		if (!EnhancedIPService.instance) {
			EnhancedIPService.instance = new EnhancedIPService();
		}
		return EnhancedIPService.instance;
	}

	/**
	 * Get current IP information with comprehensive details
	 */
	public async getCurrentIPInfo(): Promise<IPServiceResponse> {
		try {
			// Check cache first
			const cached = this.getCachedData("current");
			if (cached) {
				return {
					success: true,
					data: cached,
					source: "cache",
				};
			}

			// Try primary geolocation API
			const primaryResult = await this.tryGeolocationAPI(this.GEOLOCATION_APIS[0], "primary");
			if (primaryResult.success) {
				return primaryResult;
			}

			// Try fallback geolocation APIs
			for (let i = 1; i < this.GEOLOCATION_APIS.length; i++) {
				const fallbackResult = await this.tryGeolocationAPI(
					this.GEOLOCATION_APIS[i],
					`fallback${i}` as any
				);
				if (fallbackResult.success) {
					return fallbackResult;
				}
			}

			// If all geolocation APIs fail, try to get basic IP info
			const ipResult = await this.getBasicIPInfo();
			if (ipResult.success) {
				return ipResult;
			}

			throw new Error("All IP detection methods failed");
		} catch (error) {
			console.error("❌ [EnhancedIPService] Error:", error);

			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				source: "primary",
			};
		}
	}

	/**
	 * Try a specific geolocation API
	 */
	private async tryGeolocationAPI(url: string, source: string): Promise<IPServiceResponse> {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const response = await fetch(url, {
				method: "GET",
				signal: controller.signal,
				headers: {
					"Accept": "application/json",
					"User-Agent": "CoffeeSelectionsApp/1.0",
				},
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			if (data && data.country_code) {
				const enhancedData: EnhancedIPData = this.parseGeolocationResponse(data);

				// Save to cache
				this.setCachedData("current", enhancedData);

				return {
					success: true,
					data: enhancedData,
					source: source as any,
				};
			}

			throw new Error("Invalid data received from geolocation API");
		} catch (error) {
			console.warn(`⚠️ [EnhancedIPService] ${source} API failed:`, error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				source: source as any,
			};
		}
	}

	/**
	 * Get basic IP information when geolocation APIs fail
	 */
	private async getBasicIPInfo(): Promise<IPServiceResponse> {
		try {
			// Try to get IP from multiple sources
			let ip = "";
			for (const endpoint of this.API_ENDPOINTS) {
				try {
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 3000);

					const response = await fetch(endpoint, {
						method: "GET",
						signal: controller.signal,
						headers: {
							"Accept": "application/json",
							"User-Agent": "CoffeeSelectionsApp/1.0",
						},
					});

					clearTimeout(timeoutId);

					if (response.ok) {
						const data = await response.json();
						ip = data.ip || data.query || data;
						if (ip) break;
					}
				} catch (error) {
					console.warn(`⚠️ [EnhancedIPService] IP endpoint failed:`, endpoint, error);
					continue;
				}
			}

			if (!ip) {
				throw new Error("Could not retrieve IP address");
			}

			// Create basic location data
			const basicData: EnhancedIPData = {
				ip: ip,
				country_code: "US", // Default fallback
				country_name: "United States",
				region: "",
				region_code: "",
				city: "",
				postal: "",
				latitude: 0,
				longitude: 0,
				timezone: "UTC",
				utc_offset: "+00:00",
				country_calling_code: "+1",
				currency: "USD",
				currency_name: "US Dollar",
				languages: "en",
				asn: "",
				org: "",
				is_eu: false,
				country_tld: ".us",
				continent_code: "NA",
				threat: {
					is_tor: false,
					is_proxy: false,
					is_anonymous: false,
					is_known_attacker: false,
					is_known_abuser: false,
					is_threat: false,
					is_bogon: false,
				},
			};

			// Save to cache
			this.setCachedData("current", basicData);

			return {
				success: true,
				data: basicData,
				source: "fallback3",
			};
		} catch (error) {
			console.error("❌ [EnhancedIPService] Basic IP detection failed:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				source: "fallback3",
			};
		}
	}

	/**
	 * Get information for specific IP
	 */
	public async getIPInfo(ip: string): Promise<IPServiceResponse> {
		try {
			// Check cache
			const cached = this.getCachedData(ip);
			if (cached) {
				return {
					success: true,
					data: cached,
					source: "cache",
				};
			}

			// Try geolocation APIs for specific IP
			for (let i = 0; i < this.GEOLOCATION_APIS.length; i++) {
				const apiUrl = this.GEOLOCATION_APIS[i].replace("/json/", `/${ip}/json/`);
				const result = await this.tryGeolocationAPI(apiUrl, `fallback${i + 1}` as any);
				if (result.success) {
					return result;
				}
			}

			return {
				success: false,
				error: "Could not retrieve information for specific IP",
				source: "primary",
			};
		} catch (error) {
			console.error(`❌ [EnhancedIPService] Error for IP ${ip}:`, error);

			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				source: "primary",
			};
		}
	}

	/**
	 * Get enhanced shipping information
	 */
	public async getShippingInfo(): Promise<{
		success: boolean;
		data?: {
			country: string;
			countryName: string;
			region: string;
			city: string;
			postal: string;
			timezone: string;
			currency: string;
			isEU: boolean;
			continent: string;
			callingCode: string;
			recommendedShipping: {
				isAramexSupported: boolean;
				estimatedDays: number;
				isDomestic: boolean;
				isInternational: boolean;
			};
		};
		error?: string;
	}> {
		try {
			const ipInfo = await this.getCurrentIPInfo();

			if (!ipInfo.success || !ipInfo.data) {
				return {
					success: false,
					error: "Could not determine location",
				};
			}

			const data = ipInfo.data;
			const isAramexSupported = this.isAramexSupportedCountry(data.country_code);
			const isDomestic = data.country_code === "SA"; // Assuming Saudi Arabia is domestic

			// Calculate estimated shipping days
			let estimatedDays = 7; // Default international
			if (isDomestic) {
				estimatedDays = 2;
			} else if (isAramexSupported) {
				estimatedDays = 5;
			}

			return {
				success: true,
				data: {
					country: data.country_code,
					countryName: data.country_name,
					region: data.region,
					city: data.city,
					postal: data.postal,
					timezone: data.timezone,
					currency: data.currency,
					isEU: data.is_eu,
					continent: data.continent_code,
					callingCode: data.country_calling_code,
					recommendedShipping: {
						isAramexSupported,
						estimatedDays,
						isDomestic,
						isInternational: !isDomestic,
					},
				},
			};
		} catch (error) {
			console.error("❌ [EnhancedIPService] Shipping info error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Check if country is supported by Aramex
	 */
	private isAramexSupportedCountry(countryCode: string): boolean {
		const aramexCountries = [
			// GCC countries
			"AE",
			"SA",
			"KW",
			"QA",
			"OM",
			"BH",
			// North Africa
			"EG",
			"MA",
			"DZ",
			"TN",
			"LY",
			// Levant
			"LB",
			"JO",
			"PS",
			"SY",
			// Other countries
			"IQ",
			"YE",
			"SD",
			"SO",
			"DJ",
			"KM",
			"MR",
			// Selected international
			"US",
			"GB",
			"FR",
			"DE",
			"IT",
			"ES",
			"NL",
			"CA",
			"AU",
			"IN",
			"PK",
			"BD",
			"LK",
			"PH",
			"TH",
			"MY",
			"SG",
			"TR",
		];

		return aramexCountries.includes(countryCode);
	}

	/**
	 * Parse geolocation API response
	 */
	private parseGeolocationResponse(data: any): EnhancedIPData {
		return {
			ip: data.ip || data.query || "",
			country_code: data.country_code || data.countryCode || "",
			country_name: data.country_name || data.country || "",
			region: data.region || data.regionName || "",
			region_code: data.region_code || data.regionCode || "",
			city: data.city || "",
			postal: data.postal || data.zip || "",
			latitude: data.latitude || data.lat || 0,
			longitude: data.longitude || data.lon || 0,
			timezone: data.timezone || data.time_zone || "",
			utc_offset: data.utc_offset || data.offset || "",
			country_calling_code: data.country_calling_code || data.callingCode || "",
			currency: data.currency || "",
			currency_name: data.currency_name || "",
			languages: data.languages || "",
			asn: data.asn || data.as || "",
			org: data.org || data.isp || "",
			is_eu: data.is_eu || false,
			country_tld: data.country_tld || data.tld || "",
			continent_code: data.continent_code || data.continent || "",
			threat: {
				is_tor: data.threat?.is_tor || false,
				is_proxy: data.threat?.is_proxy || false,
				is_anonymous: data.threat?.is_anonymous || false,
				is_known_attacker: data.threat?.is_known_attacker || false,
				is_known_abuser: data.threat?.is_known_abuser || false,
				is_threat: data.threat?.is_threat || false,
				is_bogon: data.threat?.is_bogon || false,
			},
		};
	}

	/**
	 * Cache management
	 */
	private getCachedData(key: string): EnhancedIPData | null {
		const cached = this.cache.get(key);

		if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
			return cached.data;
		}

		if (cached) {
			this.cache.delete(key);
		}

		return null;
	}

	private setCachedData(key: string, data: EnhancedIPData): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	/**
	 * Clean old cache
	 */
	public clearOldCache(): void {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > this.CACHE_DURATION) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Get cache statistics
	 */
	public getCacheStats(): { size: number; keys: string[] } {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}
}

export default EnhancedIPService;
