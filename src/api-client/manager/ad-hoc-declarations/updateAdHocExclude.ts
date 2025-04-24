import { AdHocDeclareDto, AdHocStatus } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclare';
import { fetchClient } from '@/lib/client';

export async function updateAdHocExclude(
	id: number,
	data: {
		isConfirmed: boolean;
		status: AdHocStatus;
	}
): Promise<AdHocDeclareDto> {
	const response = await fetchClient(`/adhoc-declarations/exclude/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
}
