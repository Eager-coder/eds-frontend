import { client } from '@/lib/client';
import { GetInitialDeclarationsResponse } from './getInitialDeclarations';

export type CreateInitialDeclarationRequest = {
	name: string;
	isActive: boolean;
};

export const createInitialDeclaration = async (data: CreateInitialDeclarationRequest) => {
	const response = await client.post('/initial-declarations', data);
	return response.data as GetInitialDeclarationsResponse;
};
