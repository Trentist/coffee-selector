import {
	JobsPageData,
	JobData,
} from "../../odoo-schema-full/services/pages.service";

// Mock data for jobs page
const jobsPageData: JobsPageData = {
	title: "الوظائف المتاحة",
	description:
		"انضم إلى فريق Coffee Selection وكن جزءاً من رحلتنا في عالم القهوة المميزة",
	content: `
		<p>نحن في Coffee Selection نبحث دائماً عن مواهب جديدة ومتحمسة للانضمام إلى فريقنا المتميز.</p>
		<p>نؤمن بقيمة كل فرد في فريقنا ونوفر بيئة عمل إيجابية ومحفزة للنمو والتطور المهني.</p>
	`,
	jobs: [
		{
			id: "1",
			title: "مدير متجر",
			description:
				"نبحث عن مدير متجر محترف لإدارة أحد فروعنا في الرياض. يجب أن يكون لديه خبرة في إدارة المبيعات والعملاء.",
			department: "الإدارة",
			location: "الرياض",
			type: "دوام كامل",
			requirements: [
				"خبرة 3-5 سنوات في إدارة المتاجر",
				"مهارات قيادية ممتازة",
				"خبرة في مجال القهوة أو المشروبات",
				"إجادة اللغة العربية والإنجليزية",
			],
			responsibilities: [
				"إدارة فريق العمل",
				"تحقيق أهداف المبيعات",
				"ضمان جودة الخدمة",
				"إدارة المخزون والمشتريات",
			],
			benefits: [
				"راتب تنافسي",
				"تأمين صحي",
				"إجازة سنوية مدفوعة",
				"فرص التطور المهني",
			],
			salaryRange: "8,000 - 12,000 ريال",
			applicationDeadline: "2024-12-31",
			isActive: true,
			createdAt: "2024-01-01",
			updatedAt: "2024-01-01",
			contactEmail: "hr@coffee-selection.com",
		},
		{
			id: "2",
			title: "بارستا محترف",
			description:
				"نبحث عن بارستا محترف ومتحمس للانضمام إلى فريقنا. يجب أن يكون لديه خبرة في تحضير مختلف أنواع القهوة.",
			department: "الإنتاج",
			location: "الرياض",
			type: "دوام كامل",
			requirements: [
				"خبرة 2-3 سنوات كبارستا",
				"معرفة شاملة بأنواع القهوة",
				"مهارات خدمة العملاء",
				"القدرة على العمل تحت الضغط",
			],
			responsibilities: [
				"تحضير القهوة بجودة عالية",
				"خدمة العملاء",
				"الحفاظ على نظافة منطقة العمل",
				"المساعدة في تدريب الموظفين الجدد",
			],
			benefits: ["راتب تنافسي", "عمولات المبيعات", "تأمين صحي", "تدريب مستمر"],
			salaryRange: "4,000 - 6,000 ريال",
			applicationDeadline: "2024-12-31",
			isActive: true,
			createdAt: "2024-01-01",
			updatedAt: "2024-01-01",
			contactEmail: "hr@coffee-selection.com",
		},
		{
			id: "3",
			title: "مطور ويب",
			description:
				"نبحث عن مطور ويب موهوب للمساعدة في تطوير موقعنا الإلكتروني وتطبيقاتنا الرقمية.",
			department: "التقنية",
			location: "عن بعد",
			type: "دوام جزئي",
			requirements: [
				"خبرة في React/Next.js",
				"معرفة بـ TypeScript",
				"خبرة في تطوير واجهات المستخدم",
				"القدرة على العمل بشكل مستقل",
			],
			responsibilities: [
				"تطوير ميزات جديدة للموقع",
				"صيانة وتحسين الأداء",
				"العمل مع فريق التصميم",
				"كتابة كود نظيف ومستند",
			],
			benefits: [
				"راتب تنافسي بالساعة",
				"مرونة في ساعات العمل",
				"فرص العمل عن بعد",
				"تطوير مهارات تقنية",
			],
			salaryRange: "50 - 80 ريال/ساعة",
			applicationDeadline: "2024-12-31",
			isActive: true,
			createdAt: "2024-01-01",
			updatedAt: "2024-01-01",
			contactEmail: "tech@coffee-selection.com",
		},
		{
			id: "4",
			title: "مساعد مبيعات",
			description:
				"نبحث عن مساعد مبيعات متحمس للانضمام إلى فريقنا ومساعدة العملاء في اختيار أفضل المنتجات.",
			department: "المبيعات",
			location: "الرياض",
			type: "دوام كامل",
			requirements: [
				"خبرة في المبيعات أو خدمة العملاء",
				"مهارات تواصل ممتازة",
				"معرفة أساسية بالقهوة",
				"القدرة على العمل في فريق",
			],
			responsibilities: [
				"مساعدة العملاء في اختيار المنتجات",
				"تحقيق أهداف المبيعات",
				"إدارة المخزون",
				"المساعدة في تنظيم المتجر",
			],
			benefits: [
				"راتب أساسي + عمولات",
				"تأمين صحي",
				"تدريب على المنتجات",
				"فرص التطور",
			],
			salaryRange: "3,500 - 5,000 ريال",
			applicationDeadline: "2024-12-31",
			isActive: true,
			createdAt: "2024-01-01",
			updatedAt: "2024-01-01",
			contactEmail: "hr@coffee-selection.com",
		},
	],
};

export const getJobsPageData = async (
	lang: string = "ar",
	limit: number = 10,
	offset: number = 0,
): Promise<{ page: JobsPageData; jobs: JobData[] }> => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Filter jobs based on limit and offset
	const filteredJobs = jobsPageData.jobs.slice(offset, offset + limit);

	return {
		page: {
			title: jobsPageData.title,
			description: jobsPageData.description,
			content: jobsPageData.content,
		},
		jobs: filteredJobs,
	};
};
