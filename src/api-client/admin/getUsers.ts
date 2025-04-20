import { client } from '@/lib/client';

export type GetUsersResponse = {
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

export async function getUsers() {
	const response = await client.get<GetUsersResponse[]>('/users');
	return response.data;
}
