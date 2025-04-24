import { fetchClient } from '@/lib/client';
import { AdHocDeclareDto } from './getAdHocDeclare';
import { useQuery } from '@tanstack/react-query';

export const getAdHocDeclares = async (userId: number): Promise<AdHocDeclareDto[]> => {
	const response = await fetchClient(`/adhoc-declarations/declare/${userId}`);
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
};

export const adHocDeclaresKeys = {
	all: ['adHocDeclares'] as const,
	list: (userId: number) => [...adHocDeclaresKeys.all, userId] as const
};

export function useGetAdHocDeclares(userId?: number) {
	return useQuery({
		queryKey: adHocDeclaresKeys.list(userId || 0),
		queryFn: () => getAdHocDeclares(userId!),
		enabled: !!userId
	});
}
