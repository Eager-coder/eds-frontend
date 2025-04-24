import { fetchClient } from '@/lib/client';
import { ManagementPlanDto } from '../manager/management-plans/getManagementPlanById';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export const getUIDManagementPlans = async (id: number): Promise<ManagementPlanDto[]> => {
	const response = await fetchClient(`/management-plans/user-declaration/${id}`);

	if (!response.ok) {
		throw new Error('Failed to fetch management plans');
	}

	return await response.json();
};

/**
 * Custom hook to fetch management plans for a user declaration
 * @param id - User declaration ID
 * @param options - Additional query options
 * @returns Query result with management plans data
 */
export const useGetUIDManagementPlans = (
	id?: number,
	options?: Partial<UseQueryOptions<ManagementPlanDto[], Error, ManagementPlanDto[], [string, number | undefined]>>
): UseQueryResult<ManagementPlanDto[], Error> => {
	return useQuery<ManagementPlanDto[], Error, ManagementPlanDto[], [string, number | undefined]>({
		queryKey: ['uidManagementPlans', id],
		queryFn: id !== undefined ? () => getUIDManagementPlans(id) : () => Promise.resolve([]),
		enabled: id !== undefined,
		...options
	});
};
