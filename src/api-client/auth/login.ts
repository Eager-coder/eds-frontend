'use client';

import axios from 'axios';

export type LoginRequestDto = {
	email: string;
	password: string;
};

export type LoginResponseDto = {
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

export async function loginUser(user: LoginRequestDto): Promise<LoginResponseDto> {
	const response = await axios.post<LoginResponseDto>(process.env.NEXT_PUBLIC_API_URL + '/auth/authenticate', user);

	return response.data;
}
