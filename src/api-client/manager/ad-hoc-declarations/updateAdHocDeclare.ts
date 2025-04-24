import { AdHocDeclareDto, AdHocStatus } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';
import { fetchClient } from '@/lib/client';

export async function updateAdHocDeclare(id: number, status: AdHocStatus): Promise<AdHocDeclareDto> {
	const response = await fetchClient(`/adhoc-declarations/declare/status/${id}?status=${status}`, {
		method: 'PATCH'
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
}
