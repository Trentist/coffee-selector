/**
 * Hooks Export File
 * ملف تصدير الـ Hooks
 */

// Store hooks
export {
	useAppSelector,
	useAppDispatch,
	useStore,
	useUserStore,
	useCartStore,
	useFavoritesStore,
	useNotificationsStore,
	useOdooStore,
} from "./useStore";

// Odoo state hook
export { useOdooState } from "./useOdooState";

// Re-export all hooks for easy access
export * from "./useStore";
export * from "./useOdooState";

// Auth hooks
export * from "./useAuth";

// Location hooks
export * from "./useLocation";

// Currency hooks
export * from "./useCurrency";

// Pages hooks
export * from "./pages";
