import { client } from '@/lib/client';

export type GetInitialDeclarationsResponse = {
	id: number;
	name: string;
	creationDate: string;
	activationDate: string;
	isActive: boolean;
	isDeleted: boolean;
	createdBy: {
		id: number;
		email: string;
		lastname: string;
		firstname: string;
		middlename: string;
		role: string;
		position: string;
		department: string;
		isActive: boolean;
		isDeleted: boolean;
		registrationDate: string;
	};
};

export const getInitialDeclarations = async () => {
	const response = await client.get<GetInitialDeclarationsResponse[]>('/initial-declarations');
	return response.data;
};
