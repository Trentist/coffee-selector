/**
 * Arabic Translations
 * الترجمات العربية
 */

export default {
	// Common translations
	common: {
		// Navigation
		home: "الرئيسية",
		shop: "المتجر",
		about: "من نحن",
		contact: "اتصل بنا",
		login: "تسجيل الدخول",
		register: "إنشاء حساب",
		logout: "تسجيل الخروج",
		profile: "الملف الشخصي",
		settings: "الإعدادات",
		search: "بحث",
		cart: "السلة",
		wishlist: "المفضلة",
		checkout: "إتمام الطلب",
		orders: "الطلبات",
		invoices: "الفواتير",
		dashboard: "لوحة التحكم",

		// Actions
		add: "إضافة",
		edit: "تعديل",
		delete: "حذف",
		save: "حفظ",
		cancel: "إلغاء",
		confirm: "تأكيد",
		submit: "إرسال",
		close: "إغلاق",
		back: "رجوع",
		next: "التالي",
		previous: "السابق",
		continue: "متابعة",
		finish: "إنهاء",
		loading: "جاري التحميل...",
		error: "خطأ",
		success: "نجح",
		warning: "تحذير",
		info: "معلومات",

		// Status
		active: "نشط",
		inactive: "غير نشط",
		pending: "في الانتظار",
		completed: "مكتمل",
		cancelled: "ملغي",
		processing: "قيد المعالجة",
		shipped: "تم الشحن",
		delivered: "تم التوصيل",

		// Messages
		operation_completed_successfully: "تمت العملية بنجاح",
		something_went_wrong: "حدث خطأ ما",
		please_check_your_input: "يرجى التحقق من المدخلات",
		please_note: "يرجى الملاحظة",
		no_data_found: "لا توجد بيانات",
		no_results_found: "لا توجد نتائج",

		// Form
		email: "البريد الإلكتروني",
		password: "كلمة المرور",
		confirm_password: "تأكيد كلمة المرور",
		first_name: "الاسم الأول",
		last_name: "اسم العائلة",
		phone: "رقم الهاتف",
		address: "العنوان",
		city: "المدينة",
		country: "البلد",
		postal_code: "الرمز البريدي",
		required_field: "هذا الحقل مطلوب",
		invalid_email: "بريد إلكتروني غير صحيح",
		password_mismatch: "كلمات المرور غير متطابقة",

		// Currency
		currency: "د.إ",
		price: "السعر",
		total: "المجموع",
		subtotal: "المجموع الفرعي",
		tax: "الضريبة",
		shipping: "الشحن",
		discount: "الخصم",
		free: "مجاني",

		// Time
		today: "اليوم",
		yesterday: "أمس",
		tomorrow: "غداً",
		this_week: "هذا الأسبوع",
		this_month: "هذا الشهر",
		this_year: "هذا العام",

		// Language
		language: "اللغة",
		arabic: "العربية",
		english: "الإنجليزية",

		// Theme
		theme: "المظهر",
		light: "فاتح",
		dark: "داكن",
		auto: "تلقائي",
	},

	// Dashboard translations
	dashboard: {
		overview: "نظرة عامة",
		profile: "الملف الشخصي",
		orders: "الطلبات",
		invoices: "الفواتير",
		order_tracking: "متابعة الطلبات",
		wishlist: "المفضلة",
		addresses: "العناوين",
		settings: "الإعدادات",
		loading_invoices: "جاري تحميل الفواتير...",
		loading_orders: "جاري تحميل الطلبات...",
		invoices_description: "إدارة وعرض جميع الفواتير الخاصة بك",
		order_tracking_description: "متابعة حالة الطلبات والتوصيل",
		invoices_list: "قائمة الفواتير",
		orders_list: "قائمة الطلبات",
		no_invoices: "لا توجد فواتير",
		no_orders: "لا توجد طلبات",
	},

	// Invoices translations
	invoices: {
		number: "رقم الفاتورة",
		date: "التاريخ",
		customer: "العميل",
		total: "المجموع",
		status: "الحالة",
		actions: "الإجراءات",
		view: "عرض",
		download: "تحميل",
		details: "تفاصيل الفاتورة",
		invoice_number: "رقم الفاتورة",
		customer_info: "معلومات العميل",
		items: "المنتجات",
		product: "المنتج",
		quantity: "الكمية",
		price: "السعر",
		due_date: "تاريخ الاستحقاق",
		name: "الاسم",
		phone: "الهاتف",
		status: {
			draft: "مسودة",
			posted: "مرحل",
			paid: "مدفوع",
			cancelled: "ملغي",
		},
	},

	// Orders translations
	orders: {
		number: "رقم الطلب",
		date: "التاريخ",
		customer: "العميل",
		total: "المجموع",
		status: "الحالة",
		delivery_status: "حالة التوصيل",
		progress: "التقدم",
		actions: "الإجراءات",
		view: "عرض",
		details: "تفاصيل الطلب",
		order_number: "رقم الطلب",
		customer_info: "معلومات العميل",
		shipping_info: "معلومات الشحن",
		tracking_progress: "تقدم التتبع",
		tracking_number: "رقم التتبع",
		estimated_delivery: "تاريخ التوصيل المتوقع",
		name: "الاسم",
		phone: "الهاتف",
		status: {
			draft: "مسودة",
			confirmed: "مؤكد",
			sale: "مباع",
			cancelled: "ملغي",
		},
		delivery: {
			pending: "في الانتظار",
			in_transit: "قيد النقل",
			out_for_delivery: "خارج للتوصيل",
			delivered: "تم التوصيل",
			failed: "فشل التوصيل",
		},
	},
};
