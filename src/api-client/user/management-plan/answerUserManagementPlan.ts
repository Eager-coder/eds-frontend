import { ManagementPlanDto } from '@/api-client/manager/management-plans/getManagementPlanById';
import { fetchClient } from '@/lib/client';

export type AnswerUserManagementPlanBody = {
	reasonNonExecution: string | null;
	acknowledgedByUser: boolean;
};

export const answerUserManagementPlan = async (
	id: number,
	data: AnswerUserManagementPlanBody
): Promise<ManagementPlanDto> => {
	const response = await fetchClient(`/management-plans/${id}/status`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});

	const responseData = await response.json();
	return responseData;
};
