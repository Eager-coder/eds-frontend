import { fetchClient } from '@/lib/client';

export const activateInitialDeclaration = async (id: number) => {
	const response = await fetchClient(`/initial-declarations/${id}/activate`, {
		method: 'PATCH'
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
};
