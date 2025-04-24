// src/hooks/useManagementActions.ts

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchClient } from '@/lib/client';

export type ManagementActionDto = {
	id: number;
	description: {
		kz: string;
		ru: string;
		en: string;
	};
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};

export async function getManagementActions(): Promise<ManagementActionDto[]> {
	const response = await fetchClient('/management-plans/actions');
	if (!response.ok) {
		throw new Error('Failed to fetch management actions');
	}
	return response.json();
}

// stable query key
export const MANAGEMENT_ACTIONS_QUERY_KEY = ['managementActions'] as const;

/**
 * Hook to fetch all management actions.
 *
 * @param options  optional React Query options you can override (e.g. enabled, onSuccess, etc.)
 */
export function useGetManagementActions(
	options?: UseQueryOptions<
		ManagementActionDto[], // data
		Error, // error
		ManagementActionDto[], // select
		typeof MANAGEMENT_ACTIONS_QUERY_KEY
	>
) {
	return useQuery({
		queryKey: MANAGEMENT_ACTIONS_QUERY_KEY,
		queryFn: getManagementActions,
		retry: 1,
		...options
	});
}
