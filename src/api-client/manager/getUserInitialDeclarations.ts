import { fetchClient } from '@/lib/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export enum UIDStatus {
	'CREATED' = 'CREATED',
	'SENT_FOR_APPROVAL' = 'SENT_FOR_APPROVAL',
	'ACTUAL_CONFLICT' = 'ACTUAL_CONFLICT',
	'PERCEIVED_CONFLICT' = 'PERCEIVED_CONFLICT',
	'NO_CONFLICT' = 'NO_CONFLICT',
	'APPROVED' = 'APPROVED'
}

export type DeclarationUserDto = {
	id: number;
	email: string;
	lastname: string;
	firstname: string;
	middlename: string | null;
	role: 'USER' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';
	position: string;
	department: string;
	isActive: boolean;
	isDeleted: boolean | null;
	registrationDate: string;
};

export type UserDeclarationListItem = {
	id: number;
	user: DeclarationUserDto;
	declarationId: number;
	declarationTitle: string;
	creationDate: string;
	status: UIDStatus;
	responsible: DeclarationUserDto;
	createdBy: DeclarationUserDto;
	responsibleName: string;
	isDeleted: boolean;
};

export const getUserInitialDeclarations = async (): Promise<UserDeclarationListItem[]> => {
	const response = await fetchClient('/initial-declarations/answers');

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
		} catch (e) {
			console.log(e);
		}
		const errorMessage =
			errorData?.message || response.statusText || `Request failed with status ${response.status}`;
		console.error('Fetch User Declarations List API Error:', errorData);
		throw new Error(errorMessage);
	}

	return await response.json();
};

export const USER_INITIAL_DECLARATIONS_LIST_QUERY_KEY = ['userInitialDeclarationsList'] as const;

export function useUserInitialDeclarations(
	options?: UseQueryOptions<
		UserDeclarationListItem[],
		Error,
		UserDeclarationListItem[],
		typeof USER_INITIAL_DECLARATIONS_LIST_QUERY_KEY
	>
) {
	return useQuery<
		UserDeclarationListItem[],
		Error,
		UserDeclarationListItem[],
		typeof USER_INITIAL_DECLARATIONS_LIST_QUERY_KEY
	>({
		queryFn: getUserInitialDeclarations,
		queryKey: USER_INITIAL_DECLARATIONS_LIST_QUERY_KEY,
		retry: 1,
		...options
	});
}
