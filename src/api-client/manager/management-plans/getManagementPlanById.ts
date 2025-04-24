import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchClient } from '@/lib/client';
import { DeclarationUserDto } from '../getUserInitialDeclarations';

export enum ManagementPlanStatus {
	'CREATED' = 'CREATED',
	'SENT_FOR_CONFIRMATION' = 'SENT_FOR_CONFIRMATION',
	'AGREED' = 'AGREED',
	'REFUSED' = 'REFUSED'
}

export type ManagementPlanDto = {
	id: number;
	userDeclarationId: number;
	adHocId: number;
	creationDate: string;
	createdBy: DeclarationUserDto;
	status: ManagementPlanStatus;
	isDeleted: boolean;
	isAmended: boolean;
	actionRequired: boolean;
	actionId: number | null;
	actionDetails: string;
	executionDate: string;
	notificationDate: string | null;
	confirmationDate: string | null;
	reasonNonExecution: string;
	acknowledgedByUser: boolean | null;
	ensuredByManager: boolean;
	userDisagreementReason: string | null;
};

export async function getManagementPlanById(id: number): Promise<ManagementPlanDto> {
	const response = await fetchClient(`/management-plans/${id}`);
	if (!response.ok) {
		throw new Error('Failed to fetch management plan');
	}
	return response.json();
}

export const managementPlanByIdKey = (id: number) => ['managementPlan', id] as const;

export function useManagementPlanById(
	id: number,
	options?: UseQueryOptions<
		ManagementPlanDto, // data type
		Error, // error type
		ManagementPlanDto, // select type
		ReturnType<typeof managementPlanByIdKey> // queryKey tuple
	>
) {
	return useQuery({
		queryKey: managementPlanByIdKey(id),
		queryFn: () => getManagementPlanById(id),
		retry: 1,
		...options
	});
}
