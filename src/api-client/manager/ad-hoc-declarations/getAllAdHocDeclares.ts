import { AdHocDeclareDto } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';
import { fetchClient } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';

export const getAllAdHocDeclares = async (): Promise<AdHocDeclareDto[]> => {
	const response = await fetchClient(`/adhoc-declarations/declare`);
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
};

export const allAdHocDeclaresKeys = ['allAdHocDeclaresKeys'];

export function useGetAllAdHocDeclares(enabled: boolean) {
	return useQuery({
		queryKey: allAdHocDeclaresKeys,
		queryFn: getAllAdHocDeclares,
		enabled: enabled
	});
}
