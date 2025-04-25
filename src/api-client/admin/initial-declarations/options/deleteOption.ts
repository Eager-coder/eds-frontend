import { fetchClient } from '@/lib/client';

export const deleteOption = async (id: number) => {
	// F
	const response = await fetchClient(`/initial-declarations/options/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}

	return await response.json();
};
