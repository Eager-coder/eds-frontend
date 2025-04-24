import { fetchClient } from '@/lib/client';

export async function deleteManagementAction(id: number) {
	await fetchClient(`/management-plans/actions/${id}`, { method: 'DELETE' });
}
