"use client";

/**
 * Dashboard Hook
 * خطاف لوحة التحكم الرئيسي
 */

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import {
	DashboardState,
	User,
	DashboardStats,
	Order,
	WishlistItem,
	Address,
} from "../types/dashboard.types";

export const useDashboard = () => {
	const { data: session, status } = useSession();
	const toast = useToast();

	// State
	const [state, setState] = useState<DashboardState>({
		user: null,
		stats: {
			totalOrders: 0,
			pendingOrders: 0,
			completedOrders: 0,
			totalSpent: 0,
			wishlistItems: 0,
			recentActivity: [],
		},
		orders: [],
		wishlist: [],
		addresses: [],
		currentSection: "overview",
		isLoading: true,
		error: null,
	});

	// Load user data
	const loadUserData = useCallback(async () => {
		if (!session?.user) return;

		try {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			// Load user profile
			const userResponse = await fetch("/api/dashboard/user");
			const userData: User = await userResponse.json();

			// Load dashboard stats
			const statsResponse = await fetch("/api/dashboard/stats");
			const statsData: DashboardStats = await statsResponse.json();

			// Load orders
			const ordersResponse = await fetch("/api/dashboard/orders");
			const ordersData: Order[] = await ordersResponse.json();

			// Load wishlist
			const wishlistResponse = await fetch("/api/dashboard/wishlist");
			const wishlistData: WishlistItem[] = await wishlistResponse.json();

			// Load addresses
			const addressesResponse = await fetch("/api/dashboard/addresses");
			const addressesData: Address[] = await addressesResponse.json();

			setState((prev) => ({
				...prev,
				user: userData,
				stats: statsData,
				orders: ordersData,
				wishlist: wishlistData,
				addresses: addressesData,
				isLoading: false,
			}));
		} catch (error) {
			console.error("Error loading dashboard data:", error);
			setState((prev) => ({
				...prev,
				error: "Failed to load dashboard data",
				isLoading: false,
			}));
			toast({
				title: "Error",
				description: "Failed to load dashboard data",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	}, [session?.user, toast]);

	// Update current section
	const setCurrentSection = useCallback((section: string) => {
		setState((prev) => ({ ...prev, currentSection: section }));
	}, []);

	// Refresh data
	const refreshData = useCallback(() => {
		loadUserData();
	}, [loadUserData]);

	// Update user profile
	const updateUserProfile = useCallback(
		async (userData: Partial<User>) => {
			try {
				const response = await fetch("/api/dashboard/user", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(userData),
				});

				if (response.ok) {
					const updatedUser: User = await response.json();
					setState((prev) => ({ ...prev, user: updatedUser }));
					toast({
						title: "Success",
						description: "Profile updated successfully",
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					return true;
				} else {
					throw new Error("Failed to update profile");
				}
			} catch (error) {
				console.error("Error updating profile:", error);
				toast({
					title: "Error",
					description: "Failed to update profile",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return false;
			}
		},
		[toast],
	);

	// Add address
	const addAddress = useCallback(
		async (address: Omit<Address, "id">) => {
			try {
				const response = await fetch("/api/dashboard/addresses", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(address),
				});

				if (response.ok) {
					const newAddress: Address = await response.json();
					setState((prev) => ({
						...prev,
						addresses: [...prev.addresses, newAddress],
					}));
					toast({
						title: "Success",
						description: "Address added successfully",
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					return true;
				} else {
					throw new Error("Failed to add address");
				}
			} catch (error) {
				console.error("Error adding address:", error);
				toast({
					title: "Error",
					description: "Failed to add address",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return false;
			}
		},
		[toast],
	);

	// Remove address
	const removeAddress = useCallback(
		async (addressId: string) => {
			try {
				const response = await fetch(`/api/dashboard/addresses/${addressId}`, {
					method: "DELETE",
				});

				if (response.ok) {
					setState((prev) => ({
						...prev,
						addresses: prev.addresses.filter((addr) => addr.id !== addressId),
					}));
					toast({
						title: "Success",
						description: "Address removed successfully",
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					return true;
				} else {
					throw new Error("Failed to remove address");
				}
			} catch (error) {
				console.error("Error removing address:", error);
				toast({
					title: "Error",
					description: "Failed to remove address",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return false;
			}
		},
		[toast],
	);

	// Remove from wishlist
	const removeFromWishlist = useCallback(
		async (itemId: string) => {
			try {
				const response = await fetch(`/api/dashboard/wishlist/${itemId}`, {
					method: "DELETE",
				});

				if (response.ok) {
					setState((prev) => ({
						...prev,
						wishlist: prev.wishlist.filter((item) => item.id !== itemId),
						stats: {
							...prev.stats,
							wishlistItems: prev.stats.wishlistItems - 1,
						},
					}));
					toast({
						title: "Success",
						description: "Item removed from wishlist",
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					return true;
				} else {
					throw new Error("Failed to remove item from wishlist");
				}
			} catch (error) {
				console.error("Error removing from wishlist:", error);
				toast({
					title: "Error",
					description: "Failed to remove item from wishlist",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return false;
			}
		},
		[toast],
	);

	// Load data on mount and session change
	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			loadUserData();
		} else if (status === "unauthenticated") {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	}, [status, session?.user, loadUserData]);

	return {
		// State
		...state,

		// Actions
		setCurrentSection,
		refreshData,
		updateUserProfile,
		addAddress,
		removeAddress,
		removeFromWishlist,

		// Computed
		isAuthenticated: status === "authenticated",
		isLoading: status === "loading" || state.isLoading,
	};
};
