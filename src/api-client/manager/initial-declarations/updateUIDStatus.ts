import { fetchClient } from '@/lib/client';
import { UIDStatus } from '../getUserInitialDeclarations';
import { UIDResponse } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';

export const updateUIDStatus = async (id: number, status: UIDStatus): Promise<UIDResponse> => {
	const response = await fetchClient(`/initial-declarations/answers/${id}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ status })
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
};
