import { fetchClient } from '@/lib/client';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export const markNotificationAsRead = async ({
	notificationId,
	userEmail
}: {
	notificationId: number;
	userEmail: string;
}): Promise<void> => {
	const response = await fetchClient(
		`/api/v1/notifications/${notificationId}/read?userEmail=${encodeURIComponent(userEmail)}`,
		{ method: 'PATCH' }
	);
	if (!response.ok) {
		throw new Error(await response.text());
	}
};

export const useMarkNotificationAsRead = (
	options?: Omit<UseMutationOptions<void, Error, { notificationId: number; userEmail: string }>, 'mutationFn'>
) => {
	return useMutation<void, Error, { notificationId: number; userEmail: string }>({
		mutationFn: markNotificationAsRead,
		...options
	});
};
