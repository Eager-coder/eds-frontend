import { DeclarationUserDto } from '@/api-client/manager/getUserInitialDeclarations';
import { AdHocExcludeDto } from './createAdHocExclude';
import { fetchClient } from '@/lib/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const getAdHocExcludes = async (userId: number): Promise<AdHocExcludeDto[]> => {
	//TODO
	const response = await fetchClient(`/adhoc-declarations/exclude/user/${userId}`);
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
};

/**
 * Hook to fetch a user's ad-hoc exclusion declarations
 * @param userId the ID of the user
 * @param options optional React Query options
 */
export function useGetAdHocExcludes(userId?: number, options?: UseQueryOptions<AdHocExcludeDto[], Error>) {
	return useQuery<AdHocExcludeDto[], Error>({
		queryKey: ['adHocExcludes', userId],
		queryFn: () => getAdHocExcludes(userId!),
		enabled: Boolean(userId),
		...options
	});
}
