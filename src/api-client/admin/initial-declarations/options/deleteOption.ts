import { fetchClient } from '@/lib/client';

export const deleteOption = async (id: number) => {
	const response = await fetchClient(`/initial-declarations/additional-options/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}

	return await response.json();
};
