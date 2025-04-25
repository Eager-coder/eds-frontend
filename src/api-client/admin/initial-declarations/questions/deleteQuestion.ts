import { fetchClient } from '@/lib/client';

export const deleteDeclarationQuestion = async (id: number) => {
	const response = await fetchClient(`/initial-declarations/questions/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
};
