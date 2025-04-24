import { fetchClient } from '@/lib/client';
import { ManagementActionDto } from './getManagementActions';

export const createManagementAction = async (data: {
	description: {
		en: string;
		ru: string;
		kz: string;
	};
}): Promise<ManagementActionDto> => {
	const response = await fetchClient('/management-plans/actions', {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error('Something went wrong', await response.json());
	}
	return await response.json();
};
