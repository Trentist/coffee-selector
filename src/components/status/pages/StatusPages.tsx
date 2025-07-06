/**
 * Status Pages Component
 * Pre-configured status pages for common scenarios
 */

import React from "react";
import { Image, Box } from "@chakra-ui/react";
// // import { motion } from "framer-motion";
import {
	FiShoppingCart,
	FiCheckCircle,
	FiXCircle,
	FiAlertTriangle,
	FiCreditCard,
	FiLoader,
} from "react-icons/fi";
import StatusCard from "../StatusCard";
import { StatusPageProps } from "../types/StatusCard.types";
import {
	getDefaultTitle,
	getDefaultDescription,
	getDefaultButtonText,
	getDefaultButtonLink,
} from "../helpers/StatusCard.helpers";

const MotionBox = Box;

// Empty Cart Page
export const PageCartEmpty: React.FC<StatusPageProps> = (props) => {
	return (
		<StatusCard
			statusType="empty"
			title={props.title || "سلة التسوق فارغة"}
			description={
				props.description ||
				"لم تقم بإضافة أي منتجات إلى سلة التسوق الخاصة بك بعد."
			}
			buttonText={props.buttonText || "تصفح المنتجات"}
			buttonLink={props.buttonLink || "/store/shop"}
			icon={props.icon || <FiShoppingCart size="60px" />}
		/>
	);
};

// Order Success Page
export const PageOrderSuccess: React.FC<StatusPageProps> = (props) => {
	return (
		<StatusCard
			statusType="success"
			title={props.title || "تم تأكيد الطلب!"}
			description={
				props.description || "شكراً لك على شرائك. تمت معالجة طلبك بنجاح."
			}
			buttonText={props.buttonText || "العودة إلى المتجر"}
			buttonLink={props.buttonLink || "/"}
			icon={props.icon || <FiCheckCircle size="60px" />}
		/>
	);
};

// Order Error Page
export const PageOrderError: React.FC<StatusPageProps> = (props) => {
	return (
		<StatusCard
			statusType="error"
			title={props.title || "فشل في إتمام الطلب"}
			description={
				props.description ||
				"حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى أو الاتصال بخدمة العملاء."
			}
			buttonText={props.buttonText || "المحاولة مرة أخرى"}
			buttonLink={props.buttonLink || "/checkout"}
			icon={props.icon || <FiXCircle size="60px" />}
		/>
	);
};

// Payment Success Page
export const PagePaymentSuccess: React.FC<StatusPageProps> = (props) => {
	return (
		<StatusCard
			statusType="payment"
			title={props.title || "تم الدفع بنجاح"}
			description={
				props.description || "شكراً لك على شرائك. تمت معالجة دفعتك بنجاح."
			}
			buttonText={props.buttonText || "العودة إلى المتجر"}
			buttonLink={props.buttonLink || "/"}
			icon={props.icon || <FiCreditCard size="60px" />}
		/>
	);
};

// Payment Error Page
export const PagePaymentError: React.FC<StatusPageProps> = (props) => {
	return (
		<StatusCard
			statusType="error"
			title={props.title || "فشل في عملية الدفع"}
			description={
				props.description ||
				"لم نتمكن من معالجة دفعتك. يرجى التحقق من معلومات الدفع والمحاولة مرة أخرى."
			}
			buttonText={props.buttonText || "إعادة المحاولة"}
			buttonLink={props.buttonLink || "/checkout/payment"}
			icon={props.icon || <FiXCircle size="60px" />}
		/>
	);
};

// Page Not Found
export const PageNotFound: React.FC<StatusPageProps> = (props) => {
	return (
		<StatusCard
			statusType="warning"
			title={props.title || "الصفحة غير موجودة"}
			description={
				props.description ||
				"عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تم نقلها."
			}
			buttonText={props.buttonText || "العودة إلى الصفحة الرئيسية"}
			buttonLink={props.buttonLink || "/"}
			icon={props.icon || <FiAlertTriangle size="60px" />}
		/>
	);
};

// Loading Status
export const LoadingStatus: React.FC<StatusPageProps> = (props) => {
	return (
		<MotionBox p={8} textAlign="center">
			<StatusCard
				statusType="loading"
				title={props.title || "جاري التحميل"}
				description={
					props.description || "يرجى الانتظار بينما نقوم بمعالجة طلبك"
				}
				icon={props.icon || <FiLoader size="60px" className="animate-spin" />}
			/>
		</MotionBox>
	);
};
