import { fetchClient } from '@/lib/client';

export async function deleteAdHocCategory(id: number) {
	await fetchClient(`/adhoc-declarations/categories/${id}`, { method: 'DELETE' });
}
