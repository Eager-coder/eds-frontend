import { ManagementPlanDto } from '@/api-client/manager/management-plans/getManagementPlanById';
import { fetchClient } from '@/lib/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

/**
 * Fetches the current user's management plans.
 */
export const getUserManagementPlans = async (): Promise<ManagementPlanDto[]> => {
	const response = await fetchClient('/management-plans/my-plans');
	if (!response.ok) {
		throw new Error('Failed to fetch user management plans');
	}
	return response.json();
};

/**
 * Stable query key for fetching user management plans.
 */
export const USER_MANAGEMENT_PLANS_QUERY_KEY = ['userManagementPlans'] as const;

/**
 * React Query hook to load the current user's management plans.
 *
 * @param options  Optional React Query settings (e.g., enabled, onSuccess, etc.)
 */
export function useUserManagementPlans(
	options?: UseQueryOptions<
		ManagementPlanDto[], // Data type
		Error, // Error type
		ManagementPlanDto[], // Select type
		typeof USER_MANAGEMENT_PLANS_QUERY_KEY
	>
) {
	return useQuery({
		queryKey: USER_MANAGEMENT_PLANS_QUERY_KEY,
		queryFn: getUserManagementPlans,

		retry: 1,
		...options
	});
}
