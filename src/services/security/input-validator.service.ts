/**
 * Input Validator Service
 * خدمة التحقق من المدخلات للأمان
 */

interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string[]>;
	sanitizedData?: any;
}

interface LoginData {
	email: string;
	password: string;
}

interface RegisterData {
	name: string;
	email: string;
	password: string;
	confirmPassword?: string;
}

class InputValidatorService {
	/**
	 * Validate login data
	 */
	validateLoginData(data: LoginData): ValidationResult {
		const errors: Record<string, string[]> = {};

		// Email validation
		if (!data.email) {
			errors.email = ["البريد الإلكتروني مطلوب"];
		} else {
			const email = this.sanitizeEmail(data.email);
			if (!this.isValidEmail(email)) {
				errors.email = ["البريد الإلكتروني غير صحيح"];
			}
		}

		// Password validation
		if (!data.password) {
			errors.password = ["كلمة المرور مطلوبة"];
		} else if (data.password.length < 6) {
			errors.password = ["كلمة المرور يجب أن تكون 6 أحرف على الأقل"];
		}

		const isValid = Object.keys(errors).length === 0;

		return {
			isValid,
			errors,
			sanitizedData: isValid
				? {
						email: this.sanitizeEmail(data.email),
						password: data.password,
					}
				: undefined,
		};
	}

	/**
	 * Validate registration data
	 */
	validateRegisterData(data: RegisterData): ValidationResult {
		const errors: Record<string, string[]> = {};

		// Name validation
		if (!data.name) {
			errors.name = ["الاسم مطلوب"];
		} else {
			const name = this.sanitizeName(data.name);
			if (name.length < 2) {
				errors.name = ["الاسم يجب أن يكون حرفين على الأقل"];
			} else if (name.length > 50) {
				errors.name = ["الاسم يجب أن يكون أقل من 50 حرف"];
			}
		}

		// Email validation
		if (!data.email) {
			errors.email = ["البريد الإلكتروني مطلوب"];
		} else {
			const email = this.sanitizeEmail(data.email);
			if (!this.isValidEmail(email)) {
				errors.email = ["البريد الإلكتروني غير صحيح"];
			}
		}

		// Password validation
		if (!data.password) {
			errors.password = ["كلمة المرور مطلوبة"];
		} else {
			const passwordErrors = this.validatePassword(data.password);
			if (passwordErrors.length > 0) {
				errors.password = passwordErrors;
			}
		}

		// Confirm password validation
		if (data.confirmPassword !== undefined) {
			if (!data.confirmPassword) {
				errors.confirmPassword = ["تأكيد كلمة المرور مطلوب"];
			} else if (data.password !== data.confirmPassword) {
				errors.confirmPassword = ["كلمة المرور غير متطابقة"];
			}
		}

		const isValid = Object.keys(errors).length === 0;

		return {
			isValid,
			errors,
			sanitizedData: isValid
				? {
						name: this.sanitizeName(data.name),
						email: this.sanitizeEmail(data.email),
						password: data.password,
					}
				: undefined,
		};
	}

	/**
	 * Validate password strength
	 */
	private validatePassword(password: string): string[] {
		const errors: string[] = [];

		if (password.length < 6) {
			errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
		}

		if (password.length > 128) {
			errors.push("كلمة المرور يجب أن تكون أقل من 128 حرف");
		}

		// Optional: Add more password strength requirements
		// if (!/[A-Z]/.test(password)) {
		//   errors.push("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل");
		// }

		// if (!/[a-z]/.test(password)) {
		//   errors.push("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل");
		// }

		// if (!/\d/.test(password)) {
		//   errors.push("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
		// }

		return errors;
	}

	/**
	 * Validate email format
	 */
	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Sanitize email
	 */
	private sanitizeEmail(email: string): string {
		return email.trim().toLowerCase();
	}

	/**
	 * Sanitize name
	 */
	private sanitizeName(name: string): string {
		return name.trim().replace(/\s+/g, " ");
	}

	/**
	 * Sanitize general text input
	 */
	sanitizeText(text: string, maxLength: number = 1000): string {
		return text
			.trim()
			.replace(/[<>]/g, "") // Remove potential HTML tags
			.substring(0, maxLength);
	}

	/**
	 * Validate and sanitize phone number
	 */
	validatePhoneNumber(phone: string): ValidationResult {
		const errors: Record<string, string[]> = {};

		if (!phone) {
			errors.phone = ["رقم الهاتف مطلوب"];
		} else {
			const sanitizedPhone = phone.replace(/\D/g, ""); // Remove non-digits
			if (sanitizedPhone.length < 10) {
				errors.phone = ["رقم الهاتف غير صحيح"];
			}
		}

		const isValid = Object.keys(errors).length === 0;

		return {
			isValid,
			errors,
			sanitizedData: isValid
				? {
						phone: phone.replace(/\D/g, ""),
					}
				: undefined,
		};
	}

	/**
	 * Validate and sanitize address
	 */
	validateAddress(address: string): ValidationResult {
		const errors: Record<string, string[]> = {};

		if (!address) {
			errors.address = ["العنوان مطلوب"];
		} else {
			const sanitizedAddress = this.sanitizeText(address, 200);
			if (sanitizedAddress.length < 10) {
				errors.address = ["العنوان يجب أن يكون 10 أحرف على الأقل"];
			}
		}

		const isValid = Object.keys(errors).length === 0;

		return {
			isValid,
			errors,
			sanitizedData: isValid
				? {
						address: this.sanitizeText(address, 200),
					}
				: undefined,
		};
	}

	/**
	 * Validate file upload
	 */
	validateFileUpload(
		file: File,
		options: {
			maxSize?: number; // in bytes
			allowedTypes?: string[];
		} = {},
	): ValidationResult {
		const errors: Record<string, string[]> = {};
		const {
			maxSize = 5 * 1024 * 1024,
			allowedTypes = ["image/jpeg", "image/png", "image/webp"],
		} = options;

		if (!file) {
			errors.file = ["الملف مطلوب"];
		} else {
			// Check file size
			if (file.size > maxSize) {
				errors.file = [
					`حجم الملف يجب أن يكون أقل من ${Math.round(maxSize / 1024 / 1024)}MB`,
				];
			}

			// Check file type
			if (!allowedTypes.includes(file.type)) {
				errors.file = [
					`نوع الملف غير مسموح به. الأنواع المسموحة: ${allowedTypes.join(", ")}`,
				];
			}
		}

		const isValid = Object.keys(errors).length === 0;

		return {
			isValid,
			errors,
			sanitizedData: isValid ? { file } : undefined,
		};
	}

	/**
	 * Validate search query
	 */
	validateSearchQuery(query: string): ValidationResult {
		const errors: Record<string, string[]> = {};

		if (!query) {
			errors.query = ["نص البحث مطلوب"];
		} else {
			const sanitizedQuery = this.sanitizeText(query, 100);
			if (sanitizedQuery.length < 2) {
				errors.query = ["نص البحث يجب أن يكون حرفين على الأقل"];
			}
		}

		const isValid = Object.keys(errors).length === 0;

		return {
			isValid,
			errors,
			sanitizedData: isValid
				? {
						query: this.sanitizeText(query, 100),
					}
				: undefined,
		};
	}
}

export const inputValidatorService = new InputValidatorService();
