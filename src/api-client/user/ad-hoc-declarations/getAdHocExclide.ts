import { AdHocExcludeDto } from './createAdHocExclude';
import { fetchClient } from '@/lib/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const getAdHocExclude = async (id: number): Promise<AdHocExcludeDto> => {
	//TODO
	const response = await fetchClient(`/adhoc-declarations/exclude/${id}`);
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
};

/**
 * Hook to fetch ad-hoc exclusion declaration
 * @param id
 * @param options optional React Query options
 */
export function useGetAdHocExclude(id: number, options?: UseQueryOptions<AdHocExcludeDto, Error>) {
	return useQuery<AdHocExcludeDto, Error>({
		queryKey: ['adHocExclude', id],
		queryFn: () => getAdHocExclude(id),
		enabled: Boolean(id),
		...options
	});
}
