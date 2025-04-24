import { DeclarationUserDto } from '@/api-client/manager/getUserInitialDeclarations';
import { AdHocExcludeDto } from '@/api-client/user/ad-hoc-declarations/createAdHocExclude';
import { fetchClient } from '@/lib/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const getAllAdHocExcludes = async (): Promise<AdHocExcludeDto[]> => {
	//TODO
	const response = await fetchClient(`/adhoc-declarations/exclude`);
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
};

export function useGetAllAdHocExcludes(options?: Partial<UseQueryOptions<AdHocExcludeDto[], Error>>) {
	return useQuery<AdHocExcludeDto[], Error>({
		queryKey: ['AlladHocExcludes'],
		queryFn: () => getAllAdHocExcludes(),
		...options
	});
}
