import { fetchClient } from '@/lib/client';
import { AdHocDeclareDto } from './getAdHocDeclare';

export type CreateAdHocDeclareRequest = {
	hasAgreedWithStatements: boolean;
	answers: {
		categoryId: number;
		otherCategory: string | null;
		conflictDescription: string;
	}[];
};

export async function createAdHocDeclare(userId: number, data: CreateAdHocDeclareRequest): Promise<AdHocDeclareDto> {
	const response = await fetchClient(`/adhoc-declarations/declare/${userId}`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error(await response.json());
	}

	return await response.json();
}
