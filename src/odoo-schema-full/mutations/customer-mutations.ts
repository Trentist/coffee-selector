/**
 * Customer GraphQL Mutations
 * طلبات GraphQL للعملاء - جميع الطفرات المتعلقة بالعملاء والعناوين
 */

import { gql } from "graphql-request";

// ============================================================================
// CUSTOMER MANAGEMENT MUTATIONS
// ============================================================================

export const CREATE_CUSTOMER_MUTATION = gql`
	mutation CreateCustomer($input: CustomerInput!) {
		createCustomer(input: $input) {
			customer {
				id
				name
				email
				phone
				street
				city
				country
				is_company
				vat
				active
				created_at
			}
			success
			message
		}
	}
`;

export const UPDATE_CUSTOMER_MUTATION = gql`
	mutation UpdateCustomer($customerId: Int!, $input: CustomerInput!) {
		updateCustomer(customerId: $customerId, input: $input) {
			customer {
				id
				name
				email
				phone
				street
				city
				country
				is_company
				vat
				active
				updated_at
			}
			success
			message
		}
	}
`;

export const DEACTIVATE_CUSTOMER_MUTATION = gql`
	mutation DeactivateCustomer($customerId: Int!, $reason: String) {
		deactivateCustomer(customerId: $customerId, reason: $reason) {
			success
			message
		}
	}
`;

export const REACTIVATE_CUSTOMER_MUTATION = gql`
	mutation ReactivateCustomer($customerId: Int!) {
		reactivateCustomer(customerId: $customerId) {
			success
			message
		}
	}
`;

// ============================================================================
// ADDRESS MANAGEMENT MUTATIONS
// ============================================================================

export const ADD_CUSTOMER_ADDRESS_MUTATION = gql`
	mutation AddCustomerAddress($customerId: Int!, $input: AddressInput!) {
		addCustomerAddress(customerId: $customerId, input: $input) {
			address {
				id
				customer_id
				name
				street
				city
				state
				country
				zip
				phone
				is_default_shipping
				is_default_billing
				created_at
			}
			success
			message
		}
	}
`;

export const UPDATE_CUSTOMER_ADDRESS_MUTATION = gql`
	mutation UpdateCustomerAddress($addressId: Int!, $input: AddressInput!) {
		updateCustomerAddress(addressId: $addressId, input: $input) {
			address {
				id
				customer_id
				name
				street
				city
				state
				country
				zip
				phone
				is_default_shipping
				is_default_billing
				updated_at
			}
			success
			message
		}
	}
`;

export const DELETE_CUSTOMER_ADDRESS_MUTATION = gql`
	mutation DeleteCustomerAddress($addressId: Int!) {
		deleteCustomerAddress(addressId: $addressId) {
			success
			message
		}
	}
`;

export const SET_DEFAULT_SHIPPING_ADDRESS_MUTATION = gql`
	mutation SetDefaultShippingAddress($addressId: Int!) {
		setDefaultShippingAddress(addressId: $addressId) {
			success
			message
		}
	}
`;

export const SET_DEFAULT_BILLING_ADDRESS_MUTATION = gql`
	mutation SetDefaultBillingAddress($addressId: Int!) {
		setDefaultBillingAddress(addressId: $addressId) {
			success
			message
		}
	}
`;

// ============================================================================
// GUEST CUSTOMER MANAGEMENT MUTATIONS
// ============================================================================

export const CREATE_GUEST_CUSTOMER_MUTATION = gql`
	mutation CreateGuestCustomer($input: GuestCustomerInput!) {
		createGuestCustomer(input: $input) {
			customer {
				id
				name
				email
				phone
				street
				city
				country
				is_guest
				created_at
			}
			success
			message
		}
	}
`;

export const CONVERT_GUEST_TO_REGISTERED_MUTATION = gql`
	mutation ConvertGuestToRegistered($guestId: Int!, $input: RegisterInput!) {
		convertGuestToRegistered(guestId: $guestId, input: $input) {
			customer {
				id
				name
				email
				phone
				street
				city
				country
				is_guest
				user_id
				created_at
			}
			success
			message
		}
	}
`;

// ============================================================================
// CUSTOMER PREFERENCES MUTATIONS
// ============================================================================

export const UPDATE_CUSTOMER_PREFERENCES_MUTATION = gql`
	mutation UpdateCustomerPreferences(
		$customerId: Int!
		$input: CustomerPreferencesInput!
	) {
		updateCustomerPreferences(customerId: $customerId, input: $input) {
			preferences {
				id
				customer_id
				language
				currency
				timezone
				newsletter_subscription
				marketing_emails
				sms_notifications
				updated_at
			}
			success
			message
		}
	}
`;

export const SUBSCRIBE_NEWSLETTER_MUTATION = gql`
	mutation SubscribeNewsletter($customerId: Int!, $subscribe: Boolean!) {
		subscribeNewsletter(customerId: $customerId, subscribe: $subscribe) {
			success
			message
		}
	}
`;

