'use client';

import axios from 'axios';

export type RegisterRequestDto = {
	email: string;
	password: string;
	lastname: string;
	firstname: string;
	middlename?: string;
	role: 'USER';
	position: string;
	department: string;
};

export type RegisterResponseDto = {
	access_token: string;
	refresh_token: string;
	user: {
		id: number;
		email: string;
		lastname: string;
		firstname: string;
		middlename: string | null;
		role: 'USER' | 'MANAGER' | 'ADMIN';
		position: string;
		department: string;
		isActive: boolean;
		isDeleted: null;
		registrationDate: string;
	};
};

export async function registerUser(user: RegisterRequestDto): Promise<RegisterResponseDto> {
	const response = await axios.post<RegisterResponseDto>(process.env.NEXT_PUBLIC_API_URL + '/auth/register', user);

	return response.data;
}
