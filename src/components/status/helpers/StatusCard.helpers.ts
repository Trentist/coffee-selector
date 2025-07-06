/**
 * Status Card Helpers
 * مساعدات بطاقة الحالة
 */

import { StatusCardProps, StatusType } from '../types/StatusCard.types';
import {
	FaShoppingCart,
	FaCheckCircle,
	FaTimesCircle,
	FaExclamationTriangle,
	FaCreditCard,
	FaSpinner,
} from 'react-icons/fa';

/**
 * Get status configuration based on type
 */
export const getStatusConfig = (type: StatusType) => {
	switch (type) {
		case 'success':
			return {
				icon: 'check-circle',
				color: 'green',
				bgColor: 'green.50',
				title: 'Success',
				description: 'Operation completed successfully',
			};
		case 'error':
			return {
				icon: 'x-circle',
				color: 'red',
				bgColor: 'red.50',
				title: 'Error',
				description: 'Something went wrong',
			};
		case 'warning':
			return {
				icon: 'alert-triangle',
				color: 'yellow',
				bgColor: 'yellow.50',
				title: 'Warning',
				description: 'Please review the information',
			};
		case 'info':
			return {
				icon: 'info',
				color: 'blue',
				bgColor: 'blue.50',
				title: 'Information',
				description: 'Here is some information',
			};
		default:
			return {
				icon: 'help-circle',
				color: 'gray',
				bgColor: 'gray.50',
				title: 'Status',
				description: 'Status information',
			};
	}
};

/**
 * Get default titles for status types
 */
export const getDefaultTitle = (type: StatusType, customTitle?: string) => {
	if (customTitle) return customTitle;
	return getStatusConfig(type).title;
};

/**
 * Get default descriptions for status types
 */
export const getDefaultDescription = (type: StatusType, customDescription?: string) => {
	if (customDescription) return customDescription;
	return getStatusConfig(type).description;
};

/**
 * Get default button text for status types
 */
export const getDefaultButtonText = (type: StatusType, customButtonText?: string) => {
	if (customButtonText) return customButtonText;

	switch (type) {
		case 'success':
			return 'Continue';
		case 'error':
			return 'Try Again';
		case 'warning':
			return 'Review';
		case 'info':
			return 'Got It';
		default:
			return 'OK';
	}
};

/**
 * Get default button link for status types
 */
export const getDefaultButtonLink = (type: StatusType, customButtonLink?: string) => {
	if (customButtonLink) return customButtonLink;

	switch (type) {
		case 'success':
			return '/dashboard';
		case 'error':
			return '/';
		case 'warning':
			return '/dashboard';
		case 'info':
			return '/dashboard';
		default:
			return '/';
	}
};

/**
 * Validate status card props
 */
export const validateStatusCardProps = (props: any): boolean => {
	return props.statusType && props.title && props.description;
};

/**
 * Get animation variants for status card
 */
export const getAnimationVariants = () => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
	transition: { duration: 0.5 },
});