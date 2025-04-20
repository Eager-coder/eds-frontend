import { client } from '@/lib/client';

type UserProfileResponse = {
	id: number;
	email: string;
	lastname: string;
	firstname: string;
	middlename: string | null;
	role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
	position: string;
	department: string;
	isActive: boolean;
	isDeleted: boolean;
	registrationDate: string;
};

export async function getUserProfile() {
	return await client.get<UserProfileResponse>('/user/profile');
}
