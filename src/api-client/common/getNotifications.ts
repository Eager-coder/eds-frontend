import { fetchClient } from '@/lib/client';
import { DeclarationUserDto } from '../manager/getUserInitialDeclarations';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export type NotificationDto = {
	id: number;
	description: string;
	receiver: DeclarationUserDto;
	creationDate: string;
	isRead: boolean;
	unreadCount: number;
};

export const getNotifications = async (email: string): Promise<NotificationDto[]> => {
	const response = await fetchClient(`/notifications/user/${email}`);
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return response.json();
};

/**
 * Custom hook to fetch notifications for a given user email using TanStack Query v5.
 *
 * @param email - User's email address
 * @param options - Optional TanStack Query configuration (excluding queryKey and queryFn)
 * @returns React Query result containing notifications
 */
export const useGetNotifications = (
	email?: string,
	options?: Omit<
		UseQueryOptions<NotificationDto[], Error, NotificationDto[], ['notifications', string]>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<NotificationDto[], Error, NotificationDto[], ['notifications', string]>({
		queryKey: ['notifications', email || 'no-email'],
		queryFn: email ? () => getNotifications(email) : undefined,
		enabled: Boolean(email),
		...options
	});
};
