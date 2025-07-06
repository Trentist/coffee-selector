/**
 * User State Management
 * إدارة حالة المستخدم
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface User {
	id: string;
	name: string;
	email: string;
	role: "guest" | "customer";
	avatar?: string;
	phone?: string;
	isVerified?: boolean;
}

export interface UserState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

// Initial state
const initialState: UserState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

// Slice
const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginStart: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		loginSuccess: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.isLoading = false;
			state.error = null;
		},
		loginFailure: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			state.error = null;
		},
		updateUser: (state, action: PayloadAction<Partial<User>>) => {
			if (state.user) {
				state.user = { ...state.user, ...action.payload };
			}
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
	},
});

// Actions
export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	updateUser,
	setError,
	setLoading,
} = userSlice.actions;

// Selectors
export const selectUser = (state: any) => state.user.user;
export const selectIsAuthenticated = (state: any) => state.user.isAuthenticated;
export const selectUserLoading = (state: any) => state.user.isLoading;
export const selectUserError = (state: any) => state.user.error;

export default userSlice.reducer;
