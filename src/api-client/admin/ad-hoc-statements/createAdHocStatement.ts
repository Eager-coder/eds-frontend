import { fetchClient } from '@/lib/client';

export type CreateAdHocStatementRequest = {
	description: {
		en: string;
		ru: string;
		kz: string;
	};
};

export async function creaetAdHocStatement(data: CreateAdHocStatementRequest) {
	const response = await fetchClient('/adhoc-declarations/agreement-statements', {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error(await response.json());
	}
	return await response.json();
}
