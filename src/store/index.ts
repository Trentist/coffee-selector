/**
 * Main Redux Store Configuration
 * التكوين الرئيسي لمتجر Redux
 */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";

// Import slices
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import notificationSlice from "./slices/notificationSlice";

// Persist configuration
const persistConfig = {
	key: "coffee-selection-root",
	storage,
	whitelist: ["user", "cart", "favorites"], // Only persist these slices
	blacklist: ["notifications", "odoo"], // Don't persist these
};

// Root reducer
const rootReducer = combineReducers({
	cart: cartSlice,
	user: userSlice,
	notifications: notificationSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
	devTools: process.env.NODE_ENV !== "production",
});

// Persistor
export const persistor = persistStore(store);

// Root state type
export type RootState = ReturnType<typeof store.getState>;

// App dispatch type
export type AppDispatch = typeof store.dispatch;

// Store exports
export default store;