/**
 * Favorites Button Component - مكون زر المفضلة
 */

import React, { useState } from "react";
import { useProductFavorites } from "../hooks/useFavorites";
import { FavoriteItem } from "../types";
import { FavoritesService } from "../favorites.service";

interface FavoritesButtonProps {
	product: FavoriteItem["product"];
	favoritesService: FavoritesService;
	variant?: "icon" | "text" | "full";
	size?: "sm" | "md" | "lg";
	showAddToCart?: boolean;
	className?: string;
	onSuccess?: (message: string) => void;
	onError?: (error: string) => void;
}

export const FavoritesButton: React.FC<FavoritesButtonProps> = ({
	product,
	favoritesService,
	variant = "icon",
	size = "md",
	showAddToCart = false,
	className = "",
	onSuccess,
	onError,
}) => {
	const { isInFavorites, addToFavorites, removeFromFavorites } =
		useProductFavorites(favoritesService, product?.id || "");

	const [loading, setLoading] = useState(false);

	const handleToggleFavorites = async () => {
		if (!product) return;

		setLoading(true);
		try {
			if (isInFavorites) {
				const result = await removeFromFavorites();
				if (result.success) {
					onSuccess?.("تم حذف المنتج من المفضلة");
				} else {
					onError?.(result.message);
				}
			} else {
				const result = await addToFavorites(product, showAddToCart);
				if (result.success) {
					onSuccess?.(result.message);
				} else {
					onError?.(result.message);
				}
			}
		} catch (error) {
			onError?.(error instanceof Error ? error.message : "خطأ غير متوقع");
		} finally {
			setLoading(false);
		}
	};

	const getButtonContent = () => {
		if (variant === "icon") {
			return (
				<div
					className={`favorites-icon ${isInFavorites ? "active" : ""} ${loading ? "loading" : ""}`}>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill={isInFavorites ? "currentColor" : "none"}
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</div>
			);
		}

		if (variant === "text") {
			return (
				<span className={`favorites-text ${isInFavorites ? "active" : ""}`}>
					{isInFavorites ? "إزالة من المفضلة" : "إضافة للمفضلة"}
				</span>
			);
		}

		return (
			<div className={`favorites-full ${isInFavorites ? "active" : ""}`}>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill={isInFavorites ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
				</svg>
				<span>{isInFavorites ? "إزالة من المفضلة" : "إضافة للمفضلة"}</span>
			</div>
		);
	};

	return (
		<button
			onClick={handleToggleFavorites}
			disabled={loading || !product}
			className={`
        favorites-button
        favorites-button--${variant}
        favorites-button--${size}
        ${isInFavorites ? "favorites-button--active" : ""}
        ${loading ? "favorites-button--loading" : ""}
        ${className}
      `}
			title={isInFavorites ? "إزالة من المفضلة" : "إضافة للمفضلة"}>
			{getButtonContent()}
		</button>
	);
};
