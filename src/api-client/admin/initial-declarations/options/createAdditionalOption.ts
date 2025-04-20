import { fetchClient } from '@/lib/client';

export type CreateAdditionalOptionRequest = {
	optionId: number;
	description: {
		en: string;
		ru: string;
		kz: string;
	};
	isRequired: boolean;
};

export const createAdditionalOption = async (data: CreateAdditionalOptionRequest) => {
	const response = await fetchClient('/initial-declarations/additional-options', {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error(await response.json());
	}
};
