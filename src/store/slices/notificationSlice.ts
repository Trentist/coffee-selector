/**
 * Notification State Management
 * إدارة حالة الإشعارات
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

// Types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
	dismissible?: boolean;
	createdAt: number;
}

interface NotificationState {
	notifications: Notification[];
	maxNotifications: number;
}

// Initial state
const initialState: NotificationState = {
	notifications: [],
	maxNotifications: 5,
};

// Helper function to generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Slice
const notificationSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addNotification: (
			state,
			action: PayloadAction<Omit<Notification, "id" | "createdAt">>,
		) => {
			const notification: Notification = {
				...action.payload,
				id: generateId(),
				createdAt: Date.now(),
			};

			// Add to beginning of array
			state.notifications.unshift(notification);

			// Remove oldest notifications if exceeding max
			if (state.notifications.length > state.maxNotifications) {
				state.notifications = state.notifications.slice(
					0,
					state.maxNotifications,
				);
			}
		},
		removeNotification: (state, action: PayloadAction<string>) => {
			state.notifications = state.notifications.filter(
				(notification) => notification.id !== action.payload,
			);
		},
		clearNotifications: (state) => {
			state.notifications = [];
		},
		clearNotificationsByType: (
			state,
			action: PayloadAction<NotificationType>,
		) => {
			state.notifications = state.notifications.filter(
				(notification) => notification.type !== action.payload,
			);
		},
		setMaxNotifications: (state, action: PayloadAction<number>) => {
			state.maxNotifications = action.payload;

			// Remove excess notifications if needed
			if (state.notifications.length > state.maxNotifications) {
				state.notifications = state.notifications.slice(
					0,
					state.maxNotifications,
				);
			}
		},
		// Convenience actions for different notification types
		addSuccess: (
			state,
			action: PayloadAction<{
				title: string;
				message: string;
				duration?: number;
			}>,
		) => {
			const notification: Notification = {
				id: generateId(),
				type: "success",
				title: action.payload.title,
				message: action.payload.message,
				duration: action.payload.duration || 5000,
				dismissible: true,
				createdAt: Date.now(),
			};

			state.notifications.unshift(notification);

			if (state.notifications.length > state.maxNotifications) {
				state.notifications = state.notifications.slice(
					0,
					state.maxNotifications,
				);
			}
		},
		addError: (
			state,
			action: PayloadAction<{
				title: string;
				message: string;
				duration?: number;
			}>,
		) => {
			const notification: Notification = {
				id: generateId(),
				type: "error",
				title: action.payload.title,
				message: action.payload.message,
				duration: action.payload.duration || 8000,
				dismissible: true,
				createdAt: Date.now(),
			};

			state.notifications.unshift(notification);

			if (state.notifications.length > state.maxNotifications) {
				state.notifications = state.notifications.slice(
					0,
					state.maxNotifications,
				);
			}
		},
		addWarning: (
			state,
			action: PayloadAction<{
				title: string;
				message: string;
				duration?: number;
			}>,
		) => {
			const notification: Notification = {
				id: generateId(),
				type: "warning",
				title: action.payload.title,
				message: action.payload.message,
				duration: action.payload.duration || 6000,
				dismissible: true,
				createdAt: Date.now(),
			};

			state.notifications.unshift(notification);

			if (state.notifications.length > state.maxNotifications) {
				state.notifications = state.notifications.slice(
					0,
					state.maxNotifications,
				);
			}
		},
		addInfo: (
			state,
			action: PayloadAction<{
				title: string;
				message: string;
				duration?: number;
			}>,
		) => {
			const notification: Notification = {
				id: generateId(),
				type: "info",
				title: action.payload.title,
				message: action.payload.message,
				duration: action.payload.duration || 4000,
				dismissible: true,
				createdAt: Date.now(),
			};

			state.notifications.unshift(notification);

			if (state.notifications.length > state.maxNotifications) {
				state.notifications = state.notifications.slice(
					0,
					state.maxNotifications,
				);
			}
		},
	},
});

// Actions
export const {
	addNotification,
	removeNotification,
	clearNotifications,
	clearNotificationsByType,
	setMaxNotifications,
	addSuccess,
	addError,
	addWarning,
	addInfo,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: RootState) => state.notifications;
export const selectAllNotifications = (state: RootState) =>
	state.notifications.notifications;
export const selectNotificationsCount = (state: RootState) =>
	state.notifications.notifications.length;
export const selectMaxNotifications = (state: RootState) =>
	state.notifications.maxNotifications;
export const selectNotificationsByType = (
	state: RootState,
	type: NotificationType,
) =>
	state.notifications.notifications.filter(
		(notification) => notification.type === type,
	);
export const selectUnreadNotifications = (state: RootState) =>
	state.notifications.notifications.filter(
		(notification) =>
			Date.now() - notification.createdAt < (notification.duration || 5000),
	);

export default notificationSlice.reducer;
