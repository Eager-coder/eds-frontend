import { client, fetchClient } from '@/lib/client';

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

export async function getUsers(): Promise<GetUsersResponse> {
	const response = await fetchClient('/users');
	return await response.json();
}
