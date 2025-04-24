import { fetchClient } from '@/lib/client';
import { AdHocCategoryDto } from './getAdHocCategories';

export const createAdHocCategory = async (data: {
	description: {
		en: string;
		ru: string;
		kz: string;
	};
}): Promise<AdHocCategoryDto> => {
	const response = await fetchClient('/adhoc-declarations/categories', {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error('Something went wrong', await response.json());
	}
	return await response.json();
};
