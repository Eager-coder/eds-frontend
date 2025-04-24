import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchClient } from '@/lib/client';

export type AdHocStatementDto = {
	id: number;
	description: {
		kz: string;
		ru: string;
		en: string;
	};
	isDeleted: boolean;
};

export async function getAdHocStatements(): Promise<AdHocStatementDto[]> {
	const response = await fetchClient('/adhoc-declarations/agreement-statements');
	if (!response.ok) {
		throw new Error('Failed to fetch ad hoc statements');
	}
	return response.json();
}

export const AD_HOC_STATEMENTS = ['AD_HOC_STATEMENTS'] as const;

export function useGetAdHocStatements(
	options?: UseQueryOptions<AdHocStatementDto[], Error, AdHocStatementDto[], typeof AD_HOC_STATEMENTS>
) {
	return useQuery({
		queryKey: AD_HOC_STATEMENTS,
		queryFn: getAdHocStatements,
		staleTime: 1000 * 60 * 5,
		retry: 1,
		...options
	});
}
