// src/hooks/useManagementActions.ts

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchClient } from '@/lib/client';

export type AdHocCategoryDto = {
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

export async function getAdHocCategories(): Promise<AdHocCategoryDto[]> {
	const response = await fetchClient('/adhoc-declarations/categories');
	if (!response.ok) {
		throw new Error('Failed to fetch ad hoc categories');
	}
	return response.json();
}

export const AD_HOC_CATEGORIES = ['AD_HOC_CATEGORIES'] as const;

export function useGetAdHocCategories(
	options?: UseQueryOptions<AdHocCategoryDto[], Error, AdHocCategoryDto[], typeof AD_HOC_CATEGORIES>
) {
	return useQuery({
		queryKey: AD_HOC_CATEGORIES,
		queryFn: getAdHocCategories,

		...options
	});
}
