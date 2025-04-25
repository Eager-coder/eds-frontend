import { fetchClient } from '@/lib/client';
import { ManagementPlanDto } from './getManagementPlanById';

export type CreateMangementPlanRequest = {
	userDeclarationId: number | null;
	adHocDeclareId: number | null;
	actionRequired: boolean;
	actionId: number;
	actionDetails?: string;
	executionDate: string;
};

export async function createMangementPlan(data: CreateMangementPlanRequest): Promise<ManagementPlanDto> {
	const response = await fetchClient('/management-plans/', {
		method: 'POST',
		body: JSON.stringify(data)
	});

	return await response.json();
}
