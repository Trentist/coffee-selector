/**
 * Favorites Types - أنواع المفضلة
 */

export interface FavoriteItem {
	id: string;
	productId: string;
	addedAt: string;
	isLocal?: boolean;
	product?: {
		id: string;
		name: string;
		price: number;
		image?: string;
		slug: string;
		description?: string;
		categories?: Array<{
			id: string;
			name: string;
		}>;
	};
}

export interface FavoritesState {
	items: FavoriteItem[];
	loading: boolean;
	error: string | null;
	stats: {
		totalFavorites: number;
		localFavorites: number;
		serverFavorites: number;
		categories: Record<string, number>;
		totalValue: number;
	};
}

export interface FavoriteOperation {
	success: boolean;
	message: string;
	favorite?: FavoriteItem;
	favorites?: FavoriteItem[];
	migratedCount?: number;
	error?: string;
}

export interface SocialShareData {
	success: boolean;
	platform: string;
	url?: string;
	title?: string;
	productUrl?: string;
	error?: string;
}

export interface FavoritesConfig {
	maxLocalFavorites: number;
	maxServerFavorites: number;
	autoSync: boolean;
	syncInterval: number;
	enableSharing: boolean;
	enableExport: boolean;
	enableImport: boolean;
}

export interface FavoritesStats {
	totalFavorites: number;
	localFavorites: number;
	serverFavorites: number;
	categories: Record<string, number>;
	totalValue: number;
	mostFavoritedCategory: string;
	averagePrice: number;
	lastAdded: string | null;
}

export interface FavoritesMigration {
	fromStorage: "local" | "server";
	toStorage: "local" | "server";
	itemsCount: number;
	success: boolean;
	error?: string;
	migratedItems?: FavoriteItem[];
}

export interface FavoritesBackup {
	version: string;
	timestamp: string;
	items: FavoriteItem[];
	stats: FavoritesStats;
	metadata: {
		source: string;
		userAgent?: string;
		deviceId?: string;
	};
}

export interface FavoritesSync {
	lastSyncTime: string;
	syncStatus: "idle" | "syncing" | "completed" | "failed";
	itemsSynced: number;
	conflicts: number;
	errors: string[];
}

export interface FavoritesAnalytics {
	totalAdds: number;
	totalRemoves: number;
	totalShares: number;
	totalCartAdds: number;
	popularProducts: Array<{
		productId: string;
		productName: string;
		addCount: number;
	}>;
	popularCategories: Array<{
		categoryName: string;
		favoriteCount: number;
	}>;
	sharingStats: Record<string, number>;
	timeStats: {
		mostActiveHour: number;
		mostActiveDay: string;
		averageSessionDuration: number;
	};
}
