/**
 * Share Button Component - مكون زر المشاركة
 */

import React, { useState } from "react";
import { useFavoritesSharing } from "../hooks/useFavorites";
import { FavoriteItem } from "../types";
import { FavoritesService } from "../favorites.service";

interface ShareButtonProps {
	favorite: FavoriteItem;
	favoritesService: FavoritesService;
	variant?: "icon" | "dropdown" | "modal";
	platforms?: string[];
	className?: string;
	onSuccess?: (platform: string) => void;
	onError?: (error: string) => void;
}

const DEFAULT_PLATFORMS = [
	"facebook",
	"twitter",
	"whatsapp",
	"telegram",
	"email",
];

export const ShareButton: React.FC<ShareButtonProps> = ({
	favorite,
	favoritesService,
	variant = "dropdown",
	platforms = DEFAULT_PLATFORMS,
	className = "",
	onSuccess,
	onError,
}) => {
	const { shareProduct, generateProductCard } =
		useFavoritesSharing(favoritesService);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleShare = (platform: string) => {
		try {
			const result = shareProduct(favorite, platform);

			if (result.success) {
				onSuccess?.(platform);
				setShowDropdown(false);
				setShowModal(false);
			} else {
				onError?.(result.error || "فشل في المشاركة");
			}
		} catch (error) {
			onError?.(error instanceof Error ? error.message : "خطأ غير متوقع");
		}
	};

	const handleCopyLink = async () => {
		try {
			const baseUrl =
				typeof window !== "undefined"
					? window.location.origin
					: "https://coffee-selection.com";
			const productUrl = `${baseUrl}/product/${favorite.product?.slug}`;

			if (navigator.clipboard) {
				await navigator.clipboard.writeText(productUrl);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
				onSuccess?.("copy");
			} else {
				// Fallback for older browsers
				const textArea = document.createElement("textarea");
				textArea.value = productUrl;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
				onSuccess?.("copy");
			}
		} catch (error) {
			onError?.("فشل في نسخ الرابط");
		}
	};

	const handleDownloadCard = () => {
		try {
			const cardHtml = generateProductCard(favorite);
			const blob = new Blob([cardHtml], { type: "text/html" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${favorite.product?.name || "product"}-card.html`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			onSuccess?.("download");
		} catch (error) {
			onError?.("فشل في تحميل البطاقة");
		}
	};

	const getPlatformIcon = (platform: string) => {
		switch (platform) {
			case "facebook":
				return (
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
					</svg>
				);
			case "twitter":
				return (
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
					</svg>
				);
			case "whatsapp":
				return (
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
					</svg>
				);
			case "telegram":
				return (
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
					</svg>
				);
			case "email":
				return (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
						<polyline points="22,6 12,13 2,6" />
					</svg>
				);
			default:
				return (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2">
						<circle cx="18" cy="5" r="3" />
						<circle cx="6" cy="12" r="3" />
						<circle cx="18" cy="19" r="3" />
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
					</svg>
				);
		}
	};

	const getPlatformName = (platform: string) => {
		const names: Record<string, string> = {
			facebook: "فيسبوك",
			twitter: "تويتر",
			whatsapp: "واتساب",
			telegram: "تليجرام",
			email: "البريد الإلكتروني",
			copy: "نسخ الرابط",
			download: "تحميل البطاقة",
		};
		return names[platform] || platform;
	};

	if (variant === "icon") {
		return (
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				className={`share-button share-button--icon ${className}`}
				title="مشاركة المنتج">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2">
					<circle cx="18" cy="5" r="3" />
					<circle cx="6" cy="12" r="3" />
					<circle cx="18" cy="19" r="3" />
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>

				{showDropdown && (
					<div className="share-dropdown">
						{platforms.map((platform) => (
							<button
								key={platform}
								onClick={() => handleShare(platform)}
								className="share-dropdown-item">
								{getPlatformIcon(platform)}
								<span>{getPlatformName(platform)}</span>
							</button>
						))}
						<button onClick={handleCopyLink} className="share-dropdown-item">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
								<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
							</svg>
							<span>{copied ? "تم النسخ!" : "نسخ الرابط"}</span>
						</button>
					</div>
				)}
			</button>
		);
	}

	if (variant === "modal") {
		return (
			<>
				<button
					onClick={() => setShowModal(true)}
					className={`share-button share-button--modal ${className}`}
					title="مشاركة المنتج">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2">
						<circle cx="18" cy="5" r="3" />
						<circle cx="6" cy="12" r="3" />
						<circle cx="18" cy="19" r="3" />
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
					</svg>
					<span>مشاركة</span>
				</button>

				{showModal && (
					<div
						className="share-modal-overlay"
						onClick={() => setShowModal(false)}>
						<div className="share-modal" onClick={(e) => e.stopPropagation()}>
							<div className="share-modal-header">
								<h3>مشاركة المنتج</h3>
								<button
									onClick={() => setShowModal(false)}
									className="share-modal-close">
									×
								</button>
							</div>

							<div className="share-modal-content">
								<div className="share-product-info">
									<img
										src={favorite.product?.image}
										alt={favorite.product?.name}
									/>
									<div>
										<h4>{favorite.product?.name}</h4>
										<p>{favorite.product?.price} درهم</p>
									</div>
								</div>

								<div className="share-platforms">
									{platforms.map((platform) => (
										<button
											key={platform}
											onClick={() => handleShare(platform)}
											className="share-platform-button">
											{getPlatformIcon(platform)}
											<span>{getPlatformName(platform)}</span>
										</button>
									))}
								</div>

								<div className="share-actions">
									<button
										onClick={handleCopyLink}
										className="share-action-button">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2">
											<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
											<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
										</svg>
										<span>{copied ? "تم النسخ!" : "نسخ الرابط"}</span>
									</button>

									<button
										onClick={handleDownloadCard}
										className="share-action-button">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2">
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="7,10 12,15 17,10" />
											<line x1="12" y1="15" x2="12" y2="3" />
										</svg>
										<span>تحميل البطاقة</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}

	// Default dropdown variant
	return (
		<div className={`share-button-container ${className}`}>
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				className="share-button share-button--dropdown"
				title="مشاركة المنتج">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2">
					<circle cx="18" cy="5" r="3" />
					<circle cx="6" cy="12" r="3" />
					<circle cx="18" cy="19" r="3" />
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>
				<span>مشاركة</span>
			</button>

			{showDropdown && (
				<div className="share-dropdown">
					{platforms.map((platform) => (
						<button
							key={platform}
							onClick={() => handleShare(platform)}
							className="share-dropdown-item">
							{getPlatformIcon(platform)}
							<span>{getPlatformName(platform)}</span>
						</button>
					))}
					<button onClick={handleCopyLink} className="share-dropdown-item">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2">
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
						</svg>
						<span>{copied ? "تم النسخ!" : "نسخ الرابط"}</span>
					</button>
				</div>
			)}
		</div>
	);
};
