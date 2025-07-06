/**
 * Stats Helpers
 * مساعدات الإحصائيات
 */

import { DashboardStats } from '../types/dashboard.types';

export const formatCurrency = (amount: number, currency: string = 'AED'): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);
};

export const formatPercentage = (value: number): string => {
	return `${value > 0 ? '+' : ''}${value}%`;
};

export const getStatsData = (stats: DashboardStats | null) => {
	if (!stats) return [];

	return [
		{
			label: 'Total Orders',
			value: stats.totalOrders,
			icon: 'FaShoppingCart',
			color: 'blue',
			change: '+12%',
			isIncrease: true,
		},
		{
			label: 'Total Revenue',
			value: formatCurrency(stats.totalSpent),
			icon: 'FaMoneyBillWave',
			color: 'green',
			change: '+8.5%',
			isIncrease: true,
		},
		{
			label: 'Wishlist Items',
			value: stats.wishlistItems,
			icon: 'FaHeart',
			color: 'pink',
			change: '+3%',
			isIncrease: true,
		},
	];
};