export const UPDATE_MARKETING_PREFERENCES_MUTATION = gql`
	mutation UpdateMarketingPreferences(
		$customerId: Int!
		$input: MarketingPreferencesInput!
	) {
		updateMarketingPreferences(customerId: $customerId, input: $input) {
			preferences {
				id
				customer_id
				email_marketing
				sms_marketing
				push_notifications
				updated_at
			}
			success
			message
		}
	}
`;

// ============================================================================
// CUSTOMER NOTES MUTATIONS
// ============================================================================

export const ADD_CUSTOMER_NOTE_MUTATION = gql`
	mutation AddCustomerNote($customerId: Int!, $input: CustomerNoteInput!) {
		addCustomerNote(customerId: $customerId, input: $input) {
			note {
				id
				customer_id
				content
				type
				created_by
				created_at
			}
			success
			message
		}
	}
`;

export const UPDATE_CUSTOMER_NOTE_MUTATION = gql`
	mutation UpdateCustomerNote($noteId: Int!, $input: CustomerNoteInput!) {
		updateCustomerNote(noteId: $noteId, input: $input) {
			note {
				id
				customer_id
				content
				type
				updated_by
				updated_at
			}
			success
			message
		}
	}
`;

export const DELETE_CUSTOMER_NOTE_MUTATION = gql`
	mutation DeleteCustomerNote($noteId: Int!) {
		deleteCustomerNote(noteId: $noteId) {
			success
			message
		}
	}
`;

// ============================================================================
// CUSTOMER TAGS MUTATIONS
// ============================================================================

export const ADD_CUSTOMER_TAG_MUTATION = gql`
	mutation AddCustomerTag($customerId: Int!, $tagId: Int!) {
		addCustomerTag(customerId: $customerId, tagId: $tagId) {
			success
			message
		}
	}
`;

export const REMOVE_CUSTOMER_TAG_MUTATION = gql`
	mutation RemoveCustomerTag($customerId: Int!, $tagId: Int!) {
		removeCustomerTag(customerId: $customerId, tagId: $tagId) {
			success
			message
		}
	}
`;

// ============================================================================
// CUSTOMER CREDIT LIMIT MUTATIONS
// ============================================================================

export const UPDATE_CUSTOMER_CREDIT_LIMIT_MUTATION = gql`
	mutation UpdateCustomerCreditLimit($customerId: Int!, $creditLimit: Float!) {
		updateCustomerCreditLimit(
			customerId: $customerId
			creditLimit: $creditLimit
		) {
			customer {
				id
				name
				credit_limit
				updated_at
			}
			success
			message
		}
	}
`;

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface CustomerInput {
	name: string;
	email: string;
	phone?: string;
	street?: string;
	city?: string;
	country?: string;
	is_company?: boolean;
	vat?: string;
	active?: boolean;
}

export interface GuestCustomerInput {
	name: string;
	email: string;
	phone?: string;
	street?: string;
	city?: string;
	country?: string;
}

export interface AddressInput {
	name: string;
	street: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	phone: string;
	is_default_shipping?: boolean;
	is_default_billing?: boolean;
}

export interface CustomerPreferencesInput {
	language?: string;
	currency?: string;
	timezone?: string;
	newsletter_subscription?: boolean;
	marketing_emails?: boolean;
	sms_notifications?: boolean;
}

export interface MarketingPreferencesInput {
	email_marketing: boolean;
	sms_marketing: boolean;
	push_notifications: boolean;
}

export interface CustomerNoteInput {
	content: string;
	type: string;
}

export interface RegisterInput {
	name: string;
	email: string;
	password: string;
	phone?: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface Customer {
	id: number;
	name: string;
	email: string;
	phone?: string;
	street?: string;
	city?: string;
	country?: string;
	is_company: boolean;
	vat?: string;
	active: boolean;
	is_guest?: boolean;
	user_id?: number;
	credit_limit?: number;
	created_at: string;
	updated_at?: string;
}

export interface CustomerAddress {
	id: number;
	customer_id: number;
	name: string;
	street: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	phone: string;
	is_default_shipping: boolean;
	is_default_billing: boolean;
	created_at: string;
	updated_at?: string;
}

export interface CustomerPreferences {
	id: number;
	customer_id: number;
	language: string;
	currency: string;
	timezone: string;
	newsletter_subscription: boolean;
	marketing_emails: boolean;
	sms_notifications: boolean;
	updated_at: string;
}

export interface MarketingPreferences {
	id: number;
	customer_id: number;
	email_marketing: boolean;
	sms_marketing: boolean;
	push_notifications: boolean;
	updated_at: string;
}

export interface CustomerNote {
	id: number;
	customer_id: number;
	content: string;
	type: string;
	created_by: number;
	updated_by?: number;
	created_at: string;
	updated_at?: string;
}

export interface CustomerTag {
	id: number;
	name: string;
	color?: string;
	description?: string;
}

export interface CustomerMutationResult {
	success: boolean;
	message?: string;
	error?: string;
	customer?: Customer;
	address?: CustomerAddress;
	preferences?: CustomerPreferences;
	marketingPreferences?: MarketingPreferences;
	note?: CustomerNote;
}
