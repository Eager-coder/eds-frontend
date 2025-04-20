'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserProfile } from '@/api-client/profile/getUserProfile';
import { useRouter } from 'next/navigation';

type UserProfileType = {
	id: number;
	email: string;
	lastname: string;
	firstname: string;
	middlename: string | null;
	role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'MANAGER';
	position: string;
	department: string;
	isActive: boolean;
	isDeleted: boolean;
	registrationDate: string;
};

type UserContextType = {
	user: UserProfileType | null;
	isLoading: boolean;
	setUser: (user: UserProfileType | null) => void;
	logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserProfileType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await getUserProfile();
				setUser(response.data);
			} catch (error) {
				console.error('Failed to fetch user profile:', error);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	const logout = () => {
		setUser(null);
		localStorage.removeItem('access_token');
		router.push('/login');
	};

	return <UserContext.Provider value={{ user, isLoading, setUser, logout }}>{children}</UserContext.Provider>;
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
}
