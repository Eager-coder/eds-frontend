import { fetchClient } from '@/lib/client';

export async function deleteAdHocStatement(id: number) {
	await fetchClient(`/adhoc-declarations/agreement-statements/${id}`, {
		method: 'DELETE'
	});
}
