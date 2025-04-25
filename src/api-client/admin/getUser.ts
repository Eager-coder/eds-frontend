// hooks/useUser.ts

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchClient } from '@/lib/client';
import { GetUsersResponse } from './getUsers';

/**
 * Fetch a single user by ID.
 */
export async function getUser(userId: number): Promise<GetUsersResponse> {
	const response = await fetchClient(`/users/${userId}`);
	return await response.json();
}

/**
 * Helper to build a stable query key for a single user.
 */
const userQueryKey = (userId: number) => ['user', userId] as const;

/**
 * useUser hook — wraps getUser in a TanStack Query useQuery call.
 *
 * @param userId  the ID of the user to fetch
 * @param options  optional React Query settings (e.g. enabled, onSuccess, etc.)
 */
export function useUser(
	userId: number,
	options?: UseQueryOptions<
		GetUsersResponse, // data type
		Error, // error type
		GetUsersResponse, // select type (same here)
		ReturnType<typeof userQueryKey>
	>
) {
	return useQuery({
		queryFn: () => getUser(userId),
		...options,
		queryKey: userQueryKey(userId)
	});
}
